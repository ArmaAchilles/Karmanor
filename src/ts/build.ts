import * as fs from 'fs-extra';
import * as _ from 'lodash';

import File from './file';
import { events } from './flash';
import Game from './game';
import Settings from './settings';
import Zip from './zip';

export default class Build {
    public timeCreated: Date;
    public timeFinished?: Date;
    public status: EBuildStatus;

    private zipPath: string;
    private commitHash: string;
    private commitName: string;

    constructor(zipPath: string, commitHash: string, commitName: string) {
        this.zipPath = zipPath;
        this.commitHash = commitHash;
        this.commitName = commitName;

        this.status = EBuildStatus.pending;
        this.timeCreated = new Date();
    }

    public async start(): Promise<EBuildStatus> {
        try {
            const gameSettings = Game.getIGame();

            events.$emit('build-started', this);

            const unpackedDirectory =
                await Zip.unpack(this.zipPath, File.directoryFromFilepath(gameSettings.executablePath));

            events.$emit('zip-extracted');

            Zip.remove(this.zipPath);

            const game = new Game(gameSettings, unpackedDirectory);

            game.start();

            await game.close();

            const rptPath = game.latestRpt();
            const status = await game.readRpt(rptPath);

            fs.removeSync(unpackedDirectory);

            this.setStatus(status);

            await this.saveFromRpt(rptPath);

            return Promise.resolve(status);
        } catch (error) {
            this.errorBuild();

            return Promise.reject(error);
        }
    }

    public lastBuildStatus(): EBuildStatus | undefined {
        const builds = Settings.get('builds');

        if (! builds) { return undefined; }

        const lastBuild = _.last(builds.value);

        if (! lastBuild) { return undefined; }

        return lastBuild.status;
    }

    public didLastBuildFail(): boolean {
        return (
            this.lastBuildStatus() === EBuildStatus.failed ||
            this.lastBuildStatus() === EBuildStatus.stillFailing
        );
    }

    private setStatus(status: EBuildStatus) {
        // If build is still failing
        if (this.didLastBuildFail() && status === EBuildStatus.failed) {
            status = EBuildStatus.stillFailing;
        }

        this.status = status;
        this.timeFinished = new Date();

        events.$emit('build-finished', this);
    }

    private async saveFromRpt(rptPath: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line: variable-name
            fs.readFile(rptPath, (_error, rptBuffer) => {
                this.save(rptBuffer).then(didSave => resolve(didSave)).catch(error => reject(error));
            });
        });
    }

    private save(rptBuffer?: Buffer): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const builds = Settings.get('builds');

            const data = {
                gitHash: this.commitHash,
                id: builds.value ? builds.value.length + 1 : 1,
                name: this.commitName,
                rpt: rptBuffer ? rptBuffer.toString() : '',
                status: this.status,
                timeCreated: this.timeCreated,
                timeFinished: this.timeFinished || new Date(),
            };

            if (builds.value) {
                builds.value.push(data);
            } else {
                builds.value = [data];
            }

            Settings.set('builds', builds.value).then(saved => resolve(saved))
                .catch(err => reject(err));
        });
    }

    private errorBuild() {
        this.status = EBuildStatus.broken;
        this.save();
    }
}

export interface IBuild {
    gitHash: string;
    id: number;
    name: string;
    rpt: string;
    status: EBuildStatus;
    timeCreated: Date;
    timeFinished: Date;
}

export enum EBuildStatus {
    broken,
    canceled,
    failed,
    fixed,
    passed,
    pending,
    stillFailing,
}

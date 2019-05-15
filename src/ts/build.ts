import * as fs from 'fs';
import * as _ from 'lodash';

import File from './file';
import { events } from './flash';
import Game from './game';
import Settings from './settings';
import Zip, { IZip } from './zip';

export default class Build {
    public timeCreated: Date;
    public timeFinished?: Date;
    private status: EBuildStatus;

    private zip: IZip;

    constructor(zip: IZip) {
        this.zip = zip;
        this.status = EBuildStatus.pending;
        this.timeCreated = new Date();
    }

    public async start() {
        const gameSettings = Game.getIGame();

        events.$emit('build-started', this);

        const unpackedDirectory =
            await Zip.unpack(this.zip.path, File.directoryFromFilepath(gameSettings.executablePath));

        events.$emit('zip-extracted');

        Zip.remove(this.zip.path);

        const game = new Game(gameSettings, unpackedDirectory);

        game.start();

        const reportedStatus = await game.readRpt();

        game.close();

        fs.rmdirSync(unpackedDirectory);

        this.setStatus(reportedStatus);

        this.save();
    }

    public getStatus(): EBuildStatus {
        return this.status;
    }

    private lastBuildStatus(): EBuildStatus | undefined {
        const builds = Settings.get('builds');

        if (! builds) { return undefined; }

        const lastBuild = _.last(builds.value);

        if (! lastBuild) { return undefined; }

        return lastBuild.status;
    }

    private didLastBuildFail(): boolean {
        return (
            this.lastBuildStatus() === EBuildStatus.failed ||
            this.lastBuildStatus() === EBuildStatus.stillFailing
        );
    }

    private setStatus(reportedStatus: EBuildStatus) {
        let status = reportedStatus;

        // If build is still failing
        if (this.didLastBuildFail() && (
            reportedStatus === EBuildStatus.failed ||
            reportedStatus === EBuildStatus.stillFailing)
            ) {
                status = EBuildStatus.stillFailing;
        }

        this.status = status;
        this.timeFinished = new Date();

        events.$emit('build-finished', this);
    }

    private async save() {
        const builds = Settings.get('builds');

        if (builds.value) {
            builds.value.push(this);
            await Settings.set('builds', builds.value);
        }
    }
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

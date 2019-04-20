import * as fs from 'fs';
import * as _ from 'lodash';

import File from './file';
import { events } from './flash';
import Game from './game';
import Saved from './saved';
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
        events.$emit('build-started', this);

        const unpackedDirectory =
            await Zip.unpack(this.zip.path, File.directoryFromFilepath(Saved.game.executable));

        events.$emit('zip-extracted');

        Zip.remove(this.zip.path);

        const game = new Game(Saved.game, unpackedDirectory);

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
        const lastBuild = _.last(Saved.builds);

        if (! lastBuild) { return; }

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

    private save() {
        const builds = Saved.builds;
        builds.push(this);
        Saved.builds = builds;
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

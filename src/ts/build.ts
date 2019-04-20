import * as _ from 'lodash';
import * as fs from 'fs';

import Zip, { IZip } from "./zip";
import File from "./file";
import { Saved } from "./settings";
import { events } from "./flash";
import Game from "./game";

export default class Build {
    private status: EBuildStatus;
    timeCreated: Date;
    timeFinished: Date;

    private zip: IZip;

    constructor(zip: IZip) {
        this.zip = zip;
    }

    async start() {
        this.status = EBuildStatus.pending;
        this.timeCreated = new Date();

        events.$emit('build-started', this);

        let unpackedDirectory =
            await Zip.unpack(this.zip.path, File.directoryFromFilepath(Saved.game.executable));

        events.$emit('zip-extracted');

        Zip.remove(this.zip.path);

        let game = new Game(Saved.game, unpackedDirectory);

        game.start();

        let reportedStatus = await game.readRpt();

        game.close();

        fs.rmdirSync(unpackedDirectory);

        this.setStatus(reportedStatus);

        this.save();
    }

    private lastBuildStatus(): EBuildStatus {
        return _.last(Saved.builds).status;
    }

    private didLastBuildFail(): boolean {
        return (
            this.lastBuildStatus() === EBuildStatus.failed ||
            this.lastBuildStatus() === EBuildStatus.stillFailing
        );
    }

    getStatus(): EBuildStatus {
        return this.status;
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
        let builds = Saved.builds;
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

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

        let unpackedDirectory =
            await Zip.unpack(this.zip.path, File.directoryFromFilepath(Saved.game.executable));

        events.$emit('zip-extracted');

        Zip.remove(this.zip.path);

        // TODO: Process arguments (unpackedDirectory and offer other variables in Settings view)
        let game = new Game(Saved.game);

        game.start();

        // TODO: Check if last build had also failed/errored
        let status = await game.readRpt();

        game.close();
    }

    save() {
        let builds = Saved.builds;
        builds.push(this);
        Saved.builds = builds;
    }
}

export enum EBuildStatus {
    pending,
    passed,
    fixed,
    broken,
    failed,
    stillFailing,
    canceled,
}

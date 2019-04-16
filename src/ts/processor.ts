import * as fs from 'fs';
import * as path from 'path';

import Zip, { IZip } from "./zip";
import { Saved } from "./settings";

import Game from "./game";
import File from "./file";

export default class Processor {
    requestToken: string;
    zip: IZip;

    constructor(accessToken: string, zip: IZip) {
        this.requestToken = accessToken;
        this.zip = zip;
    }

    async process() {
        if (this.isRequestValid()) {
            // TODO: Make dir without extension
            // TODO: check if filenameWithExtension works
            let newDirectory = path.join(File.directoryFromFilepath(Saved.game.executable), File.filenameWithExtension(this.zip.path));

            fs.mkdirSync(newDirectory);

            await Zip.unpack(this.zip.path, newDirectory);
        } else {
            Zip.remove(this.zip.path);
        }
    }

    isRequestValid(): boolean {
        if (this.requestToken === Saved.accessToken) {
            return true;
        }

        return false;
    }
}

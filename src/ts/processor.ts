import * as fs from 'fs';
import * as path from 'path';

import Zip, { IZip } from "./zip";
import { Saved } from "./settings";

import Game from "./game";
import File from "./file";
import { events } from './flash';

export default class Processor {
    requestToken: string;
    zip: IZip;

    constructor(accessToken: string, zip: IZip) {
        this.requestToken = accessToken;
        this.zip = zip;
    }

    async process() {
        if (this.isRequestValid()) {
            let unpackedDirectory =
                await Zip.unpack(this.zip.path, File.directoryFromFilepath(Saved.game.executable));

            events.$emit('zip-extracted');

            Zip.remove(this.zip.path);
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

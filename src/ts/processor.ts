import { IZip } from "./server";
import { Saved } from "./settings";

import * as fs from 'fs';

import * as extract from 'extract-zip';
import Game from "./game";

export default class Processor {
    requestToken: string;
    zip: IZip;

    constructor(accessToken: string, zip: IZip) {
        this.requestToken = accessToken;
        this.zip = zip;
    }

    process() {
        if (this.isRequestValid()) {
            this.unpackZip();
        } else {
            this.removeZip();
        }
    }

    isRequestValid(): boolean {
        if (this.requestToken === Saved.accessToken) {
            return true;
        }

        return false;
    }

    removeZip() {
        fs.unlink(this.zip.path, () => {});
    }

    unpackZip() {
        extract(this.zip.path, {
            dir: Game.path(Saved.game.executable),
        }, () => {});
    }
}

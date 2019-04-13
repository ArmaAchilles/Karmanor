import Zip, { IZip } from "./zip";
import { Saved } from "./settings";

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
            Zip.unpack(this.zip.path, Game.path());
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

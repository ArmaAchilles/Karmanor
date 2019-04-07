import { IZip } from "./server";
import Settings from "./settings";

export default class Processor {
    requestToken: string;
    zip: IZip;

    constructor(accessToken: string, zip: IZip) {
        this.requestToken = accessToken;
        this.zip = zip;
    }

    isRequestValid(): boolean {
        if (this.requestToken === this.accessToken) {
            return true;
        }

        return false;
    }

    saveFile() {

    }

    get accessToken(): string {
        return Settings.get('server-settings.accessToken');
    }
}

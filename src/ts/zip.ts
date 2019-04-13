import * as fs from 'fs';
import * as extract from 'extract-zip';

export default class Zip {
    static remove(path: string) {
        fs.unlinkSync(path);
    }

    static unpack(path: string, whereTo: string, callback?: (error: Error) => {}) {
        extract(path, {
            dir: whereTo,
        }, callback);
    }
}

export interface IZip {
    fieldName: string,
    headers: {
        'content-disposition': string,
        'content-type': string,
    },
    originalFilename: string,
    path: string,
    size: number,
}

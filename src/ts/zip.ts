import * as fs from 'fs';
import * as extract from 'extract-zip';
import * as Path from 'path';
import File from './file';

export default class Zip {
    static remove(path: string) {
        fs.unlinkSync(path);
    }

    static unpack(path: string, whereTo: string, callback = (_error: Error) => {}) {
        extract(path, {
            dir: this.unpackDirectory(path, whereTo),
        }, callback);
    }

    static unpackDirectory(path: string, whereTo: string): string {
        return `${whereTo}${Path.sep}${File.filenameWithExtension(path)}`;
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

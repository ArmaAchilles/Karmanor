import * as extract from 'extract-zip';
import * as fs from 'fs';
import * as path from 'path';
import File from './file';

export default class Zip {
    public static remove(filepath: string) {
        fs.unlinkSync(filepath);
    }

    public static unpack(zipFilepath: string, extractDir: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const unpackDirectory = this.unpackDirectory(zipFilepath, extractDir);

            extract(zipFilepath, {
                dir: unpackDirectory,
            }, (error: Error | undefined) => {
                if (error) { reject(error); }
                resolve(unpackDirectory);
            });
        });
    }

    public static unpackDirectory(zipFilepath: string, extractDir: string): string {
        return path.join(extractDir, File.filenameWithoutExtension(zipFilepath));
    }
}

export interface IZip {
    fieldName: string;
    headers: {
        'content-disposition': string,
        'content-type': string,
    };
    originalFilename: string;
    path: string;
    size: number;
}

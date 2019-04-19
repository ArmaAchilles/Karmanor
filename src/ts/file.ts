import * as path from 'path';
import * as _ from 'lodash';

export default class File {
    static filenameWithExtension(filepath: string): string {
        return _.last(filepath.split(path.sep));
    }

    static filenameWithoutExtension(filepath: string): string {
        return path.parse(filepath).name;
    }

    static directoryFromFilepath(filepath: string): string {
        return _.join(path.join(filepath, '../').split(path.sep), path.sep);
    }

    static base64ToBlob(base64: string, mime: string): Blob {
        let byteString = atob(base64);

        let intArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([intArray], { type: mime });
    }
}

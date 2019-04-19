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
}

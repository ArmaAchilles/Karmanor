import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

export default class File {
    public static filenameWithExtension(filepath: string): string {
        return path.parse(filepath).base;
    }

    public static filenameWithoutExtension(filepath: string): string {
        return path.parse(filepath).name;
    }

    public static directoryFromFilepath(filepath: string): string {
        return _.join(path.join(filepath, '../').split(path.sep), path.sep);
    }

    public static getLatestFile(directory: string): string {
        const files = fs.readdirSync(directory);

        const modificationTimes: { difference: number, filePath: string }[] = [];

        files.forEach(file => {
            const filePath = path.join(directory, file);

            const dateCreated = fs.statSync(filePath).ctime;

            const difference = new Date().getTime() - dateCreated.getTime();

            modificationTimes.push({
                difference, filePath,
            });
        });

        return _.sortBy(modificationTimes, ['difference'])[0].filePath;
    }

    public static isDirectory(possibleDirectory: string): boolean {
        return fs.lstatSync(possibleDirectory).isDirectory();
    }

    public static getAllDirectories(directory: string): string[] {
        return fs.readdirSync(directory).map(name => path.join(directory, name)).filter(this.isDirectory);
    }
}

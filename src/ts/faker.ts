import * as faker from 'faker';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';

import File from './file';

const JSZip = require('jszip');

export default class Faker {
    public static createRpt(directory?: string): string {
        const date = new Date();

        if (! directory) {
            directory = this.createTempDirectory();
        }

        const yearMonthDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
        const hourMinutesDay = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        const rptName = `arma3_x64_${yearMonthDay}_${hourMinutesDay}.rpt`;

        const rptPath = path.join(directory, rptName);

        // Example: /tmp/someHash/arma3_x64_2019-03-10_22-16-36.rpt
        fs.writeFileSync(rptPath,
            `Karmanor: Generated fake RPT file at ${date.toISOString()}.\n`,
        );

        return rptPath;
    }

    public static createTempDirectory(): string {
        const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'karmanor'));

        return tempDirectory;
    }

    public static file(extension: string, whereTo?: string): string {
        const directory = this.createTempDirectory();

        const fileName = `${this.slug()}.${extension}`;

        const filePath = path.join(directory, fileName);

        fs.writeFileSync(filePath, faker.lorem.paragraphs());

        if (whereTo) {
            const newFilePath = path.join(whereTo, fileName);

            fs.renameSync(filePath, newFilePath);

            return newFilePath;
        }

        return filePath;
    }

    public static slug(): string {
        return faker.lorem.slug();
    }

    public static writeToRpt(filepath: string, timesToWrite = 5, delayInSeconds: number = 1) {
        let writtenTimes = 0;

        while (writtenTimes < timesToWrite) {
            writtenTimes++;

            setTimeout(() => {
                File.appendToFile(filepath, faker.lorem.sentence());
            }, delayInSeconds * 1000);
        }
    }

    public static zip(whereTo?: string): Promise<string> {
        return new Promise(resolve => {
            const zip = new JSZip();

            const directory = whereTo ? whereTo : this.createTempDirectory();

            const zipPath = path.join(directory, 'output.zip');

            zip.file(`${this.slug()}.txt`, faker.lorem.paragraphs());

            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                .pipe(fs.createWriteStream(zipPath))
                .on('finish', () => {
                    resolve(zipPath);
                });
        });
    }
}

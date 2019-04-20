import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as faker from 'faker';
import * as _ from 'lodash';
import * as JSZip from 'jszip';

import Game from "./game";

export default class Faker {
    game: Game;

    createRpt(): string {
        let date = new Date();

        let directory = this.createTempDirectory();

        let yearMonthDay = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
        let hourMinutesDay = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
        let rptName = `arma3_x64_${yearMonthDay}_${hourMinutesDay}.rpt`;

        let rptPath = path.join(directory, rptName);

        // e.g. /tmp/someHash/arma3_x64_2019-03-10_22-16-36.rpt
        fs.writeFileSync(rptPath,
            `Karmanor: Generated fake RPT file at ${date.toISOString()}.`
        );

        return rptPath;
    }

    private writeRpt(path: string, data: string, callback?: () => {}) {
        fs.writeFile(path, data, callback);
    }

    writeToRpt(path: string, timesToWrite?: 15) {
        let writtenTimes = 0;

        while (writtenTimes < timesToWrite) {
            writtenTimes++;

            setTimeout(() => {
                this.writeRpt(path, faker.lorem.sentence());
            }, (_.random(3, 12) * 1000));
        }
    }

    file(extension: string, whereTo?: string): string {
        let directory = this.createTempDirectory();

        let fileName = `${this.slug()}.${extension}`;

        let filePath = path.join(directory, fileName);

        fs.writeFileSync(filePath, faker.lorem.paragraphs());

        if (whereTo) {
            let newFilePath = path.join(whereTo, fileName);

            fs.renameSync(filePath, newFilePath)

            return newFilePath;
        }

        return filePath;
    }

    createTempDirectory(): string {
        let tempDirectory = fs.mkdtempSync('karmanor');

        let directory = path.join(os.tmpdir(), tempDirectory);

        fs.renameSync(tempDirectory, directory);

        return directory;
    }

    zip(whereTo?: string): Promise<string> {
        return new Promise(resolve => {
            let zip = new JSZip();

            let directory = whereTo ? whereTo : this.createTempDirectory();

            let zipPath = path.join(directory, 'output.zip');

            zip.file(`${this.slug()}.txt`, faker.lorem.paragraphs());

            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                .pipe(fs.createWriteStream(zipPath))
                .on('finish', () => {
                    resolve(zipPath);
                });
        });
    }

    slug(): string {
        return faker.lorem.slug();
    }
}

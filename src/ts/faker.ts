import * as fs from 'fs';
import * as path from 'path';
import * as faker from 'faker';
import * as _ from 'lodash';

import Game from "./game";

export default class Faker {
    game: Game;

    launchGame() {
        new Game({
            executable: 'cat',
            parameters: '',
            rpt: this.createRpt(),
        });
    }

    createRpt(): string {
        let date = new Date();

        let directory = fs.mkdtempSync('karmanor');

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
        let directory = fs.mkdtempSync('karmanor');

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

    zip(path?: string): string {
        return this.file('zip', path);
    }

    slug(): string {
        return faker.lorem.slug();
    }
}

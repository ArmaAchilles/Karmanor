import * as path from 'path';
import * as fs from 'fs';

import * as _ from 'lodash';

import { Tail } from 'tail';

import { spawn, ChildProcess } from 'child_process';
import { Saved } from './settings';

export default class Game implements IGame {
    executable: string;
    parameters: string;
    rpt: string;

    private process: ChildProcess;
    exitCode: number = -1;

    constructor(data: IGame) {
        this.executable = data.executable;
        this.parameters = data.parameters;
        this.rpt = data.rpt;
    }

    static path(executable = Saved.game.executable): string {
        return _.last(path.join(executable, '../').split(path.sep));
    }

    get latestRpt(): string {
        return getLatestFile(this.rpt);
    }

    start() {
        this.process = spawn(this.executable, [this.parameters]);

        this.process.on('close', exitCode => {
            this.exitCode = exitCode;

            this.process = null;
        });
    }

    close() {
        // If process has already exited
        if (this.exitCode !== -1) return;

        this.process.kill();
    }

    readRpt() {
        let tail = new Tail(this.latestRpt);

        tail.on('line', text => {
            if (text.includes('Karmanor: Build failed.')) {
                tail.unwatch();
            }

            // Arma 3 closes
            if (text.includes('Shutdown normally')) {
                tail.unwatch();
            }
        });

        // 15 minutes timeout if something went wrong
        setTimeout(() => {
            if (tail !== undefined) {
                tail.unwatch();
            }
        }, 15 * 1000 * 60)
    }
}

export interface IGame {
    executable: string,
    parameters: string,
    rpt: string,
}

export function getLatestFile(directory: string): string {
    let files = fs.readdirSync(directory);

    let modificationTimes: {filePath: string, difference: number}[];

    files.forEach(file => {
        let filePath = path.join(directory, file);

        let dateCreated = fs.statSync(filePath).ctime;

        let difference = new Date().getTime() - dateCreated.getTime()

        modificationTimes.push({
            filePath, difference,
        });
    });

    return _.sortBy(modificationTimes, ['difference'])[0].filePath;
}

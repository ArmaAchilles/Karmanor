import * as lineReader from 'line-reader';
import * as _ from 'lodash';

import { ChildProcess, spawn } from 'child_process';
import { EBuildStatus } from './build';
import File from './file';
import Settings from './settings';

const kill = require('tree-kill');

export default class Game implements IGame {
    public static getIGame(): IGame {
        return {
            executablePath: Settings.get('gameExecutablePath').value || '',
            parameters: Settings.get('gameParameters').value || '',
            rptDirectory: Settings.get('gameRptDirectory').value || '',
        };
    }

    public executablePath: string;
    public parameters: string;
    public rptDirectory: string;

    public exitCode: number = -1;
    public process?: ChildProcess;

    constructor(game: IGame, unpackedDirectory: string) {
        this.executablePath = game.executablePath;
        this.parameters = this.processArguments(game, unpackedDirectory);
        this.rptDirectory = game.rptDirectory;
    }

    public latestRpt(): string {
        return File.getLatestFile(this.rptDirectory);
    }

    public start() {
        this.process = spawn(this.executablePath, [this.parameters], {
            shell: true,
        });
    }

    public close(): Promise<void> {
        return new Promise(resolve => {
            // If process has already exited
            // tslint:disable-next-line: newline-before-return
            if (this.exitCode !== -1 || ! this.process) { resolve(); return; }

            this.process.on('close', exitCode => {
                this.exitCode = exitCode;

                this.process = undefined;

                resolve();
            });

            kill(this.process.pid);
        });
    }

    public readRpt(rptFilepath: string): Promise<EBuildStatus> {
        return new Promise(resolve => {
            lineReader.eachLine(rptFilepath, line => {
                if (line.includes('Karmanor: Build failed.')) {
                    resolve(EBuildStatus.failed);

                    return false;
                }

                if (line.includes('Karmanor: Build passed.')) {
                    resolve(EBuildStatus.passed);

                    return false;
                }

                // Arma 3 closes
                if (line.includes('Shutdown normally')) {
                    resolve(EBuildStatus.broken);

                    return false;
                }
            });

            // 10 minutes
            const timeToWait = 10 * 1000 * 60;

            // 10 minutes timeout if something went wrong
            setTimeout(() => {
                resolve(EBuildStatus.broken);
            }, timeToWait);
        });
    }

    /**
     * Converts argument string from settings to string with actual variable data.
     *
     * Available variables for usage in string:
     *  - `${executableDirectory}` Directory where the game executable is stored. `/some/dir/`
     *  - `${executableFile}` Full filepath to the game's executable. `/some/dir/arma3_x64.exe`
     *  - `${unpackedDirectory}` Directory where the ZIP was unpacked. `/some/dir/aRandomHash/`
     *
     * @param unpackedDirectory Path to the directory where the ZIP was extracted.
     */
    private processArguments(game: IGame, unpackedDirectory: string): string {
        let args = game.parameters;

        args = args.replace('${executableDirectory}', File.directoryFromFilepath(game.executablePath));
        args = args.replace('${executableFile}', game.executablePath);
        args = args.replace('${unpackedDirectory}', unpackedDirectory);

        return args;
    }
}

export interface IGame {
    executablePath: string;
    parameters: string;
    rptDirectory: string;
}

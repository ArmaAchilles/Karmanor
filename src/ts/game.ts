import * as _ from 'lodash';

import { ChildProcess, spawn } from 'child_process';
import { Tail } from 'tail';
import { EBuildStatus } from './build';
import File from './file';
import Settings from './settings';

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

    public get latestRpt(): string {
        return File.getLatestFile(this.rptDirectory);
    }

    public start() {
        this.process = spawn(this.executablePath, [this.parameters], {
            shell: true,
        });
    }

    public close() {
        // If process has already exited
        if (this.exitCode !== -1 || ! this.process) { return; }

        this.process.on('close', exitCode => {
            this.exitCode = exitCode;

            this.process = undefined;
        });

        this.process.kill();
    }

    public readRpt(): Promise<EBuildStatus> {
        return new Promise(resolve => {
            const tail = new Tail(this.latestRpt);

            tail.on('line', text => {
                if (text.includes('Karmanor: Build failed.')) {
                    tail.unwatch();

                    resolve(EBuildStatus.failed);
                }

                if (text.includes('Karmanor: Build passed.')) {
                    tail.unwatch();

                    resolve(EBuildStatus.passed);
                }

                // Arma 3 closes
                if (text.includes('Shutdown normally')) {
                    tail.unwatch();

                    resolve(EBuildStatus.broken);
                }
            });

            // 15 minutes
            const timeToWait = 15 * 1000 * 60;

            // 15 minutes timeout if something went wrong
            setTimeout(() => {
                if (tail !== undefined) {
                    tail.unwatch();

                    resolve(EBuildStatus.broken);
                }
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

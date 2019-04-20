import * as _ from 'lodash';

import { Tail } from 'tail';

import { spawn, ChildProcess } from 'child_process';
import { EBuildStatus } from './build';
import File from './file';
import { Saved } from './settings';

export default class Game implements IGame {
    executable: string;
    parameters: string;
    rpt: string;

    private process: ChildProcess;
    exitCode: number = -1;

    constructor(game: IGame, unpackedDirectory: string) {
        this.executable = game.executable;
        this.parameters = this.processArguments(unpackedDirectory);
        this.rpt = game.rpt;
    }

    get latestRpt(): string {
        return File.getLatestFile(this.rpt);
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

    readRpt(): Promise<EBuildStatus> {
        return new Promise(resolve => {
            let tail = new Tail(this.latestRpt);

            tail.on('line', text => {
                if (text.includes('Karmanor: Build failed.')) {
                    tail.unwatch();

                    resolve(EBuildStatus.failed)
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

            // 15 minutes timeout if something went wrong
            setTimeout(() => {
                if (tail !== undefined) {
                    tail.unwatch();

                    resolve(EBuildStatus.broken);
                }
            }, 15 * 1000 * 60)
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
    private processArguments(unpackedDirectory: string): string {
        let args = Saved.game.parameters;

        args.replace('${executableDirectory}', File.directoryFromFilepath(Saved.game.executable));
        args.replace('${executableFile}', Saved.game.executable);
        args.replace('${unpackedDirectory}', unpackedDirectory);

        return args;
    }
}

export interface IGame {
    executable: string,
    parameters: string,
    rpt: string,
}

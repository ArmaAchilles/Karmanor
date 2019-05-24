import * as fs from 'fs-extra';
import * as _ from 'lodash';
import * as os from 'os';
import * as path from 'path';
import Build from './build';
import Faker from './faker';

export default class Settings {
    /**
     * Returns `ISetting` for the given key from saved settings. Throws error if setting not found.
     * @param key Key from `ISettings` interface.
     * @returns `ISetting` for that given key.
     * @throws Error if key not found.
     */
    public static get<T extends keyof ISettings, K extends ISettings[T]>(key: T): K {
        const value = this.getValue(key);

        if (value) {
            return value as K;
        }

        throw new Error(`${key} is not defined.`);
    }

    /**
     * Returns all keys from saved settings.
     * @returns Array of `ISetting`.
     */
    public static getAll(): ISetting<any>[] {
        const settings = this.getFile();

        const filtered: ISetting<any>[] = [];

        _.forEach(settings, setting => {
            if (setting.editable) {
                filtered.push(setting);
            }
        });

        return filtered;
    }

    /**
     * Returns true if key exists in the saved JSON or false if it does not exist.
     * @param key Key from `ISettings` interface.
     * @returns Boolean if key is present.
     */
    public static has<T extends keyof ISettings>(key: T): boolean  {
        const setting = this.getValue(key);

        if (setting) {
            return true;
        }

        return false;
    }

    /**
     * Saves the selected setting's value to the file system in a JSON file.
     * @param key Key of `ISettings` interface.
     * @param value Value to set the setting to. Only allowed types are the ones from the given key.
     * @returns In `.then` returns boolean if setting was saved to the file system, in `.catch` returns error.
     */
    public static set<T extends keyof ISettings, K extends ISettings[T]['value']>(key: T, value: K): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const old = this.get(key);

            // If the data isn't the same then we write to fs
            if (! _.isEqual(old.value, value)) {
                old.value = value;
                this.write(key, old);

                // Did it update the filesystem settings?
                if (_.isEqual(this.get(key).value, value)) {
                    resolve(true);
                } else {
                    reject(new Error(`Failed to update settings for element ${old.beautifiedName}`));
                }
            } else {
                // The data didn't get updated because it is equal to the current one
                resolve(false);
            }
        });
    }

    /**
     * Removes the setting JSON file if present.
     */
    public static removeFile(): void {
        if (fs.existsSync(this.getFilePath())) {
            fs.unlinkSync(this.getFilePath());
        }
    }

    /**
     * Gets the path to the `settings.json` file (inclusive). Dependent on the OS.
     */
    public static getFilePath(): string {
        let userDataPath = '';

        switch (os.platform()) {
            case 'win32':
                userDataPath = path.join('%APPDATA%', 'karmanor');
                break;
            case 'darwin':
                userDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'karmanor');
                break;
            case 'linux':
                userDataPath = path.join(os.homedir(), '.config', 'karmanor');
                break;
        }

        return path.join(userDataPath, 'settings.json');
    }

    private static getFile(): ISettings {
        const jsonPath = this.getFilePath();

        if (fs.existsSync(jsonPath)) {
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

            if (! _.isEqual(data, {})) {
                return data;
            }
        }

        return this.initalize();
    }

    private static initalize(): ISettings {
        const downloadDirectory = path.join(this.getFilePath(), '..', 'ServerDownloads');

        if (! fs.existsSync(downloadDirectory)) {
            fs.mkdirsSync(downloadDirectory);
        }

        const data: ISettings = {
            accessToken: {
                beautifiedName: 'Access Token',
                editable: true,
                key: 'accessToken',
                value: Faker.slug(),
            },
            builds: {
                beautifiedName: 'Builds',
                editable: false,
                key: 'builds',
                value: [],
            },
            chartsHome: {
                beautifiedName: 'Home Charts',
                editable: false,
                key: 'chartsHome',
                value: {
                    connections: [0, 0, 0, 0, 0, 0, 0],
                    requests: [0, 0, 0, 0, 0, 0, 0],
                },
            },
            downloadDirectory: {
                beautifiedName: 'Download Directory',
                editable: true,
                key: 'downloadDirectory',
                value: downloadDirectory,
            },
            gameExecutablePath: {
                beautifiedName: 'Game Executable Path',
                editable: true,
                key: 'gameExecutablePath',
                value: '',
            },
            gameParameters: {
                beautifiedName: 'Game Arguments',
                editable: true,
                key: 'gameParameters',
                value: '',
            },
            gameRptDirectory: {
                beautifiedName: 'Game .rpt File Directory',
                editable: true,
                key: 'gameRptDirectory',
                value: '',
            },
            port: {
                beautifiedName: 'Port',
                editable: true,
                key: 'port',
                value: 8080,
            },
        };

        fs.writeFileSync(this.getFilePath(), JSON.stringify(data, undefined, 4));

        return data;
    }

    private static getValue<T extends keyof ISettings, K extends ISettings[T]>(key: T): K | undefined {
        const settings = this.getFile();

        if (settings) {
            if (settings[key]) {
                return settings[key] as K;
            }

            return undefined;
        }

        return undefined;
    }

    private static write<T extends keyof ISettings, K extends ISettings[T]>(key: T, value: K) {
        const settings = this.getFile() || {};

        settings[key] = value;

        fs.writeFileSync(this.getFilePath(), JSON.stringify(settings, undefined, 4));
    }
}

export interface ISetting<V> {
    beautifiedName: string;
    editable: boolean;
    key: keyof ISettings;
    value?: V;
}

export interface ISettings {
    accessToken: ISetting<string>;
    builds: ISetting<Build[]>;
    chartsHome: ISetting<IChartHome>;
    downloadDirectory: ISetting<string>;
    gameExecutablePath: ISetting<string>;
    gameParameters: ISetting<string>;
    gameRptDirectory: ISetting<string>;
    port: ISetting<number>;
}

export interface IChartHome {
    connections: [0, 0, 0, 0, 0, 0, 0];
    requests: [0, 0, 0, 0, 0, 0, 0];
}

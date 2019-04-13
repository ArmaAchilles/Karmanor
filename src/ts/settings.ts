import * as settings from 'electron-settings';

import * as _ from 'lodash';

export default class Settings {
    static get(keyPath: string, defaultValue?: any): any {
        return settings.get(keyPath, defaultValue);
    }

    static has(keyPath: string): boolean {
        return settings.has(keyPath);
    }

    static save(keyPath: string, data: any): Promise<{}> {
        return new Promise((resolve, reject) => {
            let oldData = this.get(keyPath, {});

            if (! _.isEqual(oldData, data)) {
                settings.set(keyPath, data);

                if (_.isEqual(this.get(keyPath), data)) {
                    resolve(true);
                } else {
                    reject('Something went wrong!');
                }
            } else {
                resolve(false);
            }
        });
    }
}

export class Saved {
    // Getters

    static get accessToken(): string {
        return Settings.get('server-settings.accessToken', '');
    }

    static get port(): string {
        return Settings.get('server-settings.port', '');
    }

    static get downloadDirectory(): string {
        return Settings.get('directories.downloadDirectory', '');
    }

    static get chartHome(): IChartHome {
        return Settings.get('chart-home', {});
    }

    static get game(): IGame {
        return Settings.get('game', {});
    }

    // Setters

    static set accessToken(accessToken) {
        Settings.save('server-settings.accessToken', accessToken);
    }

    static set port(port) {
        Settings.save('server-settings.port', port);
    }

    static set downloadDirectory(downloadDirectory) {
        Settings.save('directories.downloadDirectory', downloadDirectory);
    }

    static set chartHome(chartHome) {
        Settings.save('chart-home', chartHome);
    }

    static set game(game) {
        Settings.save('game', game);
    }
}

export interface IChartHome {
    connections: [0, 0, 0, 0, 0, 0, 0],
    requests: [0, 0, 0, 0, 0, 0, 0],
}

export interface IGame {
    executable: string,
}

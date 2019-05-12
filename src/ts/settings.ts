import * as settings from 'electron-settings';
import * as _ from 'lodash';

export default class Settings {
    public static get(keyPath: string, defaultValue?: any): any {
        const value = settings.get(keyPath, defaultValue);

        if (value) {
            return value;
        } else {
            return defaultValue;
        }
    }

    public static has(keyPath: string): boolean {
        return settings.has(keyPath);
    }

    public static save(keyPath: string, data: any): Promise<{}> {
        return new Promise((resolve, reject) => {
            const oldData = this.get(keyPath, {});

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

export interface IChartHome {
    connections: [0, 0, 0, 0, 0, 0, 0];
    requests: [0, 0, 0, 0, 0, 0, 0];
}

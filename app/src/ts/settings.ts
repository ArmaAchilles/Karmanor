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

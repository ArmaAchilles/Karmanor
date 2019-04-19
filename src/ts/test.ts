import * as fs from 'fs';
import * as assert from 'assert';

import axios from 'axios';
import Faker from './faker';
import Server from './server';
import { Saved } from './settings';
import { events } from './flash';
import Zip, { IZip } from './zip';
import File from './file';

export default class Test {
    private static generateBoundary(): string {
        let boundary = '--------------------------';
        for (let i = 0; i < 24; i++) {
            boundary += Math.floor(Math.random() * 10).toString(16);
        }

        return boundary;
    }

    static requests(fail?: false): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            try {
                let faker = new Faker();

                // Generate some zip file
                let zipPath = await faker.zip();

                // Start server if not started
                new Server(Saved.port).start().then(server => {
                    // Make POST request to itself with zip (if fail then provide a random token)
                    let address = `http://127.0.0.1:${Saved.port}`;

                    let zip = File.base64ToBlob(fs.readFileSync(zipPath).toString('base64'), 'application/zip');

                    let form = new FormData();

                    form.append('zip', zip);

                    form.append('accessToken', fail ? faker.slug() : Saved.accessToken);

                    axios.post(address, form, {
                        headers: {
                            'content-type': 'multipart/form-data; boundary=' + this.generateBoundary()
                        },
                    }).then(response => {
                        fail ? reject(fail) : assert.strictEqual(response.data, 200);
                    }).catch(error => {
                        fail ? resolve(true) : reject(error);
                    });

                    // If set to fail check that the zip got deleted
                    events.$on('server-data-rejected', (accessToken: string, zip: IZip) => {
                        assert.notStrictEqual(accessToken, Saved.accessToken);

                        // Need a delay because the file is removed in Processor after some time
                        setTimeout(() => {
                            assert.strictEqual(fs.existsSync(zip.path), false);
                        }, 4 * 1000);

                        server.stop();

                        resolve(true);
                    });

                    events.$on('server-data-received', (accessToken: string, zip: IZip) => {
                        // Race condition rename
                        fs.renameSync(zip.path, `${zip.path}.zip`);
                        zip.path = `${zip.path}.zip`;

                        assert.strictEqual(accessToken, Saved.accessToken);

                        events.$on('zip-extracted', () => {
                            assert.strictEqual(
                                fs.existsSync(
                                    Zip.unpackDirectory(zip.path, File.directoryFromFilepath(Saved.game.executable))
                                ),
                                true
                            );

                            server.stop();

                            resolve(true);
                        });
                    });

                    // Check if the game got launched with the right params

                    // Check if the RPT is getting read by providing bogus build failed texts

                    // Check for cleanup of zip

                    // Check that build failed
                });
            } catch (error) {
                if (! (error instanceof assert.AssertionError)) {
                    reject(error);
                }

                resolve(false);
            }
        });
    }
}

import * as fs from 'fs';
import * as assert from 'assert';

import axios from 'axios';
import Faker from './faker';
import Server from './server';
import { Saved } from './settings';
import { events, flash } from './flash';
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

    static requests(fail?: false): boolean {
        let didSucceed = true;

        try {
            let faker = new Faker();

            // Generate some zip file
            let zipPath = faker.zip();

            // Start server if not started
            new Server(Saved.port).start().then(server => {
                // Make POST request to itself with zip (if fail then provide a random token)
                let address = `http://127.0.0.1:${Saved.port}`;

                let zip = fs.readFileSync(zipPath);

                let form = new FormData();

                // @ts-ignore Buffer is compatible with Blob because it's the same data structure
                form.append('zip', new Blob(zip));

                form.append('accessToken', fail ? faker.slug() : Saved.accessToken);

                axios.post(address, form, {
                    headers: {
                        'content-type': 'multipart/form-data; boundary=' + this.generateBoundary()
                    },
                }).then(response => {
                    if (fail) {
                        assert.fail(response.data);
                    } else {
                        assert.strictEqual(response.data, 200);
                    }
                }).catch(error => {
                    if (fail) {
                        console.info(error);
                    } else {
                        assert.fail(error);
                    }
                });

                // If set to fail check that the zip got deleted
                events.$on('server-data-rejected', (accessToken: string, zip: IZip) => {
                    assert.notStrictEqual(accessToken, Saved.accessToken);

                    // Need a delay because the file is removed in Processor after some time
                    setTimeout(() => {
                        assert.strictEqual(fs.existsSync(zip.path), false);
                    }, 4 * 1000);

                    server.stop();
                });

                events.$on('server-data-received', (accessToken: string, zip: IZip) => {
                    assert.strictEqual(accessToken, Saved.accessToken);

                    // If fail is false then check that the zip got extracted
                    assert.strictEqual(
                        fs.existsSync(
                            Zip.unpackDirectory(zip.path, File.filenameWithExtension(Saved.game.executable))
                        ),
                        true
                    );

                    server.stop();
                });

                // Check if the game got launched with the right params

                // Check if the RPT is getting read by providing bogus build failed texts

                // Check for cleanup of zip

                // Check that build failed
            });
        } catch (error) {
            didSucceed = false;

            if (! (error instanceof assert.AssertionError)) {
                flash('Something went wrong during testing!', 'danger', true);
                throw error;
            }

            flash('The test failed!', 'danger', true);
        }

        if (didSucceed) flash('The test succeeded!');

        // Return true if all went well
        return didSucceed;
    }
}

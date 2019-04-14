import * as fs from 'fs';
import * as assert from 'assert';
import * as FormData from 'form-data';

import axios from 'axios';
import Faker from './faker';
import Server from './server';
import { Saved } from './settings';
import { events } from './flash';
import Zip, { IZip } from './zip';
import File from './file';

export default class Test {
    static requests(fail?: false): boolean {
        let didSucceed = true;

        try {
            let faker = new Faker();

            // Generate some zip file
            let zipPath = faker.zip();

            // Start server if not started
            let server = new Server(Saved.port);

            // Make POST request to itself with zip (if fail then provide a random token)
            let address = `127.0.0.1:${Saved.port}`;

            let zip = fs.readFileSync(zipPath);

            let form = new FormData();
            form.append('zip', zip, {
                filepath: zipPath,
                contentType: 'application/zip',
            });

            form.append('accessToken', fail ? faker.slug() : Saved.accessToken);

            axios.post(address, form, {
                headers: form.getHeaders(),
            }).then(response => {
                if (fail) {
                    assert.fail(response.data);
                } else {
                    assert.strictEqual(response.data, '200');
                }
            }).catch(error => {
                if (fail) {
                    console.info(error);
                } else {
                    assert.fail(error);
                }
            });

            // If set to fail check that the zip got deleted
            events.$once('server-data-rejected', (accessToken: string, zip: IZip) => {
                assert.notStrictEqual(accessToken, Saved.accessToken);

                assert.strictEqual(fs.existsSync(zip.path), false);
            });

            events.$once('server-data-recieved', (accessToken: string, zip: IZip) => {
                assert.strictEqual(accessToken, Saved.accessToken);

                // If fail is false then check that the zip got extracted
                assert.strictEqual(
                    fs.existsSync(
                        Zip.unpackDirectory(zip.path, File.filenameWithExtension(Saved.game.executable))
                    ),
                    true
                );
            });

            // Check if the game got launched with the right params

            // Check if the RPT is getting read by providing bogus build failed texts

            // Check for cleanup of zip

            // Check that build failed

            server.stop();
        } catch (error) {
            didSucceed = false;

            if (! (error instanceof assert.AssertionError)) {
                throw error;
            }
        }

        // Return true if all went well
        return didSucceed;
    }
}

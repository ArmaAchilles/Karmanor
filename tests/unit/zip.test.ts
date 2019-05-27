import * as fs from 'fs-extra';
import * as path from 'path';

import Faker from '../../src/ts/faker';
import File from '../../src/ts/file';
import Zip from '../../src/ts/zip';

describe('Zip.remove()', () => {
    test('File is removed from disk', async () => {
        const zip = await Faker.zip();

        expect(fs.existsSync(zip)).toBe(true);

        Zip.remove(zip);

        expect(fs.existsSync(zip)).toBe(false);
    });
});

describe('Zip.unpack()', () => {
    test('A zip file can be extracted', async () => {
        const zip = await Faker.zip();
        const extractDir = Faker.createTempDirectory();

        expect(fs.existsSync(zip)).toBe(true);

        expect(File.filenameWithoutExtension(zip)).toBe('output');

        const zipUnpacked = await Zip.unpack(zip, extractDir);

        expect(zipUnpacked).toBe(Zip.unpackDirectory(zip, extractDir));

        expect(fs.existsSync(zipUnpacked)).toBe(true);
        expect(File.isDirectory(zipUnpacked)).toBe(true);
    });

    test('If zip file fails to extract it rejects the Promise', async done => {
        Zip.unpack('sometemp', 'otherdir').catch((error: Error) => {
            expect(error.message.length).toBeGreaterThan(0);
            done();
        });
    });
});

describe('Zip.unpackDirectory()', () => {
    test('Returns an unpacked directory', async () => {
        const zip = await Faker.zip();

        expect(Zip.unpackDirectory(zip, path.join('some', 'dir'))).toBe(path.join('some', 'dir', 'output'));
    });
});

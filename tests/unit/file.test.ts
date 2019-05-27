import * as fs from 'fs-extra';
import * as path from 'path';

import Faker from '../../src/ts/faker';
import File from '../../src/ts/file';

describe('File.filenameWithExtension()', () => {
    test('Returns only filename with .txt extension from text file', () => {
        const file = Faker.file('txt');

        expect(fs.statSync(file).isFile()).toBe(true);
        expect(path.extname(file)).toBe('.txt');
        expect(File.filenameWithExtension(file)).toBe(path.basename(file));
    });
});

describe('File.filenameWithoutExtension()', () => {
    test('Returns only filename without extension', () => {
        const file = Faker.file('txt');

        expect(fs.statSync(file).isFile()).toBe(true);

        const fileWExt = path.basename(file);
        expect(File.filenameWithoutExtension(file)).toBe(fileWExt.substring(0, fileWExt.length - 4));
    });
});

describe('File.directoryFromFilepath()', () => {
    test('Gets directory from file path', () => {
        expect(File.directoryFromFilepath(
            path.join('some', 'dir', 'somefile.txt')),
        ).toBe(path.join('some', 'dir', '/'));
    });
});

describe('File.getLatestFile()', () => {
    test('It returns latest file from two files', done => {
        const dir = Faker.createTempDirectory();
        Faker.file('txt', dir);

        setTimeout(() => {
            const newest = Faker.file('txt', dir);

            expect(File.getLatestFile(dir)).toBe(newest);
            done();
        }, 50);
    });
});

describe('File.isDirectory()', () => {
    test('Passed folder returns true', () => {
        const dir = Faker.createTempDirectory();

        expect(File.isDirectory(dir)).toBe(true);
    });

    test('Passed file returns false', () => {
        const dir = Faker.file('txt');

        expect(File.isDirectory(dir)).toBe(false);
    });
});

describe('File.getAllDirectories()', () => {
    test('Empty directory returns empty array', () => {
        const dir = Faker.createTempDirectory();

        expect(File.getAllDirectories(dir).length).toBe(0);
    });

    test('Directory with two directories returns two directories', () => {
        const dir = Faker.createTempDirectory();

        fs.mkdirsSync(path.join(dir, 'dir1'));
        fs.mkdirsSync(path.join(dir, 'dir2'));

        expect(File.getAllDirectories(dir).length).toBe(2);
    });
});

describe('File.appendToFile()', () => {
    test('It can append to file', () => {
        const file = Faker.file('txt');

        fs.writeFileSync(file, 'something\n');
        File.appendToFile(file, 'else');

        expect(fs.readFileSync(file).toString()).toBe('something\nelse\n');
    });
});

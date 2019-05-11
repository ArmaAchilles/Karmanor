import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';

import { tmpdir } from 'os';
import { Tail } from 'tail';
import File from '../../src/ts/file';

import Faker from '../../src/ts/faker';

const faker = new Faker();

afterAll(() => {
    // Empty temp dir of test stuff
    const allDirs = File.getAllDirectories(tmpdir());

    allDirs.forEach(directory => {
        if (directory.includes('karmanor')) {
            fse.remove(directory);
        }
    });
});

test('A temp dir can be created and it exists', () => {
    const tempDir = faker.createTempDirectory();

    expect(tempDir).toContain('karmanor');

    expect(fs.existsSync(tempDir)).toBe(false);
    expect(fs.lstatSync(tempDir).isDirectory()).toBe(true);
});

test('An RPT file can be created and it exists', () => {
    const rptPath = faker.createRpt();

    expect(fs.existsSync(rptPath)).toBe(true);
    expect(fs.lstatSync(rptPath).isFile()).toBe(true);
});

test('It is possible to write to a created RPT file', done => {
    const rpt = faker.createRpt();

    const data = fs.readFileSync(rpt);

    expect(data.toString()).toContain('Generated fake RPT');

    const tail = new Tail(rpt);

    const timesToWrite = 2;

    let writtenTimes = 0;

    tail.on('line', (text: string) => {
        writtenTimes++;

        expect(text.length).toBeGreaterThan(0);

        if (writtenTimes === timesToWrite) {
            tail.unwatch();
            done();
        }
    });

    faker.writeToRpt(rpt, timesToWrite, 0.05);
});

test('A RPT can be created with its default values', done => {
    const rpt = faker.createRpt();

    const tail = new Tail(rpt);

    const timesToWrite = 5;

    let writtenTimes = 0;

    tail.on('line', (text: string) => {
        writtenTimes++;

        expect(text.length).toBeGreaterThan(0);

        if (writtenTimes === timesToWrite) {
            tail.unwatch();
            done();
        }
    });

    faker.writeToRpt(rpt);
});

test('Slug returns an actual slug separated by dashes', () => {
    const slug = faker.slug();

    expect(slug.split('-').length).toBeGreaterThan(1);
});

test('A fake file can be created, it exists and it has some content', () => {
    const filepath = faker.file('txt');

    // That it was created in the temp dir
    expect(filepath).toContain('karmanor');

    expect(fs.existsSync(filepath)).toBe(true);
    expect(fs.lstatSync(filepath).isFile()).toBe(true);

    const text = fs.readFileSync(filepath).toString();

    expect(text.length).toBeGreaterThan(5);
});

test('A fake file can be created in a custom directory', () => {
    const dir = path.join(tmpdir(), 'karmanorMyCustomDir', 'here');

    fse.mkdirpSync(dir);

    const filepath = faker.file('txt', dir);

    expect(filepath).toContain(dir);

    expect(fs.existsSync(filepath)).toBe(true);
    expect(fs.lstatSync(filepath).isFile()).toBe(true);
});

test('A fake zip file can be created, it exists and it has some content', async () => {
    const zip = await faker.zip();

    // That it was created in the temp dir
    expect(zip).toContain('karmanor');

    expect(fs.existsSync(zip)).toBe(true);
    expect(fs.lstatSync(zip).isFile()).toBe(true);

    const text = fs.readFileSync(zip).toString();

    expect(text.length).toBeGreaterThan(15);
});

test('A fake zip file can be created in a custom directory', async () => {
    const dir = path.join(tmpdir(), 'karmanorMyCustomDirForZip', 'here');

    fse.mkdirpSync(dir);

    const filepath = await faker.zip(dir);

    expect(filepath).toContain(dir);

    expect(fs.existsSync(filepath)).toBe(true);
    expect(fs.lstatSync(filepath).isFile()).toBe(true);
});

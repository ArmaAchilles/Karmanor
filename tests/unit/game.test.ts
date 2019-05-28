import * as fs from 'fs-extra';
import * as path from 'path';

import psList from 'ps-list';

import { EBuildStatus } from '../../src/ts/build';
import Faker from '../../src/ts/faker';
import File from '../../src/ts/file';
import Game from '../../src/ts/game';
import Settings from '../../src/ts/settings';

describe('Game.constructor()', () => {
    test('Arguments are processed into a string with all the correct data', () => {
        const game = new Game({
            executablePath: 'test.exe',
            parameters: '${executableDirectory} ${executableFile} ${unpackedDirectory}',
            rptDirectory: 'some/dir',
        }, 'someDir');

        expect(game.executablePath).toContain('test.exe');
        expect(game.parameters).toBe(
            `${File.directoryFromFilepath(game.executablePath)} ${game.executablePath} someDir`,
        );
        expect(game.rptDirectory).toContain('some/dir');
    });
});

describe('Game.getIGame()', () => {
    test('Returns all values from settings', () => {
        jest.spyOn(Settings, 'get')
            .mockReturnValueOnce({
                beautifiedName: 'Game Executable Path',
                editable: true,
                key: 'gameExecutablePath',
                value: 'test.exe',
            }).mockReturnValueOnce({
                beautifiedName: 'Game Arguments',
                editable: true,
                key: 'gameParameters',
                value: '${executableDirectory} ${executableFile} ${unpackedDirectory}',
            }).mockReturnValueOnce({
                beautifiedName: 'Game .rpt File Directory',
                editable: true,
                key: 'gameRptDirectory',
                value: 'some/dir',
            });

        const game = Game.getIGame();

        expect(game.executablePath).toBe('test.exe');
        expect(game.parameters).toBe('${executableDirectory} ${executableFile} ${unpackedDirectory}');
        expect(game.rptDirectory).toBe('some/dir');
    });

    test('Returns empty strings if Settings.get returns undefined', () => {
        jest.spyOn(Settings, 'get')
            .mockReturnValueOnce({
                beautifiedName: 'Game Executable Path',
                editable: true,
                key: 'gameExecutablePath',
            }).mockReturnValueOnce({
                beautifiedName: 'Game Arguments',
                editable: true,
                key: 'gameParameters',
            }).mockReturnValueOnce({
                beautifiedName: 'Game .rpt File Directory',
                editable: true,
                key: 'gameRptDirectory',
            });

        const game = Game.getIGame();

        expect(game.executablePath).toBe('');
        expect(game.parameters).toBe('');
        expect(game.rptDirectory).toBe('');
    });
});

describe('Game.latestRpt', () => {
    test('Returns the latest .rpt file', () => {
        const tempDir = Faker.createTempDirectory();
        const rpts = [Faker.createRpt(tempDir, '_1'), Faker.createRpt(tempDir, '_2'), Faker.createRpt(tempDir, '_3')];

        const mock = jest.spyOn(Settings, 'get').mockReturnValue({
            beautifiedName: 'Game .rpt File Directory',
            editable: true,
            key: 'gameRptDirectory',
            value: File.directoryFromFilepath(rpts[1]),
        });

        const game = new Game(Game.getIGame(), 'some/dir');

        const rpt = game.latestRpt;

        expect(fs.existsSync(rpt)).toBe(true);

        expect(File.getLatestFile(File.directoryFromFilepath(rpts[1]))).toBe(rpts[2]);

        mock.mockRestore();
    });
});

describe('Game.start()', () => {
    test('Game can be started and stopped', async () => {
        const iGame = Game.getIGame();
        iGame.executablePath = `node ${path.join(__dirname, '..', 'mocks', 'game.js')}`;

        const game = new Game(iGame, 'some/dir');

        game.start();

        let ps = await psList();

        const pid = game.process.pid;

        expect(ps.some(process => process.pid === pid)).toBe(true);

        await game.close();

        ps = await psList();

        expect(ps.some(process => process.pid === pid)).toBe(false);
    });
});

describe('Game.close()', () => {
    test('Variable process is undefined', async () => {
        const iGame = Game.getIGame();
        iGame.executablePath = `node ${path.join(__dirname, '..', 'mocks', 'game.js')}`;

        const game = new Game(iGame, 'some/dir');

        const closed = await game.close();

        expect(closed).toBe(undefined);
        expect(game.exitCode).toBe(-1);
    });

    test('Exit code is not -1', async () => {
        const iGame = Game.getIGame();
        iGame.executablePath = `node ${path.join(__dirname, '..', 'mocks', 'game.js')}`;

        const game = new Game(iGame, 'some/dir');

        game.exitCode = 1;

        const closed = await game.close();

        expect(closed).toBe(undefined);
        expect(game.exitCode).toBe(1);
    });
});

describe('Game.readRpt()', () => {
    afterAll(() => {
        const rptDir = path.join(__dirname, '..', 'rpts');
        if (fs.existsSync(rptDir)) {
            fs.removeSync(rptDir);
        }
    });

    test('Build fails if it found "Karmanor: Build Failed." message', done => {
        const rptDir = path.join(__dirname, '..', 'rpts');
        fs.mkdirsSync(rptDir);
        const rpt = Faker.createRpt(rptDir, '_1');

        const iGame = Game.getIGame();
        iGame.rptDirectory = rptDir;

        const game = new Game(iGame, 'some/dir');

        jest.useFakeTimers();

        game.readRpt(rpt).then(status => {
            expect(status).toBe(EBuildStatus.failed);
            done();
        });

        jest.clearAllTimers();

        File.appendToFile(rpt, '11:48:57 Karmanor: Build failed.');
    });

    test('Build passes if it found "Karmanor: Build passed." message', done => {
        const rptDir = path.join(__dirname, '..', 'rpts');
        fs.mkdirsSync(rptDir);
        const rpt = Faker.createRpt(rptDir, '_2');

        const iGame = Game.getIGame();
        iGame.rptDirectory = rptDir;

        const game = new Game(iGame, 'some/dir');

        jest.useFakeTimers();

        game.readRpt(rpt).then(status => {
            expect(status).toBe(EBuildStatus.passed);
            done();
        });

        jest.clearAllTimers();

        File.appendToFile(rpt, '11:48:57 Karmanor: Build passed.');
    });

    test('Build errors if it found "Shutdown normally" message', done => {
        const rptDir = path.join(__dirname, '..', 'rpts');
        fs.mkdirsSync(rptDir);
        const rpt = Faker.createRpt(rptDir, '_3');
        const iGame = Game.getIGame();
        iGame.rptDirectory = rptDir;

        const game = new Game(iGame, 'some/dir');

        jest.useFakeTimers();

        game.readRpt(rpt).then(status => {
            expect(status).toBe(EBuildStatus.broken);
            done();
        });

        jest.clearAllTimers();

        File.appendToFile(rpt, 'Shutdown normally');
    });

    test('No message and timeout has elapsed, build errors', done => {
        const rptDir = path.join(__dirname, '..', 'rpts');
        fs.mkdirsSync(rptDir);
        const rpt = Faker.createRpt(rptDir, '_4');

        const iGame = Game.getIGame();
        iGame.rptDirectory = rptDir;

        const game = new Game(iGame, 'some/dir');

        jest.useFakeTimers();

        game.readRpt(rpt).then(status => {
            expect(status).toBe(EBuildStatus.broken);
            done();
        });

        jest.runAllTimers();
    });
});

import * as fs from 'fs-extra';
import * as path from 'path';

import psList from 'ps-list';

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
        const rpts = [Faker.createRpt(tempDir), Faker.createRpt(tempDir), Faker.createRpt(tempDir)];

        const mock = jest.spyOn(Settings, 'get').mockReturnValue({
            beautifiedName: 'Game .rpt File Directory',
            editable: true,
            key: 'gameRptDirectory',
            value: File.directoryFromFilepath(rpts[1]),
        });

        const game = new Game(Game.getIGame(), 'some/dir');

        const rpt = game.latestRpt;

        expect(fs.existsSync(rpt)).toBe(true);

        expect(File.getLatestFile(File.directoryFromFilepath(rpts[1]))).toBe(rpts[0]);

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

        expect(ps.some(process => process.pid === game.process.pid)).toBe(true);

        game.close();

        ps = await psList();

        expect(ps.some(process => process.pid === game.process.pid)).toBe(false);
    });
});

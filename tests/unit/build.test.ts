import * as fs from 'fs-extra';

import Build, { EBuildStatus, IBuild } from '../../src/ts/build';
import Faker from '../../src/ts/faker';
import File from '../../src/ts/file';
import Settings from '../../src/ts/settings';
import Zip from '../../src/ts/zip';

import Game from '../../src/ts/game';
jest.mock('../../src/ts/game');

describe('Build.start()', () => {
    test('A build can be started and it returns build status', async () => {
        const zip = await Faker.zip();
        const rptDir = Faker.createTempDirectory();
        const gameDir = Faker.createTempDirectory();
        const rpt = Faker.createRpt(rptDir);

        const build = new Build(zip, 'someHash', 'someName');

        const iGame = jest.spyOn(Game, 'getIGame').mockReturnValue({
            executablePath: gameDir,
            parameters: '',
            rptDirectory: rptDir,
        });

        const settingsSave = jest.spyOn(Settings, 'set').mockResolvedValue(true);
        const gameStart = jest.spyOn(Game.prototype, 'start');
        const gameClose = jest.spyOn(Game.prototype, 'close').mockResolvedValue(undefined);
        const gameLastRpt = jest.spyOn(Game.prototype, 'latestRpt').mockReturnValue(rpt);
        const gameReadRpt = jest.spyOn(Game.prototype, 'readRpt').mockResolvedValue(EBuildStatus.passed);

        const status = await build.start();
        expect(status).toBe(EBuildStatus.passed);

        expect(iGame).toBeCalledTimes(1);
        expect(settingsSave).toBeCalledTimes(1);
        expect(gameStart).toBeCalledTimes(1);
        expect(gameClose).toBeCalledTimes(1);
        expect(gameLastRpt).toBeCalledTimes(1);
        expect(gameReadRpt).toBeCalledTimes(1);

        iGame.mockRestore();
        settingsSave.mockRestore();
        gameStart.mockRestore();
        gameClose.mockRestore();
        gameLastRpt.mockRestore();
        gameReadRpt.mockRestore();
    });

    test('If any await rejects then it errors build and rejects promise', async done => {
        const error = new Error('Test error');

        const zip = await Faker.zip();
        const rptDir = Faker.createTempDirectory();
        const gameDir = Faker.createTempDirectory();
        const rpt = Faker.createRpt(rptDir);

        const build = new Build(zip, 'someHash', 'someName');

        const iGame = jest.spyOn(Game, 'getIGame').mockReturnValue({
            executablePath: gameDir,
            parameters: '',
            rptDirectory: rptDir,
        });

        const settingsSave = jest.spyOn(Settings, 'set').mockResolvedValue(true);
        const gameStart = jest.spyOn(Game.prototype, 'start');
        const gameClose = jest.spyOn(Game.prototype, 'close').mockResolvedValue(undefined);
        const gameLastRpt = jest.spyOn(Game.prototype, 'latestRpt').mockReturnValue(rpt);
        const gameReadRpt = jest.spyOn(Game.prototype, 'readRpt').mockResolvedValue(EBuildStatus.passed);
        const zipMock = jest.spyOn(Zip, 'unpack').mockRejectedValue(error);

        // @ts-ignore Private method
        build.errorBuild = jest.fn();

        build.start().catch(err => {
            expect(err).toBe(error);

            expect(iGame).toBeCalledTimes(1);

            // @ts-ignore Private method
            expect(build.errorBuild).toHaveBeenCalledTimes(1);
            expect(zipMock).toBeCalledTimes(1);

            expect(settingsSave).not.toBeCalled();
            expect(gameStart).not.toBeCalled();
            expect(gameClose).not.toBeCalled();
            expect(gameLastRpt).not.toBeCalled();
            expect(gameReadRpt).not.toBeCalled();

            iGame.mockRestore();
            settingsSave.mockRestore();
            gameStart.mockRestore();
            gameClose.mockRestore();
            gameLastRpt.mockRestore();
            gameReadRpt.mockRestore();
            zipMock.mockRestore();

            done();
        });
    });
});

describe('Build.lastBuildStatus()', () => {
    test('It retrieves the last build from settings', () => {
        const settings = jest.spyOn(Settings, 'get').mockReturnValue({
            value: [{
                gitHash: 'someHash',
                id: 1,
                name: 'Test build',
                rpt: 'someData',
                status: EBuildStatus.failed,
                timeCreated: new Date(),
                timeFinished: new Date(),
            }, {
                gitHash: 'otherHash',
                id: 2,
                name: 'Build test',
                rpt: 'otherData',
                status: EBuildStatus.passed,
                timeCreated: new Date(),
                timeFinished: new Date(),
            }] as IBuild[],
        } as any);

        const build = new Build('some', 'hash', 'name');

        expect(build.lastBuildStatus()).toBe(EBuildStatus.passed);
        expect(build.lastBuildStatus()).not.toBe(EBuildStatus.failed);

        settings.mockRestore();
    });

    test('If builds is undefined it returns undefined', () => {
        jest.spyOn(Settings, 'get').mockReturnValueOnce(undefined);

        expect(new Build('some', 'thing', 'important').lastBuildStatus()).toBe(undefined);
    });

    test('If last build is undefined, it returns undefined', () => {
        jest.spyOn(Settings, 'get').mockReturnValueOnce({
            value: undefined,
        } as any);

        expect(new Build('some', 'thing', 'important').lastBuildStatus()).toBe(undefined);
    });
});

describe('Build.didLastBuildFail()', () => {
    test('If last build was successful it returns false', () => {
        const lastBuild = jest.spyOn(Build.prototype, 'lastBuildStatus').mockReturnValue(EBuildStatus.passed);

        expect(new Build('some', 'thing', 'important').didLastBuildFail()).toBe(false);

        lastBuild.mockRestore();
    });

    test('If last build failed it returns true', () => {
        const lastBuild = jest.spyOn(Build.prototype, 'lastBuildStatus').mockReturnValue(EBuildStatus.failed);

        expect(new Build('some', 'thing', 'important').didLastBuildFail()).toBe(true);

        lastBuild.mockRestore();
    });

    test('If last build was still failing it returns true', () => {
        const lastBuild = jest.spyOn(Build.prototype, 'lastBuildStatus').mockReturnValue(EBuildStatus.stillFailing);

        expect(new Build('some', 'thing', 'important').didLastBuildFail()).toBe(true);

        lastBuild.mockRestore();
    });
});

describe('Build.setStatus()', () => {
    test('If last build failed and current one also failed status is set to stillFailing', () => {
        const build = new Build('some', 'thing', 'important');

        const lastBuild = jest.spyOn(Build.prototype, 'didLastBuildFail').mockReturnValue(true);

        // @ts-ignore Private method
        build.setStatus(EBuildStatus.failed);
        expect(build.status).toBe(EBuildStatus.stillFailing);

        lastBuild.mockRestore();
    });

    test('If last build passed but this did not then it status is failed', () => {
        const build = new Build('some', 'thing', 'important');

        const lastBuild = jest.spyOn(Build.prototype, 'didLastBuildFail').mockReturnValue(false);

        // @ts-ignore Private method
        build.setStatus(EBuildStatus.failed);
        expect(build.status).toBe(EBuildStatus.failed);

        lastBuild.mockRestore();
    });

    test('If last build passed but this did too then it status is passed', () => {
        const build = new Build('some', 'thing', 'important');

        const lastBuild = jest.spyOn(Build.prototype, 'didLastBuildFail').mockReturnValue(false);

        // @ts-ignore Private method
        build.setStatus(EBuildStatus.passed);
        expect(build.status).toBe(EBuildStatus.passed);

        lastBuild.mockRestore();
    });
});

describe('Build.save()', () => {
    test('If build value is undefined then id is 1', async () => {
        const settingsGet = jest.spyOn(Settings, 'get').mockReturnValue({
            value: undefined,
        } as any);
        const settingsSet = jest.spyOn(Settings, 'set');

        const rpt = Faker.createRpt();
        File.appendToFile(rpt, 'This is a test.');

        const build = new Build('some', 'thing', 'important');

        // @ts-ignore Private method
        await build.save(fs.readFileSync(rpt));

        expect(settingsSet).toHaveBeenCalledWith('builds', [{
            gitHash: 'thing',
            id: 1,
            name: 'important',
            rpt: fs.readFileSync(rpt).toString(),
            status: EBuildStatus.pending,
            timeCreated: build.timeCreated,
            timeFinished: jasmine.any(Date),
        }]);

        settingsGet.mockRestore();
        settingsSet.mockRestore();
    });

    test('Promise is rejected if settings set errors', async done => {
        const settingsGet = jest.spyOn(Settings, 'get').mockReturnValue({
            value: undefined,
        } as any);
        const settingsSet = jest.spyOn(Settings, 'set').mockRejectedValue(new Error('Test error'));

        const rpt = Faker.createRpt();
        File.appendToFile(rpt, 'This is a test.');

        const build = new Build('some', 'thing', 'important');

        // @ts-ignore Private method
        build.save(rpt).catch((error: Error) => {
            expect(error.message.length).toBeGreaterThan(0);
            done();
        });

        settingsGet.mockRestore();
        settingsSet.mockRestore();
    });

    test('If rptBuffer is undefined then it is saved with as an empty string', async () => {
        const settingsGet = jest.spyOn(Settings, 'get').mockReturnValue({
            value: undefined,
        } as any);
        const settingsSet = jest.spyOn(Settings, 'set');

        const rpt = Faker.createRpt();
        File.appendToFile(rpt, 'This is a test.');

        const build = new Build('some', 'thing', 'important');

        // @ts-ignore Private method
        await build.save();

        expect(settingsSet).toHaveBeenCalledWith('builds', [{
            gitHash: 'thing',
            id: 1,
            name: 'important',
            rpt: '',
            status: EBuildStatus.pending,
            timeCreated: build.timeCreated,
            timeFinished: jasmine.any(Date),
        }]);

        settingsGet.mockRestore();
        settingsSet.mockRestore();
    });

    test('If everything is given then it saves properly', async () => {
        const data = {
            gitHash: 'thing',
            id: 1,
            name: 'important',
            rpt: '',
            status: EBuildStatus.pending,
            timeCreated: new Date(),
            timeFinished: new Date(),
        };

        const settingsGet = jest.spyOn(Settings, 'get').mockReturnValue({
            value: [data] as IBuild[],
        } as any);
        const settingsSet = jest.spyOn(Settings, 'set');

        const rpt = Faker.createRpt();
        File.appendToFile(rpt, 'This is a test.');

        const build = new Build('some', 'thing', 'important');

        // @ts-ignore Private method
        await build.save(fs.readFileSync(rpt));

        expect(settingsSet).toHaveBeenCalledWith('builds', [data, {
            gitHash: 'thing',
            id: 2,
            name: 'important',
            rpt: fs.readFileSync(rpt).toString(),
            status: EBuildStatus.pending,
            timeCreated: build.timeCreated,
            timeFinished: jasmine.any(Date),
        }]);

        settingsGet.mockRestore();
        settingsSet.mockRestore();
    });
});

describe('Build.errorBuild()', () => {
    test('It sets build status to broken and saves it to settings', () => {
        const build = new Build('some', 'thing', 'important');

        // @ts-ignore Private method
        build.save = jest.fn();

        expect(build.status).toBe(EBuildStatus.pending);

        // @ts-ignore Private method
        expect(build.save).not.toBeCalled();

        // @ts-ignore Private method
        build.errorBuild();

        expect(build.status).toBe(EBuildStatus.broken);

        // @ts-ignore Private method
        expect(build.save).toBeCalledTimes(1);
    });
});

describe('Build.saveFromRpt()', () => {
    test('If read file then calls Build.save() and resolves with true', async () => {
        const build = new Build('some', 'thing', 'important');
        const rptFile = Faker.createRpt();

        // @ts-ignore Private method
        build.save = jest.fn().mockResolvedValue(true);

        // @ts-ignore Private method
        const didSave = await build.saveFromRpt(rptFile);

        expect(didSave).toBe(true);

        // @ts-ignore Private method
        expect(build.save).toBeCalledTimes(1);

        // @ts-ignore Private method
        expect(build.save).toBeCalledWith(jasmine.any(Buffer));
    });

    test('If read file then calls Build.save() and it does not update anything, resolves with false', async () => {
        const build = new Build('some', 'thing', 'important');
        const rptFile = Faker.createRpt();

        // @ts-ignore Private method
        build.save = jest.fn().mockResolvedValue(false);

        // @ts-ignore Private method
        const didSave = await build.saveFromRpt(rptFile);

        expect(didSave).toBe(false);

        // @ts-ignore Private method
        expect(build.save).toBeCalledTimes(1);

        // @ts-ignore Private method
        expect(build.save).toBeCalledWith(jasmine.any(Buffer));
    });

    test('If read file then calls Build.save() and it rejects then this rejects', done => {
        const build = new Build('some', 'thing', 'important');
        const rptFile = Faker.createRpt();
        const error = new Error('Test error');

        // @ts-ignore Private method
        build.save = jest.fn().mockRejectedValue(error);

        // @ts-ignore Private method
        build.saveFromRpt(rptFile).catch(err => {
            expect(err).toBe(error);

            // @ts-ignore Private method
            expect(build.save).toBeCalledTimes(1);

            // @ts-ignore Private method
            expect(build.save).toBeCalledWith(jasmine.any(Buffer));
            done();
        });
    });
});

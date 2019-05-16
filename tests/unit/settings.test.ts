import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import Settings, { ISettings } from '../../src/ts/settings';

// Don't override the current configuration and restore it on test finish
beforeAll(() => {
    const jsonPath = Settings.getFilePath();

    if (fs.existsSync(jsonPath)) {
        fs.copyFileSync(jsonPath, path.join(jsonPath, '..', 'settings.main.json'));
    }
});

afterAll(() => {
    const jsonPath = Settings.getFilePath();
    const mainJsonPath = path.join(jsonPath, '..', 'settings.main.json');

    if (fs.existsSync(mainJsonPath)) {
        if (fs.existsSync(jsonPath)) {
            fs.unlinkSync(jsonPath);
        }

        fs.moveSync(mainJsonPath, jsonPath);
    }
});

describe('Settings.get()', () => {
    test('Initalized value is returned', () => {
        expect(Settings.get('accessToken').value).toBeDefined();
    });

    test('If non-existent setting is provided it throws error', () => {
        expect(() => Settings.get('someSetting' as keyof ISettings)).toThrowError();
    });
});

describe('Settings.getAll()', () => {
    test('All initalized values are returned', () => {
        Settings.removeFile();

        expect(Settings.getAll().length).toBe(6);
    });
});

describe('Settings.has()', () => {
    test('Key exists', () => {
        expect(Settings.has('accessToken')).toBe(true);
    });

    test(`Key doesn't exist`, () => {
        expect(Settings.has('something' as keyof ISettings)).toBe(false);
    });
});

describe('Settings.set()', () => {
    beforeEach(() => {
        Settings.removeFile();
    });

    test('Writing the same data returns false', done => {
        Settings.set('accessToken', Settings.get('accessToken').value).then(hasSaved => {
            expect(hasSaved).toBe(false);
            done();
        });
    });

    test('Writing different data returns true', done => {
        Settings.set('accessToken', 'someNewData').then(hasSaved => {
            expect(hasSaved).toBe(true);
            done();
        });
    });

    test('An error is caught and rejected if failed to save', done => {
        jest.spyOn(Settings, 'get').mockReturnValueOnce({
            beautifiedName: 'Port',
            editable: true,
            key: 'port',
            value: 8080,
        }).mockReturnValueOnce({
            beautifiedName: 'Port',
            editable: true,
            key: 'port',
            value: undefined,
        });

        Settings.set('port', 80).catch((error: Error) => {
            expect(error.message).toBe('Failed to update settings for element Port');
            done();
        });
    });
});

describe('Settings.removeFile()', () => {
    test('Config can be deleted', () => {
        const jsonPath = Settings.getFilePath();

        // Initalize if the json file doesn't exist
        expect(Settings.get('accessToken').value).toBeDefined();

        expect(fs.existsSync(jsonPath)).toBe(true);

        Settings.removeFile();

        expect(fs.existsSync(jsonPath)).toBe(false);
    });
});

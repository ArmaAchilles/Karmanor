import Main from '../../src/ts/main';

describe('Main.constructor', () => {
    test('app.on events are registered and triggered and they launch their functions', () => {
        const createWindow = jest.spyOn(Main.prototype, 'createWindow');

        // @ts-ignore Private method
        const registerEvents = jest.spyOn(Main.prototype, 'registerEvents');

        // @ts-ignore Private method
        const installTools = jest.spyOn(Main.prototype, 'installTools');

        const main = new Main();

        expect(createWindow).toBeCalledTimes(2);

        // @ts-ignore Private method
        expect(registerEvents).toBeCalledTimes(1);

        // @ts-ignore Private method
        expect(installTools).toBeCalledTimes(1);

        createWindow.mockRestore();
        registerEvents.mockRestore();
        installTools.mockRestore();
    });

    test('app.on activate if main window is undefined then it does nothing', () => {
        const createWindow = jest.spyOn(Main.prototype, 'createWindow');

        // @ts-ignore Private method
        const registerEvents = jest.spyOn(Main.prototype, 'registerEvents');

        // @ts-ignore Private method
        const installTools = jest.spyOn(Main.prototype, 'installTools');

        const main = new Main();

        expect(createWindow).toBeCalledTimes(2);

        createWindow.mockRestore();
        registerEvents.mockRestore();
        installTools.mockRestore();
    });
});

describe('Main.registerEvents()', () => {
    test('If main window is undefined it does nothing', () => {
        const createWindow = jest.spyOn(Main.prototype, 'createWindow');

        // @ts-ignore Private method
        const installTools = jest.spyOn(Main.prototype, 'installTools');

        const main = new Main();

        main.mainWindow = undefined;

        expect(main.mainWindow).toBeUndefined();

        // @ts-ignore Private method
        main.registerEvents();

        expect(main.mainWindow).toBeUndefined();

        createWindow.mockRestore();
        installTools.mockRestore();
    });
});

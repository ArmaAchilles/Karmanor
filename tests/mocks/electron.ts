// tslint:disable: no-empty
// tslint:disable: max-classes-per-file

export const app = {
    on: jest.fn((event: string, callback: () => void) => callback()),
    quit: jest.fn(),
};

export class BrowserWindow {
    public webContents = {
        openDevTools: jest.fn(),
        send: jest.fn(),
    };

    public loadFile = jest.fn();
    public on = jest.fn((event: string, callback: () => void) => callback());

    constructor(options: Electron.BrowserViewConstructorOptions) {}
}

import { app, BrowserWindow } from 'electron';
import * as path from 'path';

export default class Main {
    public mainWindow?: Electron.BrowserWindow;

    constructor() {
        app.on('ready', () => {
            this.createWindow();
            this.registerEvents();
            this.installTools();
        });

        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            if (! this.mainWindow) {
                this.createWindow();
            }
        });
    }

    public createWindow() {
        const window = new BrowserWindow({
            height: 800,
            webPreferences: {
                nodeIntegration: true,
            },
            width: 1000,
        });

        window.loadFile(path.join(__dirname, '../html/index.html'));

        this.mainWindow = window;
    }

    private registerEvents() {
        if (this.mainWindow) {
            this.mainWindow.on('close', () => {
                // TODO: Save chart data to settings
                if (this.mainWindow) {
                    this.mainWindow.webContents.send('chart-save');
                }
            });

            this.mainWindow.on('closed', () => {
                this.mainWindow = undefined;
            });
        }
    }

    private installTools() {
        if (process.env.NODE_ENV !== 'production' && !process.env.VSCODE_DEBUG) {
            const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

            installExtension(VUEJS_DEVTOOLS).then(() => {
                if (this.mainWindow) {
                    this.mainWindow.webContents.openDevTools();
                }
                // tslint:disable-next-line: no-console
            }).catch((err: Error) => console.error(err));
        }
    }
}

// tslint:disable-next-line: no-unused-expression
new Main();

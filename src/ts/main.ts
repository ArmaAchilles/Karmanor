import { app, BrowserWindow } from 'electron';
import * as path from 'path';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
        width: 1000,
    });

    mainWindow.loadFile(path.join(__dirname, '../html/index.html'));

    mainWindow.on('close', () => {
        // TODO: Save chart data to settings
        mainWindow.webContents.send('chart-save');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (process.env.NODE_ENV !== 'production' && !process.env.VSCODE_DEBUG) {
        const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

        installExtension(VUEJS_DEVTOOLS).then(() => {
            mainWindow.webContents.openDevTools();
        }).catch((err: Error) => console.error(err));
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});



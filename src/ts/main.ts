import { app, BrowserWindow } from 'electron';
import * as path from 'path';

import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

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

    if (process.env.VSCODE_DEBUG) {
        app.setName('Karmanor');
        app.getPath('userData');
    }

    mainWindow.on('close', () => {
        // TODO: Save chart data to settings
        mainWindow.webContents.send('chart-save');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    if (process.env.NODE_ENV !== 'production' && !process.env.VSCODE_DEBUG) {
        installExtension(VUEJS_DEVTOOLS).then(() => {
            mainWindow.webContents.openDevTools();
        }).catch(err => console.error(err));
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



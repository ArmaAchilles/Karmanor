const { dialog } = require('electron').remote;

import { FileFilter, remote } from 'electron';

export default class Dialog {
    public static openDirectory(): string | undefined {
        const directories = dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory'],
        });

        // If user canceled the dialog
        if (directories !== undefined) {
            return directories[0];
        }

        return undefined;
    }

    public static openFile(fileFilter?: FileFilter[]): string | undefined {
        const files = dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: fileFilter,
            properties: ['openFile'],
        });

        // If user canceled the dialog
        if (files !== undefined) {
            return files[0];
        }

        return undefined;
    }
}

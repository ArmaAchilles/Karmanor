const { dialog } = require('electron').remote;

import { FileFilter } from 'electron';

export default class Dialog {
    static openDirectory(): string | null {
        let directories = dialog.showOpenDialog(null, {
            properties: ['openDirectory']
        });

        // If user canceled the dialog
        if (directories !== undefined) {
            return directories[0];
        }

        return null;
    }

    static openFile(fileFilter?: FileFilter[]): string | null {
        let files = dialog.showOpenDialog(null, {
            filters: fileFilter,
            properties: ['openFile'],
        });

        // If user canceled the dialog
        if (files !== undefined) {
            return files[0];
        }

        return null;
    }
}

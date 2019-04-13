import { flash, events } from './flash';

import * as http from 'http';
import * as multiparty from 'multiparty';

import { Saved } from './settings';
import Zip, { IZip } from './zip';
import Processor from './processor';

export interface IFields {
    accessToken: string[],
}

export interface IFiles {
    zip: [IZip],
}

export default class Server {
    server: http.Server;

    fields: IFields;
    files: IFiles;

    constructor(port: number) {
        this.server = this.start(port);
    }

    start(port: number): http.Server {
        let server = http.createServer((request, response) => {
            let form = new multiparty.Form({
                uploadDir: Saved.downloadDirectory,
            });

            form.parse(request, (_error, fields: IFields, files: IFiles) => {
                this.fields = fields,
                this.files = files;

                const processor = new Processor(this.accessToken, this.zip);

                if (processor.isRequestValid()) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });

                    events.$emit('server-data-received');

                    response.end('200');

                    processor.process();
                } else {
                    response.writeHead(403, { 'Content-Type': 'text/html' });

                    response.end('403');

                    Zip.remove(this.zip.path);
                }
            });
        }).listen(port);

        server.on('connection', () => {
            events.$emit('server-connection');
        });

        server.on('listening', () => {
            events.$emit('server-started');
            flash('Server started!');
        });

        server.on('close', () => {
            events.$emit('server-stopped');
            flash('Server stopped!');
        });

        return server;
    }

    restart(port: number): void {
        this.stop();

        events.$on('server-stopped', () => {
            this.server = this.start(port);
        });
    }

    stop(): void {
        this.server.close();
    }

    get accessToken(): string {
        return this.fields.accessToken[0];
    }

    get zip(): IZip {
        return this.files.zip[0];
    }
}

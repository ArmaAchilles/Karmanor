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
    port: number | string;

    fields: IFields;
    files: IFiles;

    constructor(port: number | string) {
        this.port = port;
    }

    start(): Promise<Server> {
        return new Promise((resolve, reject) => {
            let server = http.createServer((request, response) => {
                let form = new multiparty.Form({
                    uploadDir: Saved.downloadDirectory, // TODO: File isn't processed as zip if running from test suite (no extension)
                });

                form.parse(request, (_error, fields: IFields, files: IFiles) => {
                    this.fields = fields,
                    this.files = files;

                    // TODO: Add some type checking for inputs (if zip wasn't provided, etc.)

                    const processor = new Processor(this.accessToken, this.zip);

                    if (processor.isRequestValid()) {
                        response.writeHead(200, { 'Content-Type': 'text/html' });

                        events.$emit('server-data-received', this.accessToken, this.zip);

                        response.end('200');

                        processor.process();
                    } else {
                        response.writeHead(403, { 'Content-Type': 'text/html' });

                        response.end('403');

                        events.$emit('server-data-rejected', this.accessToken, this.zip);

                        Zip.remove(this.zip.path);
                    }
                });
            }).listen(this.port);

            server.on('connection', () => {
                events.$emit('server-connection');
            });

            server.on('listening', () => {
                events.$emit('server-started', this);
                flash('Server started!');
            });

            server.on('close', () => {
                events.$emit('server-stopped');
                flash('Server stopped!');
            });

            server.on('error', error => {
                reject(error);
            })

            this.server = server;

            resolve(this);
        });
    }

    restart(): void {
        this.stop();

        events.$on('server-stopped', () => {
            this.start();
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

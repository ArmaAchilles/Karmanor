import { flash, events } from './flash';

import * as http from 'http';
import * as multiparty from 'multiparty';

export interface IFields {
    accessToken: string[],
}

export interface IZip {
    fieldName: string,
    headers: {
        'content-disposition': string,
        'content-type': string,
    },
    originalFilename: string,
    path: string,
    size: number,
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
            let form = new multiparty.Form();

            form.parse(request, (_error, fields: IFields, files: IFiles) => {
                response.writeHead(200, { 'Content-Type': 'text/html' });

                this.fields = fields,
                this.files = files;

                events.$emit('server-data-received');

                response.end('200');
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

import { flash, events } from './flash';

import * as http from 'http';
import * as multiparty from 'multiparty';

import { Saved } from './settings';
import Zip, { IZip } from './zip';

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
                    uploadDir: Saved.downloadDirectory,
                });

                form.parse(request, (_error, fields: IFields, files: IFiles) => {
                    this.fields = fields,
                    this.files = files;

                    if (this.accessToken === undefined) {
                        if (this.zip !== undefined) Zip.remove(this.zip.path);

                        this.writeResponse(response, EHttpStatus.badRequest);
                    }

                    if (this.zip === undefined) {
                        this.writeResponse(response, EHttpStatus.badRequest);
                    };

                    if (this.isRequestValid(this.accessToken)) {
                        this.writeResponse(response, EHttpStatus.ok);
                    } else {
                        this.writeResponse(response, EHttpStatus.forbidden);

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

    isRequestValid(accessToken: string): boolean {
        return accessToken === Saved.accessToken;
    }

    private writeResponse(response: http.ServerResponse, code: EHttpStatus = EHttpStatus.ok): void {
        if (code == EHttpStatus.ok) {
            response.writeHead(code, { 'Content-Type': 'text/html' });

            events.$emit('server-data-received', this.accessToken, this.zip);

            response.end(code.toString());
        } else {
            response.writeHead(code, { 'Content-Type': 'text/html' });

            response.end(code.toString());

            events.$emit('server-data-rejected');
        }
    }

    get accessToken(): string | undefined {
        try {
            return this.fields.accessToken[0];
        } catch (error) {
            return undefined;
        }
    }

    get zip(): IZip | undefined {
        try {
            return this.files.zip[0];
        } catch (error) {
            return undefined;
        }
    }
}

enum EHttpStatus {
    ok = 200,
    badRequest = 400,
    forbidden = 403,
    notFound = 404,
    serverError = 500,
}

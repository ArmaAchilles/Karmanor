import { events, flash } from './flash';

import * as http from 'http';
import * as multiparty from 'multiparty';

import Saved from './saved';
import Zip, { IZip } from './zip';

export interface IFields {
    accessToken: string[];
}

export interface IFiles {
    zip: [IZip];
}

export default class Server {
    public server?: http.Server;
    public port: number | string;

    public fields?: IFields;
    public files?: IFiles;

    constructor(port: number | string) {
        this.port = port;
    }

    public start(): Promise<Server> {
        return new Promise((resolve, reject) => {
            const server = http.createServer((request, response) => {
                const form = new multiparty.Form({
                    uploadDir: Saved.downloadDirectory,
                });

                form.parse(request, (error, fields: IFields, files: IFiles) => {
                    this.fields = fields;
                    this.files = files;

                    if (! this.accessToken) {
                        if (this.zip) { Zip.remove(this.zip.path); }
                        this.writeResponse(response, EHttpStatus.badRequest);

                        return;
                    }

                    if (! this.zip) {
                        this.writeResponse(response, EHttpStatus.badRequest);

                        return;
                    }

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
            });

            this.server = server;

            resolve(this);
        });
    }

    public restart(): void {
        this.stop();

        events.$on('server-stopped', () => {
            this.start();
        });
    }

    public stop(): void {
        if (this.server) {
            this.server.close();
        }
    }

    public isRequestValid(accessToken: string): boolean {
        return accessToken === Saved.accessToken;
    }

    private writeResponse(response: http.ServerResponse, code: EHttpStatus = EHttpStatus.ok): void {
        if (code === EHttpStatus.ok) {
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
        if (this.fields) {
            if (this.fields.accessToken[0]) {
                return this.fields.accessToken[0];
            }
        }

        return undefined;
    }

    get zip(): IZip | undefined {
        if (this.files) {
            if (this.files.zip[0]) {
                return this.files.zip[0];
            }
        }

        return undefined;
    }
}

export enum EHttpStatus {
    ok = 200,
    badRequest = 400,
    forbidden = 403,
    notFound = 404,
    serverError = 500,
}

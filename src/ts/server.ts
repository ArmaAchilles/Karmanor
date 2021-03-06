import { events, flash } from './flash';
import Zip, { IZip } from './zip';

import * as http from 'http';
import * as multiparty from 'multiparty';
import Settings from './settings';

export interface IFields {
    accessToken: string[];
    commitHash: string;
    commitName: string;
}

export interface IFiles {
    zip: [IZip];
}

export default class Server {
    public server?: http.Server;
    public port: number | string;
    public started: boolean;

    public fields?: IFields;
    public files?: IFiles;

    constructor(port: number | string) {
        this.port = port;
        this.started = false;
    }

    public start(): Promise<Server> {
        return new Promise((resolve, reject) => {
            const server = http.createServer((request, response) => {
                const uploadDir = Settings.get('downloadDirectory');

                const form = new multiparty.Form({
                    uploadDir: uploadDir.value,
                });

                form.parse(request, (error, fields: IFields, files: IFiles) => {
                    this.fields = fields;
                    this.files = files;

                    if (! this.accessToken) {
                        if (this.zip) { Zip.remove(this.zip.path); }
                        this.writeResponse(response, EHttpStatus.badRequest);

                        return;
                    }

                    if (! this.commitHash) {
                        if (this.zip) { Zip.remove(this.zip.path); }
                        this.writeResponse(response, EHttpStatus.badRequest);

                        return;
                    }

                    if (! this.commitName) {
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

                this.started = true;

                resolve(this);
            });

            server.on('close', () => {
                events.$emit('server-stopped');
                flash('Server stopped!');

                this.started = false;
            });

            server.on('error', error => {
                events.$emit('server-error');

                reject(error);
            });

            this.server = server;
        });
    }

    public restart(): Promise<Server> {
        return new Promise((resolve, reject) => {
            this.stop().then(() => {
                this.start().then(() => resolve(this)).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    public stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.server) {
                if (this.started) {
                    this.server.close((error?: Error) => error ? reject(error) : resolve());
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    public isRequestValid(accessToken: string): boolean {
        const token = Settings.get('accessToken').value;
        if (token) {
            return accessToken === token;
        }

        return false;
    }

    private writeResponse(response: http.ServerResponse, code: EHttpStatus): void {
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
            if (this.fields.accessToken) {
                return this.fields.accessToken[0];
            }

            return undefined;
        }

        return undefined;
    }

    get commitHash(): string | undefined {
        if (this.fields) {
            if (this.fields.commitHash) {
                return this.fields.commitHash[0];
            }

            return undefined;
        }

        return undefined;
    }

    get commitName(): string | undefined {
        if (this.fields) {
            if (this.fields.commitName) {
                return this.fields.commitName[0];
            }

            return undefined;
        }

        return undefined;
    }

    get zip(): IZip | undefined {
        if (this.files) {
            if (this.files.zip) {
                return this.files.zip[0];
            }

            return undefined;
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

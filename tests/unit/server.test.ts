import * as fs from 'fs-extra';
import * as http from 'http';

import axios from 'axios';
import FormData from 'form-data';

import Faker from '../../src/ts/faker';
import { events } from '../../src/ts/flash';
import Saved from '../../src/ts/saved';
import Server, { EHttpStatus } from '../../src/ts/server';

const address = 'http://127.0.0.1:2566';
let createdServer: Server;

function createServer(): Server {
    createdServer = new Server(2566);

    return createdServer;
}

beforeEach(() => {
    createServer();
});

afterEach(() => {
    createdServer.stop();
});

jest.mock('electron-settings');

test('Port is assigned in the class constructor', () => {
    expect(createdServer.port).toBe(2566);
});

test('The server can be started', done => {
    createdServer.start().then(startedServer => {
        expect(startedServer.server).toBeInstanceOf(http.Server);
        expect(startedServer.started).toBe(true);

        // It has to be stopped otherwise we get an open handle error
        startedServer.stop().then(() => done());
    }).catch(error => { throw error; });
});

test(`The server can't be started`, async done => {
    await createdServer.start();

    createdServer.server.on('error', () => {
        done();
    });

    createdServer.server.emit('error', new Error('Test error'));
});

describe('The server can be stopped', () => {
    test('The server is running', async done => {
        const server = await createdServer.start();

        server.stop().then(() => {
            expect(server.started).toBe(false);

            done();
        }).catch(error => { throw error; });
    });

    test(`The server isn't created`, done => {
        expect(createdServer.started).toBe(false);

        createdServer.stop().then(() => done());
    });

    test(`The server isn't started`, async done => {
        const server = await createdServer.start();

        expect(server.started).toBe(true);

        await server.stop();

        expect(server.started).toBe(false);

        server.stop().then(() => done());
    });

    test(`The server throws an error when asked to stop but it's already stopped`, async done => {
        const server = await createdServer.start();

        await server.stop();

        server.started = true;

        server.stop().catch((error: Error) => { expect(error.message.length).toBeGreaterThan(0); done(); });
    });
});

test('The server can be restarted', done => {
    createdServer.start().then(server => {
        server.server.on('listening', () => {
            expect(server.started).toBe(true);
        });

        server.server.on('close', () => {
            expect(server.started).toBe(false);
        });

        server.restart().then(restartedServer => {
            expect(restartedServer.started).toBe(true);

            restartedServer.stop().then(() => done());
        }).catch(error => { throw error; });
    }).catch(error => { throw error; });
});

test('The server emits a server-connection event on a connection', async done => {
    await createdServer.start();

    events.$on('server-connection', () => {
        done();
    });

    axios.post(address, {}, { validateStatus: status => status === EHttpStatus.badRequest });
});

test('Request validation sucessfully works with a correct access token', () => {
    expect(createdServer.isRequestValid(Saved.accessToken)).toBe(true);
});

test('Request validation fails when a non-valid access token is passed', () => {
    expect(createdServer.isRequestValid('someRandomThing1234')).toBe(false);
});

describe('The server emits different status codes for requests', () => {
    test('Passing no access token and no zip file results in bad request', async done => {
        await createdServer.start();

        axios.post(address, {}, {
            validateStatus: status => status === EHttpStatus.badRequest,
        }).then(response => {
            expect(response.status).toBe(EHttpStatus.badRequest);
            done();
        });
    });

    test('Passing no access token with zip results in bad request and zip is removed from disk', async done => {
        await createdServer.start();

        const zipPath = await new Faker().zip();
        expect(fs.existsSync(zipPath)).toBe(true);

        const form = new FormData();
        form.append('zip', fs.createReadStream(zipPath));

        axios.post(address, form, {
            headers: form.getHeaders(),
            validateStatus: status => status === EHttpStatus.badRequest,
        }).then(response => {
            expect(response.status).toBe(EHttpStatus.badRequest);

            expect(fs.existsSync(createdServer.zip.path)).toBe(false);

            done();
        });
    });

    test('Passing access token and no zip results in bad request', async done => {
        await createdServer.start();

        const form = new FormData();
        form.append('accessToken', 'someAccessToken1234');

        axios.post(address, form, {
            headers: form.getHeaders(),
            validateStatus: status => status === EHttpStatus.badRequest,
        }).then(response => {
            expect(response.status).toBe(EHttpStatus.badRequest);

            done();
        });
    });

    test('Passing invalid access token and zip results in forbidden response', async done => {
        await createdServer.start();

        const form = new FormData();
        form.append('accessToken', 'someRandomToken1234');
        form.append('zip', fs.createReadStream(await new Faker().zip()));

        axios.post(address, form, {
            headers: form.getHeaders(),
            validateStatus: status => status === EHttpStatus.forbidden,
        }).then(response => {
            expect(response.status).toBe(EHttpStatus.forbidden);

            done();
        });
    });

    test('Passing correct access token and zip results in OK response', async done => {
        createdServer.isRequestValid = jest.fn().mockReturnValue(true);

        await createdServer.start();

        const form = new FormData();
        form.append('accessToken', 'aToken');
        form.append('zip', fs.createReadStream(await new Faker().zip()));

        axios.post(address, form, {
            headers: form.getHeaders(),
        }).then(response => {
            expect(response.status).toBe(EHttpStatus.ok);

            done();
        });
    });
});

test(`The server can't be restarted with this.start error`, done => {
    createdServer.start().then(server => {
        createdServer.start = jest.fn().mockRejectedValueOnce(new Error('Test error'));

        server.restart().catch(() => done());
    });
});

test(`The server can't be restarted with this.stop error`, done => {
    createdServer.start().then(server => {
        server.stop = jest.fn().mockRejectedValueOnce(new Error('Test error'))
            .mockImplementation(() => server.server.close());

        server.restart().catch(() => done());
    });
});

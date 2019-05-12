import * as http from 'http';

import Server from '../../src/ts/server';

test('Port is assigned in the class constructor', () => {
    const port = 2566;

    const server = new Server(port);

    expect(server.port).toBe(port);
});

test('The server can be started', done => {
    const server = new Server(2566);

    server.start().then(startedServer => {
        expect(startedServer.server).toBeInstanceOf(http.Server);
        expect(startedServer.started).toBe(true);

        // It has to be stopped otherwise we get an open handle error
        startedServer.stop().then(() => done());
    }).catch(error => { throw error; });
});

test(`The server can't be started`, done => {
    const server = new Server(-1);

    server.start().catch((error: Error) => { expect(error.message.length).toBeGreaterThan(0); done(); });
});

describe('The server can be stopped', () => {
    test('The server is running', async done => {
        const server = await new Server(2566).start();

        server.stop().then(() => {
            expect(server.started).toBe(false);

            done();
        }).catch(error => { throw error; });
    });

    test(`The server isn't created`, done => {
        const server = new Server(2566);

        expect(server.started).toBe(false);

        server.stop().then(() => done());
    });

    test(`The server isn't started`, async done => {
        const server = await new Server(2566).start();

        expect(server.started).toBe(true);

        await server.stop();

        expect(server.started).toBe(false);

        server.stop().then(() => done());
    });
});

test('The server can be restarted', done => {
    new Server(2566).start().then(server => {
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

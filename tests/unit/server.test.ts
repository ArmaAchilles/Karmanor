import Server from '../../src/ts/server';

test('Port is assigned in the class constructor', () => {
    const port = 2566;

    const server = new Server(port);

    expect(server.port).toBe(port);
});

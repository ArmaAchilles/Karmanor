import File from '../../src/ts/file';
import Game from '../../src/ts/game';

test('Arguments are processed into a string with all the correct data', () => {
    const game = new Game({
        executablePath: 'test.exe',
        parameters: '${executableDirectory} ${executableFile} ${unpackedDirectory}',
        rptDirectory: 'file.rpt',
    }, 'someDir');

    expect(game.executablePath).toContain('test.exe');
    expect(game.parameters).toBe(`${File.directoryFromFilepath(game.executablePath)} ${game.executablePath} someDir`);
    expect(game.rptDirectory).toContain('file.rpt');
});

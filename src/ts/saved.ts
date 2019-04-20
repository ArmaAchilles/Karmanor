import Build from './build';
import { IGame } from './game';
import Settings, { IChartHome } from './settings';

export default class Saved {
    // Access token
    static get accessToken(): string {
        return Settings.get('server-settings.accessToken', '');
    }

    static set accessToken(accessToken) {
        Settings.save('server-settings.accessToken', accessToken);
    }

    // Port
    static get port(): string {
        return Settings.get('server-settings.port', '');
    }

    static set port(port) {
        Settings.save('server-settings.port', port);
    }

    // Download directory
    static get downloadDirectory(): string {
        return Settings.get('directories.downloadDirectory', '');
    }

    static set downloadDirectory(downloadDirectory) {
        Settings.save('directories.downloadDirectory', downloadDirectory);
    }

    // Charts in Home view
    static get chartHome(): IChartHome {
        return Settings.get('chart-home', {});
    }

    static set chartHome(chartHome) {
        Settings.save('chart-home', chartHome);
    }

    // Game
    static get game(): IGame {
        return Settings.get('game', {});
    }

    static set game(game) {
        Settings.save('game', game);
    }

    // Builds
    static get builds(): Build[] {
        return Settings.get('builds', []);
    }

    static set builds(builds) {
        Settings.save('builds', builds);
    }
}

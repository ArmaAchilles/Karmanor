import Build from './build';

export default class Broadcast {
    private build: Build;

    constructor(build: Build) {
        this.build = build;
    }

    public toDiscord(): this {
        return this;
    }

    public toSlack(): this {
        return this;
    }

    public toGitHub(): this {
        return this;
    }
}

import Build from "./build";

export default class Broadcast {
    private build: Build;

    constructor(build: Build) {
        this.build = build;
    }

    toDiscord(): this {
        return this;
    }

    toSlack(): this {
        return this;
    }

    toGitHub(): this {
        return this;
    }
}

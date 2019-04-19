import * as _ from 'lodash';

import Build from "./build";

export default class Scheduler {
    private builds: Build[];

    add(build: Build): void {
        this.builds.push(build);
    }

    remove(build: Build) {
        _.pull(this.builds, build);
    }

    getAll(): Build[] {
        return this.builds;
    }
}

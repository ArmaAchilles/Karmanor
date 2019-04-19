import * as _ from 'lodash';

import Build, { EBuildStatus } from "./build";

export default class Scheduler {
    private builds: Build[];
    private currentBuild: Build;

    add(build: Build): void {
        this.builds.push(build);

        if (! this.currentBuild) {
            this.setCurrentBuild(build);
        }
    }

    remove(build: Build) {
        _.pull(this.builds, build);
    }

    getAll(): Build[] {
        return this.builds;
    }

    private clearCurrentBuild(): void {
        this.remove(this.currentBuild);
        this.currentBuild = undefined;
    }

    private setCurrentBuild(build: Build): void {
        this.currentBuild = build;

        build.start().then(() => {
            this.clearCurrentBuild();
            this.setNextCurrentBuild();
        });
    }

    private setNextCurrentBuild(): void {
        if (this.builds) {
            let pendingBuild = _.find(this.builds, (build: Build) => {
                return build.getStatus() === EBuildStatus.pending;
            });

            this.setCurrentBuild(pendingBuild);
        }
    }
}

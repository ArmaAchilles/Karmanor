import * as _ from 'lodash';

import Build, { EBuildStatus } from './build';
import { events } from './flash';

export default class Scheduler {
    private builds: Build[] = [];
    private currentBuild?: Build;

    public add(build: Build): void {
        this.builds.push(build);

        if (! this.currentBuild) {
            this.setCurrentBuild(build);
        }

        events.$emit('scheduler-added', this);
    }

    public remove(build: Build): void {
        _.pull(this.builds, build);

        events.$emit('scheduler-removed', this);
    }

    public getAll(): Build[] {
        return this.builds;
    }

    private clearCurrentBuild(): void {
        if (this.currentBuild) {
            this.remove(this.currentBuild);
            this.currentBuild = undefined;
        }
    }

    private setCurrentBuild(build: Build): void {
        this.currentBuild = build;

        build.start().then(() => {
            this.clearCurrentBuild();
            this.setNextCurrentBuild();
        });

        events.$emit('scheduler-new-build', this);
    }

    private setNextCurrentBuild(): void {
        if (this.builds) {
            const pendingBuild = _.find(this.builds, (build: Build) => {
                return build.getStatus() === EBuildStatus.pending;
            });

            if (pendingBuild) {
                this.setCurrentBuild(pendingBuild);

            }
        }
    }
}

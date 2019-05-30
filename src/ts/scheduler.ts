import * as _ from 'lodash';

import Build, { EBuildStatus } from './build';
import { events } from './flash';

export default class Scheduler {
    public builds: Build[] = [];
    public currentBuild?: Build;

    public add(build: Build): Promise<void> {
        return new Promise((resolve, reject) => {
            this.builds.push(build);

            if (! this.currentBuild) {
                this.advanceQueue().then(() => resolve()).catch(error => reject(error));
            }

            events.$emit('scheduler-added', this);
        });
    }

    public setCurrentBuild(build: Build): Promise<void> {
        return new Promise((resolve, reject) => {
            this.currentBuild = build;

            events.$emit('scheduler-new-build', this);

            build.start().then(() => {
                this.currentBuild = undefined;
                this.advanceQueue();

                resolve();
            }).catch(error => {
                this.currentBuild = undefined;
                this.advanceQueue();

                reject(error);
                events.$emit('scheduler-build-errored', this);
            });
        });
    }

    public advanceQueue(): Promise<void> {
        return new Promise((resolve, reject) => {
            const pendingBuild = _.find(this.builds, (build: Build) => {
                return build.status === EBuildStatus.pending;
            });

            if (pendingBuild) {
                this.setCurrentBuild(pendingBuild).then(() => resolve())
                    .catch(error => reject(error));
            } else {
                resolve();
            }
        });
    }
}

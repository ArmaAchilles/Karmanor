import Build, { EBuildStatus } from '../../src/ts/build';
jest.mock('../../src/ts/build');

import Scheduler from '../../src/ts/scheduler';

describe('Scheduler.add()', () => {
    test('A new build can be added', async () => {
        const scheduler = new Scheduler();
        const build = new Build('some', 'thing', 'important');
        build.status = EBuildStatus.pending;

        build.start = jest.fn().mockImplementationOnce(() => {
            build.status = EBuildStatus.passed;

            return Promise.resolve();
        });

        await scheduler.add(build);

        expect(scheduler.builds.includes(build)).toBe(true);
        expect(scheduler.currentBuild).toBeUndefined();

        expect(build.start).toBeCalledTimes(1);
    });

    test('A build can be queued', () => {
        const scheduler = new Scheduler();
        const currentBuild = new Build('some', 'other', 'thing');
        const build = new Build('some', 'thing', 'important');
        currentBuild.status = EBuildStatus.pending;

        scheduler.currentBuild = currentBuild;

        build.start = jest.fn().mockResolvedValueOnce(EBuildStatus.passed);
        currentBuild.start = jest.fn();
        scheduler.add(build);

        expect(scheduler.builds.includes(build)).toBe(true);
        expect(scheduler.currentBuild).toBe(currentBuild);

        expect(currentBuild.start).not.toBeCalled();
        expect(build.start).not.toBeCalled();
    });

    test('If returns error then it rejects promise', done => {
        const scheduler = new Scheduler();
        const error = new Error('Test error');
        const build = new Build('some', 'thing', 'important');

        scheduler.advanceQueue = jest.fn().mockRejectedValue(error);

        scheduler.add(build).catch(err => {
            expect(err).toBe(error);

            done();
        });
    });
});

describe('Scheduler.setCurrentBuild()', () => {
    test('New build can be set as current', async () => {
        const scheduler = new Scheduler();
        const build = new Build('some', 'thing', 'important');
        build.status = EBuildStatus.pending;

        build.start = jest.fn().mockResolvedValueOnce(EBuildStatus.passed);

        scheduler.advanceQueue = jest.fn();

        await scheduler.setCurrentBuild(build);

        expect(scheduler.builds.includes(build)).toBe(false);
        expect(scheduler.currentBuild).toBeUndefined();

        expect(build.start).toBeCalledTimes(1);
        expect(scheduler.advanceQueue).toBeCalledTimes(1);
    });

    test('If starting a build returns an error, it rejects promise', done => {
        const scheduler = new Scheduler();
        const build = new Build('some', 'thing', 'important');
        const error = new Error('Test error');
        build.status = EBuildStatus.pending;

        build.start = jest.fn().mockRejectedValueOnce(error);

        scheduler.setCurrentBuild(build).catch(err => {
            expect(err).toBe(error);

            expect(scheduler.builds.includes(build)).toBe(false);
            expect(scheduler.currentBuild).toBeUndefined();

            expect(build.start).toBeCalledTimes(1);

            done();
        });
    });
});

describe('Scheduler.advanceQueue()', () => {
    test('If no builds are present then it does nothing', async () => {
        const scheduler = new Scheduler();
        expect(scheduler.builds.length).toBe(0);
        expect(scheduler.currentBuild).toBeUndefined();

        await scheduler.advanceQueue();

        expect(scheduler.builds.length).toBe(0);
        expect(scheduler.currentBuild).toBeUndefined();
    });

    test('If a build is already in the queue then advance it if there is a pending build', async () => {
        const scheduler = new Scheduler();
        const build = new Build('some', 'thing', 'important');
        const currentBuild = new Build('some', 'other', 'thing');
        build.status = EBuildStatus.pending;

        build.start = jest.fn().mockImplementationOnce(() => {
            build.status = EBuildStatus.passed;

            return Promise.resolve();
        });
        currentBuild.start = jest.fn().mockResolvedValueOnce(EBuildStatus.passed);

        scheduler.currentBuild = currentBuild;
        scheduler.builds.push(currentBuild, build);

        expect(scheduler.currentBuild).toBe(currentBuild);

        await scheduler.advanceQueue();

        expect(scheduler.currentBuild).toBeUndefined();

        expect(build.start).toBeCalledTimes(1);
        expect(currentBuild.start).not.toBeCalled();
    });

    test('If returns error then it rejects promise', done => {
        const scheduler = new Scheduler();
        const error = new Error('Test error');
        const build = new Build('some', 'thing', 'important');

        build.status = EBuildStatus.pending;
        scheduler.builds.push(build);

        scheduler.setCurrentBuild = jest.fn().mockRejectedValue(error);

        scheduler.advanceQueue().catch(err => {
            expect(err).toBe(error);

            done();
        });
    });
});

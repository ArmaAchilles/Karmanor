/// <reference types="node" />

declare module 'node-tail' {
    export default class Tail {
        constructor(fileToTail: string,
            // Note: these aren't all the options available
            options?: {
                separator?: '/[\r]{0,1}\n/', fromBeginning?: false, fsWatchOptions?: {}, follow?: true,
            }
        );

        watch(): void;
        unwatch(): void;

        on(event: string, listener: (...args: any[]) => void): this;
        on(event: 'line', listener: (data: string) => void): this;
        on(event: 'error', listener: (error: string) => void): this;
    }
}

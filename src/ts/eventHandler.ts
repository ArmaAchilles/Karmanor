import * as _ from 'lodash';

class Listener<T> {
    callback: (eventArgs: T) => void;

    constructor(callback: (eventArgs: T) => void) {
        this.callback = callback;
    }
}

export default class EventHandler<T> {
    private listeners: Listener<T>[] = [];

    on(callback: (eventArgs: T) => void): void {
        this.listeners.push(new Listener<T>(callback));
    }

    emit(eventArgs: T): void {
        this.listeners.forEach((listener: Listener<T>) => {
            listener.callback(eventArgs);
        });
    }

    remove(listener: Listener<T>): void {
        _.pull(this.listeners, listener);
    }
}

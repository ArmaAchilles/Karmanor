import * as _ from 'lodash';
import Listener from './listener';

export default class EventHandler<T> {
    private listeners: Listener<T>[] = [];

    public on(callback: (eventArgs: T) => void): void {
        this.listeners.push(new Listener<T>(callback));
    }

    public emit(eventArgs: T): void {
        this.listeners.forEach((listener: Listener<T>) => {
            listener.callback(eventArgs);
        });
    }

    public remove(listener: Listener<T>): void {
        _.pull(this.listeners, listener);
    }
}

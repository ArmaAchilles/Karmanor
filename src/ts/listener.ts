import * as _ from 'lodash';

export default class Listener<T> {
    public callback: (eventArgs: T) => void;

    constructor(callback: (eventArgs: T) => void) {
        this.callback = callback;
    }
}

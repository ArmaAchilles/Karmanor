import Vue from 'vue';

export let events = new Vue();
(<any>window).events = events;

export let flash = (message: string, level: string = 'success') => {
    events.$emit('flash', { message, level });
};

(<any>window).flash = flash;

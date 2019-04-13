import Vue from 'vue';

export let events = new Vue();

export let flash = function(message: string, status?: string, isImportant?: boolean) {
    events.$emit('flash', message, status, isImportant);
};

(<any>window).events = events;
(<any>window).flash = flash;

import Vue from 'vue';

export let events = new Vue();

export function flash(message: string, status?: string, isImportant?: boolean) {
    events.$emit('flash', message, status, isImportant);
}

window.events = events;
window.flash = flash;

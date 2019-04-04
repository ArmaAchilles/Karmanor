import Vue from 'vue';
import VueRouter from 'vue-router';

require('@fortawesome/fontawesome-free');

try {
    (<any>window).Popper = require('popper.js').default;
    (<any>window).$ = (<any>window).jQuery = require('jquery');

    require('bootstrap');
} catch (e) {};

(<any>window).axios = require('axios');

import router from './routes';

Vue.use(VueRouter);

// Auto register all Vue components
const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

new Vue({
    el: '#app',
    router: router()
});

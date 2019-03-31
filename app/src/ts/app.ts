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

Vue.component('App', require('./App.vue').default);
Vue.component('Flash', require('./components/Flash.vue').default);

new Vue({
    el: '#app',
    router: router()
});

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

Vue.component('app-component', require('./app-component.vue').default);
Vue.component('flash-component', require('./components/flash-component.vue').default);
Vue.component('sidebar-component', require('./components/sidebar-component.vue').default);
Vue.component('navbar-component', require('./components/navbar-component.vue').default);
Vue.component('card-component', require('./components/card-component.vue').default);
Vue.component('small-card-component', require('./components/small-card-component.vue').default);

new Vue({
    el: '#app',
    router: router()
});

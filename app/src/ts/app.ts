import Vue from 'vue';
import VueRouter from 'vue-router';

require('materialize-css');

import router from './routes';

Vue.use(VueRouter);

Vue.component('app', require('./app.vue').default);

new Vue({
    el: '#app',
    router: router()
});

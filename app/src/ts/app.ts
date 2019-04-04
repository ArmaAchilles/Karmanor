import Vue from 'vue';
import VueRouter from 'vue-router';

import './bootstrap';

// Handle Vue Router routes
import router from './routes';

Vue.use(VueRouter);

// Auto register all Vue components
const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

new Vue({
    el: '#app',
    router: router()
});

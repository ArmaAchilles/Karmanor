import Vue from 'vue';
import VueRouter from 'vue-router';

import './bootstrap';

// Handle Vue Router routes
import router from './routes';

Vue.use(VueRouter);

// Auto register all Vue components
const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => {
    const splitKey = key.split('/').pop();
    if (splitKey !== undefined) {
        Vue.component(
            splitKey.split('.')[0],
            files(key).default,
        );
    }
});

// tslint:disable-next-line: no-unused-expression
new Vue({
    el: '#app',
    router: router(),
});

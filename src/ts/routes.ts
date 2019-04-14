import VueRouter from 'vue-router';

export default () : VueRouter => {
    return new VueRouter({
        routes: [
            {
                path: '/',
                component: require('./views/home-view.vue').default,
                name: 'Dashboard'
            },
            {
                path: '/settings',
                component: require('./views/settings-view.vue').default,
                name: 'Settings'
            }
        ],
        linkExactActiveClass: 'active'
    });
};
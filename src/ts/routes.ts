import VueRouter from 'vue-router';

export default (): VueRouter => {
    return new VueRouter({
        linkExactActiveClass: 'active',
        routes: [
            {
                component: require('./views/home-view.vue').default,
                name: 'Dashboard',
                path: '/',
            },
            {
                component: require('./views/settings-view.vue').default,
                name: 'Settings',
                path: '/settings',
            },
        ],
    });
};

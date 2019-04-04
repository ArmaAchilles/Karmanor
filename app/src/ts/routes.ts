import VueRouter from 'vue-router';

export default () : VueRouter => {
    return new VueRouter({
        routes: [
            {
                path: '/',
                component: require('./views/home-view.vue').default,
                name: 'Dashboard'
            }
        ]
    });
};

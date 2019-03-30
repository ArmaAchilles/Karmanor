import VueRouter from 'vue-router';

export default () : VueRouter => {
    return new VueRouter({
        routes: [
            {
                path: '/',
                component: require('./components/HomeView.vue').default
            }
        ]
    });
};

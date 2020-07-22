import Vue from 'vue';
import VueRouter from 'vue-router';
import VueHead from 'vue-head';
import Vuex from 'vuex';

import Home from '@/views/Home.vue';

Vue.use(VueRouter);
Vue.use(VueHead, {
    separator: '-',
});
Vue.use(Vuex);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import VueHead from 'vue-head';
import Vuex from 'vuex';

import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';

Vue.use(VeeValidate);
Vue.use(VueRouter);
Vue.use(VueHead, { separator: '-' });
Vue.use(Vuex);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

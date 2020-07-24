import Vue from 'vue';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import VueHead from 'vue-head';
import Vuex from 'vuex';

import Dashboard from '@/views/Dashboard.vue';
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import PasswordReset from '@/views/PasswordReset.vue';

Vue.use(VeeValidate);
Vue.use(VueRouter);
Vue.use(VueHead, { separator: '-' });
Vue.use(Vuex);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false },
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false },
    },
    {
        path: '/password-reset',
        name: 'PasswordReset',
        component: PasswordReset,
        meta: { requiresAuth: false },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

export default router;

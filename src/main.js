import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import './directives/hidden';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
    faHome,
    faUser,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt,
    faKey,
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt, faKey);

Vue.config.productionTip = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);

router.beforeEach((to, from, next) => {
    const loggedIn = store.state.auth.loggedIn;
    const resetPassword = store.state.auth.resetPassword;
    const requiresAuth = typeof to.meta.requiresAuth !== 'undefined'
        ? to.meta.requiresAuth
        : true;

    if (loggedIn) {
        if (resetPassword && ['Login', 'Logout', 'PasswordReset'].indexOf(to.name) < 0) {
            next({ name: 'PasswordReset' });
            return;
        }
    } else if (requiresAuth) {
        next({ name: 'Login' });
        return;
    }

    next();
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

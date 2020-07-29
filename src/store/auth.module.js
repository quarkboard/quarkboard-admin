import AuthService from '../services/auth.service';
import user from '../models/user';

export const auth = {
    namespaced: true,
    state: user,
    actions: {
        login({ commit }, user) {
            return AuthService.login(user).then(
                obj => {
                    commit('loginSuccess', obj);
                    return Promise.resolve(obj);
                },
                error => {
                    AuthService.logout();
                    commit('logout');
                    return Promise.reject(error);
                },
            );
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
        reset({ commit }, password) {
            return AuthService.reset(password).then(
                response => {
                    AuthService.logout();
                    commit('logout');
                    return Promise.resolve(response.data);
                },
                error => {
                    AuthService.logout();
                    commit('logout');
                    return Promise.reject(error);
                },
            );
        },
    },
    mutations: {
        loginSuccess(state, obj) {
            state.token = obj.accessToken;
        },
        logout(state) {
            state.token = null;
        },
    },
};

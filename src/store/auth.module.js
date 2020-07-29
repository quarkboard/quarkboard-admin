import AuthService from '../services/auth.service';
import user from '../models/user';

export const auth = {
    namespaced: true,
    state: user,
    actions: {
        login({ commit }, creds) {
            return AuthService.login(creds.username, creds.password).then(
                response => {
                    commit('loginSuccess', response);
                    return Promise.resolve(response);
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
            state.logout();
        },
    },
};

import AuthService from '../services/auth.service';

const accessToken = localStorage.getItem('accessToken');
const initialState = accessToken
    ? { loggedIn: true, accessToken: accessToken }
    : { loggedIn: false, accessToken: null };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, accessToken) {
            return AuthService.login(accessToken).then(
                accessToken => {
                    commit('loginSuccess', accessToken);
                    return Promise.resolve(accessToken);
                },
                error => {
                    commit('loginFailure');
                    return Promise.reject(error);
                },
            );
        },
        logout({ commit }) {
            AuthService.logout();
            commit('logout');
        },
    },
    mutations: {
        loginSuccess(state, accessToken) {
            state.loggedIn = true;
            state.accessToken = accessToken;
        },
        loginFailure(state) {
            state.loggedIn = false;
            state.accessToken = null;
        },
        logout(state) {
            state.loggedIn = false;
            state.accessToken = null;
        },
    },
};

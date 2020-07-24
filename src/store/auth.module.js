import AuthService from '../services/auth.service';

const accessToken = localStorage.getItem('accessToken');
const resetPassword = localStorage.getItem('resetPassword');

const initialState = accessToken
    ? { loggedIn: true, accessToken: accessToken, resetPassword: resetPassword }
    : { loggedIn: false, accessToken: null, resetPassword: false };

export const auth = {
    namespaced: true,
    state: initialState,
    actions: {
        login({ commit }, accessToken, resetPassword) {
            return AuthService.login(accessToken, resetPassword).then(
                (accessToken, resetPassword) => {
                    commit('loginSuccess', accessToken, resetPassword);
                    return Promise.resolve(accessToken, resetPassword);
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
        loginSuccess(state, accessToken, resetPassword) {
            state.loggedIn = true;
            state.accessToken = accessToken;
            state.resetPassword = resetPassword;
        },
        loginFailure(state) {
            state.loggedIn = false;
            state.accessToken = null;
            state.resetPassword = false;
        },
        logout(state) {
            state.loggedIn = false;
            state.accessToken = null;
            state.resetPassword = false;
        },
    },
};

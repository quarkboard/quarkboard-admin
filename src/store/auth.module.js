import AuthService from '../services/auth.service';

const accessToken = localStorage.getItem('accessToken');
const resetPassword = localStorage.getItem('resetPassword') === 'true';

const isExpired = function(accessToken) {
    if (accessToken === null) {
        return true;
    }

    const [, payload] = accessToken.split('.');
    const payloadJSON = JSON.parse(
        new Buffer(payload, 'base64').toString('ascii'),
    );
    return payloadJSON.exp * 1000 <= new Date().getTime();
};

const initialState = !isExpired(accessToken)
    ? { loggedIn: true, accessToken: accessToken, resetPassword: resetPassword }
    : { loggedIn: false, accessToken: null, resetPassword: false };

export const auth = {
    namespaced: true,
    state: initialState,
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
            state.loggedIn = true;
            state.accessToken = obj.accessToken;
            state.resetPassword = obj.resetPassword;
        },
        logout(state) {
            state.loggedIn = false;
            state.accessToken = null;
            state.resetPassword = false;
        },
    },
};

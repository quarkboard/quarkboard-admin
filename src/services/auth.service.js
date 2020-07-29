import axios from 'axios';

const API_URL = '/api';

class AuthService {
    login(user) {
        return axios
            .post(API_URL + '/auth/jwt', {
                username: user.username,
                password: user.password,
            })
            .then(response => {
                const accessToken = response.data.accessToken;
                const resetPassword = response.data.resetPassword || false;

                if (!user.validate(accessToken, username)) {
                    throw new Error(`Invalid user ${username} after authentication`)
                }

                return response.data;
            });
    }

    logout() {
        user.logout();
    }

    reset(password) {
        return axios
            .post(API_URL + '/auth/reset', {
                oldPassword: password.oldPassword,
                newPassword: password.newPassword,
                confirmPassword: password.confirmPassword,
            })
            .then(() => {
                localStorage.removeItem('resetPassword');
                return false;
            });
    }
}

export default new AuthService();

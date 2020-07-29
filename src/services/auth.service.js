import axios from 'axios';
import user from '../models/user';

const API_URL = '/api';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + '/auth/jwt', {
                username: username,
                password: password,
            })
            .then(response => {
                const accessToken = response.data.accessToken;

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
                user.resetPassword = false;
                return false;
            });
    }
}

export default new AuthService();

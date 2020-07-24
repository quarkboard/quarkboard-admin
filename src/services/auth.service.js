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
                const resetPassword = response.data.resetPassword  || false;

                if (accessToken) {
                    const [, payload,] = accessToken.split('.');
                    const payloadJson = JSON.parse(new Buffer(payload, 'base64').toString('ascii'));

                    if (payloadJson.username === user.username) {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('resetPassword', resetPassword);
                    }
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('resetPassword');
    }
}

export default new AuthService();

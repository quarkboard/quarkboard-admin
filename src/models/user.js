/**
 * Decode the JWT token into a Javascript object.
 *
 * @param token
 * @returns {{}|object}
 */
const decode = function(token) {
    if (token === null) {
        return {};
    }

    const [, payload] = token.split('.');
    return JSON.parse(new Buffer(payload, 'base64').toString('ascii'));
};

/**
 * User model
 */
class User {
    constructor() {
        this.token = localStorage.getItem('accessToken');
    }

    /**
     * Return whether or not the user's token is expired.
     *
     * @returns {boolean}
     */
    get expired() {
        return (
            this._token === null || this._token.exp * 1000 <= new Date().getTime()
        );
    }

    /**
     * Return whether or not the user is logged in.
     *
     * @returns {boolean}
     */
    get loggedIn() {
        return this.expired === false;
    }

    /**
     * Whether or not the user needs to reset their password.
     *
     * @returns {boolean}
     */
    get resetPassword() {
        return this._token.resetPassword || false;
    }

    /**
     * The username of the current user, or undefined.
     *
     * @returns {string|undefined}
     */
    get username() {
        return this._token.username;
    }

    /**
     * Set the value of the internal token to {token}.
     *
     * @param {string|null} token
     */
    set token(token) {
        this._token = decode(token);
    }
}

export default new User();

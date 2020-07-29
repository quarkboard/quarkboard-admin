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

    if (typeof payload === "undefined") {
        throw new Error(`Invalid JWT token: ${token}`);
    }

    return JSON.parse(new Buffer(payload, 'base64').toString('ascii'));
};

const valid = function(exp) {
    return exp * 1000 > new Date().getTime();
};

/**
 * User model
 */
class User {
    constructor() {
        this.token = localStorage.getItem('accessToken');
    }

    /**
     * Return whether or not the user is logged in.
     *
     * @returns {boolean}
     */
    get loggedIn() {
        return this.valid;
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
     * Return whether or not the user object is considered valid. A valid user
     * has a JWT token, and the token is not yet expired.
     *
     * @returns {boolean}
     */
    get valid() {
        return (
            this._token !== null &&
            valid(this._token.exp)
        );
    }

    /**
     * Set the value of the resetPassword flag to {resetPassword}.
     *
     * @param {boolean} resetPassword
     */
    set resetPassword(resetPassword) {
        this._token.resetPassword = resetPassword;
    }

    /**
     * Set the value of the internal token to {token}. This will update the
     * local storage with either the new token, or if there is no token, then it
     * will remove it from local storage—effectively logging the user out.
     *
     * @param {string|null} token
     */
    set token(token) {
        token !== null && localStorage.setItem('accessToken', token);
        token === null && localStorage.removeItem('accessToken');

        this._token = decode(token);
    }

    /**
     * Destroy the user session and log them out.
     * @returns {User}
     */
    logout() {
        this.token = null;
        return this;
    }

    /**
     * Return if the given token {token} is valid, and that {username} matches
     * the username inside of the token.
     *
     * @param {string} token
     * @param {string} username
     * @returns {boolean|boolean}
     */
    validate(token, username) {
        const payload = decode(token);
        return payload.username === username && valid(payload.exp);
    }
}

export default new User();

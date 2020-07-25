const fs = require('fs');
const path = require('path');

const Plugin = require('@quarkboard/quarkboard-plugin');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const jwt = require('jsonwebtoken');

class Admin extends Plugin {
    init() {
        this._express = express();
        this._server = undefined;

        this.use(helmet());
        this.use(bodyParser.json());

        this.on('plugin-loading', (plugin, opts) => {
            if (this.is(plugin)) {
                opts.push(['', 'admin-hostname=HOSTNAME', 'The hostname for the admin panel.', 'localhost']);
                opts.push(['', 'admin-port=PORT', 'The port number for the admin panel.', 3052]);
                opts.push(['', 'no-admin', 'Disable the use of the admin panel.']);
                opts.push(['', 'admin-https', 'Use secure HTTP transport', false]);
                opts.push(['', 'admin-private-key=PATH', 'The path to the HTTP private key']);
                opts.push(['', 'admin-certificate=PATH', 'The path to the HTTP certificate']);
            }
        });

        this.on('plugin-loaded', plugin => {
            if (this.is(plugin)) {
                const config = this.app.getConfig('admin', {});
                const opts = Object.assign({
                    hostname: 'localhost',
                    port: 3052,
                    https: false,
                    privateKey: '',
                    certificate: '',
                    noAdmin: false,
                }, config, {
                    hostname: this.app.options['admin-hostname'],
                    port: this.app.options['admin-port'],
                    https: this.app.options['admin-https'],
                    privateKey: this.app.options['admin-private-key'],
                    certificate: this.app.options['admin-certificate'],
                    noAdmin: this.app.options['no-admin'],
                });

                if (opts.noAdmin)
                    return;

                if (opts.https) {
                    this._server = require('https').Server({
                        key: fs.readFileSync(opts.privateKey),
                        cert: fs.readFileSync(opts.certificate),
                    }, this._express);
                } else
                    this._server = require('http').Server(this._express);

                if (typeof config.jwtSecret === 'undefined') {
                    this.app.info('Generating JWT secret...');
                    config.jwtSecret = require('crypto').randomBytes(64).toString('hex');

                    this.app.setConfig('admin.jwtSecret', config.jwtSecret);
                }

                if (typeof config.username === 'undefined') {
                    config.username = 'admin';

                    this.app.info(`Temporary Username: ${config.username}`);

                    this.app.setConfig('admin.username', config.username);
                }

                if (typeof config.password === 'undefined') {
                    config.password = require('crypto').randomBytes(5).toString('base64');
                    config.resetPassword = true;

                    this.app.info(`Temporary Password: ${config.password}`)

                    this.app.setConfig('admin.password', config.password);
                    this.app.setConfig('admin.resetPassword', config.resetPassword);
                }

                this._server.listen(opts.port, opts.hostname, () => {
                    this.app.info(`Admin listening on http${opts.https ? 's' : ''}://${opts.hostname}:${opts.port}/`);

                    if (opts.https) {
                        this.app.debug(`  Using private key from ${opts.privateKey}`);
                        this.app.debug(`  Using certificate from ${opts.certificate}`);
                    }
                });

                this._express.get('/*', (req, res, next) => {
                    res.header('X-Quarkboard-Version', this.app.packageJson.version);
                    res.header('X-Quarkboard-Repository', this.app.packageJson.repository);
                    next();
                });

                this._express.post('/api/auth/jwt', (req, res, next) => {
                    if (req.body.username !== config.username || req.body.password !== config.password) {
                        res.status(403);
                        res.send({ error: 'Invalid username/password' });
                        next();
                        return;
                    }

                    res.send({
                        accessToken: this.signToken(req.body.username),
                        resetPassword: config.resetPassword,
                    });
                    next();
                });

                this._express.post('/api/auth/reset', (req, res, next) => {
                    if (req.body.oldPassword !== config.password) {
                        res.status(403);
                        res.send({ error: 'Invalid password' });
                        next();
                        return;
                    }

                    if (req.body.newPassword !== req.body.confirmPassword) {
                        res.status(403);
                        res.send({ error: 'Invalid confirmation password' });
                        next();
                        return;
                    }

                    config.password = req.body.newPassword;
                    config.resetPassword = false;

                    this.app.setConfig('admin.password', req.body.newPassword);
                    this.app.setConfig('admin.resetPassword', false);

                    res.send({ success: true });
                    next();
                });

                this.use('/', express.static(path.join(__dirname, '..', 'public')));
            }
        });
    }

    /**
     * @param username
     * @returns {string}
     */
    signToken(username) {
        return jwt.sign({ username: username }, this.app.getConfig('admin.jwtSecret'), { expiresIn: 1800 });
    }

    /**
     * Pass-through for adding ExpressJS middleware.
     *
     * @param callback
     * @param args
     */
    use(callback, ...args) {
        this._express.use(callback, ...args);
    }
}

module.exports = Admin;

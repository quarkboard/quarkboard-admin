const fs = require('fs');
const path = require('path');

const Plugin = require('@quarkboard/quarkboard-plugin');
const express = require('express');
const helmet = require('helmet');

class Admin extends Plugin {
    init() {
        this._express = express();
        this._server = undefined;

        this.use(helmet());

        this.on('plugin-loading', (plugin, opts) => {
            if (this.is(plugin)) {
                opts.push(['', 'admin-hostname', 'The hostname for the admin panel.', 'localhost']);
                opts.push(['', 'admin-port', 'The port number for the admin panel.', 3052]);
                opts.push(['', 'no-admin', 'Disable the use of the admin panel.']);
                opts.push(['', 'admin-https', 'Use secure HTTP transport', false]);
                opts.push(['', 'admin-private-key=PATH', 'The path to the HTTP private key']);
                opts.push(['', 'admin-certificate=PATH', 'The path to the HTTP certificate']);
            }
        });

        this.on('plugin-loaded', plugin => {
            if (this.is(plugin)) {
                const opts = Object.assign({
                    hostname: 'localhost',
                    port: 3052,
                    https: false,
                    privateKey: '',
                    certificate: '',
                    noAdmin: false,
                }, this.app.getConfig('admin', {}), {
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

                this._express.use('/', express.static(path.join(__dirname, '..', 'public')));
            }
        });
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

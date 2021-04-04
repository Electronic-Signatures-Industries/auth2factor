const TRANSPORT_CLIENTS = require('./messaging/transportClients');
const MessageSender = require('./messaging/messageSender');
const MailTemplates = require('./mailTemplateCompiler');
const mailBuilder = new MailTemplates({
    templates: __dirname + '/../../../templates'
});
const Boom = require('boom');
const _ = require('underscore');
const debug = require('debug')('api:common:otcme');

function OtcMe() {
}

OtcMe.prototype.sendOTC = function (options, callback) {
    'use strict';

    // if debug
    if (process.env.DEBUG_OTC) {
        process.env.DEBUG_OTC_CODE = options.mailOptions.code;
    }

    if (this.sender.hasTransport(options.transport)) {
        try {
            MessageSender
                .withTransport(options.transport)
                .send(options.opts, function (err, resp) {
                    debug(resp);
                    if (err) {
                        return callback(err);
                    }
                    if (callback) {
                        return callback(null, resp);
                    }
                });

        } catch (e) {
            debug(e);
            if (callback) {
                return callback(e);
            }
        }

    } else {
        debug('No "' + options.transport + '" found');
        return callback('No "' + options.transport + '" found');
    }
};

OtcMe.prototype.getTransportOptions = function (options) {

    const opts = options.opts;
    const config = options.config;
    const user = options.user;

    const transport = config.entityId;
    const settings = config.settings;

    if (transport === TRANSPORT_CLIENTS.TWILIO) {
        opts.sms = {
            from: settings.fromNumber,
            cellphone: user.cellphone,
            sid: settings.SID,
            authToken: settings.token
        };
    } else if (transport === TRANSPORT_CLIENTS.SENDGRID) {
        opts.transportCredentials = {
            user: settings.user,
            apiKey: settings.apiKey
        };
    } else if (transport === TRANSPORT_CLIENTS.SMTP) {
        opts.transportCredentials = {
            host: settings.host,
            port: settings.port,
            secure: settings.secure,
            tls: settings.tls,
            user: settings.user,
            password: settings.password
        };
    } else if (transport === 'push:push') {
        opts.endpoint = user.pushDeviceEndpoint;
        opts.message = opts.textBody;
    }

    return opts;
};

OtcMe.prototype.render = function (options) {
    const opts = {
        email: options.email,
        from: options.from,
        subject: mailBuilder.render('share_otc/subject', options.mailOptions),
        textBody: mailBuilder.render('share_otc/text', options.mailOptions),
        htmlBody: mailBuilder.render('share_otc/email', options.mailOptions)
    };

    return opts;
};


OtcMe.prototype.tokenMe = function (options, next) {
    'use strict';


    if (_.isEmpty(options.user)) {
        throw new Error('Missing options.user.');
    }
    if (_.isEmpty(options.transportId)) {
        throw new Error('Missing options.transport.');
    }
    if (_.isEmpty(options.request)) {
        throw new Error('Missing options.request.');
    }
    if (!next) {
        throw new Error('Missing next');
    }
    if (!options.fixedTransport) {
        throw new Error('Missing options.fixedTransport');
    }
    this.fixedTransport = options.fixedTransport;
    const user = options.user;
    let key;

    // override if reset === true
    if (options.isReset) {
        key = this.fixedTransport;
    } else {
        key = options.transportId;

        // if prefer soft token, exit
        if (user.preferSoftToken) {
            debug(user.getOTC());
            debug('soft token is preferred');
            return next(null, 'soft token is preferred');
        }
    }
    const server = options.request.server;
    const ConfigModel = server.app.mongoose.models.Config;

    const self = this;


    ConfigModel.get({
        key: key
    }, function (err, config) {
        if (err) {
            server.methods.logger({
                tag: 'error',
                request: options.request,
                log: err.message,
                user: user.email
            });

            // 4xx
            return next(Boom.badRequest('No se encontro transporte'));
        }

        const mailOptions = {
            code: user.getOTC()
        };

        let opts = self.render({
            mailOptions: mailOptions,
            from: 'noreply@auth2factor.com',
            email: user.email
        });

        const transport = config.entityId;

        opts = self.getTransportOptions({
            opts: opts,
            user: user,
            config: config
        });

        if (transport === 'push:push' && !user.pushDeviceEndpoint) {
            ConfigModel.get({
                key: self.fixedTransport
            }, function (err, config) {
                if (err) {
                    server.methods.logger({
                        tag: 'error',
                        request: options.request,
                        log: err.message,
                        user: user.email
                    });

                    // 4xx
                    return next(Boom.badRequest('No se encontro transporte'));
                }

                opts = self.getTransportOptions({
                    opts: opts,
                    user: user,
                    config: config
                });

                self.sendOTC({
                    mailOptions: mailOptions,
                    transport: config.entityId,
                    opts: opts
                }, function (err, resp) {
                    if (err) {
                        return next(err);
                    }
                    if (next) {
                        return next(null, resp);
                    }
                });

            });
        } else {
            self.sendOTC({
                mailOptions: mailOptions,
                transport: transport,
                opts: opts
            }, function (err, resp) {
                if (err) {
                    return next(err);
                }
                if (next) {
                    return next(null, resp);
                }
            });
        }

    });

};

module.exports = OtcMe;
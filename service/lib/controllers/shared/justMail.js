const TRANSPORT_CLIENTS = require('./messaging/transportClients');
const MessageSender = require('./messaging/messageSender');
const Boom = require('boom');
const MailTemplates = require('./mailTemplateCompiler');
const mailBuilder = new MailTemplates({
    templates: __dirname + '/../../../templates'
});
const jwtTokenService = require('./jwtTokenizer');
const _ = require('underscore');
const debug = require('debug')('api:common:justMail');

function JustMail(options) {

    if (!options.jwtSecret) {
        throw new Error('Missing options.jwtSecret');
    }

    this.jwtSecret = options.jwtSecret;
}

JustMail.prototype.sendConfirmation = function (options, next) {

    if (!options.email) {
        throw new Error('Missing options.email');
    }

    if (!options.password) {
        throw new Error('Missing options.password');
    }

    if (!options.hostname) {
        throw new Error('Missing options.hostname');
    }
    if (!options.fixedTransport) {
        throw new Error('Missing options.fixedTransport');
    }

    if (!options.tokenExpiration) {
        throw new Error('Missing options.tokenExpiration');
    }
    if (_.isEmpty(options.request)) {
        throw new Error('Missing options.request.');
    }
    this.tokenExpiration = options.tokenExpiration;
    const server = options.request.server;
    const ConfigModel = server.app.mongoose.models.Config;

    if (!next) {
        throw new Error('Missing next');
    }

    const timeout = parseInt(this.tokenExpiration, 10);
    const profileOpts = {
        account: options.email,
        timestamp: new Date()
    };
    const profileToken = jwtTokenService.signDataExpiresInSeconds(profileOpts, {
        secret: this.jwtSecret,
    }, timeout);

    // Confirmation
    const confirmationOpts = {
        email: options.email,
        redirectTo: options.redirectTo + profileToken,
        resetToken: profileToken,
        timestamp: new Date()
    };
    const confirmationToken = jwtTokenService.signDataExpiresInSeconds(confirmationOpts, {
        secret: this.jwtSecret,
    }, timeout);


    const tokenLink = options.hostname + '/confirm?token=' + confirmationToken;
    debug(tokenLink);

    const self = this;

    ConfigModel.get({
        key: options.fixedTransport
    }, function (err, config) {
        if (err) {
            server.methods.logger('error', {
                log: err.message,
                user: options.email
            });

            // 4xx
            return next(Boom.badRequest('No se encontro transporte'));
        }

        const transport = config.entityId;
        const settings = config.settings;

        const mailOptions = {
            email: options.email,
            link: tokenLink
        };
        // Add password
        mailOptions.password = options.password;

        debug(mailOptions);

        const opts = {
            email: options.email,
            subject: mailBuilder.render('signup/subject', mailOptions),
            textBody: mailBuilder.render('signup/text', mailOptions),
            htmlBody: mailBuilder.render('signup/email', mailOptions)
        };

        if (transport === TRANSPORT_CLIENTS.SENDGRID) {
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
        }

        MessageSender
            .withTransport(transport)
            .send(opts, function (err, resp) {
                return next(err, resp);
            });

    });

};

JustMail.prototype.sendReset = function (options, next) {

    if (!options.email) {
        throw new Error('Missing options.email');
    }

    if (!options.hostname) {
        throw new Error('Missing options.hostname');
    }

    if (!options.redirectTo) {
        throw new Error('Missing options.redirectTo');
    }
    if (!options.fixedTransport) {
        throw new Error('Missing options.fixedTransport');
    }
    if (_.isEmpty(options.request)) {
        throw new Error('Missing options.request.');
    }
    if (!options.tokenExpiration) {
        throw new Error('Missing options.tokenExpiration');
    }

    this.tokenExpiration = options.tokenExpiration;

    if (!next) {
        throw new Error('Missing next');
    }
    const server = options.request.server;
    const ConfigModel = server.app.mongoose.models.Config;
    const timeout = parseInt(this.tokenExpiration, 10);
    const profileOpts = {
        account: options.email,
        timestamp: new Date()
    };
    const profileToken = jwtTokenService.signDataExpiresInSeconds(profileOpts, {
        secret: this.jwtSecret,
    }, timeout);

    // Confirmation
    const confirmationOpts = {
        email: options.email,
        redirectTo: options.redirectTo + profileToken,
        resetToken: profileToken,
        timestamp: new Date()
    };

    const confirmationToken = jwtTokenService.signDataExpiresInSeconds(confirmationOpts, {
        secret: this.jwtSecret,
    }, timeout);
    const tokenLink = options.hostname + '/reset?token=' + confirmationToken;
    debug(tokenLink);

    const self = this;

    ConfigModel.get({
        key: options.fixedTransport
    }, function (err, config) {

        if (err) {
            server.methods.logger('error', {
                log: err.message,
                user: options.email
            });

            // 4xx
            return next(Boom.badRequest('No se encontro transporte'));
        }

        const transport = config.entityId;
        const settings = config.settings;

        const mailOptions = {
            email: options.email,
            link: tokenLink
        };

        debug(mailOptions);

        const opts = {
            email: options.email,
            subject: mailBuilder.render('forgot/subject', mailOptions),
            textBody: mailBuilder.render('forgot/text', mailOptions),
            htmlBody: mailBuilder.render('forgot/email', mailOptions)
        };

        if (transport === TRANSPORT_CLIENTS.SENDGRID) {
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
        }

        MessageSender
            .withTransport(transport)
            .send(opts, function (err, resp) {
                return next(err, resp);
            });

    });
};
JustMail.prototype.getProfileToken = function (options, next) {

    if (!options.email) {
        throw new Error('Missing options.email');
    }

    if (!options.tokenExpiration) {
        throw new Error('Missing options.tokenExpiration');
    }

    this.tokenExpiration = options.tokenExpiration;

    if (!next) {
        throw new Error('Missing next');
    }
    const timeout = parseInt(this.tokenExpiration, 10);
    const profileOpts = {
        account: options.email,
        timestamp: new Date()
    };
    const profileToken = jwtTokenService.signDataExpiresInSeconds(profileOpts, {
        secret: this.jwtSecret,
    }, timeout);

    next(null, profileToken);
};
module.exports = JustMail;
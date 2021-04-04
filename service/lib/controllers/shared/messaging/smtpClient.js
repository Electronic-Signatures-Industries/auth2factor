const MessageClient = require('./messageClient');
const debug = require('debug')('smtp_client');
const _ = require('underscore');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

class SmtpClient extends MessageClient {

    constructor() {
        super();
    }

    send(options, callback) {
        'use strict';
        if (_.isEmpty(options.email)) {
            throw new Error('Missing email.');
        }

        if (_.isEmpty(options.subject)) {
            throw new Error('Missing subject.');
        }

        if (_.isEmpty(options.textBody)) {
            throw new Error('Missing textBody.');
        }

        if (_.isEmpty(options.htmlBody)) {
            throw new Error('Missing htmlBody.');
        }

        if (_.isUndefined(callback)) {
            throw new Error('Missing callback.');
        }

        if (options.transportCredentials) {
            const opts = {
                port: options.transportCredentials.port,
                host: options.transportCredentials.host,
                secure: false
            };

            if (options.transportCredentials.secure) {
                opts.secure = options.transportCredentials.secure;
            }
            if (options.transportCredentials.user && options.transportCredentials.password) {
                opts.auth = {
                    user: options.transportCredentials.user,
                    pass: options.transportCredentials.password
                };
            } else {
                throw new Error('Missing SMTP user and password.');
            }

            if (options.transportCredentials.tls) {
                opts.tls = {
                    ciphers: 'SSLv3'
                };
            }
            this.client = nodemailer.createTransport(smtpTransport(opts));
        }

        const email = {
            to: options.email,
            from: options.from || 'noreply@auth2factor.com',
            subject: options.subject,
            text: options.textBody,
            html: options.htmlBody
        };

        this.client.sendMail(email, function (err, resp) {
            if (err) {
                debug(err);
                return callback(err, null);
            }

            return callback(null, resp);
        });
    }

}
module.exports = SmtpClient;
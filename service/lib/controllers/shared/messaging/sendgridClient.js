const MessageClient = require('./messageClient');
const debug = require('debug')('twilio_client');
const _ = require('underscore');
const sendgrid = require('sendgrid');

class SendgridClient extends MessageClient {

    constructor(key, user) {
        super();
        // this.client = sendgrid(user, key);
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

        if (options.transportCredentials && options.transportCredentials.user && options.transportCredentials.apiKey) {
            this.client = sendgrid(options.transportCredentials.user, options.transportCredentials.apiKey);
        }

        const email = new this.client.Email({
            to: options.email,
            from: options.from || 'noreply@auth2factor.com',
            subject: options.subject,
            text: options.textBody,
            html: options.htmlBody,
            fromname: options.fromName || 'auth2factor'
        });

        this.client.send(email, function (err, resp) {
            if (err) {
                /* eslint-disable */
                console.log(err);
                debug(err);
                return callback(err, null);
            }

            return callback(null, resp);
        });

    }

}
module.exports = SendgridClient;
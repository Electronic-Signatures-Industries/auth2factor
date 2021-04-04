const MessageClient = require('./messageClient');
const debug = require('debug')('twilio_client');
const _ = require('underscore');

class TwilioClient extends MessageClient {

    constructor() {
        super();
    }

    send(options, callback) {
        'use strict';

        debug(options);
        if (options.sms && _.isEmpty(options.sms.sid)) {
            throw new Error('Missing sms.sid.');
        }

        if (options.sms && _.isEmpty(options.sms.authToken)) {
            throw new Error('Missing sms.authToken.');
        }

        if (options.user && _.isEmpty(options.sms.cellphone)) {
            throw new Error('Missing user.cellphone.');
        }

        if (_.isEmpty(options.textBody)) {
            throw new Error('Missing textBody.');
        }

        if (_.isUndefined(callback)) {
            throw new Error('Missing callback.');
        }

        //require the Twilio module and create a REST client
        const client = require('twilio')(options.sms.sid, options.sms.authToken);

        //Send an SMS text message
        client.sendMessage({
            from: options.sms.from,
            to: '+' + options.sms.cellphone,
            body: options.textBody

        }, function (err, resp) {

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
module.exports = TwilioClient;
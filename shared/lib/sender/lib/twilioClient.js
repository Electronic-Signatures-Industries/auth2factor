var debug = require('debug')('twilio_client');
var _ = require('underscore');

var TwilioClient = function TwilioClient(logger, config) {
    'use strict';

    this.config = config;
    this.logger = logger;

    return this;
};

TwilioClient.prototype.send = function (options, callback) {
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
    var client = require('twilio')(options.sms.sid, options.sms.authToken);

    var self = this;

    //Send an SMS text message
    client.sendMessage({
        from: options.sms.from, 
        to: '+' + options.sms.cellphone, 
        body: options.textBody

    }, function (err, resp) {

        if (err) {
            self.logger.error(err);
            debug(err);
            return callback(err, null);
        }

        return callback(null, resp);
    });


};

module.exports = TwilioClient;
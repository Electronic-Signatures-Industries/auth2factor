var AWS = require('aws-sdk');
var _ = require('underscore');
var debug = require('debug')('api:common:aws_sns_manager');

function AWSSnsManager() {
    // TODO: Use env var
    AWS.config.update({
        region: 'us-east-1'
    });
    this.snsClient = new AWS.SNS();
    
    return this;
}

AWSSnsManager.prototype.send = function (options, callback) {
    'use strict';

    if (_.isEmpty(options.message)) {
        throw new Error('Missing options.message.');
    }
    if (_.isEmpty(options.subject)) {
        throw new Error('Missing options.subject.');
    }
    if (_.isEmpty(options.endpoint)) {
        throw new Error('Missing options.endpoint.');
    }
    
    var params = {
        Message: options.message,
        MessageAttributes: {
            code: {
                DataType: 'String',
                StringValue: options.message
            },
        },
        Subject: options.subject,
        TargetArn: options.endpoint
    };
// Used for debugging
//    this.snsClient.listEndpointsByPlatformApplication({ PlatformApplicationArn: 'arn:aws:sns:us-east-1:653861443478:app/GCM/autentifactor' }, function (err, data) {
//        if (err) {
//            console.log(err);
//        }
//        
//        console.log(data);
//    });
    
    this.snsClient.publish(params, function (err, data) {
        if (err) {
            return callback(err, null);
        }

        return callback(null, {
            messageId: data.ResponseMetadata.MessageId
        });
    });
};

module.exports = AWSSnsManager;
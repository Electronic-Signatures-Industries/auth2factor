let AWS = require('aws-sdk');
let _ = require('underscore');
let debug = require('debug')('api:common:aws_sns_register');

function AWSSnsRegister(options) {
    'use strict';
    
    options = options || {};
    if (_.isEmpty(options.region)) {
        throw new Error('Missing options.region.');
    }
    
    if (_.isEmpty(options.gcmPlatformAppArn)) {
        throw new Error('Missing options.gcmPlatformAppArn.');
    }
    
    if (_.isEmpty(options.apnsPlatformAppArn)) {
        throw new Error('Missing options.apnsPlatformAppArn.');
    }
    
    AWS.config.update({
        region: options.region
    });
    this.snsClient = new AWS.SNS();
    this.gcmPlatformAppArn = options.gcmPlatformAppArn;
    this.apnsPlatformAppArn = options.apnsPlatformAppArn;

    return this;
}

AWSSnsRegister.prototype.register = function (options, callback) {
    'use strict';

    options = options || {};
    if (_.isEmpty(options.deviceToken)) {
        throw new Error('Missing options.deviceToken.');
    }
    
    if (_.isEmpty(options.platform)) {
        throw new Error('Missing options.platform.');
    }
    
    let platformArn;
    if (options.platform === 'gcm') {
        platformArn = this.gcmPlatformAppArn;
    } else  if (options.platform === 'apns') {
        platformArn = this.apnsPlatformAppArn;
    }
    
    let params = {
        PlatformApplicationArn: platformArn,
        Token: options.deviceToken,
    };


    this.snsClient.createPlatformEndpoint(params, function (err, data) {
        if (err) {
            return callback(err, null);
        }
debug(data.EndpointArn);
        return callback(null, {
            endpointArn: data.EndpointArn
        });
    });
};

module.exports = AWSSnsRegister;
const FlakeIdGen = require('flake-idgen');
const intformat = require('biguint-format');
const generator = new FlakeIdGen();
const crypto = require('crypto');
const debug = require('debug')('api:common:api_authorization_manager');

function APIAuthorizationManager(options) {
    options = options || {};
    this.created = options.created;
    this.id = options.id;
}

APIAuthorizationManager.prototype.isApiUser = function () {
    'use strict';
    if (this.id && this.created) {
        return true;
    } else {
        return false;
    }
};

/**
 * Generates an API key
 */
APIAuthorizationManager.generateToken = function () {
    'use strict';
    // var session = {
    //     accountRequester: request.auth.credentials.email,
    //     email: request.auth.credentials.email,
    //     apiUniqueId: 'apikey:' + (new Date()).getTime(),
    //     created: new Date()
    // };

    const id1 = generator.next();
    const apiSecret = crypto.randomBytes(256).toString('base64');
    const clientSecret = crypto.randomBytes(128).toString('hex');
     
    return {
        key: intformat(id1, 'hex'),
        apiSecret,
        clientSecret,
    };
};


APIAuthorizationManager.prototype.hasValidIpAddress = function (request, callback) {
    'use strict';
    const server = request.server;
    const ConfigModel = server.app.mongoose.models.Config;
    const ip = (request.connection && request.connection.remoteAddress) || request.headers['x-forwarded-for'];

    ConfigModel.get({
        key: this.id
    }, function (err, config) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: 'system'
            });
            return callback(err, null);
        }

        if (!config) {
            return callback(null, false);
        }
        // console.log(request.headers);
        // how to test ?
        //  && config.settings.value === request.headers['x-real-ip']
        debug('IP match: ' + config.settings.ip + ' = ' + ip);
        console.log('IP match: ' + config.settings.ip + ' = ' + ip);
        let ipCheck = false;
        if (config.settings.ip === '0.0.0.0') {
            ipCheck = true;
        } else {
            ipCheck = (ip === config.settings.ip);
        }

        if (ipCheck) {
            return callback(null, true);
        } else {
            return callback(new Error('Bad IP: ' + ip), false);
        }
    });
};

APIAuthorizationManager.prototype.getApiConfig = function (request, callback) {
    'use strict';
    let server = request.server;
    let ConfigModel = server.app.mongoose.models.Config;

    ConfigModel.get({
        key: this.id
    }, function (err, config) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: 'system'
            });
            return callback(err, null);
        }

        if (!config) {
            return callback(null, false);
        } else {
            return callback(null, config.settings);
        }
    });
};

module.exports = APIAuthorizationManager;

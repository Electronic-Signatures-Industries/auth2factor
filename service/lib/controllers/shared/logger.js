const get_ip = require('ipware')().get_ip;

function Logger(options) {
    if (!options.models) {
        throw new Error('Missing options.models');
    }
    
    this.models = options.models;
}



Logger.prototype.log = function (options, next) {

    if (!options.tag) {
        throw new Error('Missing options.tag');
    }
    
    if (!options.log) {
        throw new Error('Missing options.log');
    }
    
    if (!options.request) {
        throw new Error('Missing options.request');
    }    
    
    let tag = options.tag;
    let user = options.user;
    let log = options.log;
    let request = options.request;
    let LogModel = this.models.Log;
    // let realIP = get_ip(request);
    // let realIP2 = get_ip(request, true);
    //        console.log(request.headers['x-forwarded-for']);
    //        console.log(realIP);
    //        console.log(realIP2);
    let data = {
        event: tag,
        user: user || 'system',
        log: log,
        remoteAddress: (request.connection && request.connection.remoteAddress) || request.headers['x-forwarded-for'],
        request: {
            path: request.path,
            method: request.method
        }
    };

    LogModel.create(data, function (err, model) {
        if (err) {
            console.error(err);
            if (next) {
                return next(err, null);
            } else {
                return;
            }
        }

        if (next) {
            return next(null, model);
        } else {
            return;
        }
    });
};

module.exports = Logger;
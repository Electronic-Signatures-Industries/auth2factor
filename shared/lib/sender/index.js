exports.register = function (server, options, next) {

    var sender = require('./sender')
        .create(options.logger, options.config);;

    server.expose('instance', sender);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
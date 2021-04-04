exports.register = function (server, options, next) {
    
    var compiler = require('./compiler')
        .create(options.templates, options.logger, options.config);

    server.expose('instance', compiler);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};


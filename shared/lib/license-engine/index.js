exports.register = function (server, options, next) {
    
    var licenseManager = require('./licenseManager')
        .create(options.logger, options.config);;

    server.expose('instance', licenseManager);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
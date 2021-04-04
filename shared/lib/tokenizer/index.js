exports.register = function (server, options, next) {
    
    var tokenizer = require('./tokenizer')
        .create(options.logger, options.config);;

    server.expose('instance', tokenizer);
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
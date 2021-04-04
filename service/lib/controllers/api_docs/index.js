const pages = require('./pages.js');

exports.register = function (plugin, options, next) {
    plugin.route({
        method: 'GET',
        path: '/api_docs',
        config: {
            description: 'List stats',
            notes: 'List stats',
            handler: pages.renderDocs
        }
    });


    plugin.route({
        method: 'GET',
        path: '/images/{file*}',
        handler: {
            directory: {
                path: './node_modules/hapi-swagger/public/swaggerui/images'
            }
        }
    });
    next();
};


exports.register.attributes = {
    pkg: require('./package.json')
};
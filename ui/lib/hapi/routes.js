var debug = require('debug')('frontend:routes');

module.exports = {
    getAssetsRoute: function (directory) {
        return {
            method: 'GET',
            path: '/dist/{a*}',
            handler: {
                directory: {
                    path: __dirname + '/../../dist'
                }
            }
        };
    },

    apiProxy: {
        method: '[GET, POST, PUT, DELETE]',
        path: '/api/*',
        handler: function (req, reply) {
            var app = req.server.app;
            return reply.proxy({
                host: app.config.get('apiServer:host'),
                port: app.config.get('apiServer:port'),
            });
        }
    },

    health: {
        method: 'GET',
        path: '/health',
        handler: function (req, reply) {
            reply('OK');
        }
    }
};
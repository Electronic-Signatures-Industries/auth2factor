'use strict';
const Hapi = require('hapi');
const debug = require('debug')('api:main');
const RuthaUtils = require('rutha-utils');
const MongooseHandler = require('./mongooseHandler');
const Mongoose = require('mongoose');
const JustMail = require('../controllers/shared/justMail');
const OtcMe = require('../controllers/shared/otcMe');
const Logger = require('../controllers/shared/logger');
const JwtTokenizer = require('../controllers/shared/jwtTokenizer');
const bearerTokenValidator = require('./bearerTokenValidator');
const config = RuthaUtils.createConfig({
    path: {
        config: __dirname + '/../../config'
    }
}).load();

// mongoose
let client = Mongoose.connect(config.get('MONGODB_CONFIG'));
client.Promise = global.Promise;
MongooseHandler.bindEvents(client);
MongooseHandler.bindModels({
    mongoose: client,
    modelsPath: __dirname + '/../../models'
});

// add models to mongoose obj
client.models = {
    Adapter: client.model('Adapter'),
    Challenge: client.model('Challenge'),
    Config: client.model('Config'),
    Group: client.model('Group'),
    Log: client.model('Log'),
    Protocol: client.model('Protocol'),
    SecurityKey: client.model('SecurityKey'),
    System: client.model('System'),
    Transport: client.model('Transport'),
    User: client.model('User'),
};

// Create a server with a host and port
let server = module.exports = new Hapi.Server();
const createServer = require('./createServer');
server.connection(createServer(config));

// Dependencies
server.app = {
    jwtTokenService: require('../controllers/shared/jwtTokenizer'),
    mongoose: client,
    config: config,
    logger: console
};

// health check
server.route({
    method: 'GET',
    path: '/api/health',
    config: {
        handler: function (req, reply) {
            reply('OK');
        }
    }
});

debug('Set mongoose, config, logger dependencies');

// add server methods to IoC mongoose models
let controllers = require('./controllers');

let logOptions = {
    reporters: {
        consoleLog: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                hapi: '*',
                log: '*',
                response: '*',
                error: '*',
                'request': '*'
            }]
        }, {
            module: 'good-console'
        }, 'stdout'],
    }
};

let serverPlugins = require('./serverPlugins')(config, logOptions);

process.on('uncaughtException', function (err) {
    console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
    console.error(err.stack);
    process.exit(1);
});

server.register(serverPlugins, function (err) {

    server.views({
        path: __dirname + '/../controllers/api_docs/templates',
        engines: {
            html: require('handlebars')
        },
        partialsPath: __dirname + '/../controllers/api_docs/templates/withPartials',
        isCached: false
    });

    let ConfigModel = server.app.mongoose.models.Config;

    server.auth.strategy('token', 'bearer-access-token', {
        validateFunc: bearerTokenValidator(server, config.get('JWT_SECRET'), ConfigModel, JwtTokenizer)
    });

    const justMail = new JustMail({
        jwtSecret: config.get('JWT_SECRET'),
    });

    const otcMe = new OtcMe();

    const dbLogger = new Logger({
        models: server.app.mongoose.models
    });

    const messaging = require('./messagingMethods')(server.app.logger, ConfigModel, justMail, otcMe);
    const logging = require('./loggerMethods')(dbLogger);

    // register utils
    server.method([].concat(messaging, logging));

    server.register(controllers, {
        routes: {
            prefix: '/api'
        }
    }, function () {
        if (!module.parent) {
            server.start(function () {
                console.log('Server started at port ' + server.info.port);
            });
        }
    });

});
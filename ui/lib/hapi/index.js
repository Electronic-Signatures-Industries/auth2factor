// Frontend server init
/*jshint esversion: 6 */
/*eslint-env node*/
const Hapi = require('hapi');
const RuthaUtils = require('rutha-utils');
const routes = require('./routes');
const Inert = require('inert');

let config = RuthaUtils.createConfig({
  path: {
    config: __dirname + '/../../config'
  }
}).load();

let logger = RuthaUtils.createLogger({
  filename: config.get('logger:filename')
});


let viewOptions = require('./server_options');

// Create a server with a host and port
let server = module.exports = new Hapi.Server();
server.connection({
  // host: config.get('feServer:host'),
  port: config.get('FE_PORT') || config.get('feServer:port')
});

let compiler = function (template, options) {
  return require('underscore').template(template, options || {});
};


server.app = {
  config: config,
  logger: logger,
  templateCompiler: compiler
};

let controllers = [{
  register: require('../controllers/main')
}];


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

let serverControllers = [{
  register: require('vision')
}, {
  register: Inert
}, {
  register: require('good'),
  options: logOptions
}, {
  register: require('hapi-auth-cookie')
}];

function LoadServer(feServer, feControllers) {
  feServer.register(serverControllers, function () {

    feServer.views(viewOptions);
    // statics
    feServer.route(routes.getAssetsRoute());

    // health check
    feServer.route(routes.health);
    feServer.auth.strategy('session', 'cookie', {
      password: config.get('JWT_SECRET_SESSION'),
      cookie: 'sid',
      isSecure: true,
      isHttpOnly: true,
      ttl: 15*60*1000 // 15 min
    });
    // feServer.auth.strategy('session', 'bearer-access-token', bearerConfig(feServer));

    feServer.register(feControllers, function () {
      if (!module.parent) {
        feServer.start(function () {
          console.log('Server started at port ' + feServer.info.port);
        });
      }
    });

  });
}

LoadServer(server, controllers);

process.on('uncaughtException', function (err) {
  console.error((new Date()).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});
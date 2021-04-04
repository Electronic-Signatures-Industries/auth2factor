/*jshint esversion: 6 */
/*eslint-env node*/
const Boom = require('boom');
const rq = require('request');
const apiBase = '/api/v1/users';
const apiProfileBase = '/api/v1/profile';

function getApiUrl(config) {
    let host = config.get('API_HOST') || config.get('apiServer:host');
    let port = config.get('API_PORT') || config.get('apiServer:port');
    return `http://${host}:${port}`;
}

exports.authenticate = function (request, reply) {
    'use strict';

    let server = request.server;

    let apiServer = getApiUrl(server.app.config);


    let opts = {
        url: apiServer + '/api/v2/users/authenticate',
        json: true,
        body: request.payload,
        headers: request.headers
    };
    // POST
    rq.post(opts, (err, resp) => {
        if (err) {
            server.log(['frontend', 'error'], err);
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }

        if (resp && resp.statusCode !== 201) {
            return reply(Boom.create(resp.statusCode, resp.message));
        } else {
            // 201

            if (resp.headers['x-u2f-sign-request']) {
                return reply()
                    .header('X-APP-SIGN-REQUEST', resp.headers['x-app-sign-request'])
                    .header('X-U2F-SIGN-REQUEST', resp.headers['x-u2f-sign-request'])
                    .state('user', {
                        email: request.payload.email,
                    })
                    .code(200);
            } else {
                return reply()
                    .header('X-APP-SIGN-REQUEST', resp.headers['x-app-sign-request'])
                    .state('user', {
                        email: request.payload.email,
                    })
                    .code(200);
            }

        }


    });
};


exports.otc = function (request, reply) {
    'use strict';

    const server = request.server;
    const hostname = server.app.config.get('FE_HOSTNAME');
    let apiServer = getApiUrl(server.app.config);

    const opts = {
        url: apiServer + '/api/v2/users/otc',
        json: true,
        body: request.payload,
        headers: request.headers
    };
    // POST
    rq.post(opts, (err, resp) => {
        if (err) {
            server.log(['frontend', 'error'], err);
            return reply(Boom.create(resp.statusCode, err.message));
        }

        if (resp && resp.statusCode === 400) {
            return reply(Boom.create(resp.statusCode, 'Código debe ser 6 digitos'));
        } else if (resp && resp.statusCode !== 201) {
            return reply(Boom.create(resp.statusCode));
        } else {
            // 201
            let session = {
                email: request.state.user.email,
                group: resp.headers['x-app-account-group'],
                logged: true
            };

            request.cookieAuth.set(session);
            return reply()
                .header('X-APP-BEARER', resp.headers['x-app-bearer'])
                .location(hostname + '/')
                .code(201);

        }
    });
};

exports.u2f = function (request, reply) {
    'use strict';

    const server = request.server;
    const hostname = server.app.config.get('FE_HOSTNAME');
    let apiServer = getApiUrl(server.app.config);



    const opts = {
        url: apiServer + '/api/v2/users/u2f',
        json: true,
        body: request.payload,
        headers: request.headers
    };
    // POST
    rq.post(opts, (err, resp) => {
        if (err) {
            server.log(['frontend', 'error'], err);
            return reply(Boom.create(resp.statusCode, err.message));
        }

        if (resp && resp.statusCode === 400) {
            return reply(Boom.create(resp.statusCode, 'Ingrese U2F'));
        } else if (resp && resp.statusCode !== 201) {
            return reply(Boom.create(resp.statusCode));
        } else {
            // 201
            let session = {
                email: request.state.user.email,
                group: resp.headers['x-app-account-group'],
                logged: true
            };

            // let sid = tokenGenerator.sign(session, {
            //     secret: server.app.config.get('JWT_SECRET_SESSION'),
            // }, 15);
            request.cookieAuth.set(session);


            return reply()
                .header('X-APP-BEARER', resp.headers['x-app-bearer'])
                .location(hostname + '/')
                .code(201);

        }
    });
};

exports.confirm = function (request, reply) {

    'use strict';

    const server = request.server;
    const hostname = server.app.config.get('FE_HOSTNAME');
    let apiServer = getApiUrl(server.app.config);



    const opts = {
        url: apiServer + apiBase + '/confirm?token=' + request.query.token,
        json: true,
        headers: request.headers
    };

    server.log(['frontend', 'info'], opts);
    // GET
    rq.get(opts, (err, resp) => {

        if (err) {
            server.log(['frontend', 'error'], err);
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }

        if (resp && resp.statusCode === 403) {
            return reply().redirect(hostname + '/user?code=403#profile/');
        } else if (resp && resp.statusCode !== 200) {
            return reply().redirect(hostname + '/user?code=' + resp.statusCode + '#profile/');
        } else {
            let token = resp.headers['x-app-autentifactor-reset'];

            // 200
            return reply()
                .redirect(hostname + '/user#profile/' + token);
        }
    });

};

exports.getProfileReset = function (request, reply) {

    'use strict';


    var server = request.server;

    let apiServer = getApiUrl(server.app.config);


    var opts = {
        url: apiServer + apiProfileBase + '/reset?token=' + request.query.token,
        json: true,
        gzip: true,
        headers: request.headers
    };

    // GET
    rq.get(opts, function (err, resp, body) {
        if (err) {
            server.log(['frontend', 'error'], err);
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }

        if (resp && resp.statusCode === 403) {
            return reply().code(403);
        } else if (resp && resp.statusCode === 404) {
            return reply().code(403);
        } else if (resp && resp.statusCode !== 200) {
            return reply().code(resp.statusCode);
        } else {
            // 200
            var session = {
                email: body.account,
                token: resp.headers['x-app-autentifactor']
            };

            return reply(body)
                .state('user', {
                    email: body.account,
                })
                .header('X-APP-OTC', session.token)
                .code(200);
        }
    });

};
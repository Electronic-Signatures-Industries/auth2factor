const Hapi = require('hapi');
const Boom = require('boom');
const debug = require('debug')('api:security_keys');
const u2f = require('u2f');
const _ = require('underscore');


exports.generateServerChallenge = function (request, reply) {
    'use strict';
    let server = request.server;
    let apiSettings = request.pre.apiAuthorizationFactory;
    let hostname = server.app.config.get('FE_HOSTNAME');
    debug(apiSettings);
    if (apiSettings && apiSettings.u2fAppId) {
        hostname = apiSettings.u2fAppId;
    }

    let ChallengeModel = server.app.mongoose.models.Challenge;
    let User = request.pre.userModel;
    let authenticationRequest = u2f.request(hostname);

    // Clean challenge temp
    ChallengeModel.remove({
        userId: User.id
    }, function (err) {
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }
        // Save challenge
        ChallengeModel.add({
            userId: User.id,
            version: authenticationRequest.version,
            appId: authenticationRequest.appId,
            challenge: authenticationRequest.challenge
        }, function (err1, model) {
            if (err1) {
                server.methods.logError({
                    request: request,
                    log: err1.message,
                    user: request.auth.credentials.email
                });
                return;
            }

            if (model) {
                server.methods.logInfo({
                    request: request,
                    log: 'U2F Challenge guardado',
                    user: request.auth.credentials.email
                });
                if (request.query.view && request.query.view === 'location') {
                    let loc = authenticationRequest.appId + '/api/v2/security_keys/challenge/' +
                    authenticationRequest.challenge + '?' + authenticationRequest.version;
                    return reply()
                        .location(loc)
                        .code(201);
                } else {
                    return reply()
                        .header('X-APP-U2F-VERSION', authenticationRequest.version)
                        .header('X-APP-U2F-APPID', authenticationRequest.appId)
                        .header('X-APP-U2F-CHALLENGE', authenticationRequest.challenge)
                        .code(201);
                }
            } else {
                server.methods.logError({
                    request: request,
                    log: 'Un error ocurrio',
                    user: request.auth.credentials.email
                });
                reply(Boom.badRequest('Un error ocurrio.'));
            }
        });

    });
};


/**
 * Deletes a config
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.remove = function (request, reply) {
    'use strict';
    let server = request.server;
    let SecurityKeyModel = server.app.mongoose.models.SecurityKey;


    SecurityKeyModel.remove({
        publicKey: request.params.id,
    }, function (err) {
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }
        server.methods.logInfo({
            request: request,
            log: 'Security Key removido: ' + request.params.id.substr(0, 10) + '...',
            user: request.auth.credentials.email
        });

        return reply().code(204);

    });
};


/**
 * Registers a security key
 * 
 * @param {any} request
 * @param {any} reply
 */
exports.register = function (request, reply) {
    'use strict';
    let server = request.server;
    let apiSettings = request.pre.apiAuthorizationFactory;
    let hostname = server.app.config.get('FE_HOSTNAME');
    debug(apiSettings);
    if (apiSettings && apiSettings.u2fAppId) {
        hostname = apiSettings.u2fAppId;
    }
    var ChallengeModel = server.app.mongoose.models.Challenge;
    var SecurityKeyModel = server.app.mongoose.models.SecurityKey;
    var User = request.pre.userModel;

    if (request.payload.clientData && request.payload.registrationData) {
        ChallengeModel.findOne({
            userId: User.id,
            appId: hostname
        })
            .sort({
                $natural: -1
            })
            .exec(function (err, challenge) {
                if (err) {
                    server.methods.logError({
                        request: request,
                        log: err.message,
                        user: request.auth.credentials.email
                    });
                    return;
                }

                if (challenge) {
                    debug(challenge);
                    var checkres = u2f.checkRegistration(challenge, {
                        clientData: request.payload.clientData,
                        registrationData: request.payload.registrationData
                    });

                    if (checkres.successful) {
                        // Clean challenge temp
                        ChallengeModel.remove({
                            userId: User.id
                        }, function (err) {
                            if (err) {
                                server.methods.logError({
                                    request: request,
                                    log: err.message,
                                    user: request.auth.credentials.email
                                });
                                return;
                            }

                            // Register security key
                            SecurityKeyModel.register({
                                userId: User.id,
                                appId: hostname,
                                keyHandle: checkres.keyHandle,
                                publicKey: checkres.publicKey,
                                description: request.payload.description || ''
                            }, function (err, key) {
                                server.methods.logInfo({
                                    request: request,
                                    log: 'Security Key guardado',
                                    user: request.auth.credentials.email
                                });
                                return reply().code(201);
                            });

                        });
                    } else {
                        // checkres.errorMessage will contain error text.
                        server.methods.logError({
                            request: request,
                            log: checkres.errorMessage,
                            user: request.auth.credentials.email
                        });
                        reply(Boom.badRequest(checkres.errorMessage));
                    }


                } else {
                    server.methods.logError({
                        request: request,
                        log: 'Un error ocurrio',
                        user: request.auth.credentials.email
                    });
                    reply(Boom.badRequest('Un error ocurrio.'));
                }
            });
    } else {
        server.methods.logInfo({
            request: request,
            log: 'Datos del dispositivo no encontrados',
            user: request.auth.credentials.email
        });
        reply(Boom.badRequest('Datos del dispositivo no encontrados.'));
    }
};


exports.list = function (request, reply) {
    'use strict';
    let server = request.server;
    let SecurityKeyModel = server.app.mongoose.models.SecurityKey;
    let User = request.pre.userModel;

    let fields = 'userId publicKey keyHandle description created updated appId';
    SecurityKeyModel.find({
        userId: User.id
    }, fields, function (err, keys) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }


        if (keys) {
            let model = _.map(keys, function (key) {
                return {
                    appId: key.appId,
                    publicKey: key.publicKey,
                    created: key.created,
                    updated: key.updated,
                    description: key.description
                };

            });

            server.methods.logInfo({
                request: request,
                log: 'Listado de llaves de seguridad',
                user: request.auth.credentials.email
            });

            return reply({
                securityKeys: model
            }).code(200);
        } else {
            server.methods.logInfo({
                request: request,
                log: 'Listado de llaves de seguridad sin registros',
                user: request.auth.credentials.email
            });

            return reply({
                securityKeys: []
            }).code(200);
        }

    });

};

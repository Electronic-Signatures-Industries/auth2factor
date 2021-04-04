const Hapi = require('hapi');
const Boom = require('boom');
const debug = require('debug')('api:security_keys');
const u2f = require('u2f');
const _ = require('underscore');


exports.authenticate = function (request, reply) {
    'use strict';
    var server = request.server;
    var hostname = server.app.config.get('FE_HOSTNAME');
    var ChallengeModel = server.app.mongoose.models.Challenge;
    var SecurityKeyModel = server.app.mongoose.models.SecurityKey;
    var User = request.pre.userModel;

    if (request.payload.clientData && request.payload.signatureData) {
        var clientDataObj = {};
        var clientData = new Buffer(request.payload.clientData, 'base64');
        try {
            clientDataObj = JSON.parse(clientData.toString('utf8'));
        } catch (e) {
            return reply({
                success: false,
                error: "Invalid clientData: not a valid JSON object"
            });

        }
        
        // Find auth request
        ChallengeModel.findOne({
                challenge: clientDataObj.challenge
            })
            .exec(function (err, challenge) {
                if (err) {
                    server.methods.logError({
                        request: request,
                        log: err.message,
                        user: User.email
                    });
                    return;
                }
            
                // Find device
                SecurityKeyModel.findOne({
                    userId: User.id,
                    keyHandle: challenge.keyHandle
                }, function (err, device) {

                    var signResult = {
                        clientData: request.payload.clientData,
                        signatureData: request.payload.signatureData
                    };
                    var checkres = u2f.checkSignature(challenge, signResult, device.publicKey);

                    if (checkres.successful) {
                        // User is authenticated.
                        return reply({
                            success: true,
                            startsWithKey: device.publicKey.substring(0, 5)
                        });
                    } else {
                        // checkres.errorMessage will contain error text.
                        return reply({
                            success: false,
                            error: checkres.errorMessage
                        });
                    }
                });

            });
    } else {
        server.methods.logInfo({
            request: request,
            log: 'Datos del dispositivo no encontrados',
            user: User.email
        });
        reply(Boom.badRequest('Datos del dispositivo no encontrados.'));
    }
};

// Finds  any security keys for an user, any domain
exports.getSecurityKeys = function (request, reply) {
    'use strict';
    const server = request.server;
    const user = request.pre.userModel;
    const SecurityKeyModel = server.app.mongoose.models.SecurityKey;

    SecurityKeyModel.find({
        userId: user.id
    }, function (err, keys) {
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: user.email
            });
            return reply();
        }

        return reply(keys);
    });
};

// Generates U2F 1.0 sign requests
// for current hostname or API appId domain  
exports.generateSignRequests = function (request, reply) {
    'use strict';
    const server = request.server;
    let apiSettings = request.pre.apiAuthorizationFactory;
    let hostname = server.app.config.get('FE_HOSTNAME');
    const ChallengeModel = server.app.mongoose.models.Challenge;
    const user = request.pre.userModel;
    const securityKeys = request.pre.securityKeys;

    if (securityKeys.length === 0) {
        return reply([]);
    }
    let challenges = [];

    // current hostname sign requests
    for (let key of securityKeys) {
        let authenticationRequest = u2f.request(hostname, key.keyHandle);
        challenges.push(authenticationRequest);
    }

    // API appId sign requests    
    if (apiSettings && apiSettings.u2fAppId) {
        challenges = [];
        hostname = apiSettings.u2fAppId;
        for (let key of securityKeys) {
            if (hostname === key.appId) {
                let authenticationRequest = u2f.request(hostname, key.keyHandle);
                challenges.push(authenticationRequest);
            }        
        }
    }
    
    if (challenges.length === 0) {
        return reply(challenges);
    }

    // Clean challenge temp
    ChallengeModel.remove({
        userId: user.id
    }, function (err) {
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: user.email
            });
            return;
        }
        // Save challenge
        ChallengeModel.collection.insert(challenges, function (err, models) {
            if (err) {
                server.methods.logError({
                    request: request,
                    log: err.message,
                    user: user.email
                });
                return;
            }

            if (models) {
                server.methods.logInfo({
                    request: request,
                    log: 'U2F pedido de autenticacion guardado',
                    user: user.email
                });

                return reply(challenges);

            } else {
                server.methods.logError({
                    request: request,
                    log: 'No hay llaves registradas',
                    user: user.email
                });
                return reply(challenges);
            }
        });
    });
};
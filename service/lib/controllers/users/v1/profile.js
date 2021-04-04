const Boom = require('boom');
const debug = require('debug')('api:profile');
const SnsManager = require('../../shared/awsSnsRegister');

exports.getLicense = function (request, reply) {
    'use strict';
    const server = request.server;
    const ConfigModel = server.app.mongoose.models.Config;

    ConfigModel.get({
        key: 'license'
    }, function (err, config) {
        const denied = Boom.unauthorized('No hay licencia');
        if (err) {
            server.app.logger.error(err);
            return reply(Boom.internal('Error', err));
        }

        if (!config) {
            return reply(denied);
        }

        const lic = JSON.parse(config.settings.license);

        return reply(lic);
    });

};

exports.decodeProfileResetToken = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;

    Tokenizer.verify(request.query.token, {
        secret: jwtSecret
    }, function (err, decoded) {
        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: null
            });
            return reply(err.name);
        }

        return reply(decoded);
    });

};

exports.decodeOtcChangeRequest = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;

    if (request.payload.seedChangeRequest) {
        Tokenizer.verify(request.payload.seedChangeRequest, {
            secret: jwtSecret
        }, function (err, decoded) {
            if (err) {
                server.methods.logger({
                    tag: 'error',
                    request: request,
                    log: err.message,
                    user: null
                });
                return reply(err.name);
            }

            return reply(decoded);
        });
    } else {
        return reply(null);
    }
};

exports.updateResetProfile = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;
    const user = request.auth.credentials;
    const seed = request.pre.seed;


    if (request.auth.credentials) {
        UserModel.modify({
            email: user.email,
            password: request.payload.password,
            otcSecret: seed,
            preferSoftToken: request.payload.preferSoftToken,
            inactive: false
        }, function (err, user) {

            if (err) {
                server.methods.logger({
                    tag: 'error',
                    request: request,
                    log: err.message,
                    user: user.email
                });
                return;
            }

            if (user) {

                if (request.payload.password) {
                    server.methods.logInfo({
                        request: request,
                        log: 'Cambio de contraseña exitoso.',
                        user: user.email
                    });
                }

                if (seed) {
                    server.methods.logInfo({
                        request: request,
                        log: 'Cambio de semilla OTC exitoso.',
                        user: user.email
                    });
                }

                return reply().code(204);
            } else {
                server.methods.logError({
                    request: request,
                    log: 'Cambio de perfil inválido.',
                    user: user.email
                });
                return reply(Boom.badRequest('Cambio de perfil inválido.'));
            }
        });


    } else {
        server.methods.logError({
            request: request,
            log: 'No ha sido autenticado.',
            user: user.email
        });
        return reply(Boom.unauthorized('No ha sido autenticado.'));
    }

};

/**
 * Returns QR as SVG
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.resetSettings = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;
    const resetProfileInfo = request.pre.resetProfileInfo;
    const licenseInfo = request.pre.licenseInfo;
    const UserModel = server.app.mongoose.models.User;

    if (!resetProfileInfo.account) {
        return reply(Boom.forbidden());
    }

    UserModel.findOne({
        email: resetProfileInfo.account,
        inactive: false
    }, function (err, user) {

        const issuer = licenseInfo.Company;

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: resetProfileInfo.account
            });
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }

        if (!user) {
            // 404
            const info1 = 'No se encontro el usuario';
            server.methods.logInfo({
                request: request,
                log: info1,
                user: resetProfileInfo.account
            });
            return reply(Boom.notFound(info1));
        }

        if (user && !user.hasEmailConfirmed) {
            // 404
            const info2 = 'El usuario no se ha confirmado';
            server.methods.logInfo({
                request: request,
                log: info2,
                user: resetProfileInfo.account
            });
            return reply(Boom.notFound(info2));
        }

        try {
            const seedOpts = user.generateQRSeed(issuer);
            const session = {
                accountRequester: resetProfileInfo.account,
                isReset: true,
                retries: 4,
                timestamp: new Date()
            };

            // expires in 30 min
            const seconds = 30 * 60;
            const apiToken = Tokenizer
                .signDataExpiresInSeconds(session, {
                    secret: jwtSecret
                }, seconds);
            const encryptedSeed = Tokenizer.signData(seedOpts.seed, {
                    secret: jwtSecret
                }, seconds);
            return reply({
                    preferSoftToken: user.preferSoftToken,
                    account: resetProfileInfo.account,
                    qr: seedOpts.qr,
                    visibleCode: seedOpts.visibleCode,
                    otcChangeRequest: encryptedSeed
                })
                .header('X-APP-AUTENTIFACTOR', apiToken)
                .code(200);
        } catch (otpError) {
            debug(otpError);
            server.methods.logError({
                request: request,
                log: otpError.message,
                user: resetProfileInfo.account
            });
            // 5xx
            return reply(Boom.internal('Problemas del servidor OTP'));
        }
    });

};

/**
 * Gets an user profile info
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.info = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;
    const GroupModel = server.app.mongoose.models.Group;
    const ConfigModel = server.app.mongoose.models.Config;

    UserModel.findOne({
        email: request.auth.credentials.email,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }

        if (!user) {
            // 404
            const info1 = 'No se encontro el usuario';
            server.methods.logInfo({
                request: request,
                log: info1,
                user: request.auth.credentials.email
            });
            return reply(Boom.notFound(info1));
        }

        if (user && !user.hasEmailConfirmed) {
            // 404
            const info2 = 'El usuario no se ha confirmado';
            server.methods.logInfo({
                request: request,
                log: info2,
                user: request.auth.credentials.email
            });
            return reply(Boom.notFound(info2));
        }

        GroupModel.findOne({
            group: user.group
        }, function (err, group) {
            if (err) {
                server.methods.logger({
                    tag: 'error',
                    request: request,
                    log: err.message,
                    user: request.auth.credentials.email
                });
                // 5xx
                return reply(Boom.internal('Problemas del servidor'));
            }

            ConfigModel.findOne({
                key: group.transport.id
            }, function (err, config) {
                if (err) {
                    server.methods.logger({
                        tag: 'error',
                        request: request,
                        log: err.message,
                        user: request.auth.credentials.email
                    });
                    // 5xx
                    return reply(Boom.internal('Problemas del servidor'));
                }

                const model = {
                    group: user.group,
                    transport: config.description,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    created: user.created,
                    updated: user.updated,
                    pushDeviceName: user.pushDeviceName,
                    pushDeviceUuid: user.pushDeviceUuid,
                    preferSoftToken: user.preferSoftToken
                };
                debug(model);
                return reply(model)
                    .code(200);
            });
        });

    });

};


/**
 * Registers a device
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.registerDevice = function (request, reply) {
    'use strict';
    const server = request.server;
    const config = server.app.config;
    const UserModel = server.app.mongoose.models.User;

    UserModel.findOne({
        email: request.auth.credentials.email,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            // 5xx
            return reply(Boom.internal('Problemas del servidor'));
        }
        if (!user) {
            // 404
            const info1 = 'No se encontro el usuario';
            server.methods.logger({
                tag: 'info',
                request: request,
                log: info1,
                user: request.auth.credentials.email
            });
            return reply(Boom.notFound(info1));
        }

        if (user && !user.hasEmailConfirmed) {
            // 404
            const info2 = 'El usuario no se ha confirmado';
            server.methods.logger({
                tag: 'info',
                request: request,
                log: info2,
                user: request.auth.credentials.email
            });
            return reply(Boom.notFound(info2));
        }

        const deviceManager = new SnsManager({
            region: config.get('aws:region'),
            gcmPlatformAppArn: config.get('aws:gcm'),
            apnsPlatformAppArn: config.get('aws:apns')
        });

        deviceManager.register({
            deviceToken: request.payload.deviceToken,
            platform: request.payload.platform
        }, function (err, data) {
            debug(err);
            //                if (err) {
            //                    server.methods.logError({
            //                        request: request,
            //                        log: err.message,
            //                        user: request.auth.credentials.email
            //                    });
            //                    return;
            //                }            
            UserModel.modifyPushDevice({
                email: request.auth.credentials.email,
                pushDeviceUuid: request.payload.deviceUuid,
                pushDeviceName: request.payload.deviceName,
                pushDeviceEndpoint: data.endpointArn
            }, function (err, model) {
                if (err) {
                    server.methods.logError({
                        request: request,
                        log: err.message,
                        user: request.auth.credentials.email
                    });
                    return;
                }

                if (model) {
                    server.methods.logInfo({
                        request: request,
                        log: 'Cuenta actualizada con datos de dispositivo: ' + request.auth.credentials.email,
                        user: request.auth.credentials.email
                    });

                    return reply().code(204);

                } else {

                    server.methods.logError({
                        request: request,
                        log: 'Nombre de usuario no ha sido encontrado.',
                        user: request.auth.credentials.email
                    });
                    reply(Boom.badRequest('Nombre de usuario no ha sido encontrado.'));
                }
            });
        });

    });

};


/**
 * unregisters a device
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.unregisterDevice = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;

    UserModel.modifyPushDevice({
        email: request.auth.credentials.email,
        pushDeviceUuid: null,
        pushDeviceName: null,
        pushDeviceEndpoint: null
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
            log: 'Dispositivo removido',
            user: request.auth.credentials.email
        });

        return reply().code(204);

    });
};
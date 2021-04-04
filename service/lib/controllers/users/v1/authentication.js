const Boom = require('boom');
const debug = require('debug')('api:authentication');

/**
 * Validates token bearer is still active
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.ping = function (request, reply) {

    'use strict';

    return reply({
        result: 'OK'
    });
};


/**
 * Requests an OTC
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.requestOtc = function (request, reply) {

    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;
    const UserModel = server.app.mongoose.models.User;
    const GroupModel = server.app.mongoose.models.Group;

    UserModel.findOne({
        email: request.auth.credentials.accountRequester,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.auth.credentials.accountRequester
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
                user: request.auth.credentials.accountRequester
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
                user: request.auth.credentials.accountRequester
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
                    user: request.auth.credentials.accountRequester
                });
                // 5xx
                return reply(Boom.internal('Problemas del servidor'));
            }

            // send token
            server.methods.sendToken({
                    user: user,
                    isReset: request.auth.credentials.isReset,
                    transportId: group.transport.id,
                    request: request
                },
                function (err, resp) {
                    if (err) {
                        server.methods.logger({
                            tag: 'error',
                            request: request,
                            log: err.message,
                            user: user.email
                        });

                        return;
                    }
                    server.methods.logger({
                        tag: 'info',
                        request: request,
                        log: 'Token enviado',
                        user: user.email
                    });
                });


            // 200
            const retries = request.auth.credentials.retries;
            if (retries < 1) {
                const info3 = 'No se ha autenticado o sobrepaso el limite de reintentos. Debe autenticarse para obtener código.';
                server.methods.logger({
                    tag: 'info',
                    request: request,
                    log: info3,
                    user: user.email
                });
                return reply(Boom.badRequest(info3));

            } else {
                const session = {
                    accountRequester: user.email,
                    retries: retries - 1,
                    timestamp: new Date()
                };


                // expires in 13 min
                let seconds = 13 * 60;
                if (process.env.DEBUG_OTC) {
                    seconds = 2;
                }
                const apiToken = Tokenizer
                    .signDataExpiresInSeconds(session, {
                        secret: jwtSecret
                    }, seconds);

                server.methods.logger({
                    tag: 'info',
                    request: request,
                    log: 'OTC reintentos: ' + session.retries,
                    user: user.email
                });

                return reply()
                    .header('X-APP-RESET-RETRIES', session.retries)
                    .header('X-APP-AUTENTIFACTOR', apiToken)
                    .code(200);
            }
        });

    });


};

/**
 * Authenticates 2FA token and returns 200 (OK) or 401
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.otc = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;

    UserModel.findOne({
        email: request.auth.credentials.accountRequester,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.auth.credentials.accountRequester
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
                user: request.auth.credentials.accountRequester
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
                user: request.auth.credentials.accountRequester
            });
            return reply(Boom.notFound(info2));
        }

        const session = {
            email: user.email,
            group: user.group,
            displayName: request.auth.credentials.displayName,
            firstName: user.firstName,
            created: user.created,
            updated: user.updated,
            timestamp: new Date()
        };

        try {
            const result = user.verifyOTC(request.payload.code);
            debug(result);
            if (result) {

                if (request.auth.credentials.isReset) {
                    server.methods.logger({
                        tag: 'info',
                        request: request,
                        log: 'Cuenta restablecida',
                        user: user.email
                    });
                } else {
                    server.methods.logger({
                        tag: 'info',
                        request: request,
                        log: 'Autenticado en el segundo paso',
                        user: user.email
                    });
                }

                // Expires every 24 h
                const seconds = 60 * 60 * 24;
                const apiToken = Tokenizer
                    .signDataExpiresInSeconds(session, {
                        secret: jwtSecret
                    }, seconds);

                return reply()
                    .header('X-APP-AUTENTIFACTOR-BEARER', apiToken)
                    .header('X-APP-AUTENTIFACTOR-ACCOUNT-GROUP', user.group)
                    .code(201);

            } else {
                // 401
                server.methods.logger({
                    tag: 'info',
                    request: request,
                    log: 'OTP Inválido o Expirado',
                    user: user.email
                });
                return reply(Boom.unauthorized('OTP Inválido o Expirado'));
            }
        } catch (otpError) {
            debug(otpError);
            server.methods.logger({
                tag: 'error',
                request: request,
                log: otpError.message,
                user: user.email
            });
            // 5xx
            return reply(Boom.internal('Problemas del servidor OTP'));
        }
    });

};

/**
 * Authenticates an user and returns an API token
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.login = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;
    const UserModel = server.app.mongoose.models.User;
    const GroupModel = server.app.mongoose.models.Group;

    let doSendOtc = false;
    // default is to always send
    if (request.payload.doRequestOtc === null || request.payload.doRequestOtc === undefined || request.payload.doRequestOtc === true) {
        doSendOtc = true;
    }

    UserModel.findOne({
        email: request.payload.email,
        inactive: false
    }, function (err, user) {
        debug(user);


        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.payload.email
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
                user: request.payload.email
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
                user: request.payload.email
            });
            return reply(Boom.notFound(info2));
        }

        GroupModel.validate({
            user: user,
            password: request.payload.password
        }, function (err, group, options) {
            if (err) {
                server.methods.logger({
                    tag: 'error',
                    request: request,
                    log: err.message,
                    user: request.payload.email
                });
                // 5xx
                return reply(Boom.internal('Problemas del servidor'));
            }
            let isValid = options.isValid;
            debug(options);
            if (options.requiresSystemLogin) {
                isValid = isValid && user.validPassword(request.payload.password);
            }

            if (isValid) {
                let displayName = user.firstName + ' ' + user.lastName;
                if (displayName.length < 2) {
                    displayName = user.email;
                }

                if (doSendOtc) {
                    debug('doRequestOtc:' + doSendOtc);
                    // send token
                    server.methods.sendToken({
                            user: user,
                            isReset: false,
                            transportId: group.transport.id,
                            request: request
                        },
                        function (err, resp) {
                            if (err) {
                                server.methods.logger({
                                    tag: 'error',
                                    request: request,
                                    log: err.message,
                                    user: user.email
                                });

                                return;
                            }
                            server.methods.logger({
                                tag: 'info',
                                request: request,
                                log: 'Token enviado',
                                user: user.email
                            });
                        });
                }

                server.methods.logger({
                    tag: 'info',
                    request: request,
                    log: 'Autenticado en el primer paso',
                    user: request.payload.email
                });

                // 201
                const session = {
                    accountRequester: user.email,
                    displayName: displayName,
                    retries: 3,
                    timestamp: new Date()
                };

                // expires in 13 min
                let seconds = 13 * 60;
                if (process.env.DEBUG_OTC) {
                    seconds = 2;
                }
                const apiToken = Tokenizer
                    .signDataExpiresInSeconds(session, {
                        secret: jwtSecret
                    }, seconds);

                return reply()
                    .header('X-APP-AUTENTIFACTOR', apiToken)
                    .code(201);
            } else {
                // 400
                const info3 = 'Contraseña inválida';
                server.methods.logger({
                    tag: 'info',
                    request: request,
                    log: info3,
                    user: request.payload.email
                });
                return reply(Boom.badRequest(info3));
            }
        });

    });

};

/**
 * Reads a confirmation token
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.decodeConfirmationToken = function (request, reply) {
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
            return reply(err.message);
        }

        reply(decoded);
    });

};

/**
 * Confirms and activates an enrollment
 * Sends an OTC configuration link
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.confirm = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;
    const userConfirmation = request.pre.confirmation;

    if (!userConfirmation.email) {
        return reply(Boom.forbidden());
    }

    UserModel.confirm({
        email: userConfirmation.email
    }, function (err, user) {
        if (err) {
            const internalErr = Boom.internal('Error while trying to confirm user', err);
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: userConfirmation.email
            });
            return reply(internalErr);
        }

        if (user) {
            return reply()
                .header('X-APP-AUTENTIFACTOR-RESET', userConfirmation.resetToken)
                .code(200);
        } else {
            const info = 'Confirmación inválida.';
            server.methods.logger({
                tag: 'info',
                request: request,
                log: info,
                user: userConfirmation.email
            });
            return reply(Boom.badRequest(info));
        }
    });
};
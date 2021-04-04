const Boom = require('boom');
const debug = require('debug')('api:authentication:v2');

/**
 * Authenticates security key and returns 200 (OK) or 401
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.authenticateSecurityKey = function (request, reply) {
    'use strict';
    const server = request.server;
    const user = request.pre.userModel;
    const Tokenizer = server.app.jwtTokenService;
    const u2fSignResponse = request.pre.u2fSignResponse;
    const jwtSecret = server.app.config.get('JWT_SECRET');

    let session = {
        email: user.email,
        group: user.group,
        displayName: request.auth.credentials.displayName,
        firstName: user.firstName,
        created: user.created,
        timestamp: new Date()
    };

    if (request.auth.credentials.apiUniqueId) {
        session.apiUniqueId = request.auth.credentials.apiUniqueId;
    }

    if (u2fSignResponse.success) {
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
                log: 'Autenticado en el segundo paso (U2F ' + u2fSignResponse.startsWithKey + ')',
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
            .header('X-APP-BEARER', apiToken)
            .header('X-APP-ACCOUNT-GROUP', user.group)
            .code(201);
    } else {
        // 401
        server.methods.logger({
            tag: 'info',
            request: request,
            log: `U2F Error: ${u2fSignResponse.error}`,
            user: user.email
        });
        return reply(Boom.unauthorized(`U2F Error: ${u2fSignResponse.error}`));
    }
};


/**
 * Authenticates 2FA token and returns 200 (OK) or 401
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.otc = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const UserModel = server.app.mongoose.models.User;
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

        let session = {
            email: user.email,
            group: user.group,
            displayName: request.auth.credentials.displayName,
            firstName: user.firstName,
            created: user.created,
            timestamp: new Date()
        };

        if (request.auth.credentials.apiUniqueId) {
            session.apiUniqueId = request.auth.credentials.apiUniqueId;
        }

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
                    .header('X-APP-BEARER', apiToken)
                    .header('X-APP-ACCOUNT-GROUP', user.group)
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
    const GroupModel = server.app.mongoose.models.Group;
    const user = request.pre.userModel;

    let doSendOtc = false;

    // default is to always send
    if (request.payload.doRequestOtc === null ||
        request.payload.doRequestOtc === undefined || request.payload.doRequestOtc === true) {
        doSendOtc = true;
    }

    let isValid = user.validPassword(request.payload.password);

    if (isValid) {
        let displayName = `${user.firstName} ${user.lastName}`;
        if (displayName.length < 2) {
            displayName = user.email;
        }

        if (doSendOtc) {
            debug('doRequestOtc:' + doSendOtc);

            GroupModel.findOne({
                group: user.group
            }, function (err, group) {
                // send token
                server.methods.sendToken({
                        user: user,
                        isReset: false,
                        transportId: group.transport.id,
                        request: request
                    },
                    function (err) {
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
            });

        }

        server.methods.logger({
            tag: 'info',
            request: request,
            log: 'Autenticado en el primer paso',
            user: request.payload.email
        });

        // create app and u2f sign request
        let session = {
            accountRequester: user.email,
            displayName: displayName,
            retries: 3,
            created: new Date()
        };

        // expires in 13 min
        const seconds = 13 * 60;
        const apiToken = Tokenizer
            .signDataExpiresInSeconds(session, {
                secret: jwtSecret
            }, seconds);

        if (request.pre.signRequests && request.pre.signRequests.length === 0) {
            return reply()
                .header('X-APP-SIGN-REQUEST', apiToken)
                .code(201);
        } else {
            return reply()
                .header('X-APP-SIGN-REQUEST', apiToken)
                .header('X-U2F-SIGN-REQUEST', JSON.stringify(request.pre.signRequests))
                .code(201);
        }

    } else {
        // 400
        let info3 = 'Contraseña inválida';
        server.methods.logger({
            tag: 'info',
            request: request,
            log: info3,
            user: request.payload.email
        });
        return reply(Boom.badRequest(info3));
    }



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
            var info1 = 'No se encontro el usuario';
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
            var info2 = 'El usuario no se ha confirmado';
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
                    server.methods.logger({
                        tag: 'info',
                        request: request,
                        log: 'Token enviado',
                        user: user.email
                    });
                });


            // 200
            let retries = request.auth.credentials.retries;
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
                let session = {
                    accountRequester: user.email,
                    retries: retries - 1,
                    created: new Date()
                };

                if (request.auth.credentials.apiUniqueId) {
                    session.apiUniqueId = request.auth.credentials.apiUniqueId;
                }

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
                    .header('X-APP-BEARER', apiToken)
                    .code(201);
            }
        });

    });


};


/**
 * Delegates OTC requests
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.delegate = function (request, reply) {

    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;
    const UserModel = server.app.mongoose.models.User;


    UserModel.findOne({
        email: request.payload.account,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.payload.account
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
                user: request.payload.account
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
                user: request.payload.account
            });
            return reply(Boom.notFound(info2));
        }

        // 201
        let session = {
            accountRequester: request.payload.account,
            displayName: '',
            retries: 1,
            created: new Date()
        };

        if (request.auth.credentials.apiUniqueId) {
            session = Object.assign({}, session, {
                apiUniqueId: request.auth.credentials.apiUniqueId
            });
        }

        server.methods.logger({
            tag: 'info',
            request: request,
            log: 'Autenticado con delegacion en el primer paso',
            user: request.payload.email
        });
        // expires in 5 min
        let seconds = 5 * 60;
        if (process.env.DEBUG_OTC) {
            seconds = 2;
        }
        const apiToken = Tokenizer
            .signDataExpiresInSeconds(session, {
                secret: jwtSecret
            }, seconds);

        if (request.pre.signRequests && request.pre.signRequests.length === 0) {
            return reply()
                .header('X-APP-SIGN-REQUEST', apiToken)
                .code(201);
        } else {
            return reply()
                .header('X-APP-SIGN-REQUEST', apiToken)
                .header('X-U2F-SIGN-REQUEST', JSON.stringify(request.pre.signRequests))
                .code(201);
        }
    });


};
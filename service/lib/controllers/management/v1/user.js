var Hapi = require('hapi');
var Boom = require('boom');
var debug = require('debug')('api:management:user');
var _ = require('underscore');
var Chance = require('chance');
var chance = new Chance();


/**
 * Batch enrollments with CSV
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.multiEnrollment = function (request, reply) {
    'use strict';
    var server = request.server;
    var UserModel = server.app.mongoose.models.User;

    var licenseInfo = request.pre.licenseInfo;

    // check license
    if (!licenseInfo.hasValidLicense) {
        return reply(Boom.unauthorized('Licencia inválida'));
    }


    if (!licenseInfo.canAllowedUserEnrollment) {
        return reply(Boom.badRequest('Cantidad de usuarios permitidos ha sido excedida.\nActualmente: ' + licenseInfo.currentUsersCount + '\nLicenciados:' + licenseInfo.licenseUsersCount));
    }

    var password = chance.string({
        length: 16,
        pool: '92OVEu8DHsD&ATE#mgnn2J!3qm$co='
    });

    // Read CSV as Stream
    var Readable = require('stream').Readable;
    var csvStream = new Readable();
    csvStream.push(request.payload.csv);
    csvStream.push(null);

    // Add headers
    var csv = require('csv-parser');
    var stream = csv(['email', 'ldapAccount', 'cellphone', 'firstName', 'lastName']);

    csvStream
        .pipe(stream)
        .on('data', function (model) {
            UserModel.count(null, function (err, count) {
                if (err) {
                    server.app.logger.error(err);
                    return reply(Boom.internal('Error', err));
                }


                if (count > licenseInfo.licenseUsersCount) {
                    return reply(Boom.badRequest('Cantidad de usuarios permitidos ha sido excedida. Limite: ' + licenseInfo.licenseUsersCount));
                }

                UserModel.enroll({
                    email: model.email,
                    ldapAccount: model.ldapAccount,
                    cellphone: model.cellphone,
                    firstName: model.firstName,
                    lastName: model.lastName,
                    group: request.payload.group,
                    hasConfirmation: false,
                    password: password
                }, function (err, enrolled) {
                    if (err) {
                        server.methods.logError({
                            request: request,
                            log: err.message,
                            user: request.auth.credentials.email
                        });
                        return;
                    }

                    if (enrolled) {

                        server.methods.logInfo({
                            request: request,
                            log: 'Cuenta agregada: ' + enrolled.email,
                            user: request.auth.credentials.email
                        });

                    } else {

                        server.methods.logError({
                            request: request,
                            log: 'Nombre de usuario ya ha sido tomado: ' + model.email,
                            user: request.auth.credentials.email
                        });

                    }
                });
            });
        });

    return reply().code(201);

};
/**
 * Enrolls an user
 * Sends a confirmation / activation link
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.enroll = function (request, reply) {
    'use strict';
    var server = request.server;
    var UserModel = server.app.mongoose.models.User;

    var licenseInfo = request.pre.licenseInfo;

    // check license
    if (!licenseInfo.hasValidLicense) {
        return reply(Boom.unauthorized('Licencia inválida'));
    }

    if (!licenseInfo.canAllowedUserEnrollment) {
        return reply(Boom.badRequest('Cantidad de usuarios permitidos ha sido excedida.\nActualmente: ' + licenseInfo.currentUsersCount + '\nLicenciados:' + licenseInfo.licenseUsersCount));
    }

    var hostname = server.app.config.get("FE_HOSTNAME");
    var password = chance.string({
        length: 16,
        pool: '92OVEu8DHsD&ATE#mgnn2J!3qm$co='
    });
    var account = request.payload.account;

    UserModel.enroll({
        email: account,
        ldapAccount: request.payload.ldapAccount,
        cellphone: request.payload.cellphone,
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        group: request.payload.group,
        hasConfirmation: request.payload.hasConfirmation,
        password: password
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
            // send confirmation email
            if (request.payload.hasConfirmation) {

                server.methods.sendConfirmation({
                        email: account,
                        hostname: hostname,
                        password: password,
                        request: request,
                        redirectTo: request.payload.redirectTo
                    },
                    function (err, result) {
                        server.methods.logInfo({
                            request: request,
                            log: 'Confirmación de cuenta para "' + account + '" enviado.',
                            user: request.auth.credentials.email
                        });
                    });
            }

            server.methods.logInfo({
                request: request,
                log: 'Cuenta agregada: ' + account,
                user: request.auth.credentials.email
            });

            return reply().location('api/v1/management/users/' + account).code(201);

        } else {

            server.methods.logError({
                request: request,
                log: 'Nombre de usuario ya ha sido tomado.',
                user: request.auth.credentials.email
            });
            reply(Boom.badRequest('Nombre de usuario ya ha sido tomado.'));
        }
    });
};

/**
 * Updates an account
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.update = function (request, reply) {
    'use strict';
    var server = request.server;
    var UserModel = server.app.mongoose.models.User;

    var hostname = server.app.config.get("FE_HOSTNAME");
    var account = request.payload.account;


    UserModel.modify({
        email: account,
        ldapAccount: request.payload.ldapAccount,
        inactive: !request.payload.enable,
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        role: request.payload.role,
        group: request.payload.group,
        cellphone: request.payload.cellphone,
        preferSoftToken: null
    }, function (err, model) {
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: account
            });
            return;
        }

        if (model) {
            if (request.payload.resetAccount) {
                server.methods.sendReset({
                    email: account,
                    hostname: hostname,
                    request: request,
                    redirectTo: request.payload.redirectTo
                }, function (err, result) {
                    server.methods.logInfo({
                        request: request,
                        log: 'Petición de restablecimiento de cuenta para "' + account + '" iniciado.',
                        user: request.auth.credentials.email
                    });
                });
            }

            server.methods.logInfo({
                request: request,
                log: 'Cuenta actualizada: ' + account,
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
};


exports.getAdminCount = function (request, reply) {
    'use strict';
    var server = request.server;
    var UserModel = server.app.mongoose.models.User;

    UserModel.count({
        group: 'admins'
    }, function (err, count) {
        if (err) {
            server.app.logger.error(err);
            return reply(Boom.internal('Error', err));
        }
        
        return reply(count);
    });
};

/**
 * Deletes an user
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.delete = function (request, reply) {
    'use strict';
    var server = request.server;
    var UserModel = server.app.mongoose.models.User;

// Needs more thinking...
//    if (request.pre.adminCount === 1) {
//        var mustBeMoreThanOne = Boom.badRequest('Solo se puede desactivar o remover cuenta si existe mas de un administrador.');
//        return reply(mustBeMoreThanOne);
//    }

    if (request.params.id === request.auth.credentials.email) {
        var denied = Boom.badRequest('No se puede desactivar o remover cuenta autenticada en sesión.');
        return reply(denied);
    }

    if (request.query.force) {
        UserModel.remove({
            email: request.params.id,
            inactive: true
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
                log: 'Cuenta removida: ' + request.params.id,
                user: request.auth.credentials.email
            });

            return reply().code(204);

        });
    } else {
        UserModel.modify({
            email: request.params.id,
            inactive: true
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
                log: 'Cuenta desactivada: ' + request.params.id,
                user: request.auth.credentials.email
            });

            return reply().code(204);

        });
    }

};
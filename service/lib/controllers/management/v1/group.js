var Hapi = require('hapi');
var Boom = require('boom');
var debug = require('debug')('api:management:group');
var _ = require('underscore');

/**
 * Adds a group
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.add = function (request, reply) {
    'use strict';
    var server = request.server;
    var GroupModel = server.app.mongoose.models.Group;

    var hostname = server.app.config.get("FE_HOSTNAME");

    GroupModel.add({
        group: request.payload.group,
        description: request.payload.description,
        transport: {
            id: request.payload.transport.id,
            description: request.payload.transport.description
        },
        adapter: {
            id: request.payload.adapter.id,
            description: request.payload.adapter.description
        }
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
                log: 'Grupo agregado: ' + request.payload.group,
                user: request.auth.credentials.email
            });
            return reply().location('api/v1/management/groups/' + request.payload.group).code(201);

        } else {
            server.methods.logInfo({
                request: request,
                log: 'Nombre de grupo ya ha sido tomado.',
                user: request.auth.credentials.email
            });
            reply(Boom.badRequest('Nombre de grupo ya ha sido tomado.'));
        }
    });
};

/**
 * Updates a group
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.update = function (request, reply) {
    'use strict';
    var server = request.server;
    var GroupModel = server.app.mongoose.models.Group;


    GroupModel.modify({
        group: request.payload.group,
        description: request.payload.description,
        transport: {
            id: request.payload.transport.id,
            description: request.payload.transport.description
        },
        adapter: {
            id: request.payload.adapter.id,
            description: request.payload.adapter.description
        }
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
                log: 'Grupo modificado: ' + request.payload.group,
                user: request.auth.credentials.email
            });
            return reply().code(204);

        } else {
            server.methods.logInfo({
                request: request,
                log: 'Nombre de grupo no existe.',
                user: request.auth.credentials.email
            });
            reply(Boom.badRequest('Nombre de grupo no existe.'));
        }
    });
};

/**
 * Deletes a group
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.delete = function (request, reply) {
    'use strict';
    var server = request.server;
    var GroupModel = server.app.mongoose.models.Group;
    var UserModel = server.app.mongoose.models.User;

    var fields = 'firstName lastName cellphone inactive created updated group deletable email';
    UserModel
        .find({
            group: request.params.id
        }, fields)
        .exec(function (err, users) {

            var stats = {
                active: _.filter(users, function (item) {
                    return !item.inactive;
                }).length,
                inactive: _.filter(users, function (item) {
                    return item.inactive;
                }).length
            };

            if (stats.active > 0) {
                reply(Boom.badRequest('Existen ' + stats.active + ' usuarios activos.'));
            } else {
                GroupModel.remove({
                    group: request.params.id,
                }, function (err) {
                    if (err) {
                        server.methods.logError({
                            request: request,
                            log: err.message,
                            user: request.auth.credentials.email
                        });
                        return;
                    }

                    UserModel.remove({
                        group: request.params.id,
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
                            log: 'Cuentas inactivas removidas desde grupo: ' + request.params.id,
                            user: request.auth.credentials.email
                        });

                        server.methods.logInfo({
                            request: request,
                            log: 'Grupo removido: ' + request.params.id,
                            user: request.auth.credentials.email
                        });
                        return reply().code(204);
                    });

                });
            }

        });


};
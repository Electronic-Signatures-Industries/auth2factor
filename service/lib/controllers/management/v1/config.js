let Hapi = require('hapi');
let Boom = require('boom');
let debug = require('debug')('api:management:config');
let _ = require('underscore');

exports.list = function (request, reply) {
    'use strict';
    let server = request.server;
    let ConfigModel = server.app.mongoose.models.Config;

    // has query
    let query = null;
    if (request.query.id) {
        query = {
            _id: request.query.id
        };
    } else if (request.query.key) {
        query = {
            key: request.query.key
        };
    } else if (request.query.entity) {
        query = {
            entity: request.query.entity
        };
    }

    let fields = '_ac _ct _id key entity entityId deletable description created updated settings';
    ConfigModel.find(query, fields, function (err, models) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }

        if (models) {
            let model;



            if (request.query.view && request.query.view === 'no_apikeys') {
                model = {
                    apikeys: []
                };


                _.each(models, function (item) {
                    let config;

                    if (item.entity !== 'apikey') {
                        config = {
                            created: item.created,
                            updated: item.updated,
                            settings: item.settings,
                            id: item._id.toString(),
                            key: item.key,
                            entity: item.entity,
                            entityId: item.entityId,
                            deletable: item.deletable,
                            description: item.description
                        };


                        model.apikeys.push(config);
                    }

                    return config;
                });

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de configuraciones',
                    user: request.auth.credentials.email
                });

                return reply(model).code(200);
            } else if (request.query.view && request.query.view === 'apikeys') {
                model = {
                    apikeys: []
                };


                _.each(models, function (item) {
                    let config;

                    if (item.entity === 'apikey') {
                        config = {
                            created: item.created,
                            updated: item.updated,
                            settings: item.settings,
                            id: item._id.toString(),
                            key: item.key,
                            entity: item.entity,
                            entityId: item.entityId,
                            deletable: item.deletable,
                            description: item.description
                        };


                        model.apikeys.push(config);
                    }

                    return config;
                });

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de configuraciones',
                    user: request.auth.credentials.email
                });

                return reply(model).code(200);
            } else if (request.query.view && request.query.view === 'full') {
                model = {
                    transports: [],
                    adapters: [],
                    configs: []
                };


                _.each(models, function (item) {
                    let config;

                    if (item.entity === 'transport' && item.entityId) {
                        config = {
                            created: item.created,
                            updated: item.updated,
                            deletable: item.deletable,
                            settings: item.settings,
                            key: item.key,
                            description: item.description,
                            entity: {
                                id: item.entityId
                            },
                            self: {
                                id: item._id.toString(),
                                href: 'api/v1/management/configs?id' + item._id.toString()
                            }
                        };
                        model.transports.push(config);
                    } else if (item.entity === 'adapter' && item.entityId) {
                        config = {
                            created: item.created,
                            updated: item.updated,
                            deletable: item.deletable,
                            settings: item.settings,
                            key: item.key,
                            description: item.description,
                            entity: {
                                id: item.entityId
                            },
                            self: {
                                id: item._id.toString(),
                                href: 'api/v1/management/configs?id' + item._id.toString()
                            }
                        };
                        model.adapters.push(config);
                    } else {
                        config = {
                            created: item.created,
                            updated: item.updated,
                            deletable: item.deletable,
                            settings: item.settings,
                            key: item.key,
                            description: item.description,
                            self: {
                                id: item._id.toString(),
                                href: 'api/v1/management/configs?id' + item._id.toString()
                            }
                        };
                        model.configs.push(config);
                    }


                    return config;
                });

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de configuraciones',
                    user: request.auth.credentials.email
                });

                return reply(model).code(200);
            } else {
                model = _.map(models, function (item) {
                    let config = {
                        created: item.created,
                        updated: item.updated,
                        settings: item.settings,
                        id: item._id.toString(),
                        key: item.key,
                        entity: item.entity,
                        entityId: item.entityId,
                        deletable: item.deletable,
                        description: item.description
                    };

                    return config;
                });

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de configuraciones',
                    user: request.auth.credentials.email
                });

                return reply({
                    configs: model
                }).code(200);
            }


        } else {
            server.methods.logInfo({
                request: request,
                log: 'Listado de configuraciones sin registros',
                user: request.auth.credentials.email
            });

            return reply({
                configs: []
            }).code(200);
        }

    });
};

exports.generateApiKey = function (request, reply) {
    'use strict';
    let server = request.server;
    let generatedApiToken = request.pre.generatedApiToken;

    server.methods.logInfo({
        request: request,
        log: 'API token generado',
        user: request.auth.credentials.email
    });
    return reply()
    .header('X-APP-NEW-API-SECRET', generatedApiToken.apiSecret)
    .header('X-APP-NEW-API-KEY', generatedApiToken.key)
    .header('X-APP-NEW-OAUTH-CLIENT-SECRET', generatedApiToken.clientSecret)
    .code(201);
};

/**
 * Adds a config
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.add = function (request, reply) {
    'use strict';
    let server = request.server;
    let ConfigModel = server.app.mongoose.models.Config;

    ConfigModel.add({
        key: request.payload.key,
        description: request.payload.description,
        entityId: request.payload.entityId,
        entity: request.payload.entity,
        settings: request.payload.settings
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
                log: 'Configuración agregada: ' + request.payload.key,
                user: request.auth.credentials.email
            });
            return reply().location('api/v1/management/configs/' + request.payload.key).code(201);

        } else {
            server.methods.logError({
                request: request,
                log: 'Nombre de configuración ya ha sido tomado.',
                user: request.auth.credentials.email
            });

            reply(Boom.badRequest('Nombre de configuración ya ha sido tomado.'));
        }
    });
};

/**
 * Updates a config
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.update = function (request, reply) {
    'use strict';
    let server = request.server;
    let ConfigModel = server.app.mongoose.models.Config;


    ConfigModel.modify({
        key: request.payload.key,
        description: request.payload.description,
        entityId: request.payload.entityId,
        entity: request.payload.entity,
        settings: request.payload.settings
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
                log: 'Configuración actualizada: ' + request.payload.key,
                user: request.auth.credentials.email
            });
            return reply().code(204);

        } else {
            server.methods.logError({
                request: request,
                log: 'Nombre de configuración no existe.',
                user: request.auth.credentials.email
            });
            reply(Boom.badRequest('Nombre de configuración no existe.'));
        }
    });
};

/**
 * Deletes a config
 * @param {object} request - Hapi request
 * @param {object} reply - Hapi reply
 */
exports.delete = function (request, reply) {
    'use strict';
    let server = request.server;
    let ConfigModel = server.app.mongoose.models.Config;


    ConfigModel.remove({
        key: request.params.id,
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
            log: 'Configuración removida: ' + request.params.id,
            user: request.auth.credentials.email
        });

        return reply().code(204);

    });
};
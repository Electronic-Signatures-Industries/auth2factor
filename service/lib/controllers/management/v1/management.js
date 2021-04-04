const Boom = require('boom');
const LicenseVerifier = require('../../shared/license/verifier');
const debug = require('debug')('api:management');
const _ = require('underscore');
const Q = require('q');

exports.hasActivation = function (request, reply) {
    'use strict';
    const server = request.server;
    const SystemModel = server.app.mongoose.models.System;

    SystemModel.findOne({
        activated: true
    }, function (err, model) {
        let denied = Boom.badRequest('Ya esta activado.');
        if (err) {
            server.app.logger.error(err);
            return reply(denied);
        }

        if (model) {
            return reply(denied);
        } else {
            return reply(false);
        }
    });

};


exports.hasAdmin = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;

    UserModel.findOne({
        email: request.auth.credentials.email,
        group: 'admins'
    }, function (err, user) {
        let denied = Boom.unauthorized('Denegado');
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            server.app.logger.error(err);
            debug('is admin?: false');
            return reply(denied);
        }

        if (user && !user.inactive) {
            debug('is admin?: true');
            return reply(true);
        } else {
            debug('is admin?: false');
            return reply(denied);
        }
    });

};


exports.checkLicense = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;
    const ConfigModel = server.app.mongoose.models.Config;
    const verifier = new LicenseVerifier(server.app.config);


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
        debug(config.settings);
        const lic = JSON.parse(config.settings.license);
        UserModel.count(null, function (err, count) {
            if (err) {
                server.app.logger.error(err);
                return reply(Boom.internal('Error', err));
            }

            const response = {
                currentUsersCount: count,
                licenseUsersCount: lic['Number of Users Licensed'],
                license: lic
            };

            verifier.verify({
                algorithm: 'RSA-SHA512',
                license: lic,
                publicKey: __dirname + '/../../../../af.pub',
            }, function (err, result) {
                if (err) {
                    server.app.logger.error(err);
                    return reply(Boom.internal('Error', err));
                }

                response.hasValidLicense = result.verified;
                response.canAllowedUserEnrollment = lic['Number of Users Licensed'] > response.currentUsersCount;
                debug(response);
                return reply(response);
            });
        });

    });

};

exports.listUsers = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;

    // has query
    let query = null;
    if (request.query.account) {
        query = {
            email: request.query.account
        };
    } else if (request.query.view === 'byActive') {
        query = {
            group: request.query.group
        };
    }

    let fields = 'ldapAccount firstName lastName cellphone inactive created updated group deletable email preferSoftToken';
    UserModel
        .find(query, fields)
        .exec(function (err, users) {

            if (err) {
                server.methods.logError({
                    request: request,
                    log: err.message,
                    user: request.auth.credentials.email
                });
                return;
            }

            if (users) {
                let model;

                if (request.query.view === 'byActive') {
                    model = {
                        active: _.filter(users, function (item) {
                            return item.inactive === false;
                        }).length,
                        inactive: _.filter(users, function (item) {
                            return item.inactive;
                        }).length
                    };

                } else {
                    model = _.map(users, function (u) {
                        let user = {
                            preferSoftToken: u.preferSoftToken,
                            created: u.created,
                            updated: u.updated,
                            group: u.group,
                            email: u.email,
                            ldapAccount: u.ldapAccount,
                            inactive: u.inactive,
                            deletable: u.deletable
                        };

                        if (u.firstName && u.firstName.length > 0) {
                            user.firstName = u.firstName;
                        }

                        if (u.lastName && u.lastName.length > 0) {
                            user.lastName = u.lastName;
                        }

                        if (u.cellphone) {
                            user.cellphone = u.cellphone;
                        }

                        return user;
                    });
                }

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de usuarios',
                    user: request.auth.credentials.email
                });

                return reply({
                    users: model
                }).code(200);
            } else {

                server.methods.logInfo({
                    request: request,
                    log: 'Listado de usuarios sin registros',
                    user: request.auth.credentials.email
                });

                return reply({
                    users: []
                }).code(200);
            }

        });
};

exports.listGroups = function (request, reply) {
    'use strict';
    let server = request.server;
    let GroupModel = server.app.mongoose.models.Group;

    // has query
    let query = null;
    if (request.query.group) {
        query = {
            group: request.query.group
        };
    }

    let fields = 'adapter transport deletable description created updated group';
    GroupModel.find(query, fields, function (err, groups) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }


        if (groups) {
            let model = _.map(groups, function (g) {
                let group = {
                    created: g.created,
                    updated: g.updated,
                    deletable: g.deletable,
                    group: g.group,
                    adapter: g.adapter,
                    transport: g.transport,
                    description: g.description
                };

                return group;
            });

            server.methods.logInfo({
                request: request,
                log: 'Listado de grupos',
                user: request.auth.credentials.email
            });

            return reply({
                groups: model
            }).code(200);
        } else {
            server.methods.logInfo({
                request: request,
                log: 'Listado de grupos sin registros',
                user: request.auth.credentials.email
            });

            return reply({
                groups: []
            }).code(200);
        }

    });
};




exports.listAdapters = function (request, reply) {
    'use strict';
    let server = request.server;
    let AdapterModel = server.app.mongoose.models.Adapter;

    let fields = '_id description protocol module fields';
    AdapterModel.find(null, fields, function (err, adapters) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }


        if (adapters) {
            let model = _.map(adapters, function (a) {
                let adapter = {
                    adapter: a._id,
                    description: a.description
                };

                return adapter;
            });

            server.methods.logInfo({
                request: request,
                log: 'Listado de adaptadores',
                user: request.auth.credentials.email
            });

            return reply({
                adapters: model
            }).code(200);
        } else {
            server.methods.logInfo({
                request: request,
                log: 'Listado de adaptadores sin registros',
                user: request.auth.credentials.email
            });

            return reply({
                adapters: []
            }).code(200);
        }

    });
};

exports.listLogs = function (request, reply) {
    'use strict';
    const server = request.server;
    const LogModel = server.app.mongoose.models.Log;

    const fields = 'event log user remoteAddress request created';
    LogModel
        .find(null, fields)
        .limit(1000)
        .sort({
            $natural: -1
        })
        .exec(function (err, logs) {

            if (err) {
                server.methods.logError({
                    request: request,
                    log: err.message,
                    user: request.auth.credentials.email
                });
                return;
            }


            if (logs) {
                let model = _.map(logs, function (log) {
                    return {
                        event: log.event,
                        log: log.log,
                        user: log.user,
                        created: log.created,
                        remoteAddress: log.remoteAddress,
                        request: log.request
                    };
                });

                return reply({
                    logs: model
                }).code(200);
            } else {
                server.methods.logInfo({
                    request: request,
                    log: 'Listado de bitacoras sin registros',
                    user: request.auth.credentials.email
                });

                return reply({
                    logs: []
                }).code(200);
            }

        });
};


exports.getStats = function (request, reply) {
    'use strict';
    const server = request.server;
    const ConfigModel = server.app.mongoose.models.Config;
    const UserModel = server.app.mongoose.models.User;
    const LogModel = server.app.mongoose.models.Log;
    const GroupModel = server.app.mongoose.models.Group;

    const configFields = '_ac _ct _id key entity entityId description created updated settings';
    let configs = ConfigModel.find(null, 'entity').exec();
    let license = ConfigModel.find({
        key: 'license'
    }, configFields).exec();
    let adminCount = UserModel.find({
        group: 'admins'
    }).count().exec();
    let userCount = UserModel.count().exec();
    let groupCount = GroupModel.count().exec();
    let fields = 'event log user remoteAddress request created';
    let logCount = LogModel.count().exec();
    let peekLog = LogModel
        .find(null, fields)
        .limit(1)
        .sort({
            $natural: -1
        })
        .exec();

    if (request.pre.user && request.pre.user.group === 'admins') {
        Q.all([configs, adminCount, groupCount, logCount, peekLog, userCount, license])
            .fail(function (error) {
                server.methods.logError({
                    request: request,
                    log: error.message,
                    user: request.auth.credentials.email
                });
            })
            .then(function (results) {


                let groupByEntity = _.groupBy(results[0], function (cfg) {
                    return cfg.entity;
                });
                debug(groupByEntity);
                let model = {
                    stats: {
                        configs: {
                            regular: {
                                count: groupByEntity.config.length
                            },
                            adapter: {
                                count: groupByEntity.adapter.length
                            },
                            transport: {
                                count: groupByEntity.transport.length
                            },
                            total: results[0].length
                        },
                        users: {
                            count: results[5]
                        },
                        admins: {
                            count: results[1]
                        },
                        groups: {
                            count: results[2]
                        },
                        logs: {
                            count: results[3],
                            lastEvent: {
                                event: results[4][0].event,
                                log: results[4][0].log,
                                remoteAddress: results[4][0].remoteAddress
                            }
                        }
                    }
                };

                try {
                    model.stats.license = JSON.parse(results[6][0].settings.license);
                } catch (e) {
                    model.stats.license = results[6][0].settings.license;
                }

                server.methods.getProfileToken({
                        email: request.auth.credentials.email
                    },
                    function (err, result) {
                        model.stats.profileToken = result;
                        return reply(model).code(200);

                    });

            });
    } else {
        server.methods.getProfileToken({
                email: request.auth.credentials.email
            },
            function (err, result) {
                return reply({
                        stats: {
                            profileToken: result
                        }
                    })
                    .code(200);
            });
    }


};

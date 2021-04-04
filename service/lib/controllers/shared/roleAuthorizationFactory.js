let Boom = require('boom');
let debug = require('debug')('api:common:role_authorization_factory');
let _ = require('underscore');

exports.checkIsAdmin = function (request, reply) {
    'use strict';
    let server = request.server;
    let UserModel = server.app.mongoose.models.User;

    UserModel.findOne({
        email: request.auth.credentials.email,
        group: 'admins'
    }, function (err, user) {

        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            server.app.logger.error(err);
            return reply(Boom.internal(err));
        }

        if (user && user.inactive) {
            debug('is inactive?: true');
            return reply(false);
        } else if (user && !user.inactive) {
            debug('is admin?: true');
            return reply(true);
        } else {
            debug('is admin?: false');
            return reply(false);
        }
    });

};

exports.getUserGroupInfo = function (request, reply) {
    'use strict';
    let server = request.server;
    let UserModel = server.app.mongoose.models.User;
    let GroupModel = server.app.mongoose.models.Group;

    UserModel.findOne({
        email: request.auth.credentials.email,
        inactive: false
    }, function (err, user) {
        let denied = Boom.unauthorized();
        if (err) {
            server.app.logger.error(err);
            return reply(denied);
        }

        GroupModel.findOne({
            group: user.group
        }, function (err, group) {

            if (err) {
                server.app.logger.error(err);
                return reply(Boom.unauthorized());
            }

            _.extend(user.group, group);
            return reply(user);
        });

    });

};

exports.getUserInfo = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;

    let email;

    if (request.payload && request.payload.email) {
        email = request.payload.email;
    } else {
        email = request.auth.credentials.email || request.auth.credentials.accountRequester;
    }

    UserModel.findOne({
        email: email,
        inactive: false
    }, function (err, user) {
        let denied = Boom.internal();
        if (err) {
            server.app.logger.error(err);
            return reply(denied);
        }

        return reply(user);
    });

};

exports.userLoginValidation = function (request, reply) {
    'use strict';
    const server = request.server;
    const user = request.pre.userModel;

    if (!user) {
        // 404
        let info1 = 'No se encontro el usuario';
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
        let info2 = 'El usuario no se ha confirmado';
        server.methods.logger({
            tag: 'info',
            request: request,
            log: info2,
            user: request.payload.email
        });
        return reply(Boom.notFound(info2));
    }
    
    return reply();
};
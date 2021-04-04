const Boom = require('boom');

exports.decodeResetToken = function (request, reply) {
    'use strict';
    const server = request.server;
    const jwtSecret = server.app.config.get('JWT_SECRET');
    const Tokenizer = server.app.jwtTokenService;

    Tokenizer.verify(request.query.token, { secret: jwtSecret }, function (err, decoded) {
        if (err) {
            server.methods.logger('error', {
                log: err.message,
                user: 'none'
            });
            if (err.name === 'TokenExpiredError') {
                reply(Boom.forbidden('Token ha expirado'));
            } else {
                reply(Boom.internal('No se ha podido leer el token'));
            }
            return;
        }

        return reply(decoded);
    });

};

exports.sendResetEmail = function (request, reply) {
    'use strict';
    const server = request.server;
    const UserModel = server.app.mongoose.models.User;

    const hostname = server.app.config.get('FE_HOSTNAME');

    UserModel.findOne({
        email: request.payload.email,
        inactive: false
    }, function (err, user) {

        if (err) {
            server.methods.logger({
                tag: 'error',
                request: request,
                log: err.message,
                user: request.payload.email
            });
            return;
        }

        if (user) {

            server.methods.sendReset({
                email: request.payload.email,
                hostname: hostname,
                request: request,
                redirectTo: request.payload.redirectTo
            }, function () {
                server.methods.logInfo({
                    request: request,
                    log: 'Petición de restablecimiento de cuenta para "' + request.payload.email + '" iniciado.',
                    user: request.payload.email
                });
            });

            return reply().code(201);
        } else {
            server.methods.logInfo({
                request: request,
                log: 'Cuenta "' + request.payload.email + '" no existe.',
                user: request.payload.email
            });
            return reply().code(201);
        }
    });
};
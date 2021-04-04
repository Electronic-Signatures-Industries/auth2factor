let _ = require('underscore');


exports.list = function (request, reply) {
    'use strict';
    let server = request.server;
    let TransportModel = server.app.mongoose.models.Transport;

    // has query
    let query = null;
    if (request.query.transport) {
        query = {
            _id: request.query.transport
        };
    }

    let fields = '_id description created updated settings';
    TransportModel.find(query, fields, function (err, transports) {
        
        if (err) {
            server.methods.logError({
                request: request,
                log: err.message,
                user: request.auth.credentials.email
            });
            return;
        }

        if (transports) {
            let model = _.map(transports, function (t) {
                let transport = {
                    created: t.created,
                    updated: t.updated,
                    settings: t.settings,
                    transport: t._id,
                    description: t.description
                };

                return transport;
            });
            
            server.methods.logInfo({
                request: request,
                log: 'Listado de transportes',
                user: request.auth.credentials.email
            });
            
            return reply({
                transports: model
            }).code(200);
        } else {
            
            server.methods.logInfo({
                request: request,
                log: 'Listado de transportes sin registros',
                user: request.auth.credentials.email
            });
            
            return reply({
                transports: []
            }).code(200);
        }

    });
};

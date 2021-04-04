let _ = require('underscore');
const AclEnums = require('../../shared/permission/aclEnums');

exports.list = function (request, reply) {
    'use strict';
    let server = request.server;

    let model = _.chain(AclEnums)
        .values()
        .map(v => {
            return { name: v };
        })
        .value();

    server.methods.logInfo({
        request: request,
        log: 'Listado de ACL',
        user: request.auth.credentials.email
    });

    return reply({
        acls: model,
    }).code(200);
};
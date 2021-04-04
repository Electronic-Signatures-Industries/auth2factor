const Boom = require('boom');
const _ = require('underscore');
const querystring = require('querystring');

/**
 * Resolves OAuth scopes
 */
exports.resolveScope =
    (request, reply) => {
        'use strict';
        let server = request.server;

        // TODO
        // let scope = req.body.scope ? req.body.scope.split(' ') : undefined;
        // var client = getClient(query.client_id);
        // let cscope = client.scope ? client.scope.split(' ') : undefined;
        // if (__.difference(scope, cscope).length > 0) {
        //     // client asked for a scope it couldn't have
        //     res.status(400).json({
        //         error: 'invalid_scope'
        //     });
        //     return;
        // }
        return reply({
            scopes: ['default'],
        });
    };
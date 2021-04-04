const Boom = require('boom');
const OAuthTokenService = require('../shared/security/oauthTokenService');


exports.requestToken = function (request, reply) {
    'use strict';
    const issuer = request.server.app.config.get('FE_HOSTNAME');
    if (request.payload && request.payload.grant_type === 'client_credentials') {

        const scope = request.pre.scopeInfo.scopes;
        const client = request.pre.clientInfo;
        const config = request.pre.configInfo;
        const access_token = OAuthTokenService.generate({
            issuer,
            audience: client.clientId,
            apiSecret: config.apiToken,
        });
        let token_response = {
            access_token: access_token,
            token_type: 'Bearer',
            scope: scope.join(' ')
        };
        // nosql.insert({
        //     access_token: access_token,
        //     client_id: clientId,
        //     scope: scope
        // });
        console.log('Issuing access token %s', access_token);
        return reply(token_response);

    } else {
        console.log('Unknown grant type %s', request.payload.grant_type);
        return reply(Boom.badRequest({
            error: 'unsupported_grant_type'
        }));
    }
};
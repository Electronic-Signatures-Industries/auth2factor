const Boom = require('boom');
const querystring = require('querystring');

/**
 * Verifies OAuth2 client credentials
 */
exports.resolveApiConfig =
    (request, reply) => {
        'use strict';
        const server = request.server;

        // db lookup
        const ConfigModel = server.app.mongoose.models.Config;

        ConfigModel.get({
            key: request.pre.clientInfo.clientId,
        }, function (err, config) {

            if (err) {
                server.methods.logger({
                    tag: 'error',
                    request: request,
                    log: err.message,
                    user: 'system'
                });
                return reply(Boom.create(500));
            }

            if (!config) {
                return reply(Boom.unauthorized({
                    error: 'invalid_client'
                }));
            }

            if (request.pre.clientInfo.clientSecret !== config.settings.clientSecret) {
                return reply(Boom.unauthorized({
                    error: 'invalid_client'
                }));
            }

            return reply(config.settings);

        });


    };

/**
 * Parses an OAuth2 authorization header
 */
exports.parseBasicAuthorization = (request, reply) => {
    'use strict';
    const authorization = request.raw.req.headers.authorization;
    let clientId;
    let clientSecret = null;


    if (authorization) {
        let clientCredentials = Buffer.from(authorization.slice('basic '.length), 'base64')
            .toString().split(':');
        clientId = querystring.unescape(clientCredentials[0]);
        clientSecret = querystring.unescape(clientCredentials[1]);
    }

    // otherwise, check the post body
    if (request.payload && request.payload.client_id) {
        if (clientId) {
            // if we've already seen the client's credentials in the authorization header,
            // this is an error
            console.log('Client attempted to authenticate with multiple methods');
            return reply(Boom.unauthorized({
                error: 'invalid_client'
            }));
        }

        clientId = request.payload.client_id;
        clientSecret = request.payload.client_secret;
    }

    if (!authorization) {
        return reply(Boom.unauthorized({
            error: 'invalid_client'
        }));
    }

    return reply({
        clientId,
        clientSecret,
    });

};
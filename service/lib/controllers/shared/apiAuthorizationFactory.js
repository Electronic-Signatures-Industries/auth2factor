let Boom = require('boom');
let APIAuthorizationManager = require('./apiAuthorizationManager');
let IPRuleService = require('./security/ipRuleService');

const ipRule = new IPRuleService();
/**
 * Verifies an IP address is restricted by an API key configuration
 * @param {string} configPre - Config prerequisite
 */
exports.hasValidIpAddress = (configPre) =>
    (request, reply) => {
        'use strict';

        let config = request.pre[configPre];

        if (config && config.ip) {
            let hasValid = ipRule.hasValidIpAddress(config, request);

            if (!hasValid) {
                let denied = Boom.unauthorized('Denegado');
                return reply(denied);
            }
        }

        return reply(true);
    };

/**
 * Verifies authorizations
 * @param {boolean} restrictToApiCalls - Authorizes API calls exclusively
 */
exports.checkAuthorizationAndResolveApiConfig = (restrictToApiCalls) =>
    (request, reply) => {
        'use strict';
        let denied = Boom.unauthorized('Denegado');

        let authorizationManager = new APIAuthorizationManager({
            id: request.auth.credentials.apiUniqueId,
            created: request.auth.credentials.created || request.auth.credentials.iat,
        });

        if (authorizationManager.isApiUser()) {
            authorizationManager.getApiConfig(request, (e, config) => {
                return reply(config);
            });
        } else {
            if (restrictToApiCalls) {
                return reply(denied);
            }

            // session based user, continue...
            return reply(true);
        }
    };


/**
 * Verifies authorizations
 */
exports.checkAuthorizations = (request, reply) => {
    'use strict';
    let denied = Boom.unauthorized('Denegado');

    let authorizationManager = new APIAuthorizationManager({
        id: request.auth.credentials.apiUniqueId,
        created: request.auth.credentials.created || request.auth.credentials.iat,
    });

    if (authorizationManager.isApiUser()) {
        authorizationManager.hasValidIpAddress(request, (err, valid) => {
            if (valid) {
                authorizationManager.getApiConfig(request, (e, config) => {
                    return reply(config);
                });
            } else {
                return reply(denied);
            }
        });
    } else {
        // session based user, continue...
        return reply(true);
    }
};

/**
 * Verifies that only API sessions are authorized
 */
exports.checkAPIOnlyAuthorizations = (request, reply) => {
    'use strict';
    let denied = Boom.unauthorized('Denegado');
    let authorizationManager = new APIAuthorizationManager({
        id: request.auth.credentials.apiUniqueId,
        created: request.auth.credentials.created || request.auth.credentials.iat,
    });

    if (authorizationManager.isApiUser()) {
        authorizationManager.hasValidIpAddress(request, (err, valid) => {
            if (valid) {
                authorizationManager.getApiConfig(request, (e, config) => {
                    return reply(config);
                });
            } else {
                return reply(denied);
            }
        });
    } else {
        // session based user, deny...
        return reply(denied);
    }
};

exports.generateToken = function (request, reply) {
    'use strict';

    return reply(APIAuthorizationManager.generateToken());

};
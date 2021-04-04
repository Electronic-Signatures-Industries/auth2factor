let Boom = require('boom');
let AclService = require('./aclService');
const acl = new AclService();

/**
 * Verifies and allows access if admin or has a valid ACL
 */
exports.hasAdminOrAclVerified = (request, reply) => {
    'use strict';
    let server = request.server;
    let UserModel = server.app.mongoose.models.User;
    let denied = Boom.unauthorized('Denegado');

    if (request.pre.acl) {
        if (request.pre.acl.isValidAcl) {
            return reply(true);
        } else {
            return reply(denied);
        }
    } else {
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
                return reply(denied);
            }

            if (user && !user.inactive) {
                return reply(true);
            } else {
                return reply(denied);
            }
        });

    }

};

/**
 * Verifies authorizations
 * @param {string} accessRequest - The ACL in context
 * @param {string} configPre - The name of the prereq containing the config
 * @param {boolean}   denyUnauthorization - Returns 401 if unauthorized
 */
exports.checkAuthorizations = (accessRequest, configPre, denyUnauthorization) =>
    (request, reply) => {
        'use strict';

        let config = request.pre[configPre];

        let hasValid = acl.checkAcl(accessRequest, config);

        let response = {
            isValidAcl: false,
        };

        if (hasValid === -1) {
            response = null;
        } else if (hasValid === 1) {
            response.isValidAcl = true;
        }

        if (response && !response.isValidAcl && denyUnauthorization) {
            let denied = Boom.unauthorized('Denegado');
            return reply(denied);
        }

        return reply(response);
    };
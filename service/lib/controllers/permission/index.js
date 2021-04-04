let Joi = require('joi');
let acl = require('./v1/acl');
let apiAuthorizationFactory = require('../shared/apiAuthorizationFactory');
let aclFactory = require('../shared/permission/aclFactory');
let aclEnums = require('../shared/permission/aclEnums');

exports.register = function (plugin, options, next) {


    plugin.route({
        method: 'GET',
        path: '/v1/management/acls',
        config: {
            description: 'List acls',
            notes: 'List acls',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [{
                        code: 401,
                        message: 'Unauthorized'
                    }]
                }
            },
            response: {
                schema: require('./mediatypes/acls')
            },
            handler: acl.list,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [{
                method: apiAuthorizationFactory.checkAuthorizationAndResolveApiConfig(),
                assign: 'apiConfig',
            },
            {
                method: apiAuthorizationFactory.hasValidIpAddress('apiConfig'),
                assign: 'isValidIP',
            },
            {
                method: aclFactory.checkAuthorizations(aclEnums.LIST_ACLS, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
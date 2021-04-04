let Joi = require('joi');
let management = require('./v1/management');
let group = require('./v1/group');
let configuration = require('./v1/config');
let user = require('./v1/user');
let transport = require('./v1/transport');
let apiAuthorizationFactory = require('../shared/apiAuthorizationFactory');
let roleAuthorizationFactory = require('../shared/roleAuthorizationFactory');
let aclFactory = require('../shared/permission/aclFactory');
let AclEnums = require('../shared/permission/aclEnums');

exports.register = function (plugin, options, next) {

    plugin.route({
        method: 'GET',
        path: '/v1/management/stats',
        config: {
            description: 'List stats',
            notes: 'List stats',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
//            response: {
//                schema: require('./mediatypes/logs')
//            },
            handler: management.getStats,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_STATS, 'apiConfig', true),
                assign: 'acl',
            },                
            {
                method: roleAuthorizationFactory.getUserInfo,
                assign: 'user'
            }]
        }
    });
    
    plugin.route({
        method: 'GET',
        path: '/v1/management/logs',
        config: {
            description: 'List logs',
            notes: 'List logs',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            response: {
                schema: require('./mediatypes/logs')
            },
            handler: management.listLogs,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_LOGS, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,                    
                assign: 'isAdmin'
            }]
        }
    });
    
    plugin.route({
        method: 'GET',
        path: '/v1/management/adapters',
        config: {
            description: 'List adapters',
            notes: 'List adapters',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            response: {
                schema: require('./mediatypes/adapters')
            },
            handler: management.listAdapters,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_ADAPTERS, 'apiConfig'),
                assign: 'acl',
            },                               
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin'
            }]
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/management/configs',
        config: {
            description: 'List configs',
            notes: 'List configs',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            //            response: {
            //                schema: require('./mediatypes/configs')
            //            },
            validate: {
                query: {
                    id: Joi.string().description('id').optional(),
                    key: Joi.string().description('key').optional(),
                    entity: Joi.string().description('entity').optional(),
                    view: Joi.string().description('view').optional()
                }
            },
            handler: configuration.list,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [         
                {
                    method: aclFactory.hasAdminOrAclVerified,
                    assign: 'isAdmin'
                }]
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/management/transports',
        config: {
            description: 'List transports',
            notes: 'List transports',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            response: {
                schema: require('./mediatypes/transports')
            },
            validate: {
                query: {
                    transport: Joi.string().description('id').optional(),
                    view: Joi.string().description('view').optional()
                }
            },
            handler: transport.list,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_TRANSPORTS, 'apiConfig'),
                assign: 'acl',
            },                
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin'
            }]
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/management/groups',
        config: {
            description: 'List groups',
            notes: 'List groups',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            response: {
                schema: require('./mediatypes/groups')
            },
            validate: {
                query: {
                    group: Joi.string().required().description('id').optional(),
                    view: Joi.string().required().description('view').optional()
                }
            },
            handler: management.listGroups,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_GROUPS, 'apiConfig'),
                assign: 'acl',
            },                
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin'
            }]
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/management/users',
        config: {
            description: 'List users',
            notes: 'List users',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
//            response: {
//                schema: require('./mediatypes/users')
//            },
            validate: {
                query: {
                    account: Joi.string().description('id').optional(),
                    group: Joi.string().description('group').optional(),                    
                    view: Joi.string().description('view').optional()
                }
            },
            handler: management.listUsers,
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
                method: aclFactory.checkAuthorizations(AclEnums.LIST_USERS, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin'
            }]
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v1/management/users',
        config: {
            description: 'Enrolls a new account',
            notes: 'Creates a new account',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    account: Joi.string().required().description('user account'),
                    ldapAccount: Joi.string().optional().description('ldap account'),
                    firstName: Joi.string().optional().description('first name'),
                    lastName: Joi.string().optional().description('last name'),
                    cellphone: Joi.number().optional().description('cellphone'),
                    group: Joi.string().required().description('group'),
                    redirectTo: Joi.string().optional().description('redirect url'),
                    hasConfirmation: Joi.bool().required()                    
                }
            },
            handler: user.enroll,
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
                method: aclFactory.checkAuthorizations(AclEnums.CREATE_USER, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            },
            {
                method: management.checkLicense,
                assign: 'licenseInfo'
            }]
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v1/management/users/multi',
        config: {
            description: 'Multi enrollment',
            notes: 'Multi enrollment',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    group: Joi.string().required().description('group'),                    
                    csv: Joi.string().required().description('csv')
                }
            },
            handler: user.multiEnrollment,
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
                method: aclFactory.checkAuthorizations(AclEnums.BATCH_CREATE_USER, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            },
            {
                method: management.checkLicense,
                assign: 'licenseInfo'
            }]
        }
    });
    
    plugin.route({
        method: 'PUT',
        path: '/v1/management/users',
        config: {
            description: 'Updates an account',
            notes: 'Updates an account',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    account: Joi.string().required().description('id'),
                    ldapAccount: Joi.string().optional().allow('').description('ldap account'),
                    firstName: Joi.string().optional().allow('').description('first name'),
                    lastName: Joi.string().optional().allow('').description('last name'),
                    cellphone: Joi.number().optional().allow('').description('cellphone'),
                    group: Joi.string().optional().allow('').description('group'),
                    resetAccount: Joi.bool().optional(),
                    redirectTo: Joi.string().optional().description('redirect url'),
                    enable: Joi.bool().optional()                    
                }
            },
            handler: user.update,
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
                method: aclFactory.checkAuthorizations(AclEnums.UPDATE_USER, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            },
            {
                method: management.checkLicense,
                assign: 'licenseInfo'
            }]
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v1/management/groups',
        config: {
            description: 'Adds a new group',
            notes: 'Creates a new group',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    group: Joi.string().required().description('user group'),
                    description: Joi.string().required().description('description'),
                    transport: {
                        id: Joi.string().required().description('transport id'),
                        description: Joi.string().allow('').optional().description('transport description')
                    },                    
                    adapter: {
                        id: Joi.string().required().description('adapter id'),
                        description: Joi.string().allow('').optional().description('adapter description')
                    }
                }
            },
            handler: group.add,
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
                method: aclFactory.checkAuthorizations(AclEnums.CREATE_GROUP, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            }]
        }
    });

    plugin.route({
        method: 'PUT',
        path: '/v1/management/groups',
        config: {
            description: 'Updates a group',
            notes: 'Updates a group',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    group: Joi.string().required().description('user group'),
                    description: Joi.string().required().description('description'),
                    transport: {
                        id: Joi.string().required().description('transport id'),
                        description: Joi.string().allow('').optional().description('transport description')
                    },                    
                    adapter: {
                        id: Joi.string().required().description('adapter id'),
                        description: Joi.string().allow('').optional().description('adapter description')
                    }
                }
            },
            handler: group.update,
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
                method: aclFactory.checkAuthorizations(AclEnums.UPDATE_GROUP, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            }]
        }
    });

    plugin.route({
        method: 'DELETE',
        path: '/v1/management/groups/{id}',
        config: {
            description: 'Removes group',
            notes: 'Deletes group',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            validate: {
                params: {
                    id: Joi.string().required().description('id'),
                }
            },
            handler: group.delete,
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
                method: aclFactory.checkAuthorizations(AclEnums.DELETE_GROUP, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            }]
        }
    });

    plugin.route({
        method: 'DELETE',
        path: '/v1/management/users/{id}',
        config: {
            description: 'Inactivates an account',
            notes: 'Inactivates an account',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            validate: {
                query: {
                    force: Joi.bool().optional().description('force delete')
                },
                params: {
                    id: Joi.string().description('id')
                }
            },
            handler: user.delete,
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
                method: user.getAdminCount,
                assign: 'adminCount'
            },            
            {
                method: aclFactory.checkAuthorizations(AclEnums.DELETE_USER, 'apiConfig'),
                assign: 'acl',
            },
            {
                method: aclFactory.hasAdminOrAclVerified,
                assign: 'isAdmin',
            }]            
        }
    });


    plugin.route({
        method: 'POST',
        path: '/v1/management/configs',
        config: {
            description: 'Adds a new config',
            notes: 'Creates a new config',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    key: Joi.string().required().description('key'),
                    description: Joi.string().required().description('description'),
                    entityId: Joi.string().allow('').optional(),
                    entity: Joi.string().allow('').optional(),
                    settings: Joi.any().optional()
                }
            },
            handler: configuration.add,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: management.hasAdmin,
                    assign: 'isAdmin'
                }]
        }
    });
    
    plugin.route({
        method: 'POST',
        path: '/v1/management/configs/generate_api_token',
        config: {
            description: 'Generates a new API token',
            notes: 'Generates a new API token',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            handler: configuration.generateApiKey,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.generateToken,
                    assign: 'generatedApiToken'
                },                   
                {
                    method: management.hasAdmin,
                    assign: 'isAdmin'
                }]
        }
    });    

    plugin.route({
        method: 'PUT',
        path: '/v1/management/configs',
        config: {
            description: 'Updates a config',
            notes: 'Updates a config',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: {
                    key: Joi.string().required().description('key'),
                    description: Joi.string().optional().description('description'),
                    entityId: Joi.string().allow('').optional(),
                    entity: Joi.string().allow('').optional(),
                    settings: Joi.any().optional()
                }
            },
            handler: configuration.update,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: management.hasAdmin,
                    assign: 'isAdmin'
                }]
        }
    });

    plugin.route({
        method: 'DELETE',
        path: '/v1/management/configs/{id}',
        config: {
            description: 'Removes config',
            notes: 'Deletes config',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 401,
                            message: 'Unauthorized'
                        }
                    ]
                }
            },
            validate: {
                params: {
                    id: Joi.string().required().description('id'),
                }
            },
            handler: configuration.delete,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: management.hasAdmin,
                    assign: 'isAdmin'
                }]
        }
    });
    
    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
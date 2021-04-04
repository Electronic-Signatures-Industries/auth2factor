let Joi = require('joi');
let securityKeys = require('./v2/securityKeys');
let apiAuthorizationFactory = require('../shared/apiAuthorizationFactory');
let roleAuthorizationFactory = require('../shared/roleAuthorizationFactory');

exports.register = function (plugin, options, next) {


    plugin.route({
        method: 'GET',
        path: '/v2/security_keys',
        config: {
            description: 'List security keys',
            notes: 'List security keys',
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
                schema: require('./mediatypes/securityKeys')
            },
            handler: securityKeys.list,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                },                
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                }]
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v2/security_keys/challenge',
        config: {
            description: 'Generate server challenge',
            notes: 'Generate server challenge',
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
            handler: securityKeys.generateServerChallenge,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                },
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                }]
        }
    });

   
    plugin.route({
        method: 'DELETE',
        path: '/v2/security_keys/{id}',
        config: {
            description: 'Removes security key',
            notes: 'Deletes security key',
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
            handler: securityKeys.remove,
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                },
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                }]
        }
    });
    
    // Check registration data. We're checking correct challenge and certificate signature.
    // request: {version, appId, challenge} - from user session, kept on server.
    // registerData: {clientData, registrationData} - result of u2f.register
    plugin.route({
        method: 'POST',
        path: '/v2/security_keys',
        config: {
            description: 'Registers security key',
            notes: 'Registers security key',
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
                payload: {
                    clientData: Joi.string().required().description('clientData'),
                    registrationData: Joi.string().required().description('registrationData'),
                }
            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },            
            handler: securityKeys.register,
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                },
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                }]
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
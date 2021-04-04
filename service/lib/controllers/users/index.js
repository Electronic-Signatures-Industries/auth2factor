const Joi = require('joi');
const Hapi = require('hapi');
const forgot = require('./v1/forgot');
const profile = require('./v1/profile');
const authenticationHandlers = require('./v1/authentication');
const authenticationV2_handlers = require('./v2/authentication');
const apiAuthorizationFactory = require('../shared/apiAuthorizationFactory');
const securityKeyAuthenticator = require('../shared/securityKeyAuthenticator');
const roleAuthorizationFactory = require('../shared/roleAuthorizationFactory');

const userMediaType = Joi.object({
    email: Joi.string()
}).meta({
    className: 'Result'
});


exports.register = function (plugin, options, next) {


    plugin.route({
        method: 'POST',
        path: '/v2/users/authenticate',
        config: {
            description: 'Authenticates an user',
            notes: 'Authenticates an user account',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string().required().description('email address'),
                    password: Joi.string().required().min(8).description('password'),
                    doRequestOtc: Joi.bool().optional().description('doRequestOtc'),
                })
            },
            pre: [
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                },
                {
                    method: roleAuthorizationFactory.userLoginValidation,
                    assign: 'userLoginValidation'
                },
                {
                    method: securityKeyAuthenticator.getSecurityKeys,
                    assign: 'securityKeys'
                },
                {
                    method: securityKeyAuthenticator.generateSignRequests,
                    assign: 'signRequests'
                }]
        },
        handler: authenticationV2_handlers.login
    });

    plugin.route({
        method: 'GET',
        path: '/v1/users/ping',
        config: {
            description: 'Validates token bearer is still active',
            notes: 'Validates token bearer is still active',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                }],
            handler: authenticationHandlers.ping
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v2/users/u2f',
        config: {
            description: 'Authenticates with a FIDO U2F security key',
            notes: 'Authenticates with a FIDO U2F security key',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: Joi.object({
                    clientData: Joi.string().required().description('clientData'),
                    signatureData: Joi.string().required().description('signatureData'),
                })
            },
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
                },
                {
                    method: roleAuthorizationFactory.userLoginValidation,
                    assign: 'userLoginValidation'
                },
                {
                    method: securityKeyAuthenticator.authenticate,
                    assign: 'u2fSignResponse'
                }],
            handler: authenticationV2_handlers.authenticateSecurityKey
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v2/users/otc',
        config: {
            description: 'Authenticates with a two-factor authentication code',
            notes: 'Authenticates with a two-factor authentication code',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            validate: {
                payload: Joi.object({
                    code: Joi.string().required().regex(/^[0-9]{6}$/).description('OTC code')
                })
            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                }],
            handler: authenticationV2_handlers.otc
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v2/users/otc/request',
        config: {
            description: 'Requests a two-factor authentication code',
            notes: 'Requests a two-factor authentication code',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            //            response: {
            //                schema: require('./mediatypes/adapters')
            //            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            handler: authenticationV2_handlers.requestOtc
        }
    });

    plugin.route({
        method: 'POST',
        path: '/v2/users/delegate',
        config: {
            description: 'Requests a OTC request token on behalf of another user (API only)',
            notes: 'Requests a OTC request token on behalf of another user (API only)',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            //            response: {
            //                schema: require('./mediatypes/adapters')
            //            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            validate: {
                payload: {
                    account: Joi.string().required().description('account')
                }
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAPIOnlyAuthorizations,
                    assign: 'apiAuthorizationFactory'
                },
                {
                    method: roleAuthorizationFactory.getUserInfo,
                    assign: 'userModel'
                },                
                {
                    method: securityKeyAuthenticator.getSecurityKeys,
                    assign: 'securityKeys'
                },
                {
                    method: securityKeyAuthenticator.generateSignRequests,
                    assign: 'signRequests'
                }],
            handler: authenticationV2_handlers.delegate
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/users/confirm',
        config: {
            description: 'Confirms a new account',
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
                query: {
                    token: Joi.string().required().description('confirmation token')
                }
            },
            pre: [
                {
                    method: authenticationHandlers.decodeConfirmationToken,
                    assign: 'confirmation'
                }],
            handler: authenticationHandlers.confirm
        }
    });


    // Forgot / Reset
    plugin.route({
        method: 'POST',
        path: '/v1/users/reset',
        config: {
            description: 'Enables user reset by sending email',
            notes: 'Sends an email',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
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
                    email: Joi.string()
                        .required()
                        .description('email address'),
                    redirectTo: Joi.string().optional()
                }
            },
            handler: forgot.sendResetEmail
        }
    });


    plugin.route({
        method: 'PUT',
        path: '/v1/profile/reset',
        config: {
            description: 'Confirms reset setting for OTC seed or password',
            notes: 'Changes user password',
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
                    preferSoftToken: Joi.bool().optional().description('preferSoftToken'),
                    seedChangeRequest: Joi.string().optional().allow('').description('seed'),
                    password: Joi.string().optional().allow('').description('password')
                }
            },
            handler: profile.updateResetProfile,
            pre: [{
                method: profile.decodeOtcChangeRequest,
                assign: 'seed'
            }],
            auth: {
                mode: 'try',
                strategy: 'token'
            }
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/profile/reset',
        config: {
            description: 'Gets profile reset info',
            notes: 'Gets profile reset info',
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
                query: {
                    token: Joi.string().required().description('profile reset token')
                }
            },
            pre: [{
                method: profile.decodeProfileResetToken,
                assign: 'resetProfileInfo'
            },
                {
                    method: profile.getLicense,
                    assign: 'licenseInfo'
                }],
            handler: profile.resetSettings
        }
    });

    plugin.route({
        method: 'GET',
        path: '/v1/profile/info',
        config: {
            description: 'Gets an user profile info',
            notes: 'Gets an user profile info',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [
                        {
                            code: 400,
                            message: 'Bad Request'
                        },
                        {
                            code: 401,
                            message: 'Unauthorized'
                        },
                        {
                            code: 404,
                            message: 'Not Found'
                        },
                        {
                            code: 500,
                            message: 'Internal Server Error'
                        }
                    ]
                }
            },
            auth: {
                mode: 'required',
                strategy: 'token'
            },
            pre: [
                {
                    method: apiAuthorizationFactory.checkAuthorizations,
                    assign: 'apiAuthorizationFactory'
                }],
            handler: profile.info
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
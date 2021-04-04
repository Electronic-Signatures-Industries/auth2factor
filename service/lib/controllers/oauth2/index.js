const Joi = require('joi');
const scopeFactory = require('./middleware/oauthScopeFactory');
const clientFactory = require('./middleware/oauthClientFactory');
const tokenHandler = require('./token');

exports.register = function (plugin, options, next) {


    plugin.route({
        method: 'POST',
        path: '/oauth2/access_token',
        config: {
            description: 'Creates access token',
            notes: 'Creates access token',
            tags: ['api'],
            plugins: {
                'hapi-swagger': {
                    responseMessages: [{
                        code: 401,
                        message: 'Unauthorized'
                    }]
                }
            },
            // validate: {
            //     params: {
            //         id: Joi.string().required().description('id'),
            //     }
            // },
            handler: tokenHandler.requestToken,
            pre: [{
                method: clientFactory.parseBasicAuthorization,
                assign: 'clientInfo'
            },
            {
                method: clientFactory.resolveApiConfig,
                assign: 'configInfo'
            },{
                method: scopeFactory.resolveScope,
                assign: 'scopeInfo'
            }
            ]
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
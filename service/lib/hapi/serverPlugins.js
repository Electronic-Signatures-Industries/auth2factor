module.exports = function (config, logOptions) {

    return [
        {
            register: require('hapi-auth-bearer-token')
        },
        {
            register: require('vision')
        },
        {
            register: require('inert')
        },
        {
            register: require('good'),
            options: logOptions
        },
        {
            register: require('hapi-swagger'),
            options: {
                host: config.get("FE_HOSTNAME").replace('https://', ''),
                schemes: ['https'],
                //basePath: '/..',
                jsonPath:  '/api/swagger.json',
                // apiVersion: '1.0',
                //documentationPath: '/api/api_docs',
                validatorUrl: null,
                swaggerUIPath: '/api/api_docs/',
                // authorizations: {
                //     token: {
                //         type: "apiKey",
                //         passAs: "header",
                //         keyname: "authorization"
                //     }
                // },
                info: {
                    title: 'auth2factor API Documentation',
                    description: 'REST API Docs.',
                    contact: {
                        email: 'dev@auth2factor.com',
                    },
               }
            }
        }
    ];
};
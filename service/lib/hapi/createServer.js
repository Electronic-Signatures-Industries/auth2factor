const appHeaders = ['X-APP-RESET-RETRIES',
    'X-APP-SIGN-REQUEST',
    'X-APP-BEARER',
    'X-APP-RESET',
    'X-APP-ACCOUNT-GROUP',
    'Location',
    'X-U2F-SIGN-REQUEST'
];

const corsHeaders = 'Token, Origin, Authorization, X-Requested-With, Content-Type, Accept';

module.exports = (config) => {
    return {
        // host: config.get('apiServer:host'),
        port: config.get('API_PORT') || config.get('apiServer:port'),
        routes: {
            cors: {
                origin: ['*'],
                headers: [corsHeaders],
                exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'].concat(appHeaders),
            }
        }
    };
};
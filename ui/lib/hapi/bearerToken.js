/*jshint esversion: 6 */
/*eslint-env node*/
const Boom = require('boom');
const jwt = require('jsonwebtoken');
module.exports = (server) => {

    return {
        allowQueryToken: true,
        validateFunc(bearer, callback) {
            let matched = false;
            let bearerToken = bearer || '';

            let onVerify = (err, decoded) => {
                if (err) {
                    server.log(['frontend', 'error'], err);
                    return callback(Boom.unauthorized('Decoding confirmation failed'), matched, null);
                }

                matched = true;
                return callback(null, matched, decoded);
            };

            let secret = server.app.config.get('JWT_SECRET_SESSION');
            if (!secret) {
                throw new Error('Missing secret');
            }
            jwt.verify(bearerToken, secret, onVerify);

        }
    };
};
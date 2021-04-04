const Boom = require('boom');
const OAuthTokenService = require('../controllers/shared/security/oauthTokenService');
const BEARER_DEFAULT = 'DEFAULT';
const BEARER_CLIENT_SIGNING = 'CLIENT_SIGNING';
const BEARER_OAUTH2 = 'OAUTH2';

module.exports = (server, defaultSecret, ConfigModel, JwtTokenizer) => {
    return (bearer, callback) => {
        let matched = false;
        const invalid = Boom.unauthorized('Invalid bearer token');
        bearer = bearer || '';
        let bearerType = BEARER_DEFAULT;
        if (bearer && bearer.indexOf(':') > -1) {
            bearerType = BEARER_CLIENT_SIGNING;
        } else if (OAuthTokenService.isOAuth(bearer)) {
            bearerType = BEARER_OAUTH2;
        }

/* eslint-disable */
        const onVerify = (apiKeyId) => (err_, decoded) => {
            if (err_) {
                server.app.logger.error(err_);
                return callback(invalid, matched, null);
            }
            // allowed exp tokens only
            if (decoded && !decoded.exp) {
                return callback(invalid, false);
            }
            if (apiKeyId) {
                decoded.apiUniqueId = apiKeyId;
            }
            matched = true;            
            return callback(null, matched, decoded);
        };

        switch (bearerType) {
        case BEARER_OAUTH2:
            const clientId  = OAuthTokenService.unsafeDecode(bearer).aud;
            ConfigModel.get({ key: clientId }, (err, item) => {
                if (err) {
                    server.app.logger.error(err);
                    return callback(invalid, matched, null);
                }

                return JwtTokenizer.verify(bearer, {
                    secret: item.settings.apiToken
                }, onVerify(clientId));
            });
            break;
        case BEARER_CLIENT_SIGNING:
            let id = bearer.split(':')[0];
            let hash = bearer.split(':')[1];

            ConfigModel.get({ key: id }, (err, item) => {
                if (err) {
                    server.app.logger.error(err);
                    return callback(invalid, matched, null);
                }
                return JwtTokenizer.verify(hash, {
                    secret: item.settings.apiToken
                }, onVerify(id));
            });
            break;
        default:
            JwtTokenizer.verify(bearer, {
                    secret: defaultSecret,
                }, onVerify());
        }

    };
};
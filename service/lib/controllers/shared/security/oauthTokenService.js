// use https://github.com/hokaccha/node-jwt-simple
const jwt = require('jwt-simple');
class OAuthTokenService {

    /**
     * Reads jwt without validating
     * 
     * @static
     * @param {any} token 
     * @returns 
     * @memberof OAuthTokenService
     */
    static unsafeDecode(token) {
        return jwt.decode(token, null, true);
    }

    static verify(token, secret) {
        return jwt.decode(token, secret);
    }

    /**
     * 
     * Verifies if token is OAuth2 like
     * 
     * @static
     * @param {any} token 
     * @returns 
     * @memberof OAuthTokenService
     */
    static isOAuth(token) {
        const jwtToken = jwt.decode(token, null, true);
        return !!jwtToken.iss && jwtToken.iat > 0 &&
            !!jwtToken.aud && (jwtToken.exp > jwtToken.iat);
    }

    static generate(options) {

        if (!options.issuer) {
            throw new Error('Missing issuer');
        }

        if (!options.audience) {
            throw new Error('Missing audience');
        }

        if (!options.apiSecret) {
            throw new Error('Missing apiSecret');
        }

        const header = {
            'typ': 'JWT',
            'alg': 'HS256'
        };

        let payload = {};
        payload.iss = options.issuer;
        payload.sub = null;
        payload.aud = options.audience;
        payload.iat = Math.floor(Date.now() / 1000);
        payload.exp = Math.floor(Date.now() / 1000) + (5 * 60);

        const token = jwt.encode(payload, options.apiSecret, null, header);

        return token;

    }
}

module.exports = OAuthTokenService;
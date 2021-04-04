// sign with default (HMAC SHA256)
const jwt = require('jsonwebtoken');
const debug = require('debug')('jwt_token_manager_v2');


// https://github.com/auth0/node-jsonwebtoken
const TokenManager = function TokenManager() {

};

/**
 * Signs  token
 * @param {Object} options - The options hash.
 */
TokenManager.signData = function (data, options) {
    if (!options.secret) {
        throw new Error('Missing secret');
    }
    return jwt.sign(data, options.secret);
};

/**
 * Signs expiration token
 * @param {Object} options - The options hash.
 * @param {number} minutes - The expiration in minutes.
 * @param {number} seconds - The expiration in seconds.
 */
TokenManager.signDataExpires = function (data, options, minutes, seconds) {
    const opts = {
        expiresIn: seconds || (minutes * 60)
    };
    debug(opts);
    if (!options.secret) {
        throw new Error('Missing secret');
    }
    const token = jwt.sign(data, options.secret, opts);

    return token;
};



/**
 * Signs expiration token
 * @param {Object} options - The options hash.
 * @param {number} seconds - The expiration in seconds.
 */
TokenManager.signDataExpiresInSeconds = function (data, options, seconds) {
    return TokenManager.signDataExpires(data, options, null, seconds);
};

/**
 * @callback verifyCallback
 * @param {Object} error - The error
 * @param {Object} decoded - The decoded token
 */
/**
 * Verifies  token
 * @param {string} token - The token string.
 * @param {verifyCallback} callback - Callback returns the decoded token.
 */
TokenManager.verify = function (token, options, callback) {
    if (!options.secret) {
        throw new Error('Missing secret');
    }

    jwt.verify(token, options.secret, null, function (err, decoded) {

        if (err) {
            return callback(err, null);
        }
        return callback(null, decoded);
    });
};

module.exports = TokenManager;
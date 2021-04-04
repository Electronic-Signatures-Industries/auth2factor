// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
var debug = require('debug')('token_manager');


// https://github.com/auth0/node-jsonwebtoken
var TokenManager = function TokenManager(logger, config) {
  this.logger = logger;
  this.config = config;
  return this;
};

/**
 * Signs  token
 * @param {Object} options - The options hash.
 */
TokenManager.prototype.sign = function(options) {
  var token = jwt.sign(options, this.config.get('JWT_SECRET'));

  return token;
};

/**
 * Signs expiration token
 * @param {Object} options - The options hash.
 * @param {number} minutes - The expiration in minutes.
 * @param {number} seconds - The expiration in seconds.
 */
TokenManager.prototype.signExpires = function(options, minutes, seconds) {
  var opts = {
      expiresInSeconds: seconds || (minutes * 60) 
  };
    debug(opts);
  var token = jwt.sign(options, this.config.get('JWT_SECRET'), opts);

  return token;
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
TokenManager.prototype.verify = function(token, callback) {
  var self = this;
  
  jwt.verify(token, this.config.get('JWT_SECRET'), function(err, decoded) {
    if (err) {
      self.logger.error(err);
      debug(err);
      return callback(err, null);
    }

    return callback(null, decoded);
  });
};

TokenManager.create = function(logger, config) {
  return new TokenManager(logger, config);
};

module.exports = TokenManager;

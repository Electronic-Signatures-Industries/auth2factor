var fs = require('fs');
var debug = require('debug')('license_manager');
var crypto = require('crypto');

var LicenseManager = function LicenseManager(logger, config) {
    this.logger = logger;
    this.config = config;

    return this;
};

/**
 * @callback signCallback
 * @param {Object} error - The error
 * @param {String} signature - Base64 string
 */
/**
 * Signs  license
 * @param {Object} options - The options hash.
 * @param {signCallback} callback - Callback returns { signature: string }
 */
LicenseManager.prototype.sign = function (options, callback) {

    var self = this;
    var path = options.privateKey || (options.keyPath + this.config.get('license:private'));
        
    fs.readFile(path, function (err, pem) {
        if (err) {
            callback(err, null);
        }

        var signer = crypto.createSign(options.algorithm || self.config.get('license:algorithm'));
        signer.update(JSON.stringify(options.license));
        var output = signer.sign(pem, 'base64');

        return callback(null, {
            signature: output
        });
    });

};

/**
 * @callback verifyCallback
 * @param {Object} error - The error
 * @param {Boolean} verified - True if valid, else false
 */
/**
 * Verifies  license
 * @param {Object} options - The options hash.
 * @param {verifyCallback} callback - Callback returns { verified: bool }
 */
LicenseManager.prototype.verify = function (options, callback) {
    var self = this;
    var path = options.publicKey || (options.keyPath + this.config.get('license:public'));
    
    if (!options.signature) {
      options.signature = options.license.Key;
      delete options.license.Key;
    }
    
    fs.readFile(path, function (err, pem) {
        if (err) {
            return callback(err, null);
        }

        var verifier = crypto.createVerify(options.algorithm || self.config.get('license:algorithm'));
        verifier.update(JSON.stringify(options.license));
        var output = verifier.verify(pem, options.signature, 'base64');

        return callback(null, {
            verified: output
        });
    });

};

LicenseManager.create = function (logger, config) {
    return new LicenseManager(logger, config);
};

module.exports = LicenseManager;
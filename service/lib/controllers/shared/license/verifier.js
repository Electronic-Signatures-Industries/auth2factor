const fs = require('fs');
const crypto = require('crypto');

class LicenseVerifier {

    constructor(config){
        this.appConfig = config;
    }

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
    verify(options, callback) {
        if (!options.publicKey){
            throw new Error('Missing publicKey');
        }

        if (!options.algorithm){
            throw new Error('Missing algorithm');
        }        
        const path = options.publicKey;

        if (!options.signature) {
            options.signature = options.license.Key;
            delete options.license.Key;
        }

        fs.readFile(path, function (err, pem) {
            if (err) {
                return callback(err, null);
            }

            const verifier = crypto.createVerify(options.algorithm);
            verifier.update(JSON.stringify(options.license));
            const output = verifier.verify(pem, options.signature, 'base64');

            return callback(null, {
                verified: output
            });
        });

    }
}

module.exports = LicenseVerifier;
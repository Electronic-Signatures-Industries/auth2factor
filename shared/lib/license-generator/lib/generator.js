'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var _ = require('underscore');
var LicenseManager = require('../../license-engine/licenseManager');
var ALGO = 'RSA-SHA512';

var LicenseGenerator = function LicenseGenerator() {
    this.manager = new LicenseManager({}, {});
};

LicenseGenerator.prototype.generate = function (license, callback) {
    this.manager.sign({
        license: license,
        privateKey: __dirname + '/../af_private.pem',
        algorithm: ALGO
    }, function (err, result) {
        if (err) {
            throw err;
            return;
        }
        var lic = _.extend(license, {
            Key: result.signature
        });

        if (callback) {
            callback(null, lic);
        }
    });
};

exports['default'] = LicenseGenerator;
module.exports = exports['default'];
let _ = require('underscore');
let LicenseManager = require('../../license-engine/licenseManager');
const ALGO = 'RSA-SHA512';

var LicenseGenerator = function LicenseGenerator() {
    this.manager = new LicenseManager({}, {});
};

LicenseGenerator.prototype.generate = function (license, callback) {
    this.manager.sign({
        license: license,
        privateKey: __dirname + '/../af_private.pem',
        algorithm: ALGO
    }, (err, result) => {
        if (err) {
            throw err;
            return;
        }
        let lic = _.extend(license, { 
            Key: result.signature
        });
        
        if (callback) {
            callback(null, lic);
        }
    });
};

export default LicenseGenerator;
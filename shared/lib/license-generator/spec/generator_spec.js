/*globals waitsFor: true, jasmine:true, expect:true*/
'use strict';

var LicenseManager = require('../../license-engine/licenseManager');
var _ = require('underscore');

describe('License Generator', function () {

    var manager;

    beforeEach(function () {
        manager = new LicenseManager({}, {});
    });

    afterEach(function () {});

    describe('Signing', function () {
        var license = {
            'Licensed To': 'Autentifactor',
            'Company': 'Autentifactor',
            'Number of Users Licensed': 10
        };

        it('should signed license', function (done) {
            manager.sign({
                license: license,
                privateKey: __dirname + '/../af_private.pem',
                algorithm: 'RSA-SHA512'
            }, function (err, result) {
                //console.log(_.extend(license, { Key: result.signature }));
                expect(result.signature).toBeTruthy();
                done();
            });
        });
    });

    describe('Verifying', function () {
        var license;
        beforeEach(function (done) {
            license = {
                'Licensed To': 'qq',
                'Company': 'ww',
                'Number of Users Licensed': 133,
                'Generated': '2015-05-18T16:26:29.850Z',
                Key: 'FGIrIWpiA1Jux2KY8leRHnc1xR1Ctm0WbT7zFlNulMZCEpWuZ4iUJd8L5R+peSq8v6jnC70U/MnyfVo2qqr7r+hucrKFtuddN8LOXzk4wSjSaFPuTiu8ICeZoqgbsZFaarWkoH7md5os6K3Z7QOUiAY+8QgWVeXR/hB/ELlMxSc='
            };
            done();
            //            manager.sign({
            //                license: license,
            //                privateKey: __dirname + '/../af_private.pem',
            //                algorithm: 'RSA-SHA512'
            //            }, (err, result) => {
            //                license.Key = result.signature;
            //                console.log(license);
            //                expect(result.signature).toBeTruthy();
            //                done();
            //            });
        });

        it('should verify license and return invalid signature (false)', function (done) {
            manager.verify({
                license: _.omit(license, 'Key'),
                signature: license.Key + 'a',
                publicKey: __dirname + '/../af.pub',
                algorithm: 'RSA-SHA512'
            }, function (err, result) {
                console.log(license);

                expect(result.verified).toBeFalsy();
                done();
            });
        });

        it('should verify license and return success', function (done) {

            manager.verify({
                license: license,
                publicKey: __dirname + '/../af.pub',
                algorithm: 'RSA-SHA512'
            }, function (err, result) {
                console.log(license);

                expect(result.verified).toBeTruthy();
                done();
            });
        });
    });
});
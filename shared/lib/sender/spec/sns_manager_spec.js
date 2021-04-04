/*globals expect:true*/

'use strict';

var AWSSnsManager = require('../lib/awsSnsManager');

describe('Transport - SNS Manager', function () {

    describe('Push transport', function () {
        var sns = new AWSSnsManager();
        var endpoint = '';

        beforeEach(function () {
            endpoint = 'arn:aws:sns:us-east-1:653861443478:endpoint/GCM/auth2factor/a82632b6-70cc-3d08-a828-9f5b08a6fb17';
        });

        it('should send push to endpoint', function (done) {
            sns.send({
                endpoint: endpoint,
                message: '012210',
                subject: 'auth2factor - Código de Verificación'
            }, function (err, resp) {

                expect(resp).toBeTruthy();
                done();
            });
        });

        it('should fail to send push to endpoint', function (done) {
            sns.send({
                endpoint: endpoint + 'aa',
                message: '012210',
                subject: 'auth2factor - Código de Verificación'
            }, function (err, resp) {

                expect(err).toBeTruthy();
                done();
            });
        });
    });
});

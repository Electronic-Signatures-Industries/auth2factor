/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

const server = require('./../../../lib/hapi');
const signer = require('./../../../lib/controllers/shared/jwtTokenizer');
const env = require('./../../fixtures/env');
let email = env.email;

// mock
let TransportModel = server.app.mongoose.models.Transport;

TransportModel.findOne = jasmine.createSpy('Transport.findOne').and.callFake(function (u, f, cb) {
    if (typeof f !== 'string') {
        cb = f;
    }

    return cb(null, {});
});


describe('Management - Transport Routes', () => {
    it('should return OK', (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('Transport', () => {
        let key;
        let token;

        beforeEach(() => {
            key = env.JWT_SECRET;
            let model = {
                email: email,
                date: new Date(),
            };
            token = signer.signDataExpires(model, {
                secret: key
            }, 5);
        });

        it('should generate a token', () => {
            expect(token).not.toBe(null);
        });


        it('should list transports - GET /transports', (done) => {
            server.inject({
                method: 'GET',
                url: '/api/v1/management/transports',
                headers: {
                    authorization: 'Bearer ' + token
                }
            }, (res) => {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.result.transports).toBeTruthy();
                done();
            });
        });


    });
});
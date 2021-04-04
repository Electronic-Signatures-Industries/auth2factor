/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

const server = require('./../../../lib/hapi');
const signer = require('./../../../lib/controllers/shared/jwtTokenizer');
const env = require('./../../fixtures/env');
let email = env.email;

// mock
let AdapterModel = server.app.mongoose.models.Adapter;

AdapterModel.findOne = jasmine.createSpy('Adapter.findOne').and.callFake(function (u, f, cb) {
    if (typeof f !== 'string') {
        cb = f;
    }

    return cb(null, {});
});


describe('Management - Adapter Routes', () => {
    it('should return OK', (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('Adapter', () => {
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


        it('should list adapters - GET /adapters', (done) => {
            server.inject({
                method: 'GET',
                url: '/api/v1/management/adapters',
                headers: {
                    authorization: 'Bearer ' + token
                }
            }, (res) => {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.result.adapters).toBeTruthy();
                done();
            });
        });


    });
});
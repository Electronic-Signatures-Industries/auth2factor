/*eslint-env node*/
/*globals beforeEach: true, btoa: true, describe: true, jasmine:true, expect:true, it: true, xit: true*/

const server = require('./../../../lib/hapi');
const env = require('./../../fixtures/env');
const {
    clientKey,
    clientSecret,
    apiSecret,
} = env;


let email = 'user@a.com';
const DEBUG_OTC_CODE = '121212';

const aValidUser = {
    verifyOTC: (code) => DEBUG_OTC_CODE === code,
    validPassword: () => true,
    getOTC: () => null,
    email: email,
    group: 'admin',
    preferSoftToken: true,
    updated: new Date(),
    created: new Date(),
    hasEmailConfirmed: true,
    firstName: 'Ro',
    lastName: 'Factor',
    transport: 'mydomain-otc',
};

let adminGroup = {
    transport: {
        id: 'softtoken:ga',
    }
};


// mock

let UserModel = server.app.mongoose.models.User;
UserModel.create = jasmine.createSpy('User.create').and.callFake(function (u, cb) {
    return cb(null, {});
});

UserModel.findOne = jasmine.createSpy('User.findOne').and.callFake(function (u, f, cb) {
    if (typeof f !== 'string') {
        cb = f;
    }
    if (u.email === email) {
        return cb(null, aValidUser);
    }
    return cb(null, {});
});

let GroupModel = server.app.mongoose.models.Group;
GroupModel.findOne = jasmine.createSpy('').and.callFake(function (q, f, cb) {
    if (typeof f !== 'string') {
        cb = f;
    }
    if (q.group === 'admin') {
        return cb(null, adminGroup);
    }
    return cb(null, {});
});

describe('OAuth2 Client Credentials', () => {
    it('should return OK', (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('OAuth2', () => {
        let authHeader;
        let bearerToken;


        beforeEach(() => {

            // mock
            const ConfigModel = server.app.mongoose.models.Config;
            const model = {
                settings: {
                    ip: '0.0.0.0',
                    apiToken: apiSecret,
                    clientSecret,
                }
            };


            ConfigModel.findOne = jasmine.createSpy('Config.findOne')
                .and.callFake(function (u, f, cb) {
                    if (typeof f !== 'string') {
                        cb = f;
                    }

                    return cb(null, model);
                });

            authHeader = Buffer.from(`${clientKey}:${clientSecret}`).toString('base64');
        });

        it('should generate a token', () => {
            expect(authHeader).not.toBe(null);
        });


        it('should return an access token', (done) => {
            server.inject({
                method: 'POST',
                url: '/api/oauth2/access_token',
                headers: {
                    authorization: 'Basic ' + authHeader,
                },
                payload: {
                    grant_type: 'client_credentials'
                }
            }, (res) => {
                expect(JSON.parse(res.payload).access_token).toBeDefined();
                expect(res.statusCode).toBe(200);

                bearerToken = JSON.parse(res.payload).access_token;
                done();
            });
        });

        it('authenticate bearer successfully', (done) => {
            server.inject({
                method: 'GET',
                headers: {
                    authorization: `Bearer ${bearerToken}`,
                },
                url: '/api/v1/users/ping',
            }, (res) => {
                expect(res.statusCode).toBe(200);
                done();
            });
        });

        describe('should request 2FA using OAuth2', () => {
            let tokenOtc;
            it('and expect delegated tokens', (done) => {
                server.inject({
                    method: 'POST',
                    payload: {
                        account: email,
                    },
                    headers: {
                        authorization: `Bearer ${bearerToken}`,
                    },
                    url: '/api/v2/users/delegate',
                }, (res) => {
                    tokenOtc = res.headers['x-app-sign-request'];
                    expect(res.headers['x-app-sign-request']).toBeDefined();
                    expect(res.statusCode).toBe(201);
                    done();
                });
            });

            it('expect OTC request', (done) => {
                server.inject({
                    method: 'POST',
                    payload: {
                        code: DEBUG_OTC_CODE
                    },
                    url: '/api/v2/users/otc',
                    headers: {
                        authorization: 'Bearer ' + tokenOtc
                    }
                }, (resp) => {
                    let tokenUser = resp.headers['x-app-bearer'];
                    expect(tokenUser).toBeTruthy();
                    expect(resp.statusCode).toBe(201);
                    // expect(resp.result).toBe({});
                    done();

                });
            });
        });

    });
});
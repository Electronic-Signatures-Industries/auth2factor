/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

const server = require('./../../../lib/hapi');
const jwt = require('jsonwebtoken');
const RuthaUtils = require('rutha-utils');

const config = RuthaUtils.createConfig({
    path: {
        config: __dirname + '/../../../config'
    }
}).load();

let email = 'user@a.com';
const DEBUG_OTC_CODE = '121212';

// expect(resp2.statusCode).toBe(200);
// expect(resp2.result.pushDeviceName).toBeDefined();
// fixture
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

const configs = require('./../../../migrations/fixtures/configs');
let adminGroup = {
    transport: {
        id: 'softtoken:ga',
    }
};


// mock
let ConfigModel = server.app.mongoose.models.Config;
ConfigModel.findOne = jasmine.createSpy('').and.callFake(function (q, f, cb) {
    if (typeof f !== 'string') {
        cb = f;
    }    
    if (q.key === 'default:system:env') {
        return cb(null, configs.find(i => {
            return i.key === 'default:system:env'; 
        }));
    } else {
        return cb(null, {
            description: '',
        });
    }
});

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

describe('Users Routes', () => {
    it('should return OK', (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('User', () => {

        let key;
        let token;

        beforeEach(() => {
            key = config.get('JWT_SECRET');
        });

        afterEach(() => {
        });

        it('should generate a token', () => {
            expect(token).not.toBe(null);
        });

        describe('should login POST v2/users/authenticate', () => {
            it('fails if user not found', (done) => {
                let user = {
                    email: 'not_found',
                    password: '0123456789'
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(404);
                    //expect(res.result).toBe({});
                    done();
                });
            });

            it('authenticate user', (done) => {

                let user = {
                    email: email,
                    password: '0123456789'
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {
                    let tokenOtc = res.headers['x-app-sign-request'];
                    expect(tokenOtc).toBeTruthy();
                    expect(res.statusCode).toBe(201);
                    expect(GroupModel.findOne).toHaveBeenCalled();
                    done();
                });
            });

            it('authenticate user and skip messaging OTC', (done) => {
                let user = {
                    email: email,
                    password: '0123456789',
                    doRequestOtc: false
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {
                    let tokenOtc = res.headers['x-app-sign-request'];
                    expect(tokenOtc).toBeTruthy();
                    expect(res.statusCode).toBe(201);
                    //expect(res.result).toBe({});
                    done();
                });
            });

        });


        describe('should login and 2FA with OTC - POST v2/users/otc', () => {
            it('succeed', (done) => {
                let user = {
                    email: email,
                    password: '0123456789',
                    doRequestOtc: false
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {

                    let tokenOtc = res.headers['x-app-sign-request'];
                    expect(tokenOtc).toBeTruthy();
                    expect(res.statusCode).toBe(201);
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

            it('should succeed and ping - GET /users/ping ', (done) => {
                let user = {
                    email: email,
                    password: '0123456789',
                    doRequestOtc: false
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {

                    let tokenOtc = res.headers['x-app-sign-request'];
                    expect(tokenOtc).toBeTruthy();
                    expect(res.statusCode).toBe(201);
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

                        server.inject({
                            method: 'GET',
                            url: '/api/v1/users/ping',
                            headers: {
                                authorization: 'Bearer ' + tokenUser
                            }
                        }, (resp2) => {
                            expect(resp2.statusCode).toBe(200);
                            done();
                        });

                    });
                });
            });

            it('should succeed and get info - GET /profile/info ', (done) => {
                let user = {
                    email: email,
                    password: '0123456789',
                    doRequestOtc: false
                };

                server.inject({
                    method: 'POST',
                    payload: user,
                    url: '/api/v2/users/authenticate'
                }, (res) => {

                    let tokenOtc = res.headers['x-app-sign-request'];
                    expect(tokenOtc).toBeTruthy();
                    expect(res.statusCode).toBe(201);
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

                        server.inject({
                            method: 'GET',
                            url: '/api/v1/profile/info',
                            headers: {
                                authorization: 'Bearer ' + tokenUser
                            }
                        }, (resp2) => {
                            expect(resp2.statusCode).toBe(200);
                            expect(resp2.result.group).toBeDefined();
                            expect(resp2.result.transport).toBeDefined();
                            expect(resp2.result.firstName).toBeDefined();
                            expect(resp2.result.lastName).toBeDefined();
                            expect(resp2.result.preferSoftToken).toBeDefined();
                            expect(resp2.result.updated).toBeDefined();
                            expect(resp2.result.created).toBeDefined();
                            done();
                        });

                    });
                });
            });

        });

        xit('should authenticate user, do 2FA step and register device - PUT /profile/register/device ', (done) => {
            let user = {
                email: email,
                password: '0123456789',
                doRequestOtc: false
            };

            server.inject({
                method: 'POST',
                payload: user,
                url: '/api/v2/users/authenticate'
            }, (res) => {

                let tokenOtc = res.headers['x-app-sign-request'];
                expect(tokenOtc).toBeTruthy();
                expect(res.statusCode).toBe(201);
                server.inject({
                    method: 'POST',
                    payload: {
                        code: process.env.DEBUG_OTC_CODE
                    },
                    url: '/api/v2/users/otc',
                    headers: {
                        authorization: 'Bearer ' + tokenOtc
                    }
                }, (resp) => {
                    let tokenUser = resp.headers['x-app-bearer'];
                    expect(tokenUser).toBeTruthy();
                    expect(resp.statusCode).toBe(201);

                    server.inject({
                        method: 'PUT',
                        url: '/api/v1/profile/register/device',
                        headers: {
                            authorization: 'Bearer ' + tokenUser
                        },
                        payload: {
                            platform: 'gcm',
                            deviceUuid: '1-2-3-4-5',
                            deviceName: 'RM',
                            deviceToken: '1233'
                        }
                    }, (resp2) => {
                        expect(resp2.statusCode).toBe(204);
                        done();
                    });

                });
            });
        });

        xit('should authenticate user, do 2FA step and unregister device - DELETE /profile/unregister/device ', (done) => {
            let user = {
                email: email,
                password: '0123456789',
                doRequestOtc: false
            };

            server.inject({
                method: 'POST',
                payload: user,
                url: '/api/v1/users/authenticate'
            }, (res) => {

                let tokenOtc = res.headers['x-app-autentifactor'];
                expect(tokenOtc).toBeTruthy();
                expect(res.statusCode).toBe(201);
                server.inject({
                    method: 'POST',
                    payload: {
                        code: process.env.DEBUG_OTC_CODE
                    },
                    url: '/api/v1/users/otc',
                    headers: {
                        authorization: 'Bearer ' + tokenOtc
                    }
                }, (resp) => {
                    let tokenUser = resp.headers['x-app-autentifactor-bearer'];
                    expect(tokenUser).toBeTruthy();
                    expect(resp.statusCode).toBe(201);

                    server.inject({
                        method: 'DELETE',
                        url: '/api/v1/profile/unregister/device',
                        headers: {
                            authorization: 'Bearer ' + tokenUser
                        }
                    }, (resp2) => {
                        expect(resp2.statusCode).toBe(204);
                        done();
                    });

                });
            });
        });

    });
});
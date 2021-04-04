/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

const Hapi = require('hapi');
const server = require('./../../../lib/hapi');
const jwt = require('jsonwebtoken');
const RuthaUtils = require('rutha-utils');

const config = RuthaUtils.createConfig({
    path: {
        config: __dirname + '/../../../config'
    }
}).load();

describe("Management - Configs Routes", () => {
    it("should return OK", (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('Config', () => {
        var email;
        var key;
        var token;

        beforeEach(() => {
            email = 'molekilla@gmail.com';
            key = config.get('JWT_SECRET');
            token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

        });

        it("should generate a token", () => {
            expect(token).not.toBe(null);
        });

        describe('list stats', () => {
            it("should list config stats", (done) => {
                server.inject({
                    method: 'GET',
                    url: '/api/v1/management/stats',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(200);
                    expect(res.result.stats).toBeTruthy();
                    // expect(res.result.stats).toBe({});
                    done();
                });
            });            
        });
        describe('adding a regular config item', () => {


            it("should add config - POST /configs", (done) => {
                var config = {
                    key: 'sms-empresa',
                    entity: 'transport',
                    entityId: 'sms:twilio',
                    description: 'sms de empresa',
                    settings: {
                        url: 'ldap://WIN-6H5SIVUC0FV.app.local',
                        baseDN: 'dc=app,dc=local',
                        username: 'Administrador@app.local',
                        password: 'Admin11'
                    }
                };

                server.inject({
                    method: 'POST',
                    payload: config,
                    url: '/api/v1/management/configs',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(201);
                    // expect(res.result).toBe({});
                    done();
                });
            });

            it("should list configs by entity - GET /configs", (done) => {
                server.inject({
                    method: 'GET',
                    url: '/api/v1/management/configs?entity=transport',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(200);
                    expect(res.result.configs).toBeTruthy();
                    done();
                });
            });

            it("should update config - PUT /configs", (done) => {
                var config = {
                    key: 'sms-empresa',
                    description: 'key from test',
                    settings: {
                        someKey: 'foogela'
                    }
                };

                server.inject({
                    method: 'PUT',
                    payload: config,
                    url: '/api/v1/management/configs',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(204);
                    // expect(res.result).toBe({});
                    done();
                });
            });

            it("should delete config - DELETE /configs", (done) => {
                var config = 'sms-empresa';

                server.inject({
                    method: 'DELETE',
                    url: '/api/v1/management/configs/' + config,
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(204);
                    // expect(res.result).toBe({});
                    done();
                });
            });

        });

        describe('adding an entity config item', () => {



            it("should list configs - GET /configs", (done) => {
                server.inject({
                    method: 'GET',
                    url: '/api/v1/management/configs',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(200);
                    expect(res.result.configs).toBeTruthy();
                    done();
                });
            });

            it("should add config - POST /configs", (done) => {
                var config = {
                    key: 'some:key',
                    description: 'key from test',
                    settings: {
                        someKey: 'foo'
                    }
                };

                server.inject({
                    method: 'POST',
                    payload: config,
                    url: '/api/v1/management/configs',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(201);
                    // expect(res.result).toBe({});
                    done();
                });
            });

            it("should update config - PUT /configs", (done) => {
                var config = {
                    key: 'some:key',
                    description: 'key from test',
                    settings: {
                        someKey: 'foogela'
                    }
                };

                server.inject({
                    method: 'PUT',
                    payload: config,
                    url: '/api/v1/management/configs',
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(204);
                    // expect(res.result).toBe({});
                    done();
                });
            });

            it("should delete config - DELETE /configs", (done) => {
                var config = 'some:key';

                server.inject({
                    method: 'DELETE',
                    url: '/api/v1/management/configs/' + config,
                    headers: {
                        authorization: "Bearer " + token
                    }
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(204);
                    // expect(res.result).toBe({});
                    done();
                });
            });
        });
    });
});
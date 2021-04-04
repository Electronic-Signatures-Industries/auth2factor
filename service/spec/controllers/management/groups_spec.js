/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

var Hapi = require('hapi');
var server = require('./../../../lib/hapi');
var jwt = require('jsonwebtoken');
var RuthaUtils = require('rutha-utils');

var config = RuthaUtils.createConfig({
    path: {
        config: __dirname + '/../../../config'
    }
}).load();


describe("Management - Group Routes", function () {
    it("should return OK", function (done) {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, function (res) {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('Group', function () {
        var email;
        var key;

        beforeEach(function () {
            email = 'molekilla@gmail.com';
            key = config.get('JWT_SECRET');
        });

        it("should generate a token", function () {
            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            expect(token).not.toBe(null);
        });


        it("should list groups - GET /groups", function (done) {
            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            server.inject({
                method: 'GET',
                url: '/api/v1/management/groups',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.result.groups).toBeTruthy();
                done();
            });
        });

        it("should create group - POST /groups", function (done) {
            var group = {
                group: 'test',
                description: 'testing',
                transport: {
                    id: 'email:sendgrid'
                },
                adapter: {
                    id: 'ldap:ldap'
                }
            };

            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            server.inject({
                method: 'POST',
                payload: group,
                url: '/api/v1/management/groups',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(201);
                // expect(res.result).toBe({});
                done();
            });
        });

        it("should update group - PUT /groups", function (done) {
            var group = {
                group: 'test',
                description: 'testing',
                transport: {
                    id: 'sms:twilio'
                },
                adapter: {
                    id: 'ldap:ldap'
                }
            };

            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            server.inject({
                method: 'PUT',
                payload: group,
                url: '/api/v1/management/groups',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(204);
                // expect(res.result).toBe({});
                done();
            });
        });

        it("should create user - POST /users", function(done) {
            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });
            
            var user = {
                group: 'test',
                account: 'email.user.test',
                hasConfirmation: false
            };


            server.inject({
                method: 'POST',
                payload: user,
                url: '/api/v1/management/users',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function(res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(201);
                //expect(res.result).toBe({});
                done();
            });
        });
        
        it("should delete group and return 400 if it has active users - DELETE /groups", function (done) {
            var group = 'test';

            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            server.inject({
                method: 'DELETE',
                url: '/api/v1/management/groups/' + group,
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(400);
                // expect(res.result).toBe({});
                done();
            });
        });
        
        it("should update user to inactive - PUT /users", function(done) {
            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });
            
            var user = {
                group: 'test',
                account: 'email.user.test',
                enable: false
            };


            server.inject({
                method: 'PUT',
                payload: user,
                url: '/api/v1/management/users',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function(res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(204);
                //expect(res.result).toBe({});
                done();
            });
        });      
        
        it("should delete group - DELETE /groups", function (done) {
            var group = 'test';

            var token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });

            server.inject({
                method: 'DELETE',
                url: '/api/v1/management/groups/' + group,
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(204);
                // expect(res.result).toBe({});
                done();
            });
        });
                
    });
});
/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

'use strict';

var Hapi = require('hapi');
var server = require('./../../../lib/hapi');
var jwt = require('jsonwebtoken');
var RuthaUtils = require('rutha-utils');

var config = RuthaUtils.createConfig({
    path: {
        config: __dirname + '/../../../config'
    }
}).load();

describe("Management - User Routes", function () {
    it("should return OK", function (done) {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, function (res) {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('User', function () {
        var email;
        var key;
        var token;

        beforeEach(function () {
            email = 'molekilla@gmail.com';
            key = config.get('JWT_SECRET');
            token = jwt.sign({
                email: email,
                created: new Date()
            }, key, {
                expiresIn: 10 * 60
            });
        });

        it("should generate a token", function () {
            expect(token).not.toBe(null);
        });

        it("should list users - GET /users", function (done) {
            server.inject({
                method: 'GET',
                url: '/api/v1/management/users',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.result.users).toBeTruthy();
                done();
            });
        });

        it("should list users - GET /users?group=admins&view=byActive", function (done) {
            server.inject({
                method: 'GET',
                url: '/api/v1/management/users?group=admins&view=byActive',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.result.users.inactive).toBe(0);
                done();
            });
        });

        it("should create user - POST /users", function (done) {
            var user = {
                group: 'users',
                account: 'email.user@test.com',
                ldapAccount: 'email.user@domain.global',
                hasConfirmation: false
            };

            server.inject({
                method: 'POST',
                payload: user,
                url: '/api/v1/management/users',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(201);
                //expect(res.result).toBe({});
                done();
            });
        });

        it("should create multiple accounts - POST /users/multi", function (done) {
            var user = {
                group: 'users',
                csv: 'multi@acct.com,,66110011,,\nmulti_1@acct.com,,66110012,,\nmulti_2@acct.com,,66110013,,'
            };

            server.inject({
                method: 'POST',
                payload: user,
                url: '/api/v1/management/users/multi',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(201);
                //expect(res.result).toBe({});
                done();
            });
        });

        it("should update user - PUT /users", function (done) {
            var user = {
                group: 'users',
                account: 'email.user@test.com',
                cellphone: 66731138,
                firstName: 'User',
                lastName: 'Email'
            };

            server.inject({
                method: 'PUT',
                payload: user,
                url: '/api/v1/management/users',
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

        it("should inactivate user - DELETE /users", function (done) {
            var user = 'email.user@test.com';

            server.inject({
                method: 'DELETE',
                url: '/api/v1/management/users/' + user,
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

        it("should delete user - DELETE /users", function (done) {
            var user = 'email.user@test.com';

            server.inject({
                method: 'DELETE',
                url: '/api/v1/management/users/' + user + '?force=true',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(204);
                //expect(res.result).toBe({});
                done();
            });
        });

        it("should not delete current logged in admin - DELETE /users", function (done) {
            var user = email;

            server.inject({
                method: 'DELETE',
                url: '/api/v1/management/users/' + user + '?force=true',
                headers: {
                    authorization: "Bearer " + token
                }
            }, function (res) {
                //expect(res.headers['set-cookie']).not.toBe(null);
                expect(res.statusCode).toBe(400);
                //expect(res.result).toBe({});
                done();
            });
        });
    });
});

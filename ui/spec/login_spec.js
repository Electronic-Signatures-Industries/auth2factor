/*globals expect:true*/

var Hapi = require('hapi');
var server = require('./../lib/hapi');
var jwt = require('jsonwebtoken');

describe("Main controller", function() {
  it("should return page for /", function(done) {
    server.inject({ method: 'GET', url: '/' }, function (res) {
        expect(res.statusCode).toBe(200);
        done();
    });
  });


  describe('Signup route', function() {
    var email;
    var key;
    
    beforeEach(function() {
      email = 'test@test.com';
      key = 'a1b3c3d4';
    });
    
    
    it("should create an user '" + email + "', returns 400 if it exists, otherwise 201", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: email,
          password: 'zxcdfqwerty6'
        }
      }, function (res) {
        if (res.statusCode === 400) {
          expect(res.result.error).toBe('Bad Request');
        } else {
          expect(res.statusCode).toBe(201);
        }
        done();
      });
    });
    
    it("should create an user '" + email + "' from insurance form, returns 400 if it exists, otherwise 201", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: {
          email: email,
          password: 'zxcdfqwerty6',
          step: 'register'
        }
      }, function (res) {
        if (res.statusCode === 400) {
          expect(res.result.error).toBe('Bad Request');
        } else {
          expect(res.statusCode).toBe(201);
        }
        done();
      });
    });
    
    it("should generate a confirmation token", function() {
      var token = jwt.sign({
        email: email,
        created: new Date(),
        step: 'signup'
      }, key);

      expect(token).not.toBe(null);
    });
    
    
    it("should confirm user and redirect to client login", function(done) {
      var token = jwt.sign({
        email: email,
        created: new Date(),
        step: 'signup'
      }, 'TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24');
      
      server.inject({
        method: 'GET',
        url: '/auth/confirm?token=' + token
      }, function (res) {
        expect(res.statusCode).toBe(302);
        done();
      });
    });
    
    
  });

  describe('Login route', function() {
    it("should login successfully and should received a cookie", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@test.com',
          password: 'zxcdfqwerty6',
          redirectTo: '/'
        }
      }, function (res) {
        //expect(res.result).toBe('Bad Request');
        expect(res.statusCode).toBe(200);
        expect(res.headers['set-cookie']).not.toBe(null);
        done();
      });
    });

    it("should GET /profile be moved if not authenticated", function(done) {
      server.inject({
        method: 'GET',
        url: '/profile'
      }, function (res) {
        expect(res.statusCode).toBe(302);
        expect(res.headers['location']).toBe('http://localhost/app#/login/');
        done();
      });
    });

    it("should be an invalid user", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test1@test.com',
          password: 'zxcdfqwerty6',
          redirectTo: '/'
        }
      }, function (res) {
        //expect(res.result).toBe('Bad Request');
        expect(res.statusCode).toBe(404);
        done();
      });
    });

    it("should be an invalid password", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'test@test.com',
          password: 'zxcdfqwerty6444'
        }
      }, function (res) {
        expect(res.statusCode).toBe(400);
        done();
      });
    });
  });
});

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

  describe('Forgot route', function() {
    var email;
    var key;
    
    beforeEach(function() {
      email = 'test@test.com';
      key = 'a1b3c3d4';
    });
      
    it("should send an email with a link to reset password", function(done) {
      server.inject({
        method: 'POST',
        url: '/auth/reset',
        payload: {
          email: 'nothing@test.com',
          redirectTo: '/app#/reset/'
        }
      }, function (res) {
        expect(res.statusCode).toBe(404);
        done();
      });
    });

    it("should generate a reset token", function() {
      var token = jwt.sign({
        email: email,
        created: new Date()
      }, key, {
        expiresInMinutes: 10
      });

      expect(token).not.toBe(null);
    });
    
    
    it("should accept to reset user and redirect to reset form", function(done) {
      var secret = 'TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24';
      var token = jwt.sign({
        email: email,
        redirectTo: '/app#/reset/',
        created: new Date()
      }, secret, { expiresInMinutes: 5 } );
      
      server.inject({
        method: 'GET',
        url: '/auth/reset?token=' + token
      }, function (res) {
        expect(res.headers['set-cookie']).not.toBe(null);
        expect(res.statusCode).toBe(302);
        done();
      });
    });
      
    it("should reset user and redirect to login form", function(done) {
      var secret = 'TlfIxap9Zu5J53t9Zor5BVJAW1jA1c24';
      var token = jwt.sign({
        email: email,
        created: new Date()
      }, secret, { expiresInMinutes: 5 } );
      
      server.inject({
        method: 'GET',
        url: '/auth/reset?token=' + token
      }, function (res) {
        expect(res.statusCode).toBe(302);
        

        server.inject({
          method: 'PUT',
          url: '/auth/reset',
          credentials: {
            isReset: true,
            email: email
          },
          payload: {
            password: 'a1s2d3f4g5h6',
            redirectTo: '/app#/login'
          }
        }, function (res) {
          expect(res.statusCode).toBe(204);
          done();
        });
        
        
      });
      

    });
    
  });
});

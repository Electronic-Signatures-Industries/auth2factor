/*globals spyOn:true, expect:true*/

//var Hapi = require('hapi');
var _ = require('underscore');
var Mailer = require('./../lib/mailer');
var RuthaUtils = require('rutha-utils');

var config = RuthaUtils.createConfig({
  path: {
    config: __dirname + '/../config'
  }
});

var logger = RuthaUtils.createLogger({
  filename: config.get('logger:filename')
});

describe("Mailer lib", function() {
'use strict';
  var mailer;
  beforeEach(function() {
    mailer = Mailer.create(logger, config);
  });

  describe('Mailer', function() {
    it("should create a new Mailer", function() {
      expect(_.isFunction(mailer.withTransport)).toBe(true);
    });

    it("should create a new email Mailer", function() {
      expect(_.isObject(mailer.withTransport('email'))).toBe(true);
    });

    it("should throw Missing transport", function() {
      expect(function() {
        mailer.withTransport('sms');
      }).toThrow(new Error('Missing transport type'));
    });

    describe('Mailer#send test', function() {
      var transport;
      beforeEach(function() {
        transport = mailer.withTransport('email');
      });

      it("should send email", function() {

        spyOn(transport.client, 'sendMail');
        transport.send({
          email: 't@t.com',
          subject: 'Hello World',
          textBody: 'Enter Wu Tang Clan',
          htmlBody: '<h1>Enter Wu Tang Clan</h1>'
        }, function(err, resp) {

        });
        expect(transport.client.sendMail).toHaveBeenCalled();
        
      });

    });
    
    describe('Mailer#send validation', function() {
      var transport;
      beforeEach(function() {
        transport = mailer.withTransport('email');
      });

      it("Missing email", function() {

        expect(function() {
          transport.send({});
        }).toThrow(new Error('Missing email.'));
        
      });

      it("Missing subject", function() {

        expect(function() {
          transport.send({
            email: 'xzcvdf23231'
          });
        }).toThrow(new Error('Missing subject.'));
        
      });

      it("Missing textBody", function() {

        expect(function() {
          transport.send({
            email: 'xzcvdf23231@ad.com',
            subject: 'LOL'
          });
        }).toThrow(new Error('Missing textBody.'));
        
      });

      it("Missing htmlBody", function() {

        expect(function() {
          transport.send({
            email: 'xzcvdf23231@ad.com',
            subject: 'LOL',
            textBody: 'yes'
          });
        }).toThrow(new Error('Missing htmlBody.'));
        
      });

      it("Missing callback", function() {

        expect(function() {
          transport.send({
            email: 'xzcvdf23231@ad.com',
            subject: 'LOL',
            textBody: 'yes',
            htmlBody: '<p>hi</p>'
          });
        }).toThrow(new Error('Missing callback.'));
        
      });
    });

  });


});

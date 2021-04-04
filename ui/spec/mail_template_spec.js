/*globals spyOn:true, expect:true*/

//var Hapi = require('hapi');
var _ = require('underscore');
var MailTemplates = require('./../lib/mail_templates');
var RuthaUtils = require('rutha-utils');

var config = RuthaUtils.createConfig({
  path: {
    config: __dirname + '/../config'
  }
});

var logger = RuthaUtils.createLogger({
  filename: config.get('logger:filename')
});

describe("MailTemplates lib", function() {
'use strict';
  var templates;
  beforeEach(function() {
    templates = MailTemplates.create(__dirname + '/../lib/mail_templates/templates', logger, config);
  });

  describe('MailTemplates', function() {
    it("should create a new instance", function() {
      expect(_.isObject(templates)).toBe(true);
    });

    describe('MailTemplates#render test', function() {
      // var transport;
      // beforeEach(function() {
      //   transport = mailer.withTransport('email');
      // });

      // it("should send email", function() {

      //   spyOn(transport.smtp, 'sendMail');
      //   transport.send({
      //     email: 't@t.com',
      //     subject: 'Hello World',
      //     textBody: 'Enter Wu Tang Clan',
      //     htmlBody: '<h1>Enter Wu Tang Clan</h1>'
      //   }, function(err, resp) {

      //   });
      //   expect(transport.smtp.sendMail).toHaveBeenCalled();
        
      // });

    });
    

  });


});

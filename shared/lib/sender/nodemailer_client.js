var SendGrid = require('nodemailer-sendgrid-transport');
var Nodemailer = require('nodemailer');
var debug = require('debug')('nodemailer_client');
var _ = require('underscore');

var NodemailerClient = function NodemailerClient(logger, config) {
  'use strict';

  var options = {
    auth: {
      api_user: config.get('nodemailer:user'),
      api_key: config.get('nodemailer:apiKey')
    }
  };
  var opts = new SendGrid(options);
//  var opts = {
//      service: 'Mandrill',
//      auth: {
//        user: config.get('nodemailer:user'),
//        pass: config.get('nodemailer:apiKey')          
//      }
//  };
  var client = Nodemailer.createTransport(opts);
  this.config = config;
  this.logger = logger;
  this.client = client;

  return this;
};

NodemailerClient.prototype.send = function(options, callback) {
  'use strict';
  if (_.isEmpty(options.email)) {
    throw new Error('Missing email.');
  }

  if (_.isEmpty(options.subject)) {
    throw new Error('Missing subject.');
  }

  if (_.isEmpty(options.textBody)) {
    throw new Error('Missing textBody.');
  }

  if (_.isEmpty(options.htmlBody)) {
    throw new Error('Missing htmlBody.');
  }

  if (_.isUndefined(callback)) {
    throw new Error('Missing callback.');
  }

  var self = this;
  var mailOptions = {
    from: 'auth2factor <noreply@auth2factor.com>',
    to: options.email,
    subject: options.subject,
    text: options.textBody,
    html: options.htmlBody
  };

if (options.attachmentName && options.attachmentUrl) {
    _.extend(mailOptions, {
        attachments:
        [{ // use URL as an attachment
            filename: options.attachmentName,
            path: options.attachmentUrl
        }] 
    });
}
    
  this.client.sendMail(mailOptions, function(err, resp) {
    if (err) {
      self.logger.error(err);
      debug(err);
      return callback(err, null);
    }

    return callback(null, resp);
  });
};

module.exports = NodemailerClient;
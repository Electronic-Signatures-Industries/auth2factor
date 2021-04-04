var debug = require('debug')('mandrill_client');
var _ = require('underscore');
var mandrill = require('mandrill-api/mandrill');



var MandrillClient = function MandrillClient(logger, config) {
  'use strict';

  var client = new mandrill.Mandrill(config.get('nodemailer:apiKey'));
  this.config = config;
  this.logger = logger;
  this.client = client;

  return this;
};

MandrillClient.prototype.send = function(options, callback) {
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
    from_email: ' noreply@auth2factor.com',
    from_name: 'auth2factor',
    to: [{ 
        email: options.email,
        type: 'to'
    }],
    subject: options.subject,
    text: options.textBody,
    html: options.htmlBody,
    attachments:
      [{ // use URL as an attachment
        name: options.attachmentName,
        content: options.attachmentUrl
     }]
  };
    
var async = false;
var ip_pool = "Main Pool";
var send_at = "example send_at";    
this.client.messages.send({ 
    "message": mailOptions, 
    "async": async, 
    "ip_pool": ip_pool, 
    "send_at": send_at
}, function(result) {
      return callback(null, result);
}, function(err) {
      self.logger.error(err);
      debug(err);
      return callback(err, null);
});
    
  this.client.sendMail(mailOptions, function(err, resp) {

    return callback(null, resp);
  });
};

module.exports = MandrillClient;
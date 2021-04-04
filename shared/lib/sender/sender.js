var debug = require('debug')('mailer:index');
var Mailer = require('./nodemailer_client');
var SendgridClient = require('./sendgridClient');
var SmtpClient = require('./lib/smtp');
var TwilioClient = require('./lib/twilioClient');
var AWSSnsManager = require('./lib/awsSnsManager');

// Transports
var transports = {
  'push:push': function(logger, config) {
      return new AWSSnsManager();
  },    
  'sms:twilio': function(logger, config) {
      return new TwilioClient(logger, config);
  },
  'email:sendgrid': function(logger, config) {
      return new SendgridClient(logger, config);
  },
  'email:smtp': function(logger, config) {
      return new SmtpClient(logger, config);
  },    
  'email': function(l, c) {
    return new Mailer(l, c);
  },
  'logger': function(l, c) {
    return {
      send: function(options, callback) {
        debug(options);
        callback(null, options);
      }
    };
  }
};

function Mailer(logger, config) {
  this.logger = logger;
  this.config = config;
}

Mailer.prototype.hasTransport = function(mailerType) {
  return !!transports[mailerType];
};

Mailer.prototype.withTransport = function(mailerType) {
  var transport = transports[mailerType];
  debug('transport: ' + mailerType);
  if (transport) {
    return transport(this.logger, this.config);
  } else {
    throw new Error('Missing transport type');
  }

};

Mailer.create = function(logger, config) {
  return new Mailer(logger, config);
};

module.exports = Mailer;


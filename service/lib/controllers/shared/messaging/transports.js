const TRANSPORTS = require('./transportClients');
const SmtpClient = require('./smtpClient');
const TwilioClient = require('./twilioClient');
const SendgridClient = require('./sendgridClient');
// Transports

const entries = new Map();
entries.set(TRANSPORTS.SENDGRID, () => new SendgridClient());
entries.set(TRANSPORTS.SMTP, () => new SmtpClient());
entries.set(TRANSPORTS.TWILIO, () => new TwilioClient());
module.exports = entries;
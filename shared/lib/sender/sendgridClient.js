var debug = require('debug')('sendgrid_client');
var _ = require('underscore');

var SendgridClient = function SendgridClient(logger, config) {
    'use strict';

    var api_key = config.get('sendgrid:apiKey');
    var api_user = config.get('sendgrid:user');
    var client = require('sendgrid')(api_user, api_key);
    this.config = config;
    this.logger = logger;
    this.client = client;

    return this;
};

SendgridClient.prototype.send = function (options, callback) {
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
    
    if (options.transportCredentials && options.transportCredentials.user && options.transportCredentials.apiKey) {
        this.client = require('sendgrid')(options.transportCredentials.user, options.transportCredentials.apiKey);
    }

    var self = this;
    var mailOptions = {
        from_email: 'noreply@auth2factor.com',
        from_name: 'auth2factor',
        to: [{
            email: options.email,
            type: 'to'
    }],
        subject: options.subject,
        text: options.textBody,
        html: options.htmlBody,
        attachments: [{ // use URL as an attachment
            name: options.attachmentName,
            content: options.attachmentUrl
     }]
    };

    var email = new this.client.Email({
        to: options.email,
        from: options.from || 'noreply@auth2factor.com',
        subject: options.subject,
        text: options.textBody,
        html: options.htmlBody,
        fromname: options.fromName || 'auth2factor'
    });

    this.client.send(email, function (err, resp) {
        if (err) {
            self.logger.error(err);
            debug(err);
            return callback(err, null);
        }

        return callback(null, resp);
    });
};

module.exports = SendgridClient;
//
//email.addFile({
//  filename: 'secret.txt',
//  content:  new Buffer('You will never know....')
//});
//You can add files directly from a url. It will try to guess the contentType based on the filename. Note: filename is required when using a url.
//
//email.addFile({
//  filename: 'icon.jpg',
//  url: 'http://i.imgur.com/2fDh8.jpg'
//});
//You can add files from a path on the filesystem. It will try to grap the filename and contentType from the path.
//
//email.addFile({
//  path: '../files/resume.txt'
//});
//You can tag files for use as inline HTML content. It will mark the file for inline disposition using the specified "cid".
//
//email.addFile({
//  cid: 'the_logo',           // should match cid value in html
//  path: '../files/logo.png'
//});
//email.addHtml('<div>Our logo:<img src="cid:the_logo"></div>');
var handlebars = require('handlebars');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

function MailTemplates(templateDir, logger, config) {
  'use strict';
  var self = this;
  this.config = config;
  this.logger = logger;
  this.types = ['email', 'subject', 'text'];
  this.cache = {};

  this._readTemplate = function ReadTemplate(root, dir, type) {
    // read template and compile
    fs.readFile(path.join(root, dir, type + '.hbs'), function(err, templ) {

      var key = dir + '_' + type;
      // cached
      if (!self.cache[key]) {
          self.cache[key] = handlebars.compile(templ.toString());
      }

    });
  };

  // read templ dir
  fs.readdir(templateDir, function(err, files) {

    // those that are dirs
    _.each(files, function(obj) {
      fs.stat(path.join(templateDir, obj), function(err, stat) {

        if (stat.isDirectory()) {
          _.each(self.types, function(templType) {
            self._readTemplate(templateDir, obj, templType);
          });
        }

      });
    });

  });

  return this;
}

MailTemplates.prototype.render = function(name, attributes) {
  'use strict';

  return this.cache[name.replace('/', '_')](attributes);

};

MailTemplates.create = function(dir, logger, config) {
  return new MailTemplates(dir, logger, config);
};

module.exports = MailTemplates;

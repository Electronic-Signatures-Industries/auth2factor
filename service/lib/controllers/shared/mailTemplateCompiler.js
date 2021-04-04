const handlebars = require('handlebars');
const _ = require('underscore');
const fs = require('fs');
const path = require('path');

class MailTemplates {

    constructor(options) {
        'use strict';
        const templateDir = options.templates;
        const self = this;
        this.types = ['email', 'subject', 'text'];
        this.cache = {};

        this._readTemplate = function ReadTemplate(root, dir, type) {
            // read template and compile
            fs.readFile(path.join(root, dir, type + '.hbs'), function (err, templ) {

                const key = dir + '_' + type;
                // cached
                if (!self.cache[key]) {
                    self.cache[key] = handlebars.compile(templ.toString());
                }

            });
        };

        // read templ dir
        fs.readdir(templateDir, function (err, files) {

            // those that are dirs
            _.each(files, function (obj) {
                fs.stat(path.join(templateDir, obj), function (err, stat) {

                    if (stat.isDirectory()) {
                        _.each(self.types, function (templType) {
                            self._readTemplate(templateDir, obj, templType);
                        });
                    }

                });
            });

        });

        return this;
    }

    render(name, attributes) {
        'use strict';
        return this.cache[name.replace('/', '_')](attributes);
    }
}
module.exports = MailTemplates;
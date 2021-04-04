var _ = require('underscore');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Transport = new Schema({
        _id: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        updated: {
            type: Date,
            required: false,
            default: Date.now
        }
    });

    Transport.methods.readSettings = function () {
        var settings = {};
        
        if (this.settings) {
            _.each(this.settings, function (item) {
                settings[item.key] = item.value;
            });
        }
        
        return settings;
    };


    Transport.statics.modify = function (options, callback) {
        var self = this;
        this.findOne({
            _id: options.transport
        }, function (err, transport) {

            if (err) {
                callback(err);
                return;
            }

            if (transport) {
                // transport.description = options.description;
                transport.settings = options.settings;
                transport.updated = new Date();

                transport.save();
                callback(null, transport);
                return;

            } else {
                // no transport found
                callback(new Error('No transport found'), null);
                return;
            }

        });

    };

    Mongoose.model('Transport', Transport);
};
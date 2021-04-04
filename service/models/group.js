var debug = require('debug')('models:group');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Group = new Schema({
        group: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String
        },
        transport: {
            id: {
                type: String
            },
            description: {
                type: String,
                required: false
            }
        },
        adapter: {
            id: { type: String },
            description: { type: String }
        },
        deletable: {
            type: Boolean,
            default: true            
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

    Group.statics.validate = function (options, callback) {
        var user = options.user;
        var password = options.password;
        var ConfigModel = Mongoose.models.Config;

        debug(options);
        this.findOne({
            group: user.group
        }, function (err, group) {
            // Should read group.adapter.module
            ConfigModel.get({
                key: group.adapter.id
            }, function (err, config) {

                    return callback(null, group, {
                        requiresSystemLogin: true,
                        isValid: true
                    });
            });
        });
    };

    Group.statics.add = function (options, callback) {
        var self = this;
        this.findOne({
            group: options.group
        }, function (err, model) {

            if (err) {
                callback(err);
                return;
            }

            if (model) {
                callback(null, null);
                return;

            } else {

                var newGroup = {
                    group: options.group,
                    description: options.description,
                    transport: options.transport,
                    adapter: options.adapter
                };

                self.create(newGroup, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, newGroup);
                });
            }

        });

    };

    Group.statics.modify = function (options, callback) {
        var self = this;
        this.findOne({
            group: options.group
        }, function (err, group) {

            if (err) {
                callback(err);
                return;
            }

            if (group) {
                group.description = options.description;
                group.transport = options.transport;
                group.adapter = options.adapter;
                group.updated = new Date();

                group.save();
                callback(null, group);
                return;

            } else {
                // no group found
                callback(new Error('No group found'), null);
                return;
            }

        });

    };


    Mongoose.model('Group', Group);
};
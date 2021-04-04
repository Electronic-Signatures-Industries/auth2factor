var _ = require('underscore');
var debug = require('debug')('models:config');
var encrypt = require('mongoose-encryption');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let KeyValue = new Schema({
        key: {
            type: String
        },
        value: {
            type: String
        }
    });

    let Config = new Schema({
        key: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        entityId: {
            type: String,
        },
        entity: {
            type: String, // transport, adapter, config
            default: 'config'
        },
        settings: {},
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

    Config.plugin(encrypt, {
        secret: process.env.MONGOOSE_SECRET,
        encryptedFields: ['settings']
    });
    
    Config.plugin(encrypt.encryptedChildren);
    
    Config.statics.add = function (options, callback) {
        var self = this;
        this.findOne({
            key: options.key
        }, function (err, model) {

            if (err) {
                callback(err);
                return;
            }

            if (model) {
                callback(null, null);
                return;

            } else {

                var newConfig = {
                    settings: options.settings,
                    key: options.key,
                    entity: options.entity || 'config',
                    entityId: options.entityId,
                    description: options.description
                };
                
                self.create(newConfig, function (err, model) {
                    if (err) {
                        return callback(err);
                    }
                    
                    return callback(null, newConfig);
                });
            }

        });

    };

    Config.statics.modify = function (options, callback) {
        var self = this;
        this.findOne({
            key: options.key
        }, function (err, model) {

            if (err) {
                callback(err);
                return;
            }

            if (model) {
                model.settings = options.settings;
                model.description = options.description;
                model.updated = new Date();

                model.save();
                callback(null, model);
                return;

            } else {
                // no config found
                callback(new Error('No config found'), null);
                return;
            }

        });

    };

    Config.statics.get = function (options, callback) {
        var self = this;

        var query = {};
        if (options.key) {
            query.key = options.key;
        } else if (options.entity && options.entity.id) {
            query.entityId = options.entity.id;
        }
        var fields = '_ac _ct _id key entity entityId deletable description created updated settings';
        this.findOne(query, fields, function (err, model) {

            if (err) {
                callback(err);
                return;
            }

            if (model) {
                return callback(null, {
                    key: model.key,
                    description: model.description,
                    entityId: model.entityId,
                    entity: model.entity,
                    settings: model.settings,
                    created: model.created,
                    updated: model.updated
                });            
            } else {
                // no config found
                callback(new Error('No config found'), null);
                return;
            }

        });

    };
    Mongoose.model('Config', Config);

};
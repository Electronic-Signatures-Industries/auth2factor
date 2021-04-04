var _ = require('underscore');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let SecurityKey = new Schema({
        userId: {
            type: Schema.Types.ObjectId
        },
        keyHandle: {
            type: String
        },
        appId: {
            type: String
        },        
        publicKey: {
            type: String
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

    SecurityKey.statics.register = function (options, callback) {
        var self = this;
        this.findOne({
            userId: options.userId,
            appId: options.appId,
            keyHandle: options.keyHandle,
            publicKey: options.publicKey,
        }, function (err, model) {

            if (err) {
                callback(err);
                return;
            }

            if (model) {
                callback(null, null);
                return;

            } else {

                var newSecurityKey = {
                    userId: options.userId,
                    appId: options.appId,
                    keyHandle: options.keyHandle,
                    publicKey: options.publicKey,
                    description: options.description
                };
                
                self.create(newSecurityKey, function (err, model) {
                    if (err) {
                        return callback(err);
                    }
                    
                    return callback(null, newSecurityKey);
                });
            }

        });

    }; 
    
    
    Mongoose.model('SecurityKey', SecurityKey);
};

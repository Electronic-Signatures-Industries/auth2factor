var _ = require('underscore');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Challenge = new Schema({
        userId: {
            type: Mongoose.Schema.Types.ObjectId
        },
        version: {
            type: String
        },
        appId: {
            type: String
        },
        challenge: {
            type: String
        },
        keyHandle: {
            type: String
        },        
        created: {
            type: Date,
            required: true,
            default: Date.now
        }
    });

    Challenge.statics.add = function (options, callback) {
        
        
            var newChallenge = {
                userId: options.userId,
                version: options.version,
                appId: options.appId,
                challenge: options.challenge
            };

            this.create(newChallenge, function (err, model) {
                if (err) {
                    return callback(err);
                }

                return callback(null, newChallenge);
            });

    };    
    Challenge.index({ created: 1 }, { expireAfterSeconds: 30 * 60 });
    Mongoose.model('Challenge', Challenge);
};

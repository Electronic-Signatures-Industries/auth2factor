// DEPRECATE
module.exports = function (Mongoose) {
    'use strict';
    var System = new Mongoose.Schema({
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        activated: {
            type: Boolean,
            required: true,
            default: false
        }
    });
    
    System.statics.activate = function (callback) {
        var activateAccount = {
            activated: true 
        };
        
        this.create(activateAccount, function (err, model) {
            if (err) {
                return callback(err);
            }
            
            return callback(null, activateAccount);
        });

    };
    Mongoose.model('System', System);
};

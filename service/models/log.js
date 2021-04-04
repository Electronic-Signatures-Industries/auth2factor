module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Log = new Schema({
        event: {
            type: String, // error, info, debug
            required: true
        },
        user: {
            type: String, // acct or email
            required: true
        },
        remoteAddress: {
                type: String,
                required: false
        },        
        request: {
            path: {
                type: String,
                required: false
            },
            method: {
                type: String,
                required: false
            }            
        },           
        log: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        }
    }, { capped: { size: 1310720, max: 10000, autoIndexId: true }  });

    Mongoose.model('Log', Log);
};

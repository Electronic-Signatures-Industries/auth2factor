module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Adapter = new Schema({
        _id: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        protocol: {
            type: String,
            required: false
        },
        module: {
            type: String,
            required: true
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

    Mongoose.model('Adapter', Adapter);
};
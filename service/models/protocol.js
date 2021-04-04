module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Protocol = new Schema({
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
    Mongoose.model('Protocol', Protocol);
};
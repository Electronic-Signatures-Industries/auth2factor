
module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let Acl = new Schema({
        name: {
            type: String
        },
    });


    Mongoose.model('Acl', Acl);
};
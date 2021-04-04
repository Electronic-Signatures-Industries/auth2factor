let Joi = require('joi');

let aclMediaType = Joi.object().keys({
    name: Joi.string()
});

module.exports = aclMediaType;

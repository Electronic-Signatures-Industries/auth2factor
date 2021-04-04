var Joi = require('joi');

module.exports = Joi.object().keys({
    publicKey: Joi.string(),
    appId: Joi.string(),
    description: Joi.string().optional().allow(''),
    created: Joi.date(),
    updated: Joi.date()
});
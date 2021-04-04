var Joi = require('joi');

module.exports = Joi.object().keys({
    version: Joi.string(),
    appId: Joi.string(),
    challenge: Joi.string()
});
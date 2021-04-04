var Joi = require('joi');

module.exports = Joi.object().keys({
    email: Joi.string(),
    ldapAccount: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    cellphone: Joi.number().optional(),
    group: Joi.string(),
    deletable: Joi.bool(),
    inactive: Joi.bool(),
    created: Joi.date(),
    updated: Joi.date()
});
var Joi = require('joi');

var configMediaType = Joi.object().keys({
    id: Joi.string().required().description('id'),
    key: Joi.string().required().description('key'),
    description: Joi.string().required().description('description'),
    deletable: Joi.bool(),
    entityId: Joi.string(),
    entity: Joi.string(),
    settings: Joi.any().optional(),
  created: Joi.date(),
  updated: Joi.date()    
});

module.exports = configMediaType;
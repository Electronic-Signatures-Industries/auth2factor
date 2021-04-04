var Joi = require('joi');
var groupMediaType = Joi.object().keys({
  transport: Joi.any(),
  group: Joi.string(),
  description: Joi.string().description('description'),    
  deletable: Joi.bool(),
  created: Joi.date().optional(),
  updated: Joi.date().optional(),
  adapter: Joi.any()
});

module.exports = groupMediaType;

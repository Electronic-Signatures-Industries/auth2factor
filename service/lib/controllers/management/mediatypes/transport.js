var Joi = require('joi');

var transportMediaType = Joi.object().keys({
  created: Joi.date(),
  updated: Joi.date(),
  transport: Joi.string(),
  description: Joi.string(),
  settings: Joi.any()
});

module.exports = transportMediaType;

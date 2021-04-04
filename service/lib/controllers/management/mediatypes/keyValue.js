var Joi = require('joi');

var keyValueMediaType = Joi.object().keys({
  key: Joi.string(),
  value: Joi.string()
});


module.exports = keyValueMediaType;

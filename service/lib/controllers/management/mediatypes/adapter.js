var Joi = require('joi');

var adapterMediaType = Joi.object().keys({
  adapter: Joi.string(),
      description: Joi.string()
});

module.exports = adapterMediaType;

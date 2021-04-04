var Joi = require('joi');

var logMediaType = Joi.object().keys({
  log: Joi.string(),
      event: Joi.string(),
    created: Joi.date(),
    user: Joi.string(),
    remoteAddress: Joi.string(),
    request: Joi.any()
});

module.exports = logMediaType;

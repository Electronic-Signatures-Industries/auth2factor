
var Joi = require('joi');
var securityKeyMediaType = require('./securityKey');

var securityKeysMediaType = Joi.object({
    securityKeys: Joi.array().items(securityKeyMediaType).optional()
}).meta({
  className: 'Result'
});



module.exports = securityKeysMediaType;

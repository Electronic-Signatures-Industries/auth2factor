
var Joi = require('joi');
var configMediaType = require('./config');

var configsMediaType = Joi.object({
    configs: Joi.array().items(configMediaType).optional()
}).meta({
  className: 'Result'
});



module.exports = configsMediaType;




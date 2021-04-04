var Joi = require('joi');
var transportMediaType = require('./transport');

var transportsMediaType = Joi.object({
    transports: Joi.array().items(transportMediaType).optional()
}).meta({
  className: 'Result'
});

module.exports = transportsMediaType;

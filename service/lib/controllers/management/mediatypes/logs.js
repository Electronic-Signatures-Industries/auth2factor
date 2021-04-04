
var Joi = require('joi');
var logMediaType = require('./log');

var logsMediaType = Joi.object({
    logs: Joi.array().items(logMediaType).optional()
}).meta({
  className: 'Result'
});



module.exports = logsMediaType;




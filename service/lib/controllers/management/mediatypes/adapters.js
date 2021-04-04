
var Joi = require('joi');
var adapterMediaType = require('./adapter');

var adaptersMediaType = Joi.object({
    adapters: Joi.array().items(adapterMediaType).optional()
}).meta({
  className: 'Result'
});



module.exports = adaptersMediaType;




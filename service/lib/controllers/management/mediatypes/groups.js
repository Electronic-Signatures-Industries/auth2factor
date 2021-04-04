var Joi = require('joi');
var groupMediaType = require('./group');

var groupsMediaType = Joi.object({
   groups: Joi.array().items(groupMediaType).optional()
}).meta({
  className: 'Result'
});

module.exports = groupsMediaType;

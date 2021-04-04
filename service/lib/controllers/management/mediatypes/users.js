var Joi = require('joi');
var userMediaType = require('./user');

var usersMediaType = Joi.object({
    users: Joi.array().items(userMediaType).optional()
}).meta({
  className: 'Result'
});

module.exports = usersMediaType;

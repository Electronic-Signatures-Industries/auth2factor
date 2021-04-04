let Joi = require('joi');
let aclMediaType = require('./acl');

let aclsMediaType = Joi.object({
    acls: Joi.array().items(aclMediaType).optional()
}).meta({
    className: 'Result'
});



module.exports = aclsMediaType;

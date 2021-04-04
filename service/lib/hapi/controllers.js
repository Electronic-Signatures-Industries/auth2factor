module.exports = [
    {
        register: require('../controllers/users'),
    },
    {
        register: require('../controllers/management'),
    },
    {
        register: require('../controllers/security_keys'),
    },
    {
        register: require('../controllers/api_docs'),
    },
    {
        register: require('../controllers/permission'),
    },
    {
        register: require('../controllers/oauth2')
    }
];
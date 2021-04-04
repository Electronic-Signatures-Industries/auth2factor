const pages = require('./pages.js');
const api = require('./api_integration.js');

exports.register = function (plugin, options, next) {



    // Homepage route
    plugin.route({
        method: 'GET',
        path: '/',
        config: {
        pre: [{
            method: pages.renderIntro,
            assign: 'intro'
            },
            {
                method: pages.renderFooter,
                assign: 'footer'
            },
            {
                method: function (request, reply) {
                    return reply(true);
                },
                assign: 'isApp'
            },
            {
                method: pages.renderHeaderScripts,
                assign: 'headerScripts'
            },
            {
                method: pages.renderFavico,
                assign: 'favico'
            }],
            handler: pages.index,
            auth: {
                mode: 'try',
                strategy: 'session'
            }
        }
    });



    plugin.route({
        method: 'GET',
        path: '/dashboard',
        config: {
            pre: [{
                method: pages.renderNavbar,
                assign: 'navbar'
            },
            {
                method: pages.renderFooter,
                assign: 'footer'
            },
            {
                method: function (request, reply) {
                    return reply(true);
                },
                assign: 'isApp'
            },
            {
                method: pages.renderHeaderScripts,
                assign: 'headerScripts'
            },
            {
                method: pages.renderFavico,
                assign: 'favico'
            }],
            handler: pages.dashboard,
            auth: {
                mode: 'try',
                strategy: 'session'
            }
        }
    });

    plugin.route({
        method: 'GET',
        path: '/user',
        config: {
            pre: [{
                method: pages.renderNavbar,
                assign: 'navbar'
            },
            {
                method: function (request, reply) {
                    return reply(true);
                },
                assign: 'isApp'
            },                 
            {
                method: pages.renderFooter,
                assign: 'footer'
            },
            {
                method: pages.renderHeaderScripts,
                assign: 'headerScripts'
            },
            {
                method: pages.renderFavico,
                assign: 'favico'
            }],
            handler: pages.userDashboard,
            auth: {
                mode: 'try',
                strategy: 'session'
            }
        }
    });
    
    plugin.route({
        method: 'POST',
        path: '/authenticate',
        config: {
            handler: api.authenticate
        }
    });
    
    plugin.route({
        method: 'POST',
        path: '/otc',
        config: {
            handler: api.otc
        }
    });
 
    plugin.route({
        method: 'POST',
        path: '/u2f',
        config: {
            handler: api.u2f
        }
    });    
    
    plugin.route({
        method: 'GET',
        path: '/reset',
        config: {
            handler: api.confirm
        }
    });    
    
    plugin.route({
        method: 'GET',
        path: '/confirm',
        config: {
            handler: api.confirm
        }
    }); 
    
    plugin.route({
        method: 'GET',
        path: '/profile/reset',
        config: {
            handler: api.getProfileReset
        }
    }); 
    
    plugin.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: {
                mode: 'try',
                strategy: 'session'
            },
            handler: pages.logout
        }
    });


    plugin.state('user', {
        ttl: 15 * 60 * 1000,
        isSecure: true,
        isHttpOnly: false,
        isSameSite: 'Strict',
        path: '/',
        encoding: 'base64json'
    });


    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
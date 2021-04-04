/*jshint esversion: 6 */
/*eslint-env node*/
//var debug = require('debug')('frontend:pages');
const _ = require('underscore');
const version = require('./../../../package').version;
const title = 'auth2factor';

exports.index = function (request, reply) {
    'use strict';
    var server = request.server;
    var hostname = server.app.config.get("FE_HOSTNAME");

    if (request.auth.isAuthenticated) {
        return reply.redirect(hostname + '/dashboard#manage');
    }

    let resp = reply.view('index', {
        title: title,
        intro: request.pre.intro,
        scripts: request.pre.headerScripts,
        footer: request.pre.footer,
        favico: request.pre.favico
    });

    return resp;
};





exports.renderHeaderScripts = function (request, reply) {
    'use strict';
    var isApp = request.pre.isApp || false;
    request.server.render('partials/headerScripts', {
        isApp: isApp
    }, function (err, rendered, config) {
        return reply(rendered);
    });

};


exports.renderFavico = function (request, reply) {
    'use strict';

    request.server.render('partials/favico', {}, function (err, rendered, config) {
        return reply(rendered);
    });

};

exports.renderFooter = function (request, reply) {
    'use strict';

    request.server.render('partials/footer', { build: version }, function (err, rendered, config) {
        return reply(rendered);
    });

};

exports.renderIntro = function (request, reply) {
    'use strict';
    var userCredentials = {
        logged: false
    };

    if (request.auth.isAuthenticated) {
        _.extend(userCredentials, request.auth.credentials);
    }

    request.server.render('partials/intro', userCredentials, function (err, rendered, config) {
        request.log(['error'], err);
        return reply(rendered);
    });

};

exports.renderNavbar = function (request, reply) {
    'use strict';
    let userCredentials = {
        logged: false
    };

    if (request.auth.isAuthenticated) {
        _.extend(userCredentials, request.auth.credentials);
    }

    _.extend(userCredentials, {
        build: version
    });
    request.server.render('partials/navbar', userCredentials, function (err, rendered, config) {
        request.log(['error'], err);
        return reply(rendered);
    });

};


exports.dashboard = function (request, reply) {
    'use strict';
    var server = request.server;
    var hostname = server.app.config.get("FE_HOSTNAME");
    if (!request.auth.isAuthenticated) {
        return reply.redirect(hostname + '/');
    }

    let resp = reply
        .view('dashboard', {
            title: title,
            navbar: request.pre.navbar,
            scripts: request.pre.headerScripts,
            footer: request.pre.footer,
            favico: request.pre.favico
        });
        resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        return resp;
};


exports.userDashboard = function (request, reply) {
    'use strict';
    var server = request.server;
    var errorMessage;

    if (request.query.code === '403') {
        errorMessage = 'Token expirado. Debe solicitar uno nuevo para continuar.';
    }

    return reply.view('user', {
        title: title,
        navbar: request.pre.navbar,
        scripts: request.pre.headerScripts,
        footer: request.pre.footer,
        favico: request.pre.favico,
        errorMessage: errorMessage
    });
};


exports.logout = function (request, reply) {
    request.cookieAuth.clear();
    reply().state('user', null).redirect('/#logout');
};
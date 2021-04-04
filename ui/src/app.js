/*jshint elision:true */

'use strict';
require('angular');

angular.module('rutha.local-account', []);
angular.module('auth2factor.global', []);

angular.module('auth2factor.models', []);
angular.module('auth2factor.auth', []);
angular.module('auth2factor.services', []);
angular.module('auth2factor.controllers', []);
angular.module('auth2factor.templates', []);
angular.module('auth2factor.directives', []);

module.exports = angular.module('auth2factor', ['ui.router', 'ui.bootstrap', 'restangular', 'auth2factor.global', 'auth2factor.auth', 'ngTable', 'angularSpinner',
        'auth2factor.directives', 'auth2factor.services', 'auth2factor.models',
        'auth2factor.templates', 'auth2factor.controllers', 'ngCookies',
        'ngSanitize', 'growlNotifications', 'angular-storage', 'ngMessages', 'rutha.local-account', 'ngDialog',
        'ui.select'
    ])
    .config(function (RestangularProvider) {
        RestangularProvider.setFullResponse(true);
        RestangularProvider.setBaseUrl('/api');
    })
    .config(function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    })
    .config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }])
    .config(require('./app.routes'));

var requireTest = require.context('./app', true, /\.js$/);
requireTest.keys().forEach(requireTest);

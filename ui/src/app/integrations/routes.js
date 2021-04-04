var Restangular = require('restangular');
var routes = function ($stateProvider) {
    $stateProvider
        .state('manage_integrations', {
            url: '/integrations',
            templateUrl: 'app/integrations/list.html',
            controllerAs: 'vm',
            controller: 'IntegrationGridPageCtrl',
            resolve: {
                load: function (AutenticationService, ConfigurationService, Restangular) {
                    AutenticationService.resolveSessionOrLogout();

                    return ConfigurationService.list({
                        view: 'apikeys'
                    });
                }
            }
        })
        .state('manage_integration_edit', {
            url: '/integrations/edit/:entity/:id',
            templateUrl: 'app/integrations/form.html',
            controllerAs: 'vm',
            controller: 'ApiKeyFormCtrl',
            resolve: {
                load: function (AutenticationService, ManagerService, Restangular) {
                    AutenticationService.resolveSessionOrLogout();
                    return ManagerService.list('acls');
                }
            },
            params: {
                title: {
                    value: null
                }
            }
        })
        .state('manage_integration_add', {
            url: '/integrations/add/:entity',
            templateUrl: 'app/integrations/form.html',
            controllerAs: 'vm',
            controller: 'ApiKeyFormCtrl',
            resolve: {
                load: function (AutenticationService, ManagerService, Restangular) {
                    AutenticationService.resolveSessionOrLogout();
                    return ManagerService.list('acls');
                }
            },
            params: {
                title: {
                    value: null
                }
            }
        });
};
angular
    .module('auth2factor')
    .config(routes);
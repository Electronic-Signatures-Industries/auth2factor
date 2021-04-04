var routes = function ($stateProvider) {
    $stateProvider
        .state('security_keys', {
            url: '/securityKeys',
            templateUrl: 'app/securityKeys/register.html',
            controllerAs: 'vm',
            controller: 'SecurityKeyRegisterCtrl'
        });
};
angular
    .module('auth2factor')
    .config(routes);
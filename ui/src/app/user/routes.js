var routes = function ($stateProvider) {
    $stateProvider
        .state('user_profile', {
            url: '/profile/:token',
            templateUrl: 'app/user/profile.html',
            controllerAs: 'vm',
            controller: 'UserProfileCtrl',
            params: {
                token: {
                    value: null
                }
            }
        });
};
angular
    .module('auth2factor')
    .config(routes);
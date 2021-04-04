// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global $:true*/
function ActivateAppCtrl($rootScope, _, $scope, $log, SystemService) {

    var vm = this;
    var formDefaults = {};
    vm.addGrowler = function (notification, opts) {
        $rootScope.$broadcast('af:growler:add', {
            notification: notification,
            options: opts
        });
    };
    vm.logError = function (err) {
        vm.addGrowler({
            message: err
        }, {
            isError: true
        });
    };

    vm.activate = function (form, model) {
        var self = this;

        if (form.$valid) {

            SystemService.activate(model)
                .then(function (response) {

                    vm.addGrowler({
                        message: 'Licencia activada'
                    });
                }, vm.logError);
        }
    };



}
angular
    .module('auth2factor.controllers')
    .controller('ActivateAppCtrl', ActivateAppCtrl);
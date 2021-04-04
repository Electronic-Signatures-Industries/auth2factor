// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function UserMultiEnrollCtrl(_, $rootScope, $scope, $log, $state, ManagerService, UserService) {

    var vm = this;
    var formDefaults = {
    };
    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    };
    var empty = { group: '  Seleccione un grupo  '};
    vm.groups = ManagerService.groups;

    vm.logError = function (err) {        
        vm.errorLabel = err;
        vm.hasErrors = true;
    };

    vm.reset = function () {
        $scope.form.$setPristine();
        $scope.formulario = angular.copy(formDefaults);
    };

    vm.save = function (form, model) {
        var self = this;

        if (form.$valid) {          
  
            UserService.addMulti(model)
                .then(function (response) {
                    vm.addGrowler({
                        message: 'CSV importado'
                    });

                    vm.cancel();

                }, vm.logError);
        }
    };

    vm.cancel = function () {
        vm.reset();
        $state.go('manage_users');
    };
    
    $scope.formulario = angular.copy(formDefaults);
    
}
angular
    .module('auth2factor.controllers')
    .controller('UserMultiEnrollCtrl', UserMultiEnrollCtrl);
// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function UserFormCtrl($rootScope, _, $scope, $log, $state, ManagerService, UserService) {

    var vm = this;
    var formDefaults = {
    };

    vm.groups = ManagerService.groups;

    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    };    

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
  
            var action = 'add';
            var actionLabel = model.email + ' creado satisfactoriamente.';
            if (vm.canEdit) {
                action = 'update';
                model.email = $state.params.id;
                actionLabel = $state.params.id + ' actualizado satisfactoriamente.';
            }

            UserService[action](model)
                .then(function (response) {
                    vm.addGrowler({
                        message: actionLabel
                    });

                    vm.cancel();

                }, vm.logError);
        }
    };

    vm.cancel = function () {
        vm.reset();
        $state.go('manage_users');
    };
    vm.canEdit = !!$state.params.id;
    vm.account = $state.params.id;

    if (vm.canEdit) {
        UserService
            .get($state.params.id)
            .then(function (model) {

                $scope.formulario = {
                    firstName: model.firstName,
                    lastName: model.lastName,
                    ldapAccount: model.ldapAccount,
                    cellphone: model.cellphone || '',
                    group: model.group,
                    inactive: model.inactive
                };

                if (!model.inactive) {
                    $scope.formulario.enable = true;
                }
            });
    } else {
        $scope.formulario = angular.copy(formDefaults);
    }
}
angular
    .module('auth2factor.controllers')
    .controller('UserFormCtrl', UserFormCtrl);
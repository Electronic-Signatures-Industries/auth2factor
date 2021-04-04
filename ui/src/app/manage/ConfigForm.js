// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function ConfigFormCtrl(_, $rootScope, $scope, $log, $state, ManagerService, ConfigurationService) {

    var vm = this;


    var formDefaults = {};

    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    }; 
    
    vm.logError = function (err) {
        $log.error(err);
        vm.errorLabel = err;
        vm.hasErrors = true;
    };

    vm.reset = function () {
        $scope.form.$setPristine();
        $scope.formulario = angular.copy(formDefaults);
    };

    vm.save = function (form, model) {
        if (vm.entity === 'adapter') {
            model.entity = 'adapter';
        } else if (vm.entity === 'transport') {
            model.entity = 'transport';
        }

        model.entityId = model[model.entity];

        if (form.$valid) {

            var action = 'add';
            var actionLabel = model.key + ' creado satisfactoriamente.';
            if (vm.canEdit) {
                action = 'update';
                actionLabel = $state.params.entity + ' actualizado satisfactoriamente.';
            }
            ConfigurationService[action](model)
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
        $state.go('manage_configuration');
    };

    $scope.formulario = angular.copy(formDefaults);
    vm.canEdit = !!$state.params.id;
    vm.key = $state.params.id;
    vm.entity = $state.params.entity;

    if (vm.entity === 'adapter') {
        vm.adapters = ManagerService.adapters;
        vm.typeLabel = 'Adaptador';
    } else if (vm.entity === 'transport') {
        vm.transports = ManagerService.transports;
        vm.typeLabel = 'Transporte';
    } else {
      vm.typeLabel = 'Configuración';   
    }

    if (vm.canEdit) {
        ConfigurationService
            .get({
                key: $state.params.id
            })
            .then(function (model) {

                $scope.formulario = {
                    key: model.key,
                    description: model.description,
                    adapter: model.entityId,
                    transport: model.entityId,
                    settings: model.settings
                };
            });
    } else {
        $scope.formulario = angular.copy(formDefaults);
    }
}
angular
    .module('auth2factor.controllers')
    .controller('ConfigFormCtrl', ConfigFormCtrl);
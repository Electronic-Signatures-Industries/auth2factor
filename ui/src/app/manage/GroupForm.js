// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function GroupFormCtrl($rootScope, _, $scope, $log, $state, ConfigurationService, GroupService) {

    var vm = this;

    var formDefaults = {
        adapter: {
            id: 'db:adapter'
        }
    };

    if (ConfigurationService.adapters) {
        vm.adapters = ConfigurationService.adapters;
    }
    if (ConfigurationService.transports) {
        vm.transports = ConfigurationService.transports;
    }
    
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
        var self = this;

        if (!model.transport.id || model.transport.id === 'none') {
            vm.errorLabel = 'Transporte es requerido';
            vm.hasErrors = true;
            return;
        }

        if (!model.adapter.id || model.adapter.id === 'none') {
            vm.errorLabel = 'Adaptador es requerido';
            vm.hasErrors = true;
            return;
        }

        if (form.$valid) {          

            
            var action = 'add';
            var actionLabel = model.group + ' creado satisfactoriamente.';
            if (vm.canEdit) {
                action = 'update';
                actionLabel = $state.params.id + ' actualizado satisfactoriamente.';
            }
            GroupService[action](model)
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
        $state.go('manage_groups');
    };

    vm.canEdit = !!$state.params.id;
    vm.group = $state.params.id;

    if (vm.canEdit) {
        GroupService
            .get($state.params.id)
            .then(function (model) {

                $scope.formulario = {
                    transport: {
                        id: model.transport.id,
                        description: model.transport.description || ''
                    },
                    group: model.group,
                    description: model.description,
                    adapter: {
                        id: model.adapter.id,
                        description: model.adapter.description || ''
                    }
                };


            });
    } else {
        $scope.formulario = angular.copy(formDefaults);
    }
}
angular
    .module('auth2factor.controllers')
    .controller('GroupFormCtrl', GroupFormCtrl);
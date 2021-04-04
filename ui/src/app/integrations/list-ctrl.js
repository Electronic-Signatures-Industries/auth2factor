/*global module: true, $:true*/
function IntegrationGridPageCtrl($rootScope, $scope, $state, $log, _, ngDialog, NgTableParams, ConfigurationService) {


    var vm = this;
    vm.configuration = ConfigurationService.configuration;
    
    vm.globalSearchTerm = '';

    vm.tableParams = new NgTableParams({
        filter: {
            $: vm.globalSearchTerm
        },
        count: 15
    }, {
        data: vm.configuration
    });

    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    };  
    
    vm.refresh = function () {
        ConfigurationService.list({ view: 'apikeys'})
            .then(function (items) {
                vm.tableParams = new NgTableParams({
                    filter: {
                        $: vm.globalSearchTerm
                    },
                    count: 15
                }, {
                    data: items
                });
            });
    };    
    
    vm.addAPIKey = function (entity) {
        $state.go('manage_integration_add', {
            entity: 'apikey'
        });
    };

    vm.edit = function (item) {
        $state.go('manage_integration_edit', {
            id: item.key,
            entity: item.entity
        });
    };

    vm.logError = function (err) {
        vm.addGrowler({
            message: err
        }, { isError: true });
        $log.error(err);
    };
    
    
    vm.delete = function(item) {
        $scope.label = item.key;
        $scope.question = 'Continuar con eliminación de integracion ';
        $scope.closeLabel = 'No';
        $scope.confirmLabel = 'Si';
        
        var dialog = ngDialog.openConfirm({
            scope: $scope,
            template: 'app/common/controllers/deleteModal.html',
            controllerAs: 'vm',
            controller: 'DeleteModalCtrl'
        });    
        
        dialog.then(function() {
            ConfigurationService
                .delete(item.key)
                .then(function () {    
                    vm.addGrowler({
                        message: item.key + ' eliminado.'
                    });                        
                    vm.refresh();
                }, vm.logError);
        }, function() {
            // closed
        });
    };

}

module.exports = IntegrationGridPageCtrl;

angular
    .module('auth2factor.controllers')
    .controller('IntegrationGridPageCtrl', IntegrationGridPageCtrl);
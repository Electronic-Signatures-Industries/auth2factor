/*global $:true*/
function ManageGroupsCtrl($rootScope, $scope, $log, $state, _, ngDialog, NgTableParams, ManagerService, GroupService) {

    var vm = this;

    vm.groups = ManagerService.groups;
    vm.globalSearchTerm = '';

    vm.refresh = function () {
        ManagerService.list('groups', {
                refresh: true
            })
            .then(function (groups) {
                vm.tableParams = new NgTableParams({
                    filter: {
                        $: vm.globalSearchTerm
                    },
                    count: 5
                }, {
                    data: groups
                });
            });
    };
    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    }; 
    vm.tableParams = new NgTableParams({
        filter: {
            $: vm.globalSearchTerm
        },
        count: 5
    }, {
        data: vm.groups
    });
    vm.add = function () {
        $state.go('manage_groups_add');
    };
    vm.edit = function (item) {
        $state.go('manage_groups_edit', {
            id: item.group
        });
    };
    vm.logError = function (err) {
        vm.addGrowler({
            message: err
        }, { isError: true });
        $log.error(err);
    };
    
    vm.delete = function(item) {
        $scope.label = item.group;
        $scope.question = 'Continuar con eliminación de grupo ';
        $scope.closeLabel = 'No';
        $scope.confirmLabel = 'Si';
        
        var dialog = ngDialog.openConfirm({
            scope: $scope,
            template: 'app/common/controllers/deleteModal.html',
            controllerAs: 'vm',
            controller: 'DeleteModalCtrl'
        });    
        
        dialog.then(function() {
            GroupService
                .delete(item.group)
                .then(function () { 
                    vm.addGrowler({
                        message: item.group + ' eliminado.'
                    });                        
                    vm.refresh();
                }, vm.logError);
        }, function() {
            // closed
        });
    };
}
angular
    .module('auth2factor.controllers')
    .controller('ManageGroupsCtrl', ManageGroupsCtrl);
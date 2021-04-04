/*global $:true*/
function ManageUsersCtrl($rootScope, $scope, $state, $log, _, ngDialog, NgTableParams, ManagerService, UserService, AutenticationService) {

    var vm = this;
    vm.users = ManagerService.users;
    vm.globalSearchTerm = '';

    vm.tableParams = new NgTableParams({
        filter: {
            $: vm.globalSearchTerm
        },
        count: 10
    }, {
        data: vm.users
    });

    vm.refresh = function () {
        ManagerService.list('users', {
                refresh: true
            })
            .then(function (users) {
                vm.tableParams = new NgTableParams({
                    filter: {
                        $: vm.globalSearchTerm
                    },
                    count: 10
                }, {
                    data: users
                });
            });
    };    
    vm.addMulti = function () {
        $state.go('manage_users_add_multi');
    };

    vm.add = function () {
        $state.go('manage_users_add');
    };

    vm.edit = function (item) {
        $state.go('manage_users_edit', {
            id: item.email
        });
    };

    vm.logError = function (err) {
        vm.addGrowler({
            message: err
        }, { isError: true });
        $log.error(err);
    };
    
    vm.addGrowler = function(notification, opts) {
        $rootScope.$broadcast('af:growler:add', { 
            notification: notification,
            options: opts
        });
    };

    
    vm.delete = function(item) {
        $scope.label = item.email;
        if (item.inactive) {
          $scope.question = 'Continuar con eliminación de cuenta de usuario ';
        } else {
          $scope.question = 'Continuar con desactivación de cuenta de usuario ';
        }
        $scope.closeLabel = 'No';
        $scope.confirmLabel = 'Si';
        
        var hardDelete = false;
        
        var dialog = ngDialog.openConfirm({
            scope: $scope,
            template: 'app/common/controllers/deleteModal.html',
            controllerAs: 'vm',
            controller: 'DeleteModalCtrl'
        });    
        
        var actionLabel = item.email + ' desactivado.';
        if (item.inactive) {
            hardDelete = true;
            actionLabel = item.email + ' eliminado.';
        }
                
        dialog.then(function() {
            UserService
                .delete(item.email, hardDelete)
                .then(function () { 
                    
                    vm.addGrowler({
                        message: actionLabel
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
    .controller('ManageUsersCtrl', ManageUsersCtrl);
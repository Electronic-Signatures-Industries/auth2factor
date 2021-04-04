/*global $:true*/
function SecurityKeyRegisterCtrl($rootScope, $scope, $log, $window, $state, $q, 
FailUnlessResolvedWithin, SecurityKeyService, ResourcesService, U2F, ngDialog, NgTableParams) {

    var vm = this;
    var formDefaults = {};
    vm.addGrowler = function (notification, opts) {
        $rootScope.$broadcast('af:growler:add', {
            notification: notification,
            options: opts
        });
    };

    vm.items = [];
    vm.tableParams = new NgTableParams({
        filter: {
            $: ''
        },
        count: 15 // initial page size
    }, {
        data: vm.items
    });

    vm.refresh = function () {
        SecurityKeyService.list()
            .then(function (response) {
                vm.items = response;
                vm.tableParams = new NgTableParams({
                    filter: {
                        $: ''
                    },
                    count: 15 // initial page size
                }, {
                    data: vm.items
                });
            }, vm.logError);
    };


    vm.requestChallenge = function () {
        var dialog = ngDialog.open({
            scope: $scope,
            template: 'app/common/controllers/U2FModal.html',
            controllerAs: 'vm',
            controller: 'U2FModalCtrl'
        });

        SecurityKeyService.requestChallenge()
            .then(function (response) {
                if (response) {


                    FailUnlessResolvedWithin(function (promise) {
                        U2F.register(response.appId, [response], [], function (data) {
                            if (data.errorCode) {
                                dialog.close();
                                promise.reject(ResourcesService.getResource('u2fError', data.errorCode));
                            }

                            promise.resolve(data);
                        });

                        return promise;
                    }, 40000).then(function (result) {

                        $log.info("Register callback", result);
                        dialog.close();

                        SecurityKeyService.register(result)
                            .then(function (options) {
                                vm.refresh();
                                $log.info(options);
                            });

                    }, function (error) {
                        dialog.close();
                        vm.addGrowler({
                            message: error
                        }, {
                            isError: true
                        });
                        $log.error(error);
                    });
                }
            }, function(err) {
                dialog.close();
                vm.logError(err);
            });
    };

    vm.startRegistration = function () {
        var self = this;

        vm.requestChallenge();

    };
    vm.delete = function (item) {
        $scope.question = 'Continuar con eliminación de llave de seguridad ';
        $scope.closeLabel = 'No';
        $scope.confirmLabel = 'Si';
        $scope.label = item.publicKey.substring(0, 15) + '...'
        var dialog = ngDialog.openConfirm({
            scope: $scope,
            template: 'app/common/controllers/deleteModal.html',
            controllerAs: 'vm',
            controller: 'DeleteModalCtrl'
        });

        var actionLabel = 'Llave de seguridad eliminada.';

        dialog.then(function () {
            SecurityKeyService
                .delete(item.publicKey)
                .then(function () {

                    vm.addGrowler({
                        message: actionLabel
                    });
                    vm.refresh();
                }, vm.logError);
        }, function () {
            // closed
        });
    };

    vm.refresh();

}
angular
    .module('auth2factor.controllers')
    .controller('SecurityKeyRegisterCtrl', SecurityKeyRegisterCtrl);

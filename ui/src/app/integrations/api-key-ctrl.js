/*global module: true */
function ApiKeyFormCtrl(_, $rootScope, $scope, $log, $state, ManagerService, ConfigurationService) {

    var vm = this;
    var formDefaults = {};
    vm.acls = [];

    if (ManagerService.acls) {
        vm.acls = _.map(ManagerService.acls, function (i) {
            return i.name;
        });
    }

    vm.addGrowler = function (notification, opts) {
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
        model.entity = 'apikey';
        model.entityId = model[model.entity];

        if (form.$valid) {
            var action = 'add';
            var actionLabel = model.key + ' creado satisfactoriamente.';
            if (vm.canEdit) {
                action = 'update';
                actionLabel = $state.params.entity + ' actualizado satisfactoriamente.';
            }

            ConfigurationService[action](model)
                .then(function () {
                    vm.addGrowler({
                        message: actionLabel
                    });

                    vm.cancel();
                }, vm.logError);
        }
    };

    vm.cancel = function () {
        vm.reset();
        $state.go('manage_integrations');
    };

    $scope.formulario = angular.copy(formDefaults);
    vm.canEdit = !!$state.params.id;
    vm.key = $state.params.id;
    vm.entity = $state.params.entity;

    vm.typeLabel = 'Llave de API';
    ConfigurationService
        .generateApiToken()
        .then(function (response) {
            $scope.formulario = {
                key: response.key,
                settings: {
                    clientSecret: response.oauthClientSecret,
                    apiToken: response.secret,
                }
            };
        }, vm.logError);

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

module.exports = ApiKeyFormCtrl;

angular
    .module('auth2factor.controllers')
    .controller('ApiKeyFormCtrl', ApiKeyFormCtrl);
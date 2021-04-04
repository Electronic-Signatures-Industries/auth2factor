/*global $:true*/
function UserProfileCtrl(_, GrowlerService, $location, $rootScope, $scope, $log, $window, $state, AutenticationService, ProfileService) {

    var vm = this;
    vm.showInitLink = true;

    if ($location.$$absUrl.indexOf('/dashboard') > 0) {
        vm.showInitLink = false;
    }

    vm.addGrowler = function (notification, opts) {
        GrowlerService.renderGrowler($scope, notification, opts);
    };
    
    vm.logError = function (err) {

        if (err.status === 403) {
            vm.errorLabel = ProfileService.expiredMessage;
            vm.expired = true;
        } else {
            vm.errorLabel = err;
            vm.hasErrors = true;
            vm.otcRequestLabel = null;
        }
    };



    vm.requestOtc = function (silent) {
        AutenticationService
            .requestOtc()
            .then(function (options) {
                if (silent) {
                    return;
                }

                if (options.retries) {
                    var retryLabel = parseInt(options.retries, 10) + 1;
                    vm.otcRequestLabel = 'Reenviando código. Reintento # ' + retryLabel + '.';
                } else {
                    vm.otcRequestLabel = null;
                }
            }, vm.logError);
    };

    vm.authenticate = function (form, data) {
        if (form.$valid) {

            // otp verification - 2FA
            AutenticationService
                .otpVerification({
                    code: data.otp
                })
                .then(function () {
                    vm.resetModel.redirectTo = $window.location.href;
                    ProfileService
                        .update(vm.resetModel)
                        .then(function () {
                            vm.refreshSettings();
                            vm.showOtc = false;
                            vm.hasErrors = false;
                            vm.addGrowler({
                                message: 'Credenciales actualizado exitosamente'
                            });

                        }, vm.logError);

                }, vm.logError);
        }
    };

    vm.resetPassword = function (form, model) {
        var self = this;

        if (form.$valid) {

            vm.resetModel = model;
            vm.showOtc = true;
            vm.requestOtc(true);
        }
    };

    vm.resetOTC = function (form, model) {
        var self = this;
        _.extend(vm.resetModel, {
            preferSoftToken: model.preferSoftToken
        });
        vm.showOtc = true;
        vm.requestOtc(true);
    };


    vm.cancel = function () {
        vm.reset();
        $state.go('manage_configuration');
    };

    vm.refreshSettings = function () {
        // validate token and get settings
        ProfileService
            .get({
                token: $state.params.token
            })
            .then(function (response) {
                if (response.qr) {
                    $('.qr').append(response.qr);
                    $scope.visibleCode = response.visibleCode;
                }

                if (response.account) {
                    $scope.formulario = {
                        account: response.account
                    };
                }

                if (response.otcChangeRequest) {
                    vm.resetModel = {
                        otcChangeRequest: response.otcChangeRequest
                    };
                }

                $scope.formulario.preferSoftToken = response.preferSoftToken;
            }, vm.logError);

    };

    vm.resetPasswordStep = function () {
        vm.showQR = false;
        vm.showReset = true;
        vm.step = 2;
    };

    vm.step = 1;
    vm.showQR = true;
    vm.refreshSettings();

    vm.passwordMatch = function (form) {

        var passwordConfirmation = form.passwordConfirmation;
        var password = form.password;

        // only check if confirmation is not empty


        if (password.$viewValue !== passwordConfirmation.$viewValue) {
            passwordConfirmation.$error.nomatch = true;
            passwordConfirmation.$setValidity(passwordConfirmation.$name, false);
        } else {
            passwordConfirmation.$error.nomatch = false;
            passwordConfirmation.$setValidity(passwordConfirmation.$name, true);
        }
    };


}
angular
    .module('auth2factor.controllers')
    .controller('UserProfileCtrl', UserProfileCtrl);
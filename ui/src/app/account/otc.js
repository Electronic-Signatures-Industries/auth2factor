function LoginOTCCtrl(_, $rootScope, $scope, $log, $state, $stateParams, $window, AutenticationService, FailUnlessResolvedWithin, SecurityKeyService, ResourcesService, U2F, ngDialog) {

    var vm = this;

    vm.isU2F = !!AutenticationService.u2f


    vm.errorLabel = undefined;
    vm.hasErrors = false;
    vm.showPostError = function (err) {
        $log.error(err);
        vm.errorLabel = err;
        vm.hasErrors = true;
        vm.otcRequestLabel = null;
    };
    vm.addGrowler = function (notification, opts) {
        $rootScope.$broadcast('af:growler:add', {
            notification: notification,
            options: opts
        });
    };


    vm.getU2FSignRequest = function () {
        var reqs = _.filter(AutenticationService.u2f.signRequest, function (item) {
            return $window.location.origin.indexOf(item.appId) > -1;
        });

        if (reqs.length > 0) {
            return {
                appId: reqs[0].appId,
                challenge: reqs[0].challenge,
                signRequests: reqs,
            };
        } else {
            return null;
        }
    };

    vm.requestU2FLogin = function () {
        var dialog = ngDialog.open({
            scope: $scope,
            template: 'app/common/controllers/U2FModal.html',
            controllerAs: 'vm',
            controller: 'U2FModalCtrl'
        });

        if (AutenticationService.u2f && AutenticationService.u2f.signRequest) {
            FailUnlessResolvedWithin(function (promise) {
                var u2fRequest = vm.getU2FSignRequest();
                if (!u2fRequest) {
                    promise.reject(ResourcesService.getResource('u2fError', 6));
                    return promise;
                }

                U2F.sign(u2fRequest.appId, u2fRequest.challenge, u2fRequest.signRequests, function (data) {

                    if (!data) {
                        dialog.close();
                        promise.reject('Invalid scheme, must be https');
                        return;
                    }

                    if (data && data.errorCode) {
                        dialog.close();
                        promise.reject(ResourcesService.getResource('u2fError', data.errorCode));
                        return;
                    }

                    promise.resolve(data);
                });

                return promise;
            }, 40000).then(function (result) {

                dialog.close();

                AutenticationService
                    .u2fVerification(result)
                    .then(function (options) {
                        vm.dashboardRedirect();
                        $log.info(options);
                    }, function (e) {
                        dialog.close();
                        vm.showPostError(e);
                    });

            }, function (e) {
                setTimeout(function(){
                    dialog.close();
                }, 1000);
                vm.showPostError(e);
            });
        }
    };

    vm.requestOtc = function (opts) {
        opts = opts || {};
        AutenticationService
            .requestOtc()
            .then(function (options) {
                if (!opts.initRetryDisabled && options.retries) {
                    var retryLabel = parseInt(options.retries, 10) + 1;
                    vm.otcRequestLabel = 'Reenviando código. Reintento # ' + retryLabel + '.';
                } else {
                    vm.otcRequestLabel = null;
                }
            }, this.showPostError);
    };

    vm.dashboardRedirect = function () {
        $window.location.href = '/dashboard#manage';
    };

    vm.authenticate = function (form, data) {
        if (form.$invalid) {
            $log.info('invalid login data');
        } else {
            // otp verification - 2FA
            AutenticationService
                .otpVerification({
                    code: data.otp
                })
                .then(function (options) {
                    vm.dashboardRedirect();
                }, this.showPostError);
        }
    };

    if (vm.isU2F) {
        vm.requestU2FLogin();
    } else {
        vm.requestOtc({
            initRetryDisabled: true
        });
    }
}

angular.module('rutha.local-account')
    .controller('LoginOTCCtrl', LoginOTCCtrl);
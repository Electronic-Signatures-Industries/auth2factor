/* eslint-disable no-console */
angular.module('auth2factor')
    .component('demoOtc', {
        bindings: {},
        templateUrl: 'app/account/account.otc.html',
        controller: function ($rootScope, $state, AutenticationService, _, $window,
            FailUnlessResolvedWithin, SecurityKeyService, ResourcesService, U2F, ngDialog,
            $scope) {
            var ctrl = this;
            this.isU2F = !!AutenticationService.u2f;
            this.errorLabel = null;
            this.hasErrors = false;
            this.showPostError = function (err) {
                console.error(err);
                ctrl.errorLabel = err;
                ctrl.hasErrors = true;
                ctrl.otcRequestLabel = null;
            };
            this.addGrowler = function (notification, opts) {
                $rootScope.$broadcast('af:growler:add', {
                    notification: notification,
                    options: opts
                });
            };


            this.getU2FSignRequest = function () {
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

            this.requestU2FLogin = function () {
                var dialog = ngDialog.open({
                    scope: $scope,
                    template: 'app/common/controllers/U2FModal.html',
                    controllerAs: 'vm',
                    controller: 'U2FModalCtrl'
                });

                if (AutenticationService.u2f && AutenticationService.u2f.signRequest) {
                    FailUnlessResolvedWithin(function (promise) {
                        var u2fRequest = ctrl.getU2FSignRequest();
                        if (!u2fRequest) {
                            promise.reject(ResourcesService.getResource('u2fError', 6));
                            return promise;
                        }

                        U2F.sign(u2fRequest.appId, u2fRequest.challenge,
                            u2fRequest.signRequests,
                            function (data) {

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
                                ctrl.dashboardRedirect();
                                console.info(options);
                            }, function (e) {
                                dialog.close();
                                ctrl.showPostError(e);
                            });

                    }, function (e) {
                        setTimeout(function () {
                            dialog.close();
                        }, 1000);
                        ctrl.showPostError(e);
                    });
                }
            };

            this.requestOtc = function (opts) {
                opts = opts || {};
                AutenticationService
                    .requestOtc()
                    .then(function (options) {
                        if (!opts.initRetryDisabled && options.retries) {
                            var retryLabel = parseInt(options.retries, 10) + 1;
                            ctrl.otcRequestLabel = 'Reenviando código. Reintento # ' + retryLabel + '.';
                        } else {
                            ctrl.otcRequestLabel = null;
                        }
                    }, this.showPostError);
            };

            this.dashboardRedirect = function () {
                $state.go('demo_admin');
            };

            this.authenticate = function (form, data) {
                if (form.$invalid) {
                    console.info('invalid login data');
                } else {
                    // otp verification - 2FA
                    AutenticationService
                        .otpVerification({
                            code: data.otp
                        })
                        .then(function () {
                            ctrl.dashboardRedirect();
                        }, this.showPostError);
                }
            };

            if (this.isU2F) {
                this.requestU2FLogin();
            } else {
                this.requestOtc({
                    initRetryDisabled: true
                });
            }
        }
    });
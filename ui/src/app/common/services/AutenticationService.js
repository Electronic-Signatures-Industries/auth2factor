// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function AutenticationService($window, $log, $q, $http, _, $location, $cookies,
    AuthModel, Restangular, AuthRestangular, ResourcesService) {

    AutenticationService.clearTokens = function () {
        // remove local storage tokens
        AutenticationService.bearerToken({
            remove: true
        });
        AutenticationService.otcToken({
            remove: true
        });
    };

    AutenticationService.resolveSessionOrLogout = function () {
        if ($cookies.get('user')) {
            return true;
        } else {
            $window.location.href = '/logout';
            return false;
        }
    };

    AutenticationService.resolveTokenOrLogout = function () {
        if (AutenticationService.bearerToken()) {
            return AutenticationService.bearerToken();
        } else {
            $window.location.href = '/logout';
            return false;
        }
    };


    AutenticationService.bearerToken = function (token) {

        if (token && token.remove) {
            AuthModel.remove('bearerToken');
            return;
        }

        if (token) {
            AuthModel.set('bearerToken', token);
        } else {
            token = AuthModel.get('bearerToken');
            if (!token) {
                return null;
            } else {
                return {
                    authorization: "Bearer " + token
                };
            }
        }

    };

    AutenticationService.otcToken = function (token) {
        if (token && token.remove) {
            AuthModel.remove('otcToken');
            return;
        }

        if (token) {
            AuthModel.set('otcToken', token);
        } else {
            token = AuthModel.get('otcToken');
            if (!token) {
                return null;
            } else {
                return {
                    authorization: "Bearer " + token
                };
            }
        }

    };

    AutenticationService.u2fVerification = function (model) {

        var deferred = $q.defer();

        var otcHeader = AutenticationService.otcToken();
        if (!otcHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            clientData: model.clientData,
            signatureData: model.signatureData
        };

        AuthRestangular
            .all('u2f')
            .post(data, null, otcHeader)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('u2fValidateError'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 201) {
                        AutenticationService.bearerToken(response.headers()['x-app-bearer']);
                        deferred.resolve({
                            accessToken: response.headers()['x-app-dashboard-sid'],
                            success: true
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;
    };

    AutenticationService.otpVerification = function (model) {

        var deferred = $q.defer();

        var otcHeader = AutenticationService.otcToken();
        if (!otcHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            code: model.code
        };

        AuthRestangular.all('otc')
            .post(data, null, otcHeader)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 401) {
                        deferred.reject('Favor de autenticarse antes de ingresar código');
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 201) {
                        AutenticationService.bearerToken(response.headers()['x-app-bearer']);
                        deferred.resolve({
                            success: true,
                            accessToken: response.headers()['x-app-dashboard-sid'],
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;
    };

    AutenticationService.requestOtc = function () {
        var deferred = $q.defer();

        var otcHeader = AutenticationService.otcToken();
        if (!otcHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }


        AuthRestangular
            .all('api/v2/users/otc/request')
            .post(null, null, otcHeader)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 401) {
                        deferred.reject('Favor de autenticarse antes de ingresar código');
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 201) {
                        AutenticationService.otcToken(response.headers()['x-app-sign-request']);
                        deferred.resolve({
                            retries: response.headers()['x-app-reset-retries']
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;
    };

    AutenticationService.login = function (model) {

        var data = {
            email: model.email,
            password: model.password,
            doRequestOtc: false
        };

        var deferred = $q.defer();

        AuthRestangular
            .all('authenticate')
            .post(data)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(ResourcesService.getResource('accountNotFound'));
                    } else if (response.status === 400) {
                        deferred.reject(ResourcesService.getResource('badPassword'));
                    } else if (response.status === 200) {
                        AutenticationService.otcToken(response.headers()['x-app-sign-request']);
                        if (response.headers()['x-u2f-sign-request']) {
                            AutenticationService.u2f = {
                                signRequest: JSON.parse(response.headers()['x-u2f-sign-request'])
                            };
                        };
                        deferred.resolve({
                            success: true
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 404) {
                        deferred.reject(ResourcesService.getResource('accountNotFound'));
                    } else if (response.status === 400) {
                        deferred.reject(ResourcesService.getResource('badPassword'));
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;
    };


    AutenticationService.forgot = function (model) {

        var data = {
            email: model.email,
            redirectTo: model.redirectTo
        };

        var deferred = $q.defer();

        AuthRestangular.all('api/v1/users/reset')
            .post(data)
            .then(function (response) {
                    if (response.status === 201) {
                        deferred.resolve({});
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    deferred.reject(response.data.message);
                });

        return deferred.promise;
    };

    AutenticationService.reset = function (model) {

        var data = {
            password: model.password,
            redirectTo: model.redirectTo
        };

        var deferred = $q.defer();
        // Use plain old $http, Restangular has issues with the 2nd arg in customPUT
        // https://github.com/mgonto/restangular/issues/914
        $http.put('/reset', data, {
                headers: {
                    authorization: "Bearer " + model.token
                }
            })
            .then(function (response) {
                if (response.status === 204) {
                    deferred.resolve({
                        location: response.headers().location
                    });
                } else {
                    deferred.reject(ResourcesService.getResource('genericError', response.status));
                }
            }, function (response) {
                deferred.reject(response.data.message);
            });

        return deferred.promise;
    };

    AutenticationService.clearTokens = function () {
        // remove local storage tokens
        AutenticationService.bearerToken({
            remove: true
        });
        AutenticationService.otcToken({
            remove: true
        });
    };

    AutenticationService.ping = function () {
        var deferred = $q.defer();

        var token = AutenticationService.bearerToken();
        if (!token) {
            deferred.reject('No existe token');
            return deferred.promise;
        }


        Restangular
            .one('v1/users/ping')
            .get(null, token)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 200) {
                        deferred.resolve({
                            ok: true
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;

    };

    
    AutenticationService.getUserInfo = function () {
        var deferred = $q.defer();
        var token = AutenticationService.bearerToken();
        if (!token) {
            deferred.reject('No existe token');
            return deferred.promise;
        }


        Restangular
            .one('v1/profile/info')
            .get(null, token)
            .then(function (response) {
                    if (response.status === 404) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else if (response.status === 200) {
                        deferred.resolve({
                            info: response.data
                        });
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    if (response.status === 401) {
                        deferred.reject(ResourcesService.getResource('expiredToken'));
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                });

        return deferred.promise;

    };
    return AutenticationService;
}

angular
    .module('auth2factor.auth')
    .factory('AutenticationService', AutenticationService);
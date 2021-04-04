// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global _:false*/
function SecurityKeyService($log, $q, _, $http, Restangular, AutenticationService, MomentService, ResourcesService) {

    var route = 'v2/security_keys';

    SecurityKeyService.requestChallenge = function () {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        Restangular.all(route + '/challenge')
            .post({}, null, tokenHeader)
            .then(function (response) {
                    if (response.status === 201) {
                        deferred.resolve({
                            version: response.headers()['x-app-u2f-version'],
                            appId: response.headers()['x-app-u2f-appid'],
                            challenge: response.headers()['x-app-u2f-challenge']
                        });
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    deferred.reject(response.data.message);
                });

        return deferred.promise;
    };

    SecurityKeyService.register = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            clientData: model.clientData,
            registrationData: model.registrationData
        };


        Restangular.all(route)
            .post(data, null, tokenHeader)
            .then(function (response) {
                    if (response.status === 201) {
                        deferred.resolve({
                            done: true
                            //location: response.headers().location
                        });
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
                },
                function (response) {
                    deferred.reject(response.data.message);
                });

        return deferred.promise;
    };

    SecurityKeyService.delete = function (id) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        $http.delete('/api/' + route + '/' + id, {
                headers: tokenHeader
            })
            .then(function (response) {
                if (response.status === 204) {
                    deferred.resolve();
                } else {
                    deferred.reject(ResourcesService.getResource('genericError', response.status));
                }
            }, function (response) {
                deferred.reject(response.data.message);
            });

        return deferred.promise;
    };

    SecurityKeyService.list = function (options) {

        options = options || {};
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        function addDisplayDates(temp) {
            _.each(temp, function (row) {
                if (row.created) {
                    row.displayCreated = MomentService(row.created).format('DD/MMM/YYYY HH:mm');
                }
            });

            return temp;
        }

        Restangular
            .one(route)
            .get(options, tokenHeader)
            .then(function (resp) {
                SecurityKeyService.securityKeys = addDisplayDates(resp.data.securityKeys);
                deferred.resolve(SecurityKeyService.securityKeys);
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };



    return SecurityKeyService;
}

angular
    .module('auth2factor.services')
    .factory('SecurityKeyService', SecurityKeyService);

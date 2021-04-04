// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global _:false*/
function UserService($log, $http, $q, _, Restangular, AutenticationService, ResourcesService) {

    var route = 'v1/management/users';

    UserService.addMulti = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            csv: model.csv,
            group: model.group
        };

        Restangular.all(route + '/multi')
            .post(data, null, tokenHeader)
            .then(function (response) {
                    if (response.status === 201) {
                        deferred.resolve({
                            success: true
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

    
    UserService.add = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            account: model.email,
            ldapAccount: model.ldapAccount,
            firstName: model.firstName,
            lastName: model.lastName,
            redirectTo: '/dashboard#profile/',
            group: model.group,
            cellphone: model.cellphone,
            hasConfirmation: !!model.hasConfirmation
        };

        Restangular.all(route)
            .post(data, null, tokenHeader)
            .then(function (response) {
                    if (response.status === 201) {
                        deferred.resolve({
                            location: response.headers().location
                        });
                    } else if (response.status === 400) {
                        deferred.reject(response.data.message);
                    } else {
                        deferred.reject(ResourcesService.getResource('genericErrorCreateAccount', response.status));
                    }
                },
                function (response) {
                    deferred.reject(response.data.message);
                });

        return deferred.promise;
    };

    UserService.update = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            account: model.email,
            ldapAccount: model.ldapAccount,
            firstName: model.firstName,
            lastName: model.lastName,
            redirectTo: '/#/main/',
            group: model.group,
            cellphone: model.cellphone,
            resetAccount: model.resetAccount,
            enable: model.enable
        };

        // Use plain old $http, Restangular has issues with the 2nd arg in customPUT
        // https://github.com/mgonto/restangular/issues/914
        $http.put('/api/' + route, data, {
                headers: tokenHeader
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

    UserService.delete = function (id, force) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }
        
        var config = {
            headers: tokenHeader
        };
        
        if (force) {
            config.params = {
                force: true
            };
        }

        $http.delete('/api/' + route + '/' + id, config)
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

    UserService.get = function (id) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        Restangular
            .one(route)
            .get({
                account: id
            }, tokenHeader)
            .then(function (resp) {
                deferred.resolve(_.first(resp.data.users));
            })
            .catch(function (err) {   
                deferred.reject(err);
            });

        return deferred.promise;
    };
    return UserService;
}

angular
    .module('auth2factor.services')
    .factory('UserService', UserService);
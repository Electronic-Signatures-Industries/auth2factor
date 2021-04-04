function ConfigurationService($log, $q, _, $http,
 Restangular, AutenticationService, MomentService, ResourcesService) {

    var route = 'v1/management/configs';

    ConfigurationService.generateApiToken = function () {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        Restangular.all(route + '/generate_api_token')
            .post({}, null, tokenHeader)
            .then(function (response) {
                if (response.status === 201) {
                        deferred.resolve({
                            secret: response.headers()['x-app-new-api-secret'],
                            oauthClientSecret: response.headers()['x-app-new-oauth-client-secret'],
                            key: response.headers()['x-app-new-api-key']
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

    ConfigurationService.add = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            key: model.key,
            description: model.description,
            entity: model.entity,
            entityId: model.entityId,
            settings: model.settings
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
                        deferred.reject(ResourcesService.getResource('genericError', response.status));
                    }
            },
                function (response) {
                    deferred.reject(response.data.message);
                });

        return deferred.promise;
    };

    ConfigurationService.delete = function (id) {
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

    ConfigurationService.update = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        var data = {
            key: model.key,
            description: model.description,
            settings: model.settings
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

    ConfigurationService.list = function (options) {

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

                if (resp.data.apikeys) {
                    ConfigurationService.configuration = addDisplayDates(resp.data.apikeys);  
                } else {
                    ConfigurationService.configuration = addDisplayDates(resp.data.configs);
                    ConfigurationService.adapters = addDisplayDates(resp.data.adapters);
                    ConfigurationService.transports = addDisplayDates(resp.data.transports);
                }
                deferred.resolve(ConfigurationService.configuration);
            })
            .catch(function (err) {        
                deferred.reject(err);
            });

        return deferred.promise;
    };

    ConfigurationService.get = function (options) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }


        Restangular
            .one(route)
            .get(options, tokenHeader)
            .then(function (resp) {
                deferred.resolve(_.first(resp.data.configs));
            })
            .catch(function (err) {       
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return ConfigurationService;
}

angular
    .module('auth2factor.services')
    .factory('ConfigurationService', ConfigurationService);
// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global _:false*/
function GroupService($log, $q, _, $http, Restangular, AutenticationService, ResourcesService) {

    var route = 'v1/management/groups';
    
    
    GroupService.add = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
          deferred.reject('No existe token');
          return deferred.promise;
        }
        
        var data = {
            group: model.group,
            description: model.description,
            transport: {
                id: model.transport.id
            },
            adapter: {
                id: model.adapter.id
            }   
        };
        
        if (model.adapter && model.adapter.description)
        {
            data.adapter.description = model.adapter.description;
        }
        
        if (model.transport && model.transport.description)
        {
            data.transport.description = model.transport.description;
        }        

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

    GroupService.update = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
          deferred.reject('No existe token');
          return deferred.promise;
        }
        
        var data = {
            group: model.group,
            description: model.description,
            transport: {
                id: model.transport.id
            },
            adapter: {
                id: model.adapter.id
            }   
        };
        
        if (model.adapter && model.adapter.description)
        {
            data.adapter.description = model.adapter.description;
        }
        
        if (model.transport && model.transport.description)
        {
            data.transport.description = model.transport.description;
        }  
        

        // Use plain old $http, Restangular has issues with the 2nd arg in customPUT
        // https://github.com/mgonto/restangular/issues/914
        $http.put('/api/' + route, data, { headers: tokenHeader })
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
    
    GroupService.delete = function (id) {
        var deferred = $q.defer();
        
        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }
        
        $http.delete('/api/' + route + '/' + id, { headers: tokenHeader })
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

    GroupService.get = function (id) {
        var deferred = $q.defer();
        
        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
          deferred.reject('No existe token');
          return deferred.promise;
        }
        
        Restangular
            .one(route)
            .get({ group: id }, tokenHeader)
            .then(function (resp) {
                deferred.resolve(_.first(resp.data.groups));
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };  
    
    return GroupService;
}

angular
    .module('auth2factor.services')
    .factory('GroupService', GroupService);
function ManagerService($log, $q, _,
 $http, Restangular, AutenticationService, MomentService) {

    var route = 'v1/management';
    
    ManagerService.getStats = function () {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
            deferred.reject('No existe token');
            return deferred.promise;
        }

        Restangular
            .one(route + '/stats')
            .get(null, tokenHeader)
            .then(function (resp) {
                deferred.resolve(resp.data);
                ManagerService.stats = resp.data.stats;
            })
            .catch(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    };
    
    ManagerService.list = function (entityType, options) {    
        options = options || {};
        var deferred = $q.defer();
        var validEntities = { 
            users: 'users', 
            groups: 'groups',
            roles: 'roles',
            adapters: 'adapters',
            transports: 'transports',
            logs: 'logs',
            acls: 'acls',
        };
        var entity = validEntities[entityType];
        
        if (!entity) {
          throw new Error('Invalid entity: ' + entityType);
        }
        
        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
          deferred.reject('No existe token');
          return deferred.promise;
        }
        
        var path = route + '/' + entity;
        var cachedDataset = ManagerService[entity];
        if (!options.refresh && cachedDataset) {
            deferred.resolve(cachedDataset);
            return deferred.promise;
        }

        
        Restangular
            .one(path)
            .get(null, tokenHeader)
            .then(function (resp) {
                var temp = resp.data[entity];
                _.each(temp, function(row) {
                    if (row.created) {
                      row.displayCreated = MomentService(row.created).format('DD/MMM/YYYY HH:mm');
                    }
                });
                
                ManagerService[entity] = temp;
                deferred.resolve(temp);
            })
            .catch(function (err) {
      
                deferred.reject(err);
            });

        return deferred.promise;
    };

    return ManagerService;
}

angular
    .module('auth2factor.services')
    .factory('ManagerService', ManagerService);
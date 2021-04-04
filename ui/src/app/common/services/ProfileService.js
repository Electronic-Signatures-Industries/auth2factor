// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global _:false*/
function ProfileService($log, $q, _, $http, Restangular, AuthRestangular, AutenticationService, ResourcesService) {
    
    ProfileService.expiredMessage = 'Token expirado. Debe solicitar uno nuevo para continuar.';
    
    ProfileService.update = function (model) {
        var deferred = $q.defer();

        var tokenHeader = AutenticationService.resolveTokenOrLogout();
        if (!tokenHeader) {
          deferred.reject('No existe token');
          return deferred.promise;
        }
        
        var data = {};
        if (model.otcChangeRequest) {
            data.seedChangeRequest = model.otcChangeRequest;
        } else {
            data.password = model.password;
        }
        
        data.preferSoftToken = model.preferSoftToken;        

        // Use plain old $http, Restangular has issues with the 2nd arg in customPUT
        // https://github.com/mgonto/restangular/issues/914
        $http.put('/api/v1/profile/reset', data, { headers: tokenHeader })
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
    
    ProfileService.get = function (options) {
        var deferred = $q.defer();
 
        AuthRestangular
            .one('profile/reset')
            .get(options, null)
            .then(function (response) {
                AutenticationService.otcToken(response.headers()['x-app-otc']);
                deferred.resolve(response.data);
            })
            .catch(function (err) {          
                deferred.reject(err);
            });

        return deferred.promise;
    };  
    
    return ProfileService;
}

angular
    .module('auth2factor.services')
    .factory('ProfileService', ProfileService);
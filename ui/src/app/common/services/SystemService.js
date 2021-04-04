// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global _:false*/
function SystemService($log, $q, _, $http, Restangular, ResourcesService) {

    var route = 'v1/management/activate';


    SystemService.activate = function (model) {
        var deferred = $q.defer();
        var data = {};
        try {
            data = {
                license: JSON.parse(model.license),
                actionConfig: JSON.parse(model.actionConfig)
            };
        } catch (err) {
            deferred.reject(err.message);
            return deferred.promise;
        }

        Restangular.all(route)
            .post(data, null)
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


    return SystemService;
}

angular
    .module('auth2factor.services')
    .factory('SystemService', SystemService);
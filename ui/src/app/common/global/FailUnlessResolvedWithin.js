// http://stackoverflow.com/questions/22994871/setting-a-timeout-handler-on-a-promise-in-angularjs
function FailUnlessResolvedWithin($q, $timeout, $rootScope) {

  return function(func, time) {
        var deferred = $q.defer();

        $timeout(function() {
            deferred.reject('No se logro respuesta en ' + time / 1000 + ' segundos, intente de nuevo');
        }, time);

        func(deferred);

        return deferred.promise;
  }
};


angular
  .module('auth2factor.global')
  .factory('FailUnlessResolvedWithin', FailUnlessResolvedWithin);
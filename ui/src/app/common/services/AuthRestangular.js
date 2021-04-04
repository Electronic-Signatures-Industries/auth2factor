// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function AuthRestangular(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setFullResponse(true);
    RestangularConfigurer.setBaseUrl('/');
  });
}

angular
  .module('auth2factor.auth')
  .factory('AuthRestangular', AuthRestangular);
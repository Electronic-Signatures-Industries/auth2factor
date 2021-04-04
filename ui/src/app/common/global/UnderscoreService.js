function UnderscoreService() {
  return window._;
}

angular
  .module('auth2factor.global')
  .factory('_', UnderscoreService);
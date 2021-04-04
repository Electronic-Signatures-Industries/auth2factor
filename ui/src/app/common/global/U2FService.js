function U2FService() {
  return window.u2f;
}

angular
  .module('auth2factor.global')
  .factory('U2F', U2FService);
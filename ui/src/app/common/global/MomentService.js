function MomentService() {
  return window.moment;
}

angular
  .module('auth2factor.global')
  .factory('MomentService', MomentService);
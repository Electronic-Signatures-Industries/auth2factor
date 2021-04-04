function AuthModel(store) {
  return store.getNamespacedStore('Auth');
}

angular
  .module('auth2factor.models')
  .factory('AuthModel', AuthModel);
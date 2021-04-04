function ForgotCtrl($scope, $log, $state, $stateParams, $window, AutenticationService) {
  
  var vm = this;
  vm.errorLabel = undefined;
  vm.hasErrors = false;
  vm.redirectValue = $stateParams.redirectValue || '';

  this.showPostError = function(err) {
    $log.error(err);
    vm.errorLabel = err;
    vm.hasErrors = true;
  };

  this.send = function(form, data) {
    if (form.$invalid) {
      $log.info('invalid forgot data');
    } else {
      $log.info('valid forgot data');
      AutenticationService
      .forgot({
        email: data.correo,
        redirectTo: '/app#/reset/' + vm.redirectValue
      })
      .then(function(options) {
        $state.go("forgot_confirmation");
      }, this.showPostError);
    }
  };
}

angular.module('rutha.local-account')
.controller('ForgotCtrl', ForgotCtrl);

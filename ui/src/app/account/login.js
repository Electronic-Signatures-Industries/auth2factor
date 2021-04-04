function LoginCtrl($scope, $log, $state, $stateParams, $window, AutenticationService) {
  
  var vm = this;
 
  
  this.errorLabel = undefined;
  this.hasErrors = false;
  

  
  this.showPostError = function(err) {
    $log.error(err);
    vm.errorLabel = err;
    vm.hasErrors = true;
  };

  this.authenticate = function(form, data) {
    //vm.hasErrors = false;

    if (form.$invalid) {
      $log.info('invalid login data');
    } 
    else {
      // login - 1st
      AutenticationService
      .login({
        email: data.correo,
        password: data.password
      })
      .then(function(options) {
          $state.go('otc');
      }, this.showPostError);
    }
  };
    

}

angular.module('rutha.local-account')
.controller('LoginCtrl', LoginCtrl);

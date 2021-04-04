angular.module('auth2factor')
    .component('demoLogin', {
        bindings: {},
        templateUrl: 'app/account/account.login.html',
        controller: function ($state, AutenticationService) {
            var ctrl = this;
            this.errorLabel = null;
            this.hasErrors = false;
            this.showPostError = function (err) {
                console.error(err);
                ctrl.errorLabel = err;
                ctrl.hasErrors = true;
            };

            this.authenticate = function (form, data) {

                if (form.$invalid) {
                    console.info('invalid login data');
                } else {
                    // login - 1st
                    AutenticationService
                        .login({
                            email: data.correo,
                            password: data.password
                        })
                        .then(function (options) {
                            $state.go('demo_otc');
                        }, this.showPostError);
                }
            };
        }
    });
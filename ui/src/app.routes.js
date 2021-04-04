var  Restangular = require('restangular');
module.exports = function ($stateProvider, $urlRouterProvider) {

        // Now set up the states
        $stateProvider
            .state('manage_configuration', {
                url: '/config',
                templateUrl: 'app/manage/configuration.html',
                controllerAs: 'vm',
                controller: 'ManageConfigurationCtrl',
                resolve: {
                    load: function (AutenticationService, ConfigurationService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();

                        return ConfigurationService.list({ view: 'no_apikeys' });
                    }
                }
            })
            .state('manage_configuration_edit', {
                url: '/config/edit/:entity/:id',
                templateUrl: 'app/manage/configForm.html',
                controllerAs: 'vm',
                controller: 'ConfigFormCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        ManagerService.list('adapters').then();
                        return ManagerService.list('transports');
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_configuration_add', {
                url: '/config/add/:entity',
                templateUrl: 'app/manage/configForm.html',
                controllerAs: 'vm',
                controller: 'ConfigFormCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        ManagerService.list('adapters').then();
                        return ManagerService.list('transports');
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_groups', {
                url: '/groups',
                templateUrl: 'app/manage/groups.html',
                controllerAs: 'vm',
                controller: 'ManageGroupsCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.list('groups', {
                            refresh: true
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_groups_edit', {
                url: '/groups/edit/:id',
                templateUrl: 'app/manage/groupForm.html',
                controllerAs: 'vm',
                controller: 'GroupFormCtrl',
                resolve: {
                    load: function (AutenticationService, ConfigurationService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ConfigurationService.list({
                            view: 'full'
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_groups_add', {
                url: '/groups/add',
                templateUrl: 'app/manage/groupForm.html',
                controllerAs: 'vm',
                controller: 'GroupFormCtrl',
                resolve: {
                    load: function (AutenticationService, ConfigurationService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ConfigurationService.list({
                            view: 'full'
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_users', {
                url: '/users',
                templateUrl: 'app/manage/users.html',
                controllerAs: 'vm',
                controller: 'ManageUsersCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.list('users', {
                            refresh: true
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_users_edit', {
                url: '/users/edit/:id',
                templateUrl: 'app/manage/userForm.html',
                controllerAs: 'vm',
                controller: 'UserFormCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.list('groups', {
                            refresh: true
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_users_add', {
                url: '/users/add',
                templateUrl: 'app/manage/userForm.html',
                controllerAs: 'vm',
                controller: 'UserFormCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.list('groups', {
                            refresh: true
                        });
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('manage_users_add_multi', {
                url: '/users/add_multi',
                templateUrl: 'app/manage/enrollMulti.html',
                controllerAs: 'vm',
                controller: 'UserMultiEnrollCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.list('groups', {
                            refresh: true
                        });
                    }
                }
            })
            .state('manage', {
                url: '/manage',
                templateUrl: 'app/manage/index.html',
                controllerAs: 'vm',
                controller: 'ManageMainCtrl',
                resolve: {
                    load: function (AutenticationService, ManagerService, Restangular) {
                        AutenticationService.resolveSessionOrLogout();
                        return ManagerService.getStats();
                    }
                },
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('main', {
                url: '/main',
                templateUrl: 'app/account/login.html',
                controllerAs: 'vm',
                controller: 'LoginCtrl',
                params: {
                    title: {
                        value: null
                    }
                }
            })
            .state('forgot', {
                url: '/forgot/:redirectValue',
                templateUrl: 'app/account/forgot.html',
                controllerAs: 'forgot',
                controller: 'ForgotCtrl',
                params: {
                    redirectValue: {
                        value: null
                    }
                }
            })
            .state('forgot_confirmation', {
                url: '/forgot_confirmation',
                templateUrl: 'app/account/forgot_confirmation.html'
            })
            .state('confirmation', {
                url: '/confirmation',
                templateUrl: 'app/account/confirmation.html'
            })
            .state('login', {
                url: '/login/:redirectValue',
                templateUrl: 'app/account/login.html',
                controllerAs: 'login',
                controller: 'LoginCtrl',
                params: {
                    redirectValue: {
                        value: null
                    }
                }
            })           
            .state('otc', {
                url: '/otc/:send',
                templateUrl: 'app/account/otc.html',
                controllerAs: 'vm',
                controller: 'LoginOTCCtrl',
                params: {
                    send: {
                        value: 'start'
                    }
                }
            });


        //$urlRouterProvider.otherwise('/main');
        $urlRouterProvider.otherwise(function ($injector, $location) {
            if ($location.$$path === '/logout') {                
                var AutenticationService = $injector.get('AutenticationService');
                AutenticationService.clearTokens();
            }
            
            $location.path('/main');
            
        });
    }
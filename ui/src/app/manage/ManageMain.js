// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function ManageMainCtrl($scope, ManagerService) {


    var vm = this;
    vm.stats = ManagerService.stats;
}
angular
    .module('auth2factor.controllers')
    .controller('ManageMainCtrl', ManageMainCtrl);
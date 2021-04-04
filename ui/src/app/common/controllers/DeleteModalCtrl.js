/*global $:true*/
function DeleteModalCtrl(_, $scope, $log, $window, $state) {

    var vm = this;
    var formDefaults = {};
    
    vm.displayLabel = $scope.$parent.label;
    vm.closeLabel = $scope.$parent.closeLabel;
    vm.confirmLabel = $scope.$parent.confirmLabel;
    vm.displayQuestion = $scope.$parent.question;
}
angular
    .module('auth2factor.controllers')
    .controller('DeleteModalCtrl', DeleteModalCtrl);
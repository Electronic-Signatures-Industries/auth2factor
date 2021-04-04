// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/

function GridToolbarCtrl($scope) {
  var vm = this;
    
    vm.pullData = function() {
      vm.refresh();    
    };
    
    vm.applyGlobalSearch = function () {
      var term = vm.globalSearchTerm;
      vm.source.filter({ $: term });
      vm.source.reload();
    }; 
    
    $scope.$watch('vm.globalSearchTerm', function(current) { 
        vm.applyGlobalSearch();
    });    
}
angular
  .module('auth2factor.controllers')
  .controller('GridToolbarCtrl', GridToolbarCtrl);
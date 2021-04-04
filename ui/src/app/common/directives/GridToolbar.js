// http://toddmotto.com/opinionated-angular-js-styleguide-for-teams/
/*global $:true*/

function GridToolbar(_) {

  return {
    restrict: 'A',
    templateUrl: 'app/common/directives/GridToolbar.html',
    scope: {
      source: '=',
      refresh: '='
    },
    transclude: true,
    controller: 'GridToolbarCtrl',
    controllerAs: 'vm',
    bindToController: true,
    link: {
      pre: function ($scope, $element, $attrs, controller) {
        // var vmItems = $scope.vm.

      },
      post: function ($scope, $element, $attrs, controller) {

      }
    }
  };
}

angular
  .module('auth2factor.directives')
  .directive('gridToolbar', GridToolbar);
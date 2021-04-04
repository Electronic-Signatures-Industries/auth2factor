function MasterCtrl($scope,$location, $cookieStore, ManagerService) {
    

    if ($location.$$absUrl.indexOf('/dashboard') > 0) {
        ManagerService.getStats().then(function(response) {
            $scope.stats = response.stats;
        });
    }

    
    
    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };
    
    $scope.notifications = {};
    $scope.invalidNotification = false;

    var index = 0;
    $scope.addGrowler = function(notification, options){
      var i;
      options = options || {};
      if (!options.isError) {
          options = {
              isError: false,
              isSuccess: true
          }
      }

      if(!notification){
        $scope.invalidNotification = true;
        return;
      }

      i = index++;
      $scope.invalidNotification = false;
      $scope.notifications[i] = _.extend(notification, options);
    };    
    
    $scope.$on('af:growler:add', function(event, args) {
        $scope.addGrowler(args.notification, args.options);
    });    
}

angular
    .module('auth2factor.controllers')
    .controller('MasterCtrl', MasterCtrl);
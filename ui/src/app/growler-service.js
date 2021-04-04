function GrowlerService($rootScope, _) {

    var index = 0;
    var renderGrowler = function renderGrowler($scope, notification, options) {
        var i;
        options = options || {};
        $scope.notifications = $scope.notifications || {};
        $scope.invalidNotification = $scope.invalidNotification || false;
        if (!options.isError) {
            options = {
                isError: false,
                isSuccess: true
            };
        }

        if (!notification) {
            $scope.invalidNotification = true;
            return;
        }

        i = index + 1;
        $scope.invalidNotification = false;
        $scope.notifications[i] = _.extend(notification, options);
    };

    GrowlerService.renderGrowler = renderGrowler;

    return GrowlerService;
}

angular
    .module('auth2factor.services')
    .factory('GrowlerService', GrowlerService);
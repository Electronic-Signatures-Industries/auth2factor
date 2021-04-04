function YearRangeService($log, $filter, _) {

  YearRangeService.getRange = function(fromIndex, toIndex, callback) {
    var yearRange = [];
    var year = parseInt($filter('date')(new Date(), 'yyyy'), 10);
    for (var i=(year - fromIndex);i<(year + toIndex);i++) {
      yearRange.push({ value: i, description: i });
    }
    callback(yearRange);
  };
   
   return YearRangeService;
}

angular
  .module('auth2factor.services')
  .factory('YearRangeService', YearRangeService);
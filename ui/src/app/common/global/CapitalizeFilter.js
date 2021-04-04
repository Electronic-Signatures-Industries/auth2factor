function CapitalizeFilter() {
  return function(input, all) {
    return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt) { 
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
}


angular
  .module('auth2factor.global')
  .filter('capitalize', CapitalizeFilter);
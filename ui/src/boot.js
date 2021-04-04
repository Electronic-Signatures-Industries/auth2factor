'use strict';  
// load the main app file
var appModule = require('./app');
// replaces ng-app="appName"
angular.element(document).ready(function () {  
  angular.bootstrap(document, ['auth2factor'], {
    //strictDi: true
  });
});

require('angular'); 
require('angular-mocks');

require('../source/specs/app');
var appContext = require.context('../source/specs', true, /\.js/);
appContext.keys().forEach(appContext);

appContext = require.context('../source/shared', true, /\.js/);
appContext.keys().forEach(appContext);

appContext = require.context('../source/components', true, /\.js/);
appContext.keys().forEach(appContext);


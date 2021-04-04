var setRunPhaseDefaults = function (ngTableDefaults) {
    ngTableDefaults.params.count = 5;
    ngTableDefaults.settings.counts = [];
};
angular
    .module('auth2factor')
    .run(setRunPhaseDefaults);
module.exports = (dbLogger) => [{
    name: 'logInfo',
    method: function (options, next) {
        options.tag = 'info';
        return dbLogger.log(options, next);
    }
}, {
    name: 'logError',
    method: function (options, next) {
        options.tag = 'error';
        return dbLogger.log(options, next);
    }
}, {
    name: 'logger',
    method: function (options, next) {
        return dbLogger.log(options, next);
    }
}];
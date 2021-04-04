module.exports = (logger, ConfigModel, justMail, otcMe) => [{
    name: 'sendToken',
    method: function (options, next) {
        ConfigModel.get({
            key: 'default:system:env'
        }, function (err, config) {
            if (err) {
                logger.error(err);
            }
            options.fixedTransport = config.settings.resetConfirmCodeTransport;
            return otcMe.tokenMe(options, next);
        });

    }
}, {
    name: 'sendConfirmation',
    method: function (options, next) {
        ConfigModel.get({
            key: 'default:system:env'
        }, function (err, config) {
            if (err) {
                logger.error(err);
            }
            options.tokenExpiration = config.settings.confirmationTokenTimeout;
            options.fixedTransport = config.settings.emailTransport;
            return justMail.sendConfirmation(options, next);
        });

    }
}, {
    name: 'sendReset',
    method: function (options, next) {
        ConfigModel.get({
            key: 'default:system:env'
        }, function (err, config) {
            if (err) {
                logger.error(err);
            }
            options.tokenExpiration = config.settings.confirmationTokenTimeout;
            options.fixedTransport = config.settings.emailTransport;
            return justMail.sendReset(options, next);
        });
    }
}, {
    name: 'getProfileToken',
    method: function (options, next) {
        ConfigModel.get({
            key: 'default:system:env'
        }, function (err, config) {
            if (err) {
                logger.error(err);
            }
            options.tokenExpiration = config.settings.confirmationTokenTimeout;

            return justMail.getProfileToken(options, next);
        });
    }
}];
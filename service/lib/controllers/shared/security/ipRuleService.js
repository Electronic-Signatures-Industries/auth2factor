class IPRuleService {
    /**
     * Verifies an IP address is restricted by an API key configuration
     * @param {object} apiConfig - API Config model
     * @param {object} request - Hapi request
     */
    hasValidIpAddress(apiConfig, request) {
        'use strict';
        let ip = (request.connection && request.connection.remoteAddress) ||
         request.headers['x-forwarded-for'];

        if (!apiConfig) {
            return false;
        }
        // console.log(request.headers);
        // how to test ?
        //  && apiConfig.settings.value === request.headers['x-real-ip']
        console.log('IP match: ' + apiConfig.ip + ' = ' + ip);
        let ipCheck = false;
        if (apiConfig.ip === '0.0.0.0') {
            ipCheck = true;
        } else {
            ipCheck = (ip === apiConfig.ip);
        }

        return ipCheck;
    }

}

module.exports = IPRuleService;
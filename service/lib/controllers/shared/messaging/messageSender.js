const TransportService = require('./transports');
class MessageSender {

    static hasTransport(key) {
        return TransportService.has(key);
    }

    static withTransport(key) {
        const transport = TransportService.get(key);
        if (transport) {
            return transport();
        } else {
            throw new Error('Missing transport type');
        }

    }
}

module.exports = MessageSender;
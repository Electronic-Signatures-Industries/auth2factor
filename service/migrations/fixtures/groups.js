module.exports = [
    {
        group: 'users',
        deletable: false,
        transport: {
            id: 'sms:twilio:demo'
        },
        adapter: {
            id: 'db:adapter'
        },
        created: new Date()
    },
    {
        group: 'admins',
        deletable: false,
        transport: {
            id: 'DEMO:sendgrid'
        },
        adapter: {
            id: 'db:adapter'
        },
        created: new Date()
    }
];
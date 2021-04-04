var demo ={"Licensed To":"auth2factor","Company":"dss","Number of Users Licensed":20,"Generated":"2016-03-12T23:26:30.642Z","Key":"JxYCcLk3bBFEY+UUe89hwvi4ZKBPV20VLLyjtoVzEtrKBte3POWE8l/BAuk2c9gegTEBI9A4WvHUMXXWys+tyzzlgac/m7OTqLofpO5+AIcZ5yKMP0R4NV0tvjmwNePTivghAXxhE9v97xFwNuGp1TYYegJqih49yYOIYAznGG0="};

var fixtures = [
    {
        key: 'default:system:env',
        description: 'default system transports',
        created: new Date(),
        settings: {
            emailTransport: 'DEMO:sendgrid',
            resetConfirmCodeTransport: 'DEMO:sendgrid',
            confirmationTokenTimeout: 1800
        }
    },
    //    {
    //        key: 'apikey:test',
    //        description: 'api key',
    //        created: new Date(),
    //        entity: 'apikey',
    //        settings: {
    //            ip: 'localhost'
    //        }
    //    },
    //    {
    //        entity: 'transport',
    //        key: 'sms:twilio:demo',
    //        description: 'Demostración - Twilio',
    //        entityId: 'sms:twilio',
    //        created: new Date(),
    //        settings: {
    //            token: '5459861df4d3e79c619e5bda37a69b52',
    //            fromNumber: "+15127954993",
    //            SID: "AC462e2ce274a7aaf8c859cdbea97987f3"
    //        }
    //    },
    //    {
    //        entity: 'adapter',
    //        key: 'ldap:demo',
    //        description: 'Demo ldap',
    //        entityId: 'ldap:ldap',
    //        created: new Date(),
    //        settings: {
    //            url: 'ldap://WIN-6H5SIVUC0FV.app.local',
    //            baseDN: 'dc=app,dc=local',
    //            username: 'Administrador@app.local',
    //            password: 'Admin11'
    //        }
    //    },
    {
        entity: 'transport',
        key: 'DEMO:sendgrid',
        description: 'Demostración - Sendgrid',
        entityId: 'email:sendgrid',
        deletable: false,
        created: new Date(),
        settings: {
            user: "autentifactor",
            apiKey: "af2f@2015"
        }
    },
    {
        key: 'license',
        description: 'Licencia de 20 usuarios',
        deletable: false,
        created: new Date(),
        settings: {
            license: JSON.stringify(demo)
        }
    },
    {
        entity: 'adapter',
        key: 'db:adapter',
        description: 'Sistema',
        entityId: 'default',
        created: new Date(),
        deletable: false,
        settings: {}
    }
];

module.exports = fixtures;

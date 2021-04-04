/*eslint-env node*/
/*globals describe: true, jasmine:true, expect:true, it: true, xit: true*/

var Hapi = require('hapi');
var server = require('./../../../lib/hapi');

describe("Management - Activate App", () => {
    it("should return OK", (done) => {
        server.inject({
            method: 'GET',
            url: '/api/health'
        }, (res) => {
            expect(res.statusCode).toBe(200);
            done();
        });
    });

    describe('Activation', () => {
        var license;
        var action;

        beforeEach(() => {
            license = JSON.stringify({
    "Licensed To": "Autentifactor",
    "Company": "Autentifactor",
    "Number of Users Licensed": 10,
    "Key": "EkvJXl9HVhRShU4sh9gRp32AGfwswXzoP/Lu8YFr7h7NKdH+OFw7k7E82M9NBOTjIEqVO2yshk5NH/WudydOeHBxiP0IzZZ3duxObsRKsUx9Jr68ttYa8uvXolb6aQEBrwaczvj9fzQmCjp1zn9aMQcluqO6XdF0cWSDFZQ8pFg="
});
            action = {
                "type": "activation",
                "admin": {
                    "email": "jjzcru@gmail.com",
                    "cellphone": "62489146",
                    "password": "0123456789"
                },
                "configs": [
                    {
                        "entity": "transport",
                        "key": "DEMO:sendgrid",
                        "description": "Demo acct de Sendgrid",
                        "entityId": "email:sendgrid",
                        "settings": {
                            "user": "autentifactor",
                            "apiKey": "m1n4d2d42015"
                        }
                    }
                ]
            };
        });


        describe('activating app', () => {

            it("should return OK - POST /activate", (done) => {
                var data = {
                    license: JSON.parse(license),
                    actionConfig: action
                };

                server.inject({
                    method: 'POST',
                    payload: data,
                    url: '/api/v1/management/activate'
                }, (res) => {
                    //expect(res.headers['set-cookie']).not.toBe(null);
                    expect(res.statusCode).toBe(201);
                    // expect(res.result).toBe({});
                    done();
                });
            });

        });
    });
});
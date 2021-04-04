/*globals expect:true*/

var Smtp = require('../lib/smtp');

describe("SMTP Sender", () => {

    describe('SMTP', () => {
        let smtp = new Smtp({}, {
            error: function () {}
        });
        let options1 = {};
        let options2 = {};
        let options3 = {};

        beforeEach(() => {
            options1 = {
                host: 'mail.cableonda.net',
                port: 587,
                secure: false,
                user: 'test@cableonda.net',
                password: '0123456789'
            };

            options2 = {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                user: '_x_@gmail.com',
                password: ''
            };
            
            options3 = {
                host: 'smtp-mail.outlook.com',
                port: 587,
                secure: false,
                tls: true,
                user: '_y_@outlook.com',
                password: ''
            };            
        });


        it("should try to send email and fail", (done) => {
            smtp.send({
                email: 'admin@auth2factor.com',
                subject: 'Test',
                textBody: 'Test',
                htmlBody: '<h1>A</h1>',
                transportCredentials: options1
            }, function (err, resp) {
                expect(err.message).toBe('UNABLE_TO_VERIFY_LEAF_SIGNATURE');
                //expect(resp).toBe({});
                done();
            });
        });

//        it("should try to send email thru Outlook.com and succeed", (done) => {
//            smtp.send({
//                email: 'molekilla@gmail.com',
//                subject: 'Test',
//                textBody: 'Test',
//                htmlBody: '<h1>A</h1>',
//                transportCredentials: options3
//            }, function (err, resp) {
//                expect(resp).toBe({});
//                done();
//            });
//        });
        
        // Read: http://stackoverflow.com/questions/26948516/nodemailer-invalid-login
        //        it("should try to send email thru Gmail and succeed", (done) => {
        //            smtp.send({
        //                email: 'admin@autentifactor.com',
        //                subject: 'Test',
        //                textBody: 'Test',
        //                htmlBody: '<h1>A</h1>',
        //                transportCredentials: options2
        //            }, function(err, resp) {
        //                expect(resp).toBeTruthy();
        //                done();
        //            });
        //        });

    });
});
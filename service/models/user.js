var encrypt = require('mongoose-encryption');
var OTP = require('otp.js');
var bcrypt = require('bcrypt-nodejs');
var debug = require('debug')('models:user');

module.exports = (Mongoose) => {
    'use strict';
    let Schema = Mongoose.Schema;
    let User = new Schema({
        email: {
            type: String,
            required: true
        },
        ldapAccount: {
            type: String
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        cellphone: {
            type: Number
        },
        group: {
            type: String,
            default: 'users'
        },
        otcSecret: {
            type: String
        },
        password: {
            type: String,
            required: true
        },
        preferSoftToken: {
            type: Boolean,
            default: false
        },
        hasEmailConfirmed: {
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletable: {
            type: Boolean,
            default: true
        },        
        inactive: {
            type: Boolean,
            default: false
        },
        pushDeviceUuid: {
            type: String
        },
        pushDeviceName: {
            type: String
        },
        pushDeviceEndpoint: {
            type: String
        },
        created: {
            type: Date,
            required: true,
            default: Date.now
        },
        updated: {
            type: Date,
            required: false,
            default: Date.now
        }
    });

    User.plugin(encrypt, {
        secret: process.env.MONGOOSE_SECRET,
        encryptedFields: ['otcSecret']
    });

    User.statics.generateGAEncoding = function () {
        var GA = OTP.googleAuthenticator;

        return GA.secret();
    };

    User.statics.generateHash = function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    User.method({
        validPassword: function (password) {
            return bcrypt.compareSync(password, this.password);
        },
        verifyOTC: function (code) {
            var GA = OTP.googleAuthenticator;
            // window = 6
            return GA.verify(code, this.otcSecret, 6);
        },
        generateQRSeed: function (issuer) {
            if (!issuer) {
                throw new Error('Missing issuer');
            }
            var GA = OTP.googleAuthenticator;
            var seed = GA.secret();
            
            var list = seed.split('');
            var visibleCode = '';
            
            for (var i=0;i<list.length;i++) {
                visibleCode += list[i].toLowerCase();
                
                if (i % 3 === 0 && i !== 0) {
                    visibleCode += ' ';
                }                
            }
            
            return {
                qr: GA.qrCode(this.email, issuer, seed),
                seed: seed,
                visibleCode: visibleCode.trim()
            };
        },
        getOTCConfig: function (issuer) {
            if (!issuer) {
                throw new Error('Missing issuer');
            }
            return 'otpauth://totp/' + issuer + ':' + this.email + '?secret=' + this.otcSecret + '&issuer=' + issuer;
        },
        getOTC: function () {
            var GA = OTP.googleAuthenticator;
            // GA Code from server
            var otpCode = '0';
            try {
                // generate otp for base 32 encoded user secret
                otpCode = GA.gen(this.otcSecret);
                debug('OTP: ' + otpCode);
                return otpCode;
            } catch (otpError) {
                debug(otpError);
                return null;
            }
        }
    });


    User.statics.confirm = function (options, callback) {
        var self = this;
        this.findOne({
            inactive: false,
            email: options.email
        }, function (err, user) {

            if (err) {
                callback(err);
                return;
            }

            if (user) {
                // hasEmailConfirmed = true
                user.hasEmailConfirmed = true;
                user.updated = new Date();
                user.save();
                callback(null, user);
                return;

            } else {
                // no user found
                callback(new Error('No user found'), null);
                return;
            }

        });

    };

    User.statics.enroll = function (options, callback) {
        var self = this;
        this.findOne({
            email: options.email
        }, function (err, user) {

            if (err) {
                callback(err);
                return;
            }

            if (user) {
                callback(null, null);
                return;

            } else {

                var newUser = {
                    email: options.email,
                    cellphone: options.cellphone,
                    ldapAccount: options.ldapAccount || '',
                    firstName: options.firstName || '',
                    lastName: options.lastName || '',
                    inactive: false,
                    group: options.group,
                    hasEmailConfirmed: !options.hasConfirmation,
                    otcSecret: self.generateGAEncoding(),
                    password: self.generateHash(options.password)
                };

                self.create(newUser, function (err) {
                    if (err) {
                        return callback(err);
                    }

                    return callback(null, newUser);
                });
            }

        });

    };

    User.statics.modify = function (options, callback) {
        var self = this;
        this.findOne({
            email: options.email
        }, function (err, user) {

            if (err) {
                callback(err);
                return;
            }

            if (user) {
                debug(options);
                if (options.group) {
                    user.group = options.group;
                }

                if (options.cellphone) {
                    user.cellphone = options.cellphone;
                }

                if (options.ldapAccount) {
                    user.ldapAccount = options.ldapAccount;
                }

                if (options.lastName) {
                    user.lastName = options.lastName;
                }

                if (options.firstName) {
                    user.firstName = options.firstName;
                }

                if (options.otcSecret) {
                    user.otcSecret = options.otcSecret;
                }

                if (options.password) {
                    user.password = self.generateHash(options.password);
                }


                user.inactive = options.inactive;
                if (options.preferSoftToken !== null) {
                    user.preferSoftToken = options.preferSoftToken;
                }

                user.updated = new Date();
                user.save(function (err) {
                    return callback(null, user);                                    
                });

            } else {
                // no user found
                callback(new Error('No user found'), null);
                return;
            }

        });

    };

    User.statics.modifyPushDevice = function (options, callback) {
        var self = this;
        this.findOne({
            email: options.email
        }, function (err, user) {

            if (err) {
                callback(err);
                return;
            }

            if (user) {
                user.pushDeviceUuid = options.pushDeviceUuid;
                user.pushDeviceName = options.pushDeviceName;
                user.pushDeviceEndpoint = options.pushDeviceEndpoint;
                user.updated = new Date();
                user.save(function (err) {
                    debug(user);
                    return callback(null, user);                    
                });


            } else {
                // no user found
                callback(new Error('No user found'), null);
                return;
            }

        });

    };
    Mongoose.model('User', User);
};

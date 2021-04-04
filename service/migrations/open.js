var migrationOpts = require('../migrationOptions').mongo;
var _ = require('underscore');
var mongodb = require('mongodb');
var Mongoose = require('mongoose');
var debug = require('debug');


exports.openConnection = function () {
    var uri;
    if (migrationOpts.password) {
        uri = 'mongodb://' + migrationOpts.username + '@' + migrationOpts.password + ':' + migrationOpts.host + '/' + migrationOpts.db + ':' + migrationOpts.port;
    } else {
        uri = 'mongodb://' + migrationOpts.host + '/' + migrationOpts.db; // + ':' + migrationOpts.port;
    }

        Mongoose.connect(uri);
        Mongoose.connection.on('error', function (err) {
            console.log('Mongoose connection error:' + err);
        });

        Mongoose.connection.on('disconnected', function () {
            console.log('Mongoose disconnected');
            Mongoose.connect(uri);
        });
    
    
    return Mongoose;
}
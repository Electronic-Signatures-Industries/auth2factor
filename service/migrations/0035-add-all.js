let _ = require('underscore');
let mongodb = require('mongodb');
let Mongoose = require('mongoose');
let debug = require('debug');
let openDb = require('./open');

let configs = require('./fixtures/configs');
let users = require('./fixtures/users');
let groups = require('./fixtures/groups');
let adapters = require('./fixtures/adapters');
let protocols = require('./fixtures/protocols');
let transports = require('./fixtures/transports');

exports.up = function (db, next) {

    Mongoose = openDb.openConnection();

    require('../models/adapter')(Mongoose);
    let AdapterModel = Mongoose.models.Adapter;
    
    require('../models/user')(Mongoose);
    let UserModel = Mongoose.models.User;

    require('../models/config')(Mongoose);
    let ConfigModel = Mongoose.models.Config;

    require('../models/group')(Mongoose);
    let GroupModel = Mongoose.models.Group;
    
    require('../models/protocol')(Mongoose);
    let ProtocolModel = Mongoose.models.Protocol;    
    
    require('../models/transport')(Mongoose);
    let TransportModel = Mongoose.models.Transport;    
    
    Mongoose.connection.on('connected', function () {
        _.each(adapters, function (item) {
            let model = new AdapterModel(item);

            model.save(function (err, model) {
                if (err) console.log(err);
            });
        });
        
        _.each(protocols, function (item) {
            let model = new ProtocolModel(item);

            model.save(function (err, model) {
                if (err) console.log(err);
            });
        });
        
        _.each(transports, function (item) {
            let model = new TransportModel(item);

            model.save(function (err, model) {
                if (err) console.log(err);
            });
        });
        
        _.each(groups, function (item) {
            let model = new GroupModel(item);

            model.save(function (err, model) {
                if (err) console.log(err);
            });
        });

        _.each(configs, function (item) {
            let model = new ConfigModel(item);

            model.save(function (err, model) {
                if (err) console.log(err);
            });
        });

        if (users.length === 0) {
            next();
        }
        
        _.each(users, function (admin) {
            let newUser = new UserModel({
                email: admin.email,
                cellphone: admin.cellphone,
                firstName: admin.firstName || '',
                lastName: admin.lastName || '',
                role: admin.role,
                group: admin.group,
                deletable: admin.deletable,
                hasEmailConfirmed: !admin.hasEmailConfirmed,
                otcSecret: UserModel.generateGAEncoding(),
                password: UserModel.generateHash(admin.password)
            });

            newUser.save(function (err, model) {
                console.log(err);
                console.log(newUser);
                next();
            });
        });

    });
};


exports.down = function (db, next) {
  let adapters = mongodb.Collection(db, 'adapters');
  adapters.remove(next);

  let protocols = mongodb.Collection(db, 'protocols');
  protocols.remove(next);

  let transports = mongodb.Collection(db, 'transports');
  transports.remove(next);

  let groups = mongodb.Collection(db, 'groups');
  groups.remove(next);

  let users = mongodb.Collection(db, 'users');
  users.remove(next);

  let configs = mongodb.Collection(db, 'configs');
  configs.remove(next);

  let systems = mongodb.Collection(db, 'systems');
  systems.remove(next);
  //next();
};
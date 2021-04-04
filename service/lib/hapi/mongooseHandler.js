const path = require('path');
const _ = require('underscore');

let MongooseHandler = function MongooseHandler() {
  return this;
};

MongooseHandler.bindModels = function(options) {
  options = options || {};
  
  if (options && !options.modelsPath) {
    throw new Error('Missing modelsPath option');
  }
  
  if (options && !options.mongoose) {
    throw new Error('Missing mongoose option');
  }
  
  let fs = require('fs');
  let modelPath = options.modelsPath;

  fs.readdirSync(modelPath).forEach(function(key) {
    let schema = require(path.join(modelPath, key));
    schema(options.mongoose);
  });
};

MongooseHandler.bindEvents = function(mongoose) {
  if (!mongoose) {
    throw new Error('Missing mongoose client');
  }
  
  let self = this;
  mongoose.connection.on('connected', function() {
    
    _.each(mongoose.connections, function(connection) {
      console.log('Mongoose connected to ' + connection.host + ':' + connection.port);
    });

  });

  mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error:' + err);
  });

  mongoose.connection.on('disconnected', function() {
    console.log('Mongoose disconnected');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      console.log('Mongoose disconnected through application termination');
      process.exit(0);
    });
  });


};

module.exports = MongooseHandler;

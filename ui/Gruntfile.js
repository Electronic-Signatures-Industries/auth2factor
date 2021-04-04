module.exports = function (grunt) {
  var config= require('./grunt.config')(grunt);

  require('time-grunt')(grunt);
  require('load-grunt-config')(grunt, config);

  //
  // Default tasks
  //
  var Tasks = require('./grunt.tasks');

  Tasks(grunt, config);

};
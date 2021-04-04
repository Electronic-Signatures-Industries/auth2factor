  var path = require('path');
  module.exports = function (grunt) {
      return {
          configPath: path.join(process.cwd(), './grunt'), //path to task.js files, defaults to grunt dir
          init: true, //auto grunt.initConfig
          data: {
              devEnvironment: {
                  distFolder: 'dist'
              },
              deploySettings: {
                  ruthaDeploy: '/home/rogelio/Code/a2f/a2f-deploy',
                  playbook: '~/Code/a2f/a2f-deploy/provisioning/playbook.yml',
                  hosts: {
                      production: {
                          name: 'aws_a2f',
                          sshKey: '~/Dropbox/kys/auth2factor.pem',
                          remoteUser: 'ubuntu'
                      },
                      staging: {
                          name: 'staging',
                          sshKey: '~/Dropbox/kys/auth2factor.pem',
                          remoteUser: 'ubuntu'
                      },
                      vagrant: {
                          name: 'all',
                          remoteUser: 'vagrant'
                      }
                  }
              },
              bowerConcat: {
                  exclude: ['angular', 'jquery'],
                  dependencies: null
              },
              nodeInspector: {
                  webPort: 8082,
                  debugPort: 5859
              },
              //            nodemon: {
              //                args: ['--debug']
              //            },
              ngTemplates: {
                  moduleNamespace: 'auth2factor.templates'
              },
              wiredepConfig: {
                  src: ['views/**/*.html'],
                  options: {
                      cwd: process.cwd()
                  }
              },
              // DEPRECATED !!!
              releaseInclude: {
                  css: ['dist/assets/css/styles.css']
              },
              cwd: process.cwd(),
              pkg: grunt.file.readJSON('package.json')
          },
          jitGrunt: {
              staticMappings: {
                  protractor: 'grunt-protractor-runner',
                  ngAnnotate: 'grunt-ng-annotate',
                  ngtemplates: 'grunt-angular-templates',
              }
          }
      };
  };
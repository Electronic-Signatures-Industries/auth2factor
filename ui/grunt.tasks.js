  var Help = {
    serve: 'Serves frontend service with no auto reload',
    spec: 'Runs jshint and server side / Karma - Jasmine specs',
    test: 'Runs E2E/Functional tests (Angular)',
    build: 'Prepares UI assets for release',
    jshinting: 'Verifies javascript using jshint',
    postinstall: 'Postinstall grunt shell script',
    staging: 'Provisions a local staging VM',
    deploy: 'Provisions a new deployment or updates existing'
  };

module.exports = function (grunt, options) {
    // https://github.com/gruntjs/grunt/issues/992

    grunt.registerTask('checkProvision', function () {
      // if (grunt.option('ack') !== true) { return true; }
      var done = this.async();
      var readline = require('readline');
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Do you want to provision staging? (Y/n)', function (answer) {
        rl.close();
        if (answer.toLowerCase() === 'n') {
          done(false);
        } else {
          done();
        }
      });
    });

    grunt.registerTask('checkDeployment', function () {
      // if (grunt.option('ack') !== true) { return true; }
      var done = this.async();
      var readline = require('readline');
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Do you want to deploy? (Y/n)', function (answer) {
        rl.close();
        if (answer.toLowerCase() === 'n') {
          done(false);
        } else {
          done();
        }
      });
    });

    grunt.registerTask('stagelocal', Help.staging, ['shell:vagrant']);
    grunt.registerTask('staging', Help.staging, ['checkProvision', 'shell:staging']);
    grunt.registerTask('deploy', Help.deploy, ['checkDeployment', 'shell:deploy']);

    grunt.registerTask('postinstall', Help.postinstall, 'shell:postinstall');

    // Default task.
    // runs server side specs and UI specs
    grunt.registerTask('spec', Help.spec, ['preprocess:html', 'shell:jasmine',
      'ngtemplates:specs', 'wiredep:test', 'karma:unit'
    ]);
    // server dev environment no auto refresh
    // grunt.registerTask('serve', Help.serve, ['preprocess:html', 'ngtemplates:dev',
    //   'copy:devCssImages', 'copy:devFonts',
    //   'copy:devImages', 'cssmin:dependencies', 'cssmin:dev', 'copy:devAssets',
    //   'shell:webpackDev' ,'concurrent:dev'
    // ]);

    grunt.registerTask('copy-dev', '', ['copy:devCssImages', 'copy:devFonts',
      'copy:devImages', 'copy:devAssets',]);
    grunt.registerTask('prepare-build', '', ['copy:buildAppMin', 'copy:buildImages', 'copy:buildCssImages', 'copy:buildFonts',
      'copy:copyViews', 'copy:buildFrontEnd', 'copy:buildAssets', 'uglify:webpack', 'compress:build']);      
    grunt.registerTask('ngtemplates-dev', '', ['ngtemplates:dev']);
    grunt.registerTask('ngtemplates-build', '', ['ngtemplates:build']);

    // grunt build
    // builds deployment assets
    // grunt.registerTask('build', Help.build, ['preprocess:html', 'ngtemplates:build', 'copy:buildImages', 'copy:buildCssImages', 'copy:buildFonts',
    //   'copy:copyViews', 'copy:buildFrontEnd',
    //   'uglify:build', 'uglify:buildDependencies',
    //   'cssmin:build', 'cssmin:buildDependencies', 'copy:buildAssets', 'compress:build'
    // ]);

    // runs functional tests
    grunt.registerTask('test', Help.test, ['concurrent:test']);

    // verfies javascript using jshint
    grunt.registerTask('jshinting', Help.jshinting, ['jshint']);


  };
module.exports = function(config) {
  config.set({

    basePath: '../',

    files: [
      // bower:js
      '../dist/components/jquery/dist/jquery.js',
      '../dist/components/angular/angular.js',
      '../dist/components/angular-sanitize/angular-sanitize.js',
      '../dist/components/angular-messages/angular-messages.js',
      '../dist/components/angular-route/angular-route.js',
      '../dist/components/angular-cookies/angular-cookies.js',
      '../dist/components/underscore/underscore.js',
      '../dist/components/angular-bootstrap/ui-bootstrap-tpls.js',
      '../dist/components/lodash/dist/lodash.compat.js',
      '../dist/components/restangular/dist/restangular.js',
      '../dist/components/bootstrap/dist/js/bootstrap.js',
      '../dist/components/angular-ui/build/angular-ui.js',
      '../dist/components/angular-ui-router/release/angular-ui-router.js',
      '../dist/components/kendo-ui-core/js/kendo.ui.core.min.js',
      '../dist/components/a0-angular-storage/dist/angular-storage.js',
      // endbower
      'test/lib/angular-mocks/angular-mocks.js',
      'app/app.js',
      'app/**/*.js',
      'test/templates.js',
      'test/unit/**/*.js'
    ],

    autoWatch: false,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    //reporters: ['spec'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });

};

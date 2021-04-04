
module.exports = {
  dev: {
    options: '<%= wiredepConfig.options || {} %>',
    src: '<%= wiredepConfig.src %>'
  },
  test: {
    options: '<%= wiredepConfig.options || {} %>',
    devDependencies: true,
    src: '<%= wiredepConfig.karmaConf || "src/test/karma.conf.js" %>',
    ignorePath:  /\.\.\//,
    fileTypes: {
      js: {
        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
        detect: {
          js: /'(.*\.js)'/gi
        },
        replace: {
          js: '\'{{filePath}}\','
        }
      }
    }
  }
};
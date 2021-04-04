module.exports = function(grunt,  options) {
  var bowerOverrides = grunt.file.readJSON(options.cwd + '/bower.json').overrides;
  var keys = Object.keys(bowerOverrides);
  var overrideFiles = {};

  for (var i=0;i<keys.length;i++) {
    var key = keys[i];
    overrideFiles[key] = bowerOverrides[key].main;
  }
  
  return {
  
    dev: {
      'js': options.cwd + '/<%= devEnvironment.distFolder || "dist" %>/js/deps.js',
      'css': options.cwd + '/<%= devEnvironment.distFolder || "dist" %>/css/deps.css',
      exclude: options.bowerConcat.exclude || [],
      mainFiles: overrideFiles
    },
    
    build: {
      'js': options.cwd + '/releases/v' + options.pkg.version + '/ui/dist/js/deps.js',
      'css': options.cwd + '/releases/v' + options.pkg.version + '/ui/dist/css/deps.css',
      exclude: options.bowerConcat.exclude || [],
      mainFiles: overrideFiles
    }
  };
};

module.exports = {
  dev: {
    cwd: '<%= cwd %>/src',
    src: 'app/**/*.html',
    dest: '<%= cwd %>/<%= devEnvironment.distFolder || "dist" %>/js/templates.js',
    options: {
      module: '<%= ngTemplates.moduleNamespace %>'
    }
  },    
  specs: {
    cwd: '<%= cwd %>/dist/html/src',
    src: 'app/**/*.html',
    dest: '<%= cwd %>/src/test/templates.js',
    options: {
      module: '<%= ngTemplates.moduleNamespace %>'
    }
  },
  build: {
    cwd: '<%= cwd %>/src',
    src: 'app/**/*.html',
    dest: '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/templates.js',
    options: {
      module: '<%= ngTemplates.moduleNamespace %>',
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: false,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    }
  }
};

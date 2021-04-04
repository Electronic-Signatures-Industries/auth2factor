module.exports = {
  options: {
    singleQuotes: true,
    ngAnnotateOptions: {}
  },
  dev: {
    files: {
      '<%= cwd %>/<%= devEnvironment.distFolder || "dist" %>/js/app.js': ['<%= cwd %>/<%= devEnvironment.distFolder || "dist" %>/js/app.js']
    }
  },
  build: {
    files: {
      '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/app.js': ['<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/app.js']
    }
  }
};
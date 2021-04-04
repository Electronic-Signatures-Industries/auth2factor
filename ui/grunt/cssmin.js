module.exports = {
    dependencies: {
      cwd: '<%= cwd %>',
      files: {
        '<%= devEnvironment.distFolder || "dist" %>/css/deps.min.css': ['<%= devEnvironment.distFolder || "dist" %>/css/deps.css']
      }
    },  
    dev: {
      cwd: '<%= cwd %>',
      files: {
        '<%= devEnvironment.distFolder || "dist" %>/css/app.min.css': ['src/app/**/*.css']
      }
    },
    buildDependencies: {
      cwd: '<%= cwd %>',
      files: {
        'releases/v<%= pkg.version %>/ui/dist/css/deps.min.css': ['dist/css/deps.css']
    }
    },
    build: {
      cwd: '<%= cwd %>',
      files: {
        'releases/v<%= pkg.version %>/ui/dist/css/app.min.css': ['src/app/**/*.css']
      }
    }
};
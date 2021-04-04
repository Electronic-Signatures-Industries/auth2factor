module.exports = {
  dev: {
    options: {
      sourceMap: true,
      sourceMapIncludeSources: true,
      sourceMapName: '<%= cwd %>/dist/js/sourcemap.map',
      mangle: false
    },
    files: {
      '<%= cwd %>/dist/js/app.js': ['<%= cwd %>/dist/js/app.js']
    }
  },
  webpack: {
    options: {
      compress: true,
      mangle: false,
    },
    files: [{
      expand: true,
      cwd: '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist',
      src: '*.js',
      dest: '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist'
    }]
  },
  devIonic: {
    options: {
      sourceMap: true,
      sourceMapIncludeSources: true,
      sourceMapName: '<%= cwd %>/www/js/sourcemap.map',
      mangle: false
    },
    files: {
      '<%= cwd %>/www/js/app.js': ['<%= cwd %>/www/js/app.js']
    }
  },
  buildDependencies: {
    options: {
      mangle: false
    },
    files: {
      '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/deps.min.js': ['<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/deps.js']
    }
  },
  build: {
    options: {
      mangle: false
    },
    files: {
      '<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/app.min.js': ['<%= cwd %>/releases/v<%= pkg.version %>/ui/dist/js/app.js']
    }
  }
};
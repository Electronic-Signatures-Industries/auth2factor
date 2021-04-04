module.exports = {
  build: {
    options: {
      archive: 'releases/v<%= pkg.version %>.zip',
      mode: 'zip'
    },
    files: [
      {
        cwd: '<%= cwd %>/releases/v<%= pkg.version %>/',
        src: ['**'], 
        expand: true
      }
    ]
  }  
};
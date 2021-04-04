module.exports = {
  html: {
    expand: true,
    cwd: '<%= cwd %>',
    src: ['src/app/**/*.html', '!src/app/index.html'],
    dest: '<%= devEnvironment.distFolder || "dist" %>/html/'
  }    
};

module.exports = {
  dev: {
    script: '<%= cwd %>/lib/hapi/index.js',
    options: {
      delay: '<%= nodemon.delay || 900 %>',
      nodeArgs: '<%= nodemon.args || [] %>',
      env: {
        PORT: '<%= nodeInspector.debugPort %>',
        DEBUG: '*'
      }
    }
  }
};
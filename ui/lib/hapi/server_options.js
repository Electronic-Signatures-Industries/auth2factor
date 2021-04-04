module.exports = {
    engines: {
      'html': {
        compile: require('./underscore_compiler')
      }
    },
//    layout: true,
//    layoutPath: __dirname + '/../../views',
//    layout: 'index',
    compileMode: 'sync',
    path: __dirname + '/../../views',
    partialsPath: __dirname + '/../../views/partials'
};



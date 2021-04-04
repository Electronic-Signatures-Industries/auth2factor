module.exports = {
  test: {
    tasks: ['nodemon', 'protractor:run'],
    options: {
      logConcurrentOutput: true,
      limit: 2
    }
  },
  auto: {
    tasks: ['nodemon', 'node-inspector', 'browserSync', 'watch'],
    options: {
      logConcurrentOutput: true,
      limit: 4
    }
  },
  dev: {
    tasks: ['nodemon', 'node-inspector', 'watch'],
    options: {
      logConcurrentOutput: true,
      limit: 3
    }
  }
};

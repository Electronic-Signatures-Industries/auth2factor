       
module.exports = {
  dev: {
    files: [
        {
          expand: true,
          cwd: "<%= cwd %>",
          src: ["lib/**/*.es6"],
          dest: "<%= cwd %>",
          ext: ".js"
        }
    ]
  },
  build: {
    files: [
        {
          expand: true,
          cwd: "<%= cwd %>",
          src: ["lib/**/*.es6"],
          dest: "<%= cwd %>",
          ext: ".js"
        }
    ]
  }
};

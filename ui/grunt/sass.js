module.exports = {
    ionic: {
        cwd: '<%= cwd %>',
        options: {
            sourceMap: false,
            outputStyle: 'compressed'
        },
        files: {
            '<%= devEnvironment.distFolder || "dist" %>/css/ionic.app.css': 'src/app/scss/ionic.app.scss'
        }
    }
};

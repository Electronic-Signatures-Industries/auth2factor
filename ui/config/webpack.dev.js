const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const dev = {
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    devServer: {
        outputPath: './dist',
        contentBase: '.',
        historyApiFallback: true,
        stats: 'minimal'
    },
    proxy: {
        '/': {
            target: 'https://localhost',
            secure: true,
        },
        devtool: "#inline-source-map"
    }
};

module.exports = webpackMerge(commonConfig, dev);
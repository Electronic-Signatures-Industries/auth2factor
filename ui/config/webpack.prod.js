const webpackMerge = require('webpack-merge');
const webpack = require('webpack/lib/webpack');
const commonConfig = require('./webpack.common.js');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const pkg = require('../package');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';
const prod = {
    output: {
        path: `./releases/v${pkg.version}/ui/dist`,
        //publicPath: '/dist',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },
    htmlLoader: {
        minimize: false // workaround for ng2
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        //new webpack.optimize.DedupePlugin(),
        // new ExtractTextPlugin('[name].[hash].css'),
        new ngAnnotatePlugin({
            add: true,
            // other ng-annotate options here
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     drop_debugger: true,
        //     compress: true,
        //     passes: 3,
        //     drop_console: true,
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
    ],
    //devtool: "#inline-source-map"
};

module.exports = webpackMerge(commonConfig, prod);
const webpack = require('webpack/lib/webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: ['./src/boot.js'],
        vendor: './src/vendor.js',
        styles: './src/styles.js'
    },
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            'jQuery': 'jquery',
            '$': 'jquery'
        }),
        new CommonsChunkPlugin({
               name: 'app',
               filename: 'app.bundle.js'
            },
            {
                name: 'vendor',
                filename: 'vendor.bundle.js'
            },
            {
                name: 'styles'
            }),
        // new HtmlWebpackPlugin({
        //     template: './views/index.html',
        //     inject: true,
        // }),
        new ExtractTextPlugin("css/deps.min.css", {
            allChunks: true
        }),
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/)
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.json']
    },
    module: {
        loaders: [
            {test: /src.*\.js$/, loaders: ['ng-annotate?add=true']},
            {
                test: /\.html/,
                exclude: /node_modules/,
                loader: 'raw-loader'
            },
            {
                test: /\.json/,
                loader: 'json'
            },
            {
                test: /\.(gif|jpg|png|jpeg|pdf)$/,
                loader: 'file?name=/assets/images/icon/[name].[hash].[ext]',
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }, {
                test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
                loader: 'file-loader?name=res/[name].[ext]?[hash]'
            }
        ],
    }
};

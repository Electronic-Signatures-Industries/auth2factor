const webpack = require('webpack/lib/webpack');
const test = {
    plugins: [
        new webpack.ProvidePlugin({
           'jQuery': 'jquery',
           '$': 'jquery'
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.json']
    },    
    module: {
        loaders: [
            {
                test: /\.html/,
                exclude: /node_modules/,
                loader: 'raw'
            },
            {
                test: /\.json/,
                loader: 'raw'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            },
            {
                test: /\.css$/,
                loader: 'null'
            }
        ]
    },
    devtool: "#inline-source-map"
};

module.exports = test;
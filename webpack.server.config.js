/**
 * Created by Alexander Sveshnikov on 21/11/16.
 */
var webpack = require('webpack');
var fs = require('fs');
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = (process.env.NODE_ENV || 'development').trim().toLowerCase();
const isProductionMode = NODE_ENV == 'production';
console.log('webpack.server.config.js, isProductionMode:', isProductionMode);

module.exports = {

    entry: './src/server.js',

    output: {
        path: __dirname + '/build',
        filename: 'server.js',
        publicPath: '/'
    },

    target: 'node',

    // keep node_module paths out of the bundle
    externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).reduce(function (ext, mod) {
        ext[mod] = 'commonjs ' + mod;
        return ext
    }, {}),

    node: {
        __filename: true,
        __dirname: true
    },

    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            // {test: /\.css$/, loader: "style!css"},
            // {test: /\.scss$/, loader: "style!css!sass"}
            // {test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css")},
            {test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!sass")},
        ]
    },

    plugins: isProductionMode ? [
        new ExtractTextPlugin('/assets/[name].css'),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {warnings: false},
        })
    ] : [
        new ExtractTextPlugin('/assets/[name].css')
    ]
};
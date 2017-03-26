/**
 * Created by Alexander on 19.11.2016.
 */
var webpack = require('webpack');
var path = require('path');

const NODE_ENV = (process.env.NODE_ENV || 'development').trim().toLowerCase();
const isProductionMode = NODE_ENV == 'production';

// console.log('NODE_ENV', '['+process.env.NODE_ENV+']');
// console.log('NODE_ENV', '['+NODE_ENV+']');
console.log('webpack.config.js, isProductionMode:', isProductionMode);

var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: "/assets/",
        filename: "/assets/bundle.js"
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel'},
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url?name=[name].[ext]'},
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff&name=[name].[ext]'
            },
            {
                test: /\.ttf(\?v=\d+.\d+.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'
            },
            {test: /\.svg(\?v=\d+.\d+.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml&name=[name].[ext]'},
            {test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=[name].[ext]'},
            {test: /\.ico$/, loader: 'file?name=[name].[ext]'},
            {
                test: /\.scss$/, loader: isProductionMode ?
                ExtractTextPlugin.extract("style", "css!sass")
                : "style!css!sass"
            },
            {test: /\.json$/, loader: "json"}
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
    ] : [],

    watchOptions: {
        aggregateTimeout: 100
    },

    cache: true,

    devServer: !isProductionMode ? {
        contentBase: 'build/',
        historyApiFallback: true,
        //open: 'http://localhost:8080/webpack-dev-server/',
    } : null
};
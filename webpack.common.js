const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require("extract-text-webpack-plugin");
//cleanwebpackplugin deletes the dist directory everytime we build
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        'vendor': ['react','react-dom','react-router-dom', '@babel/polyfill'],
        'main': path.resolve(__dirname,'src/index.js')
    },
    output: {
        //[contentHash] means that the filename changes whenever there is a change in code so it doesn't cache every time
        filename: '[name].[contentHash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                    }
                }]
            },
            {
                test: /\.(svg|png|jpg|jpeg|gif)$/,
                use: [ {
                    loader: 'file-loader',
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "images"
                    }
                }]
            },
            {
                test: /\.css$/,
                //ExtractTextPlugin extracts all .css module into separate files
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }

        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new ExtractTextPlugin("styles/main.css")
    ]
}
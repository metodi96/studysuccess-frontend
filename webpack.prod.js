const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    plugins: [
        new UglifyJSPlugin()
    ]
});
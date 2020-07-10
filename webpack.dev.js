const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
    devServer: {
        port: 3000,
        historyApiFallback: true,
    }
});
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const testConfig = require('../config/webpack.test.js');

module.exports = webpackMerge(testConfig, {


});

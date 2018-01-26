const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = function (config) {
    return webpackMerge(commonConfig, {

        devtool: 'inline-source-map',

        module: {
            rules: [
                {
                    test: /\.(txt|pdf)$/,
                    loader: 'file-loader',
                    query: {
                        name: '[path][name].[ext]',
                        outputPath: (url)=> {
                        return url.replace('src', 'dist');
                        }
                    }
                }
            ]
        }
    });
};

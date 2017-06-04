const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    devtool: 'inline-source-map',

    module: {
        rules: [
            {
<<<<<<< HEAD
=======
                enforce: 'post',
                test: /^(?!(.*spec|index|.*mock|.*model|.*event)).*\.ts?$/,
                loader: 'istanbul-instrumenter-loader',
                exclude: [
                    /node_modules/,
                    /test/
                ]
            },
            {
>>>>>>> Source Mapping is not working on test debugging (#1931)
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

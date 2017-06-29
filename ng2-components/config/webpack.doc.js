const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const webpackBuild = require('./webpack.build');

module.exports = webpackMerge(webpackBuild, {

    module: {
        rules: [

            {
                test: /\.ts/,
                loader: 'generate-list-component-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            }
        ]
    }
});

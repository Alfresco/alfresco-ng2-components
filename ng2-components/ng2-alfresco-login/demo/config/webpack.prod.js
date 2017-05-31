const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const alfrescoLibs = [
    'ng2-alfresco-login'
];

module.exports = webpackMerge(commonConfig, {

    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [helpers.root('node_modules')]
    },

    plugins: [
        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    context: `node_modules/${lib}/bundles/assets/` ,
                    from: '**/*',
                    to: `assets/`
                }
            })
        ]),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
            mangle: {
                keep_fnames: true
            },
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');
const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

const alfrescoLibs = [
    'ng2-activiti-analytics',
    'ng2-activiti-diagrams',
    'ng2-activiti-form',
    'ng2-activiti-processlist',
    'ng2-activiti-tasklist',
    'ng2-alfresco-core',
    'ng2-alfresco-datatable',
    'ng2-alfresco-documentlist',
    'ng2-alfresco-login',
    'ng2-alfresco-search',
    'ng2-alfresco-tag',
    'ng2-alfresco-upload',
    'ng2-alfresco-userinfo',
    'ng2-alfresco-viewer',
    'ng2-alfresco-webscript'
];

module.exports = webpackMerge(commonConfig, {

    devtool: 'eval',

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

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                use: ['happypack/loader?id=ts', 'angular2-template-loader'],
                exclude: [/node_modules/, /public/, /resources/, /dist/]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "to-string-loader"
                }, {
                    loader: "raw-loader"
                }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: [path.resolve(__dirname, helpers.root('node_modules') + '/ng2-alfresco-core/styles')]
                    }
                }]
            },
        ]
    },

    plugins: [
        new ForkTsCheckerWebpackPlugin(),

        new HappyPack({
            id: 'ts',
            threads: 4,
            loaders: [
                {
                    path: 'ts-loader',
                    query: {
                        happyPackMode: true,
                        "compilerOptions": {
                            "paths": {}
                        }
                    }
                }
            ]
        }),

        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    context: `node_modules/${lib}/bundles/assets/`,
                    from: '**/*',
                    to: `assets/`
                }
            })
        ]),
        new CopyWebpackPlugin([
            {
                context: `node_modules/ng2-alfresco-core/prebuilt-themes/`,
                from: '**/*.css',
                to: 'prebuilt-themes'
            }
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

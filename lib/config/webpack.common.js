const webpack = require('webpack');
const helpers = require('./helpers');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const alfrescoLibs = [
    'content-services',
    'process-services',
    'core'
];

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = {

    devtool: 'source-map',

    resolveLoader: {
        alias: {
            "file-multi-loader": path.resolve(__dirname, "./custom-loaders/file-loader-multi"),
            "license-check": path.resolve(__dirname, "./custom-loaders/license-check")
        }
    },

    resolve: {
        alias: {
            "@alfresco/content-services": path.resolve(__dirname, '../content-services/'),
            "@alfresco/content-services$": path.resolve(__dirname, '../content-services/index.ts'),
            "@alfresco/process-services": path.resolve(__dirname, '../process-services/'),
            "@alfresco/process-services$": path.resolve(__dirname, '../process-services/index.ts'),
            "@alfresco/core": path.resolve(__dirname, '../core/'),
            "@alfresco/core$": path.resolve(__dirname, '../core/index.ts'),
            "@alfresco/analytics": path.resolve(__dirname, '../analytics/'),
            "@alfresco/analytics": path.resolve(__dirname, '../analytics/index.ts')
        },
        extensions: ['.ts', '.js', '.scss'],
        modules: [helpers.root('node_modules')]
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                use: 'source-map-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                options: {
                    configFile : helpers.root('tslint.json'),
                    emitErrors: true,
                    failOnHint: true,
                    fix: true
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.ts$/,
                loader: ['happypack/loader?id=ts', 'angular2-template-loader'],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.css$/,
                loader: ['happypack/loader?id=css'],
                exclude: [/node_modules/, /bundles/, /dist/, /demo/]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "to-string-loader"
                }, {
                    loader: "raw-loader"
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'license-check',
                options: {
                    emitErrors: true,
                    licenseFile: path.resolve(__dirname, './assets/license_header.txt')
                },
                exclude: [/node_modules/, /bundles/, /dist/, /demo/, /rendering-queue.services.ts/]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-multi-loader',
                query: {
                    name: '[name].[hash].[ext]',
                    outputPath: (url, resourcePath)=> {
                        return resourcePath.replace('assets/', 'bundles/assets/') + url;
                    },
                    publicPath: (url, resourcePath)=> {
                        return resourcePath + url;
                    }
                }
            }
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
                            "paths": {
                            }
                        }
                    }
                }
            ]
        }),

        new HappyPack({
            id: 'css',
            threads: 4,
            loaders: ['to-string-loader', 'css-loader' ]
        }),

        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    from: `${lib}/i18n/`,
                    to: `${lib}/bundles/assets/${lib}/i18n/`
                }
            })
        ]),

        new webpack.NoEmitOnErrorsPlugin(),

        new webpack.ContextReplacementPlugin( /angular(\\|\/)core(\\|\/)/, path.resolve(__dirname, './src') ),

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
    ],

    node: {
        fs: 'empty',
        module: false
    }
};

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

    devtool: 'cheap-module-source-map',

    output: {
        path: helpers.root('dist'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [helpers.root('app'), helpers.root('../ng2-components')],
                loader: [
                    'happypack/loader?id=ts','angular2-template-loader'
                ],
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
                        includePaths: [path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/styles')]
                    }
                }]
            },
        ]
    },

    resolve: {
        alias: {
            "ng2-alfresco-core$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/index.ts'),
            "ng2-alfresco-core": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core'),
            "ng2-alfresco-datatable$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-datatable/index.ts'),
            "ng2-alfresco-datatable": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-datatable'),
            "ng2-activiti-form/stencils/runtime.ng1$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/stencils/runtime.ng1'),
            "ng2-activiti-form/stencils/runtime.adf$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/stencils/runtime.adf'),
            "ng2-activiti-diagrams$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-diagrams/index.ts'),
            "ng2-activiti-diagrams": path.resolve(__dirname, '../../ng2-components/ng2-activiti-diagrams'),
            "ng2-activiti-analytics$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-analytics/index.ts'),
            "ng2-activiti-analytics": path.resolve(__dirname, '../../ng2-components/ng2-activiti-analytics'),
            "ng2-activiti-form$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/index.ts'),
            "ng2-activiti-form": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form'),
            "ng2-activiti-tasklist$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-tasklist/index.ts'),
            "ng2-activiti-tasklist": path.resolve(__dirname, '../../ng2-components/ng2-activiti-tasklist'),
            "ng2-activiti-processlist$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-processlist/index.ts'),
            "ng2-activiti-processlist": path.resolve(__dirname, '../../ng2-components/ng2-activiti-processlist'),
            "ng2-alfresco-documentlist$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-documentlist/index.ts'),
            "ng2-alfresco-documentlist": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-documentlist'),
            "ng2-alfresco-login$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-login/index.ts'),
            "ng2-alfresco-login": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-login'),
            "ng2-alfresco-search$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-search/index.ts'),
            "ng2-alfresco-search": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-search'),
            "ng2-alfresco-social$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-social/index.ts'),
            "ng2-alfresco-social": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-social'),
            "ng2-alfresco-tag$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-tag/index.ts'),
            "ng2-alfresco-tag": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-tag'),
            "ng2-alfresco-upload$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-upload/index.ts'),
            "ng2-alfresco-upload": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-upload'),
            "ng2-alfresco-viewer$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-viewer/index.ts'),
            "ng2-alfresco-viewer": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-viewer'),
            "ng2-alfresco-webscript$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-webscript/index.ts'),
            "ng2-alfresco-webscript": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-webscript'),
            "ng2-alfresco-userinfo$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-userinfo/index.ts'),
            "ng2-alfresco-userinfo": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-userinfo')
        },
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    plugins: [
        new ForkTsCheckerWebpackPlugin({tsconfig: "tsconfig.dev.json"}),

        new HappyPack({
            id: 'ts',
            threads: 8,
            loaders: [
                {
                    path: 'ts-loader',
                    query: {happyPackMode: true}
                }
            ]
        }),

        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        }),
        new CopyWebpackPlugin([
            ... alfrescoLibs.map(lib => {
                return {
                    context: `../ng2-components/${lib}/src/i18n/`,
                    from: '**/*',
                    to: `assets/${lib}/i18n/`
                }
            })
        ]),
        new CopyWebpackPlugin([
            {
                context: `../ng2-components/ng2-alfresco-core/prebuilt-themes/`,
                from: '**/*.css',
                to: 'prebuilt-themes'
            }
        ])
    ]
});

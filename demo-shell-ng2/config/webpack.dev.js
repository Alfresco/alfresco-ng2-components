const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');
const path = require('path');

module.exports = webpackMerge(commonConfig, {

    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        alias: {
            "ng2-alfresco-core$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/index.ts'),
            "ng2-alfresco-datatable$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-datatable/index.ts'),
            "ng2-activiti-form/stencils/runtime.ng1$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/stencils/runtime.ng1'),
            "ng2-activiti-form/stencils/runtime.adf$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/stencils/runtime.adf'),
            "ng2-activiti-diagrams$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-diagrams/index.ts'),
            "ng2-activiti-analytics$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-analytics/index.ts'),
            "ng2-activiti-form$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-form/index.ts'),
            "ng2-activiti-tasklist$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-tasklist/index.ts'),
            "ng2-activiti-processlist$": path.resolve(__dirname, '../../ng2-components/ng2-activiti-processlist/index.ts'),
            "ng2-alfresco-documentlist$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-documentlist/index.ts'),
            "ng2-alfresco-login$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-login/index.ts'),
            "ng2-alfresco-search$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-search/index.ts'),
            "ng2-alfresco-social$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-social/index.ts'),
            "ng2-alfresco-tag$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-tag/index.ts'),
            "ng2-alfresco-upload$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-upload/index.ts'),
            "ng2-alfresco-viewer$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-viewer/index.ts'),
            "ng2-alfresco-webscript$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-webscript/index.ts'),
            "ng2-alfresco-userinfo$": path.resolve(__dirname, '../../ng2-components/ng2-alfresco-userinfo/index.ts')
        },
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin('[name].[hash].css'),
        new webpack.LoaderOptionsPlugin({
            htmlLoader: {
                minimize: false // workaround for ng2
            }
        })
    ]
});

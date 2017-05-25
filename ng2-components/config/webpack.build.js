const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    output: {
        filename: '[name]/bundles/[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        chunkFilename: '[id].chunk.js'
    },

    entry: {
        "ng2-alfresco-core": "./ng2-alfresco-core/index.ts",
        "ng2-alfresco-datatable": "./ng2-alfresco-datatable/index.ts",
        "ng2-activiti-diagrams": "./ng2-activiti-diagrams/index.ts",
        "ng2-activiti-analytics": "./ng2-activiti-analytics/index.ts",
        "ng2-activiti-form": "./ng2-activiti-form/index.ts",
        "ng2-activiti-tasklist": "./ng2-activiti-tasklist/index.ts",
        "ng2-activiti-processlist": "./ng2-activiti-processlist/index.ts",
        "ng2-alfresco-documentlist": "./ng2-alfresco-documentlist/index.ts",
        "ng2-alfresco-login": "./ng2-alfresco-login/index.ts",
        "ng2-alfresco-search": "./ng2-alfresco-search/index.ts",
        "ng2-alfresco-social": "./ng2-alfresco-social/index.ts",
        "ng2-alfresco-tag": "./ng2-alfresco-tag/index.ts",
        "ng2-alfresco-upload": "./ng2-alfresco-upload/index.ts",
        "ng2-alfresco-viewer": "./ng2-alfresco-viewer/index.ts",
        "ng2-alfresco-webscript": "./ng2-alfresco-webscript/index.ts",
        "ng2-alfresco-userinfo": "./ng2-alfresco-userinfo/index.ts"
    },

    plugins: [

        //new webpack.optimize.UglifyJsPlugin({
        //    mangle: {
        //        keep_fnames: true
        //    },
        //    compress: {
        //        warnings: false
        //    },
        //    output: {
        //        comments: false
        //    },
        //    sourceMap: true
        //})

    ]
});

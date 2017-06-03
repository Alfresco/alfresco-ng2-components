const helpers = require('./helpers');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {

    devtool: 'inline-source-map',

    resolve: {
        alias: {
            "ng2-alfresco-core": helpers.root('../ng2-alfresco-core/index.ts')
        },
        extensions: ['.ts', '.js'],
        symlinks: false,
        modules: [helpers.root('../../ng2-components'), helpers.root('node_modules')]
    }
});

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractScss = new ExtractTextPlugin('./ng2-alfresco-core/prebuilt-themes/[name].css');

module.exports = {

    entry: {
        'adf-blue-orange': './ng2-alfresco-core/styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': './ng2-alfresco-core/styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': './ng2-alfresco-core/styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': './ng2-alfresco-core/styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': './ng2-alfresco-core/styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': './ng2-alfresco-core/styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': './ng2-alfresco-core/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': './ng2-alfresco-core/styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': './ng2-alfresco-core/styles/prebuilt/adf-purple-green.scss'
    },

    output: {
        filename: './dist/[name].js'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: extractScss.extract([{
                loader: "raw-loader"
            }, {
                loader: "sass-loader",
                options: {
                    includePaths: [path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/styles')]
                }
            }])
        }]
    },
    plugins: [
        extractScss
    ]
};

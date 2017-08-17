const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractScss = new ExtractTextPlugin('./ng2-alfresco-core/prebuilt-themes/[name].css');

module.exports = {

    entry: {
        'adf-deeppurple-amber': './ng2-alfresco-core/styles/prebuilt/adf-deeppurple-amber.scss',
        'adf-indigo-pink': './ng2-alfresco-core/styles/prebuilt/adf-indigo-pink.scss',
        'adf-pink-bluegrey': './ng2-alfresco-core/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-purple-green': './ng2-alfresco-core/styles/prebuilt/adf-purple-green.scss',
        'adf-orange-purple': './ng2-alfresco-core/styles/prebuilt/adf-orange-purple.scss'
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

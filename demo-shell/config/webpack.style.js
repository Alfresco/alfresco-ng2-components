const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractScss = new ExtractTextPlugin('../ng2-components/core/prebuilt-themes/[name].css');

module.exports = {

    entry: {
        'adf-blue-orange': '../ng2-components/core/styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': '../ng2-components/core/styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': '../ng2-components/core/styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': '../ng2-components/core/styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': '../ng2-components/core/styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': '../ng2-components/core/styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': '../ng2-components/core/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': '../ng2-components/core/styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': '../ng2-components/core/styles/prebuilt/adf-purple-green.scss'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, '../node_modules')]
    },

    output: {
        filename: '../dist/[name].js'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            use: extractScss.extract([{
                loader: "raw-loader"
            }, {
                loader: "sass-loader"
            }])
        }]
    },
    plugins: [
        extractScss
    ]
};

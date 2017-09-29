const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractScss = new ExtractTextPlugin('./prebuilt-themes/[name].css');

module.exports = {

    entry: {
        'adf-blue-orange': './styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': './styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': './styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': './styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': './styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': './styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': './styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': './styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': './styles/prebuilt/adf-purple-green.scss'
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
                loader: "sass-loader"
            }])
        }]
    },
    plugins: [
        extractScss
    ]
};

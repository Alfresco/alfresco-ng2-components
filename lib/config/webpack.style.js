const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractScss = new ExtractTextPlugin('./core/prebuilt-themes/[name].css');

module.exports = {

    entry: {
        'adf-blue-orange': './core/styles/prebuilt/adf-blue-orange.scss',
        'adf-blue-purple': './core/styles/prebuilt/adf-blue-purple.scss',
        'adf-cyan-orange': './core/styles/prebuilt/adf-cyan-orange.scss',
        'adf-cyan-purple': './core/styles/prebuilt/adf-cyan-purple.scss',
        'adf-green-purple': './core/styles/prebuilt/adf-green-purple.scss',
        'adf-green-orange': './core/styles/prebuilt/adf-green-orange.scss',
        'adf-pink-bluegrey': './core/styles/prebuilt/adf-pink-bluegrey.scss',
        'adf-indigo-pink': './core/styles/prebuilt/adf-indigo-pink.scss',
        'adf-purple-green': './core/styles/prebuilt/adf-purple-green.scss'
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

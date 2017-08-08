const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');

const extractSass = new ExtractTextPlugin({
    filename: "[name].css"
});

module.exports = {
    output: {
        filename: '[name]/bundles/[name].js'
    },

    module: {
        rules: [{
            test: /\.scss$/,
            include:  [ path.resolve(__dirname, '../../ng2-components/ng2-alfresco-core/styles/prebuilt')],
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                fallback: "style-loader"
            })
        }]
    },
    plugins: [
        extractSass
    ]
};

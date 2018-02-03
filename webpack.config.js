const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'public', 'js'),
        filename: 'app.js'
    },
    plugins: [
        new HtmlWebpackPlugin({})
    ]
};
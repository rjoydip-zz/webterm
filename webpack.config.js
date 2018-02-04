const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'public', 'js'),
        filename: 'app.js'
    },
    plugins: []
};
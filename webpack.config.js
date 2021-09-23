const path = require("path");

module.exports = {
    entry: "./src/client/js/main.js",
    mode: 'development',
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "assets", "js"),
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                // ref : https://github.com/babel/babel-loader
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env', { targets: "defaults" }]],
                    },
                },
            },
            {
                test:/\.scss$/,
                //must start with last loader to first loader : in reverse order
                use: [
                    "style-loader", "css-loader", "sass-loader"
                ],
            }
        ],
    },
};
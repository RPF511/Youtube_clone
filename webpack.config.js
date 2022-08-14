const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/"

module.exports = {
    entry: {
        main: BASE_JS+"main.js",
        videoPlayer: BASE_JS+"videoPlayer.js",
        recorder: BASE_JS+"recorder.js",
        commentSection: BASE_JS+"commentSection.js",
    },
    mode: 'development',
    // watch: true,
    plugins: [new MiniCssExtractPlugin({
        //to make css file in assets/css folder
        filename: "css/styles.css",
    })],
    
    output: {
        //to make js file in assets/js folder
        filename: "js/[name].js",
        path: path.resolve(__dirname, "assets"),
        //clean output folder before build
        clean: true,
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
                //use: ["style-loader", "css-loader", "sass-loader"],
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ],
    },
};
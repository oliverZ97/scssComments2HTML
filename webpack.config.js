const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

console.log('im running in DevMode: ' + devMode);

module.exports = {
    entry: './docs/style.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader",
                        options: { minimize: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                      }, {
                        loader: 'resolve-url-loader',
                      }, {
                        loader: 'sass-loader',
                        options: {
                          sourceMap: true,
                          sourceMapContents: false
                        }
                      }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./docs/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
    ],
    node: {
        fs: 'empty'
    }
};
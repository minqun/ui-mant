/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-20 15:47:10
 * @LastEditTime: 2019-09-20 16:46:17
 * @LastEditors: Please set LastEditors
 */
const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
module.exports = merge(baseWebpackConfig, {
    output: {
        path: path.resolve(__dirname, './_site'),
        publicPath: '/',
        filename: '[name].[contenthash:8].js',
        chunkFilename: '[contenthash:8].async.js',
    },
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    { loader: 'less-loader', options: { javascriptEnabled: true } },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    // 打包压缩，跟据不同策略分割打包
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: `chunk-vendors`,
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: 'initial',
                },
                common: {
                    name: `chunk-common`,
                    minChunks: 2,
                    priority: -20,
                    chunks: 'initial',
                    reuseExistingChunk: true,
                },
            },
        },
    },
    plugins: [
        // 配置变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new HtmlWebpackPlugin({
            template: './site/index.html',
            inject: true, // 注入所有静态资源
            production: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[id].[contenthash:8].css',
        }),
    ],
});

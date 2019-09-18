/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 11:30:38
 * @LastEditTime: 2019-09-18 15:14:10
 * @LastEditors: Please set LastEditors
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: 'build.js'
    },
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    { loader: 'vue-style-loader' },
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'less-loader', options: { sourceMap: true, javascriptEnabled: true } }
                ]
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
            }
        ]
    },
    devServer: {
        port: 3002,
        host: '127.0.0.1',
        historyApiFallback: {
            rewrites: [{ from: /./, to: '/index.html' }],
        },
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
    },
    performance: { // 性能选项
        hints: false,
    },
    devtool: '#source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'site/index.html',
            filename: 'index.html',
            inject: true,
        }),
    ],
})

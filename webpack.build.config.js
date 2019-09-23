/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-20 15:46:54
 * @LastEditTime: 2019-09-20 16:46:53
 * @LastEditors: Please set LastEditors
 */
const webpack = require('webpack');
const getWebpackConfig = require('./getWebpackConfig');

function ignoreMomentLocale(webpackConfig) {
    delete webpackConfig.module.noParse;
    webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
}

function addLocales(webpackConfig) {
    let packageName = 'antd-with-locales';
    if (webpackConfig.entry['antd.min']) {
        packageName += '.min';
    }
    webpackConfig.entry[packageName] = './index-with-locales.js';
    webpackConfig.output.filename = '[name].js';
}

function externalMoment(config) {
    config.externals.moment = {
        root: 'moment',
        commonjs2: 'moment',
        commonjs: 'moment',
        amd: 'moment',
    };
}

const webpackConfig = getWebpackConfig(false);
if (process.env.RUN_ENV === 'PRODUCTION') {
    webpackConfig.forEach(config => {
        ignoreMomentLocale(config);
        externalMoment(config);
        addLocales(config);
    });
}

module.exports = webpackConfig;

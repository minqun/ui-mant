/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 10:25:25
 * @LastEditTime: 2019-09-23 09:32:13
 * @LastEditors: Please set LastEditors
 */
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//这个Webpack插件强制所有需要的模块的整个路径匹配磁盘上实际路径的具体情况。使用这个插件可以帮助减轻开发人员在OSX上工作的情况
//，因为OSX不遵循严格的路径敏感性，这会导致与其他开发人员的冲突，或者构建运行其他操作系统的盒子，这些系统需要正确的路径。
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const rucksack = require('rucksack-css');
const autoprefixer = require('autoprefixer');
// 样式打包-- 添加样式前缀
const postcssConfig = {
    plugins: [rucksack(), autoprefixer()],
};

const CleanUpStatsPlugin = require('./utils/CleanUpStatsPlugin');

const distFileBaseName = 'antd';

const svgRegex = /\.svg(\?v=\d+\.\d+\.\d+)?$/;
const svgOptions = {
    limit: 10000,
    minetype: 'image/svg+xml',
};

const imageOptions = {
    limit: 10000,
};


function getWebpackConfig(modules) {
    const pkg = require(path.join(process.cwd(), 'package.json'));
    const babelConfig = require('./getBabelCommonConfig')(modules || false);

    const pluginImportOptions = [{
        style: true,
        libraryName: distFileBaseName,
        libraryDirectory: 'components',
    }];
    // 按需
    babelConfig.plugins.push([require.resolve('babel-plugin-import'), pluginImportOptions]);

    if (modules === false) {
        babelConfig.plugins.push(require.resolve('./utils/replaceLib'));
    }

    const config = {
        devtool: 'source-map',

        output: {
            path: path.join(process.cwd(), './dist/'),
            filename: '[name].js',
        },

        resolve: {
            modules: ['node_modules', path.join(__dirname, '../node_modules')],
            extensions: ['.js', '.jsx', '.vue', '.md', '.json'],
            alias: {
                vue$: 'vue/dist/vue.esm.js',
                '@': process.cwd(),
            },
        },

        node: [
            'child_process',
            'cluster',
            'dgram',
            'dns',
            'fs',
            'module',
            'net',
            'readline',
            'repl',
            'tls',
        ].reduce((acc, name) => Object.assign({}, acc, {
            [name]: 'empty',
        }), {}),

        module: {
            noParse: [/moment.js/],
            rules: [{
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'vue-loader',
                        options: {
                            loaders: {
                                js: [{
                                    loader: 'babel-loader',
                                    options: {
                                        presets: ['env'],
                                        plugins: ['transform-vue-jsx', 'transform-object-rest-spread'],
                                    },
                                }],
                            },
                        },
                    }],
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    options: babelConfig,
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: Object.assign({}, postcssConfig, { sourceMap: true }),
                        },
                    ],
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: Object.assign({}, postcssConfig, { sourceMap: true }),
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                sourceMap: true,
                                javascriptEnabled: true,
                            },
                        },
                    ],
                },
                // Images
                {
                    test: svgRegex,
                    loader: 'url-loader',
                    options: svgOptions,
                },
                {
                    test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                    loader: 'url-loader',
                    options: imageOptions,
                },
            ],
        },

        plugins: [
            new CaseSensitivePathsPlugin(),
            new webpack.BannerPlugin(`
${pkg.name} v${pkg.version}

Copyright 2017-present, ant-design-vue.
All rights reserved.
      `),
            new WebpackBar({
                name: '🚚  Ant Design Vue Tools',
                color: '#2f54eb',
            }),
            new CleanUpStatsPlugin(),
        ],
    };

    if (process.env.RUN_ENV === 'PRODUCTION') {
        const entry = ['./index'];
        config.externals = {
            vue: {
                root: 'Vue',
                commonjs2: 'vue',
                commonjs: 'vue',
                amd: 'vue',
            },
        };
        config.output.library = distFileBaseName;
        config.output.libraryTarget = 'umd';
        config.optimization = {
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true,
                    uglifyOptions: {
                        warnings: false,
                    },
                }),
            ],
        };

        // Development
        const uncompressedConfig = webpackMerge({}, config, {
            entry: {
                [distFileBaseName]: entry,
            },
            mode: 'development',
            plugins: [
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                }),
            ],
        });

        // Production
        const prodConfig = webpackMerge({}, config, {
            entry: {
                [`${distFileBaseName}.min`]: entry,
            },
            mode: 'production',
            plugins: [
                new webpack.optimize.ModuleConcatenationPlugin(),
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                }),
                new MiniCssExtractPlugin({
                    filename: '[name].css',
                }),
            ],
            optimization: {
                minimizer: [new OptimizeCSSAssetsPlugin({})],
            },
        });

        return [prodConfig, uncompressedConfig];
    }

    return config;
}

getWebpackConfig.webpack = webpack;
getWebpackConfig.svgRegex = svgRegex;
getWebpackConfig.svgOptions = svgOptions;
getWebpackConfig.imageOptions = imageOptions;

module.exports = getWebpackConfig;

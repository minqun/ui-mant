/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:13:41
 * @LastEditTime: 2019-09-17 16:47:29
 * @LastEditors: Please set LastEditors
 */
'use strict';

module.exports = function(modules) {
    const plugins = [
        require.resolve('babel-plugin-transform-vue-jsx'), // 支持jsX
        require.resolve('babel-plugin-inline-import-data-uri'), // 使用导入文件内容作为DataURI
        require.resolve('babel-plugin-transform-es3-member-expression-literals'), // 在属性访问中引用保留字
        require.resolve('babel-plugin-transform-es3-property-literals'), // 在对象属性键中引用保留字
        require.resolve('babel-plugin-transform-object-assign'), // 支持Object.assign 处理
        require.resolve('babel-plugin-transform-object-rest-spread'), //允许Babel转换用于对象销毁、赋值的rest属性和用于对象文本的spread属性。
        /**
        Rest Properties
            let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
            console.log(x); // 1
            console.log(y); // 2
            console.log(z); // { a: 3, b: 4 }
        Spread Properties
            let n = { x, y, ...z };
            console.log(n); // { x: 1, y: 2, a: 3, b: 4 }
         */
        require.resolve('babel-plugin-transform-class-properties'), // 转换了es2015静态类属性以及用es2016属性初始化器语法声明的属性。
    ];
    plugins.push([
        require.resolve('babel-plugin-transform-runtime'), // 转化BOM里面不兼容的API
        {
            polyfill: false,
        },
    ]);
    return {
        presets: [
            [
                require.resolve('babel-preset-env'), // es5+ 转 es5
                {
                    modules,
                    targets: {
                        browsers: [
                            'last 2 versions',
                            'Firefox ESR',
                            '> 1%',
                            'ie >= 9',
                            'iOS >= 8',
                            'Android >= 4',
                        ],
                    },
                },
            ],
        ],
        plugins,
        env: {
            test: {
                plugins: [require.resolve('babel-plugin-istanbul')], // 测试代码babel
            },
        },
    };
};

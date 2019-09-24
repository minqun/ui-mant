/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 09:31:48
 * @LastEditTime: 2019-09-23 09:31:48
 * @LastEditors: your name
 */
'use strict';

const { join, dirname } = require('path');
const fs = require('fs');

const cwd = process.cwd();

function replacePath(path) {
    if (path.node.source && /\/lib\//.test(path.node.source.value)) {
        const esModule = path.node.source.value.replace('/lib/', '/es/');
        const esPath = dirname(join(cwd, `node_modules/${esModule}`));
        if (fs.existsSync(esPath)) {
            path.node.source.value = esModule;
        }
    }
}
/** https://blog.csdn.net/weixin_34119545/article/details/91371156
 * 当Babel处理一个节点时，是以访问者的形式获取节点信息，并进行相关操作，
 * 这种方式是通过一个visitor对象来完成的，在visitor对象中定义了对于各种节点的访问函数，
 * 这样就可以针对不同的节点做出不同的处理。我们编写的Babel插件其实也是通过定义一个实例化visitor对象处理一系列的AST节点来完成我们对代码的修改操作
 */
function replaceLib() {
    return {
        visitor: {
            ImportDeclaration: replacePath,
            ExportNamedDeclaration: replacePath,
        },
    };
}

module.exports = replaceLib;

/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-13 10:25:27
 * @LastEditTime: 2019-09-24 17:32:35
 * @LastEditors: Please set LastEditors
 */
/* eslint no-console:0 */
function camelCase(name) {
    return (
        name.charAt(0).toUpperCase() +
        name.slice(1).replace(/-(\w)/g, (m, n) => {
            return n.toUpperCase();
        })
    );
}
// 一个webpack的api,通过执行require.context函数获取一个特定的上下文,
//主要用来实现自动化导入模块,在前端工程中,如果遇到从一个文件夹引入很多模块的情况,
//可以使用这个api,它会遍历文件夹中的指定文件,然后自动导入,使得不需要每次显式的调用import导入模块
//https://www.jianshu.com/p/c894ea00dfec

// Just import style for https://github.com/ant-design/ant-design/issues/3745
const req = require.context('./components', true, /^\.\/[^_][\w-]+\/style\/index\.js?$/);

req.keys().forEach(mod => {
    let v = req(mod);
    if (v && v.default) {
        v = v.default;
    }
    const match = mod.match(/^\.\/([^_][\w-]+)\/index\.js?$/);
    console.log("match::::", match);
    if (match && match[1]) {
        if (match[1] === 'message' || match[1] === 'notification') {
            // message & notification should not be capitalized
            exports[match[1]] = v;
        } else {
            exports[camelCase(match[1])] = v;
        }
    }
});

module.exports = require('./components');

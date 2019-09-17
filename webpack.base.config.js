/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:09:06
 * @LastEditTime: 2019-09-17 17:25:35
 * @LastEditors: Please set LastEditors
 */
const path = require("path");

const Token = require("markdown-it/lib/token");

const webpackBar = require('webpackbar');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const getBabelCommonConfig = require('./getBabelCommonConfig');
const babelConfig = getBabelCommonConfig(false);
import {
    fetch,
    replaceDelimiters,
    renderHighlight
}
from './util/common.js';
// markdown-it 处理md配置
const md = require("markdown-it")("default", {
        html: true, // 在源码中启用 HTML 标签
        breaks: true, // 转换段落里的 '\n' 到 <br>。
        // 高亮函数，会返回转义的HTML。
        // 或 '' 如果源字符串未更改，则应在外部进行转义。
        // 如果结果以 <pre ... 开头，内部包装器则会跳过。
        highlight: renderHighlight
    }).use(require("markdown-it-anchor"), {
        level: 2, // 锚点定位最小级别选择
        slugify: (string) => { // 锚点阻塞
            string.trim().split(' ').join('-')
        },
        permalink: true, // 是否在标题旁边添加永久链接。
        permalinkClass: 'anchor', // 锚点Class
        permalinkSymbol: "#", // 锚点标记
        permalinkBefore: false, // 将永久链接放在标题之前。
    })
    // 中英文 正则匹配内容 
const cnReg = new RegExp('<(cn)(?:[^<]|<)+</\\1>', 'g');
const usReg = new RegExp('<(us)(?:[^<]|<)+</\\1>', 'g');
md.core.ruler.push('update_template', function replace(state) {
    console.log("state:::::", state)
    let cn = '';
    let us = '';
    let template = '';
    let script = '';
    let style = '';
    let scopedStyle = '';
    let code = '';
    let sourceCode = '';
    let tokens = state.tokens;
    console.log("state:::::", tokens)
    if (token.type === 'html_block') {
        if (token.content.match(cnReg)) {
            cn = fetch(token.content, 'cn');
            token.content = '';
        }
        if (token.content.match(usReg)) {
            us = fetch(token.content, 'us');
            token.content = '';
        }
    }
    if (token.type === 'fence' && token.info === 'html' && token.markup === '```') {
        sourceCode = token.content;
        code = '````html\n' + token.content + '````';
        template = fetch(token.content, 'template');
        script = fetch(token.content, 'script');
        style = fetch(token.content, 'style');
        scopedStyle = fetch(token.content, 'style', true);
        token.content = '';
        token.type = 'html_block';
    }
})

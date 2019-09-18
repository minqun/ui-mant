/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:57:25
 * @LastEditTime: 2019-09-18 13:48:34
 * @LastEditors: Please set LastEditors
 */
const hljs = require("highlight.js");
const cheerio = require("cheerio");
/**
 * @description: 取出当前文件内容，转为html 获取标签内容
 * @param {any} str 文件内容 
 * @param {String}  tag 标签
 * @param {scoped}  scoped 作用域
 * @return: 文件内容
 */
const fetch = (str, tag, scoped) => {
        // cheerio 解析来自 HTMLParser
        const $ = cheerio.load(str, {
            decodeEntities: true,
            xmlMode: true
        })
        if (!tag) {
            return str;
        }
        if (tag === 'style') {
            return scoped ? $(`${tag}[scoped]`).html() : $(`${tag}`).not(`${tag}[scoped]`).html();
        }
        return $(tag).html();
    }
    /**
     * `{{ }}` => `<span>{{</span> <span>}}</span>`
     * @param  {string} str
     * @return {string}
     */
const replaceDelimiters = function(str) {
    return str.replace(/({{|}})/g, '<span>$1</span>');
};
/**
 * 高亮显示
 * @param  {string} str
 * @param  {string} lang
 */

const renderHighlight = function(str, lang) {
    if (!(lang && hljs.getLanguage(lang))) {
        return '';
    }
    try {
        return replaceDelimiters(hljs.highlight(lang, str, true).value);
    } catch (err) {}
};

module.exports = {
    fetch,
    replaceDelimiters,
    renderHighlight
}

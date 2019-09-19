/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-17 15:09:06
 * @LastEditTime: 2019-09-18 17:44:48
 * @LastEditors: Please set LastEditors
 */
const path = require("path");
const hljs = require('highlight.js');
const Jarvis = require("webpack-jarvis");
const Token = require("markdown-it/lib/token");
const cheerio = require('cheerio');
const WebpackBar = require('webpackbar');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const getBabelCommonConfig = require('./getBabelCommonConfig');
const babelConfig = getBabelCommonConfig(false);
const {
    fetch,
    replaceDelimiters,
    renderHighlight
} = require('./utils/common.js');

//markdown-it 处理md配置
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
    tokens.forEach(token => {

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
        if (token.type === 'fence' && token.info === 'html' && token.markup === '```') { // 以、、、html或者、、、script会被解析成fence类型，content为内容
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
    if (template) {
        let jsfiddle = {
            html: template,
            script,
            style,
            us,
            cn,
            sourceCode,
        };
        /** 编码 escapeHtml
         * '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;' */
        jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle));
        // 
        const codeHtml = code ? md.render(code) : '';
        const cnHtml = cn ? md.render(cn) : '';
        let newContent = `
      <template>
        <demo-box :jsfiddle="${jsfiddle}">
          <template slot="component">${template}</template>
          <template slot="description">${cnHtml}</template>
          <template slot="us-description">${us ? md.render(us) : ''}</template>
          <template slot="code">${codeHtml}</template>
        </demo-box>
      </template>`;
        newContent += script ?
            `
      <script>
      ${script || ''}
      </script>
      ` :
            '';
        newContent += style ? `<style>${style || ''}</style>` : '';
        newContent += scopedStyle ? `<style scoped>${scopedStyle || ''}</style>` : '';
        const t = new Token('html_block', '', 0);
        t.content = newContent;
        tokens.push(t);
    }
})
const vueLoaderOptions = {
    loaders: {
        js: [{
            loader: 'babel-loader',
            options: {
                presets: ['env'],
                plugins: ['transform-vue-jsx', 'transform-object-rest-spread'],
            },
        }],
    }
};

// debugger
module.exports = {
    mode: 'production',
    entry: {
        index: [`./site/${process.env.ENTRY_INDEX || 'index'}.js`],
    },
    module: {
        rules: [{
                test: /\.md$/,
                // use 执行顺序，最后引入最先执行
                use: [{
                        loader: 'vue-loader',
                        options: vueLoaderOptions,
                    },
                    {
                        loader: path.resolve(__dirname, './utils/index.js'),
                        options: Object.assign(md, {
                            wrapper: 'div',
                            raw: true,
                        }),
                    },
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderOptions,
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: babelConfig,
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]',
                },
            },
        ],
    },
    resolve: {
        modules: ['node_modules', path.join(__dirname, '../node_modules')],
        extensions: ['.js', '.jsx', '.vue', '.md'],
        alias: {
            vue$: 'vue/dist/vue.esm.js',
            antd: path.join(__dirname, 'components'),
            'ant-design-vue': path.join(__dirname, 'components'),
            '@': path.join(__dirname, ''),
        },
    },
    plugins: [new VueLoaderPlugin(), new WebpackBar(), new Jarvis({
        port: 1337 // optional: set a port
    })],
};

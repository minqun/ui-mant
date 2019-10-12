/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-27 11:37:41
 * @LastEditTime: 2019-09-27 15:53:36
 * @LastEditors: Please set LastEditors
 */
const webpack = require('webpack');
const through2 = require('through2');
const path = require('path');
const gulp = require('gulp');
const readline = require('readline');
const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const cwd = process.cwd();

function dist(done) {
    rimraf.sync(path.join(cwd, '_site'));
    process.env.RUN_ENV = 'PRODUCTION';
    const webpackConfig = require(path.join(cwd, 'webpack.site.config.js'));
    // webpack 执行site 配置
    webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.log(err.stack || err);
                if (err.details) { console.log(err.details) };
                return;
            }
            // webpack 回调信息 
            const info = stats.toJson();
            if (stats.hasErrors()) {
                console.log(info.errors);
            }
            if (stats.hasWarnings()) {
                console.log(info.warnings);
            }
            // 执行时输出内容
            const buildInfo = stats.toString({
                colors: true,
                children: true,
                chunks: false,
                modules: false,
                chunkModules: false,
                hash: false,
                version: false,
            })
        })
        // webpack series() done
    done(0);
}

function copyHtml() {
    const rl = readline.createInterface({
        input: fs.createReadStream(path.join(cwd, 'site/demoRoutes.js')),
    });
    fs.writeFileSync(
        path.join(cwd, '_site/404.html'),
        fs.readFileSync(path.join(cwd, 'site/404.html')),
    );
    fs.writeFileSync(
        path.join(cwd, '_site/index-cn.html'),
        fs.readFileSync(path.join(cwd, '_site/index.html')),
    );
    fs.writeFileSync(path.join(cwd, '_site/CNAME'), 'vue.ant.design');
    rl.on('line', line => {
        if (line.indexOf('path:') > -1) {
            const name = line.split("'")[1].split("'")[0];
            console.log('create path:', name);
            const toPaths = [
                `_site/components/${name}`,
                // `_site/components/${name}-cn`,
                `_site/iframe/${name}`,
                // `_site/iframe/${name}-cn`,
            ];
            toPaths.forEach(toPath => {
                rimraf.sync(path.join(cwd, toPath));
                mkdirp(path.join(cwd, toPath), function() {
                    fs.writeFileSync(
                        path.join(cwd, `${toPath}/index.html`),
                        fs.readFileSync(path.join(cwd, '_site/index.html')),
                    );
                });
            });
        }
    });
    const source = [
        'docs/vue/*.md',
        '*.md',
        // '!components/vc-slider/**/*', // exclude vc-slider
    ];
    gulp.src(source).pipe(
        through2.obj(function z(file, encoding, next) {
            const paths = file.path.split('/');
            const name = paths[paths.length - 1].split('.')[0].toLowerCase();
            const toPaths = [
                '_site/docs',
                '_site/docs/vue',
                `_site/docs/vue/${name}`,
                `_site/docs/vue/${name}-cn`,
            ];
            toPaths.forEach(toPath => {
                mkdirp(path.join(cwd, toPath), function() {
                    fs.writeFileSync(
                        path.join(cwd, `${toPath}/index.html`),
                        fs.readFileSync(path.join(cwd, '_site/index.html')),
                    );
                });
            });
            next();
        }),
    );
}
gulp.task(
    '_site',
    gulp.series(done => {
        dist(() => {
            copyHtml();
            done();
        });
    }),
);
gulp.task(
    'copy-html',
    gulp.series(() => {
        copyHtml();
    }),
);

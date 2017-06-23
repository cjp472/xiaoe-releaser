/**
 * Created by qianlipp on 2017/6/14.
 * 项目预处理
 * 1、如果已经是在线状态，则恢复
 * 2、将要修改的文件拷贝到其他文件夹，备份，防止异常
 */
var fs = require("fs");

var getFiles = require('node-all-files');

var filesWalker = require('files-walker');

var uglifyJS = require("uglify-js");
var cleanCSS = require('clean-css');

var utils = require("../_libs/utils");

var basePath = null;

var run = function (base_path) {
    basePath = base_path;
    if (!utils.isEndWith(basePath, "/")) {
        basePath = basePath + "/";
    }

    //处理vue
    console.log("开始处理vue编译");
    proccessVue();
    //处理js
    console.log("开始处理js");
    proccessJs();
    //处理css
    console.log("开始处理css");
    proccessCss();

    //处理现网版本置位问题
    console.log("开始处理现网版本置位问题");
    proccessOnlineState();

    //建立现网锁
    console.log("建立现网锁");
    utils.runShell("touch " + basePath + "public/ONLINE_VERSION_LOCK");
};

/**
 * 处理vue
 */
var proccessVue = function () {
    var forVue = "alias cnpm='npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc';";
    forVue = forVue + "cd " + basePath + ";";
    forVue = forVue + "cnpm install;";
    forVue = forVue + "cnpm run dist;";
    utils.runShell(forVue);
};

/**
 * 处理js
 */


    // {
    //      contain:"",
    //      not_contain:"",
    //      start_with:"",
    //      not_start_with:"",
    //      end_with:"",
    //      not_end_with:"",
    //      filter:function(){
    // }
    // }

var proccessJs = function () {
        filesWalker.walkSync(basePath + "public", function (path, name) {
            var code = fs.readFileSync(path + name, 'utf-8');
            fs.writeFileSync(path + name, uglifyJS.minify(code).code)
        }, {
            filter: function (path, name) {
                if (!utils.isEndWith(name, ".js")) {
                    //不是js的忽略
                    return false;
                } else if (name.indexOf(".min.") > -1) {
                    //所有.min的js忽略
                    return false;
                } else if (path.indexOf("/vue/") > -1) {
                    //所有vue下面的js忽略
                    return false;
                }
                return true;
            }
        });
    };

/**
 * 处理css压缩
 */
var proccessCss = function () {

    filesWalker.walkSync(basePath + "public", function (path, name) {
        var code = fs.readFileSync(path + name, 'utf-8');
        var options = {};
        fs.writeFileSync(path + name, new cleanCSS(options).minify(code).styles);
    }, {
        filter: function (path, name) {
            if (!utils.isEndWith(name, ".css")) {
                //不是js的忽略
                return false;
            } else if (name.indexOf(".min.") > -1) {
                //所有.min的js忽略
                return false;
            } else if (path.indexOf("/vue/") > -1) {
                //所有vue下面的js忽略
                return false;
            }
            return true;
        }
    });
};

/**
 * 处理上线时，现网状态置位问题
 */
var proccessOnlineState = function () {
    //配置文件
    var file = basePath + "app/Http/Controllers/Tools/EnvSetting.php";
    var code = fs.readFileSync(file, 'utf-8');
    code = code.replace(/\.env/, ".env.production");
    fs.writeFileSync(file, code);
    //直播推流数据库环境
    file = basePath + "public/original_php_tasks/alive_video/AliveLogic.php";
    code = fs.readFileSync(file, 'utf-8');
    code = code.replace("$isProduction = false", "$isProduction = true");
    fs.writeFileSync(file, code);
    //前端性能监控上报地址，配置为production
    file = basePath + "public/js/utils/watcher.full.js";
    code = fs.readFileSync(file, 'utf-8');
    code = code.replace("http://h5.inside.xiaoe-tech.com/e_watcher/", "http://h5.xiaoe-tech.com/e_watcher/");
    fs.writeFileSync(file, code);

    /**
     * 接下来这个，是更新资源版本号，每次都要变的
     */
    var oDate = new Date(); //实例一个时间对象
    var version = "v"
        + oDate.getFullYear()
        + (oDate.getMonth() + 1)
        + oDate.getDate()
        + oDate.getHours()
        + oDate.getMinutes()
        + oDate.getSeconds()
        + "v";
    file = basePath + "app/Http/GlobalFunction.php";
    code = fs.readFileSync(file, 'utf-8');
    code = code.replace('env("version")', version);
    code = code.replace(/v[0-9]{6,}v/, version);
    fs.writeFileSync(file, code);
};

module.exports = {
    /**
     * 模块测试
     */
    test: function () {
        console.log("step20-filesprocess test!");
    },
    /**
     * 执行模块
     */
    run: run
};
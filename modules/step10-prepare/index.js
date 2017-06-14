/**
 * Created by qianlipp on 2017/6/14.
 * 项目预处理
 * 1、如果已经是在线状态，则恢复
 * 2、将要修改的文件拷贝到其他文件夹，备份，防止异常
 */
var fs = require("fs");
var getFiles = require('node-all-files');
var uglifyJS = require("uglify-js");
var cleanCSS = require('clean-css');

var utils = require("../_libs/utils");

var basePath = null;

var run = function (base_path) {
    basePath = base_path;
    if (!utils.isEndWith(basePath, "/")) {
        basePath = basePath + "/";
    }

    //恢复初始化
    revertStatus();
    //开始处理
    proccessFiles();
};

/**
 * 恢复到初始状态
 */
var revertStatus = function () {
    if (fs.existsSync(basePath + "public/ONLINE_VERSION_LOCK")) {
        //如果存在现网锁，说明是现网版本，先恢复到标准版本
        //移除public
        utils.runShell("rm -rf " + basePath + "public");
        //将备份的public恢复
        utils.runShell("mv " + basePath + "public_bak " + basePath + "public");
    }
};

/**
 * 处理vue
 */
var proccessVue = function () {
    var forVue = "alias cnpm='npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc'";
    forVue = forVue + " && cd " + basePath;
    forVue = forVue + " && cnpm install";
    forVue = forVue + " && cnpm run dist";
    utils.runShell(forVue);
};

/**
 * 处理js
 */
var proccessJs = function () {
    getFiles.getFilenames(basePath + "public", function (file) {
        if (!utils.isEndWith(file, ".js")) {
            //不是js的忽略
            return false;
        } else if (file.indexOf(".min.") > -1) {
            //所有.min的js忽略
            return false;
        } else if (file.indexOf("/vue/") > -1) {
            //所有vue下面的js忽略
            return false;
        }
        return true;
    }).then(function (files) {
        var fileList = files.files;
        for (var i = 0; i < fileList.length; i++) {
            var item = fileList[i];
            var code = fs.readFileSync(item, 'utf-8');
            fs.writeFileSync(item, uglifyJS.minify(code).code)
        }
    });
};

/**
 * 处理css压缩
 */
var proccessCss=function () {
    getFiles.getFilenames("/Users/vinceyu/projects/_公司项目集合/微信前端h5/XiaoeWechatH5/public", function (file) {
        if (!utils.isEndWith(file, ".css")) {
            //不是js的忽略
            return false;
        } else if (file.indexOf(".min.") > -1) {
            //所有.min的js忽略
            return false;
        } else if (file.indexOf("/vue/") > -1) {
            //所有vue下面的js忽略
            return false;
        }
        return true;
    }).then(function (files) {
        var fileList = files.files;
        for (var i = 0; i < fileList.length; i++) {
            item = fileList[i];
            var code = fs.readFileSync(item, 'utf-8');
            var options = {};
            fs.writeFileSync(item, new cleanCSS(options).minify(code).styles);
        }
    });
};

/**
 * 开始处理各文件
 */
var proccessFiles = function () {
    //备份public目录
    utils.fileCopy(basePath, "public", "public_bak");
    //处理vue
    proccessVue();
    //处理js
    proccessJs();
    //处理css
    proccessCss();

    //建立现网锁
    utils.runShell("touch " + basePath + "public/ONLINE_VERSION_LOCK");
};

module.exports = {
    /**
     * 模块测试
     */
    test: function () {
        console.log("step10-prepare test!");
    },
    /**
     * 执行模块
     */
    run: run
};
/**
 * Created by qianlipp on 2017/6/14.
 * 项目预处理
 * 1、如果已经是在线状态，则恢复
 * 2、将要修改的文件拷贝到其他文件夹，备份，防止异常
 */
var fs = require("fs");
var uglifyJS = require("uglify-js");

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
 * 开始处理各文件
 */
var proccessFiles = function () {
    //编译vue文件
    var forVue = "alias cnpm='npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm --disturl=https://npm.taobao.org/dist --userconfig=$HOME/.cnpmrc'";
    forVue = forVue + " && cd " + basePath;
    forVue = forVue + " && cnpm install";
    forVue = forVue + " && cnpm run dist";
    utils.runShell(forVue);
    //开始处理js


    //备份public目录
    utils.fileCopy(basePath, "public", "public_bak");
    //建立现网public目录
    utils.runShell("mkdir " + basePath + "public");
    //建立现网锁
    utils.runShell("touch " + basePath + "public/ONLINE_VERSION_LOCK");
    //将入口文件拷贝到public
    utils.fileCopy(basePath, "public_bak/index.php", "public/index.php");
    //图片资源拷贝回来
    utils.fileCopy(basePath, "public_bak/images", "public/images");
    //直播原生php处理逻辑拷贝回来
    utils.fileCopy(basePath, "public_bak/original_php_tasks", "public/original_php_tasks");
    //拷贝favicon.ico回来
    utils.fileCopy(basePath, "public_bak/favicon.ico", "public/favicon.ico");

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
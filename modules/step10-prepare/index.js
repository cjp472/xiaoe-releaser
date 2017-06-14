/**
 * Created by qianlipp on 2017/6/14.
 * 项目预处理
 * 1、如果已经是在线状态，则恢复
 * 2、将要修改的文件拷贝到其他文件夹，备份，防止异常
 */
var utils = require("../_libs/utils");

var basePath = null;

var run = function (base_path) {
    basePath = base_path;
    if (!utils.isEndWith(basePath, "/")) {
        basePath = basePath + "/";
    }

    //恢复初始化
    revertStatus();
};

/**
 * 恢复到初始状态
 */
var revertStatus = function () {

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
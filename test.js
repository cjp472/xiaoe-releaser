/**
 * Created by qianlipp on 2017/6/14.
 */
var tool = require("./index");

var utils = require("./modules/_libs/utils");

// tool.test();

var getFiles = require('node-all-files');


getFiles.getFilenames("/Users/vinceyu/projects/_公司项目集合/微信前端h5/XiaoeWechatH5/public", function (file) {
    if(!utils.isEndWith(file, ".js")){
        //不是js的忽略
        return false;
    }else if (file.indexOf(".min.") > -1){
        //所有.min的js忽略
        return false;
    }else if (file.indexOf("/vue/") > -1){
        //所有vue下面的js忽略
        return false;
    }
    return true;
}).then(function (files) {
    console.log(files);
});

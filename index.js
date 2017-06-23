/**
 * Created by qianlipp on 2017/6/14.
 */
var prepare = require("./modules/step10-prepare/index");
var filesprocess = require("./modules/step20-filesprocess/index");
var publish = require("./modules/step30-publish/index");

module.exports = {
    test: function () {
        var path = "/Users/vinceyu/projects/_公司项目集合/微信前端h5/XiaoeWechatH5";
        prepare.run(path);
        filesprocess.run(path);
        publish.run(path);
        console.log("结束！！！");
    }
};
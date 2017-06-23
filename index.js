/**
 * Created by qianlipp on 2017/6/14.
 */
var prepare = require("./modules/step10-prepare/index");
var filesprocess = require("./modules/step20-filesprocess/index");
var publish = require("./modules/step30-publish/index");

var arguments = process.argv.splice(2);

var path = arguments[0];

var needDoVue = (arguments[1] == "vue");

prepare.run(path);
filesprocess.run(path, needDoVue);
publish.run(path);
console.log("结束！！！");
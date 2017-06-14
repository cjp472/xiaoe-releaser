/**
 * Created by qianlipp on 2017/6/14.
 */
var process = require('child_process');

/**
 * 是否以指定字符结尾
 * @param srcStr
 * @param dstStr
 */
var isEndWith = function (srcStr, dstStr) {
    if (srcStr == null || dstStr == null) {
        return false;
    }
    return (srcStr.indexOf(dstStr) + dstStr.length) == srcStr.length;
};

var runShell = function (shell) {
    process.exec(shell);
};

module.exports = {
    isEndWith: isEndWith,
    runShell: runShell
};
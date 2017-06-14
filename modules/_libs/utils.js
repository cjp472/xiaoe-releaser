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
/**
 * 执行shell命令
 * @param shell
 */
var runShell = function (shell) {
    process.exec(shell);
};

/**
 * 文件拷贝
 * @param basePath
 * @param srcPath
 * @param dstPath
 */
var fileCopy = function (basePath, srcPath, dstPath) {
    if (basePath == null) {
        basePath = "";
    }
    runShell("cp " + basePath + srcPath + " " + basePath + dstPath);
};

module.exports = {
    isEndWith: isEndWith,
    runShell: runShell,
    fileCopy: fileCopy,
};
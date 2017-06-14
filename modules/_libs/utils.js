/**
 * Created by qianlipp on 2017/6/14.
 */

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

module.exports = {
    isEndWith: isEndWith
};
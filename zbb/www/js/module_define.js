/**
 * @file 定义passport对象以及常用方法
 */

var passport = passport || window.passport || {};
// 定义模块用
passport._modulePool = passport._modulePool || {};
passport._define = passport._define || function (moduleName, fn) {
    passport._modulePool[moduleName] = fn && fn();
};
passport._getModule = passport._getModule || function (moduleName) {
    return passport._modulePool[moduleName];
};

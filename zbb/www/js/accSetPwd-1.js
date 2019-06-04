/**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api网络层错误信息(中文)
 * @Date: 2016-01-07
 */
/**
 * .tpl.js 为 js模板文件
 * .js 文件为自动生成，不可修改
 *  当调用的语言条目不存在时会alert条目名称
 */
function _(name) {
    alert("undefined:" + name);
}

var passport = passport || window.passport || {};
passport.err = passport.err || {};
(function (ns) {
    var lang = null;

    if ((typeof (ns.getCurrent)).toLowerCase() === "function") {
        lang = ns.getCurrent();
    } else {
        lang = {
            errMsg: {},
            labelText: {}
        };
    }

    lang.errMsg.accSetPwd = {

    };


    lang.labelText.accSetPwd = {
        "loginSuccessTip"    : '\u767b\u5f55\u6210\u529f！',
        "tip"                : '\u8bbe\u7f6e\u5bc6\u7801\u540e\u53ef\u4f7f\u7528\u5e10\u53f7\u002b\u5bc6\u7801\u767b\u5f55',
        "usernameTip"        : '\u8bbe\u7f6e\u7528\u6237\u540d\u548c\u5bc6\u7801\u540e\uff0c\u53ef\u91c7\u7528\u7528\u6237\u540d\u002f\u624b\u673a\u53f7\u002b\u5bc6\u7801\u7684\u5f62\u5f0f\u767b\u5f55\u767e\u5ea6\u7cfb\u6240\u6709\u4ea7\u54c1',
        "password"           : '\u5bc6\u7801',
        "passwordError"      : '\u5bc6\u7801\u683c\u5f0f\u9519\u8bef\u002c\u652f\u6301\u0038\u002d\u0031\u0034\u4f4d\u6570\u5b57\u002c\u5927\u5c0f\u5199\u5b57\u6bcd\u548c\u6807\u70b9\u7b26\u53f7', //密码格式错误,支持6-14位数字,大小写字母和标点符号
        "passwordAllNum"     : '\u5bc6\u7801\u4e0d\u80fd\u5168\u662f\u6570\u5b57',//密码不能全是数字
        "passHaveSpace"      : '\u5bc6\u7801\u0036\u002d\u0031\u0034\u4f4d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c',//密码6-14位不能含有空格
        "passLimitDigit"     : '\u5bc6\u7801\u0038\u002d\u0031\u0034\u4f4d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c', //密码8-14位不能含有空格
        "pwdPlaceholder"     : '\u8bf7\u8f93\u5165\u5bc6\u7801',
        "usernamePlaceholder": '\u6700\u957f\u0031\u0034\u4e2a\u82f1\u6587\u6216\u0037\u4e2a\u6c49\u5b57',
        "submit"             : '\u786e\u5b9a',
        "username"           : '\u7528\u6237\u540d',
        "userNameExistsError": '\u6b64\u7528\u6237\u540d\u592a\u53d7\u6b22\u8fce\u002c\u8bf7\u66f4\u6362\u4e00\u4e2a',
        "pwdChecklist_len"      : "\u957f\u5ea6\u4e3a\u0038\u007e\u0031\u0034\u4e2a\u5b57\u7b26",
        "pwdChecklist_cha"      : "\u652f\u6301\u6570\u5b57,\u5927\u5c0f\u5199\u5b57\u6bcd\u548c\u6807\u70b9\u7b26\u53f7",
        "pwdChecklist_spa"      : "\u4e0d\u5141\u8bb8\u6709\u7a7a\u683c"
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
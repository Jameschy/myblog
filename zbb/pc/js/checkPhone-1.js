/**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api网络层错误信息(中文)
 * @Date: 2012-11-27
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

    lang.errMsg.checkPhone = {

    };


    lang.labelText.checkPhone = {
        "tip"                      : '\u5c1a\u672a\u8bbe\u7f6e\u5bc6\u7801\uff0c\u9a8c\u8bc1\u624b\u673a\u540e\u5373\u53ef\u8bbe\u7f6e\u65b0\u5bc6\u7801',
        "verifyCode"               : '\u9a8c\u8bc1\u7801',
        "verifyCodePlaceholder"    : "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
        "sendcheckPhoneVerifyCode" : '\u53d1\u9001\u9a8c\u8bc1\u7801',
        "SMSKeyResendTip"          : '\u91cd\u65b0\u53d1\u9001',
        "backbtn"                  : '\u0026\u006c\u0074\u003b\u0026\u006c\u0074\u003b\u8fd4\u56de\u767b\u5f55',
        "submit"                   : '\u786e\u5b9a'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
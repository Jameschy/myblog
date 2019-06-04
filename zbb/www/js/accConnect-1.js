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

    lang.errMsg.accConnect = {

    };


    lang.labelText.accConnect = {
        "password"              : "\u5bc6\u7801",
        "bindTitle"             : "\u60a8\u7684\u5e10\u53f7\u4e3a(#{username})，\u8bf7\u8bbe\u7f6e\u65b0\u7684\u5bc6\u7801\uff0c\u9a8c\u8bc1\u901a\u8fc7\u540e\u5373\u53ef\u5347\u7ea7\u4e3a\u767e\u5ea6\u5e10\u53f7：",
        "mobileBtnText"         : "\u53d1\u9001\u624b\u673a\u9a8c\u8bc1\u7801",
        "emailBtnText"          : "\u53d1\u9001\u90ae\u7bb1\u9a8c\u8bc1\u7801",
        "vcode"                 : "\u9a8c\u8bc1\u7801",
        "bindTip"               : "\u6ce8\u518c\u6210\u529f\u540e\uff0c\u60a8\u7684\u5e10\u53f7\u53ef\u7528\u4e8e\u767b\u5f55\u767e\u5ea6\u6240\u6709\u4ea7\u54c1\u5982\u8d34\u5427\u3001\u6587\u5e93\u3001\u77e5\u9053\u3001\u5730\u56fe\u7b49",
        //"bindemailverifyCode"   : "\u53d1\u9001\u90ae\u7bb1\u9a8c\u8bc1\u7801",
        //"bindphoneverifyCode"   : "\u53d1\u9001\u624b\u673a\u9a8c\u8bc1\u7801",
        "submitText"            : "\u786e\u5b9a",
        "vcodeingText"          : "\u53d1\u9001\u4e2d...",
        "reSend"                : "\u91cd\u65b0\u53d1\u9001",
        "userListTitle"         : "\u7cfb\u7edf\u68c0\u6d4b\u5230\u60a8\u5df2\u6709\u767e\u5ea6\u5e10\u53f7\uff0c\u53ef\u76f4\u63a5\u5c06\u7cef\u7c73\u5e10\u53f7(#{username})\u5347\u7ea7\u81f3\u4ee5\u4e0b\u5e10\u53f7",
        "nextText"              : "\u4e0b\u4e00\u6b65",
        "userListTip"           : "\u5347\u7ea7\u540e\u53ef\u4ee5\u7528\u767e\u5ea6\u5e10\u53f7\u767b\u5f55\u7cef\u7c73\uff0c\u66f4\u5b89\u5168\u3001\u66f4\u65b9\u4fbf",
        "pwdTitle"              : "\u4e3a\u4e86\u786e\u4fdd\u662f\u60a8\u672c\u4eba\u64cd\u4f5c\uff0c\u8bf7\u9a8c\u8bc1\u767e\u5ea6\u5e10\u53f7(#{username})\u540e\u8fdb\u884c\u5347\u7ea7",
        "pwdAuthText"           : "\u4f7f\u7528\u767e\u5ea6\u5e10\u53f7\u767b\u5f55",
        "mobileLoginText"       : "\u77ed\u4fe1\u5feb\u6377\u767b\u5f55",
        "emailLoginText"        : "\u90ae\u7bb1\u9a8c\u8bc1\u767b\u5f55",
        "fgtPwd"                : "\u767b\u5f55\u9047\u5230\u95ee\u9898",
        "bindmobileverifyCode"  : "\u624B\u673A\u9A8C\u8BC1\u7801",
        "bindemailverifyCode"   : "\u90AE\u7BB1\u9A8C\u8BC1\u7801",
        'errorTitle'            : '\u975e\u5e38\u62b1\u6b49\uff0c\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5\uff0c<a href="http://passport.baidu.com/v2/?ucenterfeedback#upgrade_0" target="_blank">\u5e2e\u52a9\u4e2d\u5fc3</a>',
        "smsVerifyCode"         : "\u52a8\u6001\u5bc6\u7801",
        "emailVerifyCode"       : "\u90ae\u7bb1\u9a8c\u8bc1\u7801"
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
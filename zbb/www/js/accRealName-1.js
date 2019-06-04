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

    lang.errMsg.accRealName = {

    };
    lang.labelText.accRealName = {
        'loginSuccessTip': '\u767b\u5f55\u6210\u529f',
        'bindSuccess': '\u60a8\u5df2\u6210\u529f\u7ed1\u5b9a\u624b\u673a\u53f7',
        'bindSuccessTip': '\u4e0b\u6b21\u767b\u5f55\u53ef\u4f7f\u7528\u8be5\u624b\u673a\u53f7\u002b\u77ed\u4fe1\u9a8c\u8bc1\u7801\u767b\u5f55',
        "tip": '\u5e94\u56fd\u5bb6\u76f8\u5173\u6cd5\u5f8b\u8981\u6c42\uff0c\u81ea\u0036\u6708\u0031\u65e5\u8d77\u4f7f\u7528\u4fe1\u606f\u53d1\u5e03\u3001\u5373\u65f6\u901a\u8baf\u7b49\u4e92\u8054\u7f51\u670d\u52a1\u9700\u8fdb\u884c\u8eab\u4efd\u4fe1\u606f\u9a8c\u8bc1\u3002\u4e3a\u4fdd\u969c\u60a8\u5bf9\u76f8\u5173\u670d\u52a1\u529f\u80fd\u7684\u6b63\u5e38\u4f7f\u7528\uff0c\u5efa\u8bae\u60a8\u5c3d\u5feb\u5b8c\u6210\u624b\u673a\u53f7\u9a8c\u8bc1\uff0c\u611f\u8c22\u60a8\u7684\u7406\u89e3\u548c\u652f\u6301\u3002',
        'norecieveVcode': '\u6536\u4e0d\u5230\u9a8c\u8bc1\u7801\uff1f',
        "mobile"                : '\u624b\u673a\u53f7',
        "verifyCode"         : '\u9a8c\u8bc1\u7801',
        "mobilePlaceholder" : "\u8bf7\u8f93\u5165\u624b\u673a\u53f7",
        "verifyCodePlaceholder" : "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
        "sendRealNameVerifyCode"     : '\u53d1\u9001\u9a8c\u8bc1\u7801',
        'SMSKeyResendTip': '\u91cd\u65b0\u53d1\u9001',
        'confirmVerCodeEmpty': '\u9a8c\u8bc1\u7801\u4e3a\u7a7a',
        "submit"                : '\u786e\u5b9a',
        'realname_tip1': '\u60a8\u7684\u5e10\u53f7\u7b26\u5408\u56fd\u5bb6\u6cd5\u5f8b\u6cd5\u89c4\u8981\u6c42',
        "realname_tip2" : "\u8bf7\u653e\u5fc3\u4f7f\u7528\u767e\u5ea6\u670d\u52a1",
        "realname_notlogin_tip1" : "\u60a8\u7684\u8d26\u53f7\u5c1a\u672a\u767b\u5f55\uff0c\u767b\u5f55\u540e\u6839\u636e\u63d0\u793a",
        "realname_notlogin_tip2" : "\u5b8c\u6210\u5e10\u53f7\u5b9e\u540d\u9a8c\u8bc1"
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
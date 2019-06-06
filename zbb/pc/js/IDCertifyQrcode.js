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

    lang.errMsg.IDCertifyQrcode = {

    };
    lang.labelText.IDCertifyQrcode = {
        "IDCertifyQrcodeAppHref": 'http://xbox.m.baidu.com/mo/',
        'IDCertifyQrcodeAppName': '\u767e\u5ea6App',
        "IDCertifyQrcodeMsg": '\u8bf7\u4f7f\u7528<a href=\"#{IDCertifyQrcodeAppHref}\" target=\"_blank\">#{IDCertifyQrcodeAppName}</a>\u626b\u7801\u5b8c\u6210\u5237\u8138\u9a8c\u8bc1',
        "IDCertifyQrcodeSuccessTit": '\u626b\u63cf\u6210\u529f',
        'IDCertifyQrcodeSuccessMsg': '\u8bf7\u5728\u624b\u673a\u7aef\u5b8c\u6210\u5237\u8138\u9a8c\u8bc1',
        "IDCertifyQrcodeErrorTit": '\u7f51\u7edc\u94fe\u63a5\u5931\u8d25',
        "IDCertifyQrcodeErrorMsg": '\u8bf7\u7a0d\u5019\u518d\u8bd5',
        "IDCertifyQrcodeRefreshTit": '\u4e8c\u7ef4\u7801\u5df2\u5931\u6548',
        "IDCertifyQrcodeRefreshBtn": '\u5237\u65b0\u4e8c\u7ef4\u7801'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
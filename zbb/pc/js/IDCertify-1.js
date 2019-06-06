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

    lang.errMsg.IDCertify = {

    };
    lang.labelText.IDCertify = {
        "idnamePlaceholder" : '\u8bf7\u8f93\u5165\u672c\u4eba\u771f\u5b9e\u59d3\u540d',
        "idnameError" : '\u771f\u5b9e\u59d3\u540d',
        "idcardPlaceholder" : '\u8bf7\u8f93\u5165\u672c\u4eba\u8eab\u4efd\u8bc1\u53f7',
        "idcardError" : '\u8eab\u4efd\u8bc1\u53f7',
        "idcardFormatError" : '\u8eab\u4efd\u8bc1\u53f7\u683c\u5f0f\u4e0d\u6b63\u786e',
        "submit" : '\u7acb\u5373\u5b9e\u540d',
        "submitBtnLoading" : '\u8ba4\u8bc1\u4e2d\u002e\u002e\u002e',
        "submitPopLoading" : '\u6b63\u5728\u8ba4\u8bc1\u4e2d\uff0c\u8bf7\u7a0d\u7b49',
        'submitPopFinish': '\u606d\u559c\uff0c\u5df2\u5b8c\u6210\u5e10\u53f7\u5b9e\u540d',
        'unametip': '\u60a8\u5df2\u5728\u767e\u5ea6\u94b1\u5305\u7ed1\u5b9a\u4e86\u94f6\u884c\u5361\uff0c\u5b9e\u540d\u4fe1\u606f\u9700\u4e0e\u6301\u5361\u4eba\u4fe1\u606f\u4fdd\u6301\u4e00\u81f4\u3002\u5982\u9700\u66f4\u6539\uff0c\u8bf7\u5148\u5230\u767e\u5ea6\u94b1\u5305\u89e3\u7ed1\u94f6\u884c\u5361\u3002'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
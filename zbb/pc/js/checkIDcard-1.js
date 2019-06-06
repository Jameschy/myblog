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

    lang.errMsg.checkIDcard = {

    };


    lang.labelText.checkIDcard = {
        "tip"         : '\u4e3a\u4e86\u7ed9\u60a8\u63d0\u4f9b\u66f4\u5b89\u5168\u7684\u5e10\u53f7\u4f53\u9a8c\uff0c\u8bf7\u5b8c\u6210\u5b9e\u540d\u8ba4\u8bc1',
        "realname"    : '\u59d3\u540d',
        "idcard"      : '\u8eab\u4efd\u8bc1',
        "backbtn"     : '\u0026\u006c\u0074\u003b\u0026\u006c\u0074\u003b\u8fd4\u56de\u767b\u5f55',
        "frontIdcard"    : '\u8eab\u4efd\u8bc1\u6b63\u9762',
        "backIdcard"    : '\u8eab\u4efd\u8bc1\u53cd\u9762',
        "catchIdcard"    : '\u6301\u8bc1\u7167',
        "submit"      : '\u786e\u5b9a',
        "inrealname"  : '\u672c\u4eba\u59d3\u540d',
        "inidcard"    : '\u672c\u4eba\u8eab\u4efd\u8bc1\u53f7'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
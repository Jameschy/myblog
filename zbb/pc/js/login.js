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

    lang.errMsg.login = {
        '-1': {msg: '\u7cfb\u7edf\u9519\u8bef,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#login"  target="_blank">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: ''},
        "1": {msg: "\u60a8\u8f93\u5165\u7684\u5e10\u53f7\u683c\u5f0f\u4e0d\u6b63\u786e", field: "userName"},
        "2": {msg: "\u7528\u6237\u540d\u6216\u5bc6\u7801\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u6216<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\"  target=\"_blank\" >\u627e\u56de\u5bc6\u7801</a>", field: "userName"},
        "3": {msg: "\u9a8c\u8bc1\u7801\u4e0d\u5b58\u5728\u6216\u5df2\u8fc7\u671f,\u8bf7\u91cd\u65b0\u8f93\u5165", field: ""},
        "4": {msg: "\u60a8\u8f93\u5165\u7684\u5e10\u53f7\u6216\u5bc6\u7801\u6709\u8bef,<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\"  target=\"_blank\" >\u5fd8\u8bb0\u5bc6\u7801</a>\uff1f", field: "password"},
        "5": {msg: "", field: ""},
        "6": {msg: "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef", field: "verifyCode"},
        "7": {msg: "\u7528\u6237\u540d\u6216\u5bc6\u7801\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u6216<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\"  target=\"_blank\" >\u627e\u56de\u5bc6\u7801</a>", field: "password"},
        '16': {msg: '\u60a8\u7684\u5e10\u53f7\u56e0\u5b89\u5168\u95ee\u9898\u5df2\u88ab\u9650\u5236\u767b\u5f55,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#login"  target="_blank" >\u5e2e\u52a9\u4e2d\u5fc3</a>', field: ''},
        "257": {msg: "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801", field: "verifyCode"},
        "100027": {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: ''},
        "120016": {msg: "", field: ""},
        "18": {msg: "", field: ""},
        "19": {msg: "", field: ""},
        "20": {msg: "", field: ""},
        "21": {msg: "\u6ca1\u6709\u767b\u5f55\u6743\u9650", field: ""},
        "22": {msg: "", field: ""},
        "23": {msg: "", field: ""},
        '24': {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: ''},
        "400031": {msg: "\u8bf7\u5728\u5f39\u51fa\u7684\u7a97\u53e3\u64cd\u4f5c,\u6216\u91cd\u65b0\u767b\u5f55", field: ""},
        "400032": {msg: "", field: ""},
        "400034": {msg: "", field: ""},
        "401007": {msg: "\u60a8\u7684\u624b\u673a\u53f7\u5173\u8054\u4e86\u5176\u4ed6\u5e10\u53f7\uff0c\u8bf7\u9009\u62e9\u767b\u5f55", field: ""},
        "120021": {msg: "\u767b\u5f55\u5931\u8d25,\u8bf7\u5728\u5f39\u51fa\u7684\u7a97\u53e3\u64cd\u4f5c,\u6216\u91cd\u65b0\u767b\u5f55", field: ""},
        "500010": {msg: "\u767b\u5f55\u8fc7\u4e8e\u9891\u7e41,\u8bf724\u5c0f\u65f6\u540e\u518d\u8bd5", field: ""},
        "200010": {msg: "\u9a8c\u8bc1\u7801\u4e0d\u5b58\u5728\u6216\u5df2\u8fc7\u671f", field: ""},
        "100005": {msg: "\u7cfb\u7edf\u9519\u8bef,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5", field: ""},
        "120019": {msg: "\u8bf7\u5728\u5f39\u51fa\u7684\u7a97\u53e3\u64cd\u4f5c,\u6216\u91cd\u65b0\u767b\u5f55", field: "userName"},
        "110024": {msg: "\u6b64\u5e10\u53f7\u6682\u672a\u6fc0\u6d3b,<a href=\"#{gotourl}\" >\u91cd\u53d1\u9a8c\u8bc1\u90ae\u4ef6</a>", field: ""},
        "100023": {msg: "\u5f00\u542fCookie\u4e4b\u540e\u624d\u80fd\u767b\u5f55,<a href=\"http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#login\"  target=\"_blank\" >\u5982\u4f55\u5f00\u542f</a>?", field: ""},
        "17": {msg: "\u60a8\u7684\u5e10\u53f7\u5df2\u9501\u5b9a,\u8bf7<a href='http://passport.baidu.com/v2/?ucenterfeedback#login_10' target='_blank'>\u89e3\u9501</a>\u540e\u767b\u5f55", field: "userName"},
        "400401": {msg: "", field: ""},
        "400037": {msg: "", field: ""},
        "50023": {msg: "\u0031\u4e2a\u624b\u673a\u53f7\u0033\u0030\u65e5\u5185\u6700\u591a\u6362\u7ed1\u0033\u4e2a\u8d26\u53f7" , field:""},
        "50024": {msg: "\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5" , field:""},
        "50025": {msg: "\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff1b\u4e5f\u53ef\u4ee5\u901a\u8fc7\u4e0a\u884c\u77ed\u4fe1\u7684\u65b9\u5f0f\u8fdb\u884c\u6ce8\u518c" , field:""},
        '50028': {msg: '\u5e10\u53f7\u6216\u5bc6\u7801\u591a\u6b21\u8f93\u9519\uff0c\u8bf7\u0033\u4e2a\u5c0f\u65f6\u4e4b\u540e\u518d\u8bd5\u6216<a href="http://passport.baidu.com/?getpassindex&getpassType=financePwdError#{urldata}"  target="_blank">\u627e\u56de\u5bc6\u7801</a>', field: ''},
        '50029': {msg: '\u5e10\u53f7\u6216\u5bc6\u7801\u591a\u6b21\u8f93\u9519\uff0c\u8bf7\u0033\u4e2a\u5c0f\u65f6\u4e4b\u540e\u518d\u8bd5\u6216<a href="http://passport.baidu.com/?getpassindex&getpassType=pwdError#{urldata}"  target="_blank">\u627e\u56de\u5bc6\u7801</a>', field: ''},
        "50030": {msg: "\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u65e5\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7", field: ""},
        "50031": {msg: "\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u6708\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7", field: ""},
        "50032": {msg: "\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u672c\u5b63\u5ea6\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7", field: ""},
        '400413': {msg: '', field: ''},
        '400414': {msg: '', field: ''},
        '400415': {msg: '\u5e10\u53f7\u5b58\u5728\u98ce\u9669\uff0c\u4e3a\u4e86\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u8bf7\u5230\u767e\u5ea6\u94b1\u5305\u002f\u7406\u8d22\u002f\u5730\u56fe\u4efb\u4e00\u0041\u0050\u0050\u767b\u5f55\u5e76\u5b8c\u6210\u9a8c\u8bc1\uff0c\u8c22\u8c22', field: ''},
        '400500': {msg: '\u60a8\u767b\u5f55\u7684\u5e10\u53f7\u5df2\u6ce8\u9500\uff0c\u8bf7\u767b\u5f55\u5176\u4ed6\u5e10\u53f7\u6216\u91cd\u65b0\u6ce8\u518c', field: ''},
        '400702': {msg: '\u8be5\u624b\u673a\u53f7\u7801\u767b\u5f55\u529f\u80fd\u5df2\u5173\u95ed\uff0c\u8bf7\u901a\u8fc7\u7528\u6237\u540d\u548c\u5bc6\u7801\u767b\u5f55', field: 'userName'},
        /* eslint-disable max-len */
        '72200': {msg: '\u60a8\u7684\u5e10\u53f7\u56e0\u51bb\u7ed3\u6682\u65f6\u65e0\u6cd5\u767b\u5f55\uff0c\u8bf7\u524d\u5f80\u51bb\u7ed3\u65f6\u7684\u624b\u673a\u0041\u0050\u0050\uff0c\u5728\u767b\u5f55\u9875\u70b9\u51fb\u9047\u5230\u95ee\u9898\u8fdb\u884c\u89e3\u51bb', field: ''},
        /* eslint-disable max-len */
        '96001': {msg: '\u60a8\u7684\u5e10\u53f7\u56e0\u8fdd\u53cd\u767e\u5ea6\u7528\u6237\u534f\u8bae\u88ab\u9650\u5236\u767b\u5f55', field: ''},
        '100060': {msg: '因系统升级暂不支持注册，预计6月7日恢复服务', field: ''},
        '400703': {msg: '\u624b\u673a\u53f7\u5df2\u88ab\u8fd0\u8425\u5546\u4e8c\u6b21\u653e\u53f7\uff0c\u8bf7\u524d\u5f80\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0070\u0061\u0073\u0073\u0070\u006f\u0072\u0074\u002e\u0062\u0061\u0069\u0064\u0075\u002e\u0063\u006f\u006d\u002f\u0076\u0032\u002f\u003f\u0072\u0065\u0067\u6ce8\u518c\u65b0\u5e10\u53f7', field: ''}
    };

    lang.errMsg.checkVerifycode = {
        "500002": {msg: "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef", field: "verifyCode"},
        "500018": {msg: "\u9a8c\u8bc1\u7801\u5df2\u5931\u6548\uff0c\u8bf7\u91cd\u8bd5",field:"verifyCode"}
    };

    lang.labelText.login = {
        "agree"             : "\u9605\u8bfb\u5e76\u63a5\u53d7",
        "baiduUserProtocal" : "\u300a\u767e\u5ea6\u7528\u6237\u534f\u8bae\u300b",
        "verifyCode"        : "\u9a8c\u8bc1\u7801",
        "verifyCodeStaErr"  : "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef",
        "verifyCodeLenErr"  : "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef",
        'unReceiveSmsCode': '\u6536\u4e0d\u5230\u77ed\u4fe1\u9a8c\u8bc1\u7801\u003f',
        "captcha"           : "\u9a8c\u8bc1\u7801",
        "captchaErr"        : "\u60a8\u8f93\u5165\u7684\u52a8\u6001\u5bc6\u7801\u6709\u8bef,\u8bf7\u91cd\u8bd5",
        "captchaAlt"        : "\u9a8c\u8bc1\u7801\u56fe\u7247",
        "captchaChange"     : "\u6362\u4e00\u5f20",
        "memberPassLabel"   : "\u4e0b\u6b21\u81ea\u52a8\u767b\u5f55",
        "login"             : "\u767b\u5f55",
        "fgtPwd"            : "\u767b\u5f55\u9047\u5230\u95ee\u9898",
        'feedback'          : '\u5e2e\u52a9\u4e2d\u5fc3',
        "register"          : "\u7acb\u5373\u6ce8\u518c",
        "phoneNum"          : "\u624b\u673a\u53f7",
        "account"           : "\u90ae\u7bb1",
        "userName"          : "\u624b\u673a/\u90ae\u7bb1/\u7528\u6237\u540d",
        "password"          : "\u5bc6\u7801",
        "passwordResetWarnNo" : "\u7528\u6237\u540d\u6216\u5bc6\u7801\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u6216<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\"  target=\"_blank\" >\u627e\u56de\u5bc6\u7801</a>",
        "passwordResetSms"  : "<a href=\"javascript:void(0)\" onclick=\"var smDom=document.getElementsByClassName('pass-sms-btn');if(smDom.length>0){smDom[0].click();}\" >\u77ed\u4fe1\u767b\u5f55\u000d\u000a</a>,\u6216\u8005",
        "passwordResetWarn" : "\u7528\u6237\u540d\u6216\u5bc6\u7801\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165\u6216<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\"  target=\"_blank\" >\u627e\u56de\u5bc6\u7801</a>",
        "passwordResetIn"   : "\u4e2a\u6708\u4ee5\u5185",
        "passwordResetOut"  : "\u4e2a\u6708\u4ee5\u524d",
        "unameMailLengthError": "\u90ae\u7bb1\u8fc7\u957f,\u8bf7\u91cd\u65b0\u8f93\u5165",
        "unameInputError"   : "\u90ae\u7bb1\u683c\u5f0f\u9519\u8bef,\u82e5\u672a\u7ed1\u5b9a\u90ae\u7bb1,\u8bf7\u4f7f\u7528\u7528\u6237\u540d\u767b\u5f55",
        "smsPhone"          : "\u624b\u673a\u53f7",
        "smsPhoneMsg"       : "\u8bf7\u8f93\u5165\u624b\u673a\u53f7",
        "smsVerifyCode"     : "\u52a8\u6001\u5bc6\u7801",
        "logining"          : "\u767b\u5f55\u4e2d...",
        "loginsuccess"      : "\u767b\u5f55\u6210\u529f",
        "submitTimeup"      : "\u767b\u5f55\u8d85\u65f6,\u8bf7\u7a0d\u540e\u518d\u8bd5",
        "backToLogin"       : "\u5e10\u53f7\u5bc6\u7801\u767b\u5f55",
        'qrcodeTitle': '\u8bf7\u4f7f\u7528<span>\u767e\u5ea6App</span>\u626b\u7801\u767b\u5f55',
        'qrcodeMsg': '\u767e\u5ea6\u6280\u672f\u52a0\u5bc6\uff0c\u4fdd\u969c\u60a8\u7684\u9690\u79c1\u5b89\u5168',
        'appName': '\u767e\u5ea6App',
        "appHref"           : "http://xbox.m.baidu.com/mo/",
        "sysError"          : "\u7cfb\u7edf\u9519\u8bef\uff0c\u4f11\u606f\u4e00\u4f1a\u513f\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5",
        "sysUpdate"         : "\u670d\u52a1\u6b63\u5728\u5347\u7ea7\u4e2d,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5",
        "cookieDisable"     : "\u5f00\u542fCookie\u4e4b\u540e\u624d\u80fd\u767b\u5f55,<a href=\"http://passport.baidu.com/v2/?ucenterfeedback#login\"  target=\"_blank\" >\u5982\u4f55\u5f00\u542f</a>?",
        "captchaErr"        : "\u52a8\u6001\u5bc6\u7801\u9519\u8bef",
        "confirmVerCodeEmpty"   : "\u9a8c\u8bc1\u7801\u4e3a\u7a7a",
        "foreignToLogin"    : "\u5e10\u53f7\u5bc6\u7801\u767b\u5f55",
        "foreignMobileError": "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u4e0d\u6b63\u786e",
        "foreignMobileMsg"  : "\u6d77\u5916\u624b\u673a\u53f7\u767b\u5f55<span>\u8bf7\u9009\u62e9\u60a8\u7684\u56fd\u5bb6\u5730\u533a</span>", 
        'foreignMobileLink': '\u6d77\u5916\u624b\u673a\u53f7',
        'QrcodeSuccessTip': '\u626b\u63cf\u6210\u529f',
        'QrcodeSuccessMsg': '\u8bf7\u5728\u624b\u673a\u7aef\u786e\u8ba4\u767b\u5f55',
        'QrcodeErrorTip': '\u7f51\u7edc\u8fde\u63a5\u5931\u8d25',
        'QrcodeErrorMsg': '\u8bf7\u7a0d\u5019\u518d\u8bd5',
        'QrcodeRefreshTip': '\u4e8c\u7ef4\u7801\u5df2\u5931\u6548',
        'QrcodeRefreshBtn': '\u5237\u65b0\u4e8c\u7ef4\u7801',
        'QrcodeLoadTip': '\u4e8c\u7ef4\u7801\u52a0\u8f7d\u5931\u8d25',
        'nopassLead': '\u8be5\u5e10\u53f7\u5c1a\u672a\u8bbe\u7f6e\u5bc6\u7801\uff0c\u8bf7\u5148<a href="http://passport.baidu.com/?getpassindex" target="_blank" >\u8bbe\u7f6e\u5bc6\u7801</a>\u540e\u5728\u767b\u5f55'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
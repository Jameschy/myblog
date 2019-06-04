/**
 * @file 游客账号正常化
 */
/*globals passport, magic*/
function _(name) {
    alert('undefined:' + name);
}

var passport = passport || window.passport || {};
passport.err = passport.err || {};
(function (ns) {
    var lang = null;

    if ((typeof (ns.getCurrent)).toLowerCase() === 'function') {
        lang = ns.getCurrent();
    } else {
        lang = {
            errMsg: {},
            labelText: {}
        };
    }

    lang.errMsg.travelComplete = {

    };
    lang.labelText.travelComplete = {
        'tip': '\u8bf7\u7ed1\u5b9a\u624b\u673a\u53f7',
        'norecieveVcode': '\u6536\u4e0d\u5230\u9a8c\u8bc1\u7801\uff1f',
        'mobile': '\u624b\u673a\u53f7',
        'verifyCode': '\u9a8c\u8bc1\u7801',
        'mobilePlaceholder': '\u8bf7\u8f93\u5165\u624b\u673a\u53f7',
        'verifyCodePlaceholder': '\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801',
        'sendtravelCompleteVerifyCode': '\u53d1\u9001\u9a8c\u8bc1\u7801',
        'SMSKeyResendTip': '\u91cd\u65b0\u53d1\u9001',
        'confirmVerCodeEmpty': '\u9a8c\u8bc1\u7801\u4e3a\u7a7a',
        'submit': '\u786e\u5b9a',
        'travelComplete_notlogin_tip1': '\u60a8\u7684\u8d26\u53f7\u5c1a\u672a\u767b',
        'travelComplete_notlogin_tip2': '\u5b8c\u6210\u5e10\u53f7\u5b9e\u540d\u9a8c\u8bc1'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
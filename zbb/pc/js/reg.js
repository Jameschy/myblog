/**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api网络层错误信息(中文)
 * @Date: 2012-11-27
 */

var passport = passport || window.passport || {};
passport.err = passport.err || {};
(function(ns) {
    var lang = null;

    if ((typeof (ns.getCurrent)).toLowerCase() === "function") {
        lang = ns.getCurrent();
    } else {
        lang = {
            errMsg: {},
            labelText: {}
        };
    }

    lang.errMsg.reg = {
                '-1':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u4f11\u606f\u4e00\u4f1a\u513f,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "100027": {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: 'isAgree'},
                // checkUserName
                "110002": {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                '130006': {msg: '\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'userName'},
                '130007': {msg: '\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'userName'},
                //checkMail
                "110023": {msg: "\u8be5\u90ae\u7bb1\u5df2\u6ce8\u518c\u53ef<a href=\"http://passport.baidu.com/v2/?login#{urldata}\">\u76f4\u63a5\u767b\u5f55</a>,\u5982\u5fd8\u8bb0\u5bc6\u7801<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\">\u70b9\u6b64\u5904\u627e\u56de</a>" , field: "email"},
                "110024": {msg: "\u8be5\u90ae\u7bb1\u5df2\u88ab\u6ce8\u518c,\u4f46\u672a\u6fc0\u6d3b,\u8bf7\u5230\u9a8c\u8bc1\u90ae\u4ef6\u4e2d\u6fc0\u6d3b\u6216\u8005<a href=\"#{gotourl}\" target=\"_blank\">\u91cd\u53d1\u9a8c\u8bc1\u90ae\u4ef6</a>" , field: "email"},
                "130036": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>" , field: "email"},
                //reg
                "10":     {msg: "\u8bf7\u60a8\u586b\u5199\u7528\u6237\u540d" , field: "userName"},
                "11":     {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                "12":     {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                "14":     {msg: "\u6b64\u7528\u6237\u540d\u592a\u53d7\u6b22\u8fce,\u8bf7\u66f4\u6362\u4e00\u4e2a" , field: "userName"},
                "15":     {msg: "\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528" , field: "userName"},
                '16':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "20":     {msg: "\u8bf7\u586b\u5199\u5bc6\u7801" , field: "password"},
                "21":     {msg: "\u5bc6\u7801\u5fc5\u987b\u75318-14\u4e2a\u5b57\u7b26\u7ec4\u6210" , field: "password"},
                "22":     {msg: "\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4" , field: "verifyPass"},
                "23":     {msg: "\u5bc6\u7801\u4ec5\u80fd\u7531\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7\u7ec4\u6210 / \u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c" , field: "password"},
                "24":     {msg: "\u60a8\u7684\u5bc6\u7801\u592a\u8fc7\u7b80\u5355,\u8bf7\u4f7f\u7528\u5b57\u6bcd\u548c\u6570\u5b57\u7684\u7ec4\u5408,\u5426\u5219\u65e0\u6cd5\u6ce8\u518c\u6210\u529f" , field: "password"},
                "30":     {msg: "\u8bf7\u60a8\u8f93\u5165\u65b0\u7684\u90ae\u7bb1" , field: "email"},
                "31":     {msg: "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef,\u8bf7\u91cd\u65b0\u8f93\u5165" , field: "email"},
                "40":     {msg: "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801" , field: "verifyCode"},
                "41":     {msg: "\u9a8c\u8bc1\u7801\u683c\u5f0f\u9519\u8bef" , field: "verifyCode"},
                "42":     {msg: "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef" , field: "verifyCode"},
                '-2':     {msg: '\u670d\u52a1\u6b63\u5728\u5347\u7ea7\u4e2d,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field:''}
            };
// 发短信接口文案
    lang.errMsg.regPhone = {
                '-1':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u4f11\u606f\u4e00\u4f1a\u513f,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "100027": {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: 'isAgree'},
                "130018": {msg: "\u8bf7\u60a8\u8f93\u5165\u624b\u673a\u53f7" , field: "phone"},
                "130019": {msg: "\u60a8\u8f93\u5165\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef" , field: "phone"},
                '130020': {msg: '\u8be5\u624b\u673a\u5df2\u6ce8\u518c\u53ef\u76f4\u63a5\u767b\u5f55', field: 'phone'},
                "130035": {msg: "\u60a8\u7684\u624b\u673a\u53f7\u5df2\u88ab\u6ce8\u518c,\u8bf7<a href=\"http://passport.baidu.com/v2/?login#{urldata}\">\u76f4\u63a5\u767b\u5f55</a>\u6216\u66f4\u6362\u624b\u673a\u53f7\u6ce8\u518c" , field: "phone"},
                "130017": {msg: "\u53d1\u9001\u77ed\u4fe1\u8fc7\u591a,\u8bf724\u5c0f\u65f6\u540e\u518d\u8bd5" , field: "verifyCodeSend"},
                "130038": {msg: "\u53d1\u9001\u77ed\u4fe1\u8fc7\u4e8e\u9891\u7e41,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5" , field: "verifyCodeSend"},
                "130010": {msg: "\u8bf7\u60a8\u8f93\u5165\u5bc6\u7801" , field: "password"},
                "130011": {msg: "\u5bc6\u7801\u5fc5\u987b\u75318-14\u4e2a\u5b57\u7b26\u7ec4\u6210" , field: "password"},
                "110013": {msg: "\u5bc6\u7801\u4ec5\u652f\u6301\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7,\u4e14\u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c" , field: "password"},
                "110012": {msg: "\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355,\u5efa\u8bae\u4f7f\u7528\u6570\u5b57\u52a0\u5b57\u6bcd\u7ec4\u5408,\u5426\u5219\u65e0\u6cd5\u6ce8\u518c\u6210\u529f" , field: "password"},
                "130023": {msg: "\u8bf7\u8f93\u5165\u77ed\u4fe1\u6fc0\u6d3b\u7801" , field: "smsCode"},
                "130021": {msg: "\u8bf7\u60a8\u8f93\u5165\u77ed\u4fe1\u6fc0\u6d3b\u7801" , field: "smsCode"},
                "130022": {msg: "\u77ed\u4fe1\u6fc0\u6d3b\u7801\u9519\u8bef" , field: "smsCode"},
                "130003": {msg: "\u60a8\u8f93\u5165\u7684\u77ed\u4fe1\u6fc0\u6d3b\u7801\u6709\u8bef" , field: "smsCode"},
                "130036": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>" , field: "smsCode"},
                "130037": {msg: "\u6fc0\u6d3b\u7801\u9519\u8bef\u6b21\u6570\u8fc7\u591a,\u8bf724\u5c0f\u65f6\u540e\u91cd\u65b0\u6ce8\u518c" , field: "smsCode"},
                "130004": {msg: "\u6fc0\u6d3b\u7801\u5df2\u5931\u6548,\u8bf7\u60a8\u91cd\u65b0\u83b7\u53d6" , field: "smsCode"},
                "130032": {msg: "\u60a8\u8fd8\u672a\u63a5\u53d7\u767e\u5ea6\u7528\u6237\u534f\u8bae,\u8bf7\u52fe\u9009" , field: "isAgree"},
                '130039': {msg: '\u7cfb\u7edf\u7e41\u5fd9,\u8bf7\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "130040": {msg: "" , field: ""},
                '130044': {msg: '\u7cfb\u7edf\u68c0\u6d4b\u5230\u5f53\u524d\u5e10\u53f7\u901a\u8fc7\u975e\u6cd5\u6e20\u9053\u6ce8\u518c\uff0c\u4e3a\u4e86\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7\u91cd\u8bd5', field: ''},
                "130041": {msg: "\u9a8c\u8bc1\u7801\u4e3a\u7a7a" , field: "confirmVerifyCode"},
                "130042": {msg: "\u9a8c\u8bc1\u7801\u9519\u8bef" , field: "confirmVerifyCode"},
                '340001': {msg: '网络不给力， 请刷新重试 ,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: ''},
                '400001': {msg: '已被其他帐号绑定', field: 'phone'},
                '400003': {msg: '已被其他帐号绑定', field: 'phone'},
                "400005": {msg: "已被其他帐号绑定" , field:"phone"},
        '400603': {msg: '\u5f53\u524d\u60a8\u7684\u624b\u673a\u53f7\u7801\u4ec5\u652f\u6301\u5feb\u901f\u6ce8\u518c\uff0c\u8bf7\u60a8\u91c7\u7528\u5feb\u901f\u6ce8\u518c\u65b9\u5f0f\uff0c\u6ce8\u518c\u767e\u5ea6\u5e10\u53f7', field: 'phone'},
                "50023": {msg: "\u0031\u4e2a\u624b\u673a\u53f7\u0033\u0030\u65e5\u5185\u6700\u591a\u6362\u7ed1\u0033\u4e2a\u8d26\u53f7" , field:"phone"},
                "50024": {msg: "\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5" , field:""},
        '50025': {msg: '\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff1b\u4e5f\u53ef\u4ee5\u901a\u8fc7\u4e0a\u884c\u77ed\u4fe1\u7684\u65b9\u5f0f\u8fdb\u884c\u6ce8\u518c', field: ''},
        '50030': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u65e5\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50031': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u6708\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50032': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u672c\u5b63\u5ea6\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50036': {msg: '\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5'},
        '130045': {msg: '系统检测到当前帐号通过非法渠道注册，为了您的帐号安全，请使用正规渠道注册', field: 'verifyCode'},
        '50043': {msg: '当前浏览器版本过低，请升级或更换浏览器后重试', field: ''},
        '100060': {msg: '因系统升级暂不支持注册，预计6月7日恢复服务', field: 'verifyCode'},
                "71000" : {msg: "" , field:""}
            };

    lang.labelText.reg = {
                "captcha"               : "\u9a8c\u8bc1\u7801",
                "captchaAlt"            : "\u9a8c\u8bc1\u7801\u56fe\u7247",
                "captchaChange"         : "\u6362\u4e00\u5f20",
                "captchaTip"            : "\u8bf7\u8f93\u5165\u56fe\u7247\u4e2d\u7684\u5b57\u7b26,\u4e0d\u533a\u5206\u5927\u5c0f\u5199",
                "agree"                 : "\u9605\u8bfb\u5e76\u63a5\u53d7",
                "password"              : "\u5bc6\u7801",
                "passwordPlaceholder"   : "\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801",
                "baiduUserProtocal"     : "\u300a\u767e\u5ea6\u7528\u6237\u534f\u8bae\u300b",
                "getSMSKey"             : "\u83b7\u53d6\u77ed\u4fe1\u9a8c\u8bc1\u7801",
                "register"              : "\u6ce8\u518c",
                "strength"              : "\u5f3a\u5ea6\uff1a",
                "strengthTip"           : "\u5bc6\u7801\u957f\u5ea66~14\u4f4d,\u5b57\u6bcd\u533a\u5206\u5927\u5c0f\u5199",
                "phoneNum"              : "\u624b\u673a\u53f7",
                "phoneNumTip"           : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7,\u5176\u4ed6\u7528\u6237\u4e0d\u53ef\u89c1",
                "foreignMobileError"    : "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u4e0d\u6b63\u786e",
                "SMSKey"                : "\u77ed\u4fe1\u6fc0\u6d3b\u7801",
                "SMSKeyTip"             : "\u8bf7\u8f93\u5165\u60a8\u624b\u673a\u77ed\u4fe1\u4e2d\u7684\u6fc0\u6d3b\u7801",
                "SMSKeySendTip"         : "\u77ed\u4fe1\u6fc0\u6d3b\u7801\u5df2\u53d1\u9001,\u8bf7\u60a8\u572830\u5206\u949f\u5185\u586b\u5199\u3002<a href=\"http://help.baidu.com/question?prod_en=passport&class=%D7%A2%B2%E1%BC%B0%B5%C7%C2%BC&id=1000318\" target=\"_blank\">\u65e0\u6cd5\u83b7\u53d6</a>\uff1f",
                'VoiceKeySendTip': '\u8bed\u97f3\u6fc0\u6d3b\u7801\u5df2\u53d1\u9001\u002c\u8bf7\u60a8\u5728\u0033\u0030\u5206\u949f\u5185\u586b\u5199\u3002<a href=\"http://help.baidu.com/question?prod_en=passport&class=%D7%A2%B2%E1%BC%B0%B5%C7%C2%BC&id=1000318\" target=\"_blank\">\u65e0\u6cd5\u83b7\u53d6</a>\uff1f',
                "SMSKeyResendTip"       : "\u79d2\u540e\u91cd\u65b0\u83b7\u53d6\u6fc0\u6d3b\u7801",
                "SMSKeyResendTipMerge"  : "\u91cd\u65b0\u53d1\u9001",
                "account"               : "\u624b\u673a/\u90ae\u7bb1",
                "accountTip"            : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7\u6216\u5e38\u7528\u90ae\u7bb1,\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801,\u6ce8\u518c\u6210\u529f\u540e,\u6240\u6709\u767e\u5ea6\u4ea7\u54c1\u901a\u7528",
                "account_username"      : "\u5e10\u53f7",
                "accountTip_username"   : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7/\u5e38\u7528\u90ae\u7bb1/\u7528\u6237\u540d",
                "email"                 : "\u90ae\u7bb1",
                "emailTip"              : "\u8bf7\u8f93\u5165\u5e38\u7528\u90ae\u7bb1,\u901a\u8fc7\u9a8c\u8bc1\u540e\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801",
                "userName"              : "\u7528\u6237\u540d",
                "userNamePlaceholder"   : "\u8bf7\u8bbe\u7f6e\u7528\u6237\u540d",
                "userNameTip"           : "\u8bbe\u7f6e\u540e\u4e0d\u53ef\u66f4\u6539<br>\u4e2d\u82f1\u6587\u5747\u53ef\uff0c\u6700\u957f\u0031\u0034\u4e2a\u82f1\u6587\u6216\u0037\u4e2a\u6c49\u5b57",
                "confirmPassword"       : "\u786e\u8ba4\u5bc6\u7801",
                "mailLengthError"       : "\u90ae\u7bb1\u5730\u5740\u8fc7\u957f,\u8bf7\u66f4\u6362\u8f83\u77ed\u90ae\u7bb1,\u603b\u4f53\u4e0d\u8d85\u8fc760\u4e2a\u5b57\u7b26",
                "mainEmailError"        : "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>",
                "pwdCharError"          : "\u5bc6\u7801\u4ec5\u652f\u6301\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7,\u4e14\u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c",
                "matchPwdError"         : "\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4",
                "pwdLengthError"        : "\u5bc6\u7801\u5fc5\u987b\u7531\u0038\u002d\u0031\u0034\u4e2a\u5b57\u7b26\u7ec4\u6210",
                'checkLicenseError': '\u8bf7\u52fe\u9009\u201c\u9605\u8bfb\u5e76\u63a5\u53d7\u767e\u5ea6\u7528\u6237\u534f\u8bae\u201d',
                "userNameRulesError"    : "\u7528\u6237\u540d\u4e0d\u80fd\u8d85\u8fc77\u4e2a\u6c49\u5b57\u621614\u4e2a\u5b57\u7b26",
                "userNameNumberError"   : "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57",
                "weakPwdError"          : "\u60a8\u7684\u5bc6\u7801\u592a\u8fc7\u7b80\u5355,\u8bf7\u4f7f\u7528\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u7b26\u53f7\u7684\u7ec4\u5408,\u4ee5\u4fbf\u5b8c\u6210\u6ce8\u518c",
                "userNameExistsError"   : "\u6b64\u7528\u6237\u540d\u592a\u53d7\u6b22\u8fce,\u8bf7\u66f4\u6362\u4e00\u4e2a",
                "nopwd"                 : "",
                "nopwdMsg"              : "\u8bf7\u8f93\u5165\u5bc6\u7801",
                "weak"                  : "\u5f31",
                "weakMsg"               : "\u8bf7\u91cd\u65b0\u8bbe\u7f6e,\u8bd5\u8bd5\u6570\u5b57\u3001\u5b57\u6bcd\u3001\u7b26\u53f7\u7ec4\u5408",
                "middle"                : "\u4e2d",
                "middleMsg"             : "\u60a8\u7684\u5bc6\u7801\u8fd8\u53ef\u4ee5\u66f4\u590d\u6742\u4e9b",
                "strong"                : "\u5f3a",
                "strongMsg"             : "\u60a8\u7684\u5bc6\u7801\u5f88\u5b89\u5168,\u8bf7\u7262\u8bb0\uff01",
                "placeholder"           : "\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801",
                "regMergePlaceholder"   : "\u624b\u673a/\u90ae\u7bb1",
                "regMergePlaceholder_username": "\u624b\u673a/\u90ae\u7bb1/\u7528\u6237\u540d",
                "matchGmailError"       : "gmail\u90ae\u7bb1\u6536\u4fe1\u65f6\u4f1a\u81ea\u52a8\u8fc7\u6ee4\u7528\u6237\u540d\u5185\u7684\u5706\u70b9,\u60a8\u53ef\u4ee5\u53bb\u6389\u7528\u6237\u540d\u5185\u7684\u5706\u70b9\u76f4\u63a5\u6ce8\u518c",
                "emailLimitError"       : "\u4e0d\u80fd\u4f7f\u7528\u8be5\u90ae\u7bb1",
                "accountMergeError"     : "\u8bf7\u586b\u5199\u6b63\u786e\u7684\u624b\u673a/\u90ae\u7bb1",
                "accountEmpty"          : "\u90ae\u7bb1/\u624b\u673a",
                "accountEmpty_username" : "\u90ae\u7bb1/\u624b\u673a/\u7528\u6237\u540d",
                "emailEmptyError"       : "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef,\u8bf7\u91cd\u65b0\u8f93\u5165",
                "phoneEmptyError"       : "\u60a8\u586b\u5199\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef,\u8bf7\u8f93\u516511\u4f4d\u5927\u9646\u624b\u673a\u53f7",
                "confirmVerCodeEmpty"   : "\u9a8c\u8bc1\u7801\u4e3a\u7a7a",
                "pwdChecklist_len"      : "\u957f\u5ea6\u4e3a\u0038\u007e\u0031\u0034\u4e2a\u5b57\u7b26",
                "pwdChecklist_cha"      : "\u652f\u6301\u6570\u5b57,\u5927\u5c0f\u5199\u5b57\u6bcd\u548c\u6807\u70b9\u7b26\u53f7",
                "pwdChecklist_spa"      : "\u4e0d\u5141\u8bb8\u6709\u7a7a\u683c",
                "verifyCode"            : "\u9a8c\u8bc1\u7801",
                "verifyCodePlaceholder" : "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
                "smsVerifyCode"         : "\u77ed\u4fe1\u6fc0\u6d3b\u7801",
                "sysUpdate"             : "\u670d\u52a1\u6b63\u5728\u5347\u7ea7\u4e2d,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5",
                "multiTip"              : "\u4e00\u4e2a\u624b\u673a\u53f7\u7ed1\u5e26\u591a\u4e2a\u5e10\u53f7\uff1f<a href='http://passport.baidu.com/export/multi/index.html' target='_blank'>\u7acb\u5373\u4f53\u9a8c</a>",
                "notsafeMsg"            : "\u4e3a\u4e86\u63d0\u5347\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u5efa\u8bae\u4e0d\u8981\u4f7f\u7528\u60a8\u7684\u5e38\u7528\u5bc6\u7801\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
                'notsafe': '',
        'baiduPersonalProtocal': '\u300a\u767e\u5ea6\u9690\u79c1\u6743\u4fdd\u62a4\u58f0\u660e\u300b',
        'sysError': '\u7cfb\u7edf\u9519\u8bef\uff0c\u4f11\u606f\u4e00\u4f1a\u513f\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5'
    };

    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
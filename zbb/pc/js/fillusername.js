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
    lang.errMsg.fillUserName = {
                '-1'    : {msg: "\u7cfb\u7edf\u9519\u8bef\uff0c\u4f11\u606f\u4e00\u4f1a\u513f\uff0c\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5" , field: ""},
                '11'    : {msg: "\u7528\u6237\u540d\u6700\u957f\u4e0d\u5f97\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282\uff08\u534a\u89d2\u6570\u5b57\u3001\u534a\u89d2\u5b57\u6bcd\u6216\u4e0b\u5212\u7ebf\uff09" , field: "userName"},
                '160100': {msg: "\u8bf7\u586b\u5199\u7528\u6237\u540d" , field: "userName"},
                '160102': {msg: "\u8bf7\u767b\u5f55\u540e\u518d\u8865\u586b" , field: "userName"},
                '160103': {msg: "\u8bf7\u767b\u5f55\u540e\u518d\u8865\u586b" , field: ""},
                '160111': {msg: "\u6b64\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u53e6\u6362\u4e00\u4e2a" , field: "userName"},
                '160104': {msg: "\u60a8\u5df2\u5b8c\u6210\u7528\u6237\u540d\u8865\u586b" , field: ""},
                '160105': {msg: "\u6b64\u7528\u6237\u540d\u4e0d\u53ef\u4f7f\u7528" , field: "userName"},
                '160110': {msg: "\u7528\u6237\u540d\u4ec5\u53ef\u4f7f\u7528\u6c49\u5b57\u3001\u6570\u5b57\u3001\u5b57\u6bcd\u548c\u4e0b\u5212\u7ebf" , field: "userName"}
            };
    lang.labelText.fillUserName = {
                "nextStep"              : "\u7ee7\u7eed",
                "userName"              : "\u7528\u6237\u540d",
                "userNameExistsError"   : "\u6b64\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c\uff0c\u8bf7\u53e6\u6362\u4e00\u4e2a",
                "userNameRulesError"    : "\u7528\u6237\u540d\u6700\u957f\u4e0d\u5f97\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282\uff08\u534a\u89d2\u6570\u5b57\u3001\u534a\u89d2\u5b57\u6bcd\u6216\u4e0b\u5212\u7ebf\uff09\uff0c\u4e14\u4e0d\u80fd\u662f\u7eaf\u6570\u5b57"
            };
    
    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
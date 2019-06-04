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
    lang.labelText.confirmWidget = {
                "Cancel" : "取消",
                "Continue" : "继续"
            };
    
    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
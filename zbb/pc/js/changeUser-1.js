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
    lang.errMsg.changeUser = {
                '-1'    : {msg: "系统错误，休息一会儿，请您稍后再试" , field: ""},
                '400011': {msg: "您输入的帐号或密码有误,<a href='http://passport.baidu.com/?getpassindex#{urldata}'  target='_blank' >忘记密码</a>？" , field: "password"},
                '401000': {msg: "您输入的用户名已经关联了手机号了，请更换其他用户名后重试" , field: "userName"},
                '401004': {msg: "已存在，并且用户名可用" , field: "userName"},
                '401002': {msg: "您关联的帐号已达上限，请解除其他关联帐号后再试",field: ""},
                '400021': {msg: "切换用户失败，您当前帐号暂未登录",field: ""},
                '16'    : {msg: "切换用户失败，您当前帐号已被封禁",field: ""}
            };
    lang.labelText.changeUser = {
                "add"                : "添加关联",
                "sysError"           : "切换用户失败，请您稍后再试"
            };
    
    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
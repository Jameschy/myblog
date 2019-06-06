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
    lang.errMsg.multiBind = {
                '-1'    : {msg: "系统错误，休息一会儿，请您稍后再试" , field: ""},
                '200002': {msg: "您当前登录的帐号未补填用户名，请<a href='http://passport.baidu.com/v2/?ucenteradduname' target='_blank'>补填用户名</a>后再试", field: ""},
                '200003': {msg: "请输入密码", field: ""},
                '230048': {msg: "用户名仅支持中英文、数字和下划线,且不能为纯数字。" , field: "userName"},
                '230054': {msg: "用户名格式错误，请切换输入法至半角字符。" , field: "userName"},
                '400011': {msg: "您输入的帐号或密码有误,<a href='http://passport.baidu.com/?getpassindex#{urldata}'  target='_blank' >忘记密码</a>？" , field: "password"},
                '401000': {msg: "您的用户名已经关联其他手机号，请更换用户名或先解除关联" , field: "userName"},
                '401004': {msg: "已存在，并且用户名可用" , field: "userName"},
                '230049': {msg: "该用户名不能使用，请更换一个" , field: "userName"},
                '230053': {msg: "用户名仅支持中英文、数字和下划线,且不能为纯数字" , field: "userName"},
                '401001': {msg: "您的帐号暂未绑定手机号，请绑定手机后再试。" , field: ""},
                '401002': {msg: "您的手机号已到达关联上限！您可以解除不常用的帐号后重试。",field: ""},
                '401003': {msg: "您当前登录的用户未补填用户名，请<a href='http://passport.baidu.com/v2/?ucenteradduname' target='_blank'>补填用户名</a>后再试",field: ""},
                '401004': {msg: "已存在，并且用户名可用" , field: "userName"},
                '401005': {msg: "您要解除关联的用户名未绑定邮箱，请绑定邮箱后刷新页面重试。" , field: "userName"},
                '401008': {msg: "您今天关联帐号过于频繁，请明天再尝试" , field: "userName"},
                '401009': {msg: "您操作过于频繁，请稍后再试" , field: "userName"},
                '401010': {msg: "为保证帐号安全，请先<a href='http://passport.baidu.com/?getpassindex#{urldata}'  target='_blank' >找回密码</a>后再进行帐号关联" , field:"password"},
                '401011': {msg: "您当前关联的帐号存在安全风险，请稍后再试", field: "userName"},
                '400021': {msg: "关联帐号失败，您当前帐号暂未登录",field: ""}
            };
    lang.labelText.multiBind = {
                "submit"                : "确认关联",
                "userName"              : "关联用户名",
                "userNamePh"            : "支持已存在用户名和快速注册新用户名",
                "userNameRulesError"    : "用户名仅支持中英文、数字和下划线,且不能为纯数字。",
                "password"              : "密码",
                "passwordRequired"      : "请输入密码",
                "userNameNewacc"        : "系统将为您自动创建新帐号，与当前手机号关联",
                "userNameNeedpwd"       : "为了您帐号的安全，请验证密码，<a href='http://passport.baidu.com/?getpassindex' target='_blank'>忘记密码？</a>",
                "submitSuccessTitle"    : "关联成功，使用手机即可登录和切换！",
                "submitSuccessBtn"      : "确认",
                "sysError"              : "系统错误，休息一会儿，请稍后再试",
                "nextBtn"               : "继续关联",
                "preBtn"                : "上一步",
                "warningTitle"          : "您的用户名#{uname}对应的密码，将自动替换成手机#{phone}对应的密码。"
            };
    
    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
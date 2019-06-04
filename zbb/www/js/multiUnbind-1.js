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
    lang.errMsg.multiUnbind = {
                '-1'    : {msg: "\u7cfb\u7edf\u9519\u8bef\uff0c\u4f11\u606f\u4e00\u4f1a\u513f\uff0c\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5" , field: ""},
                '11'    : {msg: "\u7528\u6237\u540d\u6700\u957f\u4e0d\u5f97\u8d85\u8fc77\u4e2a\u6c49\u5b57\uff0c\u621614\u4e2a\u5b57\u8282\uff08\u534a\u89d2\u6570\u5b57\u3001\u534a\u89d2\u5b57\u6bcd\u6216\u4e0b\u5212\u7ebf\uff09" , field: "userName"},
                '401003': {msg: "该用户名不在关联列表中，请刷新重试。" , field: ""},
                '401004': {msg: "为保证您的帐号安全，请输入密码" , field: ""},
                '401005': {msg: "您要解除关联的用户名未绑定邮箱，请绑定邮箱后刷新页面重试。" , field: ""},
                '401006': {msg: "该用户名不在关联列表中，请刷新重试。" , field: ""},
                '400021': {msg: "解除关联帐号失败，您当前帐号暂未登录",field: ""},
                '500010': {msg: "验证码尝试次数过多，请稍后再试",field:""},
                '62004' : {msg: "您填写的短信验证码有误，请重试" , field: "smsVcode"},
                '62007' : {msg: "请先获取验证码" , field:"smsVcode"}
            };
    lang.errMsg.authwidGetverify = {
        //发送短信接口，接口返回数据有问题，暂使用后端返回文案
        //TODO
                '62003' : {msg: "发送次数过多，请稍后再试"},
                '62005' : {msg: "验证码已过期，请重新获取验证码后再试"}
            };
    lang.labelText.multiUnbind = {
                "introTitle"            : "您即将解除以下关联关系，验证手机后即可解绑",
                "smsVcode"              : "验证码",
                "smsVcodePh"            : "请填写验证码",
                "smsVcodeSend"          : "获取验证码",
                "smsVcodeSending"       : "正在获取...",
                "smsVcodeSendErr"       : "获取验证码失败，请稍候再试",
                "smsVcodeResend"        : "重新获取",
                //"smsVcodeSucc"          : "验证码发送成功,<a href='' target='_blank'>收不到短信验证码？</a>",
                "smsVcodeSucc"          : "验证码发送成功,请查收",
                "submit"                : "确认解绑",
                "successTitle"          : "#{uname}解除关联成功",
                "successBtn"            : "确认",
                "failedTitle"           : "#{uname}解除关联失败",
                "failedInfo"            : "建议您绑定邮箱后再解除关联，避免帐号的安全性降低或无法快速找回密码"
            };
    
    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);
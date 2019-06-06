/**
 * @file 二次卡验证文案
 * @param {Object} options 配置项
 * @param {boolean} options.disabled 控件的不可用状态
 */

function _(name) {
    alert('undefined:' + name);
}
/*globals passport */
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

    lang.errMsg.secondCardVerify = {
        '-1': {msg: 'System error. Please try again later.', field: ''}
    };


    lang.labelText.secondCardVerify = {
        'suretip': '该手机号绑定了如上百度帐号，请确认是否是您的帐号',
        'tip': '您的帐号存在风险，为了保障您的帐号安全',
        'logintip': '登录前需验证您的身份信息',
        'bottomtip': '所填信息仅用于身份验证，请放心填写',
        'submit': '确定',
        'submitLogin': '是的，立即登录',
        'submitReg': '不是，重新注册',
        'password': '密码',
        'card': '银行卡号',
        'idcard': '身份证号',
        'uname': '真实姓名',
        'bank': '银行卡',
        'idcardError': '身份证号格式错误',
        'cardError': '银行卡格式错误',
        'cardnoError': '银行卡号错误',
        'submitting': '提交中'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
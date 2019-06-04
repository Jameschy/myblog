/**
 * @file 引导验证手机
 */
/* globals passport, magic */
function _(name) {
    alert('undefined:' + name);
}

var passport = window.passport || {};
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

    lang.errMsg.bindGuide = {

    };
    lang.labelText.bindGuide = {
        'verify': '去验证',
        'change': '更换手机号',
        'submit': '确定',
        'jump': '跳过'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
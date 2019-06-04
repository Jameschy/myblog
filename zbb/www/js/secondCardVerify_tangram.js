/**
 * @file 二次卡验证
 */
 /* globals passport,importScript,importScriptList,magic */
(function () {
    var scripts = document.getElementsByTagName('script');
    var length = scripts.length;
    var src = scripts[length - 1].src;
    var pos = src.indexOf('/js/');
    var scriptPath = src.substr(0, pos) + '/js/';
    window.importScriptList = {};
    window.importScript = function (filename) {
        if (!filename) {
            return;
        }
        if (filename.indexOf('http://') === -1 && filename.indexOf('https://') === -1) {
            if (filename.substr(0, 1) === '/') {
                filename = filename.substr(1);
            }
            filename = scriptPath + filename;
        }
        if (filename in importScriptList) {
            return;
        }
        importScriptList[filename] = true;
        document.write('<script src="' + filename + '" type="text/javascript"></' + 'script>');
    };
})();

passport._define('secondCardVerify_tangram.js'/*tpa=http://passport.baidu.com/passApi/js/secondCardVerify_tangram.js*/, function () {
    importScript('tangram.js'/*tpa=http://passport.baidu.com/passApi/js/lib/tangram.js*/);
    importScript('idcard_validate.min.js'/*tpa=http://passport.baidu.com/passApi/js/lib/idcard_validate.min.js*/);
    importScript('domain.js'/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript('magic.js'/*tpa=http://passport.baidu.com/passApi/js/lib/magic.js*/);
    importScript('rsa.js'/*tpa=http://passport.baidu.com/passApi/js/lib/rsa.js*/);
    importScript('secondCardVerify.js'/*tpa=http://passport.baidu.com/passApi/js/lang/secondCardVerify.js*/);
    importScript('data.js'/*tpa=http://passport.baidu.com/passApi/js/network/data.js*/);
    importScript('ui.js'/*tpa=http://passport.baidu.com/passApi/js/ui.js*/);
    importScript('secondCardVerify-1.js'/*tpa=http://passport.baidu.com/passApi/js/modules/secondCardVerify.js*/);
    return magic;
});

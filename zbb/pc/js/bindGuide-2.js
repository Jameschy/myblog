/**
 * @file 引导绑定手机
 */
 /* globals importScript,importScriptList, passport, magic*/
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
        document.write('<script src="' + filename + '" type="text/javascript"></script>');
    };
})();

passport._define('bindGuide-2.js'/*tpa=http://passport.baidu.com/passApi/js/bindGuide.js*/, function () {
    importScript('domain.js'/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript('magic.js'/*tpa=http://passport.baidu.com/passApi/js/lib/magic.js*/);
    importScript('bindGuide.js'/*tpa=http://passport.baidu.com/passApi/js/lang/bindGuide.js*/);
    importScript('data.js'/*tpa=http://passport.baidu.com/passApi/js/network/data.js*/);
    importScript('ui.js'/*tpa=http://passport.baidu.com/passApi/js/ui.js*/);
    importScript('bindGuide-1.js'/*tpa=http://passport.baidu.com/passApi/js/modules/bindGuide.js*/);
    return magic;
});

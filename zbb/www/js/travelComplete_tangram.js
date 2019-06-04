/**
 * @file 游客账号正常化
 */
 /* globals importScript,importScriptList,passport */
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
passport._define('travelComplete_tangram.js'/*tpa=http://passport.baidu.com/passApi/js/travelComplete_tangram.js*/, function () {
    importScript('tangram.js'/*tpa=http://passport.baidu.com/passApi/js/lib/tangram.js*/);
    importScript('domain.js'/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript('magic.js'/*tpa=http://passport.baidu.com/passApi/js/lib/magic.js*/);
    importScript('travelComplete-1.js'/*tpa=http://passport.baidu.com/passApi/js/lang/travelComplete.js*/);
    importScript('data.js'/*tpa=http://passport.baidu.com/passApi/js/network/data.js*/);
    importScript('ui.js'/*tpa=http://passport.baidu.com/passApi/js/ui.js*/);
    importScript('travelComplete-2.js'/*tpa=http://passport.baidu.com/passApi/js/modules/travelComplete.js*/);
    return magic;
})

/**
 * @file 英文版短信登录
 */
(function () {
var scripts = document.getElementsByTagName('script'),
    length = scripts.length,
    src = scripts[length - 1].src,
    pos = src.indexOf('/js/'),
    scriptPath = src.substr(0, pos) + '/js/';
window.importScriptList = {};
window.importScript = function (filename) {
    if (!filename) return;
    if (filename.indexOf("http://") == -1 && filename.indexOf("https://") == -1) {
        if (filename.substr(0, 1) == '/') filename = filename.substr(1);
        filename = scriptPath + filename;
    }
    if (filename in importScriptList) return;
    importScriptList[filename] = true;
    document.write('<script src="' + filename + '" type="text/javascript"><\/' + 'script>');
}
})()
/* globals passport, importScript */
passport._define('smsloginEn_tangram.js'/*tpa=http://passport.baidu.com/passApi/js/smsloginEn_tangram.js*/, function(){
    importScript("tangram.js"/*tpa=http://passport.baidu.com/passApi/js/lib/tangram.js*/);
    importScript("domain.js"/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript("magic.js"/*tpa=http://passport.baidu.com/passApi/js/lib/magic.js*/);
    importScript("rsa.js"/*tpa=http://passport.baidu.com/passApi/js/lib/rsa.js*/);
    importScript("smsloginEn.js"/*tpa=http://passport.baidu.com/passApi/js/lang/smsloginEn.js*/);
    importScript("data.js"/*tpa=http://passport.baidu.com/passApi/js/network/data.js*/);
    importScript("ui.js"/*tpa=http://passport.baidu.com/passApi/js/ui.js*/);
    importScript("smsloginEn-1.js"/*tpa=http://passport.baidu.com/passApi/js/modules/smsloginEn.js*/);
    return magic;
})

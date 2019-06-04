(function ( /*importstart*/ ) {
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
})( /*importend*/ ) 
passport._define('loginWap.js'/*tpa=http://passport.baidu.com/passApi/js/loginWap.js*/, function(){
    importScript("domain.js"/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript("magic.js"/*tpa=http://passport.baidu.com/passApi/js/lib/magic.js*/);
    importScript("rsa_wap.js"/*tpa=http://passport.baidu.com/passApi/js/lib/rsa_wap.js*/);
    importScript("loginWap-1.js"/*tpa=http://passport.baidu.com/passApi/js/lang/loginWap.js*/);
    importScript("data.js"/*tpa=http://passport.baidu.com/passApi/js/network/data.js*/);
    importScript("ui.js"/*tpa=http://passport.baidu.com/passApi/js/ui.js*/);
    importScript("loginWap-2.js"/*tpa=http://passport.baidu.com/passApi/js/modules/loginWap.js*/);
    return magic;
})

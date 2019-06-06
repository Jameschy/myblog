(function( /*importstart*/ ) {
    var scripts = document.getElementsByTagName('script'),
            length = scripts.length,
            src = scripts[length - 1].src,
            pos = src.indexOf('/js/'),
            scriptPath = src.substr(0, pos) + '/js/';

    window.importScriptList = {};
    window.importScript = function(filename) {
        if (!filename) {
            return;
        }
        if (filename.indexOf("http://") === -1
                && filename.indexOf("https://") === -1) {
            if (filename.substr(0, 1) === '/') {
                filename = filename.substr(1);
            }

            filename = scriptPath + filename;
        }
        if (filename in importScriptList) {
            return;
        }
        importScriptList[filename] = true;
        document.write(["<script src=\"", filename, "\" type=\"text/javascript\"></script>"].join(""));
    }
})( /*importend*/ );

passport._define('uni_rebindGuide_tangram.js'/*tpa=http://passport.baidu.com/passApi/js/uni_rebindGuide_tangram.js*/, function() {
    importScript("tangram.js"/*tpa=http://passport.baidu.com/passApi/js/lib/tangram.js*/);
    importScript("domain.js"/*tpa=http://passport.baidu.com/passApi/js/conf/domain.js*/);
    importScript("module_define.js"/*tpa=http://passport.baidu.com/passApi/js/conf/module_define.js*/);
    importScript("dialog.js"/*tpa=http://passport.baidu.com/passApi/js/uni/dialog.js*/);
    importScript("rebindGuide_wrapper.js"/*tpa=http://passport.baidu.com/passApi/js/uni/rebindGuide_wrapper.js*/);
    return true;
})
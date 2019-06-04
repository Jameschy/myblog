var passport = passport || window.passport || {},
    baidu = passport.tangramInst || baidu || window.baidu;
(function(ns) {
    ns.apiDomain = {
        staticDomain : (window.location ? 
					((window.location.protocol.toLowerCase()=="http:")?"http://passport.bdimg.com/":"https://passport.baidu.com") : 
					((document.location.protocol.toLowerCase()=="http:")?"http://passport.bdimg.com/":"https://passport.baidu.com"))
    };
})(passport);
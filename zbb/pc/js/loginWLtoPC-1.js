/**
 * @description passport 二维码简版登录模块
 * @class
 * @name magic.passport.loginWLtoPC
 * @grammar new magic.passport.loginWLtoPC(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Number} options.qrWechat 微信扫码同步登录态
 * @return {magic.passport.loginWLtoPC} magic.passport.loginWLtoPC 实例
 * @superClass magic.passport
 */

magic.passport = baidu.lang.createClass(function(){   
      
},{
    type: "magic.passport",
    superClass: magic.Base
}).extend({})

var passport = passport || window.passport || {};
passport.loginWLtoPC = passport.loginWLtoPC || {};

magic.passport.loginWLtoPC = baidu.lang.createClass(function(options){
    var me = this;

    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'auto': (window.location
                    ? ((window.location.protocol.toLowerCase() === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/')
                    : ((document.location.protocol.toLowerCase() === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'))
    };

    me.config = {
        safeFlag: 0,
        product: '',
        charset: '',
        staticPage: '',
        u: '',
        succExecute: '请在手机上确认',
        uaonly: '',
        lang: 'zh-CN',
        animation: '',
        client: '',
        qrWechat: 0
    };
    baidu.extend(me.config, options);
    me.config.product = me.config.product || 'isnull';
    this.module = 'loginWLtoPC';

    me.lang = {
        'qrcodeTitle': '\u624b\u673a\u626b\u63cf，\u5b89\u5168\u767b\u5f55',
        'qrcodeMsg': 'u8bf7\u4f7f\u7528<a href=\"#{appHref}\" target=\"_blank\">#{appName}</a>\u626b\u63cf\u767b\u5f55',
        'appName': '\u767e\u5ea6App',
        'appHref': 'http://xbox.m.baidu.com/mo/',
        'QrcodeSuccessTip': '\u626b\u63cf\u6210\u529f',
        'QrcodeSuccessMsg': '\u8bf7\u5728\u624b\u673a\u7aef\u786e\u8ba4\u767b\u5f55',
        'QrcodeErrorTip': '\u7f51\u7edc\u8fde\u63a5\u5931\u8d25',
        'QrcodeErrorMsg': '\u8bf7\u7a0d\u5019\u518d\u8bd5',
        'QrcodeRefreshTip': '\u767b\u5f55\u5931\u8d25',
        'QrcodeRefreshBtn': '\u5237\u65b0\u4e8c\u7ef4\u7801',
        'QrcodeLoadTip': '\u4e8c\u7ef4\u7801\u52a0\u8f7d\u5931\u8d25'
    };

    me.loadCssFileW('uni_login_merge.css'/*tpa=http://passport.baidu.com/passApi/css/uni_login_merge.css*/, function () {});
    
},{
    type: "magic.passport.loginWLtoPC",
    superClass: magic.passport
}).extend({

    // 初始化二维码模板
    getTemplateQrcode: function () {
        var me = this,
            qrcodeHtml = [],
            appHref = (me.config.qrcodeCfg && me.config.qrcodeCfg.appHref) || me.lang.appHref,
            appName = (me.config.qrcodeCfg && me.config.qrcodeCfg.appName) || me.lang.appName;
        qrcodeHtml.push('<div id="' + me.$getId('qrcode') + '" class="clearfix tang-pass-qrcode tang-pass-login">');
        qrcodeHtml.push('<div class="tang-pass-qrcode-content tang-pass-wltopc-qrcode-content" id="' + me.$getId('qrcodeContent') + '">');
        qrcodeHtml.push('<div class="Qrcode-status-con tang-pass-qrcode-init tang-pass-wltopc-qrcode-init" id="' + me.$getId('QrcodeMain') + '">');
        qrcodeHtml.push('<div class="tang-pass-qrcode-imgWrapper">'
                           + '<img class="tang-pass-qrcode-img" src="loading-1.gif"/*tpa=http://passport.baidu.com/passApi/js/modules/' + me._domain.auto + '/passApi/img/loading.gif*//>'
                           + (me.config.animation ? ('<p class="Qrcode-status-animation" id="' + me.$getId('QrcodeAnimation') + '"></p>') : '')
                        + '</div>');
        qrcodeHtml.push('</div>');
        qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-success wallet-qrcode-succ" id="' + me.$getId('QrcodeSuccess') + '">'
                            + '<p class="Qrcode-status-icon"></p>'
                            + '<p>' + me.lang.QrcodeSuccessTip + '</p>'
                            + '<p class="Qrcode-status-msg">' + me.lang.QrcodeSuccessMsg + '</p>'
                        + '</div>');
        qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-error" id="' + me.$getId('QrcodeError') + '">'
                            + '<p class="Qrcode-status-icon"></p>'
                            + '<p>' + me.lang.QrcodeErrorTip + '</p>'
                            + '<p class="Qrcode-status-msg">' + me.lang.QrcodeErrorMsg + '</p>'
                        + '</div>');
        qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-refresh" id="' + me.$getId('QrcodeRefresh') + '">'
                            + '<p class="Qrcode-status-icon"></p>'
                            + '<p class="refresh-title refresh-timeout">' + me.lang.QrcodeRefreshTip + '</p>'
                            + '<p class="refresh-title refresh-loadout">' + me.lang.QrcodeLoadTip + '</p>'
                            + '<p class="Qrcode-refresh-btn" id="' + me.$getId('QrcodeRefreshBtn') + '">' + me.lang.QrcodeRefreshBtn + '</p>'
                        + '</div>');
        qrcodeHtml.push('</div>');
        qrcodeHtml.push('</div>');
        return qrcodeHtml.join('');
    },

    setChannel: function () {
        var me = this;
        var data = {
            apiver: 'v3',
            tt: new Date().getTime(),
            tpl: me.config.product
        };
        baidu('.Qrcode-status-con').hide();
        me.$show(me.getElement('QrcodeMain'));
        passport.spareWData = passport.spareWData || {};
        baidu.ajax({
            url: me._domain.https + '/v2/api/getqrcode?lp=pc&qrloginfrom=pc&uaonly='
            + me.config.uaonly + '&client=' + me.config.client + '&wechat=' + me.config.qrWechat,
            dataType: 'jsonp',
            data: data,
            success: function (args) {
                clearTimeout(passport.spareWData.unicast);
                passport.spareWData.channelimg = (window.location ? window.location.protocol : document.location.protocol) + '//' + args.imgurl;
                passport.spareWData.sign = args.sign;
                var img = baidu('.tang-pass-qrcode-img');
                for (var i = 0, len = img.length; i < len; i++) {
                    img.get(i).src = passport.spareWData.channelimg;
                }
                if (me.config.qrcode_animation) {
                    me.qrcodeAnimationShow();
                    setTimeout(function () {
                        me.qrcodeAnimationHide();
                    }, 300);
                }
                me.createChannel();
            },
            error: function () {
                clearTimeout(passport.spareWData.unicast);
                baidu('.Qrcode-status-con').hide();
                me.$show(me.getElement('QrcodeError'));
            }
        });
    },

    createChannel: function () {
        var me = this;
        var sign;
        var data = {
            apiver: 'v3',
            tt: new Date().getTime(),
            client: me.config.client
        };
        passport.spareWData = passport.spareWData || {};
        sign = passport.spareWData.sign;
        passport.spareWData.unicast = setTimeout(function () {
            baidu('.Qrcode-status-con').hide();
            me.$show(me.getElement('QrcodeError'));
        }, 35 * 1000);
        baidu.ajax({
            url: me._domain.https + '/channel/unicast?channel_id=' + passport.spareWData.sign + '&tpl=' + me.config.product,
            dataType: 'jsonp',
            data: data,
            success: function (d) {
                clearTimeout(passport.spareWData.unicast);
                if (d.channel_v) {
                    try {
                        d.channel_v = eval('(' + d.channel_v + ')');
                    } catch (e) {
                        d.channel_v = {};
                    }
                } else {
                    d.channel_v = {};
                }

                if (d.errno + '' === '0' && d.channel_v.status + '' === '0') {
                    clearInterval(passport.spareWData.timer);
                    if (me.config.isJumpBduLogin == '1') {
                        return;
                    }
                    if (me.config.display === 'pcsdk') {
                        window.location.href = 'https://passport.baidu.com/v2/api/bdusslogin?bduss='
                        + d.channel_v.v + '&u=' + encodeURIComponent(d.channel_v.u || me.config.u)
                        + '&qrcode=1&display=pcsdk&tpl=' + me.config.product + '&client=' + me.config.client;
                        return;
                    }
                    if (d.channel_v.u) {
                        d.channel_v.u = decodeURIComponent(d.channel_v.u);
                    }
                    baidu.ajax({
                        url: me._domain.https + '/v2/api/bdusslogin?bduss=' + d.channel_v.v + '&u=' + encodeURIComponent(d.channel_v.u || me.config.u) + '&qrcode=1&tpl=' + me.config.product,
                        dataType: 'jsonp',
                        data: data,
                        success: function (args) {
                            if (me.config.onLoginSuccess) {
                                var loginSucArg = {rsp: args};
                                me.config.onLoginSuccess(loginSucArg);
                                var returnValue = typeof(loginSucArg.returnValue) == 'undefined' ? true : loginSucArg.returnValue;
                                if (!returnValue) {
                                    return;
                                }
                            }
                            if (window.location) {
                                window.location.href = args.data.u;
                            } else {
                                document.location.href = args.data.u;
                            }
                        },
                        error: function () {
                            baidu('.Qrcode-status-con').hide();
                            me.$show(me.getElement('QrcodeError'));
                        }
                    });
                } else {
                    if (d.errno + '' === '0' && d.channel_v.status == '1') {
                        // 扫码成功
                        baidu('.Qrcode-status-con').hide();
                        me.$show(me.getElement('QrcodeSuccess'));
                        if (sign === passport.spareWData.sign) {
                            me.createChannel();
                        }
                    } else if (d.errno + '' === '0' && d.channel_v.status == '2') {
                        // 二维码过期
                        if (me.config.onqrcodeFail) {
                            var arg = {rsp: d};
                            var returnValue = me.config.onqrcodeFail(arg);
                            if (returnValue === false) {
                                return;
                            }
                        }
                        clearInterval(passport.spareWData.timer);
                        baidu('.Qrcode-status-con').hide();
                        baidu('.refresh-title').hide();
                        baidu('.refresh-timeout').show();
                        me.$show(me.getElement('QrcodeRefresh'));
                    } else if (sign === passport.spareWData.sign) {
                        me.createChannel();
                    }
                }
            },
            error: function () {
                clearTimeout(passport.spareWData.unicast);
                baidu('.Qrcode-status-con').hide();
                me.$show(me.getElement('QrcodeError'));
            }
        });
    },

    actionQrcode: function () {
        var me = this;

        passport.spareWData = passport.spareWData || {}
        if(!passport.spareWData.channelimg) {
            me.setChannel();
            passport.spareWData.timer = setInterval(function () {
                me.setChannel();
            }, 10 * 60 * 1000);
        }
    },
   
    refreshQrcode: function () {
        // 点击刷新二维码
        var me = this;
        clearTimeout(passport.spareWData.unicast);
        var container = me.getElement('qrcodeContent');
        var qrcodeInit = baidu('.tang-pass-qrcode-init', container).get(0);
        var qrcodeImg = baidu('.tang-pass-qrcode-img', qrcodeInit).get(0);
        if (qrcodeImg) {
            qrcodeImg.src = me._domain.https + '/passApi/img/loading.gif';
        }
        me.setChannel();
        passport.spareWData.timer = setInterval(function () {
            me.setChannel();
        }, 10 * 60 * 1000);
    },

    getWDom: {
        parent: function (dom) {
            return dom.parentNode || dom.parentElement;
        },
        next: function (dom) {
            do {
                dom = dom.nextSibling;
            } while (dom && dom.nodeType != 1);
            return dom;
        },
        prev: function (dom) {
            do {
                dom = dom.previousSibling;
            } while (dom && dom.nodeType != 1);
            return dom;
        }
    },

    loadCssFileW: function (url, cb) {
        window._loadedFilesW = window._loadedFilesW || {};
        var protocol = (window.location ? window.location.protocol : document.location.protocol).toLowerCase();
        if (!window._loadedFilesW[url]) {
            window._loadedFilesW[url] = true;
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.href = (protocol == 'https:') ? ('https://passport.baidu.com' + url) : ('http://passport.baidu.com' + url);
            document.getElementsByTagName("head")[0].appendChild(l);
            if (l.readyState) {
                l.onreadystatechange = function () {
                    if (l.readyState == 'loaded' || l.readyState == 'complete') {
                        l.onreadystatechange = null;
                        cb && cb();
                    }
                };
            } else {
                l.onload = function () {
                    cb && cb();
                };
            }
        }
    },
    /*
    二维码动画显示
    */
    qrcodeAnimationShow: function () {
        var me = this;
        if (me.supportCss3Anim()) {
            baidu(me.getElement('QrcodeMain')).removeClass('Qrcode-animationRight').addClass('Qrcode-animation');
        }else {
            baidu(me.getElement('QrcodeMain')).css('margin-left', '39px');
        }
        baidu(me.getElement('QrcodeAnimation')).addClass('Qrcode-status-guideAnim');
    },

    /*
    二维码动画隐藏
    */
    qrcodeAnimationHide: function () {
        var me = this;
        baidu(me.getElement('QrcodeAnimation')).removeClass('Qrcode-status-guideAnim');
        if (me.supportCss3Anim()) {
            baidu(me.getElement('QrcodeMain')).removeClass('Qrcode-animation').addClass('Qrcode-animationRight');
        }else {
            baidu(me.getElement('QrcodeMain')).css('margin-left', '99px');
        }
    },
    /*
      检测是否支持css3动画
    */
    supportCss3Anim: function () {
        var test = document.getElementsByTagName('body')[0].style;
        if (typeof test.animation != 'undefined' || typeof test.WebkitAnimation != 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    // 二维码动画相关事件
    setqrcodeEvent: function () {
        var me = this;
        if (me.config.animation) {
            baidu(me.getElement('QrcodeMain')).on('mouseenter', function(e) {
                if(e && e.preventDefault) {
                    e.preventDefault();
                }
                me.qrcodeAnimationShow();
            });
            baidu(me.getElement('QrcodeMain')).on('mouseleave', function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                me.qrcodeAnimationHide();
            });
        }
        baidu(me.getElement('QrcodeRefreshBtn')).on('click', function () {
            me.refreshQrcode();
        });
    },
    render: function (id) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());
        var template = me.getTemplateQrcode();
        target.get(0).appendChild(baidu(template).get(0));
        me.actionQrcode();
        me.setqrcodeEvent();
    }
});
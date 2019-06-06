/**
 * @file 引导验证绑定手机
 */
/* globals magic, passport */
magic.passport.bindGuide = baidu.lang.createClass(function (options) {
    var me = this;
    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'staticFile': (document.location.protocol.toLowerCase() === 'https:') ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv' : 'http://passport.bdimg.com/',
        'auto': (document.location.protocol.toLowerCase() === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'
    };
    me.config = {
        product: '',
        charset: '',
        overseas: '',
        hasPlaceholder: true,
        staticPage: '',
        u: '',
        lang: 'zh-CN',
        authsid: '',
        ltoken: '',
        lstr: '',
        cu: '',
        clientfrom: ''
    };

    baidu.extend(me.config, options);


    this.module = 'bindGuide';
    me.constant = {
        CHECKVERIFYCODE: true,
        CONTAINER_CLASS: 'tang-pass-bindGuide',
        LABEL_FOCUS_CLASS: 'pass-text-label-focus',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        DISABLED_CLASS: 'pass-item-time-timing',
        CHECK_CLASS: 'pass-user-list-check',
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime())
    };
    me.lang = passport.err.getCurrent().labelText.bindGuide;

    me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
    // 是否加载默认CSS
    if (me.config.defaultCss) {
    // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
        me.loadCssFileW('bindGuide.css'/*tpa=http://passport.baidu.com/passApi/css/bindGuide.css*/, function () {
        });
    }
}, {
    type: 'magic.passport.bindGuide',
    superClass: magic.passport
}).extend({
    getIrregularField: function (field) {
        var me = this;
        var template = {
            successTip: '<p class="pass-bindGuide-successtip">' + me.config.successTip + '</p>',
            tip: '<p class="pass-bindGuide-tip">' + me.config.tip + '</p>',
            generalError: '<p id="' + me.$getId('bindGuideErrorWrapper') + '" class="pass-generalErrorWrapper">'
                + '<span id="' + me.$getId('bindGuideError')
                + '" class="pass-generalError pass-generalError-error"></span>'
                + '</p>',
            imgContent: '<div class="verify-img"></div>',
            submit: '<p class="pass-form-item pass-form-item-submit">'
                + '<input id="' + me.$getId('bindGuideSubmit') + '" type="submit" value="'
                + me.lang.submit + '" class="pass-button pass-button-submit"/>'
                + '</p>',
            verifysubmit: '<p class="pass-form-item pass-form-item-submit clearfix">'
                + '<input id="' + me.$getId('bindGuideChange') + '" type="submit" value="'
                + me.lang.change + '" class="pass-button pass-button-sub1"/>'
                + '<input id="' + me.$getId('bindGuideVerify') + '" type="submit" value="'
                + me.lang.verify + '" class="pass-button pass-button-sub2"/>'
                + '</p>',
            jump: '<p id="' + me.$getId('jump') + '" class="bindGuide-jump">' + me.lang.jump + '</p>'
        };
        return template[field];
    },

    getTemplate: function (opt) {
        var me = this;
        var templateStr = '';

        var bindGuideRegularField = [{
            field: 'mobile',
            label: '',
            noError: false
        }];
        templateStr += '<div id="' + me.$getId('bindGuide_content') + '">';
        templateStr += me.getIrregularField('successTip');
        templateStr += me.getIrregularField('tip');
        templateStr += me.getIrregularField('generalError');
        templateStr += me.getIrregularField('imgContent');

        if (me.config.type === 'verify') {
            templateStr += me.getIrregularField('verifysubmit');
        } else {
            templateStr += me.getIrregularField('submit');
        }

        templateStr += me.getIrregularField('jump');
        templateStr += '</div>';
        return templateStr;
    },

    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        if (ele) {
            ele.addClass(me.constant.ERROR_CLASS);
        }
        this.getElement('bindGuideError').innerHTML = info.msg;

        opt && opt.callback && opt.callback();
    },

    loadCssFileW: function (url, cb) {
        var me = this;
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[url]) {
            window._loadedFilesW[url] = true;
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.type = 'text/css';
            l.href =  me._domain.staticFile + url;
            document.getElementsByTagName('head')[0].appendChild(l);
            if (l.readyState) {
            // IE
                l.onreadystatechange = function () {
                    if (l.readyState === 'loaded' || l.readyState === 'complete') {
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
    insertScriptW: function (u, cb) {
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[u]) {
            window._loadedFilesW[u] = true;
            var d = document;
            var s = d.createElement('SCRIPT');
            s.type = 'text/javascript';
            s.charset = 'UTF-8';
            if (s.readyState) {
            // IE
                s.onreadystatechange = function () {
                    if (s.readyState === 'loaded' || s.readyState === 'complete') {
                        s.onreadystatechange = null;
                        cb && cb();
                    }
                };
            } else {
                s.onload = function () {
                    cb && cb();
                };
            }
            s.src = u;
            d.getElementsByTagName('head')[0].appendChild(s);
        } else {
            cb && cb();
        }
    },

    render: function (id, callback) {
        var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        me.renderTemplate();
    },

    renderTemplate: function () {
        var me = this;
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);

        var template = me.getTemplate();
        target.get(0).appendChild(baidu(template).get(0));

        me.bindEvent();
    },

    bindEvent: function () {
        var me = this;
        //
        baidu(me.getElement('bindGuideSubmit')).on('click', function () {
            me.bindAction('upgrademobile', me.config.upgradeMobileToken, 'verifymobile');
        });
        baidu(me.getElement('bindGuideVerify')).on('click', function () {
            me.bindAction('upgrademobile', me.config.upgradeMobileToken, 'login');
        });
        baidu(me.getElement('bindGuideChange')).on('click', function () {
            me.bindAction('bindmobile', me.config.bindMobileToken, 'upgrademobile');
        });
        baidu(me.getElement('jump')).on('click', function () {
            var returnValue = me.fireEvent('submitSuccess');
        });
    },

    bindAction: function (action, token, from) {
        var me = this;
        me.insertScriptW(me._domain.https + '/passApi/js/uni_armorwidget_wrapper.js', function () {
            me._ownerDialog && me._ownerDialog.hide('unHide');
            var armorWidget = passport.pop.ArmorWidget;
            var bind = armorWidget(action, {
                token: token,
                title: '绑定手机',
                msg: action === 'bindmobile' ? '请绑定手机' : '',
                overseas: 1,
                ltoken: me.config.ltoken,
                lstr: me.config.lstr,
                successCountdown: 3,
                from: from || 'default',
                otherValue: {
                    tpl: me.config.product,
                    clientfrom: me.config.clientfrom || '',
                    client: me.config.client || ''
                },
                onSubmitSuccess: function (rsp) {
                    var returnValue = me.fireEvent('submitSuccess');
                },
                onSubmitFail: function () {
                    var returnValue = me.fireEvent('submitSuccess');
                },
                onRender: function () {
                    var self = this;
                    baidu('#' + self.getId('header_a')).on('click', function () {
                        var returnValue = me.fireEvent('submitSuccess');
                    });
                }
            });
            bind.show();
        });
    }
});

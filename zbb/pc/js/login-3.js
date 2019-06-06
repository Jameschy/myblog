///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 登录模块
 * @class
 * @name magic.passport.login
 * @grammar new magic.passport.login(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.idc session机房标记
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.login} magic.passport.login 实例
 * @superClass magic.passport
 */
/* globals passport */
/* eslint-disable */
magic.passport.login = baidu.lang.createClass(function (options) {
    var me = this;
    var protocol;
    if (passport && passport._protocol === 'https') {
        protocol = 'https:';
    } else {
        protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
    }

    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'staticFile': (protocol === 'https:')
            ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv'
            : 'http://passport.bdimg.com/',
        'auto': (protocol === 'https:')
            ? 'https://passport.baidu.com'
            : 'http://passport.baidu.com/',
        'wapAuto': (protocol === 'https:')
            ? 'https://wappass.baidu.com'
            : 'http://wappass.baidu.com/'
    };
    if (passport && passport.ieVersion && passport.ieVersion() <= 8.0) {
        me._domain.staticFile = (protocol === 'https:')
            ? 'https://passport.baidu.com'
            : 'http://passport.baidu.com/';
    }

    me.config = {
        // bool,是否为手机号登录（仅在loginMerge配置为false下有效）
        isPhone: false,
        // bool,默认是否记住用户名
        memberPass: true,
        // 0,1 是否为快推登录
        isQuickUser: 0,
        safeFlag: 0,
        // string,产品线TPL
        product: '',
        // string,session机房标记
        idc: '',
        charset: '',
        // bool,是否为合并普通登录与手机号登录入口
        loginMerge: false,
        // string,静态跳转文件
        staticPage: '',
        // bool,是否有注册入口
        u: '',
        hasRegUrl: false,
        lang: 'zh-CN',
        autosuggest: true,
        // bool,是否有自动历史纪录及邮箱提示
        // bool,是否有placeholder功能
        hasPlaceholder: false,
        // string,注册连接配置
        registerLink: '',
        // array,第三方帐号配置,目前支持['qzone','tsina','renren','fetion','tqq','qunar','weixin']
        authsiteLogin: '',
        // object,第三方详细配置
        authsiteCfgLogin: '',
        // bool,是否使用二维码登录
        qrcode: false,
        // 0,1,2,3,是否使用短信配置，0：不使用短信登录；1，使用且默认不展示；2，使用且默认展示；3，仅仅展示短信登录
        sms: 0,
        // bool,过渡参数,是否使用唯一的ID
        uniqueId: false,
        // bool,是否自动focus到焦点
        autoFocus: true,
        // 待定参数，用以统计
        subpro: '',
        // 是否同步登录状态到客户端      ,
        setWebToClient: true,
        /* eslint-disable fecs-camelcase */
        is_voice_sms: 0,
        /* eslint-disable fecs-camelcase */
        voice_sms_flag: 0,
        /* eslint-disable fecs-camelcase */
        qrcode_animation: '',
        /* eslint-disable fecs-camelcase */
        qrcode_style: '',
        // 图形验证码触发的来源 username or login or '', 用户名失焦、单击登录、没有触发验证码
        vcodefrom: '',
        // 区分端参数
        client: '',
        // 短信登录故障预案-控制默认登录方式  1:默认帐密登录
        defaultLoginType: 0,
        // 网盘oauth数据统计
        extrajson: ''
    };

    baidu.extend(me.config, options);
    me.urlData = {
        'page': 'login',
        'tpl': me.config.product || '',
        'subpro': me.config.subpro || ''
    };

    if (me.config.authsiteLogin && baidu.array(me.config.authsiteLogin).indexOf('renren') > -1) {
        var index = baidu.array(me.config.authsiteLogin).indexOf('renren');
        me.config.authsiteLogin.splice(index, 1);
    }

    me.config.product = me.config.product || 'isnull';
    this.module = 'login';
    this.guideRandom = (function () {
        return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    })();
    me.constant = {
        CHECKVERIFYCODE: true,
        CONTAINER_CLASS: 'tang-pass-login',
        LABEL_FOCUS_CLASS: 'pass-text-label-focus',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        MODIFY_PWD_URL_PREFIX: me._domain.https + '/forcsdnpasschange',
        GET_PASSWORD_URL: me._domain.https
        + '/?getpassindex&tt='
        + (new Date().getTime())
        + '&gid='
        + me.guideRandom
        + '&tpl='
        + encodeURIComponent(me.config.product)
        + '&u='
        + encodeURIComponent(me.config.u),
        REG_URL: me.config.registerLink
        || me._domain.https
        + '/v2/?reg&tt='
        + (new Date().getTime())
        + '&overseas='
        + me.config.overseas
        + '&gid='
        + me.guideRandom
        + '&tpl='
        + encodeURIComponent(me.config.product)
        + '&u='
        + encodeURIComponent(me.config.u),
        PROTOCAL_URL: me._domain.http + '/static/passpc-account/html/protocal.html',
        NOCAPTCHA_URL: me._domain.auto
        + '/static/passpc-base/js/ld.min.js?cdnversion='
        + (new Date().getTime()),
        TOUCHAPIMKD_URL: me._domain.wapAuto
            + '/static/touch/js/api/wrapper_touch.js?cdnversion=' + (new Date().getTime()),
        // 给游戏提供的登录接口判断
        SUBMITFLAG: false
    };
    me.lang = passport.err.getCurrent().labelText.login;

    // init data
    passport.data.setContext(baidu.extend({}, me.config));

    // data: uninitialized
    this.initialized = false;
    this.validatorInited = false;
    this.bdPsWtoken = '';
    this.innerData = {normal: {}, phone: {}};
    this.dataFiels = ['userName', 'password'];
    this.initTime = new Date().getTime();
    window.confirmSmsVerifyWidget = null;
    window.checkPhoneWidget = null;
    window.checkPhoneExist = false;

    if (me.config.overseas && (+me.config.overseas === 1)) {
        this.foreignMobile = true;
    }
    this.internation = false;

    this.connectURL = {
        'nuomi': 'http://www.nuomi.com/pclogin/main/checkaccount'
    };
    // yangweiguang
    me._insertNoCaptchaScript();
    me.initMkd();
    // 是否加载默认CSS
    if (me.config.defaultCss) {
        me._loadCssFileW('uni_login_merge.css'/*tpa=http://passport.baidu.com/passApi/css/uni_login_merge.css*/, function () {
        });
    }

    // getapi:针对不愿意配置memberPass（自动登录）并且需要调用getapi接口时候配置
    if (me.config.memberPass || me.config.getapi) {
        me._initApi();
    }
}, {
    type: 'magic.passport.login',
    superClass: magic.passport
}).extend({
    /* eslint-disable fecs-camelcase */
    _getIrregularField: function (field) {
        var me = this;
        var template = {
            makeText: '<p id="'
            + me.$getId('MakeTextWrapper')
            + '" class="pass-make-text" style="display:none;"></p>',

            verifyCode: '<p id="'
            + me.$getId('verifyCodeImgWrapper')
            + '" class="pass-form-item pass-form-item-verifyCode" style="display:none">'
            + '<label for="'
            + me.$getId('verifyCode')
            + '" id="'
            + me.$getId('verifyCodeLabel')
            + '" class="pass-label pass-label-verifyCode">'
            + me.lang.captcha
            + '</label>'
            + '<input id="'
            + me.$getId('verifyCode')
            + '" type="text" name="verifyCode" class="pass-text-input pass-text-input-verifyCode" maxlength="6" />'
            + '<span  id="'
            + me.$getId('verifyCodeImgParent')
            + '" class="pass-verifyCodeImgParent" ><img id="'
            + me.$getId('verifyCodeImg')
            + '" class="pass-verifyCode" src="'
            + me.constant.BLANK_IMG_URL
            + '" /></span>'
            + '<a id="'
            + me.$getId('verifyCodeChange')
            + '" href="#" class="pass-change-verifyCode">'
            + me.lang.captchaChange
            + '</a>'
            + '<span id="'
            + me.$getId('verifyCodeError')
            + '" class="pass-error pass-error-verifyCode"></span>'
            + '<span id="'
            + me.$getId('verifyCodeTip')
            + '" class="pass-tip pass-tip-verifyCode"></span>'
            + '<span id="'
            + me.$getId('verifyCodeSuccess')
            + '" class="pass-success pass-success-verifyCode"></span>'
            + '</p>',

            generalError: '<p id="'
            + me.$getId('errorWrapper')
            + '" class="pass-generalErrorWrapper">'
            + '<span id="'
            + me.$getId('error')
            + '" class="pass-generalError pass-generalError-error"></span>'
            + '</p>',

            smsSwitch: '<p class="pass-smsSwitchWrapper" id="'
            + me.$getId('smsSwitchWrapper')
            + '"><a class="pass-sms-btn" title="短信快捷登录" data-type="sms" id="'
            + me.$getId('smsSwitch')
            + '">短信快捷登录</a></p>',

            rem: '<p id="'
            + me.$getId('memberPassWrapper')
            + '" class="pass-form-item pass-form-item-memberPass">'
            + '<input id="'
            + me.$getId('memberPass')
            + '" type="checkbox" name="memberPass" class="pass-checkbox-input pass-checkbox-memberPass"'
            + (me.config.memberPass ? ' checked="checked"' : '')
            + ' />'
            + '<label for="'
            + me.$getId('memberPass')
            + '" id="'
            + me.$getId('memberPassLabel')
            + '" class="">'
            + me.lang.memberPassLabel
            + '</label>'
            + '</p>',

            submit: '<p id="'
            + me.$getId('submitWrapper')
            + '" class="pass-form-item pass-form-item-submit">'
            + '<input id="'
            + me.$getId('submit')
            + '" type="submit" value="'
            + me.lang.login
            + '" class="pass-button pass-button-submit" />'
            + '<a class="pass-reglink" href="'
            + me.constant.REG_URL
            + '" target="_blank" '
            + (me.config.hasRegUrl ? '' : 'style="display:none"')
            + '>'
            + me.lang.register
            + '</a>'
            + '<a class="pass-fgtpwd" href="'
            + me.constant.GET_PASSWORD_URL
            + '" target="_blank">'
            + me.lang.fgtPwd
            + '</a>'
            + '</p>',
            foreignMobileMsg: '<p class="pass-foreignMobile-msg" id="'
            + me.$getId('foreignMobileMsg') + '">'
            + me.lang.foreignMobileMsg
            + '</p>',

            foreignMobileWrapper: '<div class="pass-form-item pass-form-item-PhoneCountry'
            + ' pass-foreignMobile-wrapper" id="'
            + me.$getId('foreignMobileWrapper')
            + '" style="display:none">'
            + '<label for="' + me.$getId('foreignMobile')
            + '" id="'
            + me.$getId('foreignMobileLabel')
            + '" class="pass-label" data-countryCode="">+86</label>'
            + '<input id="'
            + me.$getId('foreignMobile')
            + '" type="text" name="foreignusername" class="pass-text-input"/>'
            + '<ul id="'
            + me.$getId('foreignCountryList')
            + '" class="pass-country-list"></ul>'
            + '</div>',

            foreignMobileLink: '<p class="pass-foreignMobile-link-wrapper" id="'
            + me.$getId('foreignMobileLinkWrapper')
            + '"><a id="'
            + me.$getId('foreignMobileLink')
            + '" class="pass-foreignMobile-link">'
            + me.lang.foreignMobileLink
            + '</a></p>',

            foreignMobileBack: '<p class="pass-foreignMobile-back-wrapper" id="'
            + me.$getId('foreignMobileBackWrapper')
            + '"><a id="'
            + me.$getId('foreignMobileBack')
            + '" class="pass-foreignMobile-link">'
            + me.lang.foreignToLogin
            + '</a></p>',

            choiceuser: ''
            + '<div id="'
            + me.$getId('choiceuser_article')
            + '" class="tang-pass-login-choice choiceuser-article">'
            + '<div class="choiceuser-msg"><p class="choiceuser-msg-title">亲爱的用户，</p>'
            + '<p  class="choiceuser-msg-text">为了确保您的帐号安全，请先确认您输入的帐号是用户名还是手机号：</p></div>'
            + '<div class="choiceuser-buttons"><div class="choiceuser-btn">'
            + '<input class="pass-button pass-button-choiceuser-username" type="button" value="用户名" id="'
            + me.$getId('choiceuser_btn_username')
            + '"/><input class="pass-button pass-button-choiceuser-phone" type="button" value="手机号" id="'
            + me.$getId('choiceuser_btn_mobile')
            + '"/></div><div class="choiceuser-back"><a href="#" id="'
            + me.$getId('choiceuser_btn_back')
            + '">'
            + me.lang.backToLogin
            + '</a></div></div>'
            + '</div>',

            webtoclint: '' + '<div id="' + me.$getId('pass_b2c') + '" style="display:none;"></div>',

            is_voice_sms: '<div class="pass-smsSwitchWrapper">'
            + '<a class="pass-is_voice_sms-btn" title="语音验证码" data-type="is_voice_sms" >语音验证码</a></div>'
        };
        return template[field];
    },
    /* eslint-disable fecs-camelcase */
    _getTemplate: function (containerId) {
        var me = this;
        var templateStr = '<form id="'
            + me.$getId('form')
            + '" class="pass-form pass-form-normal" method="POST" autocomplete="off">';
        var hiddenFields = {
            codeString: '',
            safeFlag: me.config.safeFlag,
            u: me.config.u,
            isPhone: me.config.isPhone,
            detect: '1',
            gid: me.guideRandom || '',
            staticPage: me.config.staticPage,
            // 注意产品线配置时以驼峰命名
            quick_user: me.config.isQuickUser,
            // 用以log统计
            logintype: (me.config.diaPassLogin ? 'dialogLogin' : 'basicLogin'),
            // 用以zmon监控统计
            logLoginType: (me.config.diaPassLogin ? 'pc_loginDialog' : 'pc_loginBasic'),
            subpro: me.config.subpro,
            idc: me.config.idc
        };
        var loginRegularField = [{
            field: 'userName',
            label: me.config.loginMerge ? me.lang.userName : (me.config.isPhone ? me.lang.phoneNum : me.lang.account),
            noError: true
        }, {
            field: 'password',
            pwd: true,
            label: me.lang.password,
            noError: true
        }];

        if (me.config.loginMerge) {
            hiddenFields.loginMerge = true;
            hiddenFields.isPhone = false;
        }

        templateStr += me._getIrregularField('generalError');
        templateStr += me._getIrregularField('makeText');
        if (me.config.sms) {
            templateStr += me._getIrregularField('smsSwitch');
        }
        templateStr += me._getHiddenField(hiddenFields);
        if (me.foreignMobile) {
            templateStr += me._getIrregularField('foreignMobileMsg');
            templateStr += me._getIrregularField('foreignMobileWrapper');
        }

        for (var i = 0; i < loginRegularField.length; i++) {
            templateStr += me._getRegularField(loginRegularField[i]);
        }
        templateStr += me._getIrregularField('verifyCode');
        templateStr += me._getIrregularField('rem');
        templateStr += me._getIrregularField('submit');
        if (me.foreignMobile) {
            templateStr += me._getIrregularField('foreignMobileLink');
            templateStr += me._getIrregularField('foreignMobileBack');
        }
        templateStr += '</form>';

        return templateStr;
    },
    /* eslint-disable fecs-camelcase */
    _collectData: function () {
        var me = this,
            dataObj = me.innerData[me.config.isPhone ? 'phone' : 'normal'],
            fields = me.dataFiels;
        for (var i = 0, l = fields.length; i < l; i++) {
            dataObj[fields[i]] = me.getElement(fields[i]).value;
        }
        return dataObj;
    },
    /* eslint-disable fecs-camelcase */
    _restoreData: function (type) {
        var me = this,
            dataObj = me.innerData[type ? type : (me.config.isPhone ? 'phone' : 'normal')],
            fields = me.dataFiels;
        for (var i = 0, l = fields.length; i < l; i++) {
            me.getElement(fields[i]).value = dataObj[fields[i]] || '';
        }
        return dataObj;
    },
    /* eslint-disable fecs-camelcase */
    _loadCssFileW: function (url, cb) {
        var me = this;
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[url]) {
            window._loadedFilesW[url] = true;
            var l = document.createElement('link');
            l.rel = 'stylesheet';
            l.type = 'text/css';
            //l.href = (protocol=='https:')?('https://passport.baidu.com'+url):('http://passport.baidu.com'+url);
            l.href = me._domain.staticFile + url;
            document.getElementsByTagName('head')[0].appendChild(l);
            // IE
            if (l.readyState) {
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
    /* eslint-disable fecs-camelcase */
    _insertScriptW: function (u, cb) {
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[u]) {
            window._loadedFilesW[u] = true;
            var d = document, s = d.createElement('SCRIPT');
            s.type = 'text/javascript';
            s.charset = 'UTF-8';
            // IE
            if (s.readyState) {
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
        }
    },
    /* eslint-disable fecs-camelcase */
    _authSiteW: function () {
        var me = this,
            config = me.config,
            targetCon = me.getPhoenixId('pass_phoenix_btn');
        if (config.authsitecssLoad) {
            me._loadCssFileW('authsite.css'/*tpa=http://passport.baidu.com/passApi/css/authsite.css*/);
        }
        me._insertScriptW(me._domain.auto + '/phoenix/account/jsapi', function () {
            // me._insertScriptW('https://passport'+'.baidu.com/phoenix/account/jsapi',function(){
            if (!window.baidu.phoenix) {
                return;
            }
            window.baidu.phoenix.require(config.authsiteLogin, baidu.extend(
                config.authsiteCfgLogin || {}, {
                    tpl: config.product ? config.product : '',
                    idc: config.idc ? config.idc : '',
                    u: config.u,
                    subpro: (config && config.subpro) || '',
                    target: targetCon,
                    html: {
                        'qzone': '<a class="phoenix-btn-item" href="#">QQ帐号</a>',
                        'tsina': '<a class="phoenix-btn-item" href="#">新浪微博</a>',
                        'renren': '<a class="phoenix-btn-item" href="#">人人网</a>',
                        'fetion': '<a class="phoenix-btn-item" href="#">飞信</a>',
                        'tqq': '<a class="phoenix-btn-item" href="#">腾讯微博</a>',
                        'qunar': '<a class="phoenix-btn-item" href="#">去哪儿</a>',
                        'weixin': '<a class="phoenix-btn-item" href="#">微信</a>',
                        'tianyi': '<a class="phoenix-btn-item" href="#">天翼</a>',
                        'feifan': '<a class="phoenix-btn-item" href="#">飞凡</a>'
                    },
                    onAfterRender: function () {
                        var $lists = baidu('#' + targetCon + ' li');
                        var preventDef = function (ele) {
                            ele.on('click', function (evt) {
                                evt.preventDefault();
                            });
                        };
                        for (var i = 0; i < $lists.length; i++) {
                            var $item = baidu('.phoenix-btn-item', $lists[i]);
                            $item.attr({'title': $item[0].innerHTML});
                            preventDef($item);
                        }
                    }
                }
            ));
        });
    },

    /**
     * @description 获取验证码
     * @name magic.passport.login#getVerifyCode
     * @function
     * @grammar magic.passport.login#getVerifyCode(codeString)
     * @param {String} codeString 验证码字符串
     */
    getVerifyCode: function (codeString) {
        var me = this,
            data = {
                fr: 'login',
                vcodetype: me.vcodetype || ''
            };
        me.getElement('verifyCode').value = '';

        me.$hide('verifyCodeSuccess');

        if (me.getElement('verifyCode_clearbtn')) {
            me.$hide('verifyCode_clearbtn');
        }

        me.getElement('verifyCodeImg').src = '';
        if (codeString && codeString.length) {
            me.$show('verifyCodeImgWrapper');
            //me.getElement('verifyCode').focus();
            me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + codeString;
            me.getElement('codeString').value = codeString;
            var returnValue = me.fireEvent('renderVerifycode', {
                verifyStr: codeString,
                verifyCodeImg: me.constant.VERIFYCODE_URL_PREFIX + codeString
            });
            if (!returnValue) {
                return;
            }
        } else {
            passport.data.getVerifyCodeStr(data)
            .success(function (rsp) {
                if (+rsp.errInfo.no === 0) {
                    me.$show('verifyCodeImgWrapper');
                    //me.getElement('verifyCode').focus();
                    me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.verifyStr;
                    me.getElement('codeString').value = rsp.data.verifyStr;
                    var returnValue = me.fireEvent('renderVerifycode', {
                        verifyStr: rsp.data.verifyStr,
                        verifyCodeImg: me.constant.VERIFYCODE_URL_PREFIX + rsp.data.verifyStr
                    });
                    if (!returnValue) {
                        return;
                    }
                }
            });
        }

        if (me.getElement('verifyCode_placeholder')) {
            setTimeout(function () {
                me.$show('verifyCode_placeholder');
            }, 200);
        }
    },
    /* eslint-disable fecs-camelcase */
    _getWDom: {
        parent: function (dom) {
            return dom.parentNode || dom.parentElement;
        },
        next: function (dom) {
            do {
                dom = dom.nextSibling;
            } while (dom && dom.nodeType !== 1);
            return dom;
        },
        prev: function (dom) {
            do {
                dom = dom.previousSibling;
            } while (dom && dom.nodeType !== 1);
            return dom;
        }
    },
    /**
     * @description 清除验证码
     * @name magic.passport.login#clearVerifyCode
     * @function
     * @grammar magic.passport.login#clearVerifyCode()
     */
    clearVerifyCode: function () {
        var me = this;
        me.$hide('verifyCodeImgWrapper');
        me.getElement('codeString').value = '';
    },
    getPhoenixId: function (field) {
        if (this.config.uniqueId) {
            return this.$getId(field);
        } else {
            var phoenixEles = {
                'pass_phoenix_login': 'pass-phoenix-login',
                'pass_phoenix_list_login': 'pass-phoenix-list-login',
                'pass_phoenix_btn': 'pass_phoenix_btn'
            };
            return phoenixEles[field];
        }
    },
    getPhoenixElement: function (field) {
        if (this.getElement(field)) {
            return this.getElement(field);
        } else {
            return document.getElementById(this.getPhoenixId(field));
        }
    },
    /* eslint-disable fecs-camelcase */
    _getTemplateOther: function () {
        var html = [],
            me = this;

        var length = 0;

        if (me.config.authsiteLogin) {
            length = me.config.authsiteLogin.length;
        }
        if (me.config.qrcode && me.config.qrcode !== 2) {
            length++;
        }
        var template = '<div id="'
            + me.getPhoenixId('pass_phoenix_login')
            + '" class="tang-pass-login-phoenix">'
            + '<div class="pass-phoenix-title">可以使用以下方式登录<span class="pass-phoenix-note"></span></div>'
            + '<div id="'
            + me.getPhoenixId('pass_phoenix_list_login')
            + '" class="pass-phoenix-list clearfix'
            + ((me.config.diaPassLogin && +me.config.qrcode === 2) ? ' pass-phoenix-list-second' : '')
            + '">'
            + (me.config.phoenixLimit && length > me.config.phoenixLimit
                ? '<em class="pass-phoenix-show"></em>'
                : '')
            + ((me.config.sms || (!me.config.diaPassLogin && me.config.qrcode))
                ? '<a class="pass-normal-btn" title="普通登录" style="display:none" data-type="normal">普通登录</a>'
                : '')
            + (me.config.authsiteLogin
                ? '<div class="pass-phoenix-btn clearfix" id="'
                + me.getPhoenixId('pass_phoenix_btn')
                + '"></div>'
                : '')
            + (((me.config.diaPassLogin && +me.config.qrcode === 1) || (!me.config.diaPassLogin && me.config.qrcode))
                ? '<a class="pass-qrcode-btn" title="二维码登录" data-type="qrcode">二维码登录</a>'
                : '')
            + '</div>'
            + '<div class="clear"></div>'
            + '</div>';
        html.push(template);
        return html.join('');
    },
    /* eslint-disable fecs-camelcase */
    _getTemplateQrcode: function () {
        var me = this;
        var qrcodeHtml = [];
        var appHref = (me.config.qrcodeCfg && me.config.qrcodeCfg.appHref) || me.lang.appHref;
        var appName = (me.config.qrcodeCfg && me.config.qrcodeCfg.appName) || me.lang.appName;
        qrcodeHtml.push('<div id="'
            + me.$getId('qrcode')
            + '" class="clearfix tang-pass-qrcode tang-pass-login" style="display:none;">');
        qrcodeHtml.push('<div class="tang-pass-qrcode-content" id="' + me.$getId('qrcodeContent') + '">');
        qrcodeHtml.push('<div class="tang-pass-qrcode-init">');
        qrcodeHtml.push('<p class="tang-pass-qrcode-title">' + me.lang.qrcodeTitle + '</p>');
        qrcodeHtml.push('<div class="Qrcode-status-con tang-pass-qrcode-imgWrapper" id="' + me.$getId('QrcodeMain') + '">'
            + '<img class="tang-pass-qrcode-img" src="loading-3.gif"/*tpa=http://passport.baidu.com/passApi/js/modules/' + me._domain.staticFile + '/passApi/img/loading.gif*//>'
            + (me.config.qrcode_animation
                ? ('<p class="Qrcode-status-animation" id="' + me.$getId('QrcodeAnimation') + '"></p>')
                : '')
            + '</div>');
        qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-success" id="' + me.$getId('QrcodeSuccess') + '">'
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
            + '<p class="Qrcode-refresh-btn" id="'
            + me.$getId('QrcodeRefreshBtn')
            + '">'
            + me.lang.QrcodeRefreshBtn
            + '</p>'
            + '</div>');
        qrcodeHtml.push('<p class="tang-pass-qrcode-info">'
            + me.lang.qrcodeMsg.replace('#{appHref}', appHref)
            .replace('#{appName}', appName)
            + '</p>');
        qrcodeHtml.push('</div>');
        qrcodeHtml.push('</div>');
        qrcodeHtml.push((me.config.diaPassLogin && +me.config.qrcode === 1)
            ? '<a id="'
            + me.$getId('qrcode_btn_back')
            + '" class="pass-qrcode-link pass-qrcode-link-back">'
            + me.lang.backToLogin
            + '</a>'
            : '');
        qrcodeHtml.push('</div>');
        return qrcodeHtml.join('');
    },
    /* eslint-disable fecs-camelcase */
    _setEventQrcode: function () {
        var me = this;
        baidu(me.getElement('qrcode_btn_back')).on('click', function () {
            me._changeLoginType('normal');
        });
        if (+me.config.qrcode === 3 && +me.config.loginMergeQrcode === 1) {
            if (/msie 6/i.test(navigator.userAgent) || /msie 7/i.test(navigator.userAgent)) {
                setTimeout(function () {
                    me._changeLoginType('qrcode');
                }, 0);
            } else {
                me._changeLoginType('qrcode');
            }

        }
    },
    // 短信故障源-获取channel
    getChannelForUnReceiveSms: function () {
        var me = this;
        var phone = document.getElementById(me.$getId('smsPhone'));
        me.config.unReceiveSmsCode = '';
        // 先结束扫码登录的轮询，再开始上行短信登录轮询
        me._stopChannel();
        baidu.ajax({
            url: me._domain.https + '/v3/login/getChannel',
            dataType: 'jsonp',
            data: {
                from: 'up_sms_login',
                data: me._SBCtoDBC(phone.value)
            },
            success: function (rsp) {
                if (+rsp.errno === 0) {
                    me._logPass(me.urlData, {
                        'eventType': 'pc-unreceive-sms-show'
                    });
                    me._ownerDialog && me._ownerDialog.hide('unHide');
                    me.getElement('unRecevieSmsSendCode').innerHTML = rsp.captcha;
                    var smsSendNumber = '';
                    if (rsp.channelCode) {
                        smsSendNumber = rsp.channelCode + '';
                        smsSendNumber = smsSendNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
                    }
                    me.getElement('unRecevieSmsSendNumber').innerHTML = smsSendNumber;
                    me.$show(me.getElement('unRecevieSmsTip'));
                    passport.spareWData.sign = rsp.channelId;
                    me.config.unReceiveSmsCode = rsp.captcha || '';
                    me._createChannel(rsp.channelId);
                    // 标记channel来源，区分轮询
                    me.config.channelType = 'unReceiveSms';
                } else {
                    passport.spareWData.unicast
                     && clearTimeout(passport.spareWData.unicast);
                    me._setSmsGeneralError(rsp.errmsg);
                }
            },
            error: function () {}
        });
    },
    /* eslint-disable fecs-camelcase */
    _setChannel: function () {
        var me = this;
        // 标记channel来源，区分轮询
        me.config.channelType = 'qrcode';
        var data = {
            apiver: 'v3',
            tt: new Date().getTime(),
            tpl: me.config.product || ''
        };
        passport.spareWData = passport.spareWData || {};
        baidu('.Qrcode-status-con').hide();
        me.$show(me.getElement('QrcodeMain'));
        passport.spareWData.loadQrcode = setTimeout(function () {
            if (me.config.diaPassLogin || me.config.defaultCss || me.config.qrcode_style) {
                baidu('.Qrcode-status-con').hide();
                baidu('.refresh-title').hide();
                baidu('.refresh-loadout').show();
                me.$show(me.getElement('QrcodeRefresh'));
            }
        }, 5 * 1000);
        var url = me._domain.https + '/v2/api/getqrcode?lp=pc&qrloginfrom=pc&gid=' + (me.guideRandom || '');
        // 增加网盘的小程序参数
        if (me.config.moreParams && me.config.moreParams.qrext_clientid) {
            url += '&qrext_clientid=' + me.config.moreParams.qrext_clientid;
        }
        baidu.ajax({
            url: url,
            dataType: 'jsonp',
            data: data,
            success: function (args) {
                clearTimeout(passport.spareWData.loadQrcode);
                clearTimeout(passport.spareWData.unicast);
                passport.spareWData.channelimg = (window.location ? window.location.protocol : document.location.protocol) + '//' + args.imgurl;
                passport.spareWData.sign = args.sign;
                me._createChannel(passport.spareWData.sign);
                var img = baidu('.tang-pass-qrcode-img');
                for (var i = 0, len = img.length; i < len; i++) {
                    img.get(i).src = passport.spareWData.channelimg;
                }
                ;
            },
            error: function () {
                clearTimeout(passport.spareWData.loadQrcode);
                clearTimeout(passport.spareWData.unicast);
                if (me.config.diaPassLogin || me.config.defaultCss || me.config.qrcode_style) {
                    baidu('.Qrcode-status-con').hide();
                    me.$show(me.getElement('QrcodeError'));
                }
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _stopChannel: function () {
        passport.spareWData = passport.spareWData || {};
        passport.spareWData.sign = '';
        clearInterval(passport.spareWData.timer);
    },
    /* eslint-disable fecs-camelcase */
    _createChannel: function (sign) {
        var me = this,
            qrcodeSign = sign,
            container = me.getElement('qrcodeContent'),
            qrcodeInit = baidu('.tang-pass-qrcode-init', container).get(0),
            qrcodeImg = baidu('.tang-pass-qrcode-img', qrcodeInit).get(0);
        var data = {
            apiver: 'v3',
            tt: new Date().getTime()
        };
        passport.spareWData = passport.spareWData || {};
        // 上行短信轮询不展示二维码错误提示
        if (!me.config.unReceiveSmsCode) {
            passport.spareWData.unicast = setTimeout(function () {
                baidu('.Qrcode-status-con').hide();
                me.$show(me.getElement('QrcodeError'));
            }, 35 * 1000);
        }
        baidu.ajax({
            url: me._domain.https + '/channel/unicast?channel_id=' + passport.spareWData.sign + '&tpl=' + me.config.product + '&gid=' + (me.guideRandom || ''),
            dataType: 'jsonp',
            data: data,
            success: function (d) {
                if (!me.config.unReceiveSmsCode) {
                    clearTimeout(passport.spareWData.unicast);
                }
                if (d.channel_v) {
                    try {
                        /* eslint-disable fecs-camelcase */
                        /* eslint-disable fecs-no-eval */
                        d.channel_v = eval('(' + d.channel_v + ')');
                    } catch (e) {
                        d.channel_v = {};
                    }
                } else {
                    d.channel_v = {};
                }
                if (d.channel_v.u) {
                    d.channel_v.u = decodeURIComponent(d.channel_v.u);
                }
                if (me.config.channelType === 'unReceiveSms' && +d.errno === 0 && +d['channel_v'] === 1) {
                    me._logPass(me.urlData, {
                        'eventType': 'pc-smslogin-unreceive-send-'
                            + (me.config.isPwd && me.config.isPwd < 0 ? 'reg' : 'login')
                    });
                    document.getElementById(me.$getId('smsVerifyCode')).value = me.config.unReceiveSmsCode;
                    me.config.unReceiveSmsCode = '';
                    me._submitSmsForm(sign);
                    me.$hide(me.getElement('unRecevieSmsTip'));
                    me._ownerDialog && me._ownerDialog.show();
                }
                else if (d.errno + '' === '0' && d.channel_v.status + '' === '0') {
                    clearInterval(passport.spareWData.timer);
                    var data = {
                        bduss: d.channel_v.v,
                        u: encodeURIComponent(d.channel_v.u || me.config.u),
                        qrcode: 1,
                        tpl: me.config.product ? me.config.product : ''
                    };
                    passport.data.jsonp('/v2/api/bdusslogin?tt=' + new Date().getTime(), data).success(function (args) {
                        var returnValue = me.fireEvent('loginSuccess', {
                            rsp: args
                        });
                        if (!returnValue) {
                            return;
                        }
                        window.location.href = args.data.u;
                    });
                } else {
                    if (d.errno + '' === '0' && d.channel_v.status + '' === '1') {
                        // 扫码成功
                        if (me.config.diaPassLogin || me.config.defaultCss || me.config.qrcode_style) {
                            baidu('.Qrcode-status-con').hide();
                            me.$show(me.getElement('QrcodeSuccess'));
                        }
                    } else if (d.errno + '' === '0' && d.channel_v.status + '' === '2') {
                        clearInterval(passport.spareWData.timer);
                        if (me.config.diaPassLogin || me.config.defaultCss || me.config.qrcode_style) {
                            baidu('.Qrcode-status-con').hide();
                            baidu('.refresh-title').hide();
                            baidu('.refresh-timeout').show();
                            me.$show(me.getElement('QrcodeRefresh'));
                        } else {
                            if (qrcodeImg) {
                                qrcodeImg.src = me._domain.staticFile + '/passApi/img/loading.gif';
                            }
                            me._setChannel();
                            passport.spareWData.timer = setInterval(function () {
                                me._setChannel();
                            }, 10 * 60 * 1000);
                        }
                    }
                    if (qrcodeSign === passport.spareWData.sign) {
                        me._createChannel(qrcodeSign);
                    }
                }
            },
            error: function () {
                if (!me.config.unReceiveSmsCode) {
                    clearTimeout(passport.spareWData.unicast);
                }
                if (me.config.diaPassLogin || me.config.defaultCss || me.config.qrcode_style) {
                    baidu('.Qrcode-status-con').hide();
                    me.$show(me.getElement('QrcodeError'));
                }
            }
        });
    },

    refreshQrcode: function () {
        // 点击刷新二维码
        var me = this;
        clearTimeout(passport.spareWData.unicast);
        var container = me.getElement('qrcodeContent');
        var qrcodeInit = baidu('.tang-pass-qrcode-init', container).get(0);
        var qrcodeImg = baidu('.tang-pass-qrcode-img', qrcodeInit).get(0);

        if (qrcodeImg) {
            qrcodeImg.src = me._domain.staticFile + '/passApi/img/loading.gif';
        }
        me._setChannel();
        passport.spareWData.timer = setInterval(function () {
            me._setChannel();
        }, 10 * 60 * 1000);
    },
    /* eslint-disable fecs-camelcase */
    _actionQrcode: function () {
        var me = this;
        var container = me.qrcodeDialogDom ? me.qrcodeDialogDom : this.getElement();
        var parent = me._getWDom.parent(container);
        var parents = me._getWDom.parent(parent);

        passport.spareWData = passport.spareWData || {};
        // config.channelType: 来自短信登录且打开过收不到验证码重新刷新验证码生成新的channelId进行轮询
        if (!passport.spareWData.channelimg
            || (me.config.channelType && me.config.channelType === 'unReceiveSms')) {
            me._setChannel();
            passport.spareWData.timer = setInterval(function () {
                me._setChannel();
            }, 10 * 60 * 1000);
        }
    },
    // 收不到验证码
    getTemplateUnreceiveSms: function () {
        var me = this;
        me.config.unReceiveSmsTempStatus = 'none';
        var templateStr = '<div id="' + me.$getId('unRecevieSmsTip')
         + '" class="pass-unreceiveSms-tip-wrapper" style="display:' + me.config.unReceiveSmsTempStatus + '">';
        templateStr += '<div class="pass-unreceiveSms-mask"></div>'
         + '<div class="pass-unreceiveSms-tip-wrapper-content"><div class="unreceiveSms-header">'
         + '<h3 class="unreceiveSms-header-h3">收不到验证码</h3><a class="unreceiveSms-header-a" id="'
         + me.$getId('closeUnRecevieSmsTip') + '"></a></div>';
        templateStr += '<div class="unreceiveSms-article">'
            + '<div class="pass-unreceiveSms-content">'
                + '<p class="pass-unreceiveSms-p">1.请检查短信是否被安全软件拦截</p>'
                + '<p class="pass-unreceiveSms-p">2.运营商网络原因，短信可能延迟到达</p>'
                + '<p class="pass-unreceiveSms-t25" id="' + me.$getId('unRecevieSmsReged') + '" style="display:none;">'
                    + '建议您<a class="pass-unreceiveSms-btn-tip" id="'
                    + me.$getId('unRecevieSmsChangeLogin') + '">切换登录方式</a>或'
                    + '使用该手机号，编辑短信“<span class="pass-unreceiveSms-btn-tip" id="'
                    + me.$getId('unRecevieSmsSendCode') + '"></span>”，发送至'
                    + '<span id="' + me.$getId('unRecevieSmsSendNumber') + '"></span>' + '即可登录'
                    + '成功<span class="pass-unreceiveSms-text-tip">（短信费用请参考运营商资费标准）</span></p>'
                + '<p class="pass-unreceiveSms-t25" id="' + me.$getId('unRecevieSmsUnReg') + '" style="display:none;">'
                    + '建议使用当前手机号，编辑短信 8-14 位字符（支持数字/字母/符号），'
                    + '作为登录密码，发送至1069 0691 036590，即可注册成功'
                    + '<span class="pass-unreceiveSms-text-tip">（短信费用请参考运营商资费标准）</span></p>'
            + '</div></div></div>';
        return templateStr;
    },
    /* eslint-disable fecs-camelcase */
    _showQrcode: function () {
        var me = this,
            container = this.getElement(),
            parent = me._getWDom.parent(container),
            parents = me._getWDom.parent(parent),
            btn = baidu('.pass-qrcode-btn', parents).get(0);

        if (me._getWDom.prev(container)) {
            me.$hide(me._getWDom.prev(container));
        }

        me.$hide('choiceuser_article').$hide(container).$show(baidu('.tang-pass-qrcode', parent).get(0));

        if (me._getWDom.next(btn)) {
            me.$hide(btn);
        } else {
            me.$hide(me._getWDom.parent(me._getWDom.parent(btn)));
        }
    },

    /*
二维码动画显示
*/
    qrcodeAnimationShow: function () {
        var me = this;
        if (me.supportCss3Anim()) {
            baidu(me.getElement('QrcodeMain')).removeClass('Qrcode-animationRight').addClass('Qrcode-animation');
        } else {
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
        } else {
            baidu(me.getElement('QrcodeMain')).css('margin-left', '99px');
        }
    },
    /*
      检测是否支持css3动画
    */
    supportCss3Anim: function () {
        var test = document.getElementsByTagName('body')[0].style;
        if (typeof test.animation !== 'undefined' || typeof test.WebkitAnimation !== 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    // 二维码动画相关事件
    setqrcodeEvent: function () {
        var me = this;
        if (me.config.qrcode_animation) {
            baidu(me.getElement('QrcodeMain')).on('mouseenter', function (e) {
                if (e && e.preventDefault) {
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
    /* eslint-disable fecs-camelcase */
    _getTemplateSms: function () {
        var me = this;
        var isShow = (+me.config.defaultLoginType !== 1 && (+me.config.sms === 2 || +me.config.sms === 3)) ? '' : 'none';
        var templateStr = '<div id="'
            + me.$getId('sms')
            + '" class="tang-pass-login tang-pass-sms" style="display:'
            + isShow
            + '">';
        var hiddenFields = {
            u: me.config.u,
            staticPage: me.config.staticPage,
            tpl: me.config.product ? me.config.product : '',
            idc: me.config.idc ? me.config.idc : '',
            isdpass: '1',
            gid: me.guideRandom || '',
            switchuname: '',
            smsCodeString: '',
            smsVcodesign: '',
            smsVcodestr: '',
            subpro: me.config.subpro,
            is_voice_sms: me.config.is_voice_sms,
            voice_sms_flag: 0
        };
        templateStr += '<p class="tang-pass-sms-title">\u77ed\u4fe1\u767b\u5f55</p>';
        templateStr += '<p class="tang-pass-sms-tip">'
            + (me.config.smsText
                || '\u9A8C\u8BC1\u5373\u767B\u5F55\uFF0C\u672A\u6CE8'
                + '\u518C\u5C06\u81EA\u52A8\u521B\u5EFA\u767E\u5EA6\u5E10\u53F7')
            + '</p>';
        templateStr += '<form id="' + me.$getId('smsForm') + '" method="POST">';
        templateStr += me._getHiddenField(hiddenFields, 'smsHiddenFields');
        templateStr += '<p id="'
            + me.$getId('smsErrorWrapper')
            + '" class="pass-generalErrorWrapper">'
            + '<span id="'
            + me.$getId('smsError')
            + '" class="pass-generalError"></span>'
            + '</p>';
        templateStr += '<div id="'
            + me.$getId('smsPhoneWrapper')
            + '" class="pass-form-item pass-form-item-smsPhone'
            + (!me.foreignMobile ? '' : ' pass-form-item-PhoneCountry')
            + '">'
            + '<label for="'
            + me.$getId('smsPhone')
            + '" id="'
            + (!me.foreignMobile ? me.$getId('smsPhoneLabel') : me.$getId('smsPhoneCountryLabel'))
            + '" class="pass-label pass-label-smsPhone'
            + '" data-countryCode="">'
            + (!me.foreignMobile ? me.lang.smsPhone : '+86')
            + '</label>'
            + '<input id="'
            + me.$getId('smsPhone')
            + '" type="text" name="username" class="pass-text-input pass-text-input-smsPhone" />'
            + '<span id="'
            + me.$getId('smsPhoneTip')
            + '" class="pass-item-tip pass-item-tip-smsPhone" style="display:none"><span id="'
            + me.$getId('smsPhoneTipText')
            + '"></span></span>'
            + (me.foreignMobile ? '<ul id="' + me.$getId('smsCountryList') + '" class="pass-country-list"></ul>' : '')
            + '</div>';
        templateStr += '<p id="'
            + me.$getId('smsVerifyCodeWrapper')
            + '" class="pass-form-item pass-form-item-smsVerifyCode">'
            + '<label for="'
            + me.$getId('smsVerifyCode')
            + '" id="'
            + me.$getId('smsVerifyCodeLabel')
            + '" class="pass-label pass-label-smsVerifyCode">'
            + me.lang.smsVerifyCode
            + '</label>'
            + '<input id="'
            + me.$getId('smsVerifyCode')
            + '" type="text" name="password" class="pass-text-input pass-text-input-smsVerifyCode" />'
            + '<button id="'
            + me.$getId('smsTimer')
            + '" class="pass-item-timer">\u53D1\u9001'
            + me.lang.smsVerifyCode
            + '</button>'
            + '<span id="'
            + me.$getId('smsVerifyCodeTip')
            + '" class="pass-item-tip pass-item-tip-smsVerifyCode" style="display:none"><span id="'
            + me.$getId('smsVerifyCodeTipText')
            + '"></span></span>'
            + '</p>';
        templateStr += '<p id="' + me.$getId('smsUnReceiveWrapper')
            + '" class="pass-form-item pass-form-item-unrecevie" style="display:none;">'
            + '<span id="' + me.$getId('smsUnReceiveTipWrapper') + '" class="pass-sms-unreceive-tips">'
            + me.lang.unReceiveSmsCode + '</span></p>';
        if (+me.config.is_voice_sms !== 1) {
            templateStr += '<p id="'
                + me.$getId('smsSubmitWrapper')
                + '" class="pass-form-item pass-form-item-submit">'
                + '<input id="'
                + me.$getId('smsSubmit')
                + '" type="submit" value="\u767B\u5F55" class="pass-button pass-button-submit" />'
                + '<span class="tang-pass-sms-agreement">'
                + me.lang.agree
                + '<a target="_blank" href="'
                + me.constant.PROTOCAL_URL
                + '">'
                + me.lang.baiduUserProtocal
                + '</a></span>'
                + (+me.config.sms === 3 ? '' : ('<a id="' + me.$getId('sms_btn_back')
                    + '" class="pass-sms-link pass-sms-link-back">'
                    + me.lang.backToLogin + '</a>'))
                + '</p>';
        } else {
            templateStr += '<p id="'
                + me.$getId('smsSubmitWrapper')
                + '" class="pass-form-item pass-form-item-submit">'
                + '<input id="'
                + me.$getId('smsSubmit')
                + '" type="submit" value="\u767B\u5F55" class="pass-button pass-button-submit" />'
                + '<input  type="button" style="border:none;background:none;'
                + 'margin-top:12px;cursor:pointer;color:#2e7fdb;font-size:12px"'
                + ' class="pass-is_voice"  id="getVoiceSms" value="获取语音验证码" />'
                + (+me.config.sms === 3 ? '' : ('<a id="' + me.$getId('sms_btn_back')
                    + '" class="pass-sms-link pass-sms-link-back">'
                    + me.lang.backToLogin
                    + '</a>'))
                + '</br><span class="tang-pass-sms-agreement">'
                + me.lang.agree
                + '<a target="_blank" href="'
                + me.constant.PROTOCAL_URL
                + '">'
                + me.lang.baiduUserProtocal
                + '</a></span>'
                + '</p>';
        }

        templateStr += '</form>';

        templateStr += '</div>';

        return templateStr;
    },
    /* eslint-disable fecs-camelcase */
    _setEventSms: function () {
        var me = this;
        var container = this.getElement();
        var parent = me._getWDom.parent(container);
        var parents = me._getWDom.parent(parent);
        var smsLogin = baidu('#' + me.$getId('sms'), parents).get(0);
        var baiduInput = baidu('.pass-text-input', smsLogin);

        if (me.foreignMobile) {
            baidu(me.getElement('smsPhoneCountryLabel')).on('click', function (evt) {
                var smsCountryList = me.getElement('smsCountryList');
                if (smsCountryList && smsCountryList.style.display !== 'block') {
                    me.$show(smsCountryList);
                    baidu(me.getElement('smsPhoneCountryLabel')).addClass('pass-label-code-up');
                } else if (smsCountryList) {
                    me.$hide(smsCountryList);
                    baidu(me.getElement('smsPhoneCountryLabel')).removeClass('pass-label-code-up');
                }
                me._selectCountryList(me.getElement('smsPhoneWrapper'));
                evt.preventDefault();
            });
        }

        baiduInput.on('mouseover', function (e) {
            var returnValue = me.fireEvent('fieldMouseover', {
                ele: baidu(this)
            });
            if (!returnValue) {
                return;
            }
            baidu(this).addClass(me.constant.HOVER_CLASS);
        });
        baiduInput.on('mouseout', function (e) {
            var returnValue = me.fireEvent('fieldMouseout', {
                ele: baidu(this)
            });
            if (!returnValue) {
                return;
            }
            baidu(this).removeClass(me.constant.HOVER_CLASS);
        });
        baiduInput.on('keydown', function (e) {
            if (+e.keyCode === 13) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                // 发送点击短信登录按钮统计
                var autoStatisticObj = {
                    'eventType': 'pc-smslogin-submit-click'
                };
                me._logPass(me.urlData, autoStatisticObj);

                me._submitSmsForm(e);
            }
        });

        var baiduSmsPhone = baidu(me.getElement('smsPhone'));
        baiduSmsPhone.on('focus', function (e) {
            if (!me.initialized) {
                me._initApi();
            }
            var returnValue = me.fireEvent('fieldFocus', {
                ele: baidu(this)
            });
            if (!returnValue) {
                return;
            }
            baidu(this).addClass(me.constant.FOCUS_CLASS);
            baidu(me.getElement('smsPhoneLabel')).addClass(me.constant.LABEL_FOCUS_CLASS);
            baidu(this).removeClass(me.constant.ERROR_CLASS);
            var smsRegPromptWrapper = document.getElementById(me.$getId('smsRegPromptWrapper'));
            var smsloginPromptWrapper = document.getElementById(me.$getId('smsloginPromptWrapper'));
            var smsSecondPromptWrapper = document.getElementById(me.$getId('smsSecondPromptWrapper'));

            if (smsRegPromptWrapper) {
                me.$hide(smsRegPromptWrapper);
            }
            if (smsloginPromptWrapper) {
                me.$hide(smsloginPromptWrapper);
            }
            if (smsSecondPromptWrapper) {
                me.$hide(smsSecondPromptWrapper);
            }
        });
        // 发送短信登录手机号输入统计
        baiduSmsPhone.on('keydown', function () {
            if (!me.isSendSmsInput) {
                me.isSendSmsInput = true;
                var autoStatisticObj = {
                    'eventType': 'pc-smslogin-input'
                };
                me._logPass(me.urlData, autoStatisticObj);
            }
        });

        var baiduCodeInput = baidu(me.getElement('smsVerifyCode'));
        baiduCodeInput.on('focus', function (e) {
            if (!me.initialized) {
                me._initApi();
            }
            var returnValue = me.fireEvent('fieldFocus', {
                ele: baidu(this)
            });
            if (!returnValue) {
                return;
            }
            baidu(this).addClass(me.constant.FOCUS_CLASS);
            baidu(me.getElement('smsVerifyCodeLabel')).addClass(me.constant.LABEL_FOCUS_CLASS);
            baidu(this).removeClass(me.constant.ERROR_CLASS);
        });
        // 发送短信登录短信验证码输入统计
        baiduCodeInput.on('keydown', function () {
            if (!me.isSendSmsCodeInput) {
                me.isSendSmsCodeInput = true;
                var autoStatisticObj = {
                    'eventType': 'pc-smslogin-code-input'
                };
                me._logPass(me.urlData, autoStatisticObj);
            }
        });


        baiduInput.on('blur', function (e) {
            if (this.value) {
                var returnValue = me.fireEvent('fieldBlur', {
                    ele: baidu(this)
                });
                if (!returnValue) {
                    return;
                }
                this.name === 'username' ? me._validatorPhoneFn(this) : me._validatorSmsFn(this);
            }
            baidu(this).removeClass(me.constant.FOCUS_CLASS);
            baidu(me.getElement('smsPhoneLabel')).removeClass(me.constant.LABEL_FOCUS_CLASS);
        });
        baidu('#' + me.$getId('smsTimer'), smsLogin).on('click', function (evt) {
            // 发送点击发送验证码统计
            var autoStatisticObj = {
                'eventType': 'pc-smslogin-send-click'
            };
            me._logPass(me.urlData, autoStatisticObj);

            /* eslint-disable fecs-camelcase */
            me.config.voice_sms_flag = 0;
            evt.preventDefault();
            me._checkRegPhone();
        });
        baidu('#' + me.$getId('smsSubmit'), smsLogin).on('click', function (evt) {
            // 发送点击短信登录按钮统计
            var autoStatisticObj = {
                'eventType': 'pc-smslogin-submit-click'
            };
            me._logPass(me.urlData, autoStatisticObj);

            if (evt && evt.preventDefault) {
                evt.preventDefault();
            }

            me._submitSmsForm();

        });
        if (+me.config.defaultLoginType !== 1 && (+me.config.sms === 2 || +me.config.sms === 3)) {
            if (/msie 6/i.test(navigator.userAgent) || /msie 7/i.test(navigator.userAgent)) {
                setTimeout(function () {
                    me._changeLoginType('sms');
                }, 0);
            } else {
                me._changeLoginType('sms');
            }

        }
        if (+me.config.defaultLoginType === 1) {
            me._changeLoginType('normal');
        }
        baidu(me.getElement('smsSwitch')).on('click', function () {
            if (/msie 6/i.test(navigator.userAgent) || /msie 7/i.test(navigator.userAgent)) {
                setTimeout(function () {
                    me._changeLoginType('sms');
                }, 0);
            } else {
                me._changeLoginType('sms');
            }
        });
        baidu(me.getElement('sms_btn_back')).on('click', function () {
            me._changeLoginType('normal');
            if (me.getElement('password')) {
                me._doFocus('password');
            }
        });
        baidu(document.getElementById('getVoiceSms')).on('click', function (evt) {
            /* eslint-disable fecs-camelcase */
            me.config.voice_sms_flag = 1;
            evt.preventDefault();
            me._checkRegPhone();
        });
        // 短信故障预案-收不到短信验证码弹窗
        baidu(me.getElement('smsUnReceiveWrapper')).on('click', function (evt) {
            me._logPass(me.urlData, {
                'eventType': 'pc-smslogin-unreceive-sms-btn-click'
            });
            evt.preventDefault();
            if (me.config.isPwd && +me.config.isPwd === 1) {
                me.getChannelForUnReceiveSms();
            } else {
                me._logPass(me.urlData, {
                    'eventType': 'pc-unreceive-sms-show-reg'
                });
                me._ownerDialog && me._ownerDialog.hide('unHide');
                me.$show(me.getElement('unRecevieSmsTip'));
            }
        });
        baidu(me.getElement('closeUnRecevieSmsTip')).on('click', function (evt) {
            evt.preventDefault();
            me.$hide(me.getElement('unRecevieSmsTip'));
            me._ownerDialog && me._ownerDialog.show();
        });
        // 短信故障预案-切换其他登录方式
        baidu(me.getElement('unRecevieSmsChangeLogin')).on('click', function (evt) {
            me._logPass(me.urlData, {
                'eventType': 'pc-smslogin-unreceive-sms-change-login-click'
            });
            evt.preventDefault();
            me.$hide(me.getElement('unRecevieSmsTip'));
            me._ownerDialog && me._ownerDialog.show();
            var type = 'normal';
            if (me.config.qrcode && me.config.isPwd && +me.config.isPwd !== 1) {
                type = 'qrcode';
            }
            me._changeLoginType(type);
        });
    },
    /* eslint-disable fecs-camelcase */
    _setSmsGeneralError: function (msg) {
        this.getElement('smsError').innerHTML = msg;
    },
    /* eslint-disable fecs-camelcase */
    _sendVcode: function (obj) {
        var me = obj || this;
        var is_voice_sms = me.config.voice_sms_flag;
        var phone = document.getElementById(me.$getId('smsPhone'));
        var countrycode = me.getElement('smsPhoneCountryLabel')
            ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '')
            : '';
        var disTime = 60;
        var timer;
        var smsLogin = baidu('#' + me.$getId('sms')).get(0);
        if (!me._validatorPhoneFn(phone)) {
            return;
        }

        baidu('#' + me.$getId('smsRegPromptBtn'), smsLogin).off('click');
        baidu('#' + me.$getId('smsRegPromptBtn'), smsLogin).on('click', function (evt) {
            evt.preventDefault();
        });

        var baiduSmsTimer = baidu('#' + me.$getId('smsTimer'), smsLogin);
        baiduSmsTimer.off('click');
        baiduSmsTimer.on('click', function (evt) {
            evt.preventDefault();
        });

        baiduSmsTimer.removeClass('pass-item-timer');
        baiduSmsTimer.addClass('pass-item-time-timing');

        var data = {
            gid: me.guideRandom || '',
            username: me._SBCtoDBC(phone.value),
            countrycode: countrycode,
            bdstoken: me.bdPsWtoken,
            tpl: me.config.product ? me.config.product : '',
            flag_code: me.config.voice_sms_flag,
            client: me.config.client
        };
        data.dv = document.getElementById('dv_Input')
            ? document.getElementById('dv_Input').value
            : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        var domainArea = '';
        if (+me.config.voice_sms_flag === 1) {
            domainArea = window.location.protocol.toLowerCase()
                + '//wappass.baidu.com/wp/api/login/sms?is_voice_sms='
                + me.config.voice_sms_flag;
        } else {
            domainArea = me._domain.auto + '/v2/api/senddpass';
        }
        passport.data.jsonp(domainArea, data).success(function (args) {
            if (+me.config.voice_sms_flag === 0
                && +args.data.errno !== 0
                || +me.config.voice_sms_flag === 1
                && +args.errInfo.no !== 0) {
                if (+args.data.errno === 18
                    || +args.data.errno === 19
                    || args.errInfo.no + '' === '50020'
                    || args.errInfo.no + '' === '50021') {
                    var confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + args.data.vcodestr;
                    var callbackOne = function () {
                        window.confirmSmsVerifyWidget = passport.pop.init({
                            type: 'confirmWidget',
                            tangram: true,
                            titleText: '安全验证',
                            width: 490,
                            apiOpt: {
                                Continue: '确定',
                                contentHTML: '<p class="pass-confirm-verifyWidget-msg">请填写图中的验证码</p>'
                                + '<p class="pass-confirm-verifyWidget-imgWrapper">'
                                + '<input type="text" class="pass-text-input pass-confirm-verifyWidget-verifyCode" id="'
                                + me.$getId('confirmVerifyCode')
                                + '" name="confirmVerifyCode" value="" />'
                                + '<img src="'
                                + confirmVerifyCodeImgSrc
                                + '" title="" class="pass-confirm-verifyWidget-verifyCode-img" id="'
                                + me.$getId('confirmVerifyCodeImg')
                                + '" />'
                                + '<a href="#" class="pass-confirm-verifyWidget-imgChange" id="'
                                + me.$getId('confirmVerifyCodeChange')
                                + '">换一张</a>'
                                + '<span class="pass-confirm-verifyWidget-error" id="'
                                + me.$getId('confirmVerifyCodeError')
                                + '"></span>'
                                + '</p>'
                            },
                            onRender: function (evt) {
                                baidu(window.confirmSmsVerifyWidget.getElement('confirmWidget_footer'))
                                .addClass('pass-confirm-verifyWidget-bottom');
                                me.config.hasPlaceholder && me._getPlaceholder([{
                                    label: 'confirmVerifyCode',
                                    placeholder: 'verifyCode'
                                }]);
                                baidu(me.getElement('confirmVerifyCodeChange')).on('click', function () {
                                    baidu(me.getElement('confirmVerifyCodeImg')).attr('src',
                                        me.constant.VERIFYCODE_URL_PREFIX
                                        + me.getElement('smsHiddenFields_smsVcodestr').value
                                        + '&v='
                                        + new Date().getTime());
                                });
                                var baiduVcode = baidu(me.getElement('confirmVerifyCode'));
                                baiduVcode.on('keyup', function () {
                                    baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
                                    var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                    baiduCodeError.hide();
                                    baiduCodeError.get(0).innerHTML = '';
                                });
                                baiduVcode.on('change', function () {
                                    var element = me.getElement('confirmVerifyCode');
                                    element.value = element.value.replace(/\s/g, '');
                                });
                            },
                            onConfirmClose: function (evt) {
                                baidu(me.getElement('confirmVerifyCodeError')).hide();
                                baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                                window.confirmSmsVerifyWidget.hide();
                                me._ownerDialog && me._ownerDialog.show();
                            },
                            onConfirmCancel: function (evt) {

                            },
                            onConfirmContinue: function (evt) {
                                if (me.getElement('confirmVerifyCode').value === '') {
                                    baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                    var baiduError = baidu(me.getElement('confirmVerifyCodeError'));
                                    baiduError.show();
                                    baiduError.get(0).innerHTML = me.lang.confirmVerCodeEmpty;
                                    return;
                                }
                                var dvInput = document.getElementById('dv_Input');
                                var data = {
                                    'gid': me.guideRandom || '',
                                    'username': me._SBCtoDBC(phone.value),
                                    'countrycode': countrycode,
                                    'bdstoken': me.bdPsWtoken,
                                    'tpl': me.config.product ? me.config.product : '',
                                    'vcodestr': me.getElement('smsHiddenFields_smsVcodestr').value,
                                    'vcodesign': me.getElement('smsHiddenFields_smsVcodesign').value,
                                    'verifycode': me._SBCtoDBC(me.getElement('confirmVerifyCode').value),
                                    'flag_code': me.config.voice_sms_flag,
                                    'dv': (dvInput ? dvInput.value
                                        : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || ''))
                                };

                                var domainArea = '';
                                if (+me.config.voice_sms_flag === 1) {
                                    domainArea = window.location.protocol.toLowerCase()
                                        + '//wappass.baidu.com/wp/api/login/sms?is_voice_sms='
                                        + me.config.voice_sms_flag;
                                } else {
                                    domainArea = me._domain.auto + '/v2/api/senddpass';
                                }
                                passport.data.jsonp(domainArea, data).success(function (rsp) {
                                    var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                    if (+me.config.voice_sms_flag === 0
                                        && +args.data.errno !== 0
                                        || +me.config.voice_sms_flag === 1
                                        && +args.errInfo.no !== 0) {
                                        var smsTimer = document.getElementById(me.$getId('smsTimer'));
                                        if (+me.config.voice_sms_flag === 1) {
                                            var voiceTime = 15;
                                            var voiceSms = document.getElementById('getVoiceSms');
                                            voiceSms.disabled = true;
                                            timer = setInterval(function () {
                                                if (!voiceSms) {
                                                    return;
                                                }
                                                if ((--voiceTime) === 0) {
                                                    clearInterval(timer);
                                                    var baiduSmsTimer = baidu('#' + me.$getId('smsTimer'), smsLogin);
                                                    baiduSmsTimer.removeClass('pass-item-time-timing');
                                                    baiduSmsTimer.addClass('pass-item-timer');
                                                    voiceSms.disabled = false;
                                                    voiceSms.value = '\u91CD\u65B0\u53D1\u9001' + '语音验证码';
                                                    smsTimer.innerHTML = '\u91CD\u65B0\u53D1\u9001';
                                                    voiceTime = 60;
                                                } else {
                                                    voiceSms.value = '已发送' + voiceTime + 's';
                                                }
                                            }, 1000);
                                        } else {
                                            timer = setInterval(function () {
                                                if ((--disTime) === 0) {
                                                    clearInterval(timer);
                                                    var baiduSmsTimer = baidu('#' + me.$getId('smsTimer'), smsLogin);
                                                    baiduSmsTimer.removeClass('pass-item-time-timing');
                                                    baiduSmsTimer.addClass('pass-item-timer');
                                                    smsTimer.innerHTML = '\u91CD\u65B0\u53D1\u9001';
                                                    disTime = 60;
                                                } else if (disTime === 49) {
                                                    me._logPass(me.urlData, {
                                                        'eventType': 'pc-smslogin-unreceive-btn-show-old'
                                                    });
                                                    me.$show(me.getElement('smsUnReceiveWrapper'));
                                                } else {
                                                    smsTimer.innerHTML = '\u91CD\u65B0\u53D1\u9001(' + disTime + ')';
                                                }
                                            }, 1000);
                                        }
                                        baiduCodeError.hide();
                                        baiduCodeError.get(0).innerHTML = '';
                                        window.confirmSmsVerifyWidget.hide();
                                        me._ownerDialog && me._ownerDialog.show();
                                    } else if (+rsp.data.errno === 20 || +rsp.data.errno === 21) {
                                        var eleVcode = me.getElement('confirmVerifyCode');
                                        baidu(eleVcode).addClass('pass-text-input-error');
                                        baiduCodeError.show();
                                        baiduCodeError.get(0).innerHTML = rsp.data.msg;
                                        me.getElement('confirmVerifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX
                                            + rsp.data.vcodestr;
                                        eleVcode.value = '';
                                        me.getElement('smsHiddenFields_smsVcodesign').value = rsp.data.vcodesign;
                                        me.getElement('smsHiddenFields_smsVcodestr').value = rsp.data.vcodestr;
                                    } else if (+rsp.data.errno === 27) {
                                        document.location.href = 'https://passport.baidu.com/v2/?reg&overseas='
                                            + me.config.overseas
                                            + '&tpl='
                                            + me.config.product
                                            + '&u='
                                            + encodeURIComponent(me.config.u);
                                    } else {
                                        baiduCodeError.hide();
                                        window.confirmSmsVerifyWidget.hide();
                                        me._ownerDialog && me._ownerDialog.show();
                                        if (+me.config.voice_sms_flag === 1) {
                                            me._setSmsGeneralError(rsp.errInfo.msg);
                                        } else {
                                            me._setSmsGeneralError(rsp.data.msg);
                                        }
                                    }
                                });

                            }
                        });
                        me._ownerDialog && me._ownerDialog.hide('unHide');
                        window.confirmSmsVerifyWidget.show();
                    };
                    me.getElement('smsHiddenFields_smsVcodesign').value = args.data.vcodesign;
                    me.getElement('smsHiddenFields_smsVcodestr').value = args.data.vcodestr;
                    if (window.confirmSmsVerifyWidget) {
                        // TODO 切换验证码图片
                        me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
                        me.getElement('confirmVerifyCode').value = '';
                        me._ownerDialog && me._ownerDialog.hide('unHide');
                        window.confirmSmsVerifyWidget.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js',
                            true,
                            callbackOne
                        );
                    }
                } else if (+args.data.errno === 27) {
                    document.location.href = 'https://passport.baidu.com/v2/?reg&overseas='
                        + me.config.overseas
                        + '&tpl='
                        + me.config.product
                        + '&u='
                        + encodeURIComponent(me.config.u);
                } else {
                    if (+me.config.voice_sms_flag !== 1) {
                        me._setSmsGeneralError(args.data.msg);
                    } else {
                        me._setSmsGeneralError(args.errInfo.msg);
                    }
                }

                baidu('#' + me.$getId('smsTimer'), smsLogin).addClass('pass-item-timer');
                baidu('#' + me.$getId('smsTimer'), smsLogin).removeClass('pass-item-time-timing');
                document.getElementById(me.$getId('smsTimer')).innerHTML = '\u91CD\u65B0\u53D1\u9001';
            } else {
                if (+me.config.voice_sms_flag === 1) {
                    var voiceTime = 15;
                    document.getElementById('getVoiceSms').disabled = true;
                    timer = setInterval(function () {
                        if ((--voiceTime) === 0) {
                            clearInterval(timer);
                            var $sms = me.$getId('smsTimer');
                            baidu('#' + $sms, smsLogin).removeClass('pass-item-time-timing');
                            baidu('#' + $sms, smsLogin).addClass('pass-item-timer');
                            document.getElementById('getVoiceSms').disabled = false;
                            document.getElementById('getVoiceSms').value = '\u91CD\u65B0\u53D1\u9001' + '语音验证码';
                            document.getElementById($sms).innerHTML = '\u91CD\u65B0\u53D1\u9001';
                            voiceTime = 15;
                        } else {
                            document.getElementById('getVoiceSms').value = '已发送' + voiceTime + 's';
                        }
                    }, 1000);
                } else {
                    timer = setInterval(function () {
                        var $sms = me.$getId('smsTimer');
                        if ((--disTime) === 0) {
                            clearInterval(timer);
                            baidu('#' + $sms, smsLogin).removeClass('pass-item-time-timing');
                            baidu('#' + $sms, smsLogin).addClass('pass-item-timer');
                            document.getElementById($sms).innerHTML = '\u91CD\u65B0\u53D1\u9001';
                            disTime = 60;
                        } else if (disTime === 49) {
                            me._logPass(me.urlData, {
                                'eventType': 'pc-smslogin-unreceive-btn-show-old'
                            });
                            me.$show(me.getElement('smsUnReceiveWrapper'));
                        } else {
                            document.getElementById($sms).innerHTML = '\u91CD\u65B0\u53D1\u9001(' + disTime + ')';
                        }
                    }, 1000);
                }
            }
            baidu('#' + me.$getId('smsTimer'), smsLogin).on('click', function (evt) {
                me.config.voice_sms_flag = 0;
                evt.preventDefault();
                me._checkRegPhone();
            });
        });
    },
    /* eslint-disable fecs-camelcase */
    _validatorPhoneFn: function (field) {
        var me = this;
        if (field.value + '' === '') {
            me._setSmsGeneralError('\u8BF7\u586B\u5199\u624B\u673A\u53F7');
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        } else if (me.getElement('smsPhoneCountryLabel')
            && (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') !== '')) {
            if (!new RegExp(/^(\d)*$/).test(me._SBCtoDBC(field.value))) {
                me._setSmsGeneralError('\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E');
                baidu(field).addClass(me.constant.ERROR_CLASS);
                return false;
            }
        } else if (!new RegExp(/^1[3456789]\d{9}$/).test(me._SBCtoDBC(field.value))) {
            me._setSmsGeneralError('\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E');
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me._setSmsGeneralError('');
        baidu(field).removeClass(me.constant.ERROR_CLASS);
        return true;
    },
    /* eslint-disable fecs-camelcase */
    _validatorSmsFn: function (field) {
        var me = this;
        if (field.value + '' === '') {
            me._setSmsGeneralError('\u8BF7\u586B\u5199\u9A8C\u8BC1\u7801');
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me._setSmsGeneralError('');
        return true;
    },
    /* eslint-disable fecs-camelcase */
    _postSmsData: function (data) {
        var me = this;
        data.countrycode = me.getElement('smsPhoneCountryLabel')
            ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '')
            : '';
        data.token = me.bdPsWtoken;
        if (passport.data.traceID) {
            passport.data.traceID.startFlow && passport.data.traceID.startFlow('login');
        }
        data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        passport.data.login(data)
        .success(function (rsp) {
            rsp.loginType = 'sms';
            if (+rsp.errInfo.no === 0) {
                var returnValue = me.fireEvent('loginSuccess', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }
                window.location.href = rsp.data.u;
            } else {
                me.getElement('smsSubmit').style.color = '#fff';
                var returnValue = me.fireEvent('loginError', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 4) {
                    me._setSmsGeneralError(me.lang.captchaErr);
                } else {
                    me._setSmsGeneralError(rsp.errInfo.msg);
                }

                if (+rsp.errInfo.no === 3 || +rsp.errInfo.no === 4) {
                    // 如果是短信验证码错误，或者需要输入验证码，清空并聚焦验证码栏
                    me._clearInput('smsVerifyCode');
                }
            }

            // 发送登录请求完成统计
            var autoStatisticObj = {
                'eventType': 'pc-smslogin-post-success'
            };
            var urlData = baidu.extend({}, me.urlData);
            urlData.errno = rsp.errInfo.no;
            me._logPass(urlData, autoStatisticObj);
        });
    },

    smsLoginSubmit: function (d) {
        var me = this,
            d = d || {},
            data = baidu.form.json(me.getElement('smsForm'));
        if (d.errInfo && +d.errInfo.no === 3) {
            passport.data.post('/v2/unite-bind', {
                username: d.data.username || '',
                password: data.password,
                countrycode: me.getElement('smsPhoneCountryLabel')
                    ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '')
                    : '',
                sms: 1,
                apiver: 'v3',
                token: d.data.token || ''
            }).success(function (rsp) {
                me._postSmsData(data);
            });
        } else {
            me._postSmsData(data);
        }
    },
    /* eslint-disable fecs-camelcase */
    _submitSmsForm: function (channelId) {
        var me = this;
        var phone = document.getElementById(me.$getId('smsPhone'));
        var vcode = document.getElementById(me.$getId('smsVerifyCode'));

        if (!me._validatorPhoneFn(phone)) {
            phone.focus();
            return;
        }
        if (!me._validatorSmsFn(vcode)) {
            return;
        }

        var returnValue = me.fireEvent('beforeSubmit');
        if (!returnValue) {
            return;
        }
        me.getElement('smsSubmit').style.color = '#9ebef4';
        var data = baidu.form.json(me.getElement('smsForm'));
        data.password = me._SBCtoDBC(data.password);
        data.username = me._SBCtoDBC(data.username);
        data.FP_UID = me._getCookie('FP_UID') || '';
        data.FP_INFO = window.PP_FP_INFO || '';
        data.client = me.config.client;
        data.isupsms = channelId ? 1 : '';
        data.channelid = channelId || '';
        function smsLoginFn() {
            me._postSmsData(data);
        }

        me.loginConnect({
            username: data.username,
            password: data.password,
            countrycode: me.getElement('smsPhoneCountryLabel')
                ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '')
                : '',
            smsVcode: data.password,
            isdpass: 1,
            sms: 1
        }, {
            fail: function (msg) {
                me._setSmsGeneralError(msg);
            }
        }, smsLoginFn);
    },
    /* eslint-disable fecs-camelcase */
    _setEventChoiceUser: function () {
        var me = this;
        //不用担心第二次自动提交会出现验证码，因为第一次验证全成功，第二次将不出现验证码
        var back = function () {
            baidu(me.getElement()).removeClass('tang-pass-login-hide');
            me.$show(me.getElement()).$hide('choiceuser_article');
        };
        var sub = function (e) {
            baidu(me.getElement()).removeClass('tang-pass-login-hide');
            me.$show(me.getElement()).$hide('choiceuser_article');
            me.submit();
        };
        baidu(me.getElement('choiceuser_btn_username')).on('click', function (e) {
            me.getElement('loginMerge').value = 'false';
            sub(e);
        });
        baidu(me.getElement('choiceuser_btn_mobile')).on('click', function (e) {
            me.getElement('isPhone').value = 'true';
            me.getElement('loginMerge').value = 'false';
            sub(e);
        });
        baidu(me.getElement('choiceuser_btn_back')).on('click', function (evt) {
            evt.preventDefault();
            back();
        });
    },
    /* eslint-disable fecs-camelcase */
    _getToken: function (fn) {
        var me = this;
        passport.spareWData = passport.spareWData || {};
        passport.data.getApiInfo({
            apiType: 'login',
            gid: me.guideRandom || ''
        })
        .success(function (rsp) {
            me.bdPsWtoken = rsp.data.token;
            fn && fn(me);
        });
    },
    /* eslint-disable fecs-camelcase */
    _getRSA: function (callback) {
        var me = this;
        passport.data.getRsaKey({
            gid: me.guideRandom || ''
        }).success(function (cert) {
            if (!cert.errInfo.no && +cert.errInfo.no !== 0) {
                cert = cert.data;
            }
            var RSA = new passport.lib.RSA();
            RSA.setKey(cert.pubkey);

            callback && callback({
                RSA: RSA,
                rsakey: cert.key
            });
        });
    },
    /* eslint-disable fecs-camelcase */
    _changeLoginType: function (type) {
        var me = this;
        var container = this.getElement();
        var normalHeight = 0;
        var parent = me._getWDom.parent(container);
        var parents = me._getWDom.parent(parent);
        var qrcode = me.getElement('qrcode');
        var sms = me.getElement('sms');
        var phoenixDom = baidu('.tang-pass-login-phoenix', parents).get(0);

        var loginTypeList = {
                normal: {
                    $btn: baidu('.pass-normal-btn', me.getPhoenixElement('pass_phoenix_list_login')),
                    $ele: baidu(me.getElement('form')).parent()
                },
                sms: {
                    $btn: baidu('.pass-sms-btn', me.getPhoenixElement('pass_phoenix_list_login')),
                    $ele: baidu(me.getElement('sms'))
                },
                qrcode: {
                    $btn: baidu('.pass-qrcode-btn', me.getPhoenixElement('pass_phoenix_list_login')),
                    $ele: baidu(me.getElement('qrcode'))
                }
            };
         var choiceuser = me.getElement('choiceuser_article');

        type = type || 'normal';

        // 发送切换到短信登录的统计
        if (type === 'sms') {
            me.isSendSmsCodeInput = false;
            me.isSendSmsInput = false;
            var autoStatisticObj = {
                'eventType': 'pc-smslogin-show'
            };
            me._logPass(me.urlData, autoStatisticObj);
        }

        if (me.config.diaPassLogin && (!me.currentLoginType || me.currentLoginType + '' === 'normal')) {
            normalHeight = Math.max(parent.offsetHeight, 340);
            if (sms) {
                sms.style.height = normalHeight + 'px';
            }
            if (qrcode) {
                qrcode.style.height = normalHeight + 'px';
            }
        }

        if (choiceuser) {
            me.$hide('choiceuser_article');
        }

        var returnValue = me.fireEvent('changeLoginType', {
            loginType: type,
            currentLoginType: me.currentLoginType || ''
        });
        if (!returnValue) {
            return;
        }

        for (var item in loginTypeList) {
            if (loginTypeList[item].$ele && loginTypeList[item].$ele.length > 0) {
                if (item === type) {
                    if (type + '' !== 'sms') {
                        me.$hide(loginTypeList[item].$btn[0]);
                    }
                    me.$show(loginTypeList[item].$ele[0]);
                } else {
                    if (item + '' === 'qrcode' && me.config.diaPassLogin && +me.config.qrcode === 3) {
                        me.$show(loginTypeList[item].$btn[0]);
                        if (me.config.qrcode_animation) {
                            me.qrcodeAnimationShow();
                            setTimeout(function () {
                                me.qrcodeAnimationHide();
                            }, 300);
                        }
                    } else {
                        if (item + '' !== 'sms') {
                            me.$show(loginTypeList[item].$btn[0]);
                        }
                        me.$hide(loginTypeList[item].$ele[0]);
                    }

                }
            }
        }

        if (me.config.diaPassLogin && phoenixDom) {
            if (type + '' === 'normal') {
                phoenixDom.style.display = '';
            } else {
                phoenixDom.style.display = 'none';
            }
        }

        if (type + '' === 'qrcode') {
            me._actionQrcode();
        }
        else if (type + '' === 'sms') {
            me.$hide(me.getElement('smsUnReceiveWrapper'));
        }

        me.currentLoginType = type;
    },
    /* eslint-disable fecs-camelcase */
    _doFocus: function (ele) {
        var me = this;

        if (!me.config.autoFocus) {
            return;
        }

        if ((typeof ele).toLowerCase() === 'string' && me.getElement(ele)) {
            me.getElement(ele).focus();
        } else {
            ele.focus();
        }
    },
    /* eslint-disable fecs-camelcase */
    _clearInput: function (type) {
        var me = this,
            ele = me.getElement(type),
            eleHolder = me.getElement(type + '_placeholder'),
            eleClear = me.getElement(type + '_clearbtn');
        if (ele) {
            if (eleHolder) {
                me.$show(eleHolder);
            }
            if (eleClear) {
                me.$hide(eleHolder);
            }
            ele.value = '';
            me._doFocus(ele);
        }
    },
    /* eslint-disable fecs-camelcase */
    _insertAfterW: function (newNode, oldNode) {
        var me = this;
        var parent = me._getWDom.parent(oldNode);
        if (parent.lastChild === oldNode) {
            parent.appendChild(newNode);
        } else {
            parent.insertBefore(newNode, me._getWDom.next(oldNode));
        }
    },
    initMkd: function () {
        // 新人机
        var me = this;
        me._insertScriptW(me.constant.TOUCHAPIMKD_URL, function () {
            window.passportTouch.use('mkd', {
                defaultCss: true
            }, function () {
                if (window.Pass && window.Pass.mkd && !me.loginPassMkd) {
                    var PassMkd = window.Pass.mkd;
                    me.loginPassMkd = new PassMkd({
                        // 产品线接入ak
                        ak: '1e3f2dd1c81f2075171a547893391274'
                    });
                }
            });
        });
    },
    /* eslint-disable fecs-camelcase */
    _insertNoCaptchaScript: function () {
        // yangweiguang
        var me = this;
        me._insertScriptW(me.constant.NOCAPTCHA_URL, function () {
        });
    },
    /* eslint-disable fecs-camelcase */
    _checkCapsLock: function () {
        var me = this;
        var password = baidu(me.getElement('password'));
        password.on('keypress', function (event) {
            var e = event || window.event;
            var keyCode = e.keyCode || e.which;
            var isShift = e.shiftKey || (+keyCode === 16) || false;
            var caps = document.getElementById(me.$getId('caps'));
            if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
                if (!caps) {
                    var span = document.createElement('span');
                    span.id = me.$getId('caps');
                    span.innerHTML = '大小写锁定已打开';
                    var passw = document.getElementById(me.$getId('passwordWrapper'));
                    if (passw.style.position + '' === 'static') {
                        passw.style.position = 'relative';
                    }
                    if (passw.style.zIndex) {
                        passw.style.zIndex = passw.style.zIndex + 1;
                    } else {
                        passw.style.zIndex = 20;
                    }
                    span.style.cssText = 'position:absolute;left:60px;clear:both;'
                        + 'top:25px;width:103px;height:37px;font-size:12px;line-height:45px;'
                        + 'z-index:20;text-align:center;background:url(\''
                        + me._domain.staticFile
                        + '/passApi/img/caps.gif\') no-repeat 0 0;';
                    passw.appendChild(span);
                } else {
                    me.$show(caps);
                }
            } else {
                if (caps) {
                    me.$hide(caps);
                }
            }
        });
        password.on('blur', function (event) {
            var caps = document.getElementById(me.$getId('caps'));
            if (caps) {
                me.$hide(caps);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _checkRegPhone: function (field, callback) {
        var me = this;
        var countrycode = me.getElement('smsPhoneCountryLabel')
            ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '')
            : '';
        var phone = document.getElementById(me.$getId('smsPhone'));
        if (!me._validatorPhoneFn(phone)) {
            return;
        }
        // TODO 需要修改接口以及传递的参数设置
        passport.data.getphonestatus({
            gid: me.guideRandom || '',
            phone: me._SBCtoDBC(phone.value),
            countrycode: countrycode
        }).success(function (rsp) {
            var returnValue = me.fireEvent('_checkRegPhone', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }

            if (+rsp.errInfo.no === 0) {
                // 短信故障预案——标记手机号关联的百度帐号是否有密码
                me.config.isPwd = +rsp.errInfo.isPwd || 0;
                baidu(me.getElement('unRecevieSmsUnReg')).hide();
                baidu(me.getElement('unRecevieSmsReged')).show();
                // sendVcodeBefore 第三方调用短信登录，输入手机号检测是否已经绑定对应第三方帐号，在此处增加回调，直接登录调用_sendVcode方法，更换手机号则清空输入的手机号。
                if (me.config.sendVcodeBefore && typeof me.config.sendVcodeBefore === 'function') {
                    me.config.sendVcodeBefore(me, me._sendVcode, function () {
                        phone.value = '';
                        phone.focus();
                        return;
                    });
                } else if (me.bdPsWtoken) {
                    me._sendVcode();
                } else {
                    me._getToken(me._sendVcode);
                }
            } else if (+rsp.errInfo.no === 7) {
                baidu(me.getElement('unRecevieSmsReged')).hide();
                baidu(me.getElement('unRecevieSmsUnReg')).show();
                var smsloginPromptWrapper = document.getElementById(me.$getId('smsloginPromptWrapper'));
                var smsPhone = document.getElementById(me.$getId('smsPhoneWrapper'));
                if (!smsloginPromptWrapper) {
                    var div = document.createElement('div');
                    div.id = me.$getId('smsloginPromptWrapper');
                    div.setAttribute('class', 'pass-form-sms-checkphone');
                    div.style.cssText = 'position:absolute;clear:both;color:#826f33;'
                        + 'z-index:999;font-size:12px;width:211px;height:71px;'
                        + 'padding:16px 16px 11px 13px;background:url("'
                        + me._domain.staticFile
                        + '/passApi/img/smsRegphone.png") 0px 0px no-repeat;right:0px;';
                    div.innerHTML = '<p style="margin:0px;padding:0px;line-height:2em;">该手机号未开启手机号登录功能，请使用用户名即密码登录。</p><button id="' + me.$getId('smsLoginPromptBtn') + '" style="background:#2e82ff;border:none;color:#fff;cursor:pointer;height:25px;line-height:25px;width:100px;text-align:center;position:absolute;right:16px;top:66px;" hidefocus=true>用户名密码登录</button>';
                    smsPhone.appendChild(div);
                    me.getElement('smsLoginPromptBtn').focus();
                } else {
                    me.$show(smsloginPromptWrapper);
                    me.getElement('smsLoginPromptBtn').focus();
                }
                baidu(me.getElement('smsLoginPromptBtn')).on('click', function (evt) {
                    if (me.getElement('smsloginPromptWrapper')) {
                        baidu(me.getElement('smsloginPromptWrapper')).hide();
                    }
                    evt.preventDefault();
                    me._changeLoginType('normal');
                    if (me.getElement('password')) {
                        me._doFocus('password');
                    }
                });
            } else if (+rsp.errInfo.no === 3 && rsp.data.jumpReg === '1') {
                baidu(me.getElement('unRecevieSmsReged')).hide();
                baidu(me.getElement('unRecevieSmsUnReg')).show();
                var smsSecondPromptWrapper = document.getElementById(me.$getId('smsSecondPromptWrapper'));
                var smsPhone = document.getElementById(me.$getId('smsPhoneWrapper'));
                if (!smsSecondPromptWrapper) {
                    var div = document.createElement('div');
                    div.id = me.$getId('smsSecondPromptWrapper');
                    div.setAttribute('class', 'pass-form-sms-checkphone');
                    div.style.cssText = 'position:absolute;clear:both;color:#826f33;'
                        + 'z-index:999;font-size:12px;width:211px;height:71px;'
                        + 'padding:16px 16px 11px 13px;background:url("'
                        + me._domain.staticFile
                        + '/passApi/img/smsRegphone.png") 0px 0px no-repeat;right:0px;';
                    div.innerHTML = '<p style="margin:0px;padding:0px;line-height:2em;">'
                    + '手机号已被运营商二次放号，请前往注册页注册新帐号。'
                    + '</p><button id="' + me.$getId('smsSecondPromptBtn') + '" '
                    + 'style="background:#2e82ff;border:none;color:#fff;cursor:pointer;'
                    + 'height:25px;line-height:25px;width:100px;text-align:center;position:absolute;'
                    + 'right:16px;top:66px;" hidefocus=true>注册</button>';
                    smsPhone.appendChild(div);
                    me.getElement('smsSecondPromptBtn').focus();
                } else {
                    me.$show(smsSecondPromptWrapper);
                    me.getElement('smsSecondPromptBtn').focus();
                }
                baidu(me.getElement('smsSecondPromptBtn')).on('click', function (evt) {
                    if (me.getElement('smsSecondPromptBtn')) {
                        baidu(me.getElement('smsSecondPromptBtn')).hide();
                    }
                    evt.preventDefault();
                    window.location.href = me.constant.REG_URL;
                });
            } else if (+rsp.errInfo.no === 3) {
                // 短信故障预案——标记手机号未注册
                me.config.isPwd = -1;
                baidu(me.getElement('unRecevieSmsReged')).hide();
                baidu(me.getElement('unRecevieSmsUnReg')).show();
                var voice = me.config.voice_sms_flag;
                var smsRegPromptWrapper = document.getElementById(me.$getId('smsRegPromptWrapper')),
                    smsPhone = document.getElementById(me.$getId('smsPhoneWrapper'));
                if (!smsRegPromptWrapper) {
                    var div = document.createElement('div');
                    div.id = me.$getId('smsRegPromptWrapper');
                    div.setAttribute('class', 'pass-form-sms-checkphone');
                    div.style.cssText = 'position:absolute;clear:both;color:#826f33;'
                        + 'z-index:999;font-size:12px;width:211px;height:71px;'
                        + 'padding:16px 16px 11px 13px;background:url("'
                        + me._domain.staticFile
                        + '/passApi/img/smsRegphone.png") 0px 0px no-repeat;right:0px;';

                    div.innerHTML = '<p style="margin:0px;padding:0px;line-height:2em;">'
                    + '您的手机号码尚未注册，点击注册，帮您注册新的百度帐号'
                    + '</p><button id="' + me.$getId('smsRegPromptBtn')
                    + '" style="background:#2e82ff;border:none;color:#fff;cursor:pointer;height:25px;'
                    + 'line-height:25px;width:60px;text-align:center;position:absolute;right:16px;top:66px;" '
                    + 'hidefocus=true>注册</button>';
                    smsPhone.appendChild(div);
                    me.getElement('smsRegPromptBtn').focus();
                } else {
                    me.$show(smsRegPromptWrapper);
                    me.getElement('smsRegPromptBtn').focus();
                }
                baidu(me.getElement('smsRegPromptBtn')).on('click', function (evt) {
                    me.config.voice_sms_flag = voice;
                    if (me.getElement('smsRegPromptWrapper')) {
                        baidu(me.getElement('smsRegPromptWrapper')).hide();
                    }
                    evt.preventDefault();
                    if (countrycode + '' !== '') {
                        window.location.href = me.constant.REG_URL;
                    } else {
                        // sendVcodeBefore 第三方调用短信登录，输入手机号检测是否已经绑定对应第三方帐号，在此处增加回调，直接登录调用_sendVcode方法，更换手机号则清空输入的手机号。
                        if (me.config.sendVcodeBefore && typeof me.config.sendVcodeBefore === 'function') {
                            me.config.sendVcodeBefore(me, me._sendVcode, function () {
                                phone.value = '';
                                phone.focus();
                                return;
                            });
                        } else if (me.bdPsWtoken) {
                            me._sendVcode();
                        } else {
                            me._getToken(me._sendVcode);
                        }
                    }
                });
                me.config.voice_sms_flag = 0;
            } else {
                me.config.voice_sms_flag = 0;
                me._setSmsGeneralError(rsp.errInfo.msg);
            }
        });
    },
    changeSuggestView: function (opt) {
        var me = this;
        if (me.suggestionDom && opt.list) {
            if (opt.list + '' === 'hide') {
                me.$hide(me.suggestionDom);
            } else if (opt.list + '' === 'show') {
                me.$show(me.suggestionDom);
            }
        }

        if (me.selectBtn && opt.btn) {
            if (opt.btn + '' === 'close') {
                baidu(me.selectBtn).removeClass('open');
                baidu(me.getElement('userName')).addClass('open');
                me.$show(me.selectBtn);
            } else if (opt.btn + '' === 'open') {
                baidu(me.selectBtn).addClass('open');
                baidu(me.getElement('userName')).addClass('open');
                me.$show(me.selectBtn);
            } else if (opt.btn + '' === 'hide') {
                me.$hide(me.selectBtn);
                baidu(me.getElement('userName')).removeClass('open');
            } else if (opt.btn + '' === 'show') {
                me.$show(me.selectBtn);
                baidu(me.getElement('userName')).addClass('open');
            }
            me.$hide(me.selectBtn);
        }
    },
    _suggestion: function (maxlength) {
        var me = this;
        var recordArr = [];
        var $userNameEle = baidu('#' + me.$getId('userName'), me.getElement());
        var suggestionArr = [
            'http://passport.baidu.com/passApi/js/modules/qq.com',
            'http://passport.baidu.com/passApi/js/modules/163.com',
            'http://passport.baidu.com/passApi/js/modules/126.com',
            'http://passport.baidu.com/passApi/js/modules/sohu.com',
            'http://passport.baidu.com/passApi/js/modules/sina.com',
            'http://passport.baidu.com/passApi/js/modules/gmail.com',
            'http://passport.baidu.com/passApi/js/modules/21cn.com',
            'http://passport.baidu.com/passApi/js/modules/hotmail.com',
            'http://passport.baidu.com/passApi/js/modules/vip.qq.com',
            'http://passport.baidu.com/passApi/js/modules/yeah.net',
            'http://passport.baidu.com/passApi/js/modules/139.com'
        ];
        var reg = /^([a-zA-Z0-9_.\-+]+)([@]?[a-zA-Z0-9_\-*]*[.]?[a-zA-Z*]*[.]?[a-zA-Z*]*)$/;

        var _appendSuggestTemp = function (text, opt) {
            var current = text;
            if (text.substr(0, text.indexOf('@') - 1).length > opt.maxlength) {
                current = text.substr(0, opt.maxlength - 4) + '…' + text.substr(text.indexOf('@'));
            }
            return baidu('<li class="pass-item-suggsetion" data-select="'
                + text
                + '" data-type="'
                + (opt.ifdelete ? 'history' : 'normal')
                + '">'
                + current
                + (opt.ifdelete ? '<a data-delete="' + text + '" title="删除该记录"></a>' : '')
                + '</li>').get(0);
        };
        var _rendSelectList = function (u, self) {
            if (!me.suggestionDom) {
                me.suggestionDom = document.createElement('ul');
                me.suggestionDom.id = me.$getId('suggestionWrapper');
                baidu(me.getElement('userNameWrapper')).append(me.suggestionDom);
                baidu(me.suggestionDom).addClass('pass-suggestion-list');
                baidu(me.suggestionDom).on('click', function (evt) {
                    var $target = baidu(evt.target),
                        deleteIn = $target.attr('data-delete'),
                        currentIn = $target.attr('data-select');

                    if (deleteIn) {
                        // 删除历史记录
                        evt.preventDefault();
                        passport.data.getLoginHistory({
                            token: me.bdPsWtoken,
                            item: deleteIn
                        });
                        me.suggestionDom.data_delete = true;
                        baidu($target.parent()).hide();
                        baidu.array(recordArr).remove(deleteIn);

                        if (recordArr.length < 1) {
                            me.changeSuggestView({
                                list: 'hide',
                                btn: 'hide'
                            });
                        }

                        me._doFocus('userName');
                        setTimeout(function () {
                            me.suggestionDom.data_delete = false;
                        }, 200);
                    } else {
                        // autosuggest
                        if ($target.attr('data-type') === 'history') {
                            // 历史记录autosuggest
                            self.value = currentIn;
                        } else {
                            // 邮箱后缀autosuggest
                            me.suggestionDom.data_delete = false;
                            self.value = currentIn || self.value;
                        }

                        if (me.getElement('userName_placeholder')) {
                            me.$hide('userName_placeholder');
                        }

                        me.changeSuggestView({
                            list: 'hide',
                            btn: 'close'
                        });
                        me._doFocus(self);
                        setTimeout(function () {
                            me.setGeneralError('');
                            baidu(self).removeClass('pass-text-input-error');
                            me._doFocus('password');
                        }, 100);
                        var value = me.getElement('userName').value;
                        me._loginCheck(value);
                    }
                });
            }

            me.suggestionDom.innerHTML = '';
            me.$show(me.suggestionDom);
            me.suggestionDom.appendChild(u);

            baidu('.pass-item-suggsetion', me.suggestionDom).on('mouseover', function () {
                baidu('.pass-item-suggsetion_hover', me.suggestionDom).removeClass('pass-item-suggsetion_hover');
                baidu(this).addClass('pass-item-suggsetion_hover');
            });
            baidu('.pass-item-suggsetion', me.suggestionDom).on('mouseout', function () {
                baidu(this).removeClass('pass-item-suggsetion_hover');
            });
        };
        var rendLoginHistory = (function () {
            if (me.config.loginMerge) {
                recordArr = me.loginrecord.displayname || [];
            } else {
                recordArr = me.config.isPhone ? me.loginrecord.phone : me.loginrecord.email;
            }

            if (recordArr.length > 0) {
                var content = document.createDocumentFragment();
                for (var i = 0, len = recordArr.length; i < len; i++) {
                    content.appendChild(_appendSuggestTemp(recordArr[i], {maxlength: maxlength, ifdelete: true}));
                }

                _rendSelectList(content, me.getElement('userName'));
                me.selectBtn = baidu('<span class="pass-item-selectbtn pass-item-selectbtn-userName" ></span>').get(0);
                me.getElement('userNameWrapper').appendChild(me.selectBtn);
                baidu(me.selectBtn).on('click', function (evt) {
                    setTimeout(function () {
                        if (me.suggestionDom.style.display !== 'none') {
                            me.changeSuggestView({
                                list: 'hide',
                                btn: 'close'
                            });
                        } else {
                            me.changeSuggestView({
                                list: 'show',
                                btn: 'open'
                            });
                        }
                    }, 200);
                });
                me.changeSuggestView({list: 'hide', btn: 'show'});
            }
        })();

        $userNameEle.on('keyup', function (evt) {
            if (me.disUnameLogin === 1) {

            } else {
                var u = document.createDocumentFragment(),
                    result, self = this, k = 0;

                if (recordArr.length > 0) {
                    for (var i = 0, len = recordArr.length; i < len; i++) {
                        if (+recordArr[i].indexOf(this.value) === 0) {
                            u.appendChild(_appendSuggestTemp(recordArr[i], {maxlength: maxlength, ifdelete: true}));
                            ++k;
                        }
                    }
                }

                if (recordArr.length < 1 || k < 1) {
                    result = reg.exec(this.value);
                    if (result && result[2]) {
                        for (var i = 0, len = suggestionArr.length; i < len; i++) {
                            if (('@' + suggestionArr[i]).indexOf(result[2]) === 0) {
                                var current = result[1];
                                u.appendChild(_appendSuggestTemp(current + '@' + suggestionArr[i],
                                    {maxlength: maxlength}));
                                ++k;
                            }
                        }
                    }
                }

                if (me.suggestionDom && (evt.keyCode !== 38 && evt.keyCode !== 40)) {
                    me.$hide(me.suggestionDom);
                }
                if (recordArr.length > 1 || (recordArr.length < 2 && !!me.config.isPhone === false)) {
                    if (k > 0) {
                        if ((evt.keyCode !== 38 && evt.keyCode !== 40)) {
                            _rendSelectList(u, self);
                        }
                        if ((+evt.keyCode === 38 || +evt.keyCode === 40)
                            && (me.suggestionDom.style.display !== 'none')) {
                            var child = me.suggestionDom.childNodes;
                            var n = child.length;
                            var p = -1;
                            for (var j = 0; j < n; j++) {
                                if (child[j].className.indexOf('pass-item-suggsetion_hover') > -1) {
                                    p = j;
                                }
                            }
                            if (+evt.keyCode === 38) {
                                var q = p === -1 ? (n - 1) : (p === 0 ? (n - 1) : p - 1);
                            }
                            if (+evt.keyCode === 40) {
                                var q = p === -1 ? 0 : (p === n - 1 ? 0 : p + 1);
                            }
                            baidu('.pass-item-suggsetion_hover',
                                me.suggestionDom).removeClass('pass-item-suggsetion_hover');
                            baidu(child[q], me.suggestionDom).addClass('pass-item-suggsetion_hover');
                            var currentIn = baidu(child[q]).attr('data-select');
                            if (baidu(child[q]).attr('data-type') === 'history') {
                                self.value = currentIn;
                            } else {
                                self.value = self.value.substr(0,
                                    self.value.indexOf('@')) + currentIn.substr(currentIn.indexOf('@'));
                            }
                            if (me.getElement('userName_placeholder')) {
                                me.$hide('userName_placeholder');
                            }
                        }
                    }
                }
            }
        });

        $userNameEle.on('keydown', function (evt) {
            if ((+evt.keyCode === 13 || +evt.keyCode === 9)
                && (me.suggestionDom && me.suggestionDom.style.display !== 'none')) {
                me.changeSuggestView({
                    list: 'hide',
                    btn: 'close'
                });
                me._doFocus('password');
                evt.preventDefault();
                evt.stopPropagation();
            }
        });

        $userNameEle.on('blur', function () {
            if (!!me.config.isPhone === false) {
                setTimeout(function () {
                    if (me.suggestionDom && !me.suggestionDom.data_delete) {
                        // data_delete是一个稳定suggestion的开关，防止点击clearbtn或者placeholder时suggestdom出现闪动的情况
                        me.changeSuggestView({
                            list: 'hide',
                            btn: 'close'
                        });
                    }
                }, 150);
            }
        });

        $userNameEle.on('focus', function (evt) {
            if (!!me.config.isPhone === false) {
                me.changeSuggestView({
                    list: 'show',
                    btn: 'open'
                });
            }
        });
    },

    /**
     * @description _initCountryCode 初始化国家区域代码已经国家名称
     * @function
     * @name
     * @grammar
     * @param {object} domField 插入海外手机号dom
     */
    /* eslint-disable fecs-camelcase */
    _initCountryCode: function (domField) {
        var me = this,
            countryTempStr = '<li class="pass-item-country"><span class="pass-country-code" data-countryCode="">+86</span>大陆地区</li>',
            data = me.countryCodeList || {},
            countryLen = data.length;
        if (countryLen <= 0) {
            return;
        }
        for (var i = 0; i < countryLen; i++) {
            countryTempStr += '<li class="pass-item-country"><span class="pass-country-code" data-countryCode='
                + data[i].code
                + '>+'
                + data[i].code.substring(2)
                + '</span>'
                + data[i].name
                + '</li>';
        }
        baidu(domField).html(countryTempStr);
    },

    /**
     * @description _getCountryCode 获取国家区域代码已经国家名称
     * @function
     * @name
     * @grammar
     * @param {fn} callback callback函数
     */
    /* eslint-disable fecs-camelcase */
    _getCountryCode: function (callback) {
        var me = this,
            data = {
                apiver: 'v3',
                subpro: me.config.subpro
            };
        passport.data.jsonp('https://passport.baidu.com/v2/?securitygetcountrycode', data).success(function (rsp) {
            if (rsp.data.country.length > 0) {
                me.countryCodeList = rsp.data.country;
                if (me.getElement('foreignCountryList')) {
                    me._initCountryCode(me.getElement('foreignCountryList'));
                }
                if (me.getElement('smsCountryList')) {
                    me._initCountryCode(me.getElement('smsCountryList'));
                }
                callback && callback();
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _selectCountryList: function (domField) {
        var me = this,
            _domField = baidu(domField),
            _countryList = _domField.find('.pass-country-list').eq(0),
            _labelCode = _domField.find('.pass-label');
        if (+_labelCode.length === 0) {
            return;
        }
        _countryList.on('click', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() + '' === 'li') {
                _labelCode.eq(0).html(baidu(target).find('span.pass-country-code').eq(0).html());
                _labelCode.eq(0).attr('data-countryCode',
                    baidu(target).find('span.pass-country-code').eq(0).attr('data-countryCode'));
            } else if (target.tagName.toLowerCase() + '' === 'span') {
                _labelCode.eq(0).html(baidu(target).html());
                _labelCode.eq(0).attr('data-countryCode', baidu(target).attr('data-countryCode'));
            }
            me.$hide(_countryList[0]);
            _labelCode.eq(0).removeClass('pass-label-code-up');
            if ((domField === me.getElement('foreignMobileWrapper'))
                && me.getElement('foreignMobile')
                && me.getElement('foreignMobile').value) {
                me._validatorforeignmobileFn(me.getElement('foreignMobile'));
            } else if (domField === me.getElement('smsPhoneWrapper')
                && me.getElement('smsPhone')
                && me.getElement('smsPhone').value) {
                me._validatorPhoneFn(me.getElement('smsPhone'));
            }
            evt.preventDefault();
        });
        _countryList.on('mouseover', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() + '' === 'li') {
                _domField.find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).addClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() + '' === 'span') {
                _domField.find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).parent('li.pass-item-country').addClass('pass-item-country-hover');
            }
        });
        _countryList.on('mouseout', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() + '' === 'li') {
                baidu(target).removeClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() + '' === 'span') {
                baidu(target).parent('li.pass-item-country').removeClass('pass-item-country-hover');
            }
        });
        // 点击其他区域收起国家代码list
        baidu('html').on('click', function (evt) {
            var target = evt.target;
            if (!_labelCode) {
                return false;
            }
            // 需要判断多个点击label的id
            if ((baidu(target).attr('id') !== baidu(me.getElement('foreignMobileLabel')).attr('id'))
                && baidu(target).attr('id') !== baidu(me.getElement('smsPhoneCountryLabel')).attr('id')) {
                setTimeout(function () {
                    me.$hide(_countryList[0]);
                    _labelCode.eq(0).removeClass('pass-label-code-up');
                }, 200);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _setForeignMobileEvent: function () {
        var me = this;
        if (me.getElement('foreignMobileLabel')) {
            baidu(me.getElement('foreignMobileLabel')).on('click', function (evt) {
                var _CountryList = me.getElement('foreignCountryList');
                if (_CountryList && _CountryList.style.display !== 'block') {
                    me.$show(_CountryList);
                    baidu(me.getElement('foreignMobileLabel')).addClass('pass-label-code-up');
                } else if (_CountryList) {
                    me.$hide(_CountryList);
                    baidu(me.getElement('foreignMobileLabel')).removeClass('pass-label-code-up');
                }
                me._selectCountryList(me.getElement('foreignMobileWrapper'));
                evt.preventDefault();
            });
        }

        if (me.getElement('foreignMobile')) {
            baidu(me.getElement('foreignMobile')).on('blur', function () {
                if (this.value) {
                    var returnValue = me.fireEvent('fieldBlur', {
                        ele: baidu(this)
                    });
                    if (!returnValue) {
                        return;
                    }
                    me._validatorforeignmobileFn(this);
                }
                baidu(this).removeClass(me.constant.FOCUS_CLASS);
            });
            baidu(me.getElement('foreignMobile')).on('focus', function () {
                if (!me.initialized) {
                    me._initApi();
                }
                var returnValue = me.fireEvent('fieldFocus', {
                    ele: baidu(this)
                });
                if (!returnValue) {
                    return;
                }
                baidu(this).addClass(me.constant.FOCUS_CLASS);
                baidu(this).removeClass(me.constant.ERROR_CLASS);
            });
        }

        if (me.getElement('foreignMobileLink')) {
            baidu(me.getElement('foreignMobileLink')).on('click', function (evt) {
                me.$hide(me.getElement('userNameWrapper'));
                me.$hide(me.getElement('smsSwitchWrapper'));
                me.$hide(me.getElement('foreignMobileLink'));
                baidu(me.getElement('userName')).removeClass(me.constant.ERROR_CLASS);
                me.setGeneralError('');
                me.getElement('password').value = '';
                me.$show(me.getElement('foreignMobileWrapper'));
                me.$show(me.getElement('foreignMobileMsg'));
                me.$show(me.getElement('foreignMobileBackWrapper'));
                me.internation = true;
                evt.preventDefault();
            });
        }

        if (me.getElement('foreignMobileBackWrapper')) {
            baidu(me.getElement('foreignMobileBackWrapper')).on('click', function (evt) {
                me.$hide(me.getElement('foreignMobileWrapper'));
                me.$hide(me.getElement('foreignMobileMsg'));
                me.$hide(me.getElement('foreignMobileBackWrapper'));
                baidu(me.getElement('foreignMobile')).removeClass(me.constant.ERROR_CLASS);
                me.setGeneralError('');
                me.getElement('password').value = '';
                me.$show(me.getElement('userNameWrapper'));
                me.$show(me.getElement('smsSwitchWrapper'));
                me.$show(me.getElement('foreignMobileLink'));
                me.internation = false;
                evt.preventDefault();
            });
        }
    },
    /* eslint-disable fecs-camelcase */
    _validatorforeignmobileFn: function (field) {
        var me = this;
        if (field.value + '' === '') {
            me.setGeneralError('\u8BF7\u586B\u5199\u624B\u673A\u53F7');
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        } else if (me.getElement('foreignMobileLabel')
            && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
            if (!new RegExp(/^(\d)*$/).test(me._SBCtoDBC(field.value))) {
                me.setGeneralError('\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E');
                baidu(field).addClass(me.constant.ERROR_CLASS);
                return false;
            }
        } else if (!new RegExp(/^1[3456789]\d{9}$/).test(me._SBCtoDBC(field.value))) {
            me.setGeneralError('\u624B\u673A\u53F7\u7801\u683C\u5F0F\u4E0D\u6B63\u786E');
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me.setGeneralError('');
        baidu(field).removeClass(me.constant.ERROR_CLASS);
        return true;
    },
    /* eslint-disable fecs-camelcase */
    _operateTips: function () {
        var me = this,
            $usernameEle = baidu('#' + me.$getId('userName'), me.getElement());

        if (!!me.config.isPhone === false) {
            if (!me.operateTipsDom) {
                me.operateTipsDom = document.createElement('div');
                me.operateTipsDom.id = me.$getId('operateTipsWrapper');
                $usernameEle.parent().parent().append(me.operateTipsDom);
                baidu(me.operateTipsDom).addClass('pass-operate-tips');
                var temp = '<span class="pass-operate-content">\u90ae\u7bb1\u767b\u5f55\u66f4\u5b89\u5168\u54e6</span><span class="pass-operate-down"><em class="pass-operate-down-a">◆</em><em class="pass-operate-down-b">◆</em></span>';
                me.operateTipsDom.innerHTML = temp;
            } else {
                me.$show(me.operateTipsDom);
            }
        }

        $usernameEle.on('focus', function () {
            if ((!!me.config.isPhone === false) && me.operateTipsDom) {
                me.$show(me.operateTipsDom);
            }
        });
        $usernameEle.on('blur', function () {
            if (me.operateTipsDom) {
                me.$hide(me.operateTipsDom);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _rendPhoenixbtn: function () {
        var me = this,
            $phoenixEle = baidu(me.getPhoenixElement('pass_phoenix_list_login')),
            phoenixLimitEle = baidu('.pass-phoenix-show', me.getPhoenixElement('pass_phoenix_list_login'));
        if (phoenixLimitEle) {
            phoenixLimitEle.on('click', function () {
                if ($phoenixEle.hasClass('pass-phoenix-list-hover')) {
                    $phoenixEle.removeClass('pass-phoenix-list-hover');
                } else {
                    $phoenixEle.addClass('pass-phoenix-list-hover');
                }
            });
        }
        $phoenixEle.on('click', function (evt) {
            var $target = baidu(evt.target),
                changeTo = $target.attr('data-type');
            if (changeTo) {
                me._changeLoginType(changeTo);
            }
        });
    },

    setMakeText: function (str) {
        var me = this;
        var makeDom = me.getElement('MakeTextWrapper');
        var str = str.replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\x22/g, '&quot;')
        .replace(/\x27/g, '&#39;');
        if (!makeDom) {
            return;
        }
        if (str) {
            makeDom.style.display = '';
            makeDom.innerHTML = str;
        } else {
            makeDom.style.display = 'none';
            makeDom.innerHTML = '';
        }
    },

    /**
     * @description render 渲染组件到页面
     * @function
     * @name magic.passport.login#render
     * @grammar magic.passport.login#render(id)
     * @param {String} id 渲染到的容器的 id
     */
    render: function (id) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());//baidu('#'+id);
        target.addClass(me.constant.CONTAINER_CLASS);

        var template = me._getTemplate();
        target.get(0).appendChild(baidu(template).get(0));

        if (me.config.makeText) {
            me.setMakeText(me.config.makeText);
        }

        if (me.config.setWebToClient) {
            var webToClintTemplate = me._getIrregularField('webtoclint');
            me._insertAfterW(baidu(webToClintTemplate).get(0), me.getElement());
        }

        if (me.config.authsiteLogin
            || (!me.config.diaPassLogin && me.config.qrcode)
            || (me.config.diaPassLogin && +me.config.qrcode === 1)) {
            // sms=3为仅仅只有上行短信注册的情况
            if (+me.config.sms !== 3) {
                var otherTemplate = me._getTemplateOther();
                me._insertAfterW(baidu(otherTemplate).get(0), target.get(0));
                me._rendPhoenixbtn();
            }
        }

        if (me.config.authsiteLogin) {
            // 第三方
            me._authSiteW();
        }

        if (me.config.qrcode) {
            // 二维码
            var qrcodeTemplate = me._getTemplateQrcode();
            if (Object.prototype.toString.call(me.config.qrcodeDom).toLowerCase() === '[object function]'
                && me.config.diaPassLogin
                && +me.config.qrcode === 3) {
                me.qrcodeDialogDom = me.config.qrcodeDom();
                me.qrcodeDialogDom.appendChild(baidu(qrcodeTemplate).get(0));
                setTimeout(function () {
                    me._actionQrcode();
                }, 500);
                me.getElement('qrcode').style.display = '';
            } else {
                me._insertAfterW(baidu(qrcodeTemplate).get(0), target.get(0));
                me._setEventQrcode();
            }
            me.setqrcodeEvent();
        }

        if (me.config.sms) {
            //动态密码
            var qrcodeTemplate = me._getTemplateSms();
            var unReceiveSmsTemplate = me.getTemplateUnreceiveSms();
            me._insertAfterW(baidu(qrcodeTemplate).get(0), target.get(0));
            document.getElementsByTagName('body')[0].appendChild(baidu(unReceiveSmsTemplate).get(0));
            me._setEventSms();
        }

        if (me.config.loginMerge) {
            setTimeout(function () {
                //猎豹浏览器自动记住表单项有问题，导致loginMerge参数异常，加延时重置
                me.getElement('loginMerge').value = 'true';
            }, 200);
        }

        if (me.config.hasPlaceholder) {
            var rendList = [{
                label: 'userName',
                placeholder: 'userName'
            }, {
                label: 'password',
                placeholder: 'password'
            }, {
                label: 'verifyCode',
                placeholder: 'verifyCode'
            }];
            if (me.config.sms) {
                rendList.push({
                    label: 'smsPhone',
                    placeholder: (me.config && me.config.diaPassLogin) ? 'smsPhoneMsg' : 'smsPhone'
                });
                rendList.push({
                    label: 'smsVerifyCode',
                    placeholder: 'smsVerifyCode'
                });
            }
            if (me.foreignMobile) {
                rendList.push({
                    label: 'foreignMobile',
                    placeholder: (me.config && me.config.diaPassLogin) ? 'smsPhoneMsg' : 'smsPhone'
                });
            }
            me._getPlaceholder(rendList);
        }

        if (me.foreignMobile) {
            me._getCountryCode();
            me._setForeignMobileEvent();
        }

        /**
         * @description render 渲染组件到页面
         * @event
         * @name magic.passport.login#render
         * @grammar magic.passport.login#render
         */
        var returnValue = me.fireEvent('render');
        if (!returnValue) {
            return;
        }

        me._setValidator();
        me._setEvent();
        me._checkCapsLock();
    },
    /* eslint-disable fecs-camelcase */
    _initApi: function (callbacks) {
        var me = this;
        me.initialized = true;
        me.initTime = new Date().getTime();

        passport.data.getApiInfo({
            apiType: 'login',
            gid: me.guideRandom || '',
            loginType: (me.config && me.config.diaPassLogin) ? 'dialogLogin' : 'basicLogin'
        })
        .success(function (rsp) {
            /**
             * @description 获取api初始化信息
             * @name magic.passport#getApiInfo
             * @grammar magic.passport.login#getApiInfo(e)
             * @event
             * @param {Object} e 事件参数
             * @param {Object} e.rsp 服务器返回信息
             */
            var returnValue = me.fireEvent('getApiInfo', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }

            if (+rsp.data.disable === 1) {
                me.setGeneralError(me.lang.sysUpdate);
            }

            if (+rsp.errInfo.no === 0) {
                var token = rsp.data.token;
                me.bdPsWtoken = rsp.data.token;

                //获取登录历史记录
                me.loginrecord = {};
                if (me.config.loginMerge && me.config.autosuggest) {
                    //如果是合并登录，而且开启了autosuggest
                    passport.data.getLoginHistory({
                        token: me.bdPsWtoken,
                        tt: new Date().getTime(),
                        gid: me.guideRandom
                    }).success(function (resData) {
                        me.loginrecord = resData.data;

                        me._suggestion(me.config.diaPassLogin ? 20 : 12);

                        if (me.config.memberPass && me.loginrecord.displayname.length > 0) {
                            //me.getElement('userName').focus()
                            me._doFocus('password');
                            if (me.getElement('userName_placeholder')) {
                                me.$hide('userName_placeholder');
                            }
                            if (!me.getElement('userName').value || me.getElement('userName').value === '') {
                                me.getElement('userName').value = me.loginrecord.displayname[0];
                                me._loginCheck(me.loginrecord.displayname[0], true);
                            }
                            me.$show('userName_clearbtn').$hide('userName_placeholder');
                        }
                    });
                } else {
                    if (!me.config.isPhone && me.config.memberPass && !me.constant.SUBMITFLAG) {
                        me.getElement('userName').value = rsp.data.rememberedUserName;
                    }
                }
                var usagent = navigator.userAgent;
                // 为true则是ios9以上
                var iosVersion = !navigator.userAgent.match(/OS [1-8]_\d[_\d]* like Mac OS X/i);
                var isIos = !!navigator.userAgent.toString().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                var isPad = navigator.userAgent.toString().indexOf('iPad');
                if (iosVersion && isIos && isPad != null) {
                    var a = document.getElementsByClassName('popBox');
                    if (a != null && a.length > 0) {
                        var height = window.screen.height;
                        var clientHeight = document.body.clientHeight;
                        if (height > clientHeight) {
                            a[0].style.height = height * (height / clientHeight) + 120 + 'px';
                        } else {
                            a[0].style.height = height * (height / clientHeight);
                        }
                    }
                }
                me.disUnameLogin = 0;

                me.ifShowWarning = rsp.data.ifShowWarning;

                if (rsp.data.spLogin && me.config.diaPassLogin) {
                    me.spLogin = rsp.data.spLogin;
                }

                // data: setContext
                passport.data.setContext({
                    token: token
                });

                if (!navigator.cookieEnabled) {
                    me.setGeneralError(me.lang.cookieDisable);
                }

                // set remembered UserName
                if (!me.config.loginMerge
                    && me.config.memberPass
                    && rsp.data.rememberedUserName && !me.config.isPhone) {
                    if (me.config.diaPassLogin && +rsp.data.usernametype === 3) {
                        me.switchTo('phone');
                    }
                }

                if (me.config.diaPassLogin && !me.config.loginMerge) {
                    me._operateTips();
                }

                if (me.constant.SUBMITFLAG) {
                    // 如果产品线调用了submitForm方法，会把constant.SUBMITFLAG赋值为true从而实现在render事件里填充内容后提交
                    me.getElement('submit').click();
                } else {
                    callbacks && callbacks.success(rsp);
                }
            }
        });
    },
    submitForm: function () {
        /**
         * @description 提交当前表单
         * @name magic.passport.login#submitForm
         * @grammar magic.passport.login#submitForm
         * @function
         */
        var me = this;
        me.constant.SUBMITFLAG = true;
    },
    /**
     * @description switchTo 切换为 "普通"/"手机" 登录模式
     * @function
     * @grammar magic.passport.login#switchTo(type)
     * @name magic.passport.login#switchTo
     * @param {Enum}  type 类型, phone或normal
     */
    switchTo: function (type) {
        var me = this;
        var label = '';
        if (me.config.loginMerge) {
            return;
        }
        // 收集当前登录态数据
        me._collectData();
        // 清除错误信息
        setTimeout(function () {
            me.setGeneralError('');
            if (me.selectBtn && type + '' === 'phone') {
                me.$hide(me.selectBtn);
            } else if (me.selectBtn) {
                me.$hide(me.selectBtn);
            }
        }, 100);
        me.getElement('userNameLabel').innerHTML = type + '' === 'phone' ? me.lang.phoneNum : me.lang.account;
        me.config.isPhone = type + '' === 'phone';
        me.getElement('isPhone').value = me.config.isPhone;
        // 恢复新登录态数据
        me._restoreData();
        me._setValidator();

        if (me.suggestionDom) {
            me.$hide(me.suggestionDom);
        }
    },
    setSubpro: function (val) {
        var me = this;
        if (me.getElement('subpro') && val) {
            me.getElement('subpro').value = val
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/\x22/g, '&quot;')
            .replace(/\x27/g, '&#39;');
        }
    },
    /**
     * @description switchTo 获取当前登录模式: 普通/手机
     * @function
     * @grammar magic.passport.login#getCurrentType(type)
     * @name magic.passport.login#getCurrentType
     * @return {Enum} String 类型, phone 或 normal
     */
    getCurrentType: function () {
        return this.config.isPhone ? 'phone' : 'normal';
    },
    /* eslint-disable fecs-camelcase */
    _setValidator: function () {
        var me = this;
        if (!me.validatorInited) {
            //用户名检测 邮箱长度
            me._validator.addRule('unameMailLength', function (ele) {
                var value = String(ele.value);
                if (/^[0-9a-zA-Z\.\_-]+@([0-9a-zA-Z-]+\.)+[a-z]{2,4}$/.test(value)) {
                    return value.length <= 60;
                }
                return true;
            });
            me._validator.addMsg('unameMailLength', me.lang.unameMailLengthError);

            me._validator.addRule('unameInputLogin', function (ele) {
                var value = String(ele.value);
                if (me.disUnameLogin === 0 && me.config.diaPassLogin && !me.config.isPhone) {
                    if (!/^[0-9a-zA-Z\.\_-]+@([0-9a-zA-Z-]+\.)+[a-z]{2,4}$/.test(value)) {
                        return false;
                    }
                }
                return true;
            });
            me._validator.addMsg('unameInputLogin', me.lang.unameInputError);

            me._validator.addRule('checkVcodeLength', function (ele, type) {
                var value = ele.value;
                if (!me.constant.CHECKVERIFYCODE) {
                    me.$hide('verifyCodeSuccess');
                    return false;
                }
                return true;
            });
            me._validator.addMsg('checkVcodeLength', me.lang.verifyCodeLenErr);

            me._validator.addRule('checkVcodeStatus', function (ele, type) {
                if (type + '' === 'all') {
                    if (!me.constant.CHECKVERIFYCODE) {
                        return false;
                    }
                }
                return true;
            });
            me._validator.addMsg('checkVcodeStatus', me.lang.verifyCodeStaErr);
        }
        me.validatorInited = true;
        me.validateRules = {
            'userName': {
                rules: me.config.loginMerge
                    ? ['required']
                    : (me.config.isPhone ? ['required', 'phone'] : ['required', 'unameMailLength', 'unameInputLogin']),
                desc: me.config.loginMerge ? me.lang.userName : (me.config.isPhone ? me.lang.phoneNum : me.lang.account)
            },
            'password': {
                rules: ['required'],
                desc: me.lang.password
            },
            'verifyCode': {
                rules: ['required', 'checkVcodeLength', 'checkVcodeStatus'],
                desc: me.lang.captcha
            }
        };
        me._validator.init(me, me.validateRules);
    },
    /* eslint-disable fecs-camelcase */
    _validateError: function (info, opt) {
        var me = this,
            ele = baidu(me.getElement(info.field));

        if (me.getElement('operateTipsWrapper') && me.getElement('operateTipsWrapper').style.display !== 'none') {
            me.$hide('operateTipsWrapper');
        }

        ele.addClass(me.constant.ERROR_CLASS);
        me.setGeneralError(info.msg);
        if (me.disUnameLogin === 0
            && info.field + '' === 'userName'
            && info.msg + '' === me.lang.unameInputError + '') {
            var img = new Image();
            img.onload = img.onerror = function () {
                img.onload = img.onerror = null;
                img = null;
            };
            img.src = me._domain.https + '/img/v.gif?type=login&loginType=userName';
        }

        opt && opt.callback && callback();
    },
    /* eslint-disable fecs-camelcase */
    _enableUnameLoginCallback: function (ele, type) {
        var me = this;
        var $usernameTemp = baidu('<input type="hidden" name="userNameLogin" value="1">'),
            placeholderDom = me.getElement('pass-pop-login-placeholder-normal'),
            container = me.getElement().parentNode,
            tabLiDom = baidu('.tab li', container),
            tabADom = baidu('.tab a', container).get(0),
            $ele = baidu(ele);

        if (!ele && !type) {
            type = me.isLoginWeak === 1 ? 'normal' : 'other';
            $ele = me.eleLoginWeak;
        }

        if (+me.disUnameLogin === 0) {
            me.disUnameLogin = 1;
            me._validator.confStorage[me.$getId()].userName.desc = '\u7528\u6237\u540D';
            $usernameTemp.get(0).value = '1';

            if (placeholderDom) {
                placeholderDom.innerHTML = '\u7528\u6237\u540D';
            }
            if (tabADom) {
                tabADom.innerHTML = '\u7528\u6237\u540D\u767B\u5F55';
            }

            if (me.normalLogin) {
                me.normalLogin.innerHTML = '\u7528\u6237\u540D\u767B\u5F55';
                baidu(me.normalLogin).addClass('pass-normal-btn-s2');
                if (me.normalLogin.style.display !== 'none') {
                    me._changeLoginType('normal');
                }
            }

            if (!!me.config.isPhone === true) {
                me.switchTo('normal');
                tabLiDom.removeClass('tab-selected');
                baidu(tabLiDom.get(0)).addClass('tab-selected');
            }

            if (!!me.config.isPhone === false) {
                me.getElement('userNameLabel').innerHTML = '\u7528\u6237\u540D';
                var p = me.getElement('error');
                baidu(me.getElement('userName')).removeClass('pass-text-input-error');

                if (me.operateTipsDom) {
                    me.$show(me.operateTipsDom);
                }
            } else {
                if (me.operateTipsDom) {
                    me.$hide(me.operateTipsDom);
                }
            }

            baidu('.tang-pass-pop-login-placeholder').hide();
            if (!me.getElement('userName').value) {
                me.$show('pass-pop-login-placeholder-' + (me.config.isPhone ? 'phone' : 'normal'));
            }

            me.changeSuggestView({
                list: 'hide',
                btn: 'hide'
            });

            if (type + '' === 'normal') {
                $ele.removeClass('pass-unamelogin-btn');
                $ele.addClass('pass-emaillogin-btn');
                $ele.get(0).innerHTML = '\u90AE\u7BB1\u767B\u5F55';
            } else if (type + '' === 'other') {
                $ele.get(0).innerHTML = '\u5fd8\u8bb0\u7528\u6237\u540d?\u4f7f\u7528<a href="###" id="pass-user-login" tabIndex="-1" data-click="other">\u90AE\u7BB1\u767B\u5F55</a>';
            }

            var img = new Image();
            img.onload = img.onerror = function () {
                img.onload = img.onerror = null;
                img = null;
            };
            img.src = me._domain.https + '/img/v.gif?type=login&loginType=normalName';
        } else {
            me.disUnameLogin = 0;
            me._validator.confStorage[me.$getId()].userName.desc = '\u90AE\u7BB1';
            $usernameTemp.get(0).value = '0';

            if (placeholderDom) {
                placeholderDom.innerHTML = '\u90AE\u7BB1';
            }
            if (tabADom) {
                tabADom.innerHTML = '\u90AE\u7BB1\u767B\u5F55';
            }

            if (me.normalLogin) {
                me.normalLogin.innerHTML = '\u90AE\u7BB1\u767B\u5F55';
                baidu(me.normalLogin).removeClass('pass-normal-btn-s2');
                if (me.normalLogin.style.display !== 'none') {
                    me._changeLoginType('normal');
                }
            }

            if (!!me.config.isPhone === true) {
                me.switchTo('normal');
                tabLiDom.removeClass('tab-selected');
                baidu(tabLiDom.get(0)).addClass('tab-selected');
            }

            if (!!me.config.isPhone === false) {
                me.getElement('userNameLabel').innerHTML = '\u90AE\u7BB1';
                var p = me.getElement('error');
                baidu(me.getElement('userName')).removeClass('pass-text-input-error');

                if (me.operateTipsDom) {
                    me.$show(me.operateTipsDom);
                }
            } else {
                if (me.operateTipsDom) {
                    me.$hide(me.operateTipsDom);
                }
            }

            baidu('.tang-pass-pop-login-placeholder').hide();
            if (!me.getElement('userName').value) {
                baidu(me.getElement('pass-pop-login-placeholder-' + (me.config.isPhone ? 'phone' : 'normal'))).show();
            }

            me.changeSuggestView({
                list: 'hide'
            });

            if (me.selectBtn && me.loginrecord && me.loginrecord.email && me.loginrecord.email.length > 1) {
                me.changeSuggestView({
                    btn: 'show'
                });
            } else if (me.selectBtn) {
                me.changeSuggestView({
                    btn: 'hide'
                });
            }

            if (type + '' === 'normal') {
                $ele.addClass('pass-unamelogin-btn');
                $ele.removeClass('pass-emaillogin-btn');
                $ele.get(0).innerHTML = '\u7528\u6237\u540D\u767B\u5F55';
            } else if (type + '' === 'other') {
                $ele.get(0).innerHTML = '\u5fd8\u8bb0\u90ae\u7bb1?\u4f7f\u7528'
                    + '<a href="###" id="pass-user-login" tabIndex="-1" data-click="other">'
                    + '\u7528\u6237\u540D\u767B\u5F55'
                    + '</a>';
            }
        }
    },
    /* eslint-disable fecs-camelcase */
    _validateSuccess: function (info, opt) {
        var me = this,
            ele = baidu(me.getElement(info.field));

        me.clearGeneralError();
        ele.removeClass(me.constant.ERROR_CLASS);
        opt && opt.callback && callback();
    },
    /* eslint-disable fecs-camelcase */
    _defaultLoginErr: function (rsp) {
        var me = this;
        // 获取vcodetype
        me.vcodetype = rsp.data.vcodetype;

        if (rsp.data.codeString) {
            me.getVerifyCode(rsp.data.codeString);
            me.vcodefrom = 'login';
            me._clearInput('verifyCode');
        } else {
            me.clearVerifyCode();
        }

        if (+rsp.errInfo.no === 400401) {
            // 需要用户选择输入的是用户名还是手机号
            if (me.getElement('choiceuser_article')) {
                me.$show('choiceuser_article');
            } else {
                var choiceTemplate = me._getIrregularField('choiceuser');
                me._insertAfterW(baidu(choiceTemplate).get(0), me.getElement());
                me._setEventChoiceUser();
            }

            baidu(me.getElement()).hide();
        }
        if (+rsp.errInfo.no === 257) {
            // 登录检测需要填写密码，如果需要，则隐藏一部分选择用户
            baidu(me.getElement()).removeClass('tang-pass-login-hide');
            me.$show(me.getElement()).$hide('choiceuser_article');
        }
        if (+rsp.errInfo.no === 6 || +rsp.errInfo.no === 257) {
            // 如果是验证码错误，或者需要输入验证码，清空并聚焦验证码栏
            me._clearInput('verifyCode');
        }

        if (+rsp.errInfo.no === 4) {
            // 如果是密码错误，清空密码栏和验证码栏
            me._clearInput('password');
            if (rsp.data.resetpwd) {
                var resetpwd = '';
                switch (rsp.data.resetpwd) {
                    case '1':
                        resetpwd = '1' + me.lang.passwordResetIn;
                        break;
                    case '2':
                        resetpwd = '2' + me.lang.passwordResetIn;
                        break;
                    case '3':
                        resetpwd = '3' + me.lang.passwordResetIn;
                        break;
                    case '4':
                        resetpwd = '3' + me.lang.passwordResetOut;
                        break;
                }
                if (resetpwd.length > 0) {
                    rsp.errInfo.msg = me._format(me.lang.passwordResetWarn, {
                        resetpwd: resetpwd
                    });
                }
            }
        }
        if (+rsp.errInfo.no === 7) {
            var resetpwd = '';
            var smsEle = document.getElementsByClassName('pass-sms-btn');
            if (smsEle.length > 0) {
                resetpwd = me.lang.passwordResetSms;
            } else {
                resetpwd = ':';
            }
            if (resetpwd.length > 0) {
                rsp.errInfo.msg = me._format(me.lang.passwordResetWarnNo, {
                    resetpwd: resetpwd
                });
            }
        }
        if (rsp.errInfo.msg && (rsp.errInfo.msg.indexOf('#{') >= 0)) {
            // 如果需要替换errrsp.errInfo.msg中的字符
            if (+rsp.errInfo.no === 110024) {
                var linkUrl = me._domain.https + '/v2/?regnotify&action=resend&tpl='
                    + me.config.product
                    + '&email='
                    + encodeURIComponent(rsp.data.mail)
                    + '&u='
                    + encodeURIComponent(rsp.data.u);
                rsp.errInfo.msg = me._format(rsp.errInfo.msg, {gotourl: linkUrl});
            } else {
                var account = me.getElement('userName').value;
                rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                    urldata: '&account=' + account + '&tpl=' + me.config.product + '&u=' + me.config.u
                });
            }
        }

        if (rsp.errInfo['field']) {
            // 展现错误信息
            me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg'], rsp);
        } else {
            me.setGeneralError(rsp.errInfo['msg'], rsp);
        }
    },
    /* eslint-disable fecs-camelcase */
    _asyncValidate: {
        // 验证图形验证码是否正确
        checkVerifycode: function (callbacks, type) {
            //异步校验，仅提供给输入时校验使用
            var me = this,
                eleVcode = me.getElement('verifyCode'),
                eleCodeStr = me.getElement('codeString');

            passport.data.checkVerifycode({
                verifycode: me._SBCtoDBC(eleVcode.value),
                codestring: eleCodeStr.value
            })
            .success(function (rsp) {
                /**
                 * @description 用户名检查
                 * @name magic.passport.reg#userNameCheck
                 * @event
                 * @grammar magic.passport.reg#userNameCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('checkVerifycode', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    callbacks && callbacks.success(rsp);
                    me.$hide('verifyCode_clearbtn');
                    me.$show('verifyCodeSuccess');
                    me.constant.CHECKVERIFYCODE = true;
                } else if (+rsp.errInfo.no === 500002 || +rsp.errInfo.no === 500018) {
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                    me.$hide('verifyCodeSuccess');
                    me.constant.CHECKVERIFYCODE = false;
                } else {
                    // 其他异常情况，不提示任何错误信息，直接可以提交
                    callbacks && callbacks.success(rsp);
                    me.$hide('verifyCodeSuccess');
                    me.constant.CHECKVERIFYCODE = true;
                }
            });
        }
    },
    /* eslint-disable fecs-camelcase */
    _format: function (source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments, 1);
        var toString = Object.prototype.toString;
        if (data.length) {
            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */

            data = data.length === 1
                ? (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key) {
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if ('[object Function]' === toString.call(replacer)) {
                    replacer = replacer(key);
                }
                return ('undefined' === typeof replacer ? '' : replacer);
            });
        }
        return source;
    },

    loginConnect: function (data, callback, normalLoginFn) {
        var me = this;
        var bindUrl = '/v2/unite-bind';
        var connectParams = {
            username: data.username,
            smsVcode: data.smsVcode || '',
            sms: data.sms || ''
        };
        /* eslint-disable fecs-camelcase */
        var _buildQuery = function (query) {
            if (typeof (query) === 'object') {
                var builder = [];
                for (var p in query) {
                    var value = query[p];
                    if (value !== undefined && value !== null) {
                        if (builder.length) {
                            builder.push('&');
                        }
                        var valueString = encodeURIComponent(typeof(value) === 'boolean'
                            ? (value ? '1' : '0') : value.toString());
                        builder.push(encodeURIComponent(p), '=', valueString);
                    }
                }
                return builder.join('');
            }
            if (typeof (query) === 'string') {
                return query;
            }
            return null;
        };
        /* eslint-disable fecs-camelcase */
        var _appendQuery = function (url, query) {
            query = _buildQuery(query);
            if (typeof (query) === 'string') {
                var hasQuery = (/\?/g).test(url);
                url += (hasQuery ? '&' : '?') + _buildQuery(query);
            }
            return url;
        };
        normalLoginFn();
    },

    checkPhone: function (userid, phone) {
        var me = this;
        if (window.checkPhoneWidget) {
            if (window.checkPhoneWidget.setMakePhone) {
                window.checkPhoneWidget.setMakePhone(phone, userid);
            }
            me._ownerDialog && me._ownerDialog.hide('unHide');
            window.checkPhoneWidget.show();
        } else if (!window.checkPhoneExist) {
            passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                window.checkPhoneWidget = passport.pop.init({
                    type: 'checkPhone',
                    apiOpt: {
                        u: me.config.u,
                        product: me.config.product ? me.config.product : '',
                        phone: phone,
                        apiMargicInstance: me,
                        token: me.bdPsWtoken,
                        username: userid,
                        isuserid: 1,
                        noSynBdu: me.config.noSynBdu || '',
                        staticPage: me.config.staticPage
                    },
                    tangram: true,
                    onHide: function () {
                        me._ownerDialog && me._ownerDialog.show();
                    }
                });
                me._ownerDialog && me._ownerDialog.hide('unHide');
                window.checkPhoneWidget.show();
            });
        }

    },
    /* eslint-disable fecs-camelcase */
    _loginCheck: function (value, history) {
        // history 是否为历史记录中请求
        var me = this;
        var dvValue = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        dvValue = dvValue.length > 1500 ? '' : dvValue;
        if (value.length) {
            passport.data.loginCheck({
                sub_source: 'leadsetpwd',
                userName: value,
                isPhone: me.config.isPhone,
                dv: dvValue
            })
            .success(function (rsp) {
                if (+rsp.errInfo.no === 0 && rsp.data.userid && !history) {
                    me.checkPhone(rsp.data.userid, rsp.data.mobile);
                    window.checkPhoneExist = true;
                    me._ownerDialog && me._ownerDialog.hide('unHide');
                } else if (rsp.errInfo.no === '0' && rsp.data.isconnect) {
                    me.setGeneralError(me.lang.nopassLead);
                } else {
                    // 登录检测触发风控，出现验证码
                    if (rsp.data.codeString.length) {
                        me.vcodetype = rsp.data.vcodetype;
                        me.getVerifyCode(rsp.data.codeString);
                        me.vcodefrom = 'username';
                    } else {
                        me.clearVerifyCode();
                    }
                }
            });
        }
    },
    // 全角转半角
    /* eslint-disable fecs-camelcase */
    _SBCtoDBC: function (str) {
        var result = '';
        if (str) {
            var len = str.length;
            for (var i = 0; i < len; i++) {
                var cCode = str.charCodeAt(i);
                // 全角与半角相差（除空格外）：65248（十进制）
                cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
                // 处理空格
                cCode = (cCode === 0x03000) ? 0x0020 : cCode;
                result += String.fromCharCode(cCode);
            }
            return result;
        } else {
            return;
        }
    },

    submit: function () {
        var me = this;
        // TODO 如果 logincheck 太快，验证码栏展开此处 submit 不会被触发, 参见 submitNotTrigger
        if (me.internation && !me._validatorforeignmobileFn(me.getElement('foreignMobile'))) {
            return;
        }
        me.validateAll({
            success: function () {
                me._doFocus('submit');
                me.submitStatus = 1;//submitStatus = 1开始点击
                /**
                 * @description 表单提交前
                 * @name magic.passport.login#beforeSubmit
                 * @event
                 * @grammar magic.passport.login#beforeSubmit
                 */
                var returnValue = me.fireEvent('beforeSubmit');
                me.getElement('submit').style.color = '#9ebef4';
                if (!returnValue) {
                    return;
                }

                if (me.spLogin) {
                    var usernameTemp = baidu('<input type="hidden" name="splogin" value="' + me.spLogin + '">');
                    me.getElement('hiddenFields').appendChild(usernameTemp.get(0));
                    me.spLogin = null;
                }

                var data = baidu.form.json(me.getElement('form'));
                data.token = me.bdPsWtoken;
                passport.data.setContext(baidu.extend({}, me.config));
                if (data.foreignusername) {
                    data.foreignusername = me._SBCtoDBC(data.foreignusername);
                }
                data.userName = me._SBCtoDBC(data.userName);
                data.verifyCode = me._SBCtoDBC(data.verifyCode);
                var password_DBC = me._SBCtoDBC(me.getElement('password').value);
                if (me.RSA && me.rsakey) {
                    var passwordVal = password_DBC;
                    if (passwordVal.length < 128 && !me.config.safeFlag) {
                        data.password = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
                        data.rsakey = me.rsakey;
                        data.crypttype = 12;
                    }
                }

                /*
                ** 登录反馈，超时，出错处理
                */
                var submitEle = me.getElement('submit');
                var time = 15000;
                var submitInterval;
                me.getElement('submit').style.color = '#9ebef4';
                submitEle.value = me.lang.logining;
                submitInterval = setTimeout(function () {
                    if (me.submitStatus === 1 && !me.config.connect) {
                        me.setGeneralError(me.lang.submitTimeup);
                    }
                    submitEle.value = me.lang.login;
                }, time);

                /**
                 * pc请求登录的最终函数
                 */
                function loginFn(mkdData) {
                    // 初始化时间
                    data.timeSpan = new Date().getTime() - me.initTime;
                    if (passport.data.traceID) {
                        passport.data.traceID.startFlow && passport.data.traceID.startFlow('login');
                    }
                    // TODO 请求登录接口
                    if (me.internation) {
                        data.username = me._SBCtoDBC(me.getElement('foreignMobile').value);
                        data.isPhone = true;
                        data.countrycode = baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '';
                    } else {
                        data.countrycode = '';
                    }
                    data.FP_UID = me._getCookie('FP_UID') || '';
                    data.FP_INFO = window.PP_FP_INFO || '';
                    if (mkdData && mkdData.ds && mkdData.tk) {
                        data.ds = mkdData.ds || '';
                        data.tk = mkdData.tk || '';
                    }
                    data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                    // 添加验证码来源的参数用于统计
                    if (me.vcodefrom) {
                        data.vcodefrom = me.vcodefrom;
                    }
                    data.extrajson = me.config.extrajson;
                    passport.data.login(data)
                    .success(function (rsp) {
                        me.submitStatus = 2;//submitStatus = 2获取到登录验证信息
                        rsp.loginType = 'password';
                        if (+rsp.errInfo.no === 0) {
                            /**
                             * @description 登录成功
                             * @name magic.passport.login#loginSuccess
                             * @event
                             * @grammar magic.passport.login#loginSuccess(e)
                             * @param {Object} e 事件参数
                             * @param {Object} e.data 服务器返回信息
                             * @param {Boolean} evt.returnValue 返回false时，阻止跳转
                             */
                            var returnValue = me.fireEvent('loginSuccess', {
                                rsp: rsp
                            });
                            if (!returnValue) {
                                return;
                            }

                            if (window.location) {
                                window.location.href = rsp.data.u;
                            } else {
                                document.location.href = rsp.data.u;
                            }
                        } else {
                            /**
                             * @description 登录失败
                             * @name magic.passport.login#loginError
                             * @event
                             * @grammar magic.passport.login#loginError(e)
                             * @param {Object} e 事件参数
                             * @param {Object} e.rsp 服务器返回信息
                             */
                            submitEle.value = me.lang.login;
                            me.getElement('submit').style.color = '#fff';
                            var returnValue = me.fireEvent('loginError', {
                                rsp: rsp
                            });
                            if (!returnValue) {
                                return;
                            }

                            me._defaultLoginErr(rsp);
                        }
                    });
                }

                /**
                 * pc帐号名密码登录回调函数 -获取人机数据提交给服务端
                 */
                function mkdDataLoginFn() {
                    if (me.loginPassMkd && me.loginPassMkd.getDataAsync) {
                        var mkdData = {};
                        me.loginPassMkd.getDataAsync(function (rsp) {
                            mkdData.ds = rsp.ds || 'xxx_login';
                            mkdData.tk = rsp.tk || 'xxx_login';
                            loginFn(mkdData);
                        });
                    } else {
                        loginFn();
                    }
                }
                me.loginConnect({
                    username: data.userName,
                    password: data.password
                }, {
                    success: function () {
                        clearTimeout(submitInterval);
                        submitEle.value = me.lang.login;
                    },
                    fail: function (msg) {
                        clearTimeout(submitInterval);
                        submitEle.value = me.lang.login;
                        me.setGeneralError(msg);
                    }
                }, mkdDataLoginFn);

            }
        }, true);
    },
    /* eslint-disable fecs-camelcase */
    _eventHandler: (function () {
        var me,
            style = {
                focus: function (field, e) {
                    /**
                     * @description 表单域获得焦点
                     * @name magic.passport.reg#fieldFocus
                     * @event
                     * @grammar magic.passport.login#fieldFocus(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 focus 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldFocus', {
                        ele: this
                    });
                    if (!returnValue) {
                        return;
                    }

                    this.addClass(me.constant.FOCUS_CLASS);
                    this.removeClass(me.constant.ERROR_CLASS);
                    baidu(me.getElement(field + 'Label')).addClass(me.constant.LABEL_FOCUS_CLASS);
                },
                blur: function (field, e) {
                    /**
                     * @description 表单域失去焦点
                     * @name magic.passport.reg#fieldBlur
                     * @event
                     * @grammar magic.passport.login#fieldBlur(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 blur 事件的表单域
                     */
                    me.getElement(field).value = me.getElement(field).value.replace(/\s/g, '');
                    var returnValue = me.fireEvent('fieldBlur', {
                        ele: this
                    });
                    if (!returnValue) {
                        return;
                    }

                    this.removeClass(me.constant.FOCUS_CLASS);
                    baidu(me.getElement(field + 'Label')).removeClass(me.constant.LABEL_FOCUS_CLASS);
                },
                mouseover: function (field, e) {
                    /**
                     * @description 鼠标移入表单域
                     * @name magic.passport.reg#fieldMouseover
                     * @event
                     * @grammar magic.passport.login#fieldMouseover(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 mouseover 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldMouseover', {
                        ele: this
                    });
                    if (!returnValue) {
                        return;
                    }

                    this.addClass(me.constant.HOVER_CLASS);
                },
                mouseout: function (field, e) {
                    /**
                     * @description 鼠标移出表单域
                     * @name magic.passport.reg#fieldMouseout
                     * @event
                     * @grammar magic.passport.login#fieldMouseout(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 fieldMouseout 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldMouseout', {
                        ele: this
                    });
                    if (!returnValue) {
                        return;
                    }

                    this.removeClass(me.constant.HOVER_CLASS);
                },
                keyup: function (field, e) {
                    /**
                     * @description 输入表单的时候
                     * @name magic.passport.login#fieldKeyup
                     * @event
                     * @grammar magic.passport.login#fieldKeyup(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 blur 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldKeyup', {
                        ele: this
                    });
                    if (!returnValue) {
                        return;
                    }
                }
            },
            behaviour = {
                focus: {
                    'userName': function () {
                        if (me.config.loginMerge && me.getElement('loginMerge')) {
                            me.getElement('loginMerge').value = 'true';
                            me.getElement('isPhone').value = '';
                        }
                    },
                    'password': function (field, e) {
                        me._getRSA(function (result) {
                            me.RSA = result.RSA;
                            me.rsakey = result.rsakey;
                        });
                    },
                    'verifyCode': function () {
                        me.$hide('verifyCodeSuccess');
                    }
                },
                blur: {
                    'userName': function (field, e) {

                    },
                    'password': function (field, e) {
                        var value = this.get(0).value;
                        if (value.length) {
                            me.validate(field);
                        }
                    },
                    'verifyCode': function (field, e) {
                        var value = this.get(0).value;
                        if (value.length) {
                            me.validate(field);
                        }
                        var verifyCodeEle = me.getElement('verifyCode');
                        var $verifyCodeEle = baidu(verifyCodeEle);

                        if (verifyCodeEle.value) {
                            me._asyncValidate.checkVerifycode.call(me, {
                                error: function (rsp) {
                                    $verifyCodeEle.addClass(me.constant.ERROR_CLASS);
                                    me.setGeneralError(rsp.msg);
                                },
                                success: function () {
                                    $verifyCodeEle.removeClass(me.constant.ERROR_CLASS);
                                    me.clearGeneralError();
                                }
                            });
                        } else {
                            me.$hide('verifyCodeSuccess');
                        }
                    }
                },
                change: {
                    'userName': function (field, e) {
                        var value = this.get(0).value;
                        me._loginCheck(value);
                    },
                    'verifyCode': function (field, e) {

                    }
                },
                click: {
                    'verifyCodeChange': function (field, e) {
                        // 更换验证码
                        me.getElement('verifyCode').value = '';
                        me._doFocus('verifyCode');
                        me.getVerifyCode();
                        e.preventDefault();
                    }
                },
                keyup: {},
                submit: function (e) {
                    me.submit();
                    e.preventDefault();
                }
            };
        return {
            entrance: function (e) {
                me = this;
                var target = baidu(e.target),
                    field = e.target.name;
                if (!field && e.target.id) {
                    var matches = e.target.id.match(/\d+__(.*)$/);
                    if (matches) {
                        field = matches[1];
                    }
                }
                if (!field) {
                    return;
                }
                if (style.hasOwnProperty(e.type)) {
                    style[e.type].apply(baidu(e.target), [field, e]);
                }

                if (behaviour.hasOwnProperty(e.type)) {
                    if (typeof behaviour[e.type] === 'function') {
                        // for submit
                        behaviour[e.type].apply(baidu(e.target), [e]);
                    }
                    if (behaviour[e.type].hasOwnProperty(field)) {
                        behaviour[e.type][field].apply(baidu(e.target), [field, e]);
                    }
                }

                // init api
                if (!me.initialized && e.type + '' === 'focus') {
                    me._initApi();
                }

            }
        };
    })(),

    /**
     * @description 提交当前表单
     * @name magic.passport.login#submitForm
     * @grammar magic.passport.login#submitForm
     * @function
     */
    /**
     * @description 显示该模块
     * @name magic.passport.login#show
     * @grammar magic.passport.login#show
     * @function
     */
    /**
     * @description 隐藏该模块
     * @name magic.passport.login#hide
     * @grammar magic.passport.login#hide
     * @function
     */
    /**
     * @description 校验单个表单域
     * @name magic.passport.login#validate
     * @function
     * @grammar magic.passport.login#validate(field, callbacks)
     * @param {String} field 要校验的表单域
     * @param {String} callbacks 校验完成回调，可选
     * @param {String} callbacks.succcess 校验通过回调，可选
     * @param {String} callbacks.error 校验未通过回调，可选
     */
    /**
     * @description 开始校验单个表单域前
     * @name magic.passport.login#beforeValidate
     * @event
     * @grammar magic.passport.login#beforeValidate(e)
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验信息
     * @param {String} e.validate.field 参与校验的表单项名
     * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
     */
    /**
     * @description 单项表单域校验通过
     * @name magic.passport.login#validateSuccess
     * @grammar magic.passport.login#validateSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     */
    /**
     * @description 单项表单域校验未通过
     * @name magic.passport.login#validateError
     * @grammar magic.passport.login#validateError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
     */
    /**
     * @description 校验整个表单
     * @name magic.passport.login#validateAll
     * @grammar magic.passport.login#validateAll(callbacks, breakOnError)
     * @function
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {Boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    /**
     * @description 开始校验整个表单前
     * @name magic.passport.login#beforeValidateAll
     * @grammar magic.passport.login#beforeValidateAll
     * @event
     */
    /**
     * @description 全表单校验通过
     * @name magic.passport.login#validateAllSuccess
     * @grammar magic.passport.login#validateAllSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 全表单校验未通过
     * @name magic.passport.login#validateAllError
     * @grammar magic.passport.login#validateAllError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */

    /**
     * @description 析构
     * @name magic.passport.login#$dispose
     * @function
     * @grammar magic.passport.login#$dispose()
     */
    $dispose: function () {
        var me = this;
        if (me.disposed) {
            return;
        }
        baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
        me.getElement().removeChild(me.getElement('form'));
        magic.Base.prototype.$dispose.call(me);
    }
});

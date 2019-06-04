/**
 * @file passport 注册模块
 * @name magic.passport.reg
 * @grammar new magic.passport.reg(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 注册成功后的跳转页面
 * @param {String} options.retu 注册成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Boolean} options.isPhone 是否使用手机号注册，默认 false
 * @param {Boolean} options.userName 是否需要填写用户名，默认 false
 * @return {magic.passport.reg} magic.passport.reg 实例
 * @superClass magic.passport
 */

///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.string.getByteLength;
///import baidu.form.json;
///import baidu.dom;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.dom.empty;
///import baidu.dom.append;
///import baidu.dom.insertAfter;
///import baidu.dom.offset;
///import magic.passport;
///import magic.setup.suggestion;
/* eslint-disable */
magic.passport.reg = baidu.lang.createClass(function (options) {
    var me = this;
    me.config = {
        isPhone: false,
        userName: false,
        staticPage: '',
        u: '',
        retu: '',
        passwordConfirm: false,
        product: '',
        charset: '',
        lang: 'zh-CN',
        isexchangeable: 0,
        // 待定参数，用以统计
        subpro: '',
        // nocaptcha: !!window.NoCaptcha && (!baidu.browser.ie || parseInt(baidu.browser.ie) > 8) && window.location.search.indexOf('lightwebapp') == -1 && window.location.search.indexOf("cloudforbusiness") == -1 && window.location.search.indexOf("bceplat") == -1// 已加载行为验证码库并且IE8以上则开启行为验证码
        nocaptcha: false,
        isVoiceSms: 0
    };
    baidu.object.extend(me.config, options);
    this.module = 'reg';
    this.guideRandom = (function () {
        return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    })();
    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'auto': (window.location
            ? ((window.location.protocol.toLowerCase() === 'https:')
                ? 'https://passport.baidu.com' : 'http://passport.baidu.com/')
            : ((document.location.protocol.toLowerCase() === 'https:')
                ? 'https://passport.baidu.com' : 'http://passport.baidu.com/')),
        'wapAuto': (window.location
            ? ((window.location.protocol.toLowerCase() === 'https:')
                ? 'https://wappass.baidu.com' : 'http://wappass.baidu.com/')
            : ((document.location.protocol.toLowerCase() === 'https:')
                ? 'https://wappass.baidu.com' : 'http://wappass.baidu.com/'))
    };
    me.constant = {
        CONTAINER_CLASS: 'tang-pass-reg',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        DISABLED_CLASS: 'pass-text-input-disabled',
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        PROTOCAL_URL: me._domain.http + '/static/passpc-account/html/protocal.html',
        MODIFY_PWD_URL_PREFIX: me._domain.https + '/forcsdnpasschange',
        PERSONAL_PROTOCAL_URL: 'https://www.baidu.com/duty/yinsiquan.html',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime()),
        TOUCHAPIMKD_URL: me._domain.wapAuto + '/static/touch/js/api/wrapper_touch.js?cdnversion=' + (new Date().getTime()),
    };
    me.lang = passport.err.getCurrent().labelText.reg;

    // 是否注册覆盖已注册过的邮箱OR手机号状态机
    me.AccountExchangeFlag = 0;

    me.initTime = new Date().getTime();
    /*var countryTpl = ['pp','se','lv','tb','mn'] ;
    if(('|'+countryTpl.join('|')+'|').indexOf('|'+me.config.product+'|') > -1){
        this.foreignMobile = true ;
    }*/
    // 人机
    me.insertNoCaptchaScript();
    // 新人机
    me.initMkd();
    if (me.config.overseas && (+me.config.overseas === 1)) {
        this.foreignMobile = true;
    }
    this.internation = false;
    // 下掉合并用户名注册
    me.config.regMergeUserName = false;
    me.config.userName = 1;
    // init data
    passport.data.setContext(baidu.extend({}, me.config));

    // 是否是嵌入的还是独立的
    this.isBrowser = /passport\.baidu\.com/ig.test(window.location.href);
    /**
     * 发送统计
     * @param {Object} me 执行上下文
     * @param {string} eventType en字段
     * @param {Object} anotherData 需要发送的其他字段
     */
    me.sendLog = function (me, eventType, anotherData) {
        var urlData = {
            // 区分客户端是pc网页还是pc客户端内嵌
            'page': me.isBrowser ? 'pc-browser' : 'pc-inside',
            'tpl': me.config.product || ''
        };
        if (anotherData) {
            for (var x in anotherData) {
                if (anotherData.hasOwnProperty(x)) {
                    urlData[x] = anotherData[x];
                }
            }
        }
        var autoStatisticObj = {
            'eventType': eventType
        };
        me._logPass(urlData, autoStatisticObj);
    };

    // 发送注册页面展现量
    me.sendLog(me, 'pc-register-show', {});

}, {
    type: 'http://passport.baidu.com/passApi/js/modules/magic.passport.reg',
    superClass: magic.passport
}).extend({
    /* eslint-disable fecs-camelcase */
    _getIrregularField: function (field) {
        var me = this;
        var template = {
            verifyCode: '<p id="' + me.$getId('verifyCodeImgWrapper')
            + '" class="pass-form-item pass-form-item-verifyCode" style="display:none">'
            + '<label for="' + me.$getId('verifyCode')
            + '" id="' + me.$getId('verifyCodeLabel')
            + '" class="pass-label pass-label-verifyCode">'
            + me.lang.captcha + '</label>'
            + '<input id="' + me.$getId('verifyCode')
            + '" type="text" name="verifyCode" class="pass-text-input pass-text-input-verifyCode" '
            + 'autocomplete="off" maxlength="6"/>'
            + '<span><img id="' + me.$getId('verifyCodeImg') + '" title="'
            + me.lang.captchaAlt + '" alt="' + me.lang.captchaAlt
            + '" class="pass-verifyCode" src="' + me.constant.BLANK_IMG_URL + '" /></span>'
            + '<a id="' + me.$getId('verifyCodeChange')
            + '" href="#" class="pass-change-verifyCode">' + me.lang.captchaChange + '</a>'
            + (me.config.regMerge
                ? '<input id="' + me.$getId('verifyCodeSend') + '" type="button" value="'
                + me.lang.getSMSKey
                + '" class="pass-button pass-button-verifyCodeSend" autocomplete="off" style="display:none"/>'
                : '') + (me.config.regMerge
                ? '<span id="' + me.$getId('verifyCodeSendTip')
                + '" class="pass-item-tip pass-item-tip-verifyCodeSend" style="display:none;"></span>' : '')
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCode"></span>'
            + '<span id="' + me.$getId('verifyCodeTip')
            + '" class="pass-item-tip pass-item-tip-verifyCode" style="display:none;"><span id="'
            + me.$getId('verifyCodeTipText') + '" class="pass-item-tiptext pass-item-tiptext-verifycode">'
            + me.lang.captchaTip + '</span></span>'
            + '</p>',
            generalError: '<p id="' + me.$getId('errorWrapper')
            + '" class="pass-generalErrorWrapper">'
            + '<span id="' + me.$getId('error') + '" class="pass-generalError"></span>'
            + '</p>',
            suggestName: '<div id="' + me.$getId('suggestNameWrapper') + '" class="pass-suggest-name"></div>',
            isAgree: '<p id="' + me.$getId('isAgreeWrapper') + '" class="pass-form-item pass-form-item-isAgree">'
            + '<input name="isAgree" id="' + me.$getId('isAgree')
            + '" type="checkbox" class="pass-checkbox-input pass-checkbox-isAgree" autocomplete="off" />'
            + '<label for="' + me.$getId('isAgree') + '">' + me.lang.agree + '</label>'
            + '<a target="_blank" href="' + me.constant.PROTOCAL_URL + '">'
            + me.lang.baiduUserProtocal + '</a></span>'
            + '及<a target="_blank" href="' + me.constant.PERSONAL_PROTOCAL_URL + '">'
            + me.lang.baiduPersonalProtocal
            + '<a></span>'
            + '<span id="' + me.$getId('isAgreeError') + '" class="pass-item-error pass-item-error-isAgree"></span>'
            + '</p>',
            submit: '<p id="' + me.$getId('submitWrapper') + '" class="pass-form-item pass-form-item-submit">'
            + '<input id="' + me.$getId('submit') + '" type="submit" value="'
            + me.lang.register + '" class="pass-button pass-button-submit" />'
            + '</p>',
            tip: '<div id="' + me.$getId('tip')
            + '" class="pass-pop-tip" style="display:none"><div class="pass-pop-tip-header">'
            + '</div><div class="pass-pop-tip-container"><div class="pass-pop-tip-body">'
            + '<div class="pass-pop-tip-content" id="'
            + me.$getId('tipContainer')
            + '"></div></div></div></div>',
            verifyCodeSend: '<p id="' + me.$getId('verifyCodeSendWrapper')
            + '" class="pass-form-item pass-form-item-verifyCodeSend">'
            + (!me.config.regMerge && me.config.isPhone
                ? '<label for="' + me.$getId('verifyCode') + '" id="'
                + me.$getId('verifyCodeLabel') + '" class="pass-label pass-label-verifyCode">'
                + me.lang.captcha + '</label>'
                : '')
            + (!me.config.regMerge && me.config.isPhone
                ? '<input id="' + me.$getId('verifyCode') + '" type="text"'
                + 'name="verifyCode" class="pass-text-input pass-text-input-verifyCode" '
                + 'autocomplete="off" maxlength="6"/>'
                : '')
            + '<input id="' + me.$getId('verifyCodeSend') + '" type="button" value="' + me.lang.getSMSKey
            + '" class="pass-button pass-button-verifyCodeSend" autocomplete="off"/>'
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCodeSend">'
            + '</span>'
            + '<span id="' + me.$getId('verifyCodeSendTip')
            + '" class="pass-item-tip pass-item-tip-verifyCodeSend">'
            + '</span>'
            + '</p>',
            nocaptchaContainer: '<div id="' + me.$getId('nocaptchaWrapper')
            + '" class="pass-nocaptcha"></div>',
            nocaptchaVCode: '<p id="' + me.$getId('verifyCodeSendWrapper')
            + '" class="pass-form-item pass-form-item-verifyCodeSend pass-captcha-resend-hide">'
            + '<label for="' + me.$getId('verifyCode') + '" id="'
            + me.$getId('verifyCodeLabel') + '" class="pass-label pass-label-verifyCode">'
            + me.lang.captcha + '</label>'
            + '<input id="' + me.$getId('verifyCode') + '" type="text" '
            + 'name="verifyCode" class="pass-text-input" autocomplete="off" maxlength="6"/>'
            + '<input type="text" style="visibility:hidden;height:0px;border:none;float:left;"/>'
            + '<span id="' + me.$getId('verifyCodeResend') + '" class="pass-captcha-resend"></span>'
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCodeSend">'
            + '</span>'
            + '<span id="' + me.$getId('verifyCodeSendTip')
            + '" class="pass-item-tip pass-item-tip-verifyCodeSend">'
            + '</span>'
            + '</p>',
            nocaptchaMargin: '<div style="height:40px"></div>',
            strengthTip: '<span id="' + me.$getId('strengthTip') + '"><span class="pwd-strength clearfix">'
            + '<span class="strength-title">' + me.lang.strength + '</span>'
            + '<span id="' + me.$getId('strengthTipText')
            + '" class="strength-value pass-item-tiptext pass-item-tiptext-strength"></span>'
            + '<span class="strength-bg"><span class="strength-inner" id="'
            + me.$getId('strengthTipPic') + '"></span>'
            + '</span></span><span class="strength-explain">' + me.lang.strengthTip
            + '</span></span>',
            passwordCheck: '<div  id="' + me.$getId('passwordCheck')
            + ' class="pass-pop-tip pass-pop-tip-passwordCheck">'
            + '<ul id="' + me.$getId('passwordCheckList') + ' class="pass-pop-tip-passwordCheck-list"></ul>'
            + '<span class="pass-pop-tip-passwordCheck-arrow"></span>'
            + '</div>',
            pwdChecklist: '<div class="pwd-checklist-wrapper">'
            + '<span class="pwd-checklist-arrow"><em class="arrowa">◆</em><em class="arrowb">◆</em></span>'
            + '<ul id="' + me.$getId('pwdChecklist') + '" class="pwd-checklist">'
            + '<li id="' + me.$getId('pwd_checklist_len')
            + '" data-rule="len" class="pwd-checklist-item">' + me.lang.pwdChecklist_len + '</li>'
            + '<li id="' + me.$getId('pwd_checklist_cha') + '" data-rule="cha" class="pwd-checklist-item">'
            + me.lang.pwdChecklist_cha + '</li>'
            + '<li id="' + me.$getId('pwd_checklist_spa') + '" data-rule="spa" class="pwd-checklist-item">'
            + me.lang.pwdChecklist_spa + '</li>'
            + '</ul>' + '</div>',
            foreignMobileWrapper: '<div class="pass-form-item '
            + 'pass-form-item-phone pass-form-item-PhoneCountry" id="'
            + me.$getId('foreignMobileWrapper') + '">' + '<label for="'
            + me.$getId('phone') + '" id="' + me.$getId('phoneLabel') + '" class="pass-label pass-label-phone">'
            + me.lang.phoneNum + '</label>' + '<span id="' + me.$getId('foreignMobileLabel')
            + '" class="pass-foreign-label" data-countryCode="">+86</span>'
            + '<input id="' + me.$getId('phone')
            + '" type="text" name="phone" maxlength="11" '
            + 'autocomplete="off" class="pass-text-input pass-foreign-input"/>'
            + '<span id="' + me.$getId('phoneError')
            + '" class="pass-item-error pass-item-error-phone"></span>'
            + '<span id="' + me.$getId('phoneSucc')
            + '" class="pass-item-succ pass-item-succ-phone" style="display:none;"></span>'
            + '<span id="' + me.$getId('phoneTip')
            + '" class="pass-item-tip pass-item-tip-phone" style="display:none;">'
            + '<span id="' + me.$getId('phoneTipText') + '" class="pass-item-tiptext pass-item-tiptext-phone">'
            + me.lang.phoneNumTip + '</span>' + '</span>'
            + '<ul id="' + me.$getId('foreignCountryList') + '" class="pass-country-list"></ul>' + '</div>',
            multiTip: '<div class="pass-multiTip" id="' + me.$getId('multiTip')
            + '" style="position:absolute;top:0px;left:0px;background:#ffffda;'
            + 'border:1px solid #d1b07c;border-radius:3px;z-index:5000;margin:0px;">'
            + '<span class="pass-multiTip-text" style="display:block;padding:5px 10px;font-size:12px;color:#907448;">'
            + me.lang.multiTip + '</span>'
            + '<span class="pass-multiTup-arrow" style="position:absolute;'
            + 'bottom:6px;left:10px;"><em style="position:absolute;top:0px;'
            + 'left:0px;color:#d1b07c;font-style:normal;font-size:12px;line-height:14px;">◆</em>'
            + '<em style="position:absolute;top:-1px;left:0px;color:#ffffda;font-style:normal;'
            + 'font-size:12px;line-height:14px;">◆</em></span>'
            + '</div>',
            dvInput: '<input type="hidden" node-type="_username" id="_username" name="_username" value="">'
            + '<input type="hidden" node-type="_regpass" id="_regpass" name="_regpass" value="">'
            + '<input type="hidden" node-type="_rsakey" id="_rsakey" name="_rsakey" value="">'
            + '<input type="hidden" node-type="_regfrom" id="_regfrom" name="_regfrom" value="reg">'
        };
        return template[field];
    },
    /* eslint-disable fecs-camelcase */
    _getTemplate: function (containerId) {
        var me = this;
        var templateStr = '<form autocomplete="off" id="' + me.$getId('form') + '" method="POST">';
        var hiddenFields = {
            // registerType: me.config.userName ? true : false,
            retu: me.config.retu,
            u: me.config.u,
            // 如果是的仅仅用户名注册，则为1
            quick_user: (!me.config.isPhone && (!!me.config.email === false)) ? 1 : 0,
            regMerge: me.config.regMerge ? true : false,
            suggestIndex: '',
            suggestType: '',
            codeString: '',
            vcodesign: '',
            vcodestr: '',
            gid: me.guideRandom || '',
            app: (me.config.app ? me.config.app : ''),
            staticPage: me.config.staticPage,
            selectedSuggestName: '',
            isLowpwdCheck: me.config.isLowpwdCheck,
            // 用以zmon监控统计,
            logRegType: (me.config.diaPassreg ? 'pc_regDialog' : 'pc_regBasic'),
            isexchangeable: me.config.isexchangeable,
            exchange: me.AccountExchangeFlag,
            subpro: me.config.subpro
        };
        var regRegularField = [];

        if (me.config.userName) {
            regRegularField.push({
                field: 'userName',
                label: me.lang.userName,
                tip: me.lang.userNameTip,
                hasSucc: true
            });
        }
        if (me.config.regMerge) {
            regRegularField.push({
                field: 'account',
                label: me.config.regMergeUserName ? me.lang.account_username : me.lang.account,
                tip: me.config.regMergeUserName ? me.lang.accountTip_username : me.lang.accountTip,
                hasSucc: true
            });
        } else if (me.config.isPhone) {
            if (!me.foreignMobile) {
                regRegularField.push({
                    field: 'phone',
                    label: me.lang.phoneNum,
                    tip: me.lang.phoneNumTip,
                    maxLength: 11,
                    hasSucc: true
                });
            }
            // add this condition by Alien at：2013.05.30
        } else if (!!me.config.email !== false) {
            regRegularField.push({
                field: 'email',
                label: me.lang.email,
                tip: me.lang.emailTip,
                hasSucc: true
            });
        }

        if (me.config.nocaptcha) {
            regRegularField.push({
                field: 'nocaptchaVCode'
            });
        }

        regRegularField.push({
            field: 'password',
            pwd: true,
            label: me.lang.password,
            hasSucc: true
        });

        if (me.config.passwordConfirm) {
            regRegularField.push({
                field: 'verifyPass',
                pwd: true,
                label: me.lang.confirmPassword,
                hasSucc: true
            });
        }
        templateStr += me._getIrregularField('generalError');
        templateStr += me._getHiddenField(hiddenFields);
        templateStr += me._getIrregularField('dvInput');
        if (!me.config.regMerge && me.config.isPhone && me.foreignMobile) {
            templateStr += me._getIrregularField('foreignMobileWrapper');
        }
        for (var i = 0; i < regRegularField.length; i++) {
            if (regRegularField[i].field + '' === 'nocaptchaVCode') {
                templateStr += me._getIrregularField('nocaptchaContainer');
                templateStr += me._getIrregularField(regRegularField[i].field);
                continue;
            }
            if (regRegularField[i].field === 'password') {
                templateStr += '<input type="password" name="password" style="display:none"/>';
            }
            templateStr += me._getRegularField(regRegularField[i], 'reg');
            /*if(regRegularField[i].field == 'phone'){
                 templateStr += me._getIrregularField('verifyCodeSend');
            }*/
        }
        if (!me.config.regMerge && me.config.isPhone && !me.config.nocaptcha) {
            templateStr += me._getIrregularField('verifyCodeSend');
        }

        if (me.config.verifyCode !== false) {
            if (!me.config.isPhone) {
                templateStr += me._getIrregularField('verifyCode');
            }
        }

        templateStr += me._getIrregularField('isAgree');
        templateStr += me._getIrregularField('submit');
        templateStr += me._getIrregularField('tip');

        if (me.config.nocaptcha) {
            templateStr += me._getIrregularField('nocaptchaMargin');
        }
        templateStr += '</form>';

        return templateStr;
    },
    initMkd: function () {
        // 新人机
        var me = this;
        me.insertScriptW(me.constant.TOUCHAPIMKD_URL, function () {
            window.passportTouch.use('mkd', {
                defaultCss: true
            }, function () {
                if (window.Pass && window.Pass.mkd && !me.regPassMkd) {
                    var PassMkd = window.Pass.mkd;
                    me.regPassMkd = new PassMkd({
                        maskModule: true,
                        // 产品线接入ak
                        ak: '1e3f2dd1c81f2075171a547893391274',
                        // 验证结果的回调函数
                        verifySuccessFn: function (data) {
                            // me.mkdData = data;
                            me._sendSMSVcode(null, null, {
                                success: function () {
                                    me.disableSmsButton();
                                }
                            }, null, data);
                            me.regPassMkd.removeMask();
                            // 可以拿到ds 和 tk 去问反作弊是否是人机。
                        }
                    });
                }
            });
        });
    },
    insertNoCaptchaScript: function () {
        // 人机
        var me = this;
        me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {
        });
    },
    insertScriptW: function (u, cb) {
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

    /**
     * 获取验证码 magic.passport.reg#getVerifyCode
     * @param {string} codeString 验证码字符串
     */
    getVerifyCode: function (codeString) {
        var me = this;
        if (me.config.verifyCode === false) {
            return;
        }
        me.getElement('verifyCodeImg').src = '';
        if (codeString && codeString.length) {
            me.getElement('verifyCodeImgWrapper').style.display = 'block';
            me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + codeString;
            me.getElement('codeString').value = codeString;
        } else {
            passport.data.getVerifyCodeStr({
                app: me.config.app ? me.config.app : ''
            })
            .success(function (rsp) {
                if (+rsp.errInfo.no === 0) {
                    me.getElement('verifyCodeImgWrapper').style.display = 'block';
                    me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.verifyStr;
                    me.getElement('codeString').value = rsp.data.verifyStr;
                }
            });
        }
        if (me.getElement('verifyCode')) {
            me.getElement('verifyCode').value = '';
        }
        if (me.getElement('verifyCode_clearbtn')) {
            me.getElement('verifyCode_clearbtn').style.display = 'none';
        }
    },
    /* eslint-disable fecs-camelcase */
    _loadWCss: function () {
        if (!passport.loadWCss) {
            passport.loadWCss = true;
            var css = '.pass-item-placeholder{color: #ABABAB;cursor:'
                + ' text;display: block;font-size: 12px;height: 20px;left:'
                + ' 163px;line-height: 20px;position: absolute;top: 5px;width: 160px;}'
                + '.pass-item-placeholder-inactive{color:#ccc;}';
            var linkNode = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(linkNode);
            try {
                linkNode.innerHTML = css;
            } catch (e) {
                try {
                    linkNode.styleSheet.cssText = css;
                } catch (e) {
                }
            }
        }
    },
    /* eslint-disable fecs-camelcase */
    _setPlaceholder: function () {
        var me = this;
        var type;
        var placeholder;
        var item;
        var inputCheckTimer;
        if (!me.config.isPhone && (!!me.config.email === false) && !me.config.regMerge) {
            return;
        }
        me._loadWCss();
        if (me.config.regMerge) {
            type = 'account';
        } else if (me.config.isPhone) {
            type = 'phone';
        } else if (!!me.config.email !== false) {
            type = 'email';
        }

        if (type) {
            placeholder = baidu('<span class="pass-item-placeholder" id="'
                + me.$getId('Placeholder') + '">'
                + (me.config.regMerge
                    ? (me.config.regMergeUserName
                        ? me.lang.regMergePlaceholder_username
                        : me.lang.regMergePlaceholder)
                    : me.lang.placeholder) + '</span>');
            item = baidu(me.getElement(type + 'Wrapper'));
            item.append(placeholder);

            function h() {
                me.getElement(type).focus();
            }

            placeholder.on('click', h);
            baidu(me.getElement(type)).on('focus', function (e) {
                placeholder.addClass('pass-item-placeholder-inactive');
                inputCheckTimer = setInterval(inputValueCheck, 1);

            });
            baidu(me.getElement(type)).on('blur', function (e) {
                placeholder.removeClass('pass-item-placeholder-inactive');
                clearInterval(inputCheckTimer);
                if (!me.getElement(type).value) {
                    placeholder.show();
                }
            });

            function inputValueCheck() {
                if (me.getElement(type).value.length) {
                    placeholder.hide();
                    clearInterval(inputCheckTimer);
                }
            }

            inputValueCheck();
        }
    },

    /**
     * render 渲染组件到页面 magic.passport.reg#render(id)
     * @param {string} id 渲染到的容器的 id
     */
    render: function (id) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }

        var target = baidu(me.getElement()),//baidu('#'+id),
            template = me._getTemplate();

        target.addClass(me.constant.CONTAINER_CLASS);
        target.append(baidu(template));
        /**
         * @description render 渲染组件到页面
         * @event
         * @grammar magic.passport.reg#render()
         * @name magic.passport.reg#render
         */
        var returnValue = me.fireEvent('render');
        if (!returnValue) {
            return;
        }

        me._initApi();
        me._setValidator();
        me._setEvent();
        me._initNocaptcha();
        if (me.foreignMobile) {
            me._getCountryCode();
            me._setForeignMobileEvent();
        }
        // me.getVerifyCode();
        if (me.config.displayMail) {
            me._setSuggestion();
        }
        me.suggestion && me.suggestion.hide();
        me._setPwdStrengthTip();
        me._setPlaceholder();
        me._accountFocus();
    },
    /* eslint-disable fecs-camelcase */
    _accountFocus: function () {
        var me = this;
        if (me.config.userName) {
            me.getElement('userName').focus();
        } else if (me.config.regMerge) {
            me.getElement('account').focus();
        } else if (me.config.isPhone) {
            me.getElement('phone').focus();
        }
    },
    /* eslint-disable fecs-camelcase */
    _bindShowPwdEvent: function () {
        var me = this;
        var ele = me.getElement('showpwdbtn_password');
        if (ele) {
            var showpwdEle = me.getElement('showpwd_password');
            baidu(ele).on('click', function () {
                if (showpwdEle.style.display !== 'none') {
                    showpwdEle.style.display = 'none';
                } else {
                    showpwdEle.style.display = 'block';
                }
            });
        }
    },
    /* eslint-disable fecs-camelcase */
    _showPasswordTip: function () {
        var me = this;
        var tpl = '<span class="pass-showpwd pass-showpwd-password" id="'
            + me.$getId('showpwd_password') + '" style="display:none">'
            + '<span class="pass-showpwd-arrow"><em class="arrowa">◆</em><em class="arrowb">◆</em></span>'
            + '<span class="pass-showpwd-content" id="'
            + me.$getId('showpwd_password_content') + '">' + me.getElement('password').value
            + '</span>' + '</span>';
        var tplBtn = '<span class="pass-showpwdbtn pass-showpwdbtn-password" id="'
            + me.$getId('showpwdbtn_password') + '"></span>';
        baidu(me.getElement('passwordWrapper')).append(tpl).append(tplBtn);
        me._bindShowPwdEvent();
    },

    // 行为验证码部分 ************************
    /* eslint-disable fecs-camelcase */
    _initNocaptcha: function () {
        var me = this;
        if (!me.config.nocaptcha || !window.NoCaptcha) {
            return;
        }
        var time = 60, timer = null;
        var countdown = function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (time <= 0) {
                baidu('#' + me.$getId('verifyCodeResend')).removeClass('pass-captcha-resend-disabled').text('重新获取验证码');
                var phoneEle = me.getElement(me.config.regMerge ? 'account' : 'phone');
                baidu('#' + me.$getId('phoneWrapper')).removeClass('pass-captcha-disabled');
                phoneEle.readOnly = false;
            } else {
                baidu('#' + me.$getId('verifyCodeResend')).text(time + 's 后重新发送');
                time--;
                timer = setTimeout(function () {
                    countdown();
                }, 1000);
            }
        };
        baidu('#' + me.$getId('verifyCodeResend')).on('click', function () {
            if (this.className.indexOf('pass-captcha-resend-disabled') === -1) {
                me._sendSMSVcode(null, null, {
                    success: function () {
                        me.nocaptcha.sendSMS();
                    }
                });
            }
        });
        me.nocaptcha = NoCaptcha.create({
            'dom': baidu('#' + me.$getId('nocaptchaWrapper')),
            'hideDisplay': true,
            'lang': {
                'SLIDE_TIP': '拖动右侧图片完成拼图以获取验证码'
            },
            'success': function (e, validateData) {
                e.cancelTip = true;
                me._sendSMSVcode(null, null, {
                    success: function () {
                        me.nocaptcha.tip('验证码已发送到你的手机', true);
                        setTimeout(function () {
                            me.nocaptcha.hide();
                        }, 2000);
                        me.nocaptcha.sendSMS();
                    },
                    error: function (msg) {
                        var regExp = /<a.*>(.*)<\/a>/ig;
                        var arr = msg.match(regExp);
                        var newMsg = msg.replace(arr, '');
                        me.nocaptcha.tip(newMsg, false);
                        setTimeout(function () {
                            me.nocaptcha.hide();
                            me.nocaptcha.refresh();
                        }, 2000);
                    },
                    validate: function () {
                        me.nocaptcha.hide();
                        me.nocaptcha.refresh();
                    }
                }, validateData);
            }
        });
        me.nocaptcha.sendSMS = function () {
            var phoneEle = me.getElement(me.config.regMerge ? 'account' : 'phone');
            me.nocaptcha.phone = phoneEle.value;
            var resendBtn = baidu('#' + me.$getId('verifyCodeResend'));
            resendBtn.addClass('pass-captcha-resend-disabled').text('');
            baidu('#' + me.$getId('verifyCodeSendWrapper')).removeClass('pass-captcha-resend-hide');
            time = 60;
            countdown();
            baidu('#' + me.$getId('phoneWrapper')).addClass('pass-captcha-disabled');
            phoneEle.readOnly = true;
        };
    },
    /* eslint-disable fecs-camelcase */
    _showNocaptcha: function (show, ele) {
        var me = this;
        if (me.config.nocaptcha && me.nocaptcha) {
            if (show) {
                if (me.nocaptcha.phone) {
                    if (me.nocaptcha.phone !== ele.value) {
                        me.nocaptcha.refresh();
                        me.nocaptcha.show();
                        baidu('#' + me.$getId('verifyCodeSendWrapper')).addClass('pass-captcha-resend-hide');
                    }
                } else {
                    me.nocaptcha.init ? me.nocaptcha.show() : me.nocaptcha.sendSMS();
                }
            } else {
                me.nocaptcha.hide();
            }
        }
    },
    /* eslint-disable fecs-camelcase */
    _initApi: function (callbacks) {
        var me = this;
        me.initTime = new Date().getTime();
        me.unbindRegConfirm = null;
        me.changeRegConfirm = null;
        me.confirmRegVerifyWidget = null;
        passport.data.getApiInfo({
            apiType: me.config.isPhone ? 'regPhone' : 'reg',
            gid: me.guideRandom || '',
            app: me.config.app ? me.config.app : ''
        })
        .success(function (rsp) {
            /**
             * @description 获取api初始化信息
             * @name magic.passport#getApiInfo
             * @event
             * @grammar magic.passport.reg#getApiInfo(e)
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
                var codeString = rsp.data.codeString;

                // data: setContext
                passport.data.setContext({
                    token: token
                });

                // set captcha
                if (codeString && codeString.length) {
                    me.getVerifyCode(codeString);
                }

                // clearbtn
                if (me.config.regMerge) {
                    me.config.hasPlaceholder && me._getPlaceholder([{
                        label: 'account',
                        placeholder: (me.config.regMergeUserName
                            ? 'regMergePlaceholder_username'
                            : 'regMergePlaceholder')
                    }, {
                        label: 'password',
                        placeholder: 'passwordPlaceholder'
                    }, {
                        label: 'verifyCode',
                        placeholder: 'verifyCodePlaceholder'
                    }, {
                        label: 'userName',
                        placeholder: 'userNamePlaceholder'
                    }]);

                    baidu(me.getElement('password_clearbtn')).on('mousedown', function () {
                        baidu(me.getElement('pwd_checklist_len'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');

                        baidu(me.getElement('pwd_checklist_cha'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');

                        baidu(me.getElement('pwd_checklist_spa'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');
                    });
                } else if (me.config.isPhone) {
                    me.config.hasPlaceholder && me._getPlaceholder([{
                        label: 'phone',
                        placeholder: 'placeholder'
                    }, {
                        label: 'password',
                        placeholder: 'passwordPlaceholder'
                    }, {
                        label: 'verifyCode',
                        placeholder: 'verifyCodePlaceholder'
                    }, {
                        label: 'userName',
                        placeholder: 'userNamePlaceholder'
                    }]);

                    baidu(me.getElement('password_clearbtn')).on('mousedown', function () {
                        var baiduLen = baidu(me.getElement('pwd_checklist_len'));
                        baiduLen.removeClass('pwd-checklist-item-success');
                        baiduLen.removeClass('pwd-checklist-item-error');
                        var baiduCha = baidu(me.getElement('pwd_checklist_cha'));
                        baiduCha.removeClass('pwd-checklist-item-success');
                        baiduCha.removeClass('pwd-checklist-item-error');
                        var baiduSpa = baidu(me.getElement('pwd_checklist_spa'));
                        baiduSpa.removeClass('pwd-checklist-item-success');
                        baiduSpa.removeClass('pwd-checklist-item-error');
                    });
                }
                callbacks && callbacks.success(rsp);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _setSuggestion: function () {
        var me = this;
        /* eslint-disable */
        if (!me.getElement(me.config.regMerge ? 'account' : 'email') || !magic.setup.suggestion) {
            return;
        }
        var options = {
            getData: function (key) {
                var list = [];
                var buildIn = me.mainEmailSP;
                var name = (name === key.match(/(.*)@/)) ? name[1] : key;
                var sp = (sp === key.match(/\@(.*)$/)) ? sp[1] : false;
                baidu.each(buildIn, function (index, value) {
                    if (sp && ~value.indexOf(sp)) {
                        // service provider typed and it's in the build-in list
                        list.push(name + '@' + value);
                    } else if (!sp) {
                        // service provider not typed
                        list.push(name + '@' + value);
                    }
                    // else: service provider typed but it's not in the build-in list
                });
                this.receiveData(key, list);
            }
        };
        /* eslint-disable */
        me.suggestion = magic.setup.suggestion(me.$getId(me.config.regMerge ? 'account' : 'email'), options);

        if (me.config.regMerge) {
            me.suggestion.on('beforeshow', function (evt) {
                if (me.getElement('account') && me.getElement('account').value.indexOf('@') === -1) {
                    evt.returnValue = false;
                }
            });
        }

        me.suggestion.on('confirm', function () {
            if (me.getElement('password')) {
                me.getElement('password').focus();
            }
            if (me.config.regMerge) {
                return;
            }
            me.validate('email');

        });
        me.suggestion.on('highlight', function () {
            me.suggestionHighlight = true;
        });
        me.suggestion.on('clearhighlight', function () {
            me.suggestionHighlight = false;
        });
    },
    /* eslint-disable fecs-camelcase */
    _setValidator: function () {
        // 生成正则，自定义校验规则
        // 主流邮箱
        var me = this;
        var mainEmailSP = me.mainEmailSP = [
            'http://passport.baidu.com/passApi/js/modules/qq.com',
            'http://passport.baidu.com/passApi/js/modules/163.com',
            'http://passport.baidu.com/passApi/js/modules/126.com',
            'http://passport.baidu.com/passApi/js/modules/sohu.com',
            'http://passport.baidu.com/passApi/js/modules/sina.com',
            'http://passport.baidu.com/passApi/js/modules/21cn.com',
            'http://passport.baidu.com/passApi/js/modules/vip.qq.com',
            'http://passport.baidu.com/passApi/js/modules/yeah.net']
        ;
        var mainEmailSPRegStr = mainEmailSP.join(')|(\\@').replace(/\./g, '\\.');
        mainEmailSPRegStr = '((\\@' + mainEmailSPRegStr + '))$';
        mainEmailSPRegStr = '^([a-zA-Z0-9_\\.\\-\\+])+' + mainEmailSPRegStr;
        // 邮箱长度
        me._validator.addRule('mailLength', function (ele) {
            return String(ele.value).length <= 60;
        });
        me._validator.addMsg('mailLength', me.lang.mailLengthError);
        // me._validator.addRule('mainEmail', mainEmailSPRegStr);
        // me._validator.addMsg('mainEmail', me.lang.mainEmailError);

        // 密码匹配
        me._validator.addRule('matchedPwd', function (ele) {
            return ele.value === this.getElement('password').value;
        });
        me._validator.addMsg('matchedPwd', me.lang.matchPwdError);

        /*检测gmail邮箱
		me._validator.addRule('gmailEmail',function(ele){
			if(/^([^.]*\.){2}.*@gmail\.com$/.test(ele.value)){
				return false
			}
			return true;
		});
		me._validator.addMsg('gmailEmail', me.lang.matchGmailError);*/

        // 限制gmail、hotmail、baidu邮箱
        me._validator.addRule('emailLimit', function (ele) {
            if (/([a-zA-Z0-9_\.\-\+])+\@(baidu|gmail|hotmail)\.com$/.test(ele.value)) {
                return false;
            }
            return true;
        });
        me._validator.addMsg('emailLimit', me.lang.emailLimitError);

        // 密码字符
        me._validator.addRule('pwdChar', function (ele) {
            return /^([0-9a-zA-Z\_`!~@#$%^*+=,.?;'":)(}{/\\\|<>&\[\-]|\])+$/.test(ele.value);
        });
        me._validator.addMsg('pwdChar', me.lang.pwdCharError);

        // 密码长度
        me._validator.addRule('pwdLength', function (ele) {
            var len = ele.value.length;
            return (len <= 14 && len >= 8);
        });
        me._validator.addMsg('pwdLength', me.lang.pwdLengthError);

        me._validator.addRule('passwordStrength', function (ele) {
            var len = ele.value.length;
            return len > 0;
        });
        me._validator.addMsg('passwordStrength', me.setPwdCheckStren(3));

        // 协议是否选中
        me._validator.addRule('checkedLicense', function (ele) {
            return ele.checked;
        });
        me._validator.addMsg('checkedLicense', me.lang.checkLicenseError);

        // 用户名
        me._validator.addRule('userNameLength', function (ele) {
            // ByteLength<14 && 不全是数字
            var len = baidu.string.getByteLength(ele.value);
            return len <= 14;
        });
        me._validator.addMsg('userNameLength', me.lang.userNameRulesError);

        me._validator.addRule('userNameNumber', function (ele) {
            // ByteLength<14 && 不全是数字
            var len = baidu.string.getByteLength(ele.value);
            return !/^\d+$/.test(ele.value);
        });
        me._validator.addMsg('userNameNumber', me.lang.userNameNumberError);

        // 手机/邮箱
        me._validator.addRule('accountMerge', function (ele) {
            var value = ele.value;
            if (/^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|(1[3456789]\d{9})$/.test(value)) {
                return true;
            }
            return false;
        });
        me._validator.addMsg('accountMerge', me.lang.accountMergeError);

        me.validateRules = {
            'account': {
                rules: ['required'],
                desc: me.lang.account
            },
            'email': {
                rules: ['required', 'mailLength', 'email', 'emailLimit'],
                asyncRule: me._asyncValidate.checkEmail,
                desc: me.lang.email
            },
            'phone': {
                rules: ['required', 'phone'],
                asyncRule: me._asyncValidate.phoneCheck,
                desc: me.lang.phoneNum
            },
            'userName': {
                rules: ['required', 'userNameLength', 'userNameNumber'],
                asyncRule: me._asyncValidate.checkUserName,
                desc: me.lang.userName
            },
            'password': {
                rules: !me.config.hasPasswordcheck
                    ? (me.config.isLowpwdCheck ? ['required'] : ['required', 'pwdLength', 'pwdChar'])
                    : ['passwordStrength'],
                asyncRule: me.config.isLowpwdCheck ? null : me._asyncValidate.checkPassword,
                desc: me.lang.password
            },
            'verifyPass': {
                rules: ['required', 'matchedPwd'],
                desc: me.lang.confirmPassword
            },
            'verifyCode': {
                rules: ['required'],
                desc: me.lang.captcha
            },
            'smsCode': {
                rules: ['required'],
                desc: me.lang.SMSKey
            },
            'isAgree': {
                rules: ['checkedLicense']
            }
        };
        me._validator.init(me, me.validateRules);
        if (me.config.regMerge) {
            me._validator.builtInMsg['email'] = me.lang.emailEmptyError;
            me._validator.builtInMsg['phone'] = me.lang.phoneEmptyError;

        }
    },
    /* eslint-disable fecs-camelcase */
    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        ele.addClass(me.constant.ERROR_CLASS);
        baidu(me.getElement(info.field + 'Succ')).hide();
        baidu(me.getElement(info.field + 'Error')).show().get(0).innerHTML = info.msg;
        if (me.config.regMerge && info.field === 'verifyCode') {
            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
        }
        // hide tip on error , except password!
        if (info.field !== 'password' && !me.config.hasPasswordcheck) {
            me._hideTip(info.field);
        } else if (!me.config.hasPasswordcheck && !me.config.isLowpwdCheck) {
            me.setPwdStrength(-1);
        }
        opt && opt.callback && opt.callback();
    },
    /* eslint-disable fecs-camelcase */
    _validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        if (!(me.config.regMerge && info.field === 'password')) {
            baidu(me.getElement(info.field + 'Error')).hide();
            baidu(me.getElement(info.field + 'Succ')).show();
            ele.removeClass(me.constant.ERROR_CLASS);
        }
        opt && opt.callback && opt.callback();
    },
    setPwdCheckStren: function (level, rsp, callbacks) {
        var me = this;
        var ele = baidu(me.getElement('password'));
        var errEle = baidu(me.getElement('passwordError'));
        var levelMap = {
            '3': {
                text: me.lang.nopwd,
                msg: me.lang.nopwdMsg,
                className: 'nopwd'
            },
            '2': {
                text: me.lang.weak,
                msg: me.lang.weakMsg,
                className: 'weak'
            },
            '1': {
                text: me.lang.middle,
                msg: me.lang.middleMsg,
                className: 'middle'
            },
            '0': {
                text: me.lang.strong,
                msg: me.lang.strongMsg,
                className: 'strong'
            },
            '-1': {
                text: me.lang.weak,
                msg: me.lang.weakMsg,
                className: 'weak'
            },
            '5': {
                text: me.lang.notsafe,
                msg: me.lang.notsafeMsg,
                className: 'notsafe'
            }
        };
        var tpl = '<span class="pwd-strength ' + levelMap[level].className + '">'
            + '<span class="pwd-strength-sum">'
            + '<em class="pwd-strength-bg">&nbsp;</em>'
            + '<em class="pwd-strength-sco">&nbsp;</em>'
            + '<span class="pwd-strength-title">' + levelMap[level].text + '</span>'
            + '</span>' + '<span class="pwd-strength-detail">' + levelMap[level].msg + '</span>'
            + '</span>';

        errEle.show().get(0).innerHTML = tpl;
        if (+level === 3) {
            errEle.hide();
        }
        if (+level === 2 || +level === 5) {
            ele.addClass(me.constant.ERROR_CLASS);
            me.getElement('passwordSucc').style.display = 'none';
        } else {
            callbacks && callbacks.success(rsp);
        }
        return tpl;
    },
    passwordCheckList: function (field) {
        var me = this;
        var $ele = baidu(me.getElement(field));
        var $passwordTip = baidu(me.getElement('passwordTip'));
        var tipText = baidu(me.getElement(field + 'tipText'));
        var lenEle = baidu(me.getElement('pwd_checklist_len'));
        var chaEle = baidu(me.getElement('pwd_checklist_cha'));
        var spaEle = baidu(me.getElement('pwd_checklist_spa'));
        $passwordTip.show();
        me.password = {};
        me.password.err = 0;
        if (!$ele.val().length) {
            lenEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            chaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            spaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            return;
        }

        if ($ele.val().length > 14 || $ele.val().length < 8) {
            me.password.err++;
            lenEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        } else {
            lenEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        }

        if ($ele.val().indexOf(' ') !== -1) {
            me.password.err++;
            spaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        } else {
            spaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        }

        if ($ele.val().length) {
            chaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        } else {
            me.password.err++;
            chaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        }
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
    /**
     * @description _initCountryCode 初始化国家区域代码已经国家名称
     * @function
     * @name
     * @grammar
     * @param {object} domField 插入海外手机号dom
     */
    /* eslint-disable fecs-camelcase */
    _initCountryCode: function (domField) {
        var me = this;
        var countryTempStr = '<li class="pass-item-country">'
            + '<span class="pass-country-code" data-countryCode="">+86</span>大陆地区</li>';
        var data = me.countryCodeList || {};
        var countryLen = data.length;
        if (countryLen <= 0) {
            return;
        }
        for (var i = 0; i < countryLen; i++) {
            countryTempStr += '<li class="pass-item-country"><span class="pass-country-code" data-countryCode='
                + data[i].code + '>+' + data[i].code.substring(2)
                + '</span>' + data[i].name + '</li>';
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
        var me = this;
        var data = {
            apiver: 'v3',
            subpro: me.config.subpro
        };
        passport.data.jsonp('https://passport.baidu.com/v2/?securitygetcountrycode', data).success(function (rsp) {
            if (rsp.data.country.length > 0) {
                me.countryCodeList = rsp.data.country;
                if (me.getElement('foreignCountryList')) {
                    me._initCountryCode(me.getElement('foreignCountryList'));
                }
                callback && callback();
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _selectCountryList: function () {
        var me = this;
        var countryList = me.getElement('foreignCountryList');
        var labelCode = me.getElement('foreignMobileLabel');
        if (+labelCode.length === 0) {
            return;
        }
        baidu(countryList).on('click', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(labelCode).html(baidu(target).find('span.pass-country-code').eq(0).html());
                var value = baidu(target).find('span.pass-country-code').eq(0).attr('data-countryCode');
                baidu(labelCode).attr('data-countryCode', value);
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(labelCode).html(baidu(target).html());
                baidu(labelCode).attr('data-countryCode', baidu(target).attr('data-countryCode'));
            }
            me.$hide(countryList);
            baidu(labelCode).removeClass('pass-label-code-up');
            if (me.getElement('phone') && me.getElement('phone').value) {
                if (me.getElement('foreignMobileLabel')
                    && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
                    // 海外手机号校验，非空+数字
                    var ele = baidu(me.getElement('phone'))[0];
                    me._validator.addRule('foreignmobile', function (ele) {
                        return /^(\d)*$/.test(ele.value);
                    });
                    me._validator.addMsg('foreignmobile', me.lang.foreignMobileError);
                    me._validator.confStorage[me.$getId()]['phone'] = {
                        rules: ['required', 'foreignmobile'],
                        asyncRule: me._asyncValidate.phoneCheck,
                        desc: me.lang.phoneNum
                    };
                } else {
                    me._validator.confStorage[me.$getId()]['phone'] = {
                        rules: ['required', 'phone'],
                        asyncRule: me._asyncValidate.phoneCheck,
                        desc: me.lang.phoneNum
                    };
                }
                me.validate('phone');
            }
            evt.preventDefault();
        });
        baidu(countryList).on('mouseover', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(countryList).find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).addClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(countryList).find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).parent('li.pass-item-country').addClass('pass-item-country-hover');
            }
        });
        baidu(countryList).on('mouseout', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(target).removeClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(target).parent('li.pass-item-country').removeClass('pass-item-country-hover');
            }
        });
        // 点击其他区域收起国家代码list
        baidu('html').on('click', function (evt) {
            var target = evt.target;
            if (!labelCode) {
                return false;
            }
            // 需要判断多个点击label的id
            if ((baidu(target).attr('id') !== baidu(me.getElement('foreignMobileLabel')).attr('id'))) {
                setTimeout(function () {
                    me.$hide(countryList);
                    baidu(labelCode).removeClass('pass-label-code-up');
                }, 200);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _setForeignMobileEvent: function () {
        var me = this;
        if (me.getElement('foreignMobileLabel')) {
            baidu(me.getElement('foreignMobileLabel')).on('click', function (evt) {
                var countryList = me.getElement('foreignCountryList');
                if (countryList && countryList.style.display !== 'block') {
                    me.$show(countryList);
                    baidu(me.getElement('foreignMobileLabel')).addClass('pass-label-code-up');
                } else if (countryList) {
                    me.$hide(countryList);
                    baidu(me.getElement('foreignMobileLabel')).removeClass('pass-label-code-up');
                }
                me._selectCountryList();
                evt.preventDefault();
            });
        }
    },

    /**
     * 设置密码强度等级
     * @param {string} level 密码强度等级
     */
    setPwdStrength: function (level) {
        var me = this;
        var levelMap = {
            '2': {
                text: me.lang.weak,
                className: 'weak'
            },
            '1': {
                text: me.lang.middle,
                className: 'middle'
            },
            '0': {
                text: me.lang.strong,
                className: 'strong'
            },
            '-1': {
                text: '',
                className: ''
            }
        };
        me.getElement('strengthTipText').innerHTML = levelMap[level].text;
        baidu(me.getElement('strengthTipPic'))
        .removeClass('weak middle strong')
        .addClass(levelMap[level].className);
    },
    /* eslint-disable fecs-camelcase */
    _setPwdStrengthTip: function () {
        var me = this;
        var strengthTip = me.config.hasPasswordcheck
            ? baidu(me.getElement('pwdChecklist'))
            : baidu(me.getElement('strengthTip'));
        var passwordTip = baidu(me.getElement('passwordTipText'));
        if (me.config.isLowpwdCheck) {
            return;
        }
        if (!strengthTip.length && !me.config.hasPasswordcheck) {
            strengthTip = baidu(me._getIrregularField('strengthTip'));
            passwordTip.append(strengthTip);
        } else {
            strengthTip = baidu(me._getIrregularField('pwdChecklist'));
            passwordTip.append(strengthTip);
        }
    },
    /**
     * @description 重置密码强度等级提示的位置, 主要用于tip位置计算完成后，表单位置发生变化，如：suggName 展现
     * @function
     * @private
     */
    /* eslint-disable fecs-camelcase */
    _resetPwdStrengthTipPos: function () {
        var me = this;
        me._hideTip('password');
        me._showTip('password');
    },
    /* eslint-disable fecs-camelcase */
    _showTip: function (field) {
        var me = this;
        var tipContainer = baidu(me.getElement('tipContainer'));
        var tip = baidu(me.getElement('tip'));
        var ele = baidu(me.getElement(field));
        var tipText = me.getElement(field + 'TipText');
        var succEle = baidu(me.getElement(field + 'Succ'));
        var errEle = baidu(me.getElement(field + 'Error'));
        if (me.config.hasPasswordcheck && field === 'password') {
            me.getElement('passwordTip').style.display = 'block';
            tipContainer.empty();
            me.getElement('passwordError').style.display = 'none';
        } else {
            if (!tipText || !tipText.innerHTML.length) {
                return false;
            }
            tipContainer.empty().append(tipText);

            errEle.hide();
            succEle.hide();
        }

        // 420 = the most with input's (offset().left + outerWidth() + 5)
        tip.css({
            left: 420,
            top: ele.offset().top - baidu(me.getElement()).offset().top
        });
        /**
         * @description 气泡提示显示
         * @name magic.passport.reg#tipShow
         * @event
         * @grammar magic.passport.reg#tipShow(e)
         * @param {Object} e 事件参数
         * @param {TangramDOM} e.tip 气泡提示对象
         * @param {TangramDOM} e.ele 触发气泡提示显示的表单域
         */
        var returnValue = me.fireEvent('tipShow', {
            tip: tip
        });
        if (!returnValue) {
            return;
        }

        tip.show();
    },
    /* eslint-disable fecs-camelcase */
    _hideTip: function (field) {
        var me = this;
        if (me.config.hasPasswordcheck && field === 'password' && me.password && +me.password.err !== 0) {
            return;
        } else if (me.config.hasPasswordcheck && field === 'password') {
            me.getElement('passwordTip').style.display = 'none';
        } else {
            baidu(me.getElement(field + 'Tip')).append(me.getElement(field + 'TipText'));
        }
        /**
         * @description 气泡提示隐藏
         * @name magic.passport.reg#tipHide
         * @grammar magic.passport.reg#tipHide()
         * @event
         */
        var returnValue = me.fireEvent('tipHide');
        if (!returnValue) {
            return;
        }

        baidu(me.getElement('tip')).hide();
    },
    /* eslint-disable fecs-camelcase */
    _showSuggestNames: function (suggestNames, key, userType) {
        var me = this;
        // 防止频繁 blur 使推荐列表被更新
        if (key === me.suggestListKey) {
            return;
        }
        // 生成容器
        if (!baidu(me.getElement('suggestNameWrapper')).length) {
            baidu(me._getIrregularField('suggestName'))
            .insertAfter(me.getElement(me.config.regMergeUserName ? 'accountWrapper' : 'userNameWrapper'));
        }
        me.suggestListKey = key;
        var suggestNameWrapper = baidu(me.getElement('suggestNameWrapper'));
        if (!suggestNames || !suggestNames.length) {
            suggestNameWrapper.empty();
        } else {
            suggestNameWrapper.empty();
            for (var i = 0, j = suggestNames.length; i < j; i++) {
                suggestNameWrapper.append('<p class="pass-suggest-item">'
                    + '<label name="suggestName"><input name="suggestName" id="'
                    + me.$getId('suggestName__' + i) + '" type="radio" class="pass-suggest-item-radio" value="'
                    + suggestNames[i] + '" />' + suggestNames[i]
                    + '</label></p>');
            }

            // set suggestType
            me.getElement('suggestType').value = userType;
        }

        // fix tip's position
        if (me.getElement('tip').style.display === 'block') {
            me._resetPwdStrengthTipPos();
        }
    },
    disableSmsButton: function () {
        var me = this;
        var ele = me.getElement('verifyCodeSend');
        // error = me.getElement(me.config.regMerge ? 'verifyCodeError' : 'verifyCodeSendError'),
        var error = me.getElement('verifyCodeError');
        var tip = me.getElement('verifyCodeSendTip');
        var value = ele.value;
        var timmer;
        var counter = 60;
        baidu(ele).addClass(me.constant.DISABLED_CLASS);
        ele.disabled = true;
        if (me.unbindRegConfirm && me.unbindRegConfirm.getElement('confirm_cancel')) {
            baidu(me.unbindRegConfirm.getElement('confirm_cancel')).addClass('pass-confirm-btn-disabled');
            me.unbindRegConfirm.getElement('confirm_cancel').disabled = true;
        }
        if (error) {
            error.style.display = 'none';
        }
        if (tip) {
            if (me.config.isVoiceSms) {
                tip.innerHTML = me.lang.VoiceKeySendTip;
            } else {
                tip.innerHTML = me.lang.SMSKeySendTip;
            }
            if (me.config.regMerge) {
                baidu(tip).show();
            } else if (me.config.isPhone) {
                baidu(tip).show();
            }
        }

        function countdown() {
            if (--counter === 0) {
                ele.value = value;
                baidu(ele).removeClass(me.constant.DISABLED_CLASS);
                ele.disabled = false;
                if (me.unbindRegConfirm && me.unbindRegConfirm.getElement('confirm_cancel')) {
                    baidu(me.unbindRegConfirm.getElement('confirm_cancel')).removeClass('pass-confirm-btn-disabled');
                    me.unbindRegConfirm.getElement('confirm_cancel').disabled = false;
                }
                if (tip) {
                    tip.innerHTML = '';
                    if (me.config.regMerge) {
                        baidu(tip).hide();
                    } else if (me.config.isPhone) {
                        baidu(tip).hide();
                    }
                }
                return;
            }
            var fn = arguments.callee;
            ele.value = me.config.regMerge
                ? (me.lang.SMSKeyResendTipMerge + '(' + counter + ')')
                : (counter + me.lang.SMSKeyResendTip);
            timmer = setTimeout(function () {
                fn();
            }, 1000);
        }

        countdown();
    },

    /* eslint-disable fecs-camelcase */
    _asyncValidate: {
        // 异步校验，由validator 在同步校验通过后直接调用
        checkEmail: function (callbacks) {
            var me = this;
            var ele = me.getElement(me.config.regMerge ? 'account' : 'email');
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
            /* globals passport */
            passport.data.checkMail({
                email: ele.value,
                moonshad: cryptdata
            })
            .success(function (rsp) {
                /**
                 * @description 邮箱检查
                 * @name magic.passport.reg#emailCheck
                 * @event
                 * @grammar magic.passport.reg#emailCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('emailCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    callbacks && callbacks.success(rsp);
                } else {
                    if (rsp.errInfo.msg.indexOf('#{') > 0) {
                        var account = me.getElement('account')
                            ? me.getElement('account').value
                            : me.getElement('email').value;
                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                            urldata: '&account=' + account + '&tpl='
                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                        });
                    }
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                }
            });
        },
        checkPassword: function (callbacks) {
            var me = this;
            var ele = me.getElement('password');
            var userName = '';
            var mobile = '';

            if (me.config.hasPasswordcheck && me.password && +me.password.err !== 0) {
                return;
            } else if (me.config.hasPasswordcheck) {
                me._hideTip('password');
            }

            if (me.getElement('userName')) {
                userName = me.getElement('userName').value || '';
            }

            if (me.getElement('phone')) {
                mobile = me.getElement('phone').value || '';
            }
            var rsaPwd = ele.value || '';
            if (me.RSA && me.rsakey) {
                var passwordVal = ele.value;
                if (passwordVal.length < 128 && !me.config.safeFlag) {
                    rsaPwd = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
                }
            }

            passport.data.checkPassword({
                password: rsaPwd,
                gid: me.guideRandom || '',
                rsakey: me.rsakey,
                crypttype: 12,
                userName: userName,
                mobile: mobile
            })
            .success(function (rsp) {
                /**
                 * @description 密码强度检查
                 * @name magic.passport.reg#passwordStrengthCheck
                 * @event
                 * @grammar magic.passport.reg#passwordStrengthCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('passwordStrengthCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    var level = rsp.data.pwdWeak;
                    rsp.msg = me.lang.weakPwdError;
                    if (me.config.hasPasswordcheck) {
                        me.setPwdCheckStren(level, rsp, callbacks);
                    } else {
                        me.setPwdStrength(level);
                        if (+level === 2) {
                            // rsp.msg = rsp.errInfo.msg;
                            callbacks && callbacks.error(rsp);
                        } else {
                            // success
                            callbacks && callbacks.success(rsp);
                        }
                    }
                } else if (+rsp.errInfo.no === 4) {
                    var level = rsp.data.pwdWeak;
                    rsp.msg = me.lang.weakPwdError;
                    me.setPwdCheckStren(level, rsp, callbacks);
                }
            });
        },
        checkUserName: function (callbacks) {
            var me = this;
            var ele = me.getElement(me.config.regMergeUserName ? 'account' : 'userName');

            passport.data.checkUserName({
                gid: me.guideRandom || '',
                userName: ele.value
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
                var returnValue = me.fireEvent('userNameCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    if (+rsp.data.userExsit === 1) {
                        // fail
                        rsp.msg = me.lang.userNameExistsError;
                        callbacks && callbacks.error(rsp);
                        me._showSuggestNames(rsp.data.suggNames, ele.value, rsp.data.userType);
                    } else {
                        me._showSuggestNames([], ele.value, rsp.data.userType);
                        // success
                        callbacks && callbacks.success(rsp);
                    }
                } else {
                    me._showSuggestNames([], ele.value, rsp.data.userType);
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                }
            });
        },
        phoneCheck: function (callbacks) {
            var me = this;
            var ele = this.getElement(me.config.regMerge ? 'account' : 'phone');
            me.AccountExchangeFlag = me.getElement('exchange').value;
            /* globals hex_md5 */
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
            passport.data.checkPhone({
                phone: ele.value,
                moonshad: cryptdata,
                countrycode: me.getElement('foreignMobileLabel') ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '') : '',
                gid: me.guideRandom || '',
                exchange: me.AccountExchangeFlag,
                isexchangeable: me.config.isexchangeable,
                action: 'reg'
            })
            .success(function (rsp) {
                /**
                 * @description 手机号检查
                 * @name magic.passport.reg#phoneCheck
                 * @event
                 * @grammar magic.passport.reg#phoneCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('phoneCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (rsp.data.isCheatUser === '1') {
                    me.config.isVoiceSms = parseInt(rsp.data.isCheatUser, 10) || 0;
                    me.getElement('verifyCodeSend').value = '获取语音验证码';
                } else {
                    me.config.isVoiceSms = 0;
                    me.getElement('verifyCodeSend').value = '获取短信验证码';
                }
                if (+rsp.errInfo.no === 0) {
                    callbacks && callbacks.success(rsp);
                    if (me.$multiTip) {
                        me.$multiTip.hide();
                    }
                } else if (rsp.errInfo.no + '' === '130020') {
                    // TODO 出取消&登录提示  changeRegConfirm作用域问题处理。
                    var newRegAccount = (!me.config.regMerge && me.config.isPhone) ? '手机号' : '手机号或邮箱';
                    var countryCode = '';
                    if (me.getElement('foreignMobileLabel')) {
                        countryCode = baidu(me.getElement('foreignMobileLabel')).html();
                    }
                    if (me.unbindRegConfirm) {
                        me.unbindRegConfirm.hide();
                    }
                    if (me.changeRegConfirm) {
                        baidu(me.getElement('changeRegPhone')).html(countryCode + ele.value);
                        me.changeRegConfirm.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                            me.changeRegConfirm = passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                width: 390,
                                apiOpt: {
                                    Cancel: '取消',
                                    Continue: '登录',
                                    contentHTML: '<div class="pass-confirmContent-wrapper">'
                                    + '<div class="pass-confirmContent-msg">该手机已注册，可以通过密码或短信快捷登录。</div>'
                                    + '</div>'
                                },
                                onConfirmClose: function (evt) {
                                    me.changeRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmCancel: function (evt) {
                                    me.changeRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmContinue: function (evt) {
                                    var account = ele.value;
                                    var url = 'http://passport.baidu.com/v2/?login&account='
                                        + account + '&tpl=' + me.config.product
                                        + '&u=' + (me.config.retu || me.config.u);
                                    me.changeRegConfirm.hide();
                                    if (window.location) {
                                        window.location.href = url;
                                    } else {
                                        document.location.href = url;
                                    }
                                }
                            });
                            me.changeRegConfirm.show();
                        });
                    }
                } else if (rsp.errInfo.no + '' === '400005' || rsp.errInfo.no + '' === '400001' || rsp.errInfo.no + '' === '400003') {
                    // TODO 出解绑&登录提示
                    if (me.changeRegConfirm) {
                        me.changeRegConfirm.hide();
                    }
                    var countryCode = '';
                    if (me.getElement('foreignMobileLabel')) {
                        countryCode = baidu(me.getElement('foreignMobileLabel')).html();
                    }
                    if (me.unbindRegConfirm) {
                        baidu(me.getElement('unbindRegPhone')).html(countryCode + ele.value);
                        me.unbindRegConfirm.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                            me.unbindRegConfirm = passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                width: 390,
                                apiOpt: {
                                    Cancel: '取消',
                                    Continue: '登录',
                                    contentHTML: '<div class="pass-confirmContent-wrapper">'
                                    + '<div class="pass-confirmContent-msg">该手机已注册，可以通过密码或短信快捷登录。</div>'
                                    + '</div>'
                                },
                                onConfirmClose: function (evt) {
                                    me.unbindRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmCancel: function (evt) {
                                    me.unbindRegConfirm.hide();
                                    // me.getElement('exchange').value = 1 ;
                                    // me.getElement('password').focus();
                                    // me.getElement('verifyCodeSend').click();
                                    // me._sendSMSVcode(null, null);
                                    me.getElement('phone').value = '';
                                    me.getElement('phone').focus();
                                },
                                onConfirmContinue: function (evt) {
                                    var account = ele.value;
                                    var url = 'http://passport.baidu.com/v2/?login&account='
                                        + account + '&tpl=' + me.config.product
                                        + '&u=' + (me.config.retu || me.config.u);
                                    me.unbindRegConfirm.hide();
                                    if (window.location) {
                                        window.location.href = url;
                                    } else {
                                        document.location.href = url;
                                    }
                                }
                            });
                            me.unbindRegConfirm.show();
                        });
                    }
                } else {
                    if (rsp.errInfo.msg.indexOf('#{') > 0) {
                        var account = me.getElement('account')
                            ? me.getElement('account').value
                            : me.getElement('phone').value;
                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                            urldata: '&account=' + account + '&tpl='
                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                        });
                    }
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                    /*
					if(rsp.errInfo.no == '130020'){
						if(me.$multiTip){
							me.$multiTip.show()
						}else{
							me.$multiTip = baidu(me._getIrregularField('multiTip'));
							var phonePosition = baidu(ele).offset();
							me.$multiTip.css({
								top:phonePosition.top-35+'px',
								left:phonePosition.left+'px'
							})
							baidu(document.body).append(me.$multiTip[0])
						}
					}else{
						if(me.$multiTip){
							mu.$multiTip.hide()
						}
					}*/
                }
            });
        }
    },
    cutVerifyCode: function (type) {
        var me = this;
        var element = me.getElement('verifyCode_placeholder');
        var element1 = me.getElement('verifyCodeTipText');
        if (type === 'phone') {
            baidu(me.getElement('verifyCodeImg')).parent().hide();
            baidu(me.getElement('verifyCodeChange')).hide();
            baidu(me.getElement('verifyCodeSend')).show();
            if (element1) {
                element1.innerHTML = me.lang.SMSKeyTip;
            }
            if (element) {
                element.innerHTML = me.lang.smsVerifyCode;
            }
        } else {
            baidu(me.getElement('verifyCodeImg')).parent().show();
            baidu(me.getElement('verifyCodeChange')).show();
            baidu(me.getElement('verifyCodeSend')).hide();
            if (element1) {
                element1.innerHTML = me.lang.captchaTip;
            }
            if (element) {
                element.innerHTML = me.lang.captcha;
            }
        }
        baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
        me.regMergeType = type;
    },
    _sendSMSVcode: function (field, e, callbacks, validateData, mkdData) {
        var me = this;
        // 发送短信
        var phoneNum = me.getElement(me.config.regMerge ? 'account' : 'phone').value;
        if (me.config.isexchangeable) {
            me.AccountExchangeFlag = 1;
        }
        me.validate(me.config.regMerge ? 'account' : 'phone', {
            success: function () {
                var params = {
                    /* eslint-disable fecs-camelcase */
                    is_voice_sms: me.config.isVoiceSms,
                    /* eslint-enable fecs-camelcase */
                    phone: phoneNum,
                    countrycode: me.getElement('foreignMobileLabel')
                        ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '')
                        : '',
                    gid: me.guideRandom || '',
                    isexchangeable: me.config.isexchangeable,
                    subpro: me.config.subpro,
                    validatedata: validateData,
                    dv: document.getElementById('dv_Input')
                        ? document.getElementById('dv_Input').value
                        : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '')
                };
                if (mkdData && mkdData.ds && mkdData.tk) {
                    params.ds = mkdData.ds;
                    params.tk = mkdData.tk;
                };
                passport.data.sendPhoneCode(params)
                .success(function (rsp) {
                    /**
                     * @description 短信激活码发送
                     * @name magic.passport.reg#smsCodeSend
                     * @event
                     * @grammar magic.passport.reg#smsCodeSend(e)
                     * @param {Object} e 事件参数
                     * @param {Object} e.rsp 服务器返回信息
                     */
                    var returnValue = me.fireEvent('smsCodeSend', {
                        rsp: rsp
                    });
                    if (!returnValue) {
                        return;
                    }

                    if (+rsp.errInfo.no === 0) {
                        callbacks && callbacks.success && callbacks.success();
                    }
                    else if (+rsp.errInfo.no === 50042) {
                        me.regPassMkd.initVcode();
                    }
                    else if (+rsp.errInfo.no === 130040) {
                        callbacks && callbacks.validate && callbacks.validate();

                        var confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr;
                        me.getElement('vcodesign').value = rsp.data.vcodesign;
                        me.getElement('vcodestr').value = rsp.data.vcodestr;
                        if (me.confirmRegVerifyWidget) {
                            // TODO 切换验证码图片
                            me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
                            baidu(me.getElement('confirmVerifyCode')).val('');
                            me.confirmRegVerifyWidget.show();
                        } else {
                            setTimeout(function () {
                                passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                                    me.confirmRegVerifyWidget = passport.pop.init({
                                        type: 'confirmWidget',
                                        tangram: true,
                                        titleText: '安全验证',
                                        width: 490,
                                        apiOpt: {
                                            Continue: '确定',
                                            contentHTML: '<p class="pass-confirmReg-verifyWidget-msg">请填写图中的验证码</p>'
                                            + '<p class="pass-confirmReg-verifyWidget-imgWrapper">'
                                            + '<input type="text"'
                                            + ' class="pass-text-input pass-confirmReg-verifyWidget-verifyCode" id="'
                                            + me.$getId('confirmVerifyCode')
                                            + '" name="confirmVerifyCode" value="" />'
                                            + '<img src="' + confirmVerifyCodeImgSrc
                                            + '" title="" class="pass-confirmReg-verifyWidget-verifyCode-img" id="'
                                            + me.$getId('confirmVerifyCodeImg')
                                            + '" />'
                                            + '<a href="#" class="pass-confirmReg-verifyWidget-imgChange" id="'
                                            + me.$getId('confirmVerifyCodeChange') + '">换一张</a>'
                                            + '<span class="pass-confirmReg-verifyWidget-error" id="'
                                            + me.$getId('confirmVerifyCodeError')
                                            + '"></span>' + '</p>'
                                        },
                                        onRender: function (evt) {
                                            baidu(me.confirmRegVerifyWidget.getElement('confirmWidget_footer'))
                                            .addClass('pass-confirmReg-verifyWidget-bottom');
                                            me.config.hasPlaceholder && me._getPlaceholder([{
                                                label: 'confirmVerifyCode',
                                                placeholder: 'verifyCode'
                                            }]);
                                            baidu(me.getElement('confirmVerifyCodeChange')).on('click', function () {
                                                passport.data.getRegSmsVerifyCodeStr()
                                                .success(function (rsp) {
                                                    if (+rsp.errInfo.no === 0) {
                                                        var element = me.getElement('confirmVerifyCodeImg');
                                                        element.src = me.constant.VERIFYCODE_URL_PREFIX
                                                            + rsp.data.verifyStr;
                                                        me.getElement('vcodesign').value = rsp.data.vcodesign;
                                                        me.getElement('vcodestr').value = rsp.data.vcodestr;
                                                    }
                                                });
                                            });
                                            baidu(me.getElement('confirmVerifyCode')).on('keyup', function () {
                                                baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
                                                var baidu1 = baidu(me.getElement('confirmVerifyCodeError'));
                                                baidu1.hide();
                                                baidu1.get(0).innerHTML = '';
                                            });
                                            baidu(me.getElement('confirmVerifyCode')).on('change', function () {
                                                var element = me.getElement('confirmVerifyCode');
                                                element.value = element.value.replace(/\s/g, '');
                                            });
                                        },
                                        onConfirmCancel: function (evt) {

                                        },
                                        onConfirmContinue: function (evt) {
                                            var baiduVCode = baidu(me.getElement('confirmVerifyCode'));
                                            if (baiduVCode.val() === '') {
                                                baiduVCode.addClass('pass-text-input-error');
                                                var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                                baiduCodeError.show();
                                                baiduCodeError.get(0).innerHTML = me.lang.confirmVerCodeEmpty;
                                                return;
                                            }
                                            var baidu1 = baidu(me.getElement('foreignMobileLabel'));
                                            passport.data.sendPhoneCode({
                                                /* eslint-disable fecs-camelcase */
                                                is_voice_sms: me.config.isVoiceSms,
                                                /* eslint-enable fecs-camelcase */
                                                phone: phoneNum,
                                                countrycode: me.getElement('foreignMobileLabel')
                                                    ? (baidu1.attr('data-countrycode') || '')
                                                    : '',
                                                isexchangeable: me.config.isexchangeable,
                                                subpro: me.config.subpro,
                                                confirmVerifyCode: baiduVCode.val(),
                                                vcodesign: me.getElement('vcodesign').value,
                                                dv: document.getElementById('dv_Input')
                                                    ? document.getElementById('dv_Input').value
                                                    : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || ''),
                                                vcodestr: me.getElement('vcodestr').value
                                            })
                                            .success(function (rsp) {
                                                var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                                if (+rsp.errInfo.no === 0) {
                                                    baiduCodeError.hide();
                                                    baidu(me.getElement('verifyCodeError')).hide();
                                                    me.confirmRegVerifyWidget.hide();
                                                    if (me.config.nocaptcha) {
                                                        me.nocaptcha.sendSMS();
                                                    } else {
                                                        me.disableSmsButton();
                                                    }
                                                } else if (+rsp.errInfo.no === 130041 || +rsp.errInfo.no === 130042) {
                                                    baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                                    baiduCodeError.show();
                                                    baiduCodeError.get(0).innerHTML = rsp.errInfo.msg;
                                                } else {
                                                    baiduCodeError.hide();
                                                    me.confirmRegVerifyWidget.hide();
                                                    baidu(me.getElement('verifyCodeError')).show().get(0).innerHTML = rsp.errInfo.msg;
                                                    baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                                                }
                                            });
                                        }
                                    });
                                    me.confirmRegVerifyWidget.show();
                                });
                            }, 80);

                        }
                    } else {
                        /*if(me.config.regMerge){
                            baidu(me.getElement('verifyCodeError')).show().get(0).innerHTML = rsp.errInfo.msg;
                            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                        }else{
                            me.getElement('verifyCodeSendError').show().get(0).innerHTML = rsp.errInfo.msg;
                            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                        }*/
                        if (me.getElement('verifyCodeError')) {
                            baidu(me.getElement('verifyCodeError')).show();
                            baidu(me.getElement('verifyCodeError')).get(0).innerHTML = rsp.errInfo.msg;
                        }
                        if (me.getElement('verifyCodeSendTip')) {
                            baidu(me.getElement('verifyCodeSendTip')).hide();
                            baidu(me.getElement('verifyCodeSendTip')).get(0).innerHTML = '';
                        }
                        callbacks && callbacks.error && callbacks.error(rsp.errInfo.msg);
                    }
                });
                // me.getElement('exchange').value = 0;
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _format: function (source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments, 1);
        var toString = Object.prototype.toString;
        if (data.length) {
            data = data.length === 1
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
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
    /* eslint-disable fecs-camelcase */
    _eventHandler: (function () {
        var me;
        var style = {
            focus: function (field, e) {
                /**
                 * @description 表单域获得焦点
                 * @name magic.passport.reg#fieldFocus
                 * @event
                 * @grammar magic.passport.reg#fieldFocus(e)
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
            },
            blur: function (field, e) {
                /**
                 * @description 表单域失去焦点
                 * @name magic.passport.reg#fieldBlur
                 * @event
                 * @grammar magic.passport.reg#fieldBlur(e)
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
            },
            mouseover: function (field, e) {
                /**
                 * @description 鼠标移入表单域
                 * @name magic.passport.reg#fieldMouseover
                 * @event
                 * @grammar magic.passport.reg#fieldMouseover(e)
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
                 * @grammar magic.passport.reg#fieldMouseout(e)
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
                 * @description 表单域keyup事件
                 * @name magic.passport.reg#fieldMouseout
                 * @event
                 * @grammar magic.passport.reg#fieldMouseout(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 fieldMouseout 事件的表单域
                 */
                var returnValue = me.fireEvent('fieldKeyup', {
                    ele: this
                });
            }
        };
        var behaviour = {
            focus: {
                'account': function () {
                    me.getElement('exchange').value = 0;
                    me._showTip('account');
                },
                'email': function () {
                    me._showTip('email');
                },
                'phone': function () {
                    me.getElement('exchange').value = 0;
                    me._showTip('phone');
                    me._showNocaptcha(false);
                },
                'userName': function () {
                    me._showTip('userName');
                },
                'password': function () {
                    me._showTip('password');
                    me._getRSA(function (result) {
                        me.RSA = result.RSA;
                        me.rsakey = result.rsakey;
                    });
                },
                'verifyPass': function () {
                    me._showTip('verifyPass');
                },
                'verifyCode': function () {
                    me._showTip('verifyCode');
                    if (me.getElement('verifyCodeSendTip')) {
                        me.getElement('verifyCodeSendTip').style.display = 'none';
                    }
                    if (me.getElement('verifyCodeError')) {
                        me.getElement('verifyCodeError').style.display = 'none';
                    }
                },
                'smsCode': function () {
                    me._showTip('smsCode');
                }
            },
            blur: {
                'account': function (field, e) {

                    var ele = me.getElement(field);
                    if (!ele.value) {
                        return;
                    }

                    if (me.$multiTip) {
                        me.$multiTip.hide();
                    }

                    if (!/\S+/.test(ele.value)) {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required'],
                            desc: me.config.regMergeUserName ? me.lang.accountEmpty_username : window.accountEmpty
                        };
                        me.validate(field);
                    } else if (/^\d+$/.test(ele.value)) {
                        // 改状态机设置为默认状态
                        me.AccountExchangeFlag = 0;

                        if (me.getElement('suggestNameWrapper')) {
                            baidu(me.getElement('suggestNameWrapper')).empty();
                        }
                        if (me.suggestListKey) {
                            me.suggestListKey = '';
                        }
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'phone'],
                            asyncRule: me._asyncValidate.phoneCheck,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('phone');
                        me.validate(field);
                    } else if (ele.value.indexOf('@') > -1) {
                        if (me.suggestListKey) {
                            me.suggestListKey = '';
                        }
                        if (me.getElement('suggestNameWrapper')) {
                            baidu(me.getElement('suggestNameWrapper')).empty();
                        }

                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'mailLength', 'email', 'emailLimit'],
                            asyncRule: me._asyncValidate.checkEmail,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('email');
                        setTimeout(function () {
                            me.validate(field);
                        }, 200);
                    } else if (me.config.regMergeUserName) {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'userNameLength', 'userNameNumber'],
                            asyncRule: me._asyncValidate.checkUserName,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('userName');
                        me.validate(field);
                    } else {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['accountMerge'],
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('email');
                        me.validate(field);
                    }

                },
                'email': function (field, e) {
                    // 如果 suggestion 某项处于高亮状态，则不调用验证，因为 suggestion 中的 onpick 会调用
                    // if(!me.suggestionHighlight){
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                    // }
                },
                'phone': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        if (me.getElement('foreignMobileLabel')
                            && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
                            // 海外手机号校验，非空+数字
                            me._validator.addRule('foreignmobile', function (ele) {
                                return /^(\d)*$/.test(ele.value);
                            });
                            me._validator.addMsg('foreignmobile', me.lang.foreignMobileError);
                            me._validator.confStorage[me.$getId()]['phone'] = {
                                rules: ['required', 'foreignmobile'],
                                asyncRule: me._asyncValidate.phoneCheck,
                                desc: me.lang.phoneNum
                            };
                        } else {
                            me._validator.confStorage[me.$getId()]['phone'] = {
                                rules: ['required', 'phone'],
                                asyncRule: me._asyncValidate.phoneCheck,
                                desc: me.lang.phoneNum
                            };
                        }
                        me.validate(field, {
                            success: function (e) {
                                ele.value && me._showNocaptcha(true, ele);
                            }
                        });

                    }
                },
                'userName': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'password': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'verifyPass': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'verifyCode': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'smsCode': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                }
            },
            change: {
                'email': function (field, e) {

                }
            },
            keyup: {
                'account': function (field, e) {
                    var value = me.getElement(field).value;
                    if (me.suggestion && value.indexOf('@') === -1) {
                        me.suggestion.hide();

                    }
                },
                'password': function (field, e) {
                    var ele = me.getElement(field);
                    if (!me.isInputPassword) {
                        me.isInputPassword = true;
                        // 发送输入密码统计
                        me.sendLog(me, 'pc-register-password-input', {});
                    }
                    if (me.config.isLowpwdCheck) {
                        return;
                    }
                    if (ele.value.length < 8 && !me.config.hasPasswordcheck) {
                        me.setPwdStrength(-1);
                    } else if (me.config.hasPasswordcheck) {
                        me.passwordCheckList(field);
                    } else {
                        me.validate(field);
                    }

                    if (me.getElement('showpwd_password_content')) {
                        me.getElement('showpwd_password_content').innerHTML = ele.value;
                    }
                },
                'phone': function (field, e) {
                    var value = me.getElement(field).value;
                    if (!me.isInputPhone) {
                        me.isInputPhone = true;
                        // 发送输入电话号码统计
                        me.sendLog(me, 'pc-register-phone-input', {});
                    }
                },
                'userName': function () {
                    if (!me.isInputUserName) {
                        me.isInputUserName = true;
                        // 发送输入用户名统计
                        me.sendLog(me, 'pc-register-username-input', {});
                    }
                },
                'verifyCode': function () {
                    if (!me.isInputSmsCode) {
                        me.isInputSmsCode = true;
                        // 发送输入验证码统计
                        me.sendLog(me, 'pc-register-sms-input', {});
                    }
                }
            },
            click: {
                'isAgree': function (field, e) {
                    me.validate(field);
                },
                'suggestName': function () {
                    var box = this;
                    var boxDom = box.get(0);
                    if (!boxDom.tagName || (boxDom.tagName !== 'LABEL')) {
                        box = box.parent();
                    }
                    box = box.find('input');
                    var value = box.get(0).value;
                    /**
                     * @description 用户从推荐用户名列表中选择
                     * @name magic.passport.reg#selectSuggestName
                     * @event
                     * @grammar magic.passport.reg#selectSuggestName(e)
                     * @param {Object} e 事件参数
                     * @param {String} e.suggestName 被选中的用户名
                     */
                    var returnValue = me.fireEvent('selectSuggestName', {
                        suggestName: value
                    });
                    if (!returnValue) {
                        return;
                    }

                    baidu(me.getElement('suggestNameWrapper')).empty();
                    me.getElement(me.config.regMergeUserName ? 'account' : 'userName').value = value;
                    me.getElement(me.config.regMergeUserName ? 'account' : 'userName').focus();
                    me._hideTip(me.config.regMergeUserName ? 'account' : 'userName');
                    if (me.config.regMerge) {
                        baidu(me.getElement('Placeholder')).hide();
                    }

                    // TODO: 考虑选中推荐用户名后，不通过调用验证消除错误提示
                    // me.validate('userName');
                    me.setValidateSuccess(me.config.regMergeUserName ? 'account' : 'userName');
                    me.suggestListKey = value;

                    // set index
                    var index = box.attr('id').match(/(\d+)$/)[1];
                    me.getElement('selectedSuggestName').value = value;
                    me.getElement('suggestIndex').value = index;

                },
                'verifyCodeChange': function (field, e) {
                    // 更换验证码
                    me.getVerifyCode();
                    me.getElement('verifyCode').focus();
                    e.preventDefault();
                    // 点击更换验证码统计
                    me.sendLog(me, 'pc-register-sms-again-click', {});
                },
                'verifyCodeSend': function (field, e) {
                    if (me.regPassMkd && me.regPassMkd.getDataAsync) {
                        var mkdData = {};
                        me.regPassMkd.getDataAsync(function (rsp) {
                            mkdData.ds = rsp.ds || 'xxx';
                            mkdData.tk = rsp.tk || 'xxx';
                            me._sendSMSVcode(field, e, {
                                success: function () {
                                    me.disableSmsButton();
                                }
                            }, null, mkdData);
                        });
                    } else {
                        me._sendSMSVcode(field, e, {
                            success: function () {
                                me.disableSmsButton();
                            }
                        });
                    }
                    // 点击发送验证码统计
                    me.sendLog(me, 'pc-register-sms-click', {});
                }
            },
            submit: function (e) {
                if (me.config.isexchangeable) {
                    me.AccountExchangeFlag = 1;
                }
                // 点击注册统计
                me.sendLog(me, 'pc-register-submit-click', {});
                me.validateAll({
                    success: function () {
                        me.getElement('submit').focus();
                        /**
                         * @description 表单提交前
                         * @name magic.passport.reg#beforeSubmit
                         * @event
                         * @grammar magic.passport.reg#beforeSubmit()
                         */
                        var returnValue = me.fireEvent('beforeSubmit');
                        if (!returnValue) {
                            return;
                        }

                        var data = baidu.form.json(me.getElement('form'));

                        if (!me.config.regMerge && me.config.isPhone) {
                            data.smscode = data.verifyCode;
                        }

                        // 用户名推荐
                        if (me.regMergeType === 'userName' || me.config.userName) {
                            if (data.userName !== data.selectedSuggestName) {
                                data.suggestIndex = '';
                                data.suggestType = '';
                            }
                        }
                        me.getElement('submit').style.color = '#9ebef4';
                        data.timeSpan = new Date().getTime() - me.initTime;

                        var submitCallback = function (rsp) {
                            if (+rsp.errInfo.no === 0) {
                                me.getElement('submit').style.color = '#fff';
                                if (rsp.data.needToModifyPassword) {
                                    // 修改密码
                                    window.loaction.href = me.constant.MODIFY_PWD_URL_PREFIX
                                        + '?u=' + window.u || '';
                                } else {
                                    /**
                                     * @description 注册成功
                                     * @name magic.passport.reg#regSuccess
                                     * @event
                                     * @grammar magic.passport.reg#regSuccess(e)
                                     * @param {Object} e 事件参数
                                     * @param {Object} e.rsp 服务器返回信息
                                     * @param {Boolean} evt.returnValue 返回false时，阻止跳转
                                     */
                                    var returnValue = me.fireEvent('regSuccess', {
                                        rsp: rsp
                                    });
                                    if (!returnValue) {
                                        return;
                                    }

                                    window.location.href = rsp.data.u;
                                }
                            } else if (rsp.errInfo.no === '400413' || rsp.errInfo.no === '400414') {
                                // 强制出选择页面
                                var domain = (window.location
                                    ? ((window.location.protocol.toLowerCase() === 'http:')
                                        ? 'http://passport.baidu.com/'
                                        : 'https://passport.baidu.com')
                                    : ((document.location.protocol.toLowerCase() === 'http:')
                                        ? 'http://passport.baidu.com/'
                                        : 'https://passport.baidu.com'));
                                // 业务模块配置
                                var bizMods = {
                                    'uni_armorwidget': 'uni_armorwidget.js'/*tpa=http://passport.baidu.com/passApi/js/uni_armorwidget.js*/,
                                    'uni_forceverify': 'uni_forceverify.js'/*tpa=http://passport.baidu.com/passApi/js/uni_forceverify.js*/,
                                    'uni_accConnect': 'uni_accConnect_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_accConnect_wrapper.js*/,
                                    'uni_wrapper': 'uni_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_wrapper.js*/
                                };
                                var secondCard;

                                me.config.u = rsp.data.u || me.config.u;

                                // ns.login.secondCardAction()
                                setTimeout(function () {
                                    passport._load(domain + bizMods.uni_wrapper, true, function () {
                                        if (!secondCard) {
                                            secondCard = passport.pop.init({
                                                type: 'secondCardVerify',
                                                tangram: true,
                                                color: me.config.color || 'blue',
                                                apiOpt: {
                                                    u: me.config.u,
                                                    product: me.config.product,
                                                    lstr: rsp.data.lstr || '',
                                                    ltoken: rsp.data.ltoken || '',
                                                    token: rsp.data.authtoken || '',
                                                    staticPage: me.config.staticPage,
                                                    select: rsp.errInfo.no === '400413' ? '1' : '0',
                                                    scscene: rsp.data.scscene || '',
                                                    scnewuser: rsp.data.scnewuser || '',
                                                    // loginType: options.rsp.rsp.loginType,
                                                    loginproxy: rsp.data.loginproxy || ''
                                                },
                                                onloginSuccess: function (data) {
                                                    location.href = data.target.config.u;
                                                },
                                                onSubmitSuccess: function (self, result) {
                                                    if (result.rsp.data.loginproxy) {
                                                        passport.data.jsonp(result.rsp.data.loginproxy)
                                                        .success(function (proxyrsp) {
                                                            if (proxyrsp.errInfo.no === '0') {
                                                                document.location.href = 'https://passport.baidu.com/v3/security/main/secondcardmodifyaccinfo?tpl='
                                                                    + me.config.product + '&bdstoken='
                                                                    + result.rsp.data.bdstoken + '&authsid='
                                                                    + result.rsp.data.mod_authsid
                                                                    + '&u=' + encodeURIComponent(proxyrsp.data.u)
                                                                    + '&loginType=' + result.rsp.data.loginType
                                                                    + '&hasUsername=' + result.rsp.data.hasUsername;
                                                            } else {
                                                                self.target.getElement('secondCardError').innerHTML
                                                                = me.lang.sysError;
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                            secondCard.show();
                                        } else {
                                            if (secondCard.reRender) {
                                                secondCard.reRender({
                                                    lstr: rsp.data.lstr || '',
                                                    ltoken: rsp.data.ltoken || '',
                                                    token: rsp.data.authtoken || '',
                                                    loginproxy: rsp.data.loginproxy || '',
                                                    select: rsp.errInfo.no === '400413' ? '1' : '0'
                                                    // loginType: options.rspData.rsp.loginType
                                                });
                                            }
                                            secondCard.show();
                                        }
                                    });
                                }, 80);

                                return false;
                            } else {
                                /**
                                 * @description 注册失败
                                 * @name magic.passport.reg#regError
                                 * @event
                                 * @grammar magic.passport.reg#regError(e)
                                 * @param {Object} e 事件参数
                                 * @param {Object} e.rsp 服务器返回信息
                                 */
                                me.getElement('submit').style.color = '#fff';
                                var returnValue = me.fireEvent('regError', {
                                    rsp: rsp
                                });
                                if (!returnValue) {
                                    return;
                                }

                                if (rsp.errInfo.msg && (rsp.errInfo.msg.indexOf('#{') >= 0)) {
                                    // 如果需要替换errrsp.errInfo.msg中的字符
                                    if (+rsp.errInfo.no === 110024) {
                                        var linkUrl = me._domain.https + '/v2/?regnotify&action=resend&tpl='
                                            + me.config.product + '&email=' + encodeURIComponent(rsp.data.email)
                                            + '&u=' + encodeURIComponent(rsp.data.u);
                                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {gotourl: linkUrl});
                                    } else {
                                        var account = me.getElement('account').value;
                                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                                            urldata: '&account=' + account + '&tpl='
                                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                                        });
                                    }
                                }

                                if (rsp.errInfo['field']) {
                                    if (me.config.regMerge) {
                                        if ((/^(phone|email|userName)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'account';
                                        } else if ((/^(smsCode)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'verifyCode';
                                        }
                                    } else if (me.config.isPhone) {
                                        if ((/^(phone)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'phone';
                                        } else if ((/^(smsCode)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'verifyCode';
                                        }
                                    }
                                    me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
                                } else {
                                    me.setGeneralError(rsp.errInfo['msg']);
                                }

                                var isConfirmReg = parseInt(rsp.errInfo.no, 10) === 71000;

                                if (!me.config.isPhone && !isConfirmReg) {
                                    // 错误后刷新验证码
                                    me.getVerifyCode();
                                }

                                if (isConfirmReg) {
                                    var jsUrl = me._domain.auto + '/passApi/js/uni_wrapper.js';
                                    passport._load(jsUrl, true, function () {
                                        var confirmWidget = passport.pop.init({
                                            type: 'confirmWidget',
                                            tangram: true,
                                            apiOpt: {
                                                Cancel: '取消',
                                                Continue: '登录',
                                                contentHTML: '<div class="pass-reg-confirm-dia">'
                                                + '<span class="pass-reg-confirm-diamsg">'
                                                + '该手机已注册，可以通过密码或短信快捷登录。'
                                                + '</span>'
                                                + '</div>'
                                            },
                                            onRender: function (evt) {

                                            },
                                            onConfirmClose: function (evt) {
                                                confirmWidget.hide();
                                                me.getElement('phone').value = '';
                                                me.getElement('phone').focus();
                                            },
                                            onConfirmCancel: function (evt) {
                                                // me.getElement('exchange').value = 0;
                                                confirmWidget.hide();
                                                me.getElement('phone').val('');
                                                me.getElement('phone').focus();
                                            },
                                            onConfirmContinue: function (evt) {
                                                // me.getElement('exchange').value = 1;
                                                // me.getElement('submit').click();
                                                var account = me.getElement('phone').value;
                                                var url = 'http://passport.baidu.com/v2/?login&account='
                                                    + account + '&tpl=' + me.config.product
                                                    + '&u=' + (me.config.retu || me.config.u);
                                                confirmWidget.hide();
                                                if (window.location) {
                                                    window.location.href = url;
                                                } else {
                                                    document.location.href = url;
                                                }
                                            }
                                        });
                                        confirmWidget.show();
                                    });
                                }
                            }
                        };

                        // 马甲号注册后端打点区分
                        if (me.config.isVoiceSms) {
                            data.isVoiceSmsReg = 1;
                        } else {
                            data.isVoiceSmsReg = 0;
                        }
                        if (me.regMergeType === 'phone') {
                            data.phone = data.account;
                            data.smscode = data.verifyCode;
                            data.registerType = 0;
                        } else if (me.regMergeType === 'email') {
                            data.email = data.account;
                        } else if (me.regMergeType === 'userName') {
                            data.username = data.account;
                            /* eslint-disable fecs-camelcase */
                            data.quick_user = me.config.regMergeUserName;
                        }
                        if (me.RSA && me.rsakey) {
                            var passwordVal = me.getElement('password').value;
                            if (passwordVal.length < 128 && !me.config.safeFlag) {
                                data.loginpass = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
                                data.rsakey = me.rsakey;
                                data.crypttype = 12;

                                // 缓存rsakey loginpass 供二次卡使用

                                document.getElementById('_rsakey').value = data.rsakey;
                                document.getElementById('_regpass').value = data.loginpass;
                                document.getElementById('_username').value = data.userName;
                            }
                        }
                        var dvValue = document.getElementById('dv_Input');
                        data.dv = dvValue
                            ? dvValue.value
                            : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                        // 增加是否为独立页的参数，用户判断注册成功是否为独立页还是内嵌页
                        if (!me.isBrowser) {
                            data.isInside = 1;
                        }
                        // submit
                        if (me.regMergeType === 'phone' || me.config.isPhone) {
                            data.countrycode = (me.getElement('foreignMobileLabel')
                                ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '') : '');
                            passport.data.regPhone(data)
                            .success(submitCallback);
                        } else {
                            data.verifypass = data.loginpass || '';
                            passport.data.reg(data)
                            .success(submitCallback);
                        }
                    },
                    error: function () {
                        baidu(me.getElement('tipContainer')).hide();
                    }
                });
                e.preventDefault();
            }
        };

        return {
            entrance: function (e) {
                me = this;
                var target = baidu(e.target);
                var field = e.target.name;
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

                if (e.type === 'blur') {
                    me._hideTip(field);
                }
            }
        };
    })(),
    /**
     * @description 显示该模块
     * @name magic.passport.reg#show
     * @grammar magic.passport.reg#show
     * @function
     */
    /**
     * @description 隐藏该模块
     * @name magic.passport.reg#hide
     * @grammar magic.passport.reg#hide
     * @function
     */
    /**
     * @description 校验单个表单域
     * @name magic.passport.reg#validate
     * @function
     * @grammar magic.passport.reg#validate(field, callbacks)
     * @param {String} field 要校验的表单域
     * @param {String} callbacks 校验完成回调，可选
     * @param {String} callbacks.succcess 校验通过回调，可选
     * @param {String} callbacks.error 校验未通过回调，可选
     */
    /**
     * @description 开始校验单个表单域前
     * @name magic.passport.reg#beforeValidate
     * @event
     * @grammar magic.passport.reg#beforeValidate(e)
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验信息
     * @param {String} e.validate.field 参与校验的表单项名
     * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
     */
    /**
     * @description 单项表单域校验通过
     * @name magic.passport.reg#validateSuccess
     * @grammar magic.passport.reg#validateSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     */
    /**
     * @description 单项表单域校验未通过
     * @name magic.passport.reg#validateError
     * @grammar magic.passport.reg#validateError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
     */
    /**
     * @description 校验整个表单
     * @name magic.passport.reg#validateAll
     * @grammar magic.passport.reg#validateAll(callbacks, breakOnError)
     * @function
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {Boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    /**
     * @description 开始校验整个表单前
     * @name magic.passport.reg#beforeValidateAll
     * @grammar magic.passport.reg#beforeValidateAll
     * @event
     */
    /**
     * @description 全表单校验通过
     * @name magic.passport.reg#validateAllSuccess
     * @grammar magic.passport.reg#validateAllSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 全表单校验未通过
     * @name magic.passport.reg#validateAllError
     * @grammar magic.passport.reg#validateAllError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 析构
     * @name magic.passport.reg#$dispose
     * @function
     * @grammar magic.passport.reg#$dispose()
     */
    $dispose: function () {
        var me = this;
        if (me.disposed) {
            return;
        }
        baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
        baidu.dom(me.getElement('form')).remove();
        /* eslint-disable */
        magic.Base.prototype.$dispose.call(me);
    }
});

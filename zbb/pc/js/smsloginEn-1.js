/**
 * @file description passport 登录模块
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
/* globals magic,passport,fingerprint */
magic.passport.smsloginEn = baidu.lang.createClass(function (options) {
    var me = this;

    if (passport && passport._protocol === 'https') {
        var protocol = 'https:';
    } else {
        var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
    }

    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'staticFile': (protocol === 'https:') ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv' : 'http://passport.bdimg.com/',
        'auto': (protocol === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'
    };

    me.config = {
        isPhone: false,
        safeFlag: 0,
        product: '',
        idc: '',
        charset: '',
        staticPage: '',
        u: '',
        hasPlaceholder: true,
        defaultCss: false,
        subpro: '',
        overseas: 1
    };

    baidu.extend(me.config, options);

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
        CONTAINER_CLASS: 'tang-pass-smsloginEn',
        LABEL_FOCUS_CLASS: 'pass-text-label-focus',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        MODIFY_PWD_URL_PREFIX: me._domain.https + '/forcsdnpasschange',
        PROTOCAL_URL: me._domain.http + '/static/passpc-account/html/protocal.html',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime())
    };
    me.lang = passport.err.getCurrent().labelText.login;

    passport.data.setContext(baidu.extend({}, me.config));

    this.initialized = false;
    this.bdPsWtoken = '';
    this.initTime = new Date().getTime();
    confirmSmsVerifyWidget = null;

    if (me.config.overseas && (me.config.overseas === 1)) {
        this.foreignMobile = true;
    }
    me.insertNoCaptchaScript();
    if (me.config.defaultCss) {
        me.loadCssFileW('smsloginEn.css'/*tpa=http://passport.baidu.com/passApi/css/smsloginEn.css*/, function () {
        });
    }
    if (me.config.getapi) {
        me.initApi();
    }

    // 发送切换到短信登录的统计
    var autoStatisticObj = {
        'eventType': 'pc-smslogin-show'
    };
    me._logPass(me.urlData, autoStatisticObj);
}, {
    type: 'magic.passport.login',
    superClass: magic.passport
}).extend({
    getIrregularField: function (field) {
        var me = this;
        var template = {
            generalError: '<p id="' + me.$getId('errorWrapper') + '" class="pass-generalErrorWrapper">'
                                + '<span id="' + me.$getId('error')
                                + '" class="pass-generalError pass-generalError-error"></span>'
                            + '</p>',
            submit: '<p id="' + me.$getId('submitWrapper') + '" class="pass-form-item pass-form-item-submit">'
                        + '<input id="' + me.$getId('submit') + '" type="submit" value="'
                        + me.lang.login + '" class="pass-button pass-button-submit"/>'
                    + '</p>',
            foreignMobileWrapper: '<div class="pass-form-item pass-form-item-PhoneCountry pass-foreignMobile-wrapper"'
                    + ' id="' + me.$getId('foreignMobileWrapper') + '" style="display:none">'
                    + '<label for="' + me.$getId('foreignMobile') + '" id="' + me.$getId('foreignMobileLabel')
                    + '" class="pass-label" data-countryCode="">+86</label>'
                    + '<input id="' + me.$getId('foreignMobile')
                    + '" type="text" name="foreignusername" class="pass-text-input"/>'
                    + '<ul id="' + me.$getId('foreignCountryList') + '" class="pass-country-list"></ul>'
                + '</div>'
        };
        return template[field];
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
    getWDom: {
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
    getTemplateSms: function () {
        var me = this;
        var isShow = '';
        var templateStr = '<div id="' + me.$getId('sms')
                + '" class="tang-pass-login tang-pass-sms" style="display:' + isShow + '">';
        var hiddenFields = {
                u: me.config.u,
                staticPage: me.config.staticPage,
                tpl: me.config.product ? me.config.product : '',
                idc: me.config.idc ? me.config.idc : '',
                'isdpass': '1',
                'gid': me.guideRandom || '',
                smsCodeString: '',
                smsVcodesign: '',
                smsVcodestr: '',
                subpro: me.config.subpro
            };
        templateStr += '<p class="tang-pass-sms-title">' + me.lang.smslogin + '</p>';
        templateStr += '<p class="tang-pass-sms-tip">' + (me.config.smsText || me.lang.smstitle) + '</p>';
        templateStr += '<form id="' + me.$getId('smsForm') + '" method="POST">';
        templateStr += me._getHiddenField(hiddenFields, 'smsHiddenFields');
        templateStr += '<p id="' + me.$getId('smsErrorWrapper') + '" class="pass-generalErrorWrapper">'
                            + '<span id="' + me.$getId('smsError') + '" class="pass-generalError"></span>'
                       + '</p>';
        templateStr += '<div id="' + me.$getId('smsPhoneWrapper') + '" class="pass-form-item pass-form-item-smsPhone'
                            + (!me.foreignMobile ? '' : ' pass-form-item-PhoneCountry') + '">'
                            + '<label for="' + me.$getId('smsPhone') + '" id="'
                            + (!me.foreignMobile ? me.$getId('smsPhoneLabel') : me.$getId('smsPhoneCountryLabel'))
                            + '" class="pass-label pass-label-smsPhone' + '" data-countryCode="">'
                            + (!me.foreignMobile ? me.lang.smsPhone : '+86') + '</label>'
                            + '<input id="' + me.$getId('smsPhone')
                            + '" type="text" name="username" class="pass-text-input pass-text-input-smsPhone"/>'
                            + '<span id="' + me.$getId('smsPhoneTip')
                            + '" class="pass-item-tip pass-item-tip-smsPhone" style="display:none"><span id="'
                            + me.$getId('smsPhoneTipText') + '"></span></span>'
                            + (me.foreignMobile ? '<ul id="' + me.$getId('smsCountryList') + '" class="pass-country-list"></ul>' : '')
                       + '</div>';
        templateStr += '<p id="' + me.$getId('smsVerifyCodeWrapper')
                    + '" class="pass-form-item pass-form-item-smsVerifyCode">'
                    + '<label for="' + me.$getId('smsVerifyCode') + '" id="' + me.$getId('smsVerifyCodeLabel')
                    + '" class="pass-label pass-label-smsVerifyCode">'
                    + me.lang.smsVerifyCode + '</label>'
                    + '<input id="' + me.$getId('smsVerifyCode')
                    + '" type="text" name="password" class="pass-text-input pass-text-input-smsVerifyCode" />'
                    + '<button id="' + me.$getId('smsTimer') + '" class="pass-item-timer">' + me.lang.smsVerifyCodeSend + '</button>'
                    + '<span id="' + me.$getId('smsVerifyCodeTip') + '" class="pass-item-tip pass-item-tip-smsVerifyCode" style="display:none"><span id="'
                    + me.$getId('smsVerifyCodeTipText') + '"></span></span>'
                + '</p>';
        templateStr += '<p id="' + me.$getId('smsSubmitWrapper') + '" class="pass-form-item pass-form-item-submit">'
            + '<input id="' + me.$getId('smsSubmit') + '" type="submit" value="Login" class="pass-button pass-button-submit" />'
            + '<span class="tang-pass-sms-agreement">' + me.lang.agree + '<a target="_blank" href="' + me.constant.PROTOCAL_URL + '">' + me.lang.baiduUserProtocal + '</a></span>'
        + '</p>';
        templateStr += '</form>';
        templateStr += '</div>';
        return templateStr;
    },
    setEventSms: function () {
        var me = this;
        var container = this.getElement();
        var parent = me.getWDom.parent(container);
        var parents = me.getWDom.parent(parent);
        var smsLogin = baidu('#' + me.$getId('sms'), parents).get(0);
        var input = baidu('.pass-text-input', smsLogin);

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
                me.selectCountryList(me.getElement('smsPhoneWrapper'));
                evt.preventDefault();
            });
        }
        baidu('.pass-text-input', smsLogin).on('mouseover', function (e) {
            var returnValue = me.fireEvent('fieldMouseover', {
                ele: baidu(this)
            });
            if (!returnValue) {
                return;
            }
            baidu(this).addClass(me.constant.HOVER_CLASS);
        });
        baidu('.pass-text-input', smsLogin).on('mouseout', function (e) {
            var returnValue = me.fireEvent('fieldMouseout', {
                    ele: baidu(this)
                });
            if (!returnValue) {
                return;
            }
            baidu(this).removeClass(me.constant.HOVER_CLASS);
        });
        baidu('.pass-text-input', smsLogin).on('keydown', function (e) {
            if (e.keyCode === 13) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                // 发送点击短信登录按钮统计
                var autoStatisticObj = {
                    'eventType': 'pc-smslogin-submit-click'
                };
                me._logPass(me.urlData, autoStatisticObj);

                me.submitSmsForm(e);
            }
        });

        var baiduSmsPhone = baidu(me.getElement('smsPhone'));
        baiduSmsPhone.on('focus', function (e) {
            if (!me.initialized) {
                me.initApi();
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
            if (smsRegPromptWrapper) {
                me.$hide(smsRegPromptWrapper);
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
                me.initApi();
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

        baidu('.pass-text-input', smsLogin).on('blur', function (e) {
            if (this.value) {
                var returnValue = me.fireEvent('fieldBlur', {
                        ele: baidu(this)
                    });
                if (!returnValue) {
                    return;
                }
                this.name === 'username' ? me.validatorPhoneFn(this) : me.validatorSmsFn(this);
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

            evt.preventDefault();
            me.checkRegPhone();
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
            me.submitSmsForm(evt);
        });
    },
    setSmsGeneralError: function (msg) {
        this.getElement('smsError').innerHTML = msg;
    },
    sendVcode: function (obj) {
        var me = obj || this;
        var phone = document.getElementById(me.$getId('smsPhone'));
        var countrylabel = me.getElement('smsPhoneCountryLabel');
        var countrycode = countrylabel ? (baidu(countrylabel).attr('data-countrycode') || '') : '';
        var disTime = 60;
        var timer;
        var smsLogin = baidu('#' + me.$getId('sms')).get(0);
        if (!me.validatorPhoneFn(phone)) {
            return;
        }
        baidu('#' + me.$getId('smsRegPromptBtn'), smsLogin).off('click');
        baidu('#' + me.$getId('smsRegPromptBtn'), smsLogin).on('click', function (evt) {
            evt.preventDefault();
        });

        baidu('#' + me.$getId('smsTimer'), smsLogin).off('click');
        baidu('#' + me.$getId('smsTimer'), smsLogin).on('click', function (evt) {
            evt.preventDefault();
        });

        baidu('#' + me.$getId('smsTimer'), smsLogin).removeClass('pass-item-timer');
        baidu('#' + me.$getId('smsTimer'), smsLogin).addClass('pass-item-time-timing');

        var data = {
            gid: me.guideRandom || '',
            username: me.sbcTOdbc(phone.value),
            countrycode: countrycode,
            bdstoken: me.bdPsWtoken,
            tpl: me.config.product ? me.config.product : '',
            lang: 'en'
        };
        data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        var domainArea = '';
        var confirmVerifyCodeImgSrc = '';
        domainArea = me._domain.auto + '/v2/api/senddpass';
        passport.data.jsonp(domainArea, data).success(function (args) {
            if (args.data.errno != 0) {
                if (args.data.errno == 18 || args.data.errno == 19 || args.errInfo.no == '50020' || args.errInfo.no == '50021') {
                    confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + args.data.vcodestr;
                    me.getElement('smsHiddenFields_smsVcodesign').value = args.data.vcodesign;
                    me.getElement('smsHiddenFields_smsVcodestr').value = args.data.vcodestr;
                    if (confirmSmsVerifyWidget) {
                        // TODO 切换验证码图片
                        me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
                        me.getElement('confirmVerifyCode').value = '';
                        me._ownerDialog && me._ownerDialog.hide('unHide');
                        confirmSmsVerifyWidget.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                            confirmSmsVerifyWidget = passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                titleText: 'Safety Verification',
                                width: 490,
                                apiOpt: {
                                    Continue: 'Sure',
                                    contentHTML: '<p class="pass-confirm-verifyWidget-msg">Please fill in the verification code in the figure.</p>'
                                                 + '<p class="pass-confirm-verifyWidget-imgWrapper">'
                                                    + '<input type="text" class="pass-text-input pass-confirm-verifyWidget-verifyCode" id="'
                                                    + me.$getId('confirmVerifyCode') + '" name="confirmVerifyCode" value="" />'
                                                    + '<img src="' + confirmVerifyCodeImgSrc
                                                    + '" title="" class="pass-confirm-verifyWidget-verifyCode-img" id="' + me.$getId('confirmVerifyCodeImg') + '" />'
                                                    + '<a href="#" class="pass-confirm-verifyWidget-imgChange" id="' + me.$getId('confirmVerifyCodeChange') + '">change</a>'
                                                 + '</p>'
                                                 + '<p class="pass-confirm-verifyWidget-error" id="' + me.$getId('confirmVerifyCodeError') + '"></p>'
                                },
                                onRender: function (evt) {
                                    baidu(confirmSmsVerifyWidget.getElement('confirmWidget_footer')).addClass('pass-confirm-verifyWidget-bottom');
                                    me.config.hasPlaceholder && me._getPlaceholder([{label: 'confirmVerifyCode', placeholder: 'verifyCode'}]);
                                    baidu(me.getElement('confirmVerifyCodeChange')).on('click', function () {
                                        baidu(me.getElement('confirmVerifyCodeImg')).attr('src', confirmVerifyCodeImgSrc + '&v=' + new Date().getTime());
                                    });
                                    baidu(me.getElement('confirmVerifyCode')).on('keyup', function () {
                                        baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
                                        baidu(me.getElement('confirmVerifyCodeError')).hide();
                                        baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                                    });
                                },
                                onConfirmClose: function (evt) {
                                    baidu(me.getElement('confirmVerifyCodeError')).hide();
                                    baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                                    confirmSmsVerifyWidget.hide();
                                    me._ownerDialog && me._ownerDialog.show();
                                },
                                onConfirmContinue: function (evt) {
                                    if (me.getElement('confirmVerifyCode').value === '') {
                                        baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                        baidu(me.getElement('confirmVerifyCodeError')).show();
                                        baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = me.lang.confirmVerCodeEmpty;
                                        return;
                                    }
                                    var data = {
                                        'gid': me.guideRandom || '',
                                        'username': me.sbcTOdbc(phone.value),
                                        'countrycode': countrycode,
                                        'bdstoken': me.bdPsWtoken,
                                        'tpl': me.config.product ? me.config.product : '',
                                        'vcodestr': me.getElement('smsHiddenFields_smsVcodestr').value,
                                        'vcodesign': me.getElement('smsHiddenFields_smsVcodesign').value,
                                        'verifycode': me.sbcTOdbc(me.getElement('confirmVerifyCode').value),
                                        'lang': 'en'
                                    };
                                    data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                                    var domainArea = '';
                                    domainArea = me._domain.auto + '/v2/api/senddpass';
                                    passport.data.jsonp(domainArea, data).success(function (rsp) {
                                        if (rsp.data.errno == 0) {
                                            timer = setInterval(function () {
                                                if ((--disTime) == 0) {
                                                    clearInterval(timer);
                                                    baidu('#' + me.$getId('smsTimer'), smsLogin).removeClass('pass-item-time-timing');
                                                    baidu('#' + me.$getId('smsTimer'), smsLogin).addClass('pass-item-timer');
                                                    document.getElementById(me.$getId('smsTimer')).innerHTML = me.lang.resend;
                                                    disTime = 60;
                                                } else {
                                                    document.getElementById(me.$getId('smsTimer')).innerHTML = me.lang.resend + '(' + disTime + ')';
                                                }
                                            }, 1000);
                                            baidu(me.getElement('confirmVerifyCodeError')).hide();
                                            baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                                            confirmSmsVerifyWidget.hide();
                                            me._ownerDialog && me._ownerDialog.show();
                                        } else if (rsp.data.errno == 20 || rsp.data.errno == 21) {
                                            baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                            baidu(me.getElement('confirmVerifyCodeError')).show();
                                            baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = rsp.data.msg;
                                            me.getElement('smsHiddenFields_smsVcodesign').value = rsp.data.vcodesign;
                                            me.getElement('smsHiddenFields_smsVcodestr').value = rsp.data.vcodestr;
                                            confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr;
                                            me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
                                            me.getElement('confirmVerifyCode').value = '';
                                        } else {
                                            baidu(me.getElement('confirmVerifyCodeError')).hide();
                                            confirmSmsVerifyWidget.hide();
                                            me._ownerDialog && me._ownerDialog.show();
                                            me.setSmsGeneralError(args.data.msg);
                                        }
                                    });
                                }
                            });
                            me._ownerDialog && me._ownerDialog.hide('unHide');
                            confirmSmsVerifyWidget.show();
                        });
                    }
                } else {
                    me.setSmsGeneralError(args.data.msg || args.errInfo.msg);
                }
                baidu('#' + me.$getId('smsTimer'), smsLogin).addClass('pass-item-timer');
                baidu('#' + me.$getId('smsTimer'), smsLogin).removeClass('pass-item-time-timing');
                document.getElementById(me.$getId('smsTimer')).innerHTML = me.lang.resend;
            } else {
                timer = setInterval(function () {
                    if ((--disTime) == 0) {
                        clearInterval(timer);
                        baidu('#' + me.$getId('smsTimer'), smsLogin).removeClass('pass-item-time-timing');
                        baidu('#' + me.$getId('smsTimer'), smsLogin).addClass('pass-item-timer');
                        document.getElementById(me.$getId('smsTimer')).innerHTML = me.lang.resend;
                        disTime = 60;
                    } else {
                        document.getElementById(me.$getId('smsTimer')).innerHTML = me.lang.resend + '(' + disTime + ')';
                    }
                }, 1000);
            }
        });
        baidu('#' + me.$getId('smsTimer'), smsLogin).on('click', function (evt) {
            evt.preventDefault();
            me.checkRegPhone();
        });
    },
    validatorPhoneFn: function (field) {
        var me = this;
        if (field.value == '') {
            me.setSmsGeneralError(me.lang.smsPhoneMsg);
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        } else if (me.getElement('smsPhoneCountryLabel') && (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') !== '')) {
            if (!new RegExp(/^(\d)*$/).test(me.sbcTOdbc(field.value))) {
                me.setSmsGeneralError(me.lang.foreignMobileError);
                baidu(field).addClass(me.constant.ERROR_CLASS);
                return false;
            }
        } else if (!new RegExp(/^1[3456789]\d{9}$/).test(me.sbcTOdbc(field.value))) {
            me.setSmsGeneralError(me.lang.foreignMobileError);
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me.setSmsGeneralError('');
        baidu(field).removeClass(me.constant.ERROR_CLASS);
        return true;
    },
    validatorSmsFn: function (field) {
        var me = this;
        if (field.value === '') {
            me.setSmsGeneralError(me.lang.confirmVerCodeEmpty);
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me.setSmsGeneralError('');
        return true;
    },

    postSmsData: function (data) {
        var me = this;
        data.countrycode = me.getElement('smsPhoneCountryLabel') ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '') : '';
        data.token = me.bdPsWtoken;
        data.lang = 'en';
        data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        me.getElement('smsSubmit').disabled = true;
        passport.data.login(data)
        .success(function (rsp) {
            if (rsp.errInfo.no == 0) {
                var returnValue = me.fireEvent('loginSuccess', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }
                window.location.href = rsp.data.u;
            } else {
                me.getElement('smsSubmit').disabled = false;
                me.getElement('smsSubmit').style.color = '#fff';
                var returnValue = me.fireEvent('loginError', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }
                if (rsp.errInfo.no == 4) {
                    me.setSmsGeneralError(me.lang.captchaErr);
                } else {
                    me.setSmsGeneralError(rsp.errInfo.msg);
                }

                if (rsp.errInfo.no == 3 || rsp.errInfo.no == 4) {
                    // 如果是短信验证码错误，或者需要输入验证码，清空并聚焦验证码栏
                    me.clearInput('smsVerifyCode');
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
        var me = this;
        var d = d || {};
        var data = baidu.form.json(me.getElement('smsForm'));
        if (d.errInfo && d.errInfo.no == 3) {
            passport.data.post('/v2/unite-bind', {
                username: d.data.username || '',
                password: data.password,
                countrycode: me.getElement('smsPhoneCountryLabel') ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '') : '',
                sms: 1,
                apiver: 'v3',
                token: d.data.token || ''
            }).success(function (rsp) {
                me.postSmsData(data);
            });
        } else {
            me.postSmsData(data);
        }
    },

    submitSmsForm: function () {
        var me = this;
        var phone = document.getElementById(me.$getId('smsPhone'));
        var vcode = document.getElementById(me.$getId('smsVerifyCode'));

        if (!me.validatorPhoneFn(phone)) {
            phone.focus();
            return;
        }
        if (!me.validatorSmsFn(vcode)) {
            return;
        }
        var returnValue = me.fireEvent('beforeSubmit');
        if (!returnValue) {
            return;
        }
        me.getElement('smsSubmit').style.color = '#9ebef4';
        var data = baidu.form.json(me.getElement('smsForm'));
        data.password = me.sbcTOdbc(data.password);
        data.username = me.sbcTOdbc(data.username);
        data.FP_UID = me._getCookie('FP_UID') || '';
        function smsLoginFn() {
            me.postSmsData(data);
        }

        me.loginConnect({
            username: data.username,
            password: data.password,
            countrycode: me.getElement('smsPhoneCountryLabel') ? (baidu(me.getElement('smsPhoneCountryLabel')).attr('data-countrycode') || '') : '',
            smsVcode: data.password,
            isdpass: 1,
            sms: 1
        }, {
            fail: function (msg) {
                me.setSmsGeneralError(msg);
            }
        }, smsLoginFn);
    },

    getToken: function (fn) {
        var me = this;
        passport.spareWData  = passport.spareWData || {};
        passport.data.getApiInfo({
            apiType: 'login',
            gid: me.guideRandom || ''
        })
        .success(function (rsp) {
            me.bdPsWtoken = rsp.data.token;
            fn && fn(me);
        });
    },

    doFocus: function (ele) {
        var me = this;

        if ((typeof ele).toLowerCase() === 'string' && me.getElement(ele)) {
            me.getElement(ele).focus();
        } else {
            ele.focus();
        }
    },
    clearInput: function (type) {
        var me = this;
        var ele = me.getElement(type);
        var eleHolder = me.getElement(type + '_placeholder');
        var eleClear = me.getElement(type + '_clearbtn');
        if (ele) {
            if (eleHolder) {
                me.$show(eleHolder);
            }
            if (eleClear) {
                me.$hide(eleHolder);
            }
            ele.value = '';
            me.doFocus(ele);
        }
    },


    insertAfterW: function (newNode, oldNode) {
        var me = this;
        var parent = me.getWDom.parent(oldNode);
        if (parent.lastChild === oldNode) {
            parent.appendChild(newNode);
        } else {
            parent.insertBefore(newNode, me.getWDom.next(oldNode));
        }
    },
    insertNoCaptchaScript: function () {
        // yangweiguang
        var me = this;
        me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
    },
    checkCapsLock: function () {
        var me = this;
        var password = baidu(me.getElement('password'));
        password.on('keypress', function (event) {
            var e = event || window.event;
            var keyCode = e.keyCode || e.which;
            var isShift = e.shiftKey || (keyCode == 16) || false;
            var caps = document.getElementById(me.$getId('caps'));
            if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
                if (!caps) {
                    var span = document.createElement('span');
                    span.id = me.$getId('caps');
                    span.innerHTML = 'Caps lock is turned on.';
                    var passw = document.getElementById(me.$getId('passwordWrapper'));
                    if (passw.style.position === 'static') {
                        passw.style.position = 'relative';
                    }
                    if (passw.style.zIndex) {
                        passw.style.zIndex = passw.style.zIndex + 1;
                    } else {
                        passw.style.zIndex = 20;
                    }
                    span.style.cssText = 'position:absolute;left:60px;clear:both;top:25px;width:103px;height:37px;font-size:12px;line-height:45px;z-index:20;text-align:center;background:url(' + me._domain.staticFile + '/passApi/img/caps.gif) no-repeat 0 0;';
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
    checkRegPhone: function (field, callback) {
        var me = this;
        var phonelabel = me.getElement('smsPhoneCountryLabel');
        var countrycode = phonelabel ? (baidu(phonelabel).attr('data-countrycode') || '') : '';
        var phone = document.getElementById(me.$getId('smsPhone'));
        if (!me.validatorPhoneFn(phone)) {
            return;
        }
        // TODO 需要修改接口以及传递的参数设置
        passport.data.getphonestatus({
            gid: me.guideRandom || '',
            phone: me.sbcTOdbc(phone.value),
            countrycode: countrycode,
            lang: 'en'
        }).success(function (rsp) {
            var returnValue = me.fireEvent('checkRegPhone', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }
            if (rsp.errInfo.no == 0) {
                // sendVcodeBefore 第三方调用短信登录，输入手机号检测是否已经绑定对应第三方帐号，在此处增加回调，直接登录调用_sendVcode方法，更换手机号则清空输入的手机号。
                if (me.config.sendVcodeBefore && typeof me.config.sendVcodeBefore === 'function') {
                    me.config.sendVcodeBefore(me, me.sendVcode, function () {
                        phone.value = '';
                        phone.focus();
                        return;
                    });
                } else if (me.bdPsWtoken) {
                    me.sendVcode();
                } else {
                    me.getToken(me.sendVcode);
                }
            } else if (rsp.errInfo.no == 3) {
                var smsRegPromptWrapper = document.getElementById(me.$getId('smsRegPromptWrapper'));
                var smsPhone = document.getElementById(me.$getId('smsPhoneWrapper'));
                if (!smsRegPromptWrapper) {
                    var div = document.createElement('div');
                    div.id = me.$getId('smsRegPromptWrapper');
                    div.className = 'pass-form-sms-checkphone';
                    div.innerHTML = '<p style="margin:0px;padding:0px;line-height:18px;">'
                                + 'Your phone number is not registered, click on the register will '
                                + '<span style="color:#ff5400">automatically register</span> '
                                + ' Baidu account and bind with this mobile.</p>'
                                + '<button id="' + me.$getId('smsRegPromptBtn') + '" class="regbutton" hidefocus=true>Register now</button>';
                    smsPhone.appendChild(div);
                    me.getElement('smsRegPromptBtn').focus();
                } else {
                    me.$show(smsRegPromptWrapper);
                    me.getElement('smsRegPromptBtn').focus();
                }
                baidu(me.getElement('smsRegPromptBtn')).on('click', function (evt) {
                    if (me.getElement('smsRegPromptWrapper')) {
                        baidu(me.getElement('smsRegPromptWrapper')).hide();
                    }
                    evt.preventDefault();
                    // sendVcodeBefore 第三方调用短信登录，输入手机号检测是否已经绑定对应第三方帐号，在此处增加回调，直接登录调用_sendVcode方法，更换手机号则清空输入的手机号。
                    if (me.config.sendVcodeBefore && typeof me.config.sendVcodeBefore === 'function') {
                        me.config.sendVcodeBefore(me, me.sendVcode, function () {
                            phone.value = '';
                            phone.focus();
                            return;
                        });
                    } else if (me.bdPsWtoken) {
                        me.sendVcode();
                    } else {
                        me.getToken(me.sendVcode);
                    }
                });
            } else {
                me.setSmsGeneralError(rsp.errInfo.msg);
            }
        });
    },

    initCountryCode: function (domField) {
        var me = this;
        var countryTempStr = '<li class="pass-item-country"><span class="pass-country-code" data-countryCode="">+86</span>China</li>';
        var data = me.countryCodeList || {};
        var countryLen = data.length;
        if (countryLen <= 0) {
            return;
        }
        for (var i = 0; i < countryLen; i++) {
            countryTempStr += '<li class="pass-item-country"><span class="pass-country-code" data-countryCode=' + data[i].code + '>+'
                                   + data[i].code.substring(2) + '</span>' + data[i].name + '</li>';
        }
        baidu(domField).html(countryTempStr);
    },

    getCountryCode: function (callback) {
        var me = this;
        var data = {
                apiver: 'v3',
                subpro: me.config.subpro,
                lang: 'en'
            };
        passport.data.jsonp('https://passport.baidu.com/v2/?securitygetcountrycode', data).success(function (rsp) {
            if (rsp.data.country.length > 0) {
                me.countryCodeList = rsp.data.country;
                if (me.getElement('foreignCountryList')) {
                    me.initCountryCode(me.getElement('foreignCountryList'));
                }
                if (me.getElement('smsCountryList')) {
                    me.initCountryCode(me.getElement('smsCountryList'));
                }
                callback && callback();
            }
        });
    },

    selectCountryList: function (domField) {
        var me = this;
        var domField = baidu(domField);
        var countryList = domField.find('.pass-country-list').eq(0);
        var labelCode = domField.find('.pass-label');
        if (labelCode.length === 0) {
            return;
        }
        countryList.on('click', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                labelCode.eq(0).html(baidu(target).find('span.pass-country-code').eq(0).html());
                labelCode.eq(0).attr('data-countryCode', baidu(target).find('span.pass-country-code').eq(0).attr('data-countryCode'));
            } else if (target.tagName.toLowerCase() === 'span') {
                labelCode.eq(0).html(baidu(target).html());
                labelCode.eq(0).attr('data-countryCode', baidu(target).attr('data-countryCode'));
            }
            me.$hide(countryList[0]);
            labelCode.eq(0).removeClass('pass-label-code-up');
            if ((domField == me.getElement('foreignMobileWrapper')) && me.getElement('foreignMobile') && me.getElement('foreignMobile').value) { // gaona02
                me.validatorforeignmobileFn(me.getElement('foreignMobile'));
            } else if (domField == me.getElement('smsPhoneWrapper')  && me.getElement('smsPhone') && me.getElement('smsPhone').value) {
                me.validatorPhoneFn(me.getElement('smsPhone'));
            }
            evt.preventDefault();
        });
        countryList.on('mouseover', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                domField.find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).addClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() === 'span') {
                domField.find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).parent('li.pass-item-country').addClass('pass-item-country-hover');
            }
        });
        countryList.on('mouseout', function (evt) {
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
            if ((baidu(target).attr('id') !== baidu(me.getElement('foreignMobileLabel')).attr('id')) && baidu(target).attr('id') !== baidu(me.getElement('smsPhoneCountryLabel')).attr('id')) {
            // 需要判断多个点击label的id
                setTimeout(function () {
                    me.$hide(countryList[0]);
                    labelCode.eq(0).removeClass('pass-label-code-up');
                }, 200);
            }
        });
    },

    setForeignMobileEvent: function () {
        var me = this;
        if (me.getElement('foreignMobileLabel')) {
            baidu(me.getElement('foreignMobileLabel')).on('click', function (evt) {
                var CountryList = me.getElement('foreignCountryList');
                if (CountryList && CountryList.style.display !== 'block') {
                    me.$show(CountryList);
                    baidu(me.getElement('foreignMobileLabel')).addClass('pass-label-code-up');
                } else if (CountryList) {
                    me.$hide(CountryList);
                    baidu(me.getElement('foreignMobileLabel')).removeClass('pass-label-code-up');
                }
                me.selectCountryList(me.getElement('foreignMobileWrapper'));
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
                    me.validatorforeignmobileFn(this);
                }
                baidu(this).removeClass(me.constant.FOCUS_CLASS);
            });
            baidu(me.getElement('foreignMobile')).on('focus', function () {
                if (!me.initialized) {
                    me.initApi();
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
    },

    validatorforeignmobileFn: function (field) {
        var me = this;
        if (field.value === '') {
            me.setGeneralError(me.lang.smsPhoneMsg);
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        } else if (me.getElement('foreignMobileLabel') && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
            if (!new RegExp(/^(\d)*$/).test(me.sbcTOdbc(field.value))) {
                me.setGeneralError(me.lang.foreignMobileError);
                baidu(field).addClass(me.constant.ERROR_CLASS);
                return false;
            }
        } else if (!new RegExp(/^1[3456789]\d{9}$/).test(me.sbcTOdbc(field.value))) {
            me.setGeneralError(me.lang.foreignMobileError);
            baidu(field).addClass(me.constant.ERROR_CLASS);
            return false;
        }
        me.setGeneralError('');
        baidu(field).removeClass(me.constant.ERROR_CLASS);
        return true;
    },

    render: function (id) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);

        var template = me.getTemplateSms();
        target.get(0).appendChild(baidu(template).get(0));

        me.setEventSms();

        if (me.config.hasPlaceholder) {
            var rendList = [];
            rendList.push({
                label: 'smsPhone',
                placeholder: (me.config && me.config.diaPassLogin) ? 'smsPhoneMsg' : 'smsPhone'
            });
            rendList.push({
                label: 'smsVerifyCode',
                placeholder: 'smsVerifyCode'
            });
            if (me.foreignMobile) {
                rendList.push({
                    label: 'foreignMobile',
                    placeholder: (me.config && me.config.diaPassLogin) ? 'smsPhoneMsg' : 'smsPhone'
                });
            }
            me._getPlaceholder(rendList);
        }

        if (me.foreignMobile) {
            me.getCountryCode();
            me.setForeignMobileEvent();
        }

        var returnValue = me.fireEvent('render');
        if (!returnValue) {
            return;
        }
        me._setEvent();
        me.checkCapsLock();
    },
    initApi: function (callbacks) {
        var me = this;
        me.initialized = true;
        me.initTime = new Date().getTime();

        passport.data.getApiInfo({
            apiType: 'login',
            gid: me.guideRandom || '',
            loginType: (me.config && me.config.diaPassLogin) ? 'dialogLogin' : 'basicLogin'
        })
        .success(function (rsp) {
            var returnValue = me.fireEvent('getApiInfo', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }
            if (rsp.data.disable == 1) {
                me.setGeneralError(me.lang.sysUpdate);
            }

            if (rsp.errInfo.no == 0) {
                var token = rsp.data.token;
                me.bdPsWtoken = rsp.data.token;

                var usagent = navigator.userAgent;
                var iosVersion = !navigator.userAgent.match(/OS [1-8]_\d[_\d]* like Mac OS X/i);
                var isIos = !!navigator.userAgent.toString().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                var isPad = navigator.userAgent.toString().indexOf('iPad');
                if (iosVersion && isIos && isPad != null) {
                    var a = document.getElementsByClassName('popBox');
                    if (a != null && a.length > 0) {
                        if (window.screen.height > document.body.clientHeight) {
                            a[0].style.height = window.screen.height * (window.screen.height / document.body.clientHeight) + 120 + 'px';
                        } else {
                            a[0].style.height = window.screen.height * (window.screen.height / document.body.clientHeight);
                        }
                    }
                }
                me.disUnameLogin = 0;

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

                if (me.constant.SUBMITFLAG) {
                    // 如果产品线调用了submitForm方法，会把constant.SUBMITFLAG赋值为true从而实现在render事件里填充内容后提交
                    me.getElement('submit').click();
                } else {
                    callbacks && callbacks.success(rsp);
                }
            }
        });
    },
    validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        ele.addClass(me.constant.ERROR_CLASS);
        me.setGeneralError(info.msg);
        opt && opt.callback && opt.callback();
    },
    validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        me.clearGeneralError();
        ele.removeClass(me.constant.ERROR_CLASS);
        opt && opt.callback && opt.callback();
    },
    loginConnect: function (data, callback, normalLoginFn) {
        var me = this;
        var bindUrl = '/v2/unite-bind';
        var connectParams = {
                username: data.username,
                smsVcode: data.smsVcode || '',
                sms: data.sms || ''
            };
        var buildQuery = function (query) {
            if (typeof (query) === 'object') {
                var builder = [];
                for (var p in query) {
                    var value = query[p];
                    if (value !== undefined && value !== null) {
                        if (builder.length) {
                            builder.push('&');
                        }
                        var valueString = encodeURIComponent(typeof(value) == 'boolean' ? (value ? '1' : '0') : value.toString());
                        builder.push(encodeURIComponent(p), '=', valueString);
                    }
                }
                return builder.join('');
            }
            if (typeof (query) == 'string') {
                return query;
            }
            return null;
        };
        var appendQuery = function (url, query) {
            query = buildQuery(query);
            if (typeof (query) == 'string') {
                var hasQuery = (/\?/g).test(url);
                url += (hasQuery ? '&' : '?') + buildQuery(query);
            }
            return url;
        };
        normalLoginFn();
    },

    // 全角转半角
    sbcTOdbc: function (str) {
        var result = '';
        if (str) {
            var len = str.length;
            for (var i = 0; i < len; i++) {
                var cCode = str.charCodeAt(i);
                // 全角与半角相差（除空格外）：65248（十进制）
                cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
                // 处理空格
                cCode = (cCode == 0x03000) ? 0x0020 : cCode;
                result += String.fromCharCode(cCode);
            }
            return result;
        } else {
            return;
        }
    },

    _eventHandler: (function () {
        var me;
        var style = {
            focus: function (field, e) {
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
                var returnValue = me.fireEvent('fieldMouseover', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }
                this.addClass(me.constant.HOVER_CLASS);
            },
            mouseout: function (field, e) {
                var returnValue = me.fireEvent('fieldMouseout', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }
                this.removeClass(me.constant.HOVER_CLASS);
            },
            keyup: function (field, e) {
                var returnValue = me.fireEvent('fieldKeyup', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }
            }
        };
        var behaviour = {
            blur: {
                'password': function (field, e) {
                    var value = this.get(0).value;
                    if (value.length) {
                        me.validate(field);
                    }
                }
            },
            submit: function (e) {
                me.submit();
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
                    if (typeof behaviour[e.type] == 'function') {
                        // for submit
                        behaviour[e.type].apply(baidu(e.target), [e]);
                    }
                    if (behaviour[e.type].hasOwnProperty(field)) {
                        behaviour[e.type][field].apply(baidu(e.target), [field, e]);
                    }
                }
                // init api
                if (!me.initialized && e.type === 'focus') {
                    me.initApi();
                }

            }
        };
    })(),
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

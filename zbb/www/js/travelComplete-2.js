/**
 * @file 游客账号正常化
 */
/* globals magic, passport */
magic.passport.travelComplete = baidu.lang.createClass(function (options) {
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
    me.exchange = '';

    this.module = 'travelComplete';
    me.constant = {
        CHECKVERIFYCODE: true,
        CONTAINER_CLASS: 'tang-pass-travelComplete',
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
    me.lang = passport.err.getCurrent().labelText.travelComplete;

    me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
    // 是否加载默认CSS
    if (me.config.defaultCss) {
    // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
        me.loadCssFileW('travelComplete.css'/*tpa=http://passport.baidu.com/passApi/css/travelComplete.css*/, function () {
        });
    }
}, {
    type: 'magic.passport.travelComplete',
    superClass: magic.passport
}).extend({
    getIrregularField: function (field) {
        var me = this;
        var template = {
            tip: '<p class="pass-travelComplete-tip">' + (me.config.tip ? me.config.tip : me.lang.tip) + '</p>',
            generalError: '<p id="' + me.$getId('travelCompleteErrorWrapper') + '" class="pass-generalErrorWrapper">'
                + '<span id="' + me.$getId('travelCompleteError')
                + '" class="pass-generalError pass-generalError-error"></span>'
                + '</p>',

            mobile: '<p id="' + me.$getId('travelCompleteMobileWrapper')
                + '" class="pass-form-item pass-form-item-mobile">'
                + '<label for="' + me.$getId('travelCompleteMobile') + '" id="' + me.$getId('travelCompleteMobileLabel')
                + '" class="pass-label pass-label-mobile"></label>'
                + '<input id="' + me.$getId('travelCompleteMobile')
                + '" type="text" name="travelCompleteMobile" class="pass-text-input pass-text-input-mobile"/>'
            + '</p>',
            mobileOversea: '<p id="' + me.$getId('travelCompleteMobileWrapper')
                + '" class="pass-form-item pass-form-item-mobile pass-form-item-overseas">'
                + '<label id="select-countrycode" class="label-input-code">+86</label>'
                + '<label for="' + me.$getId('travelCompleteMobile') + '" id="' + me.$getId('travelCompleteMobileLabel')
                + '" class="pass-label pass-label-mobile"></label>'
                + '<input id="' + me.$getId('travelCompleteMobile') + '" type="text" name="travelCompleteMobile" '
                + 'class="pass-text-input pass-text-input-mobile pass-text-input-oversea"/></p>',
            countrycode: '<div><ul id="codelist-code-ul" class="codelist-code-ul"></ul></div>',
            verifyCode: '<p id="' + me.$getId('travelCompleteVerifyCodeWrapper')
                + '" class="pass-form-item pass-form-item-verifyCode">' + '<label for="'
                + me.$getId('travelCompleteVerifyCode') + '" id="' + me.$getId('travelCompleteVerifyCodeLabel')
                + '" class="pass-label pass-label-travelCompleteVerifyCode"></label>'
                + '<input id="' + me.$getId('travelCompleteVerifyCode')
                + '" type="text" name="travelCompleteVerifyCode" class="pass-text-input pass-text-input-travelCompleteVerifyCode" />'
                + '<input id="' + me.$getId('verifyCodeSend')
                + '" type="button" class="pass-item-timer" value="' + me.lang.sendtravelCompleteVerifyCode + '"/>'
                + '<span id="' + me.$getId('smsVerifyCodeTip')
                + '" class="pass-item-tip pass-item-tip-smsVerifyCode" style="display:none">'
                + '<span id="' + me.$getId('travelCompleteVerifyCodeTipText') + '"></span></span>'
            + '</p>',
            submit: '<p id="' + me.$getId('travelCompleteSubmitWrapper')
                + '" class="pass-form-item pass-form-item-submit">'
                + '<input id="' + me.$getId('travelCompleteSubmit') + '" type="submit" value="'
                + me.lang.submit + '" class="pass-button pass-button-submit"/>'
                + '</p>',
            footer: '<div class="pass-travelComplete-footer clearfix">'
                + '<span class="footer-notrecieve" id="' + me.$getId('noreciveVcode') + '">'
                + me.lang.norecieveVcode + '</span>'
                    + '<div class="travelComplete-footer-tip" id="' + me.$getId('noreciveTip') + '">'
                    + '<p>1、请确认该手机号是否为当前使用的手机号</p>'
                    + '<p>2、请检查短信是否被安全软件拦截</p>'
                    + '<p>3、由于运营商网络原因，短信可能延迟到达</p>'
                    + '</div>'
                + '</div>'
        };
        return template[field];
    },

    getTemplate: function (opt) {
        var me = this;
        var templateStr = '<form id="' + me.$getId('form')
        + '" class="pass-form pass-form-travelComplete" method="POST" autocomplete="off">';
        var hiddenFields = {
            u: me.config.u,
            staticPage: me.config.staticPage
        };
        var travelCompleteRegularField = [{
            field: 'mobile',
            label: '',
            noError: false
        }];
        templateStr += '<div id="' + me.$getId('travelComplete_content') + '">';
        
        templateStr += me.getIrregularField('tip');
        templateStr += me.getIrregularField('generalError');
        templateStr += me._getHiddenField(hiddenFields);
        if (me.config.overseas === 1) {
            templateStr += me.getIrregularField('mobileOversea');
        } else {
            templateStr += me.getIrregularField('mobile');
        }
        templateStr += me.getIrregularField('verifyCode');
        if (me.config.overseas === 1) {
            templateStr += me.getIrregularField('countrycode');
        }
        templateStr += me.getIrregularField('submit');
        templateStr += me.getIrregularField('footer');
        templateStr += '</div>';
        templateStr += '</form>';
        return templateStr;
    },
    exchangeDialog: function (rsp) {
        var me = this;
        if (me.getElement('exchangeWrapper')) {
            baidu('.pass-exchange-text').html('该手机已关联了微信"'
                + rsp.data.exthirdname + '"，继续关联将从原微信解除，并关联至微信"'
                + rsp.data.thirdname + '"，是否继续？');
            baidu(me.getElement('exchangeWrapper')).show();
        } else {
            var exchangeWrapper = document.getElementById(me.$getId('exchangeWrapper'));
            var travelMobileWrapper = document.getElementById(me.$getId('travelCompleteMobileWrapper'));
            var div = document.createElement('div');
            div.id = me.$getId('exchangeWrapper');
            div.setAttribute('class', 'pass-exchange-dialog');
            div.style.cssText = 'position: absolute;clear: both;color: #826f33;z-index: 999;'
                + 'font-size: 12px;width: 211px;height: 105px;padding: 16px 16px 11px 13px;'
                + 'background: #fff;border: 1px solid #ccc;right: 0;top: 50px;';
            div.innerHTML = '<p class="pass-exchange-text">该手机已关联了微信"'
                + rsp.data.exthirdname + '"，继续关联将从原微信解除，并关联至微信"'
                + rsp.data.thirdname + '"，是否继续？</p>'
                + '<button class="pass-exchange-btn" id="'
                + me.$getId('exchangeBtn') + '" hidefocus=true>继续</button>'
                + '<button class="pass-exchange-btn pass-btn-cancle" id="'
                + me.$getId('exchangeCancleBtn') + '" hidefocus=true>取消</button>';
            travelMobileWrapper.appendChild(div);
            baidu(me.getElement('exchangeBtn')).on('click', function (evt) {
                me.exchange = '1';
                if (me.getElement('exchangeWrapper')) {
                    baidu(me.getElement('exchangeWrapper')).hide();
                }
                evt.preventDefault();
                me.sendVcode();
            });
            baidu(me.getElement('exchangeCancleBtn')).on('click', function (evt) {
                me.exchange = '';
                if (me.getElement('exchangeWrapper')) {
                    baidu(me.getElement('exchangeWrapper')).hide();
                }
                evt.preventDefault();
            });
        }
    },

    _setValidator: function () {
        var me = this;
        var countrycode;
        if (document.getElementById('select-countrycode')) {
            countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
        }
        me.validatorInited = true;
        me.validateRules = {
            'travelCompleteMobile': {
                rules: countrycode === '+86' || countrycode == null || countrycode === '' ? ['required', 'phoneformatReg'] : ['required', 'numformat'],
                desc: me.lang.mobile
            },
            'travelCompleteVerifyCode': {
                rules: ['required'],
                desc: me.lang.verifyCode
            }
        };

        me._validator.addRule('phoneformatReg', function () {
            var value = me.getElement('travelCompleteMobile').value;
            if (!/^1[3456789]\d{9}$/.test(value)) {
                return false;
            }
            return true;
        });
        me._validator.addMsg('phoneformatReg', '手机号码格式不正确');
        me._validator.addRule('numformat', function () {
            var value = me.getElement('travelCompleteMobile').value;
            if (!/^\d+$/.test(value)) {
                return false;
            }
            return true;
        });
        me._validator.addMsg('numformat', '手机号码格式不正确');
        me._validator.init(me, me.validateRules);
    },

    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        if (ele) {
            ele.addClass(me.constant.ERROR_CLASS);
        }
        this.getElement('travelCompleteError').innerHTML = info.msg;

        opt && opt.callback && opt.callback();
    },

    _validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        this.getElement('travelCompleteError').innerHTML = '';
        ele.removeClass(me.constant.ERROR_CLASS);
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
        }
    },
    getToken: function () {
        var me = this;
        var data = {};
        data.tpl = me.config.product;
        data.fromlogin = me.config.fromlogin;
        data.lstr = me.config.lstr;
        data.u = me.config.u;
        data.ltoken = me.config.ltoken;
        passport.data.jsonp('/v3/security/main/touristnormalizewidgetinit?v=' + (new Date().getTime()), data)
        .success(function (rsp) {
            me.bdstoken = rsp.data.bdstoken;
        });
    },

    render: function (id, callback) {
        var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }

        me.getToken();
        me.renderTemplate();
    },

    renderTemplate: function () {
        var me = this;
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);
        var template = me.getTemplate();
        target.get(0).appendChild(baidu(template).get(0));

        var selectCountryCode = document.getElementById('select-countrycode');
        var internationState = 0;
        var internationInit = function () {
            var str = '<li class="clearfix" data-value="">'
            + '<span class="left forgot-code">+86</span>'
            + '<span class="left font-code">大陆地区</span></li>';
            passport.data.jsonp('/v2/?securitygetcountrycode&v=' + new Date().getTime(), {})
            .success(function (rsp) {
                var data = rsp.data.country;
                baidu.each(data, function (i, k) {
                    str += '<li class="clearfix" data-value="' + k['code'] + '">'
                    + '<span class="left forgot-code">' + '+' + k['code'].substring(2) + '</span>'
                    + '<span class="left font-code">' + k['name'] + '</span>'
                    + '</li>';
                });
                var ul = document.getElementById('codelist-code-ul');
                ul.innerHTML = str;
            });
        };
        if (selectCountryCode) {
            selectCountryCode.onclick = function () {
                if (baidu('#codelist-code-ul li').size() > 0) {
                    if (baidu('#codelist-code-ul').css('display') === 'none') {
                        baidu('#codelist-code-ul').show();
                    } else {
                        baidu('#codelist-code-ul').hide();
                    }
                } else {
                    internationInit();
                    baidu('#codelist-code-ul').show();
                }
            };
            baidu('body').click(function (e) {
                if (e.target.className.indexOf('label-input-code') < 0) {
                    baidu('#codelist-code-ul').hide();
                }
            });
            baidu('#codelist-code-ul').click(function (e) {
                var li = e.target.parentNode;
                var country = baidu('#select-countrycode');
                var code = baidu(li).find('.forgot-code').html();
                country.innerHTML = baidu(li).attr('data-value');
                baidu('.label-input-code').html(code);
                if (baidu(li).attr('data-value')) {
                    internationState = 1;
                } else {
                    internationState = 0;
                }
                me._setValidator();
            });
        }
        if (me.config.hasPlaceholder) {
            var rendList = [{
                label: 'travelCompleteMobile',
                placeholder: 'mobilePlaceholder'
            }, {
                label: 'travelCompleteVerifyCode',
                placeholder: 'verifyCodePlaceholder',
                clearbtn: 0
            }];
            me._getPlaceholder(rendList);
        }
        me._setValidator();
        me._setEvent();
        baidu(me.getElement('noreciveVcode')).on('mouseover', function () {
            me.getElement('noreciveTip').style.display = 'block';
        });
        baidu(me.getElement('noreciveVcode')).on('mouseout', function () {
            me.getElement('noreciveTip').style.display = 'none';
        });
    },
    disableSmsButton: function () {
        var me = this;
        var ele = me.getElement('verifyCodeSend');
        var error = me.getElement('travelCompleteError');
        var value = ele.value;
        var timmer;
        var counter = 60;
        baidu(ele).addClass(me.constant.DISABLED_CLASS);
        ele.disabled = true;
        if (error) {
            error.innerHTML = '';
        }
        function countdown() {
            if (--counter === 0) {
                ele.value = value;
                baidu(ele).removeClass(me.constant.DISABLED_CLASS);
                ele.disabled = false;
                return;
            }
            ele.value = me.lang.SMSKeyResendTip + '(' + counter + ')';
            timmer = setTimeout(function () {
                countdown();
            }, 1000);
        }
        countdown();
    },
    sendVcode: function () {
        var me = this;

        var countrycode;
        if (document.getElementById('select-countrycode')) {
            countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
        }
        if (countrycode === '86' || countrycode === '+86' || !countrycode) {
            countrycode = '';
        } else {
            countrycode = '00' + countrycode.substring(1);
        }
        var phoneNum = me.getElement('travelCompleteMobile').value;
        var data = {};
        data.bdstoken = me.bdstoken;
        data.countrycode = countrycode;
        data.mobile = phoneNum;
        data.tpl = me.config.product;
        data.mkey = me.config.mkey;
        data.fromlogin = me.config.fromlogin;
        data.lstr = me.config.lstr;
        data.u = me.config.u;
        data.ltoken = me.config.ltoken;
        data.exchange = me.exchange;
        data.assoc = 'assoc';
        data.dv = document.getElementById('dv_Input')
        ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
        passport.data.jsonp('/v3/security/main/touristnormalizewidgetsend?v=' + (new Date().getTime()), data).success(function (rsp) {
            if (rsp.data.errno == 0) {
                me.disableSmsButton();
            } else if (parseInt(rsp.data.errno, 10) === 10) {
                me.exchangeDialog(rsp);
            } else {
                me.getElement('travelCompleteError').innerHTML = rsp.data.errmsg || '';
            }
        });
    },

    _eventHandler: (function () {
        var me;
        var style = {
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
                var returnValue = me.fireEvent('fieldBlur', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }
                this.removeClass(me.constant.FOCUS_CLASS);
                baidu(me.getElement(field + 'Label')).removeClass(me.constant.LABEL_FOCUS_CLASS);
            },
            keyup: function (field, e) {

            }
        },
        behaviour = {
            focus: {


            },
            blur: {
                'travelCompleteMobile': function (field, e) {
                    var value = this.get(0).value;
                    if (value.length) {
                        me.validate(field);
                    }
                },
                'travelCompleteVerifyCode': function (field, e) {
                    var value = this.get(0).value;
                    if (value.length) {
                        me.validate(field);
                    }
                }
            },
            change: {

            },
            click: {
                'verifyCodeSend': function (field, e) {
                    // 发送短信
                    me.validate('travelCompleteMobile', {
                        success: function () {
                            me.sendVcode();
                        }
                    });
                    e.preventDefault();
                }
            },
            keyup: {

            },
            submit: function (e) {
                e.preventDefault();
                var countrycode;
                if (document.getElementById('select-countrycode')) {
                    countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
                }
                if (countrycode === '86' || countrycode === '+86' || !countrycode) {
                    countrycode = '';
                } else {
                    countrycode = '00' + countrycode.substring(1);
                }
                me.validateAll({
                    success: function () {
                        me.getElement('travelCompleteSubmit').focus();
                        /**
                         * @description 表单提交前
                         * @name magic.passport.login#beforeSubmit
                         * @event
                         * @grammar magic.passport.login#beforeSubmit
                         */
                        var returnValue = me.fireEvent('beforeSubmit');
                        if (!returnValue) {
                            return;
                        }
                        me.getElement('travelCompleteSubmit').disabled = true;
                        var data = baidu.form.json(me.getElement('form'));

                        passport.data.jsonp('/v3/security/main/touristnormalizewidgetbind', {
                            'bdstoken': me.bdstoken,
                            'countrycode': countrycode,
                            'mobile': data.travelCompleteMobile,
                            'vcode': data.travelCompleteVerifyCode,
                            'tpl': me.config.product,
                            'mkey': me.config.mkey,
                            'exchange': me.exchange,
                            'lstr': me.config.lstr,
                            'u': me.config.u,
                            'ltoken': me.config.ltoken,
                            'assoc': 'assoc'
                        }).success(function (rsp) {
                            if (rsp.errInfo.no === '0') {
                                var returnValue = me.fireEvent('submitSuccess', {
                                    rsp: rsp,
                                    mobile: data.travelCompleteMobile
                                });
                            } else {
                                me.getElement('travelCompleteSubmit').disabled = false;
                                me._validateError({msg: rsp.errInfo.msg});
                            }
                        });
                    }
                }, true);
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
            }
        };
    })(),

    /**
     * @description 提交当前表单
     * @name magic.passport.accConnect#submitForm
     * @grammar magic.passport.accConnect#submitForm
     * @function
     */
    /**
     * @description 显示该模块
     * @name magic.passport.accConnect#show
     * @grammar magic.passport.accConnect#show
     * @function
     */
    /**
     * @description 隐藏该模块
     * @name magic.passport.accConnect#hide
     * @grammar magic.passport.accConnect#hide
     * @function
     */
    /**
     * @description 校验单个表单域
     * @name magic.passport.accConnect#validate
     * @function
     * @grammar magic.passport.accConnect#validate(field, callbacks)
     * @param {String} field 要校验的表单域
     * @param {String} callbacks 校验完成回调，可选
     * @param {String} callbacks.succcess 校验通过回调，可选
     * @param {String} callbacks.error 校验未通过回调，可选
     */
    /**
     * @description 开始校验单个表单域前
     * @name magic.passport.accConnect#beforeValidate
     * @event
     * @grammar magic.passport.accConnect#beforeValidate(e)
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验信息
     * @param {String} e.validate.field 参与校验的表单项名
     * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
     */
    /**
     * @description 单项表单域校验通过
     * @name magic.passport.accConnect#validateSuccess
     * @grammar magic.passport.accConnect#validateSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     */
    /**
     * @description 单项表单域校验未通过
     * @name magic.passport.accConnect#validateError
     * @grammar magic.passport.accConnect#validateError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
     */
    /**
     * @description 校验整个表单
     * @name magic.passport.accConnect#validateAll
     * @grammar magic.passport.accConnect#validateAll(callbacks, breakOnError)
     * @function
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {Boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    /**
     * @description 开始校验整个表单前
     * @name magic.passport.accConnect#beforeValidateAll
     * @grammar magic.passport.accConnect#beforeValidateAll
     * @event
     */
    /**
     * @description 全表单校验通过
     * @name magic.passport.accConnect#validateAllSuccess
     * @grammar magic.passport.accConnect#validateAllSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 全表单校验未通过
     * @name magic.passport.accConnect#validateAllError
     * @grammar magic.passport.accConnect#validateAllError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */

    /**
     * @description 析构
     * @name magic.passport.accConnect#$dispose
     * @function
     * @grammar magic.passport.accConnect#$dispose()
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

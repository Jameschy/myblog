/**
 * @file passport 二次卡验证
 */
 /*globals magic, passport*/
magic.passport.secondCardVerify = baidu.lang.createClass(function (options) {
    var me = this;
    var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
    me.domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'staticFile': (protocol === 'https:') ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv' : 'http://passport.bdimg.com/',
        'auto': (protocol === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'
    };
    me.config = {
        product: '',
        charset: '',
        staticPage: '',
        u: '',
        lstr: '',
        ltoken: '',
        ori_u: '',
        token: '',
        lang: 'zh-CN'
    };
    baidu.extend(me.config, options);

    this.module = 'secondCardVerify';
    me.constant = {
        CHECKVERIFYCODE: true,
        CONTAINER_CLASS: 'tang-pass-secondCardVerify',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error'
    };

    me.lang = passport.err.getCurrent().labelText.secondCardVerify;

    // 是否加载默认CSS
    if (me.config.defaultCss) {
        me.loadCssFileW('secondCardVerify.css'/*tpa=http://passport.baidu.com/passApi/css/secondCardVerify.css*/);
    }
}, {
    type: 'magic.passport.secondCardVerify',
    superClass: magic.passport
}).extend({
    getIrregularField: function (field) {
        var me = this;
        var template = {
            selectPortrait: '<div class="pass-secondcard-portrait">'
                                + '<img src="' + me.portrait + '">'
                                + '<p>' + me.displayname + '</p>'
                            + '</div>',
            loginTip: '<p class="pass-secondcard-tip">' + me.lang.tip + '</p>'
                       + '<p class="pass-secondcard-tip1">' + me.lang.logintip + '</p>',
            suretip: '<p class="pass-secondcard-tip tcenter">' + me.lang.suretip + '</p>',
            generalError: '<p class="pass-generalErrorWrapper">'
                             + '<span id="' + me.$getId('secondCardError') + '" '
                             + 'class="pass-generalError pass-generalError-error"></span>'
                          + '</p>',
            submit: '<p class="pass-form-item pass-form-item-submit">'
                    + '<input id="' + me.$getId('submit') + '" type="submit" value="'
                    + me.lang.submit + '" class="pass-button pass-button-submit"/>'
                + '</p>',
            submitLogin: '<p class="pass-form-item pass-form-item-submit">'
                    + '<input id="' + me.$getId('submitLogin') + '" type="button" value="'
                    + me.lang.submitLogin + '" class="pass-button pass-button-submit"/>'
                + '</p>',
            submitReg: '<p class="pass-form-item pass-form-item-submit">'
                    + '<input id="' + me.$getId('submitReg') + '" type="button" value="'
                    + me.lang.submitReg + '" class="pass-button pass-button-cancle"/>'
                + '</p>',
            bottomtip: '<p class="pass-form-bottom-tip">' + me.lang.bottomtip + '</p>'
        };
        return template[field];
    },

    getTemplate: function () {
        var me = this;
        var hiddenFields = {
                u: me.config.u,
                staticPage: me.config.staticPage
            };
        var templateStr = '';
        if (me.config.select === '1') {
            // 选择页面
            templateStr += '<div id="' + me.$getId('selectPage') + '">';
            templateStr += me.getIrregularField('selectPortrait');
            templateStr += me.getIrregularField('suretip');
            templateStr += me.getIrregularField('generalError');
            templateStr += me.getIrregularField('submitLogin');
            templateStr += me.getIrregularField('submitReg');
            templateStr += '</div>';
        } else {
            templateStr += me.getIrregularField('loginTip');
            templateStr += me.getIrregularField('generalError');
            if (me.type === 'bankcard') {
                // 银行卡验证页面
                templateStr += '<div class="content-element content-type clearfix">'
                                   + '<div class="content-type-select">'
                                       + '<div class="passapi-select-show" id="'
                                           + me.$getId('content_type_select') + '">'
                                           + '<span class="select-show-bank">' + me.lang.bank + '</span>'
                                           + '<span class="select-show-uname" id="' + me.$getId('content_select_uname')
                                           + '"><img class="bank-img" src="' + me.banks[0].img + '">'
                                           + me.banks[0].bank_name + me.banks[0].bank_type + '（' + me.banks[0].card_no + '）</span>';
                if (me.banks && me.banks.length > 1) {
                    templateStr += '<a class="select-show-arrow" id="' + me.$getId('select_arrow') + '"></a>'
                                    + '</div>'
                                    + '<ul class="passapi-select-handler" id="' + me.$getId('selectList') + '">';
                    var banksLength = me.banks.length;
                    for (var i = 0; i < banksLength; i++) {
                        templateStr += '<li class="passapi-select-list">'
                                            + '<a class="passapi-select-item">'
                                            + '<img class="bank-img" src="' + me.banks[i].img + '">'
                                            + me.banks[i].bank_name + me.banks[i].bank_type + '（'
                                            + '<span class="bank-cardno">' + me.banks[i].card_no + '</span>）</a>'
                                        + '</li>';
                    }
                    templateStr += '</ul>';
                } else {
                    templateStr += '</div>';
                }
                me.currentBankno = me.banks[0].card_no;
                templateStr +=  '</div></div>';
                templateStr += me._getRegularField({
                    field: 'card',
                    label: me.lang.card,
                    noError: true,
                    placeholder: '填写尾号' + me.banks[0].card_no + '完整卡号'
                });
            } else if (me.type === 'idcard') {
                // 身份证验证页面
                templateStr += me._getRegularField({
                    field: 'uname',
                    label: me.lang.uname,
                    noError: true,
                    value: me.uname,
                    disabled: true
                });
                templateStr += me._getRegularField({
                    field: 'idcard',
                    label: me.lang.idcard,
                    noError: true,
                    placeholder: '填写' + (me.uname || '') + '身份证号码'
                });
            } else {
                me.currentNoralType = me.normallist[0].type;
                templateStr += '<div class="content-element content-type clearfix">'
                                   + '<div class="content-type-select">'
                                       + '<div class="passapi-select-show" id="'
                                           + me.$getId('content_type_select') + '">'
                                           + '<span class="select-show-bank">验证方式</span>'
                                           + '<span class="select-show-uname" id="' + me.$getId('content_select_uname')
                                           + '">'
                                           + (me.currentNoralType !== 'appeal'
                                            ? (me.normallist[0].name + me.normallist[0].value)
                                           : ('<a target="_blank" href="' + me.normallist[0].href + '"/>'
                                            + me.normallist[0].name + '</a>')) + '</span>';
                me.normalTypeList = [];
                if (me.normallist && me.normallist.length > 1) {
                    templateStr += '<a class="select-show-arrow" id="' + me.$getId('select_arrow') + '"></a>'
                                    + '</div>'
                                    + '<ul class="passapi-select-handler" id="' + me.$getId('selectList') + '">';
                    var normalLength = me.normallist.length;
                    for (var i = 0; i < normalLength; i++) {
                        templateStr += '<li class="passapi-select-list">'
                                            + '<a class="passapi-select-item" '
                                            + (me.normallist[i].type !== 'appeal'
                                                ? 'data="' + me.normallist[i].type + '">'
                                                : 'href="' + me.normallist[i].href + '" target="_blank">')
                                            + me.normallist[i].name + me.normallist[i].value
                                            + '</a>'
                                        + '</li>';
                        me.normalTypeList.push(me.normallist[i].type);
                    }
                    templateStr += '</ul>';
                } else {
                    me.normalTypeList.push(me.normallist[0].type);
                    templateStr += '</div>';
                }
                templateStr +=  '</div></div>';
                if (me.normalTypeList._indexOf('password') > -1) {
                    templateStr += '<div id="' + me.$getId('passwordContent')
                    + '" class="secondCard-normal-listcontent">';
                    templateStr += me._getRegularField({
                        field: 'password',
                        label: me.lang.password,
                        noError: true,
                        placeholder: '请输入密码',
                        value: '',
                        disabled: false
                    });
                    templateStr +=  '</div>';
                }
                if (me.normalTypeList._indexOf('email') > -1) {
                    templateStr += '<div id="' + me.$getId('emailContent') + '" class="secondCard-normal-listcontent">';
                    templateStr += '<p id="' + me.$getId('emailWrapper')
                        + '" class="pass-form-item pass-form-item-email">'
                        + '<input id="' + me.$getId('email') + '" type="text" name="email" '
                        + 'class="pass-text-input pass-text-input-email" '
                        + 'placeholder="请输入六位数字验证码" >'
                        + '<button class="secondcard-button-send" id="' + me.$getId('emailSend') + '">发送验证码</button>'
                        + '</p>';

                    templateStr +=  '</div>';
                }
            }
            templateStr += '<div class="bottom-content">';
            templateStr += me.getIrregularField('submit');
            templateStr += me.getIrregularField('bottomtip');
            templateStr += '</div>';
        }

        templateStr += me._getHiddenField(hiddenFields);


        return templateStr;

    },


    setValidator: function () {
        var me = this;
        me.validateRules = {
            'card': {
                rules: ['required', 'card', 'cardno'],
                desc: me.lang.card
            },
            'idcard': {
                rules: ['required', 'idnum'],
                desc: me.lang.idcard
            },
            'password': {
                rules: ['required'],
                desc: me.lang.password
            },
            'email': {
                rules: ['required'],
                desc: me.lang.email
            }
        };
        /* globals IDValidator, GB2260 */
        var Validator = new IDValidator(GB2260);
        me._validator.addRule('idnum', function () {
            if (me.getElement('idcard').value && Validator.isValid(me.getElement('idcard').value)) {
                return true;
            }
        });
        me._validator.addRule('card', function () {
            if (me.getElement('card').value && /^\d{14,24}$/.test(me.getElement('card').value)) {
                return true;
            }
        });
        // 校验输入的号与尾号是否一致
        me._validator.addRule('cardno', function () {
            if (me.getElement('card').value && new RegExp(me.currentBankno + '$').test(me.getElement('card').value)) {
                return true;
            }
        });
        me._validator.addMsg('idnum', me.lang.idcardError);
        me._validator.addMsg('card', me.lang.cardError);
        me._validator.addMsg('cardno', me.lang.cardnoError);
        me._validator.init(me, me.validateRules);
    },

    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        if (ele) {
            ele.addClass(me.constant.ERROR_CLASS);
        }
        this.getElement('secondCardError').innerHTML = info.msg;

        opt && opt.callback && opt.callback();
    },

    _validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));

        this.getElement('secondCardError').innerHTML = '';
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
            l.href =  me.domain.staticFile + url;
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
    arrayIndex: function () {
        if (!Array.prototype._indexOf) {
            Array.prototype._indexOf = function (n) {
                if ('indexOf' in this) {
                    return this['indexOf'](n);
                }
                for (var i = 0; i < this.length; i++) {
                    if (n === this[i]) {
                        return i;
                    }
                }
                return -1;
            };
        }
    },
    render: function (id, callback) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);
        var template = '<form id="' + me.$getId('form') + '" class="pass-form '
            + 'pass-form-seconfcard-veriy" method="POST" autocomplete="off">';

        me.arrayIndex();
        if (me.config.select === '1') {
            var data = {};
            data.token = encodeURIComponent(me.config.token);
            data.tpl = me.config.product;
            data.scscene = me.config.scscene || '';
            data.scnewuser = me.config.scnewuser || '';
            passport.data.jsonp(me.domain.https + '/v3/security/main/secondcardselect', data).success(function (rsp) {
                if (rsp.errInfo.no === '0') {
                    me.portrait = rsp.data.portrait;
                    me.displayname = rsp.data.username;
                }
                template += me.getTemplate();
                template += '</form>';
                target.get(0).appendChild(baidu(template).get(0));
                me.setSelctEvent();
            });
        } else {
            me.renderVerify(function () {
                template += me.getTemplate();
                template += '</form>';
                target.get(0).appendChild(baidu(template).get(0));

                me.setValidator();
                me._setEvent();
                me.setVerifyEvent();
            });
        }

    },
    reRender: function (options) {
        var me = this;
        baidu.extend(me.config, options);
        baidu('#passport-secondCardVerify-pop-api').html('');
        me.render('passport-secondCardVerify-pop-api');
    },
    renderVerify: function (callback) {
        var me = this;
        var data = {};
        data.tpl = me.config.product || '';
        data.token = encodeURIComponent(me.config.token);
        data.scscene = me.config.scscene || '';
        data.scnewuser = me.config.scnewuser || '';
        data.client = me.config.client || '';
        data.clientfrom = me.config.clientfrom || '';

        passport.data.jsonp(me.domain.https + '/v3/security/main/authsecondcard', data).success(function (rsp) {
            if (rsp.errInfo.no === '0' || rsp.errInfo.no === '400420') {
                me.type = rsp.data.type;
                me.uname = rsp.data.uname;
                me.banks = rsp.data.cardlist;
                me.normallist = [];
                if (rsp.data.password) {
                    me.normallist.push(rsp.data.password);
                }
                if (rsp.data.email) {
                    me.normallist.push(rsp.data.email);
                }
                me.normallist.push({
                    name: '无可用验证方式，去申诉',
                    value: '',
                    type: 'appeal',
                    href: 'https://passport.baidu.com/?getpassappeal&source=secondcard&tpl=' + me.config.product
                    + '&code=' + rsp.data.appealcode + '&bdToken=' + rsp.data.appealbdToken
                });
            }
            callback && callback();
        });
    },
    setVerifyEvent: function () {
        var me = this;
        var normalContent = me.getElement(me.currentNoralType + 'Content');
        if (normalContent) {
            normalContent.style.display = 'block';
        }
        baidu(me.getElement('content_type_select')).on('click', function () {
            if (baidu(me.getElement('select_arrow')).hasClass('select-show-arrow-up')) {
                baidu(me.getElement('select_arrow')).removeClass('select-show-arrow-up').addClass('select-show-arrow');
                baidu(me.getElement('selectList')).css('display', 'none');
            } else {
                baidu(me.getElement('select_arrow')).removeClass('select-show-arrow').addClass('select-show-arrow-up');
                baidu(me.getElement('selectList')).css('display', 'block');
            }
        });
        baidu('.passapi-select-list').on('click', function (e) {
            baidu(me.getElement('select_arrow')).removeClass('select-show-arrow-up').addClass('select-show-arrow');
            baidu(me.getElement('selectList')).css('display', 'none');
            baidu('.select-show-uname').html(baidu(this).find('.passapi-select-item').html());
            if (me.type === 'bankcard') {
                var bankCardno = baidu(this).find('.bank-cardno').html();
                baidu(me.getElement('card')).attr('placeholder', '填写尾号' + bankCardno + '的银行卡号');
                me.currentBankno = bankCardno;
            } else {
                var target = e.target || e.srcElement;
                baidu('.secondCard-normal-listcontent').css('display', 'none');
                me.currentNoralType = baidu(target).attr('data');
                normalContent = me.getElement(me.currentNoralType + 'Content');
                if (normalContent) {
                    normalContent.style.display = 'block';
                }
            }
        });
        baidu(me.getElement('emailSend')).on('click', function (e) {
            e.preventDefault();
            var data = {};
            data.lstr = me.config.lstr;
            data.ltoken = me.config.ltoken;
            data.u = me.config.u;
            data.tpl = me.config.product || '';
            data.staticPage = me.config.staticPage;
            data.scscene = me.config.scscene || '';
            data.scnewuser = me.config.scnewuser || '';
            data.token = encodeURIComponent(me.config.token);
            data.staticPage = me.config.staticPage;
            data.client = me.config.client || '';
            data.clientfrom = me.config.clientfrom || '';

            data.type = 'email';
            passport.data.post('/v3/security/main/authsecondcardsend', data).success(function (rsp) {
                if (rsp.errInfo.no === '0') {
                    me.countDown();
                } else {
                    me._validateError({msg: rsp.errInfo.msg});
                }
            });
        });
    },
    countDown: function (argument) {
        var me = this;
        var disTime = 60;
        var baiduTimer = baidu(me.getElement('emailSend'));
        var timer = setInterval(function () {
            if ((--disTime) === 0) {
                clearInterval(timer);
                me.getElement('emailSend').disabled = false;
                baiduTimer.html('重新发送');
                disTime = 60;
            } else {
                baiduTimer.html('重新发送(' + disTime + ')');
                me.getElement('emailSend').disabled = true;
            }
        }, 1000);
    },
    setSelctEvent: function () {
        var me = this;
        baidu(me.getElement('submitLogin')).on('click', function () {
            me.getElement('selectPage').innerHTML = '';
            me.renderVerify(function () {
                me.config.select = '0';
                var template = me.getTemplate();
                baidu(me.getElement('selectPage')).append(template);

                me.setValidator();
                me._setEvent();
                me.setVerifyEvent();
            });
        });
        baidu(me.getElement('submitReg')).on('click', function () {
            var data = {};
            data.lstr = me.config.lstr;
            data.ltoken = me.config.ltoken;
            data.u = me.config.u;
            data.tpl = me.config.product || '';
            data.staticPage = me.config.staticPage;
            data.username = document.getElementById('_username') ? (document.getElementById('_username').value || '') : '';
            data.loginpass =document.getElementById('_regpass') ? (document.getElementById('_regpass').value || '') : '';
            data.rsakey = document.getElementById('_rsakey') ? (document.getElementById('_rsakey').value || '') : '';
            data.regfrom = document.getElementById('_regfrom') ? (document.getElementById('_regfrom').value || '') : '';

            data.scscene = me.config.scscene || '';
            data.scnewuser = me.config.scnewuser || '';
            data.client = me.config.client || '';
            data.clientfrom = me.config.clientfrom || '';

            passport.data.post('/v3/security/main/secondcardrereg', data).success(function (rsp) {
                if (rsp.errInfo.no === '0') {
                    if (rsp.data.ignoresetpwd == 1) {
                        location.href = rsp.data.jumpU;
                        return ;
                    }
                    if (me.config.client === 'osx' || me.config.client === 'windows') {
                        passport.use('accSetPwd', {
                            tangram: true
                        }, function (magic) {
                            var setPwd = new magic.passport.accSetPwd({
                                u: me.config.u,
                                product: me.config.product,
                                authsid: rsp.data.authsid || '',
                                bdstoken: rsp.data.bdstoken || '',
                                defaultCss: true,
                                username: 1,
                                staticPage: me.config.staticPage
                            });
                            setPwd.render('setpwd');
                            setPwd.on('submitSuccess', function (args) {
                                document.location.href = rsp.data.loginproxy;
                            });
                            baidu('#secondCard').css('display', 'none');
                            baidu('#setpwd').css('display', 'block');
                        });
                    } else {
                        me._ownerDialog.hide();
                        if (!me.setUnamePwd) {
                            me.setUnamePwd = passport.pop.init({
                                type: 'accSetPwd',
                                tangram: true,
                                color: me.config.color || 'blue',
                                apiOpt: {
                                    u: me.config.u,
                                    product: me.config.product,
                                    authsid: rsp.data.authsid || '',
                                    bdstoken: rsp.data.bdstoken || '',
                                    succJumpUrl: rsp.data.jumpU || 'https://passport.baidu.com/center',
                                    username: 1,
                                    staticPage: me.config.staticPage
                                },
                                onHide: function () {
                                },
                                onSubmitSuccess: function (self, result) {
                                    me.setUnamePwd.hide();
                                    var returnValue = me.fireEvent('loginSuccess');
                                }
                            });
                            me.setUnamePwd.show();
                        } else {
                            if (me.setUnamePwd.setMakeOption) {
                                me.setUnamePwd.setMakeOption(rsp.data.authsid, rsp.data.bdstoken);
                            }
                            me.setUnamePwd.show();
                        }
                    }
                } else {
                    me._validateError({msg: rsp.errInfo.msg});
                }
            });
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
            }
        };
        var behaviour = {
            submit: function (e) {
                e.preventDefault();

                setTimeout(function () {
                    me.validateAll({
                        success: function () {
                            if (me.hasSubmit === 1) {
                                return;
                            }
                            var subButton = me.getElement('submit');
                            subButton.focus();
                            subButton.value = me.lang.submitting;
                            subButton.style.color = '#9ebef4';
                            me.hasSubmit = 1;
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

                            var data = baidu.form.json(me.getElement('form'));
                            data.vcode = me.getElement('card') && me.getElement('card').value;
                            data.idcard = me.getElement('idcard') && me.getElement('idcard').value;
                            data.tpl = me.config.product || '';
                            data.lstr = me.config.lstr;
                            data.ltoken = me.config.ltoken;
                            data.ori_u = me.config.ori_u;
                            data.u = me.config.u;
                            data.staticPage = me.config.staticPage;
                            data.type = (me.type === 'normal' ? me.currentNoralType : me.type);
                            data.token = encodeURIComponent(me.config.token);

                            data.scscene = me.config.scscene || '';
                            data.scnewuser = me.config.scnewuser || '';
                            if (me.currentNoralType === 'email') {
                                data.vcode = data.email;
                            }
                            data.client = me.config.client || '';
                            data.clientfrom = me.config.clientfrom || '';

                            function check(key) {
                                data.rsakey = key || '';
                                passport.data.post('/v3/security/main/authsecondcard', data).success(function (rsp) {
                                    if (rsp.errInfo.no === '0') {
                                        rsp.data.loginproxy = me.config.loginproxy + '&authsid=' + rsp.data.authsid;
                                        rsp.data.loginType = me.config.loginType;
                                        var returnValue = me.fireEvent('submitSuccess', {
                                            rsp: rsp
                                        });
                                    } else {
                                        me._validateError({msg: rsp.errInfo.msg});
                                        subButton.value = me.lang.submit;
                                        subButton.style.color = '#fff';
                                        me.hasSubmit = 0;
                                    }
                                });
                            }

                            if (me.currentNoralType && me.currentNoralType === 'password') {
                                passport.data.jsonp(me.domain.https + '/v2/getpublickey', {}).success(function (cert) {
                                    var rsa = new passport.lib.RSA();
                                    rsa.setKey(cert.data.pubkey);
                                    data.vcode = rsa.encrypt(data.password);
                                    data.password = '';
                                    check(cert.data.key);
                                });
                            } else {
                                check();
                            }
                        }
                    }, true);
                }, 0);
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

/**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api登录api挂接hook
 * @Date: 2012-12-26
 */

var passport = passport || window.passport || {};
passport.hook = passport.hook || {};
(function(ns) {
    /* eslint-disable fecs-camelcase */
    var _domain = (window.location
        ? ((window.location.protocol.toLowerCase() === 'http:') ? 'http://passport.baidu.com/' : 'https://passport.baidu.com')
        : ((document.location.protocol.toLowerCase() === 'http:') ? 'http://passport.baidu.com/' : 'https://passport.baidu.com'));
    // 业务模块配置
    var _bizMods = {
        'uni_armorwidget': 'uni_armorwidget.js'/*tpa=http://passport.baidu.com/passApi/js/uni_armorwidget.js*/,
        'uni_forceverify': 'uni_forceverify.js'/*tpa=http://passport.baidu.com/passApi/js/uni_forceverify.js*/,
        'uni_accConnect': 'uni_accConnect_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_accConnect_wrapper.js*/,
        'uni_wrapper': 'uni_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_wrapper.js*/
    };
    var uni_wrapper = 'uni_wrapper';
    var verifyModName = 'uni_forceverify';
    var bindModName = 'uni_armorwidget';
    var connectModName = 'uni_accConnect';
    var realName;
    var setPwd;
    var setUnamePwd;
    var confirmMobile;
    var confirmWidgetLabel;
    var confirmWidgetMobileSure;
    var connect;
    var secondCard;
    var _loadedCssFiles = {};

    var loginSuccessed = function(api, args) {
        //  发送登录成功统计
        var urlData = {
            'tpl': api.config.product || ''
        };
        var autoStatisticObj = {
            'eventType': 'pc_login_success'
        };
        api._logPass(urlData, autoStatisticObj);
        //继续登录行为
        var returnValue = api.fire("loginSuccess", args);
        if (!returnValue)
            return;
        if (window.location) {
            window.location.href = args.rsp.data.u;
        } else {
            document.location.href = args.rsp.data.u;
        }
    };
    var get_flash_info = function() {
        var is_exists = 0;
        var version = 0;
        var filename = null;
        var isIE = /msie (\d+\.\d+)/i.test(navigator.userAgent);
        if(!isIE){
                console.log(navigator.plugins["Shockwave Flash"]);
        }
        if (isIE) {
            var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
            if (swf) {
                is_exists = 1;
                version = swf.GetVariable("$version");
            }
        } else if (navigator
                && navigator.plugins
                && navigator.plugins.length > 0
                && navigator.plugins['Shockwave Flash']
                ) {
            var swf = navigator.plugins['Shockwave Flash'];
            if (swf) {
                filename = swf.filename;
                is_exists = 1;
                if (swf.version) {
                    version = swf.version;
                } else {
                    version = swf.description;
                }

            }
        }
        return {
            isexists: is_exists,
            ver: version,
            filename: filename
        };
    }
    var loginCrossToHao123 = function (hao123Param, api) {
        if (api && api.config && api.config.noSynBdu && api.config.noSynBdu === 1) {
            return;
        }
        var protocol = document.location.protocol.toLowerCase();

        if (protocol != 'https:') {
            passport.data.request.load(protocol + "//v.tieba.com/platform/agency/setbdu?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());
        }
        passport.data.request.load(protocol + "//user.nuomi.com/pclogin/main/crossdomain?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());
        //passport.data.request.load(protocol + "//aq.sj.91.com/bd/syncpass.ashx?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        passport.data.request.load(protocol + "//passport.zongheng.com/bdpass/crossdomain.do?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        // passport.data.request.load(protocol + "//passport.anquanbao.com/v3_api/bdpass/crossdomain.do?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        passport.data.request.load("https://www.baifubao.com/api/0/sync_bduss/0?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        passport.data.request.load("https://passport.qianqian.com/bdpass?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        passport.data.request.load(protocol + "//passport.chuanke.com/api/sync?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());

        return passport.data.request.load(protocol+ "//user.hao123.com/static/crossdomain.php?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());
    }
    function bindAction(options) {
        var me = this;
        var optionsNo = {
            "120016": {//长时间未登录
                isLogin: false,
                msg: '您的帐号存在安全风险，我们已经为您采取保护策略，建议您先绑定手机。'
            },
            "400032": {
                isLogin: true,
                msg: '快来绑定密保工具吧，提升帐号安全性的同时可以快速找回密码。'
            },
            "400034": {
                isLogin: false,
                msg: {
                    phone: '请绑定您的手机号码作为您的密保手机，提升帐号安全性的同时还可以快速找回密码。',
                    email: '请绑定一个您的常用邮箱作为您的密保邮箱，提升帐号安全性的同时还可以快速找回密码。'
                }
            }
        }[options.errno];

        var args = options.args,
                title = options.title,
                msg = optionsNo.msg,
                auth_title = options.auth_title,
                auth_msg = options.auth_msg,
                isLogin = optionsNo.isLogin,
                cfg = options.cfg;

        var bindEmailWidget,
                bindPhoneWidget;

        var requestBindToken = function(api, options, callback) {
            var args = options.args,
                    data = {
                        action: options.type || 'init',
                        u: api.config.u,
                        tpl: api.config.product,
                        ltoken: args.rsp.data.ltoken,
                        lstr: args.rsp.data.lstr
                    },
            requestUrl = '';

            api.REQUESTBINDTOKENURL = '/v2/?loginspmbindsecureinfo';

            passport.data.jsonp('https://passport.baidu.com' + api.REQUESTBINDTOKENURL, data).success(function(result) {
                if (result.errInfo.no == 0) {
                    callback && callback({
                        bindEmailToken: result.data.bindEmailToken,
                        bindMobileToken: result.data.bindMobileToken,
                        authsid: result.data.authsid,
                        loginproxy: result.data.loginproxy,
                        otherValue: data
                    })
                } else {
                    api._ownerDialog && api._ownerDialog.show();
                    api.getElement('error').innerHTML = api.lang.sysError;
                }
            })
        }
        var bindEmail = function(data) {
            var addMsg = ((typeof msg).toLowerCase() == 'string') ? msg : msg.email;
            if (isLogin) {
                addMsg += "您可以<a class='bindLink bindJumpEmail'>跳过此步骤</a>或<a class='bindLink bindPhoneBtn'>绑定手机</a>。";
            } else {
                addMsg += "您也可以<a class='bindLink bindPhoneBtn'>绑定手机</a>。";
            }
            return passport.pop.ArmorWidget("bindemail", {//实例化绑定控件
                token: data.bindEmailToken,
                authsid: data.authsid,
                title: title || "绑定密保邮箱",
                otherValue: data.otherValue,
                msg: addMsg,
                subpro: me.config.subpro,
                traceid: data.traceid,
                onSubmitSuccess: function(self, result) {
                    var self = self;
                    requestBindToken(me, {args: args, type: 'check'}, function(checkData) {//发请求check绑定状态，获取loginproxy
                        self && self.hide && self.hide();
                        args.isCompleted = true;
                        if (checkData.loginproxy) {
                            //如果有loginproxy就进行登录请求
                            passport.data.jsonp(checkData.loginproxy).success(function(result) {//进行loginproxy,使用户登录
                                cfg.onCompleted && cfg.onCompleted(result, function() {
                                    cfg.onCancel && cfg.onCancel(args)
                                });
                            })
                        } else {
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    })
                },
                onRender: function() {
                    var me = this;
                    baidu('.bindPhoneBtn').on('click', function() {
                        me.close();
                        bindPhoneWidget.show();
                    })
                    baidu('.bindJumpEmail').on('click', function(evt) {
                        evt.preventDefault()
                        me.close();
                        args.isCompleted = true;
                        cfg.onCancel && cfg.onCancel(args);
                    })
                    baidu("#" + me.getId('header_a')).on('click', function() {
                        if (isLogin) {
                            args.isCompleted = true;
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    })
                }
            });
        };
        var bindPhone = function(data) {
            var addMsg = ((typeof msg).toLowerCase() == 'string') ? msg : msg.phone;
            if (isLogin && data.bindEmailToken) {
                addMsg += "您可以<a class='bindLink bindJumpPhone'>跳过此步骤</a>或<a class='bindLink bindEmailBtn'>绑定密保邮箱</a>。";
            } else if (data.bindEmailToken) {
                addMsg += "您也可以<a class='bindLink bindEmailBtn'>绑定密保邮箱</a>。";
            }
            return passport.pop.ArmorWidget("bindmobile", {//实例化绑定控件
                token: data.bindMobileToken,
                authsid: data.authsid,
                title: title || "绑定手机",
                otherValue: data.otherValue,
                msg: addMsg,
                bindToLogin:1,
                apiMargicInstance:me,
                subpro: me.config.subpro,
                traceid: data.traceid,
                onSubmitSuccess: function(self, result) {
                    var self = self;
                    requestBindToken(me, {args: args, type: 'check'}, function(checkData) {//发请求check绑定状态，获取loginproxy
                        self && self.hide && self.hide();
                        args.isCompleted = true;
                        if (checkData.loginproxy) {
                            //如果有loginproxy就进行登录请求
                            passport.data.jsonp(checkData.loginproxy).success(function(result) {//进行loginproxy,使用户登录
                                cfg.onCompleted && cfg.onCompleted(result, function() {
                                    cfg.onCancel && cfg.onCancel(args)
                                });
                            })
                        } else {
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    })
                },
                onRender: function(me) {
                    var me = this;
                    baidu('.bindEmailBtn').on('click', function(evt) {
                        evt.preventDefault()
                        me.close();
                        bindEmailWidget = bindEmailWidget || bindEmail(data)
                        bindEmailWidget.show();
                    })
                    baidu('.bindJumpPhone').on('click', function(evt) {
                        evt.preventDefault()
                        me.close();
                        args.isCompleted = true;
                        cfg.onCancel && cfg.onCancel(args);
                    })
                    baidu("#" + me.getId('header_a')).on('click', function() {
                        if (isLogin) {
                            args.isCompleted = true;
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    })
                },
                onBindToLoginFn:function(self, result){
                    if(result && result.mobile){
                        if(me.config.sms){
                            if(me.getElement('smsPhone_placeholder')){
                                me.$hide('smsPhone_placeholder');
                            }
                            if(me.getElement('smsPhone')){
                                me.getElement('smsPhone').value = result.mobile ;
                            }
                            if(me.getElement('smsVerifyCode')){
                                me.getElement('smsVerifyCode').value = '';
                                me.getElement('smsVerifyCode').focus();
                            }
                        }else{
                            if(me.getElement('userName_placeholder')){
                                me.$hide('userName_placeholder');
                            }
                            if(me.getElement('userName')){
                                me.getElement('userName').value = result.mobile ;
                            }
                            if(me.getElement('password')){
                                me.getElement('password').value = '';
                                me.getElement('password').focus();
                            }
                        }

                    }
                }
            });
        }

        requestBindToken(me, {args: args, type: 'init'}, function(data) {//发起请求获取bindtoken
            passport._use(bindModName, _bizMods[bindModName], function() {
                if (data.bindMobileToken) {//如果有绑定手机号的token就优先展示绑定手机号控件
                    bindPhoneWidget = bindPhone(data);
                    bindPhoneWidget.show();
                } else if (data.bindEmailToken) {//如果有绑定邮箱的token就展示绑定邮箱控件
                    bindEmailWidget = bindEmail(data);
                    bindEmailWidget.show();
                } else {
                    me._ownerDialog && me._ownerDialog.show();
                    me.getElement('error').innerHTML = me.lang.sysError;
                }
            })
        })
    }
    function verifyAction(options) {
        var me = this,
                warnHtml, warnMsg,
                rspData = options.rspData,
                cfg = options.cfg,
                args = options.args;


        var getWarnHTML = function(msg) {
            var msg = msg || '系统检测到您的帐号疑似被盗，存在安全风险。请尽快修改密码。';
            return '<div class="passport-forceverify-risk">' +
                    '<p class="passport-forceverify-risk-msg">' + msg + '</p>' +
                    '<div  class="passport-forceverify-risk-con clearfix">' +
                    '<a class="passport-forceverify-risk-next" id="passport_forceverify_risk_next" href="###">下次提醒</a>' +
                    '<a class="passport-forceverify-risk-btn" href="http://passport.baidu.com/v2/account/password" target="_blank" >立即修改</a>' +
                    '</div>' +
                    '</div>';
        }

        if (rspData && rspData.secstate) {
            /*secstate标记安全信息
                PA001：冻结（密码错误达到上限）,
                PA002：冻结（黑产）,
                PA003：沉默帐号再次活跃,
                risk：被盗,
                cheat：马甲,
                PC001：登录IP频率控制,
                PX008:非常驻地,
                default：默认为空,
            */
            switch(rspData.secstate){
                case 'PA001': warnMsg = '您的帐号密码输入错误次数达到上限，为保障帐号安全，登录前需验证身份。';
                break;
                case 'PA002': warnMsg = '您的网络环境存在安全风险，为保障帐号安全，登录前需验证身份。';
                break;
                case 'PA003': warnMsg = '您的帐号长时间未登录，为保障帐号安全，登录前需验证身份。';
                break;
                case 'risk': warnHtml = getWarnHTML();
                    warnMsg = '您的帐号可能存在安全隐患，为保障您的帐号安全，登录前需验证身份。';
                break;
                case 'cheat': warnMsg = '您的帐号因批量或者使用非法软件注册被冻结，登录前需验证身份。';
                break;
                case 'PC001': warnMsg = '您操作频度过于频繁，为保障帐号安全，登录前需验证身份。';
                break;
                case 'PX008': warnMsg = '您本次的登录地存在异常，为保障本次操作安全，登录前需验证身份。';
                break;
                default: warnMsg = '您的帐号存在安全风险，为保障帐号安全，登录前需验证身份。';
            }
        }


        var verifyOpt = {
            '400031': {
                title: "登录保护",
                msg: '您已开启登录保护功能，为保障帐号安全，登录前需验证身份。'
            },
            '5': {
                title: "登录安全验证",
                msg: '您的网络环境存在安全风险，为保障帐号安全，登录前需验证身份。',
                onSuccess: function(self, data) {
                    var gotoUrl = rspData.gotourl + "&authsid=" + data.authsid;

                    passport.data.jsonp(gotoUrl).success(function(result) {
                        me._ownerDialog && me._ownerDialog.show();
                        self.hide();

                        if (result.errInfo.no == 0 || result.data.errno == 0) {
                            me.getElement('error').innerHTML = '请重新登录，或<a href="https://passport.baidu.com/?getpass_index" target="_blank">找回密码</a>';
                        } else {
                            me.getElement('error').innerHTML = me.lang.sysError;
                        }
                    })
                },
                onGetapiError: function() {
                    me.getElement('error').innerHTML = '您所处的网络存在安全风险，请切换网络重试';
                }
            },
            '400023': {
                title: '登录安全验证',
                msg: '您的网络环境存在安全风险，为保障帐号安全，登录前需验证身份。',
                onSuccess: function(self, data) {
                    var gotoUrl = 'https://passport.baidu.com/v3/login/main/qrbdusslogin?tt=' + new Date().getTime();
                    var qrLoginData = {
                        authsid: data.authsid,
                        bduss: rspData.bdusssign,
                        u: encodeURIComponent(rspData.u),
                        loginVersion: 'v4',
                        tpl: me.config.product
                    };

                    passport.data.jsonp(gotoUrl, qrLoginData).success(function (result) {
                        self.hide();
                        if (result.errInfo.no == 0 || result.data.errno == 0) {
                            args.isCompleted = true;
                            cfg.onCompleted && cfg.onCompleted(result, function () {
                                cfg.onCancel && cfg.onCancel(args);
                            });
                        } else {
                            me.getElement('error').innerHTML = me.lang.sysError;
                        }
                    })
                },
                onGetapiError: function() {
                    me.getElement('error').innerHTML = '您所处的网络存在安全风险，请切换网络重试';
                }
            },
            '120019': {
                title: "登录解冻验证",
                msg: '您的帐号因密码输入错误次数过多，为保障帐号安全，登陆前需验证身份。',
                onSuccess: function(self, data) {
                    var gotoUrl = rspData.gotourl + "&authsid=" + data.authsid;

                    passport.data.jsonp(gotoUrl).success(function(result) {
                        me._ownerDialog && me._ownerDialog.show();
                        self.hide();

                        if (result.errInfo.no == 0 || result.data.errno == 0) {
                            me.getElement('error').innerHTML = '请重新登录，或<a href="https://passport.baidu.com/?getpass_index" target="_blank">找回密码</a>';
                        } else {
                            me.getElement('error').innerHTML = me.lang.sysError;
                        }
                    })
                },
                onGetapiError: function() {
                    me.getElement('error').innerHTML = '登录密码错误已达上限，您可以<a href="https://passport.baidu.com/?getpass_index" target="_blank">找回密码</a>或3小时后再试'
                }
            },
            '120021': {
                title: "安全验证",
                msg: warnMsg,
                defaultHTML: warnHtml,
                onSuccess: function(self) {
                    passport.data.jsonp(rspData.loginproxy).success(function (result) {
                        self.show();
                        if (result.errInfo.no == 0) {
                            args.isCompleted = true;
                            if (warnHtml) {
                            // 如果存在warnHtml就提示，没有则直接登录成功
                                self.getElement('article').innerHTML = warnHtml;
                                baidu(self.getElement('header_a')).on('click', function () {
                                    self.hide();
                                    cfg.onCompleted && cfg.onCompleted(result, function () {
                                        cfg.onCancel && cfg.onCancel(args);
                                    });
                                });
                                baidu(document.getElementById('passport_forceverify_risk_next')).on('click', function () {
                                    self.hide();
                                    cfg.onCompleted && cfg.onCompleted(result, function () {
                                        cfg.onCancel && cfg.onCancel(args);
                                    });
                                });
                            } else {
                                self.hide();
                                cfg.onCompleted && cfg.onCompleted(result, function () {
                                    cfg.onCancel && cfg.onCancel(args);
                                });
                            }
                        } else {
                            self.getElement('forceverify_error').html(me.lang.sysError);
                        }
                    });
                    return false;
                },
                onRender: function(self) {
                    if (document.getElementById('passport_forceverify_risk_appeal')) {
                        document.getElementById('passport_forceverify_risk_appeal').href = self.url_forgot;
                    }
                }
            },
            'riskCheat': {
                token: 'risk',
                title: '安全验证',
                msg: warnMsg,
                defaultHTML: warnHtml,
                onRender: function(self) {
                    baidu(document.getElementById('passport_forceverify_risk_next')).on('click', function() {
                        self.hide()
                        cfg.onCancel && cfg.onCancel();
                    })
                    if (document.getElementById('passport_forceverify_risk_appeal')) {
                        document.getElementById('passport_forceverify_risk_appeal').href = self.url_forgot;
                    }
                }
            }
        }[options.errno]

        passport._use(verifyModName, _bizMods[verifyModName], function() {
            //authtoken可能变化，所以必须重新执行Forceverify。
            forceverifyLoginverify = passport.pop.Forceverify({
                token: rspData.authtoken, //必须传入该参数
                title: verifyOpt.title,
                msg: verifyOpt.msg,
                subpro: me.config.subpro,
                u: rspData.u || '',
                lstr: rspData.lstr || '',
                ltoken: rspData.ltoken || '',
                tpl: rspData.tpl || '',
                traceid: rspData.traceid,
                onRender: function(self) {
                    verifyOpt.onRender && verifyOpt.onRender(self)
                },
                onSubmitSuccess: function(self, data) {
                    try {
                        if ('localStorage' in window && window['localStorage'] !== null) {
                            localStorage.setItem('passLoginType', 'normal');
                        }
                    }
                    catch (e) {
                        // catch
                    }
                    if (rspData.realnameverifyemail === '1') {
                        rspData.realnameauthsid = data.authsid;
                        realNameAction.apply(me, [{
                            args: args,
                            rspData: rspData,
                            cfg: cfg
                        }]);
                        return;
                    }
                    if (verifyOpt.onSuccess) {
                        verifyOpt.onSuccess(self, data)
                        return;
                    }
                    var loginProxyUrl = rspData.loginproxy;

                    passport.data.jsonp(loginProxyUrl).success(function(result) {
                        if (result.errInfo.no == 0 || result.data.errno == 0) {
                            self.hide();
                            args.isCompleted = true;
                            cfg.onCompleted && cfg.onCompleted(result, function () {
                                cfg.onCancel && cfg.onCancel(args)
                            });
                        } else {
                            self.hide();
                            me._ownerDialog && me._ownerDialog.show();
                            me.getElement('error').innerHTML = me.lang.sysError;
                        }
                    })
                },
                onGetapiError: function(self) {
                    me._ownerDialog && me._ownerDialog.show();

                    if (verifyOpt.onGetapiError) {
                        verifyOpt.onGetapiError(self)
                        return;
                    }
                    me.getElement('error').innerHTML = me.lang.sysError;
                },
                onHide: function() {
                    cfg.onCancel && cfg.onCancel();

                    //针对选择用户名还是手机号处理
                    if (me.config.loginMerge && me.getElement('isPhone')) {
                        me.getElement('isPhone').value = ''
                    }
                }
            }, true);
        })
    }
    function multiChoiceAction(options) {
        var me = this,
                rspData = options.rspData;

        var userList = [],
                accounts = rspData.accounts.split(';');
        for (var i = 0; i < accounts.length; i++) {
            var item = accounts[i].split(',');
            userList.push({
                username: item[0],
                portrait: item[1]
            })
        }

        passport._load(_domain + _bizMods[uni_wrapper], true, function() {
            var loginMultichoice = passport.pop.init({
                type: 'loginMultichoice', //选择多个帐号控件
                tangram: true,
                apiOpt: {
                    phone: rspData.userName,
                    userList: userList
                },
                onChoicedUser: function(diaChoice, result) {
                    loginMultichoice.hide()
                    me._ownerDialog && me._ownerDialog.show();

                    me.getElement('userName').value = result.username;
                    me.getElement('isPhone').value = 'false';
                    if (me.config.loginMerge && me.getElement('loginMerge')) {
                        me.getElement('loginMerge').value = '';
                    }

                    if (me.currentLoginType == 'sms') {
                        me.getElement('smsHiddenFields_switchuname').value = result.username;

                        me._submitSmsForm();
                    } else {
                        if (!me.config.loginMerge) {//如果还是老版的普通登录和手机号登录分开的话则恢复数据
                            me._collectData();
                            me.switchTo('normal')
                            me._restoreData('phone')
                        }

                        me.submit();
                    }
                },
                onHide: function() {
                    me.getElement('userName').value = rspData.userName;
                    me.getElement('isPhone').value = '';
                }
            })
            loginMultichoice.show();
        })
    }
    function webToClientAction(options) {
        var me = this,
                swfId = me.$getId('pass_b2c_swf'),
                rspData = options.args.rsp.data,
                flashInfo = get_flash_info();
        var ishit = 0;
        if (rspData && rspData.bckv) {
            ishit = parseInt(rspData.bckv, 10) > 0;
        }
        var flash = null;
        passport.CONSTANT = passport.CONSTANT || {};
        passport.CONSTANT.b2c_getlogin = function(info) {
        };
        passport.CONSTANT.b2c_setlogin = function() {
            /**
             * 设置 passport_b2c_getlogin 可以取得的值
             */
            var b2cinfo = {
                kv: rspData.bckv,
                sync: rspData.bcsync,
                checksum: rspData.bcchecksum,
                time: rspData.bctime
            };

            try {
                if (flash) {
                    var status = flash.get_movie(swfId, "b2c_setlogin").b2c_setlogin(b2cinfo);
                    try {
                        /**
                         * 稳定性采集
                         */
                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = [_domain , "/v2/b2c-stable?",
                            "http://passport.baidu.com/passApi/js/hooks/from=setlogin.done",
                            "&checksum=", b2cinfo.checksum,
                            "&time=", b2cinfo.time,
                            "&status=", encodeURIComponent(status)
                        ].join("");
                        document.getElementsByTagName("head")[0].appendChild(script);
                    } catch (e) {
                        // catch
                    }
                }
            } catch (e) {
                try {
                    /**
                     * 稳定性采集
                     */
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = [_domain , "/v2/b2c-stable?",
                        "http://passport.baidu.com/passApi/js/hooks/from=setlogin.fail",
                        "&msg=", encodeURI(e.message)
                    ].join("");
                    document.getElementsByTagName("head")[0].appendChild(script);
                } catch (e) {
                    // catch
                }
            }
        };
        if (me.getElement('pass_b2c') && flashInfo.isexists && ishit) {
            //<editor-fold defaultstate="collapsed" desc="flash">
            var create_flash = function(options) {
                var get_html = function(options) {
                    options = options || {};
                    var i;
                    var k;
                    var len;
                    var item;
                    var tmpOpt = {};
                    var encodeHTML = function(str) {
                        return str.replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/"/g, "&quot;")
                                .replace(/'/g, "&#39;");
                    };

                    // 复制options，避免修改原对象
                    for (k in options) {
                        tmpOpt[k] = options[k];
                    }
                    options = tmpOpt;

                    var vars = options['vars'],
                            objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];

                    // 初始化object标签需要的classid、codebase属性值
                    options['align'] = options['align'] || 'middle';
                    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
                    options['codebase'] = 'https://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
                    options['movie'] = options['url'] || '';
                    delete options['vars'];
                    delete options['url'];

                    // 初始化flashvars参数的值
                    if ("string" === typeof vars) {
                        options["flashvars"] = vars;
                    } else {
                        var fvars = [];
                        for (k in vars) {
                            item = vars[k];
                            fvars.push(k + "=" + encodeURIComponent(item));
                        }
                        options["flashvars"] = fvars.join('&');
                    }

                    // 构建IE下支持的object字符串，包括属性和参数列表
                    var str = ['<object '];
                    for (i = 0, len = objProperties.length; i < len; i++) {
                        item = objProperties[i];
                        str.push(' ', item, '="', encodeHTML(options[item]), '"');
                    }
                    str.push('>');
                    var params = {
                        'wmode': 1,
                        'scale': 1,
                        'quality': 1,
                        'play': 1,
                        'loop': 1,
                        'menu': 1,
                        'salign': 1,
                        'bgcolor': 1,
                        'base': 1,
                        'allowscriptaccess': 1,
                        'allownetworking': 1,
                        'allowfullscreen': 1,
                        'seamlesstabbing': 1,
                        'devicefont': 1,
                        'swliveconnect': 1,
                        'flashvars': 1,
                        'movie': 1
                    };

                    for (k in options) {
                        item = options[k];
                        k = k.toLowerCase();
                        if (params[k] && (item || item === false || item === 0)) {
                            str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
                        }
                    }

                    // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
                    options['src'] = options['movie'];
                    options['name'] = options['id'];
                    delete options['id'];
                    delete options['movie'];
                    delete options['classid'];
                    delete options['codebase'];
                    options['type'] = 'application/x-shockwave-flash';
                    options['pluginspage'] = 'https://www.macromedia.com/go/getflashplayer';


                    // 构建embed标签的字符串
                    str.push('<embed');
                    // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
                    // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
                    var salign;
                    for (k in options) {
                        item = options[k];
                        if (item || item === false || item === 0) {
                            if ((new RegExp("^salign\x24", "i")).test(k)) {
                                salign = item;
                                continue;
                            }

                            str.push(' ', k, '="', encodeHTML(item), '"');
                        }
                    }

                    if (salign) {
                        str.push(' salign="', encodeHTML(salign), '"');
                    }
                    str.push('></embed></object>');

                    return str.join('');
                };

                var create = function(options) {
                    options = options || {};
                    var e = document.createElement('div');
                    e.innerHTML = get_html(options);
                    e.style.display = 'none';
                    document.getElementsByTagName("body")[0].appendChild(e);
                };

                //IE1-7版本
                var _passLowerIE = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
                if ((_passLowerIE>7) || !_passLowerIE) {
                    create(options)
                }

                return {
                    get_movie: function(name, func) {
                        //ie9下, Object标签和embed标签嵌套的方式生成flash时,
                        //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
                        var movie = document[name];
                        if (document.documentMode === 9
                                && movie && movie.length) {
                            var size = movie.length;
                            for (var i = 0; i < size; i++) {
                                var item = movie[i];
                                if (item.tagName.toLowerCase() === "embed") {
                                    movie = item;
                                    break;
                                }
                            }
                        }
                        if (func) {
                            if (typeof (movie[func]) !== "function") {
                                movie = document.getElementById(name);
                            }
                        }
                        return movie;
                    }
                };
            };
            //</editor-fold>
            try {
                var protocol = window.location.protocol.toLowerCase();
                flash = create_flash({
                    id: swfId,
                    width: '1',
                    height: '1',
                    url: protocol + '//passport.baidu.com/passApi/swf/b2c.swf?_t=' + Math.random(),
                    allowscriptaccess: "always"
                });
            } catch (e) {
                // catch
            }

        }

        passport.data.request.load(_domain + '/v2/b2c-flash?isexists=' + encodeURIComponent(flashInfo.isexists) + '&ver=' + encodeURIComponent(flashInfo.ver) + '&filename=' + encodeURIComponent(flashInfo.filename))
    }
    function rebindGuideAction(options) {
        var me = this,
            rspData = options.rspData,
            apiOptData = options.args.rsp.data;
        if(me.rebindGuideWidget){
            me.rebindGuideWidget.show();
            return;
        }
        passport.use('uni_rebindGuide', {
            tangram: true
        },function(){
            me.rebindGuideWidget = new passport.pop.rebindGuideWidget({
                color: me.config.color || 'blue',
                apiOpt:apiOptData,
                rebindType:'rebindPhone',
                onrebindGuideCompleted:function(){
                    loginSuccessed(me, rspData);
                }
            });
            me.rebindGuideWidget.show();
        })
    }

    function setPwdAction(options) {
        var me = this,
            cfg = options.cfg,
            args = options.args,
            rspData = options.rspData.rsp.data || {};
        passport._load(_domain + _bizMods[uni_wrapper], true, function() {
            if (!setPwd) {
                setPwd = passport.pop.init({
                    type: 'accSetPwd',
                    tangram: true,
                    color: me.config.color || 'blue',
                    apiOpt: {
                        u: me.config.u,
                        product: me.config.product,
                        authsid: rspData.authsid || '',
                        bdstoken: rspData.bdstoken || '',
                        staticPage: me.config.staticPage
                    },
                    onHide: function() {
                        if(rspData.setpwdswitch != '1'){
                            args.isCompleted = true;
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    },
                    onSubmitSuccess: function(self, result) {
                        args.isCompleted = true;
                        if(args && args.rsp && args.rsp.errInfo){
                            args.rsp.errInfo.no = '0'
                        }
                        if(rspData.hao123Param) {
                            loginCrossToHao123(rspData.hao123Param, me);
                        }
                        setPwd.hide();
                        cfg.onCancel && cfg.onCancel(args);
                    }
                })
                setPwd.show();
            } else {
                if(setPwd.setMakeOption){
                    setPwd.setMakeOption(rspData.authsid,rspData.bdstoken);
                }
                setPwd.show();
            }
        })
    }

    function setUnamePwdAction(options) {
        var me = this,
            cfg = options.cfg,
            args = options.args,
            rspData = options.rspData.rsp.data || {};
        passport._load(_domain + _bizMods[uni_wrapper], true, function() {
            if (!setUnamePwd) {
                setUnamePwd = passport.pop.init({
                    type: 'accSetPwd',
                    tangram: true,
                    color: me.config.color || 'blue',
                    jumpset: rspData.jumpset == "1" ? 1 : 0,
                    apiOpt: {
                        u: me.config.u,
                        product: me.config.product,
                        authsid: rspData.authsid || '',
                        bdstoken: rspData.bdstoken || '',
                        username: 1,
                        staticPage: me.config.staticPage
                    },
                    onHide: function(){
                        if(rspData.jumpset == '1'){
                            args.isCompleted = true;
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    },
                    onSubmitSuccess: function(self, result) {
                        args.isCompleted = true;
                        if(args && args.rsp && args.rsp.errInfo){
                            args.rsp.errInfo.no = '0'
                        }
                        if(rspData.hao123Param) {
                            loginCrossToHao123(rspData.hao123Param, me);
                        }
                        setUnamePwd.hide();
                        cfg.onCancel && cfg.onCancel(args);
                    }
                })
                setUnamePwd.show();
            } else {
                if(setUnamePwd.setMakeOption){
                    setUnamePwd.setMakeOption(rspData.authsid,rspData.bdstoken);
                }
                setUnamePwd.show();
            }
        })
    }

    function secondCardAction(options) {
        var me = this;
        var cfg = options.cfg;
        var args = options.args;
        var rspData = options.rspData.rsp.data || {};
        var showselect = (args.rsp.errInfo.no === '400413' && options.rspData.rsp.loginType === 'sms') ? '1' : '0';
        passport._load(_domain + _bizMods[uni_wrapper], true, function () {
            if (!secondCard) {
                secondCard = passport.pop.init({
                    type: 'secondCardVerify',
                    tangram: true,
                    color: me.config.color || 'blue',
                    apiOpt: {
                        u: me.config.u,
                        product: me.config.product,
                        lstr: rspData.lstr || '',
                        ltoken: rspData.ltoken || '',
                        token: rspData.authtoken || '',
                        staticPage: me.config.staticPage,
                        select: showselect,
                        scscene: rspData.scscene || '',
                        scnewuser: rspData.scnewuser || '',
                        loginType: options.rspData.rsp.loginType,
                        loginproxy: rspData.loginproxy || ''
                    },
                    onloginSuccess: function () {
                        args.isCompleted = true;
                        if (args && args.rsp && args.rsp.errInfo) {
                            args.rsp.errInfo.no = '0';
                        }
                        if (rspData.hao123Param) {
                            loginCrossToHao123(rspData.hao123Param, me);
                        }
                        secondCard.hide();
                        cfg.onCancel && cfg.onCancel(args);
                    },
                    onSubmitSuccess: function (self, result) {
                        if (result.rsp.data.loginproxy) {
                            passport.data.jsonp(result.rsp.data.loginproxy).success(function (proxyrsp) {
                                if (proxyrsp.errInfo.no === '0') {
                                    document.location.href = 'https://passport.baidu.com/v3/security/main/secondcardmodifyaccinfo?tpl='
                                    + me.config.product + '&bdstoken=' + result.rsp.data.bdstoken + '&authsid=' + result.rsp.data.mod_authsid
                                    + '&u=' + encodeURIComponent(proxyrsp.data.u) + '&loginType=' + result.rsp.data.loginType
                                    + '&hasUsername=' + result.rsp.data.hasUsername;
                                } else {
                                    self.target.getElement('secondCardError').innerHTML = me.lang.sysError;
                                }
                            });
                        }
                    }
                });
                secondCard.show();
            } else {
                if (secondCard.reRender) {
                    secondCard.reRender({
                        lstr: rspData.lstr || '',
                        ltoken: rspData.ltoken || '',
                        token: rspData.authtoken || '',
                        loginproxy: rspData.loginproxy || '',
                        select: showselect,
                        loginType: options.rspData.rsp.loginType
                    });
                }
                secondCard.show();
            }
        });
    }

    function connectAction(options) {
        var me = this;
        options.rspData = options.rspData || {};
        passport._load(_domain + _bizMods[connectModName], true, function() {
            if (!connect) {
                connect = passport.pop.init({
                    type: 'accConnect',
                    tangram: true,
                    color: me.config.color || '',
                    apiOpt: {
                        u: me.config.u,
                        adtext: options.rspData.adtext,
                        product: me.config.product,
                        token: options.rspData.token,
                        staticPage: me.config.staticPage
                    },
                    onConnectSuccess: function(rsp) {
                        var d = rsp.rsp;
                        d.connect = connect;
                        loginSuccessed(me, {rsp: d});
                        rsp.returnValue = false;
                    }
                })
                connect.show();
            } else {
                connect.setToken(options.rspData.token, function() {
                    connect.show()
                })
            }
        })
    }
    // 实名认证以及验证之后实名认证
    function realNameAction(options) {
        var me = this;
        var cfg = options.cfg;
        var args = options.args;
        options.rspData = options.rspData || {};
        passport._load(_domain + _bizMods[uni_wrapper], true, function() {
            if (!realName) {
                realName = passport.pop.init({
                    type: 'accRealName',
                    tangram: true,
                    color: me.config.color || '',
                    apiOpt: {
                        u: me.config.u,
                        product: me.config.product,
                        staticPage: me.config.staticPage,
                        action: 'login',
                        realnameswitch: options.rspData.realnameswitch,
                        authsid: options.rspData.realnameauthsid,
                        ltoken: options.rspData.ltoken,
                        lstr: options.rspData.lstr,
                        cu: options.rspData.u,
                        overseas: me.config.overseas
                    },
                    onHide: function() {
                        var returnValue = me.fire('RealHide', args);
                        if (options.rspData.realnameswitch != '1') {
                            args.isCompleted = true;
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    },
                    onverifyHide: function (authsid) {
                        if (!me.realLoginHide) {
                            if (options.rspData.loginproxy && authsid) {
                                passport.data.jsonp(options.rspData.loginproxy + '&authsid=' + authsid).success(function (result) {
                                    if (result.errInfo.no == 0) {
                                        args.isCompleted = true;
                                        cfg.onCompleted && cfg.onCompleted(result, function () {
                                            cfg.onCancel && cfg.onCancel(args);
                                        });
                                    } else {
                                        me._ownerDialog && me._ownerDialog.show();
                                        me.getElement('error').innerHTML = me.lang.sysError;
                                    }
                                });
                            } else {
                                args.isCompleted = true;
                                if (options.rspData.hao123Param && options.rspData.realnameswitch == '1') {
                                    loginCrossToHao123(options.rspData.hao123Param, me);
                                }
                                cfg.onCancel && cfg.onCancel(args);
                            }
                        }
                    },
                    // TODO 引导绑定实名手机请求成功后的回调
                    onSubmitSuccess: function (self, result) {
                        if (options.rspData.loginproxy && result.rsp.data.authsid) {
                            passport.data.jsonp(options.rspData.loginproxy + '&authsid=' + result.rsp.data.authsid)
                            .success(function (result) {
                                if (+result.errInfo.no === 0) {
                                    args.isCompleted = true;
                                    me.realLoginHide = true;
                                    realName.hide();
                                    // 引导绑定手机
                                    if (+result.data.guideUpgradeMobile === 1) {
                                        guideToBindMobile.call(me, result, args);
                                        return;
                                    }
                                    cfg.onCompleted && cfg.onCompleted(result, function () {
                                        cfg.onCancel && cfg.onCancel(args);
                                    });
                                } else {
                                    realName.hide();
                                    me._ownerDialog && me._ownerDialog.show();
                                    me.getElement('error').innerHTML = me.lang.sysError;
                                }
                            });
                        } else {
                            args.isCompleted = true;
                            if (args && args.rsp && args.rsp.errInfo) {
                                args.rsp.errInfo.no = '0';
                            }
                            if (options.rspData.hao123Param && options.rspData.realnameswitch + '' === '1') {
                                loginCrossToHao123(options.rspData.hao123Param, me);
                            }
                            me.realLoginHide = true;
                            realName.hide();
                            cfg.onCancel && cfg.onCancel(args);
                        }
                    }
                });
                realName.show();
            } else {
                realName.show();
            }
        });
    }

    // 引导绑定手机
    function guideToBindMobile(options, args) {
        var me = this;
        passport._load(_domain + _bizMods[uni_wrapper], true, function () {
            var bindGuide = passport.pop.init({
                type: 'bindGuide',
                tangram: true,
                color: me.config.color || '',
                apiOpt: {
                    u: me.config.u,
                    product: me.config.product,
                    staticPage: me.config.staticPage,
                    action: 'login',
                    realnameswitch: options.data.realnameswitch,
                    authsid: options.data.realnameauthsid,
                    ltoken: options.data.ltoken,
                    upgradeMobileToken: options.data.upgradeMobileToken,
                    bindMobileToken: options.data.bind_mobile_token,
                    lstr: options.data.lstr,
                    cu: options.data.u,
                    overseas: me.config.overseas,
                    tip: '为了您的账号安全，建议设置为绑定手机号',
                    successTip: options.data.upgradeMobile + '验证成功'
                },
                onSubmitSuccess: function () {
                    bindGuide.hide();
                    loginSuccessed(me, args);
                },
                onHide: function () {
                    loginSuccessed(me, args);
                }
            });
            bindGuide.show();
        });
    }

    // 待验证手机去验证逻辑
    function confirmMobileAction(options) {
        var me = this;
        var cfg = options.cfg;
        var args = options.args;
        options.rspData = options.rspData || {};
        passport._load(_domain + _bizMods[uni_wrapper], true, function () {
            if (!confirmMobile) {
                confirmMobile = passport.pop.init({
                    type: 'bindGuide',
                    tangram: true,
                    color: me.config.color || '',
                    apiOpt: {
                        type: 'verify',
                        u: me.config.u,
                        product: me.config.product,
                        staticPage: me.config.staticPage,
                        action: 'login',
                        realnameswitch: options.rspData.realnameswitch,
                        authsid: options.rspData.realnameauthsid,
                        ltoken: options.rspData.ltoken,
                        upgradeMobileToken: options.rspData.upgrade_mobile_token,
                        bindMobileToken: options.rspData.bind_mobile_token,
                        lstr: options.rspData.lstr,
                        cu: options.rspData.u,
                        overseas: me.config.overseas,
                        tip: '检测到您有待验证手机 '
                        + (options.rspData.upgrade_mobile || '')
                        + '，建议设置为绑定手机',
                        successTip: '登录成功'
                    },
                    onSubmitSuccess: function () {
                        confirmMobile.hide();
                        loginSuccessed(me, args);
                    },
                    onHide: function () {
                        loginSuccessed(me, args);
                    }
                });
                confirmMobile.show();
            } else {
                confirmMobile.show();
            }
        });
    }

    function hookPopBiz(api, args, cfg) {
        var errNo = args.rsp.errInfo.no;
        var rspData = args.rsp.data;
        cfg = cfg || {};
        var isRiskCheat = rspData && (rspData.secstate === 'risk' || rspData.secstate === 'cheat');

        if (rspData && rspData.connectType && api.config.connect) {
            var returnValue = api.fire('beforeWarning', {
                args: args
            });
            if (!returnValue)
                return;
            // 隐藏错误信息
            api.getElement('error').innerHTML = '';

            // 如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');
            // 引用CSS ， 如果引用一次不会再引用
            loadCssFile(_domain + '/passApi/css/uni_accConnect.css');


            connectAction.apply(api, [{
                args: args,
                rspData: rspData,
                cfg: cfg,
                errno: errNo
            }]);

            return false;
        }

        if (+errNo === 18) {
            // 帐号实名化
            // 隐藏错误信息
            api.getElement('error').innerHTML = '';
            // 如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            realNameAction.apply(api, [{
                args: args,
                rspData: rspData,
                cfg: cfg,
                errno: errNo
            }]);
            if (rspData.hao123Param && rspData.realnameswitch + '' !== '1') {
                loginCrossToHao123(rspData.hao123Param, api);
            }

            return false;
        }

        // 有待验证手机需要验证
        if (+rspData.guide_upgrade_mobile === 1) {
            api.getElement('error').innerHTML = '';
            // 如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            confirmMobileAction.call(api, {
                args: args,
                rspData: rspData,
                cfg: cfg,
                errno: errNo
            });
            if (rspData.hao123Param && rspData.realnameswitch + '' !== '1') {
                loginCrossToHao123(rspData.hao123Param, api);
            }

            return false;
        }

        if (+errNo === 20) {
            //设置密码

            var returnValue = api.fire("beforeWarning", args);
            if (!returnValue) return;
            //隐藏错误信息
            if (api.getElement('error')) {
                api.getElement('error').innerHTML = '';
            }
            if (api.getElement('smsError')) {
                api.getElement('smsError').innerHTML = '';
            }
            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            setPwdAction.apply(api, [{
                    args: args,
                    rspData: args,
                    cfg: cfg
                }])
            if (rspData.hao123Param && rspData.setpwdswitch != '1') {
                //非真实性帐号引导用户绑定
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }
        if (+errNo === 22) {
            //设置用户名密码

            var returnValue = api.fire("beforeWarning", args);
            if (!returnValue) return;
            //隐藏错误信息
            if (api.getElement('error')) {
                api.getElement('error').innerHTML = '';
            }
            if (api.getElement('smsError')) {
                api.getElement('smsError').innerHTML = '';
            }
            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');
            setUnamePwdAction.apply(api, [{
                    args: args,
                    rspData: args,
                    cfg: cfg
                }])
            if (rspData.hao123Param) {
                //非真实性帐号引导用户绑定
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }
        if (errNo === '400413' || errNo === '400414') {
            // 二次卡
            var returnValue = api.fire('beforeWarning', args);
            if (!returnValue) {
                return;
            }
            // 隐藏错误信息
            if (api.getElement('error')) {
                api.getElement('error').innerHTML = '';
            }
            if (api.getElement('smsError')) {
                api.getElement('smsError').innerHTML = '';
            }
            // 如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            secondCardAction.apply(api, [{
                    args: args,
                    rspData: args,
                    cfg: cfg
                }]);
            if (rspData.hao123Param) {
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }

        if (errNo == 19) {
            var me=this;
            var rspData = args.rsp.data;

            var returnValue = api.fire("beforeWarning", args);
                if (!returnValue) {
                    return
                }
                api.getElement("error").innerHTML = "";
                api._ownerDialog && api._ownerDialog.hide("unHide");
            if(me.confirmWidgetLabel==null){
                passport._load(_domain + '/passApi/js/uni_wrapper.js',true,function(){
                    me.confirmWidgetLabel=passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                width:430,
                                height:150,
                                apiOpt: {
                                    contentHTML:"\
                                        <div class='pass-confirmContent-wrapper-Label'>\
                                            <div class='pass-confirmContent-msg-Label'><span class='img-class' ></span></div>\
                                            <ul  class='pass-confirmContent-descmsg-Label' style='margin-left:20px;'>\
                                                <p>近日，某邮箱帐户存在被破解的可能性，建议您使用其他</p>\
                                                <p>邮箱绑定百度帐号，或及时修改您的百度帐号登陆密码并</p>\
                                                <p>绑定手机，以确保帐户安全。</p>\
                                            </ul>\
                                        </div>"
                                },
                                onConfirmClose:function(evt){
                                    me.confirmWidgetLabel.hide();
                                    loginSuccessed(api,args);
                                    //window.location.href=args.rsp.data.u;
                                },
                                onRender:function(evt){
                                    me.confirmWidgetLabel.getElement('confirm_cancel').style.display='none';
                                    me.confirmWidgetLabel.getElement('confirm_continue').style.display='none';
                                    me.confirmWidgetLabel.getElement('confirmWidget_footer').style.display='none';

                                }

                            });

                me.confirmWidgetLabel.show();
            });
            }else{
                me.confirmWidgetLabel.show();
            }
            if (rspData.hao123Param) {
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }

        if (errNo == 23) {
            var me=this;
            var rspData = args.rsp.data;

            var returnValue = api.fire("beforeWarning", args);
                if (!returnValue) {
                    return
                }
                api.getElement("error").innerHTML = "";
                api._ownerDialog && api._ownerDialog.hide("unHide");
            function sureVerify(type){
                var img = new Image();
                img.onload = img.onerror = function() {
                    img.onload = img.onerror = null;
                    img = null
                };
                img.src = _domain+'/img/v.gif?type='+type+'&tt='+ new Date().getTime();
                args.isCompleted = true;
                if(rspData.hao123Param) {
                    loginCrossToHao123(rspData.hao123Param, api);
                }
                me.confirmWidgetMobileSure.hide();
                cfg.onCancel && cfg.onCancel(args);
            }
            if(me.confirmWidgetMobileSure==null){
                passport._load(_domain + '/passApi/js/uni_wrapper.js',true,function(){
                    me.confirmWidgetMobileSure=passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                titleText: '非常重要',
                                width:430,
                                apiOpt: {
                                    Cancel:'不需要解绑',
                                    Continue: '申诉去解绑',
                                    contentHTML: '<div class="pass-confirmContent-wrapper-sureConfirm">'
                                                + '<div class="pass-confirmContent-wrapper-msg"><p><span class="pass-confirmContent-redcolor" id="pass-mobile-sure-num">'+rspData.phoneNumber+'</span>是您绑定的手机号,请确认该手机号是否还在使用,为了帐号安全请及时解绑不使用的手机。</p></div>'
                                                +'<div class="pass-confirmwidget-bottom">'
                                                    +'<span id="pass-mobile-sure-btn" class="pass-button pass-button-grey cancel">不需要解绑</span>'
                                                    +'<a href="'+rspData.appealurl+'" id="pass-appeal-btn" class="pass-button pass-button-grey continue" target="new">申诉去解绑</a>'
                                                +'</div></div>'
                                },
                                onRender:function(evt){
                                    me.confirmWidgetMobileSure.getElement('confirm_cancel').style.display='none';
                                    me.confirmWidgetMobileSure.getElement('confirm_continue').style.display='none';
                                    me.confirmWidgetMobileSure.getElement('confirmWidget_footer').style.display='none';

                                    baidu(document.getElementById('pass-mobile-sure-btn')).on('click',function(){
                                        sureVerify("mobileSurePC");
                                    });
                                    baidu(document.getElementById('pass-appeal-btn')).on('click',function(){
                                        sureVerify("appealMobilePC");
                                    });
                                },
                                onConfirmClose:function(evt){
                                    sureVerify("mobileSureClosePC");
                                },
                                onConfirmContinue:function(evt){

                                },
                                onConfirmCancel:function(evt){

                                }

                    });

                    me.confirmWidgetMobileSure.show();
                });
            }else{
                if(document.getElementById('pass-mobile-sure-num')){
                    document.getElementById('pass-mobile-sure-num').html = (rspData.phoneNumber || '');
                }
                me.confirmWidgetMobileSure.show();
            }
            if (rspData.hao123Param) {
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }

        if (errNo == 401007) {
            //多帐号选择用户名

            var returnValue = api.fire("beforeWarning", args);
            if (!returnValue)
                return;
            //隐藏错误信息
            api.getElement('error').innerHTML = '';
            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            multiChoiceAction.apply(api, [{
                    rspData: rspData
                }])
            return false;
        }

        if (errNo == 120016 || errNo == 400032 || errNo == 400034) {
            //绑定控件

            var returnValue = api.fire("beforeWarning", args);
            if (!returnValue)
                return;
            //隐藏错误信息
            api.getElement('error').innerHTML = '';

            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            //根据不同的配置调用绑定控件
            bindAction.apply(api, [{
                    errno: errNo,
                    args: args,
                    cfg: cfg
                }])

            if (rspData.hao123Param) {
                //非真实性帐号引导用户绑定
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }

        if (errNo == 5 || errNo == 400031 || errNo == 120019 || errNo == 120021 || errNo == 400023 || isRiskCheat) {
            //验证控件
            var forceverifyLoginverify = null,
                    forceverifyRiskReal = null,
                    forceverifyRisk = null;

            var returnValue = api.fire("beforeWarning", {
                args: args
            });
            if (!returnValue)
                return;

            //隐藏错误信息
            if (api.getElement('error')) {
                api.getElement('error').innerHTML = '';
            }

            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            //引用CSS ， 如果引用一次不会再引用
            loadCssFile(_domain + '/passApi/css/uni_forceverify.css');

            verifyAction.apply(api, [{
                    args: args,
                    rspData: rspData,
                    cfg: cfg,
                    errno: ((isRiskCheat && errNo != 120021) ? 'riskCheat' : errNo)
                }])

            return false;
        }

        if (errNo == 400037) {
            //引导用户换绑

            var returnValue = api.fire("beforeWarning", args);
            if (!returnValue)
                return;
            //隐藏错误信息
            api.getElement('error').innerHTML = '';
            //如果是弹层登录，则干掉当前弹层
            api._ownerDialog && api._ownerDialog.hide('unHide');

            rebindGuideAction.apply(api, [{
                    args: args,
                    rspData: args,
                    cfg: cfg
                }])
            if (rspData.hao123Param) {
                //非真实性帐号引导用户绑定
                loginCrossToHao123(rspData.hao123Param, api);
            }
            return false;
        }



        return true;
    }
    function loadCssFile(url) {
        if (!_loadedCssFiles[url]) {
            _loadedCssFiles[url] = true;
            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.type = "text/css";
            l.href = url;
            document.getElementsByTagName("head")[0].appendChild(l);
        }
        return true;
    }
    ns.login = {
        loginSuccess: function (api, args) {
            // 同步web登录状态到PC client
            var isIE = /msie (\d+\.\d+)/i.test(navigator.userAgent);
            if (api.config.setWebToClient && !isIE) {
                webToClientAction.apply(api, [{args: args}]);
            }

            // 同步hao123状态
            if (api.config.noSynBdu && api.config.noSynBdu === 1) {
                var hasHiz = hookPopBiz(api, args, {
                    onCancel: function() {
                        loginSuccessed(api, args);
                    }
                });
                if (hasHiz) {
                    loginSuccessed(api, args);
                }
            } else {
                loginCrossToHao123(args.rsp.data.hao123Param, api).success(function () {
                    var hasHiz = hookPopBiz(api, args, {
                        onCancel: function () {
                            loginSuccessed(api, args);
                        }
                    });
                    if (hasHiz) {
                        loginSuccessed(api, args);
                    }
                });
            }
            return {preventEvent: true, preventDefault: true};
        },
        loginError: function(api, args) {
            hookPopBiz(api, args, {
                onCompleted: function(rsp, callbacks) {
                    if (api.config.noSynBdu && api.config.noSynBdu === 1) {
                        callbacks();
                    } else {
                        loginCrossToHao123(rsp.data.hao123Param, api).success(callbacks);
                    }
                },
                onCancel: function(args) {
                    if (args && args.isCompleted) {
                        loginSuccessed(api, {rsp: args.rsp});
                    }
                }
            });
            return {preventEvent: false, preventDefault: false};
        },
        connectNeedBind: function(api, args) {
            hookPopBiz(api, args, {
                onCompleted: function(rsp, callbacks) {

                },
                onCancel: function(args) {

                }
            });
            return {preventEvent: false, preventDefault: false};
        },
        validateAllError: function(api, ele) {
            var $ele = ele.validates ? api.getElement(ele.validates[ele.validates.length - 1].field) : '';
            if ($ele && $ele.focus) {
                $ele.focus()
            }
            return {preventEvent: false, preventDefault: false};
        }
    };
})(passport.hook);

///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 帐号实名化
 * @class
 * @name magic.passport.accRealName
 * @grammar new magic.passport.accRealName(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.accRealName} magic.passport.accRealName 实例
 * @superClass magic.passport
 */
/* globals magic, passport, confirmVerifyWidget */
magic.passport.accRealName = baidu.lang.createClass(function(options){
	var me = this;
	me.action = '';
    me.verify_rsp = {};
	me.init_errno = '';
    me.isverify = false;
    me.verify_authsid = '';
	me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'staticFile': (document.location.protocol.toLowerCase() === 'https:') ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv' : 'http://passport.bdimg.com/',
        'auto': (document.location.protocol.toLowerCase() === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'
	};
	me.config = {
		product: '',//string,产品线TPL
		charset: '',
		token : '',
        overseas: '',
		hasPlaceholder:true,
		staticPage: '',//string,静态跳转文件
		u: '',
		lang: 'zh-CN',
        action: '',
        authsid: '',
        ltoken: '',
        lstr: '',
        cu: '',
        sdk_version: '',
        clientfrom: '',
        client: ''
	};

	baidu.extend(me.config, options);


	this.module = 'accRealName';
	me.constant = {
		CHECKVERIFYCODE:true,
		CONTAINER_CLASS: 'tang-pass-accRealName',
		LABEL_FOCUS_CLASS: 'pass-text-label-focus',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error',
		DISABLED_CLASS :'pass-item-time-timing',
		CHECK_CLASS: "pass-user-list-check",
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
		BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime()),
		GET_PASSWORD_URL : me._domain.https+'/?getpassindex&tpl=' + encodeURIComponent(me.config.product) + '&u=' + encodeURIComponent(me.config.u)

	};
    me.lang = passport.err.getCurrent().labelText.accRealName;
    window.confirmVerifyWidget = null;

    me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
    // 是否加载默认CSS
    if (me.config.defaultCss) {
    // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
        me.loadCssFileW('accRealName.css'/*tpa=http://passport.baidu.com/passApi/css/accRealName.css*/, function () {
        });
    }
},{
    type: "magic.passport.accRealName",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			loginSuccessTip : '<p class="pass-realName-title pass-realName-loginStitle">'+me.lang.loginSuccessTip+'</p>',
			tip: '<p class="pass-realName-tip">'+me.lang.tip+'</p>',

			generalError: '<p id="'+me.$getId('realNameErrorWrapper')+'" class="pass-generalErrorWrapper">'+
						  	 '<span id="'+me.$getId('realNameError')+'" class="pass-generalError pass-generalError-error"></span>'+
						  '</p>',

			mobile : '<p id="'+me.$getId('realNameMobileWrapper')+'" class="pass-form-item pass-form-item-mobile">'+
                    '<label for="'+me.$getId('realNameMobile')+'" id="'+me.$getId('realNameMobileLabel')+'" class="pass-label pass-label-mobile"></label>'+
                    '<input id="'+me.$getId('realNameMobile')+'" type="text" name="realNameMobile" class="pass-text-input pass-text-input-mobile" />'+
                '</p>',
            mobileOversea: '<p id="' + me.$getId('realNameMobileWrapper') + '" class="pass-form-item pass-form-item-mobile pass-form-item-overseas">'
                    + '<label id="select-countrycode" class="label-input-code">+86</label><label for="' + me.$getId('realNameMobile') + '" id="' + me.$getId('realNameMobileLabel') + '" class="pass-label pass-label-mobile"></label>'
                    + '<input id="' + me.$getId('realNameMobile') + '" type="text" name="realNameMobile" class="pass-text-input pass-text-input-mobile pass-text-input-oversea" /></p>',
            countrycode: '<div><ul id="codelist-code-ul" class="codelist-code-ul"></ul></div>',
			verifyCode : '<p id="'+me.$getId('realNameVerifyCodeWrapper')+'" class="pass-form-item pass-form-item-verifyCode">'+
		                    	'<label for="'+me.$getId('realNameVerifyCode')+'" id="'+me.$getId('realNameVerifyCodeLabel')+'" class="pass-label pass-label-realNameVerifyCode"></label>'+
		                    	'<input id="'+me.$getId('realNameVerifyCode')+'" type="text" name="realNameVerifyCode" class="pass-text-input pass-text-input-realNameVerifyCode" />'+
		                    	'<input id="'+me.$getId('verifyCodeSend')+'" type="button" class="pass-item-timer" value="'+me.lang.sendRealNameVerifyCode+'"/>'+
		                    	'<span id="'+me.$getId('smsVerifyCodeTip')+'" class="pass-item-tip pass-item-tip-smsVerifyCode" style="display:none"><span id="'+me.$getId('realNameVerifyCodeTipText')+'"></span></span>'+
		                	'</p>',
            verify_already: '<div class="pass-form-realname-logo"></div>'
                            + '<p class="pass-form-realname-tip">你已完成帐号实名</p>'
                            + '<p class="pass-form-realname-tip1 p-t10">你的帐号' + me.displayname + '</p>'
                            + '<p class="pass-form-realname-tip1">已通过手机' + me.verifymobile + '完成实名，符合国家</p>'
                            + '<p class="pass-form-realname-tip1">实名制政策，请放心使用百度服务</p>',
		   	not_login: '<div class="pass-form-realname-notlogin"></div>'+
		    				'<p class="pass-form-realname-tip">' + me.lang.realname_notlogin_tip1 + '</p>'+
		    				'<p class="pass-form-realname-tip p-b70">' + me.lang.realname_notlogin_tip2 + '</p>',
			submit: '<p id="'+me.$getId('realNameSubmitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('realNameSubmit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit" />'+
                    '</p>',
            successBindResult: '<div class="pass-realName-bindSuccess" id="' + me.$getId('realNameSuccessContent') + '">'
                                + '<div class="pass-realname-tipimg"></div>'
                                    + '<p class="bindSuccess-tip1">' + me.lang.loginSuccessTip + '</p>'
                                    + '<p class="bindSuccess-tip2">' + me.lang.bindSuccess + '</p>'
                                    + '<p class="bindSuccess-tip2 p-b20">' + me.lang.bindSuccessTip + '</p>'
                                    + '<button id="' + me.$getId('realNameFinish')
                                    + '" class="pass-button pass-button-submit">' + me.lang.submit + '</button>'
                               + '</div>',
            footer: '<div class="pass-realname-footer clearfix">'
                    + '<span class="footer-notrecieve" id="' + me.$getId('noreciveVcode') + '">'
                    + me.lang.norecieveVcode + '</span>'
                        + '<div class="realname-footer-tip" id="' + me.$getId('noreciveTip') + '">'
                        + '<p>1、请确认该手机号是否为当前使用的手机号</p>'
                        + '<p>2、请检查短信是否被安全软件拦截</p>'
                        + '<p>3、由于运营商网络原因，短信可能延迟到达</p>'
                        + '<p>4、若手机号停用，请联系客服咨询</p>'
                        + '</div>'
                    + '</div>'
		}
		return template[field];
	},

	_getTemplate: function(action,opt){
		var me = this,
			templateStr = '<form id="'+me.$getId('form')+'" class="pass-form pass-form-realName" method="POST" autocomplete="off">',
			hiddenFields = {
                vcodesign: '',
                vcodestr: '',
				u: me.config.u,
				staticPage: me.config.staticPage
			}
		realNameRegularField = [{
				field: 'mobile',
				label:  '',
                noError: false
			}];
        templateStr += '<div id="' + me.$getId('realName_content') + '">';
		if(me.init_errno == '3') {
			templateStr += me._getIrregularField('verify_already');
		} else if (me.init_errno == '1') {
			templateStr += me._getIrregularField('not_login');
		} else {
			templateStr += me._getIrregularField('tip');
			templateStr += me._getIrregularField('generalError');
			templateStr += me._getHiddenField(hiddenFields);
			if(me.config.overseas === 1){
				templateStr += me._getIrregularField('mobileOversea');
			}else{
				templateStr += me._getIrregularField('mobile');
			}		
			templateStr += me._getIrregularField('verifyCode');
			if(me.config.overseas === 1){
				templateStr += me._getIrregularField('countrycode');
			}
			templateStr += me._getIrregularField('submit');
            templateStr += me._getIrregularField('footer');
        }
        templateStr += '</div>';
        templateStr += me._getIrregularField('successBindResult');
        templateStr += '</form>';
		return templateStr;
	},


	_setValidator: function(){
		var me = this;
        var countrycode;
        if (document.getElementById('select-countrycode')) {
            countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
        }
		// if(!me.validatorInited) {
			me.validatorInited = true;
			me.validateRules = {
				'realNameMobile': {
					rules:countrycode == '+86'||countrycode==undefined||countrycode=='' ? ['required','phoneformatReg'] : ['required','numformat'],
                    //rules: ["required", "mobile"],
					desc: me.lang.mobile
				},
				'realNameVerifyCode': {
					rules: ['required'],
					desc: me.lang.verifyCode
				}
			}

			me._validator.addRule('phoneformatReg',function(){
                var _value = me.getElement('realNameMobile').value;
                if (!/^1[3456789]\d{9}$/.test(_value)) {
                    return false;
                }
                return true;
            })
            me._validator.addMsg('phoneformatReg',"手机号码格式不正确");
            me._validator.addRule('numformat',function(){
                var _value = me.getElement('realNameMobile').value;
                if(!/^\d+$/.test(_value)){
                    return false;
                }
                return true;
            })
            me._validator.addMsg('numformat',"手机号码格式不正确");
			
			me._validator.init(me, me.validateRules);
		//}
	},
	
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		if(ele){
			ele.addClass(me.constant.ERROR_CLASS);
		}
		this.getElement('realNameError').innerHTML = info.msg;

		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		//me.clearGeneralError();
		this.getElement('realNameError').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
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
	getToken : function(callback){
		var me = this;
        var data = {};
        data.authsid = me.config.authsid;
        data.ltoken = me.config.ltoken;
        data.lstr = me.config.lstr;
        data.cu = me.config.cu;
        data.tpl = me.config.product;
        data.clientfrom = me.config.clientfrom;
        data.sdk_version = me.config.sdk_version;
        data.client = me.config.client;
        passport.data.jsonp('/v2/?realnamewidget-init&v=' + (new Date().getTime()), data)
		.success(function(rsp){
			if(rsp.errInfo.no === '0'){
				me.bdstoken = rsp.data.bdstoken;
                if (rsp.data.forbidOverseas === '1') {
                    me.config.overseas = 0;
                }
			} else if(rsp.errInfo.no == '1') {
				var returnValue = me.fireEvent('notloginAction');
			    if(!returnValue) return;
			} else if(rsp.errInfo.no == '3') {
                me.displayname = rsp.data.displayname;
                me.verifymobile = rsp.data.verifymobile;
				var returnValue = me.fireEvent('verifyalreadyAction');
			    if(!returnValue) return;
			}
			me.init_errno = rsp.errInfo.no;
			callback && callback(me);
		})
	},

	render: function(id,callback){
		var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        /* globals passport */
        if (me.config.traceid && me.config.traceid.length > 0) {
            passport.data.traceID && passport.data.traceID.initTraceID && passport.data.traceID.initTraceID(me.config.traceid);
        }
        
        me.getToken(me.render_template);
	},

	render_template: function(me) {
		var target = baidu(me.getElement());//baidu('#'+id);
        target.addClass(me.constant.CONTAINER_CLASS);

		var template = me._getTemplate();
		target.get(0).appendChild(baidu(template).get(0));

        var selectCountryCode=document.getElementById('select-countrycode');
        var internationState=0;
        var internationInit = function () {
            var str = '<li class="clearfix" data-value="">'
                + '<span class="left forgot-code">+86</span>'
                + '<span class="left font-code">大陆地区</span>'
                + '</li>';
            passport.data.jsonp('/v2/?securitygetcountrycode&v='+new Date().getTime(),{})
				.success(function(rsp){
					
						var data =  rsp.data.country;
                    baidu.each(data,function(i,k){
                        str += '<li class="clearfix" data-value="'+k['code']+'"><span class="left forgot-code">'+'+'+k['code'].substring(2)+'</span>'+'<span class="left font-code">'+k['name']+'</span>'+'</li>';
                    });
                    var ul = document.getElementById('codelist-code-ul');
                    ul.innerHTML=str;
					
				});
        }
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
		if(me.config.hasPlaceholder){
	        var rendList = [{
					        	label:'realNameMobile',
					        	placeholder:"mobilePlaceholder"
					        },{
					        	label:"realNameVerifyCode",
					        	placeholder:"verifyCodePlaceholder",
					        	clearbtn:0
					        }];
	        me._getPlaceholder(rendList)
        }
        me._setValidator();
		me._setEvent();
        baidu(me.getElement('noreciveVcode')).on('mouseover', function () {
            me.getElement('noreciveTip').style.display = 'block';
        });
        baidu(me.getElement('noreciveVcode')).on('mouseout', function () {
            me.getElement('noreciveTip').style.display = 'none';
        });
        baidu(me.getElement('realNameFinish')).on('click', function () {
            me.fireEvent('submitSuccess', {
                rsp: me.verify_rsp
            });
        });
	},
	disableSmsButton: function(){
		var me = this,
			ele = me.getElement('verifyCodeSend'),
			error = me.getElement('realNameError'),
			value = ele.value,
			timmer,
			counter = 60;
		baidu(ele).addClass(me.constant.DISABLED_CLASS);
		ele.disabled = true;
		if(error){
			error.innerHTML = '';
		}
        timmer = setTimeout(function () {
            if (--counter === 0) {
                ele.value = value;
                baidu(ele).removeClass(me.constant.DISABLED_CLASS);
                ele.disabled = false;
                return;
            };
            ele.value = me.lang.SMSKeyResendTip + '(' + counter + ')';
        }, 1000);
	},

    vcodeVerifyWidget: function (data) {
        var me = this;
        var confirmVerifyCodeImgSrc = data.confirmVerifyCodeImgSrc;
        if (confirmVerifyWidget) {
            me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
            me.getElement('confirmVerifyCode').value = '';
            me._ownerDialog && me._ownerDialog.hide('unHide');
            confirmVerifyWidget.show();
        } else {
            passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                window.confirmVerifyWidget = passport.pop.init({
                    type: 'confirmWidget',
                    tangram: true,
                    titleText: '安全验证',
                    width: 490,
                    apiOpt: {
                        Continue: '确定',
                        contentHTML: '<p class="pass-confirm-verifyWidget-msg">请填写图中的验证码</p>'
                                    + '<p class="pass-confirm-verifyWidget-imgWrapper">'
                                        + '<input type="text" class="pass-text-input pass-confirm-verifyWidget-verifyCode" id="' + me.$getId('confirmVerifyCode') + '" name="confirmVerifyCode" value="" />'
                                        + '<img src="' + confirmVerifyCodeImgSrc + '" title="" class="pass-confirm-verifyWidget-verifyCode-img" id="' + me.$getId('confirmVerifyCodeImg') + '" />'
                                        + '<a href="#" class="pass-confirm-verifyWidget-imgChange" id="' + me.$getId('confirmVerifyCodeChange') + '">换一张</a>'
                                        + '<span class="pass-confirm-verifyWidget-error" id="' + me.$getId('confirmVerifyCodeError') + '"></span>'
                                    + '</p>'
                    },
                    onRender: function (evt) {
                        baidu(confirmVerifyWidget.getElement('confirmWidget_footer')).addClass('pass-confirm-verifyWidget-bottom');
                        me.config.hasPlaceholder && me._getPlaceholder([{label: 'confirmVerifyCode', placeholder: 'verifyCode'}]);
                        baidu(me.getElement('confirmVerifyCodeChange')).on('click', function () {
                            baidu(me.getElement('confirmVerifyCodeImg')).attr('src', me.constant.VERIFYCODE_URL_PREFIX + me.getElement('vcodestr').value + '&v=' + new Date().getTime());
                        });
                        baidu(me.getElement('confirmVerifyCode')).on('keyup', function () {
                            baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
                            baidu(me.getElement('confirmVerifyCodeError')).hide();
                            baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                        });
                        baidu(me.getElement('confirmVerifyCode')).on('change', function () {
                            me.getElement('confirmVerifyCode').value = me.getElement('confirmVerifyCode').value.replace(/\s/g, '');
                        });
                    },
                    onConfirmClose: function (evt) {
                        me.getElement('vcodesign').value = '';
                        me.getElement('vcodestr').value = '';
                        me.getElement('confirmVerifyCode').value = '';
                        baidu(me.getElement('confirmVerifyCodeError')).hide();
                        baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
                        confirmVerifyWidget.hide();
                        me._ownerDialog && me._ownerDialog.show();
                    },
                    onConfirmContinue: function (evt) {
                        if (me.getElement('confirmVerifyCode').value === '') {
                            baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                            baidu(me.getElement('confirmVerifyCodeError')).show();
                            baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = me.lang.confirmVerCodeEmpty;
                            return;
                        }
                        passport.data.checkVerifycode({
                            verifycode: me.getElement('confirmVerifyCode').value,
                            codestring: me.getElement('vcodestr').value
                        }).success(function (rsp) {
                            if (rsp.errInfo.no == 0) {
                                confirmVerifyWidget && confirmVerifyWidget.hide();
                                me._ownerDialog && me._ownerDialog.show();
                                data.vcodeSuccessFn && data.vcodeSuccessFn();
                            } else {
                                baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                baidu(me.getElement('confirmVerifyCodeError')).show();
                                baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = rsp.errInfo.msg;
                                me.getElement('confirmVerifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + me.getElement('vcodestr').value + '&v=' + (new Date).getTime();
                                me.getElement('confirmVerifyCode').value = '';
                            }
                        });
                    }
                });
                me._ownerDialog && me._ownerDialog.hide('unHide');
                confirmVerifyWidget.show();
            });
        }
    },



	_eventHandler: (function(){
		var me,
		style = {
			focus: function(field, e){
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
	       	 	if(!returnValue) return;
	       	 	
				this.addClass(me.constant.FOCUS_CLASS);
				this.removeClass(me.constant.ERROR_CLASS);
				baidu(me.getElement(field+'Label')).addClass(me.constant.LABEL_FOCUS_CLASS);

			},
			blur: function(field, e){
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
	       	 	if(!returnValue) return;
	       	 	
				this.removeClass(me.constant.FOCUS_CLASS);
				baidu(me.getElement(field+'Label')).removeClass(me.constant.LABEL_FOCUS_CLASS)
			},
			keyup: function(field, e){

	       	}
		},
		behaviour = {
			focus: {


			},
			blur: {
				'realNameMobile': function(field, e){
					var value = this.get(0).value;
					if(value.length){
						me.validate(field);
					}
				},
				'realNameVerifyCode': function(field, e){
					var value = this.get(0).value;
					if(value.length){
						me.validate(field);
					}
				}
			},
			change: {

			},
			click: {
				'verifyCodeSend': function(field, e){
                    // 发送短信
					me.validate('realNameMobile', {
						success: function(){
                            function sendSMS() {
                                var countrycode;
                                if (document.getElementById('select-countrycode')) {
                                    countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
                                }
                                if (countrycode === '86' || countrycode === '+86' || !countrycode) {
                                    countrycode = '';
                                } else {
                                    countrycode = '00' + countrycode.substring(1);
                                }
                                var phoneNum = me.getElement('realNameMobile').value;
                                var data = {};
                                data.bdstoken = me.bdstoken;
                                data.countrycode = countrycode;
                                data.authsid = me.config.authsid;
                                data.clientfrom = me.config.clientfrom;
                                data.mobile = phoneNum;
                                data.ltoken = me.config.ltoken;
                                data.sdk_version = me.config.sdk_version;
                                data.lstr = me.config.lstr;
                                data.cu = me.config.cu;
                                data.tpl = me.config.product;
                                data.client = me.config.client;
                                data.vcodestr = me.getElement('vcodestr').value;
                                data.vcodesign = me.getElement('vcodesign').value;
                                data.verifycode = (me.getElement('confirmVerifyCode') ? me.getElement('confirmVerifyCode').value : '');
                                data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                                passport.data.jsonp('/v2/?realnamewidget-send&v=' + (new Date().getTime()), data).success(function (rsp) {
                                    if (rsp.errInfo.no === '0') {
                                        me.disableSmsButton();
                                    } else if (rsp.errInfo.no === '8') {
                                        me.getElement('vcodesign').value = rsp.data.vcodesign;
                                        me.getElement('vcodestr').value = rsp.data.vcodestr;
                                        var verifyCodeData = {
                                            'confirmVerifyCodeVcodestr': rsp.data.vcodestr,
                                            'confirmVerifyCodeImgSrc': me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr,
                                            vcodeSuccessFn: function () {
                                                sendSMS();
                                                me.getElement('vcodesign').value = '';
                                                me.getElement('vcodestr').value = '';
                                                me.getElement('confirmVerifyCode').value = '';
                                            }
                                        };
                                        setTimeout(function () {
                                            me.vcodeVerifyWidget(verifyCodeData);
                                        }, 80);
                                    } else {
                                        me.getElement('realNameError').innerHTML = rsp.errInfo.msg || '';
                                    }
                                });
                            }
                            sendSMS();
						}
					});
					e.preventDefault();
                }
			},
			keyup: {
			},
			submit: function(e){				
				e.preventDefault();
                var countrycode;
                if (document.getElementById('select-countrycode')) {
                    countrycode = document.getElementById('select-countrycode').innerHTML.replace(/<[^<^>]*>/g, '');
                }
                if (countrycode === '86' || countrycode === '+86' || !countrycode) {
					countrycode='';
				}else{
					countrycode='00'+countrycode.substring(1);
				}
				me.validateAll({
					success: function(){
						me.getElement('realNameSubmit').focus();
						/**
						 * @description 表单提交前
						 * @name magic.passport.login#beforeSubmit
						 * @event
						 * @grammar magic.passport.login#beforeSubmit
						 */
						var returnValue = me.fireEvent('beforeSubmit');
			       	 	if(!returnValue) return;
						
						var data = baidu.form.json(me.getElement('form'));

                        passport.data.jsonp('/v2/?realnamewidget-verify',{
                            'bdstoken': me.bdstoken,
                            'authsid': me.config.authsid,
                            'ltoken': me.config.ltoken,
                            'lstr': me.config.lstr,
                            'countrycode': countrycode,
                            'mobile': data.realNameMobile,
                            'vcode': data.realNameVerifyCode,
                            'cu': me.config.cu,
                            'tpl': me.config.product,
                            'sdk_version': me.config.sdk_version,
                            'client': me.config.client,
                            'clientfrom' : me.config.clientfrom
                        }).success(function(rsp){
                            if (rsp.errInfo.no === '0') {
                                me.isverify = true;
                                me.verify_authsid = rsp.data.authsid;
                                if (rsp.data.bind == '1') {
                                    me.getElement('realNameSuccessContent').style.display = 'block';
                                    me.getElement('realName_content').style.display = 'none';
                                    me.verify_rsp = rsp;
                                } else {
                                    var returnValue = me.fireEvent('submitSuccess', {
                                        rsp: rsp
                                    });
                                }
                            } else {
                                me._validateError({msg: rsp.errInfo.msg});
                        	}
                        })


					}
				},true)
			}
		};
		return {
			entrance: function(e){
				me = this;
				var target = baidu(e.target),
					field = e.target.name;
                if(!field && e.target.id) {
                    var matches = e.target.id.match(/\d+__(.*)$/);
                    if(matches) { field = matches[1]; }
                }
                if(!field) { return; }
				if(style.hasOwnProperty(e.type)){
					style[e.type].apply(baidu(e.target), [field, e]);
				}

				if(behaviour.hasOwnProperty(e.type)){
					if(typeof behaviour[e.type] == 'function'){
						// for submit
						behaviour[e.type].apply(baidu(e.target), [e]);
					}
					if(behaviour[e.type].hasOwnProperty(field)){
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
	$dispose: function(){
		var me = this;
		if(me.disposed){return;}
		baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
		me.getElement().removeChild(me.getElement('form'));
		magic.Base.prototype.$dispose.call(me);
	}
});

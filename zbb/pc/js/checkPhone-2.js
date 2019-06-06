///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 验证手机
 * @class
 * @name magic.passport.checkPhone
 * @grammar new magic.passport.checkPhone(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.checkPhone} magic.passport.checkPhone 实例
 * @superClass magic.passport
 */
  /* globals passport */
magic.passport.checkPhone = baidu.lang.createClass(function(options){
	var me = this;
	me.action = '';
	me._domain = {
		"https":"https://passport.baidu.com",
		"http":"http://passport.baidu.com/",
		"auto":(document.location.protocol.toLowerCase()=="https:")?"https://passport.baidu.com":"http://passport.baidu.com/"
	};
	me.config = {
		product: '',//string,产品线TPL
		charset: '',
		phone: '',
		hasPlaceholder:true,
		staticPage: '',//string,静态跳转文件
		u: '',
		token: '',
		username: '',
		lang: 'zh-CN',
		isuserid: ''
	};

	baidu.extend(me.config, options);

	this.module = 'checkPhone';
	me.constant = {
		CHECKVERIFYCODE:true,
		CONTAINER_CLASS: 'tang-pass-checkPhone',
		LABEL_FOCUS_CLASS: 'pass-text-label-focus',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error',
		DISABLED_CLASS :'pass-item-time-timing',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime()),
		VERIFYCODE_URL_PREFIX: me._domain.https+'/cgi-bin/genimage?'
	};

	me.lang = passport.err.getCurrent().labelText.checkPhone;
	apiMargicInstance = me.config.apiMargicInstance || {} ;
	setPwd = null;
	me.confirmSmsVerifyWidget = null;
	me.initialized = '';
	me.guideRandom = (function(){
    	return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    		var r = Math.random()*16|0;
    		var v = c =='x' ? r : (r & 0x3|0x8);
    		return v.toString(16); 
    	}).toUpperCase();
    })();
    me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
},{
    type: "magic.passport.checkPhone",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			tip: '<p class="pass-checkPhone-tip">帐号"<span class="pass-checkPhone-tipbold" id="'+me.$getId('MakeTextPhone')+'">'+(me.config.isuserid?me.config.phone:me.config.username)+'</span>"'+me.lang.tip+'</p>',
			generalError: '<p id="'+me.$getId('checkPhoneErrorWrapper')+'" class="pass-generalErrorWrapper">'+
						  	 '<span id="'+me.$getId('checkPhoneError')+'" class="pass-generalError pass-generalError-error"></span>'+
						  '</p>',
			verifyCode: '<p id="'+me.$getId('checkPhoneVerifyCodeWrapper')+'" class="pass-form-item pass-form-item-verifyCode">'+
		                    	'<label for="'+me.$getId('checkPhoneVerifyCode')+'" id="'+me.$getId('checkPhoneVerifyCodeLabel')+'" class="pass-label pass-label-checkPhoneVerifyCode"></label>'+
		                    	'<input id="'+me.$getId('checkPhoneVerifyCode')+'" type="text" name="checkPhoneVerifyCode" class="pass-text-input pass-text-input-checkPhoneVerifyCode" />'+
		                    	'<input id="'+me.$getId('verifyCodeSend')+'" type="button" class="pass-item-timer" value="'+me.lang.sendcheckPhoneVerifyCode+'"/>'+
		                    	'<span id="'+me.$getId('smsVerifyCodeTip')+'" class="pass-item-tip pass-item-tip-smsVerifyCode" style="display:none"><span id="'+me.$getId('checkPhoneVerifyCodeTipText')+'"></span></span>'+
		                	'</p>',
		    backBtn: '<p class="pass-form-backbtn" id="'+me.$getId('backloginBtn')+'">'+me.lang.backbtn+'</p>',
			submit: '<p id="'+me.$getId('checkPhoneSubmitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('checkPhoneSubmit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit" />'+
			    '</p>'
		}
		return template[field];
	},

	_getTemplate: function(action,opt){
		var me = this,
			templateStr = '<form id="'+me.$getId('form')+'" class="pass-form pass-form-checkPhone" method="POST" autocomplete="off">',
			hiddenFields = {
				u: me.config.u,
				tpl: me.config.product,
				switchuname: '',
				smsCodeString: '',
				smsVcodesign: '',
				smsVcodestr: '',
				isdpass: '1',
				subpro: me.config.subpro ? me.config.subpro:'',
				staticPage: me.config.staticPage
			}
		templateStr += me._getIrregularField('tip');
		templateStr += me._getIrregularField('generalError');
		templateStr += me._getHiddenField(hiddenFields);

		templateStr += me._getIrregularField('verifyCode');
		templateStr += me._getIrregularField('submit');
		templateStr += me._getIrregularField('backBtn');
		templateStr += '</form>';
		return templateStr;

	},

	_setValidator: function(){
		var me = this;
			me.validatorInited = true;
			me.validateRules = {
				'checkPhoneVerifyCode': {
					rules: ['required'],
					desc: me.lang.verifyCode
				}
			}
			
			me._validator.init(me, me.validateRules);
	},
	
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		if(ele){
			ele.addClass(me.constant.ERROR_CLASS);
		}
		this.getElement('checkPhoneError').innerHTML = info.msg;

		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		//me.clearGeneralError();
		this.getElement('checkPhoneError').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
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

	setMakePhone: function (str,userid) {
        var me = this;
        var makeDom = me.getElement('MakeTextPhone');
        var str = str.replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/\x22/g, '&quot;')
                        .replace(/\x27/g, '&#39;');
        if (!makeDom) {
            return;
        }
        makeDom.innerHTML = str || '' ;
        me.config.username = userid;
    },
	render: function(id,callback){
		var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());//baidu('#'+id);
        target.addClass(me.constant.CONTAINER_CLASS);

		var template = me._getTemplate();
		target.get(0).appendChild(baidu(template).get(0));

		if(me.config.hasPlaceholder){
	        var rendList = [{
	        	label:"checkPhoneVerifyCode",
	        	placeholder:"verifyCodePlaceholder",
	        	clearbtn:0
        	}];
	        me._getPlaceholder(rendList)
        }
        me._setValidator();
		me._setEvent();
		me.closeEvent();
	},

	closeEvent: function() {
		var me = this;
		baidu(me.getElement('backloginBtn')).click(function(){
			me._ownerDialog && me._ownerDialog.hide('unHide');
			if(apiMargicInstance.config){
                if(apiMargicInstance.config.diaPassLogin){
                    apiMargicInstance._ownerDialog && apiMargicInstance._ownerDialog.show();
                }
            }
		})
	},

	disableSmsButton: function(){
		var me = this,
			ele = me.getElement('verifyCodeSend'),
			error = me.getElement('checkPhoneError'),
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

	loginCrossToHao123: function(hao123Param) {
        var me = this;
        if (me.config.noSynBdu && me.config.noSynBdu === 1) {
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
    },

    setPwdAction: function(options) {
        var me = this,
            rspData = options.data || {};
        if (!setPwd) {
        	passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js',true,function(){
	            setPwd = passport.pop.init({
	                type: 'accSetPwd',
	                tangram: true,
	                color: me.config.color || 'blue',
	                apiOpt: {
	                    u: me.config.u,
	                    product: me.config.product,
	                    staticPage: me.config.staticPage,
	                    authsid: rspData.authsid || '',
                        bdstoken: rspData.bdstoken || '',
	                    sub_source: 'leadsetpwd'
	                },
	                onHide: function() {
	                	me.loginSuccess(options);
	                },
	                onSubmitSuccess: function(self, result) {
	                    me.loginSuccess(options);
	                    setPwd.hide();
	                }
	            })
	            setPwd.show();
	        });
        } else {
        	if(setPwd.setMakeOption){
                setPwd.setMakeOption(rspData.authsid,rspData.bdstoken);
            }
            setPwd.show();
        }
    },

    loginSuccess: function(options) {
    	var me = this;
    	if(options.data && options.data.hao123Param) {
        	me.loginCrossToHao123(options.data.hao123Param);
        }
	    var returnValue = apiMargicInstance.fire("loginSuccess", {
            rsp: options
        });
	    if (!returnValue)
	        return;
	    if (window.location) {
	        window.location.href = me.config.u;
	    } else {
	        document.location.href = me.config.u;
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
			mouseover: function(field, e){

			},
			mouseout: function(field, e){

			},
			keyup: function(field, e){

	       	}
		},
		behaviour = {
			focus: {


			},
			blur: {
				'checkPhoneVerifyCode': function(field, e){
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
                    var data = {
                        'gid': me.guideRandom || '',
                        'username': me.config.username,
                        'isuserid': me.config.isuserid,
                        'bdstoken': me.config.token,
                        'tpl': me.config.product || '',
                        'sub_source': 'leadsetpwd'
                    };
                    data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                    passport.data.jsonp('/v2/api/senddpass', data)
					.success(function(rsp){
						if(rsp.data.errno == '0'){
							me.disableSmsButton();
						}else{
							me.getElement('checkPhoneError').innerHTML = rsp.data.msg || '';
							if(rsp.data.errno == 18 || rsp.data.errno == 19){
			        			var confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr;
			                    me.getElement('smsVcodesign').value = rsp.data.vcodesign;
							    me.getElement('smsVcodestr').value = rsp.data.vcodestr;
								if (me.confirmSmsVerifyWidget) {
			                        //TODO 切换验证码图片
			                        me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
			                        me.getElement('confirmVerifyCode').value = '';
			                        me._ownerDialog && me._ownerDialog.hide('unHide');
			                        me.confirmSmsVerifyWidget.show();
			                    }else{
			                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js',true,function(){
			                            me.confirmSmsVerifyWidget = passport.pop.init({
			                                type: 'confirmWidget',
			                                tangram: true,
			                                titleText: '安全验证',
			                                width:490,
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
			                                onRender: function(evt) {
			                                    baidu(me.confirmSmsVerifyWidget.getElement('confirmWidget_footer')).addClass('pass-confirm-verifyWidget-bottom');
			                                    me.config.hasPlaceholder && me._getPlaceholder([{label:'confirmVerifyCode',placeholder:'verifyCode'}]);
			                                    baidu(me.getElement('confirmVerifyCodeChange')).on('click',function(){
                                                    baidu(me.getElement('confirmVerifyCodeImg')).attr('src', me.constant.VERIFYCODE_URL_PREFIX + me.getElement('smsVcodestr').value + '&v='+new Date().getTime());
			                                    });
			                                    baidu(me.getElement('confirmVerifyCode')).on('keyup',function(){
			                                    	baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
			                                    	baidu(me.getElement('confirmVerifyCodeError')).hide();
			                                    	baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
			                                    });
			                                },
			                                onConfirmClose:function(evt){
			                                    baidu(me.getElement('confirmVerifyCodeError')).hide();
			                                	baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
			                            		me.confirmSmsVerifyWidget.hide();
			                            		me._ownerDialog && me._ownerDialog.show();
			                                },
			                                onConfirmCancel: function(evt) {
			                                    
			                                },
			                                onConfirmContinue: function(evt) {
			                                	if(me.getElement('confirmVerifyCode').value == ''){
			                                		baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
			                                		baidu(me.getElement('confirmVerifyCodeError')).show();
			                                        baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = me.lang.confirmVerCodeEmpty;
			                                        return ;
			                                	}
			                                    var data = {
			                                    	'gid':me.guideRandom || '',
			                                    	'username':me.config.username,
			                                    	'bdstoken':me.config.token,
			                                    	'isuserid':me.config.isuserid,
			                                    	'tpl':me.config.product ? me.config.product : '',
			                                    	'vcodestr':me.getElement('smsVcodestr').value,
			                                    	'vcodesign':me.getElement('smsVcodesign').value,
			                                    	'verifycode':me.getElement('confirmVerifyCode').value
			                                    } ;
                                                data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
			                                    passport.data.jsonp(me._domain.auto+'/v2/api/senddpass', data).success(function(rsp) {
			                                    	if(rsp.data.errno == 0){
			                                    		me.disableSmsButton();
			                                    		baidu(me.getElement('confirmVerifyCodeError')).hide();
			                                        	baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = '';
			                                    		me.confirmSmsVerifyWidget.hide();
			                                    		me._ownerDialog && me._ownerDialog.show();
			                                    	} else if (rsp.data.errno == 20 || rsp.data.errno == 21) {
			                                            baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
			                                            baidu(me.getElement('confirmVerifyCodeError')).show();
                                                        baidu(me.getElement('confirmVerifyCodeError')).get(0).innerHTML = rsp.data.msg;
                                                        me.getElement('confirmVerifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr;
                                                        me.getElement('confirmVerifyCode').value = '';
                                                        me.getElement('smsVcodesign').value = rsp.data.vcodesign;
                                                        me.getElement('smsVcodestr').value = rsp.data.vcodestr;
			                                        } else {
			                                        	baidu(me.getElement('confirmVerifyCodeError')).hide();
			                                        	me.confirmSmsVerifyWidget.hide();
			                                        	me._ownerDialog && me._ownerDialog.show();
			                                            me._validateError({msg:rsp.data.msg})
			                                        }
			                                    });  
			                                }
			                            })
										me._ownerDialog && me._ownerDialog.hide('unHide');
			                            me.confirmSmsVerifyWidget.show();
			                        })
			                    }
			                }
						}
					});
					e.preventDefault();
				}
			},
			keyup: {

			},
			submit: function(e){				
				e.preventDefault();
				me.validateAll({
					success: function(){
						me.getElement('checkPhoneSubmit').focus();
						/**
						 * @description 表单提交前
						 * @name magic.passport.login#beforeSubmit
						 * @event
						 * @grammar magic.passport.login#beforeSubmit
						 */
						var returnValue = me.fireEvent('beforeSubmit');
			       	 	if(!returnValue) return;
						
						var data = baidu.form.json(me.getElement('form'));
                        if (passport.data.traceID) {
                            passport.data.traceID.startFlow && passport.data.traceID.startFlow('login');
                        }
						data.token = me.config.token;
						data.gid = me.guideRandom;
						data.username = me.config.username;
						data.password = data.checkPhoneVerifyCode;
						data.isuserid = me.config.isuserid;
						data.sub_source = 'leadsetpwd';
                        data.dv = document.getElementById('dv_Input') ? document.getElementById('dv_Input').value : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                        passport.data.login(data).success(function(rsp){
                            if (rsp.errInfo.no === '0') {
                                var returnValue = me.fireEvent('submitSuccess');
			       	 			if(!returnValue) return;

			       	 			me._ownerDialog&&me._ownerDialog.hide('unHide');
			       	 			returnValue = apiMargicInstance.fire("loginSuccess", {
			                        rsp: rsp
			                    });
							    if (!returnValue)
							        return;
			       	 			me.loginSuccess(rsp);
                            } else if (rsp.errInfo.no === '20') {
			       	 			me._ownerDialog&&me._ownerDialog.hide('unHide')
			       	 			me.setPwdAction(rsp);
                            } else {
                                if (rsp.errInfo.no === '400413' || rsp.errInfo.no === '400414' || rsp.errInfo.no === '400415') {
                                    me._validateError({msg: '帐号存在风险，为了您的帐号安全，请使用短信登录并完成验证，谢谢'});
                                } else {
                                    me._validateError({msg: rsp.errInfo.msg});
                                }
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

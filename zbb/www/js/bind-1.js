///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 手机\邮箱绑定模块
 * @class
 * @name magic.passport.bind
 * @grammar new magic.passport.fillUserName(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.fillUserName} magic.passport.fillUserName 实例
 * @superClass magic.passport
 */
magic.passport.bind = baidu.lang.createClass(function(options){
	var me = this;
	me.config = {
		staticPage: '',
		product: '',
		charset: '',
		token: '',
		lang: 'zh-CN'
	};
	baidu.extend(me.config, options);
	this.module = 'bind';
	me.constant = {
		CONTAINER_CLASS: 'tang-pass-bind',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error',
		DISABLED_CLASS: 'pass-text-input-disabled',
		BIND_URL:'/v2/?bindwidget-XXX&tpl='+encodeURIComponent(me.config.product)+'&u='+encodeURIComponent(me.config.u)
	};
	
	me.lang = {
		'zh-CN': {
			"uName"           : "\u624B\u673A/\u90AE\u7BB1",
			"vCode"           : "\u9A8C\u8BC1\u7801",
			"bind"            : "\u786E\u5B9A",
			"getVcodeText"    : "\u53D1\u9001\u9A8C\u8BC1\u7801",
			"uNameError"      : "\u8BF7\u586B\u5199\u6B63\u786E\u7684\u624B\u673A/\u90AE\u7BB1",
			"mailLengthError" : "\u90ae\u7bb1\u5730\u5740\u8fc7\u957f\uff0c\u8bf7\u66f4\u6362\u8f83\u77ed\u90ae\u7bb1\uff0c\u603b\u4f53\u4e0d\u8d85\u8fc760\u4e2a\u5b57\u7b26",
			"matchGmailError" : "gmail\u90AE\u7BB1\u6536\u4FE1\u65F6\u4F1A\u81EA\u52A8\u8FC7\u6EE4\u7528\u6237\u540D\u5185\u7684\u5706\u70B9,\u60A8\u53EF\u4EE5\u53BB\u6389\u7528\u6237\u540D\u5185\u7684\u5706\u70B9\u76F4\u63A5\u6CE8\u518C",
			"emailLimitError" : "\u4e0d\u80fd\u4f7f\u7528\u8be5\u90ae\u7bb1",
			"keyResendTip"    : "\u91CD\u65B0\u53D1\u9001",
			"emailEmptyError" : "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
			"phoneEmptyError" : "\u60a8\u586b\u5199\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u8f93\u516511\u4f4d\u5927\u9646\u624b\u673a\u53f7"
		}
	}[me.config.lang];

	me.errMsg = {
		"1": {msg: "\u4e3a\u4e86\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u8bf7\u767b\u5f55\u540e\u518d\u7ed1\u5b9a", field: ""},
		"2": {msg: "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", field: ""},
		"3": {msg: "\u9a8c\u8bc1\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165", field: "vCode"},
		"4": {msg: "\u9a8c\u8bc1\u7801\u9519\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165", field: "vCode"},
		"5": {msg: "\u9a8c\u8bc1\u7801\u9a8c\u8bc1\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5", field: "vCode"},
		"7": {msg: "\u8be5\u90ae\u7bb1\u5df2\u88ab\u5176\u4ed6\u5e10\u53f7\u7ed1\u5b9a\uff0c\u8bf7\u66f4\u6362\u90ae\u7bb1", field: "uName"},
		"8": {msg: "\u8be5\u624b\u673a\u53f7\u5df2\u88ab\u5176\u4ed6\u5e10\u53f7\u7ed1\u5b9a\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7", field: "uName"},
		"9": {msg: "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165", field: "uName"},
		"10": {msg: "\u60a8\u586b\u5199\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef\uff0c\u8bf7\u8f93\u516511\u4f4d\u5927\u9646\u624b\u673a\u53f7", field: "uName"},
		"11": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6\uff0c\u8bf7\u4f7f\u7528\u4e3b\u6d41\u90ae\u7bb1\u6ce8\u518c", field: "uName"},
        "110023": {msg: "\u8be5\u90ae\u7bb1\u5df2\u88ab\u5176\u4ed6\u5e10\u53f7\u7ed1\u5b9a\uff0c\u8bf7\u66f4\u6362\u90ae\u7bb1", field: "uName"},
        "130036": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6\uff0c\u8bf7\u4f7f\u7528<a href='http://www.baidu.com/search/passport_help.html#09' target='_blank'>\u4e3b\u6d41\u90ae\u7bb1</a>", field: "uName"},
        '130020': {msg: "\u8be5\u624b\u673a\u53f7\u5df2\u88ab\u5176\u4ed6\u5e10\u53f7\u7ed1\u5b9a\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7", field: "uName"},
        "500010" :{msg: "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", field: "uName"},
        "119998" :{msg: "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", field: ""} 
	};
	
    me.initTime = new Date().getTime();
	// init data
	passport.data.setContext(baidu.extend({}, me.config));
},{
    type: "http://passport.baidu.com/passApi/js/modules/magic.passport.bind",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			vCode: '<p id="'+me.$getId('vCodeWrapper')+'" class="pass-form-item pass-form-item-verifyCode">'+
			        '<label for="'+me.$getId('vCode')+'" id="'+me.$getId('vCodeLabel')+'" class="pass-label pass-label-vCode">'+me.lang.vCode+'</label>'+
			        '<input id="'+me.$getId('vCode')+'" type="text" name="vCode" class="pass-text-input pass-text-input-verifyCode" autocomplete="off"/>'+
			        '<input id="'+me.$getId('verifyCodeSend')+'" type="button" value="'+me.lang.getVcodeText+'" class="pass-button pass-button-verifyCodeSend" autocomplete="off"/>'+
			        '<span id="'+me.$getId('verifyCodeSendTip')+'" class="pass-item-tip pass-item-tip-verifyCodeSend" style="display:none;"></span>'+
			        '<span id="'+me.$getId('vCodeError')+'" class="pass-item-error pass-item-error-verifyCode"></span>'+
			    '</p>',
			generalError: '<p id="'+me.$getId('errorWrapper')+'" class="pass-generalErrorWrapper">'+
						        '<span id="'+me.$getId('error')+'" class="pass-generalError"></span>'+
						    '</p>',
			submit: '<p id="'+me.$getId('submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('submit')+'" type="submit" value="'+me.lang.bind+'" class="pass-button pass-button-submit" />'+
			    '</p>'					 
		}
		return template[field];
	},	
	_getTemplate: function(containerId){
		var me = this,
			templateStr = '<form autocomplete="off" id="'+me.$getId('form')+'" method="POST">',
			hiddenFields = {
				action: '',
				u: me.config.u,
				authsid:'',
				bdstoken:'',
				staticPage: me.config.staticPage
			},
			regRegularField = [];
		
		regRegularField.push({
			field: 'uName',
			label: me.lang.uName,
            hasSucc: true
		});

		templateStr += me._getIrregularField('generalError');
		templateStr += me._getHiddenField(hiddenFields);
		for(var i = 0 ; i < regRegularField.length; i++){
			templateStr += me._getRegularField(regRegularField[i]);
		}
		templateStr += me._getIrregularField('vCode');
		templateStr += me._getIrregularField('submit');
		templateStr += '</form>';
		
		return templateStr;
	},


	
	render: function(id){
		var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        //console.log(me.$mappingDom)
        //console.log(me.getElement())
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
		if(!returnValue) return;
		me._setData()
		me._setValidator();
		me._setEvent();

	},

	_setData:function(){
		var url = document.location.href,
			me = this,
			data = {
				ppregtype : url.match(/[?&]ppregtype=([^&]*)/),
				authsid : url.match(/[?&]authsid=([^&]*)/),
				bdstoken : url.match(/[?&]pptoken=([^&]*)/)
			};
		baidu.each(data,function(i,k){
			if(k){
				me.constant.BIND_URL += '&'+i+'='+k[1]
			}
		})
	},

	disableSmsButton: function(){
		var me = this,
			ele = me.getElement('verifyCodeSend'),
			error = me.getElement('error'),
			value = ele.value,
			timmer,
			counter = 60;
		baidu(ele).addClass(me.constant.DISABLED_CLASS);
		ele.disabled = true;
		error.innerHTML = '';
		baidu(me.getElement('vCodeError')).hide();
		baidu(me.getElement('verifyCodeSendTip')).show().get(0).innerHTML = "\u9a8c\u8bc1\u7801\u5df2\u53d1\u9001";

		timmer = setTimeout(function(){
			if (--counter === 0) {
				ele.value = value;
				baidu(ele).removeClass(me.constant.DISABLED_CLASS);
				ele.disabled = false;
				baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
				return;
			};
			ele.value = me.lang.keyResendTip + '(' + counter + ')';
		}, 1000);
	},

	_setValidator: function(){
		// 生成正则，自定义校验规则
		// 主流邮箱
		var me = this,
			mainEmailSP = me.mainEmailSP = ["http://passport.baidu.com/passApi/js/modules/qq.com", "http://passport.baidu.com/passApi/js/modules/163.com", "http://passport.baidu.com/passApi/js/modules/126.com", "http://passport.baidu.com/passApi/js/modules/sohu.com", "http://passport.baidu.com/passApi/js/modules/sina.com", "http://passport.baidu.com/passApi/js/modules/21cn.com", "http://passport.baidu.com/passApi/js/modules/vip.qq.com", "http://passport.baidu.com/passApi/js/modules/yeah.net"],
			mainEmailSPRegStr = mainEmailSP.join(')|(\\@').replace(/\./g, '\\.');
			mainEmailSPRegStr = '((\\@' + mainEmailSPRegStr + '))$';
			mainEmailSPRegStr = '^([a-zA-Z0-9_\\.\\-\\+])+' + mainEmailSPRegStr;
        // 邮箱长度
        me._validator.addRule('mailLength', function(ele){
            return String(ele.value).length <= 60;
        });
        me._validator.addMsg('mailLength', me.lang.mailLengthError);
        // me._validator.addRule('mainEmail', mainEmailSPRegStr);
		// me._validator.addMsg('mainEmail', me.lang.mainEmailError);

		/*检测gmail邮箱
		me._validator.addRule('gmailEmail',function(ele){
			if(/^([^.]*\.){2}.*@gmail\.com$/.test(ele.value)){
				return false
			}
			return true;
		});
		me._validator.addMsg('gmailEmail', me.lang.matchGmailError);*/

		//限制gmail、hotmail、baidu邮箱
		me._validator.addRule('emailLimit',function(ele){
	        if(/([a-zA-Z0-9_\.\-\+])+\@(baidu|gmail|hotmail)\.com$/.test(ele.value)){
	            return false;
	        }
	        return true;
	    })
	    me._validator.addMsg('emailLimit',me.lang.emailLimitError);

		// 手机/邮箱
		me._validator.addRule('accountMerge',function(ele){
			var value = ele.value;
            if (/^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|(1[3456789]\d{9})$/.test(value)) {
				return true
			}
			return false
		});
		me._validator.addMsg('accountMerge', me.lang.accountMergeError);


		me._validator.addRule('uName', function(ele){
            if (!/^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|(1[3456789]\d{9})$/.test(ele.value)) {
				return false;
			}
			return true;
		});
		me._validator.addMsg('uName', me.lang.uNameError);
		
		me.validateRules = {
			'uName': {
				rules: ['required','uName'],
				desc: me.lang.uName
			},
			'vCode': {
				rules: ['required'],
				desc: me.lang.vCode
			}
		}
		me._validator.init(me, me.validateRules);

		me._validator.builtInMsg['email'] = me.lang.emailEmptyError;
		me._validator.builtInMsg['phone'] = me.lang.phoneEmptyError;	
	},
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		ele.addClass(me.constant.ERROR_CLASS);
        baidu(me.getElement(info.field+'Succ')).hide();
		baidu(me.getElement(info.field+'Error')).show().get(0).innerHTML = info.msg;
		if(info.field == 'vCode'){
			baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
		}
		opt && opt.callback && callback();
	},
	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		baidu(me.getElement(info.field+'Error')).hide();
        baidu(me.getElement(info.field+'Succ')).show();
		ele.removeClass(me.constant.ERROR_CLASS);
		if(info.field == 'vCode'){
			baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
		}		
		opt && opt.callback && callback();
	},
	/** async validate **/
	_asyncValidate: {
		// 异步校验，由validator 在同步校验通过后直接调用
		checkEmail: function(callbacks){
			var me = this,
				ele = me.getElement('uName');
			/* globals hex_md5 */
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
			passport.data.checkMail({
                email: ele.value,
                moonshad: cryptdata
			})
			.success(function(rsp){
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
				if(!returnValue) return;
				
			    if(rsp.errInfo.no == 0){
			    	callbacks && callbacks.success(rsp);
			    }else{
			    	if(me.errMsg[rsp.errInfo.no]){
						rsp.errInfo.msg = me.errMsg[rsp.errInfo.no].msg;
					}
			    	rsp.msg = rsp.errInfo.msg;
					callbacks && callbacks.error(rsp);
			    }
			});
		},
		phoneCheck: function(callbacks){
			var	me = this,
				ele = this.getElement('uName');
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
			passport.data.checkPhone({
                phone: ele.value,
                moonshad: cryptdata
			})
			.success(function(rsp){
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
				if(!returnValue) return;
				
				if(rsp.errInfo.no == 0){
					callbacks && callbacks.success(rsp);
				}else{
					if(me.errMsg[rsp.errInfo.no]){
						rsp.errInfo.msg = me.errMsg[rsp.errInfo.no].msg;
					}
					rsp.msg = rsp.errInfo.msg;
					callbacks && callbacks.error(rsp);
				}
			});
		}
	},
	_eventHandler: (function(){
		var me,
		inputOriginalValue = '',
		style = {
			focus: function(field, e){
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
				if(!returnValue) return;
				
				this.addClass(me.constant.FOCUS_CLASS);
				this.removeClass(me.constant.ERROR_CLASS);
			},
			blur: function(field, e){
				/**
				 * @description 表单域失去焦点
				 * @name magic.passport.reg#fieldBlur
				 * @event
				 * @grammar magic.passport.reg#fieldBlur(e)
				 * @param {Object} e 事件参数
	             * @param {TangramDOM} e.ele 触发 blur 事件的表单域
				 */
				var returnValue = me.fireEvent('fieldBlur', {
					ele: this
				});
				if(!returnValue) return;
				
				this.removeClass(me.constant.FOCUS_CLASS);
			},
			mouseover: function(field, e){
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
				if(!returnValue) return;
				
				this.addClass(me.constant.HOVER_CLASS);
			},
			mouseout: function(field, e){
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
				if(!returnValue) return;
				
				this.removeClass(me.constant.HOVER_CLASS);
			}
		},
		behaviour = {
			focus: {

			},
			blur: {
				'uName':function(field,e){
					var ele = me.getElement(field);
					if(!/\S+/.test(ele.value)){
						me._validator.confStorage[me.$getId()][field] = {
							rules: ['required'],
							desc: me.lang.uName
						}
					}else if(/^\d+$/.test(ele.value)){
						me._validator.confStorage[me.$getId()][field] = {
							rules: ['required', 'phone'],
							asyncRule: me._asyncValidate.phoneCheck,
							desc: me.lang.uName
						}
					}else if(ele.value.indexOf('@') > -1){
						if(me.suggestionHighlight){return}
						me._validator.confStorage[me.$getId()][field] = {
							rules: ['required', 'mailLength', 'email','emailLimit'],
							asyncRule: me._asyncValidate.checkEmail,
							desc: me.lang.uName
						}
					}else{
						me._validator.confStorage[me.$getId()][field] = {
							rules: ['uName'],
							desc: me.lang.uName
						}
					}
					me.validate(field);
				},
				'vCode': function(field, e){
					me.validate(field);
				}
			},
			change: {	

			},
			click: {
				'verifyCodeSend': function(field, e){
					// 发送短信					
					var value = me.getElement('uName').value;

					me.validate('uName', {
						success: function(){
							var url = me.constant.BIND_URL.replace('XXX','send')
                            if (/^1[3456789]\d{9}$/.test(value)) {
								url += '&action=quickreg_bindmobile&mobile='+value;
							}else if(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/){
								url += '&action=quickreg_bindemail&email='+value;
							}
							passport.data.jsonp(url)
							.success(function(rsp){
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
								if(!returnValue) return;
								me.setGeneralError('');
								if(rsp.data.errno == 0){
									me.disableSmsButton();
								}else{							
									if(rsp.data.errno == 4){
										me.setValidateError('vCode', "\u7cfb\u7edf\u9519\u8bef\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5");
									}else if(rsp.data.errno == 5){
										me.setValidateError('vCode', "\u9a8c\u8bc1\u7801\u53d1\u9001\u6b21\u6570\u8fc7\u591a\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5");
									}else if(me.errMsg[rsp.data.errno]){
										if(me.errMsg[rsp.data.errno]['field']){
											me.setValidateError(me.errMsg[rsp.data.errno]['field'], me.errMsg[rsp.data.errno]['msg']);
										}else{
											me.setGeneralError(me.errMsg[rsp.data.errno]['msg']);
										}
									}else{
										me.getElement('error').innerHTML = rsp.data.errmsg;
									}
									baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
									
								}
							});
						}
					});
				}
			},
			submit:function(e){
				me.validateAll({
					success: function(){
                        me.getElement('submit').focus();
						/**
						 * @description 表单提交前
						 * @name magic.passport.reg#beforeSubmit
						 * @event
						 * @grammar magic.passport.reg#beforeSubmit()
						 */
						var returnValue = me.fireEvent('beforeSubmit');
						if(!returnValue) return;
						
						var data = baidu.form.json(me.getElement('form'));
						
                        data.timeSpan = new Date().getTime() - me.initTime;
						
						var submitCallback = function(rsp){
							if(rsp.data.errno == 0){
								var returnValue = me.fireEvent('bindSuccess', {
									rsp: rsp
								});
								if(!returnValue) return;
								
								window.location.href = me.config.u;
							}else{

								var returnValue = me.fireEvent('bindError', {
									rsp: rsp
								});
								if(!returnValue) return;
								me.setGeneralError('');																
								if(me.errMsg[rsp.data.errno]){
									if(me.errMsg[rsp.data.errno]['field']){
										me.setValidateError(me.errMsg[rsp.data.errno]['field'], me.errMsg[rsp.data.errno]['msg']);
									}else{
										me.setGeneralError(me.errMsg[rsp.data.errno]['msg']);
									}																											
								}else{
									me.setGeneralError(rsp.data['errmsg']);
								}
								baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = ''

							}
						};
						var url = me.constant.BIND_URL.replace('XXX','bind')
                        if (/^1[3456789]\d{9}$/.test(data.uName)) {
							url += '&action=quickreg_bindmobile&vcode='+data.vCode+'&mobile='+data.uName;
						}else if(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(data.uName)){
							url += '&action=quickreg_bindemail&vcode='+data.vCode+'&email='+data.uName;
						}

						// submit
						passport.data.jsonp(url)
						.success(submitCallback);
		
					},
					error: function(){
						
					}
				});
				e.preventDefault();
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
	$dispose: function(){
		var me = this;
		if(me.disposed){return;}
		baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
		baidu.dom(me.getElement('form')).remove();
		magic.Base.prototype.$dispose.call(me);
	}
});
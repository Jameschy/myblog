///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 帐号互通模块
 * @class
 * @name magic.passport.accConnect
 * @grammar new magic.passport.accConnect(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.accConnect} magic.passport.accConnect 实例
 * @superClass magic.passport
 */
magic.passport.accConnect = baidu.lang.createClass(function(options){
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
		token : '',
		staticPage: '',//string,静态跳转文件
		u: '',
		lang: 'zh-CN'
	};
    me.logHistory = {};
	baidu.extend(me.config, options);
	me.config.product = me.config.product || "isnull";
	//me.config.token = decodeURIComponent(me.config.token);
	this.module = 'accConnect';
	me.rsa = "B3C61EBBA4659C4CE3639287EE871F1F48F7930EA977991C7AFE3CC442FEA49643212E7D570C853F368065CC57A2014666DA8AE7D493FD47D171C0D894EEE3ED7F99F6798B7FFD7B5873227038AD23E3197631A8CB642213B9F27D4901AB0D92BFA27542AE890855396ED92775255C977F5C302F1E7ED4B1E369C12CB6B1822F";
	me.constant = {
		CHECKVERIFYCODE:true,
		CONTAINER_CLASS: 'tang-pass-accConnect',
		LABEL_FOCUS_CLASS: 'pass-text-label-focus',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error',
		CHECK_CLASS: "pass-user-list-check",
		BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
		GET_PASSWORD_URL : me._domain.https+'/?getpassindex&tpl=' + encodeURIComponent(me.config.product) + '&u=' + encodeURIComponent(me.config.u)

	};

	me.lang = passport.err.getCurrent().labelText.accConnect;


	

},{
    type: "magic.passport.accConnect",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			connectAd : function(text){
				if(!text) return ''
				var str = '<p class="pass-adhtmlWrapper">'+text.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</p>';
				return str;
			},
			title: function(action,text){
				var str = '<p id="'+me.$getId(action+'title')+'" class="pass-titleWrapper">'+text+'</p>';
				return str;
			},
			generalError: function(action){
				var str = '<p id="'+me.$getId(action + 'errorWrapper')+'" class="pass-generalErrorWrapper">'+
						  	 '<span id="'+me.$getId('error')+'" class="pass-generalError pass-generalError-error"></span>'+
						  '</p>';
				return str;
			},
			verifyCode : function(action,text){
				var str = '<p id="'+me.$getId(action+'verifyCodeWrapper')+'" class="pass-form-item pass-form-item-verifyCode">'+
		                    '<input id="'+me.$getId('verifyCode')+'" type="text" name="verifyCode" class="pass-text-input pass-text-input-verifyCode" />'+
		                    '<input id="'+me.$getId(action+'timer')+'" class="pass-item-timer" type="button" value="'+text+'"/>'+
		                    //'<button id="'+me.$getId(action+'timer')+'" class="pass-item-timer">'+text+'</button>'+
		                '</p>'
		        return str;
			},

			userList : function(action,opt){
				var str = '<li class="pass-user-list-item '+(opt.checked ? me.constant.CHECK_CLASS : "")+'" data-index='+opt.i+'>'+
								'<div>'+
									'<p>'+opt.username+'</p>'+
									'<p>'+opt.secureAccount+'</p>'
								'</div>'
						  '</li>'
				return str;
			},

			submit: function(action,value){
				var str = '<p id="'+me.$getId(action + 'submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        			'<input id="'+me.$getId(action + 'submit')+'" type="submit" value="'+value+'" class="pass-button pass-button-submit" />'+
			    		  '</p>';
			    return str;
			},

			Links: function(action,opt){
				var str = '<p id="'+me.$getId(action + 'linkWrapper')+'" class="clearfix">';
					if(me.initDataStatus.pwdAuth == 1 && opt.type != 'pwd'){
						if(action == 'mobileAuth' || action == 'emailAuth'){
							str += '<a class="pass-link-login" id="'+me.$getId('pwdAuth')+'" target="_blank" >'+me.lang.pwdAuthText+'</a>'
						}else{
							str += '<a class="pass-link-login" id="'+me.$getId('secureLogin')+'" target="_blank" >'+me.lang[(opt.type||'mobile')+'LoginText']+'</a>'
						}
					}        			
			        str += '<a class="pass-link-fgtpwd" href="'+me.constant.GET_PASSWORD_URL+'" target="_blank">'+me.lang.fgtPwd+'</a>';
			    	str += '</p>';
			    return str;
			}
		}
		return template[field];
	},

	_getTemplate: function(action,opt){
		var me = this,
			userList = (opt && opt.userList) || (me.initDataStatus && me.initDataStatus.userList) || [],
			actionTemplate = {
				bind : function(){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">',
						hiddenFields = {
							tpl:(me.config.product || me.config.tpl),
							staticpage: me.config.staticPage,
							u: me.config.u,
							token: me.config.token,
							type: me.initDataStatus.bindType || 'mobile'
						},
						regularField = [{
							field: 'password',
							pwd: true,
							label: me.lang.password,
			                noError: true
						}];

					templateStr += me.config.adtext ? me._getIrregularField('connectAd')(me.config.adtext):'';

					templateStr += me._getIrregularField('title')(action,me.lang.bindTitle).replace('#{username}',opt.displayusername);
					templateStr += '<form id="'+me.$getId(action+'form')+'" class="pass-form" method="POST" autocomplete="off">';
					templateStr += me._getIrregularField('generalError')(action);
					templateStr += me._getHiddenField(hiddenFields);
					for(var i = 0 ; i < regularField.length; i++){
						templateStr += me._getRegularField(regularField[i]);
					}
					templateStr += me._getIrregularField('verifyCode')(action,(me.initDataStatus.bindType == 'mobile' ? me.lang.mobileBtnText : me.lang.emailBtnText));
					templateStr += '<p class="pass-form-item pass-tip">'+me.lang.bindTip+'</p>';
					templateStr += me._getIrregularField('submit')(action,me.lang.submitText);
					templateStr += '</form>';
					templateStr += '</div>';
					return templateStr;
				},
				pwdAuth : function(){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">',
						hiddenFields = {
							staticpage: me.config.staticPage,
							u: me.config.u,
							token: me.config.token,
							tpl:(me.config.product || me.config.tpl),
							isdynamic : 0,
							type: opt.type || 'mobile'
						},
						regularField = [{
							field: 'password',
							pwd: true,
							label: me.lang.password,
			                noError: true
						}];

					
					templateStr += me.config.adtext ? me._getIrregularField('connectAd')(me.config.adtext):'';
					templateStr += me._getIrregularField('title')(action,me.lang.pwdTitle).replace('#{username}',opt.secureAccount);
					templateStr += '<form id="'+me.$getId(action+'form')+'" class="pass-form" method="POST" autocomplete="off">';
					templateStr += me._getIrregularField('generalError')(action);
					templateStr += me._getHiddenField(hiddenFields);
					for(var i = 0 ; i < regularField.length; i++){
						templateStr += me._getRegularField(regularField[i]);
					}
					templateStr += me._getIrregularField('submit')(action,me.lang.submitText);
					templateStr += '</form>';
					templateStr += me._getIrregularField('Links')(action,{type:opt.type});
					templateStr += '</div>';
					return templateStr;
				},
				mobileAuth : function(){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">',
						hiddenFields = {
							staticpage: me.config.staticPage,
							u: me.config.u,
							token: me.config.token,
							tpl:(me.config.product || me.config.tpl),
							isdynamic : 1,
							type: 'mobile'
						};
					templateStr += me.config.adtext ? me._getIrregularField('connectAd')(me.config.adtext):'';
					templateStr += me._getIrregularField('title')(action,me.lang.pwdTitle).replace('#{username}',opt.secureAccount);
					templateStr += '<form id="'+me.$getId(action+'form')+'" class="pass-form" method="POST" autocomplete="off">';
					templateStr += me._getIrregularField('generalError')(action);
					templateStr += me._getHiddenField(hiddenFields);
					templateStr += me._getIrregularField('verifyCode')(action,me.lang.smsVerifyCode);
					templateStr += me._getIrregularField('submit')(action,me.lang.submitText);
					templateStr += '</form>';
					templateStr += me._getIrregularField('Links')(action,{type:opt.type});
					templateStr += '</div>';
					return templateStr;					
				},
				emailAuth : function(){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">',
						hiddenFields = {
							staticpage: me.config.staticPage,
							u: me.config.u,
							token: me.config.token,
							tpl:(me.config.product || me.config.tpl),
							isdynamic : 1,
							type: 'email'
						};
					templateStr += me.config.adtext ? me._getIrregularField('connectAd')(me.config.adtext):'';
					templateStr += me._getIrregularField('title')(action,me.lang.pwdTitle).replace('#{username}',opt.secureAccount);
					templateStr += '<form id="'+me.$getId(action+'form')+'" class="pass-form" method="POST" autocomplete="off">';
					templateStr += me._getIrregularField('generalError')(action);
					templateStr += me._getHiddenField(hiddenFields);
					templateStr += me._getIrregularField('verifyCode')(action,me.lang.emailBtnText);
					templateStr += me._getIrregularField('submit')(action,me.lang.submitText);
					templateStr += '</form>';
					templateStr += me._getIrregularField('Links')(action,{type:opt.type});
					templateStr += '</div>';
					return templateStr;					
				},
				userList : function(list){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">',
						str = [];
					templateStr += me.config.adtext ? me._getIrregularField('connectAd')(me.config.adtext):'';
					templateStr += me._getIrregularField('title')(action,me.lang.userListTitle).replace('#{username}',opt.displayusername);
					str.push('<ul class="pass-user-list" id="'+me.$getId(action+'List')+'">')
					for(var i = 0, len = list.length; i < len; i++){
						list[i].i = i;
						if(i == 0 ) list[i].checked = true;
						str.push(me._getIrregularField('userList')(action,list[i]));
					}
					str.push('</ul>')
					templateStr += str.join("");
					templateStr += me._getIrregularField('submit')(action,me.lang.nextText);
					templateStr += '<p class="pass-tip">'+me.lang.userListTip+'</p>';
					templateStr += '</div>';
					return templateStr;
				},
				error : function(){
					var templateStr = '<div id='+me.$getId(action+'Wrapper')+' class="tang-pass-wrapper">';
					templateStr += me._getIrregularField('title')('error',me.lang.errorTitle);
					templateStr += '</div>';
					return templateStr;
				}
			}

		return actionTemplate[action] && actionTemplate[action](userList);
	},

	_getPlaceholderList : function(action){
		var me = this;
			rendList = {
				bind : [{
			        	label:'password',
			        	placeholder:"password"
			          },{
			        	label:"verifyCode",
			        	placeholder:me.initDataStatus.bindType == 'mobile' ? "bindmobileverifyCode" : "bindemailverifyCode"
			          }],
			    pwdAuth: [{
			        	label:'password',
			        	placeholder:"password"
			          }],
			    emailAuth : [{
			        	label:"verifyCode",
			        	placeholder:"emailVerifyCode"
			          }],
			    mobileAuth : [{
			        	label:"verifyCode",
			        	placeholder:"smsVerifyCode"
			          }]
		};

		return rendList[action];

	}, 

	_getAccountStatus: function(callback){
		var me = this;
		passport.data.jsonp('/v2/unite-init?tpl='+(me.config.tpl || me.config.product)+'&token='+encodeURIComponent(me.config.token)).success(function(rsp){
			if(rsp.errInfo.no != 0){
				var target = baidu(me.getElement()),
		    		template = me._getTemplate('error');
		    	target.empty();
				target.get(0).appendChild(baidu(template).get(0));
			}else{
	            rsp.data.bindType = rsp.data.status == 'auth' ? '' : rsp.data.bindType;
	            me.action = rsp.data.status == 'auth' ? 'userList' : rsp.data.status;
	            me.initDataStatus = rsp.data;

	            if(me.action == "userList" && (Object.prototype.toString.call(me.initDataStatus.userList) == '[object Array]') && me.initDataStatus.userList.length === 1){
		    		var odata = me.initDataStatus.userList[0];
					odata.action = me.initDataStatus.pwdAuth == 1 ? 'pwdAuth' : odata.type+'Auth';
					me.authData = odata;
					me.draw(odata);
		    	}else{
		    		me.draw(rsp.data);
		    	}

	            
			}
			me.initCallback && me.initCallback(rsp.data);
			callback && callback(rsp.data);
        })
		
	},

	setToken: function(token,callback){
		var me = this;
		me.config.token = token;
		me._getAccountStatus(callback);
	},


	draw : function(opt){
		var me = this,
			target = baidu(me.getElement());
    	me.action = opt.action || me.action;
    	var template = me._getTemplate(me.action,opt);
    	target.empty();
		target.get(0).appendChild(baidu(template).get(0));
		if(me.action == 'userList'){

		}else{
			me._getPlaceholder(me._getPlaceholderList(me.action));
			me._setValidator();
		}

		me._setaccEvent(me.action);
		me._log('show',me.action);
		baidu('a').on('click',function(){
			me._log('click',me.action);
		}) ;

	},

	render: function(id,callback){
		var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());//baidu('#'+id);
        target.addClass(me.constant.CONTAINER_CLASS);
        if(callback){
    		me.initCallback = callback;
    	}
        me._getAccountStatus()
	},

	_setaccEvent : function(){
		var me = this;

		if(me.action == 'userList'){
			baidu("li", me.getElement('userListList')).on('click',function(evt){
				me._log('click',me.action);
				var target = this;
				if(baidu(target).hasClass(me.constant.CHECK_CLASS)) return;
				baidu("."+me.constant.CHECK_CLASS,target.parentNode).removeClass(me.constant.CHECK_CLASS)
				baidu(target).addClass(me.constant.CHECK_CLASS);
				//me.getElement('userListsubmit').index = baidu(this).attr('data-index');
			})

			baidu(me.getElement('userListsubmit')).on('click',function(evt){
				me._log('click',me.action);
				var currentDom = baidu("."+me.constant.CHECK_CLASS,me.getElement(me.$getId(me.action+'Wrapper'))),
					index = (currentDom && currentDom.attr('data-index') )|| 0,
					data = me.initDataStatus.userList[index];
				data.action = me.initDataStatus.pwdAuth == 1 ? 'pwdAuth' : data.type+'Auth';
				me.authData = data;
				me.draw(data);
			})

		}else{
			var fn = function(e){
				me._eventHandler.entrance.apply(me, [e]);
			};

			baidu(me.getElement(me.action+'form')).on('submit', fn);
					
			baidu('.pass-text-input', me.getElement(me.action+'Wrapper')).on({
				'focus': fn,
				'blur': fn,
				'change': fn,
				'keyup': fn,
				'mouseover': fn,
				'mouseout': fn
			});

			baidu(me.getElement(me.action+'timer')).on('click',function(evt){
				evt.preventDefault();		
				me._log('click',me.action);
				var opt = {
					url : '/v2/unite-send',
					data : {token: me.config.token,tpl:(me.config.product),type: me.initDataStatus.bindType || me.authData.type},
					vcodeinitText : evt.target.value		
				}
				me._sendVcode(evt,opt);
			});


			baidu(me.getElement('secureLogin')).on('click',function(){
				me._log('click',me.action);
				me.authData = me.authData || {};
				me.authData.action = me.authData.type == 'mobile' ? 'mobileAuth' : 'emailAuth';
				me.draw(me.authData);
			})

			baidu(me.getElement('pwdAuth')).on('click',function(){
				me._log('click',me.action);
				me.authData = me.authData || {};
				me.authData.action = 'pwdAuth';
				me.draw(me.authData);
			})

		}


	},

	_sendVcode: function(evt,opt){
		var ele = evt.target,
			me = this,
			timmer,
			counter = 60;
		if(ele.disabled) return;
		ele.disabled = true;
		clearTimeout(timmer);
		ele.value = opt.vcodeingText || me.lang.vcodeingText;
		passport.data.jsonp(opt.url,opt.data).success(function(rsp){
			if(rsp.errInfo.no == 0){
				function countdown(){
	            	if(--counter == 0) {
	            		ele.value = opt.vcodeinitText;
		                ele.disabled = false;
		                return;
		            };
		            ele.value = me.lang.reSend+'('+counter+')'
		            timmer = setTimeout(function(){
		                countdown();
		            }, 1000);
		        };
		        countdown()
		        me._validateSuccess({})
			}else{
				ele.disabled = false;
				ele.value = opt.vcodeinitText;
				if(rsp.errInfo.msg.indexOf('系统繁忙') > -1 || me._inArray(rsp.errInfo.no,['-1','-3','7','12','13','62007','62005','500010','400005','400003']) > -1){
					rsp.errInfo.msg += '，<a href="http://passport.baidu.com/v2/?ucenterfeedback#upgrade">问题反馈</a>'
				}
				me._validateError({msg:rsp.errInfo.msg})
			}
		})

	},


	_setValidator: function(){
		var me = this;
		if(!me.validatorInited) {
			me.validatorInited = true;
			me.validateRules = {
				'password': {
					rules: ['required'],
					desc: me.lang.password
				},
				'verifyCode': {
					rules: ['required'],
					desc: (me.initDataStatus.status == 'auth' ? (me.authData.type == 'mobile' ? me.lang.smsVerifyCode : me.lang.emailVerifyCode) : (me.initDataStatus.bindType == 'mobile' ? me.lang.bindmobileverifyCode : me.lang.bindemailverifyCode))
				}
			}
			me._validator.init(me, me.validateRules);
		}
	},
	_log : function(type,action){
		var me = this;
		var logType = 'pcConnect_'+type + '_' + action ;
	    if(me.logHistory[logType]){
		  return;
		}
		var link = 'https://passport.baidu.com/img/v.gif?type='+logType+'&v='+(new Date()).getTime();
		if(link){
			var img = new Image();
			img.onload = img.onerror = function() {
				img.onload = img.onerror = null;
				img = null
			};
			img.src = link;   
			me.logHistory[logType]=true;
		}
	},
	_inArray: function( elem, arr ) {
		var me = this;
		var len;

		if ( arr ) {
			len = arr.length;
			for(var i=0;i<len;i++){
				if(elem === arr[i]){
					return i;
				}
			}
		}

		return -1;
	},
	
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		if(ele){
			ele.addClass(me.constant.ERROR_CLASS);
		}
		this.getElement('error').innerHTML = info.msg;

		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		//me.clearGeneralError();
		this.getElement('error').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
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
				me._log('click',me.action);
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
	       	 	if(!returnValue) return;
	       	 	
				this.addClass(me.constant.HOVER_CLASS);
			},
			mouseout: function(field, e){
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
	       	 	if(!returnValue) return;
	       	 	
				this.removeClass(me.constant.HOVER_CLASS);
			},
			keyup: function(field, e){
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
	       	 	if(!returnValue) return;
	       	}
		},
		behaviour = {
			focus: {

			},
			blur: {
				'password': function(field, e){
					var value = this.get(0).value;
					if(value.length){
						me.validate(field);
					}
				},
				'verifyCode': function(field, e){
					var value = this.get(0).value;
					if(value.length){
						me.validate(field);
					}
				}
			},
			change: {

			},
			click: {

			},
			keyup: {

			},
			submit: function(e){
				e.preventDefault();
				me._log('click',me.action);
				me.validateAll({
					success: function(){
						me.getElement(me.action+'submit').focus();
						/**
						 * @description 表单提交前
						 * @name magic.passport.login#beforeSubmit
						 * @event
						 * @grammar magic.passport.login#beforeSubmit
						 */
						var returnValue = me.fireEvent('beforeSubmit');
			       	 	if(!returnValue) return;
						
						var data = baidu.form.json(me.getElement(me.action+'form'));

						
						if(me.action == 'bind' && data.verifyCode){
							try{
			            		setMaxDigits(131);
			            		var key = new RSAKeyPair("10001", '', me.rsa);
								data.password = encryptedString(key, data.password);
			            	}catch(err){}

							data.loginpass = data.verifyCode
							delete data.verifyCode
						}

						if(me.action == 'pwdAuth' && data.password){
							try{
			            		setMaxDigits(131);
			            		var key = new RSAKeyPair("10001", '', me.rsa);
								data.password = encryptedString(key, data.password);
			            	}catch(err){}
							data.loginpass = data.password;
                            delete data.password;
						}


						if((me.action == 'mobileAuth' || me.action == 'emailAuth') && data.verifyCode){
							data.loginpass = data.verifyCode;
                            delete data.verifyCode;
						}                        

                        passport.data.post('/v2/unite-bind',data).success(function(rsp){
                        	if(rsp.errInfo.no == 0){
                    			/**
								 * @description 成功
								 * @name magic.passport.connect#connectSuccess
								 * @event
								 * @grammar magic.passport.connect#connectSuccess(e)
				                 * @param {Object} e 事件参数
				                 * @param {Object} e.data 服务器返回信息
				                 * @param {Boolean} evt.returnValue 返回false时，阻止跳转
								 */
								var returnValue = me.fireEvent('connectSuccess', {
									rsp: rsp
								});
		       	 				if(!returnValue) return;

								window.location.href = rsp.data.u;
                        	}else{
                        		/**
								 * @description 登录失败
								 * @name magic.passport.connect#connectError
								 * @event
								 * @grammar magic.passport.connect#connectError(e)
				                 * @param {Object} e 事件参数
				                 * @param {Object} e.rsp 服务器返回信息
								 */
								var returnValue = me.fireEvent('connectError', {
									rsp: rsp
								});

		       	 				if(!returnValue) return;
								if(rsp.errInfo.msg.indexOf('系统繁忙') > -1 || me._inArray(rsp.errInfo.no,['5','6','7','10','12','13','-1','-3','-2','-6','7','400011','400010','500010','500012','400005','400003','62007','62005','62004','500002','500010']) > -1){
                                    rsp.errInfo.msg += '，<a href="http://passport.baidu.com/v2/?ucenterfeedback#upgrade">帮助中心</a>';
								}
		       	 				me._validateError({msg:rsp.errInfo.msg})
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

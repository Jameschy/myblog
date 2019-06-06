///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 设置密码
 * @class
 * @name magic.passport.accSetPwd
 * @grammar new magic.passport.accSetPwd(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.accSetPwd} magic.passport.accSetPwd 实例
 * @superClass magic.passport
 */
magic.passport.accSetPwd = baidu.lang.createClass(function(options){
	var me = this;
	me.action = '';
	var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
	me._domain = {
		"https":"https://passport.baidu.com",
		"http":"http://passport.baidu.com/",
		"staticFile" : (protocol =="https:")?"https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv":"http://passport.bdimg.com/",
		"auto":(protocol=="https:")?"https://passport.baidu.com":"http://passport.baidu.com/"
	};
	me.config = {
		product: '',//string,产品线TPL
		charset: '',
		hasPlaceholder:true,
		staticPage: '',//string,静态跳转文件
		u: '',
		authsid: '',
		bdstoken: '',
		lang: 'zh-CN',
		lstr: '',
		ltoken: '',
		forbidJump: '',
		clientfrom: '',
        username: '',
        loginLogo: '1'
	};

	baidu.extend(me.config, options);

	me.unameExist = 0;
	this.module = 'accSetPwd';
	me.constant = {
		CHECKVERIFYCODE:true,
		CONTAINER_CLASS: 'tang-pass-accSetPwd',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error'
	};
	this.guideRandom = (function(){
    	return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
    		return v.toString(16); 
    	}).toUpperCase();
    })()

	me.lang = passport.err.getCurrent().labelText.accSetPwd;

	//是否加载默认CSS
	if(me.config.defaultCss){
		me._loadCssFileW('accSetPwd.css'/*tpa=http://passport.baidu.com/passApi/css/accSetPwd.css*/,function(){ //如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
		})
	}

},{
    type: "magic.passport.accSetPwd",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			loginSuccessTip : '<p class="pass-setPwd-title pass-setPwd-loginStitle">'+me.lang.loginSuccessTip+'</p>',

			tip: '<p class="pass-setPwd-tip">'+me.lang.tip+'</p>',
			usernameTip: '<p class="pass-setPwd-tip">'+me.lang.usernameTip+'</p>',

			generalError: '<p id="'+me.$getId('setPwdErrorWrapper')+'" class="pass-generalErrorWrapper">'+
						  	 '<span id="'+me.$getId('setPwdError')+'" class="pass-generalError pass-generalError-error"></span>'+
						  '</p>',
         
			submit: '<p id="'+me.$getId('submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('submit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit" />'+
			    '</p>',
			suggestName: '<div id="'+me.$getId('suggestNameWrapper')+'" class="pass-suggest-name"></div>',
			pwdChecklist:'<div class="pwd-checklist-wrapper">'+
					'<span class="pwd-checklist-arrow"><em class="arrowa">◆</em><em class="arrowb">◆</em></span>'+
					'<ul id="'+me.$getId('pwdChecklist')+'" class="pwd-checklist">'+
						'<li id="'+me.$getId('pwd_checklist_len')+'" data-rule="len" class="pwd-checklist-item">'+me.lang.pwdChecklist_len+'</li>'+
						'<li id="'+me.$getId('pwd_checklist_cha')+'" data-rule="cha" class="pwd-checklist-item">'+me.lang.pwdChecklist_cha+'</li>'+
						'<li id="'+me.$getId('pwd_checklist_spa')+'" data-rule="spa" class="pwd-checklist-item">'+me.lang.pwdChecklist_spa+'</li>'+
					'</ul>'+
				'</div>'
		}
		return template[field];
	},

	_getTemplate: function(action,opt){
		var me = this,
			templateStr = '<form id="'+me.$getId('form')+'" class="pass-form pass-form-setPwd" method="POST" autocomplete="off">',
			hiddenFields = {
				u: me.config.u,
				selectedSuggestName: ''
			};
		if(me.config.username == 1) {
			templateStr += me._getIrregularField('usernameTip');
        } else if (me.config.forbidJump || me.config.loginLogo !== '1') {
			templateStr += me._getIrregularField('tip');
		} else {
			templateStr += me._getIrregularField('loginSuccessTip');
			templateStr += me._getIrregularField('tip');
		}
		
		templateStr += me._getIrregularField('generalError');
		templateStr += me._getHiddenField(hiddenFields);
		if(me.config.username == 1) {
			templateStr += me._getRegularField({
				field: 'username',
				label: me.lang.username,
	            noError: true
			});
		}
		templateStr += me._getRegularField({
			field: 'password',
			pwd: true,
			label: me.lang.password,
            noError: true
		});
		
		templateStr += me._getIrregularField('submit');
		return templateStr;

	},


	_setValidator: function(){
		var me = this;
		me.validateRules = {
			'password': {
				rules: ['required'],
				desc: me.lang.password
			},
			'username': {
				rules: ['required'],
				desc: me.lang.username
			}
		}
		me._validator.init(me, me.validateRules);
	},

	_pwdValidatorFn: function(field){
		var me = this;
		var _value = field.value ;
 
		//添加全数字和8-14为有空格检测
		var allNumber = new RegExp('^[0-9]*$');
		var noSpace = /^([0-9a-zA-Z_`!~@#$%^*+=,.?;'":)(}{/\\|&lt;&gt;&amp;[-]|\]]){8,14}$/;

		if(_value == ''){
			me.getElement('setPwdError').innerHTML = me.lang.password;
			baidu(field).addClass(me.constant.ERROR_CLASS);
			return false ;
		}
		else if(allNumber.test(_value)){
			me.getElement('setPwdError').innerHTML = me.lang.passwordAllNum;
			baidu(field).addClass(me.constant.ERROR_CLASS);
			return false ;
		}
		else if(!(noSpace.test(_value))){
			me.getElement('setPwdError').innerHTML = me.lang.passLimitDigit;
			baidu(field).addClass(me.constant.ERROR_CLASS);
			return false ;
		}

		me.getElement('setPwdError').innerHTML = '';
		baidu(field).removeClass(me.constant.ERROR_CLASS);
		return true ;
	},
	
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		if(ele){
			ele.addClass(me.constant.ERROR_CLASS);
		}
		this.getElement('setPwdError').innerHTML = info.msg;

		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		this.getElement('setPwdError').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
	},

	_getRSA : function(callback){
		var me = this;
		passport.data.getRsaKey({
			gid: me.guideRandom || ''
		}).success(function(cert){
			if(!cert.errInfo.no && cert.errInfo.no != 0){
				cert = cert.data;
			}
		    var RSA = new passport.lib.RSA();
	        RSA.setKey(cert.pubkey);
		
	        callback && callback({
	        	RSA:RSA,
	        	rsakey:cert.key
	        })
		})
	},
	_setPwdStrengthTip: function(){
		var me = this,
			strengthTip = baidu(me.getElement('pwdChecklist')),
			passwordTip = baidu(me.getElement('passwordTipText'));
		if(me.config.isLowpwdCheck){
			return
		}
		if(!strengthTip.length) {
			strengthTip = baidu(me._getIrregularField('pwdChecklist'));
			passwordTip.append(strengthTip);
		}
		baidu(me.getElement('password_clearbtn')).on('mousedown',function(){
			baidu(me.getElement('pwd_checklist_len')).removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
			baidu(me.getElement('pwd_checklist_cha')).removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
			baidu(me.getElement('pwd_checklist_spa')).removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
		})
	},
	passwordCheckList:function(field){
		var me = this,
			$ele = me.getElement(field),
			$passwordTip = baidu(me.getElement('passwordTip')),
			tipText = baidu(me.getElement(field + 'tipText')),
			lenEle = baidu(me.getElement('pwd_checklist_len')),
			chaEle = baidu(me.getElement('pwd_checklist_cha')),
			spaEle = baidu(me.getElement('pwd_checklist_spa'));
		$passwordTip.show()
		me.password = {};
		me.password.err = 0;
		if(!$ele.value.length){
			lenEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
			chaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
			spaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
			return ;
		}

		if($ele.value.length > 14 || $ele.value.length < 8){
			me.password.err ++;
			lenEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error')
		}else{
			lenEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
		}

		if($ele.value.indexOf(' ') != '-1'){
			me.password.err ++;
			spaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error')
		}else{
			spaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
		}

		if($ele.value.length){
			chaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error')
		}else{
			me.password.err ++;
			chaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error')
		}
	},
	_loadCssFileW:function(url,cb){
		var me = this;
		window._loadedFilesW = window._loadedFilesW || {};
		if(!window._loadedFilesW[url]) {
            window._loadedFilesW[url] = true;
            var l = document.createElement("link");
            l.rel = "stylesheet";
            l.type = "text/css";
            l.href =  me._domain.staticFile +url ;
            document.getElementsByTagName("head")[0].appendChild(l);
		    if (l.readyState) {//IE
		        l.onreadystatechange = function() {
		            if (l.readyState == "loaded" || l.readyState == "complete") {
		                l.onreadystatechange = null;
		                cb && cb()
		            }
		        };
		    } else {
		        l.onload = function() {
		                cb && cb()
		        };
		    }
	    }		
	},
	setMakeOption: function (authsid,bdstoken) {
        var me = this;
        makeDom.innerHTML = str || '' ;
        me.config.authsid = authsid || '';
        me.config.bdstoken = bdstoken || '';
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
        var target = baidu(me.getElement());//baidu('#'+id);
        target.addClass(me.constant.CONTAINER_CLASS);

		var template = me._getTemplate();
		target.get(0).appendChild(baidu(template).get(0));


		if(me.config.hasPlaceholder){
	        var rendList = [{
					        	label:'password',
					        	placeholder:"pwdPlaceholder"
					        },{
					        	label:'username',
					        	placeholder:"usernamePlaceholder"
					        }];
	        me._getPlaceholder(rendList)
        }
        me._setValidator();
		me._setEvent();
		me._setPwdStrengthTip();
	},

	_showTip: function(){
		var me = this;
		me.getElement('passwordTip').style.display = 'block';
	},
	_hideTip: function(){
		var me = this;
		me.getElement('passwordTip').style.display = 'none';
	},
	_showSuggestNames: function(suggestNames, key){
		var me = this;
		// 防止频繁 blur 使推荐列表被更新
		if(key == me.suggestListKey) return;
		// 生成容器
		if(!baidu(me.getElement('suggestNameWrapper')).length){
			var newNode = baidu(me._getIrregularField('suggestName')).get(0);
			me.getElement('usernameWrapper').appendChild(newNode)
		}
		me.suggestListKey = key;
		var suggestNameWrapper = me.getElement('suggestNameWrapper');
		if(!suggestNames || !suggestNames.length){
			suggestNameWrapper.innerHTML = '';
			me.getElement('suggestNameWrapper').style.display = 'none';
		}else{
			suggestNameWrapper.innerHTML = '';
			me.getElement('suggestNameWrapper').style.display = 'block';
			for(var i = 0 , j = suggestNames.length; i < j ; i++){
				var newNode = baidu('<p class="pass-suggest-item"><label name="suggestName"><input name="suggestName" type="text" class="pass-suggest-item-radio" value="'+suggestNames[i]+'" /></label></p>').get(0);
				suggestNameWrapper.appendChild(newNode);
			}
		}
	},

	checkUserName: function(callbacks){
		var me = this,
			ele = me.getElement('username');
		me.getElement('submit').disabled = true;
		passport.data.checkUserName({
			userName: ele.value
		})
		.success(function(rsp){
			me.getElement('submit').disabled = false;
			if(rsp.errInfo.no == 0){
				if(rsp.data.userExsit == 1){
					// fail
					me._validateError({msg:me.lang.userNameExistsError});
					me.unameExist = 1;
				} else {
					me.unameExist = 0;
				}
				me._showSuggestNames(rsp.data.suggNames, ele.value);
			} else {
                me._showSuggestNames([], ele.value);
                if(rsp.errInfo.msg) {
                	me._validateError({msg:rsp.errInfo.msg});
                }
            }
		})
		.fail(function() {
			me.getElement('submit').disabled = false;
		});
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
				'password': function(field, e){
					me._showTip();
                    me._getRSA(function(result){
                        me.RSA = result.RSA;
                        me.rsakey = result.rsakey;
                    })
                }
			},
			blur: {
				'password': function(field, e){
                    var value = this.get(0).value;
                    me._hideTip();
                    if(value.length){
                        me.validate(field);
                    }
                },
                'username': function(field,e) {
                	me.checkUserName();
                }
			},
			change: {

			},
			click: {
				'suggestName': function(){
                    var boxDom = this.get(0);
                    if(!boxDom.tagName || (boxDom.tagName != "LABEL")) {
                        boxDom = boxDom.parentElement || boxDom.parentNode || null;
                    }
                    if (boxDom) {
                        boxDom = boxDom.getElementsByTagName('input')[0];
                    }
					var value = boxDom.value;

					me.getElement('suggestNameWrapper').innerHTML = '';
					me.getElement('suggestNameWrapper').style.display = 'none';
					me.getElement('username').value = value;
					
					// TODO: 考虑选中推荐用户名后，不通过调用验证消除错误提示
					// me.validate('userName');
					me.setValidateSuccess('username');
					me.suggestListKey = value;
					me.getElement('selectedSuggestName').value = value;
					me.unameExist = 0;
				}
			},
			keyup: {
				'password': function(field, e){
					var ele = me.getElement(field);
					if(me.config.isLowpwdCheck){
						return
					}
					me.passwordCheckList(field)
                }
			},
			submit: function(e){				
				e.preventDefault();

				setTimeout(function () {
					me.validateAll({
						success: function(){
							var _pwd = me.getElement('password') ;
							if(!me._pwdValidatorFn(_pwd)){return ;}
							if(me.unameExist) {
								me._validateError({msg:'用户名已存在'})
								return;
							}
							me.getElement('submit').focus();
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
							
							if(me.RSA && me.rsakey ){
								var passwordVal = me.getElement('password').value;
								if(passwordVal.length < 128 && !me.config.safeFlag){
									data.password = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
									data.rsakey = me.rsakey;
									data.crypttype = 12;
								}
							 }
							if(me.config.forbidJump) {
								data.lstr = me.config.lstr || '';
								data.ltoken = me.config.ltoken || '';
								data.clientfrom = me.config.clientfrom || '';
							} else {
								data.bdstoken = me.config.bdstoken || '';
							}
							data.authsid = me.config.authsid || '';
							if(me.config.sub_source && me.config.sub_source == 'leadsetpwd') {
								data.sub_source = 'leadsetpwd';
							}
							if(me.config.username == 1) {
								data.tpl = me.config.product;
								data.staticPage = me.config.staticPage;
								passport.data.post('/v3/getpass/api/showsetpwdusername/', data).success(function(rsp) {
									if(rsp.errInfo.no == '0'){
										var returnValue = me.fireEvent('submitSuccess');
                                        me._validateError({msg: '设置成功'});
                                        if (!returnValue) {
                                            return;
                                        }
									}else{
										me._validateError({msg:rsp.errInfo.msg})
									}
								});
							} else {
								data.tpl = encodeURIComponent(me.config.product);
								passport.data.jsonp('/v3/getpass/api/setpwd/',data).success(function(rsp){
									if(rsp.errInfo.no == '0'){
										var returnValue = me.fireEvent('submitSuccess');
									}else{
										me._validateError({msg:rsp.errInfo.msg})
									}
								})
							}

						}
					},true)
				},0);
			}
		};
		return {
			entrance: function(e){
				me = this;
				var target = baidu(e.target),
					field = e.target.name;
                if(!field && e.target.id) {
                    var matches = e.target.id.match(/\d+__(.*)$/);
                    if (matches) {
                        field = matches[1];
                    }
                }
                if (!field) {
                    return;
                }
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
	
	$dispose: function(){
		var me = this;
		if(me.disposed){return;}
		baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
		me.getElement().removeChild(me.getElement('form'));
		magic.Base.prototype.$dispose.call(me);
	}
});

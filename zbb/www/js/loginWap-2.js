magic.passport.loginWap = baidu.lang.createClass(function(options){
	var me = this;

	if(passport && passport._protocol == 'https'){
		var protocol = 'https:'
	}else{
		var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase()
	}

	me._domain = {
		"auto":  (protocol =="https:")?"https://wappass.baidu.com":"http://wappass.baidu.com/"
	};

	me.config = {
		isPhone: false,
		memberPass: true,
		safeFlag: 0,
		product: '',
		charset: '',
		staticPage: '',
		subpro: '',
		u: '',
		lang: 'zh-CN'
	};
	baidu.extend(me.config, options);

	this.module = 'loginWap';

	this.serverTimeCount = 0 ;

	me.rsa = "B3C61EBBA4659C4CE3639287EE871F1F48F7930EA977991C7AFE3CC442FEA49643212E7D570C853F368065CC57A2014666DA8AE7D493FD47D171C0D894EEE3ED7F99F6798B7FFD7B5873227038AD23E3197631A8CB642213B9F27D4901AB0D92BFA27542AE890855396ED92775255C977F5C302F1E7ED4B1E369C12CB6B1822F";

	me.constant = {
		CONTAINER_CLASS: '',
		FOCUS_CLASS: '',
		HOVER_CLASS: '',
        ERROR_CLASS: '',
        NOCAPTCHA_URL: 'https://passport.baidu.com/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime())
	};
	
	me.lang = {
			'zh-CN': {
				"username" : "帐号",
				"password" : "密码",
				"verifycode" : "验证码",
				"usernamePlaceholder" : "手机号/邮箱/用户名",
				"passwordPlaceholder" : "密码",
				"verifycodePlaceholder" : "验证码",
				"forgot" : "登录遇到问题",
				"submitText": "登录",
				"submitLoading5s" : "继续登录中",
				"submitLoading" : "登录中"
			}
	}[me.config.lang];
	
	// init data
	passport.data.setContext(baidu.extend({}, me.config));	
	this.initTime = new Date().getTime();

    // 引入人机js
    me.insertNoCaptchaScript();

},{
    type: "magic.passport.loginWap",
    superClass: magic.passport
}).extend({

	_getIrregularField: function(field){
		var me = this,
		template = {
			username: '<p id="'+me.$getId('usernameWrapper')+'" class="pass-form-item pass-form-wrapper">'+
			        		'<label for="'+me.$getId('username')+'" id="'+me.$getId('usernameLabel')+'" class="pass-label pass-label-username"></label>'+
			        		'<input id="'+me.$getId('username')+'" type="text" name="username" class="pass-text-input pass-text-input-username" autocomplete="off" placeholder="'+me.lang.usernamePlaceholder+'" />'+
			        		'<span class="pass-input-clearValue" id="'+me.$getId('usernameClearValue')+'"></span>'+
			    	  '</p>',
			password: '<p id="'+me.$getId('passwordWrapper')+'" class="pass-form-item pass-form-wrapper pass-form-item-password">'+
			        		'<label for="'+me.$getId('password')+'" id="'+me.$getId('passwordLabel')+'" class="pass-label pass-label-password"></label>'+
			        		'<input id="'+me.$getId('password')+'" type="password" name="password" class="pass-text-input pass-text-input-password" autocomplete="off" placeholder="'+me.lang.passwordPlaceholder+'" />'+
			        		'<span class="pass-input-clearValue" id="'+me.$getId('passwordClearValue')+'"></span>'+
			        		'<span id="'+me.$getId('pwdToggle')+'" class="pass-input-aide pass-input-pwdToggle"></span>'+
			    	  '</p>',

			verifycode: '<p id="'+me.$getId('verifycodeImgWrapper')+'" class="pass-form-item pass-form-item-verifycode" style="display:none;">'+
			        		'<span class="pass-form-wrapper">'+
			        			'<input id="'+me.$getId('verifycode')+'" type="text" name="verifycode" class="pass-text-input pass-text-input-verifycode" maxlength="6" autocomplete="off" placeholder="'+me.lang.verifycodePlaceholder+'"/>'+
			        			'<span class="pass-input-clearValue" id="'+me.$getId('verifycodeClearValue')+'"></span>'+
			        		'</span>'+
			        		'<img id="'+me.$getId('verifycodeImg')+'" class="pass-verifycode" src="" />'+ 
			        		'<span id="'+me.$getId('verifycodeChange')+'" href="#" class="pass-change-verifycode"></span>'+
			    		'</p>',
			submit: '<p id="'+me.$getId('submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('submit')+'" type="submit" value="'+me.lang.submitText+'" class="pass-button pass-button-submit pass-button-disabled" />'+
			    '</p>',

			generalError: '<p id="'+me.$getId('errorWrapper')+'" class="pass-generalErrorWrapper">'+
			        '<span id="'+me.$getId('error')+'" class="pass-generalError"></span>'+
			    '</p>',
			passwordRightDom: '<span id="'+me.$getId('pwdToggle')+'" class="pass-input-aide pass-input-pwdToggle"></span>',
			forgot  : '<p class="pass-forgot"><a id="'+me.$getId('forgot')+'" class="pass-right" href="http://wappass.baidu.com/passport/getpass?tpl='+me.config.product+'&u='+me.config.u+'">'+me.lang.forgot+'</a></p>'
		}
		return template[field];
	},


	_getTemplate: function(containerId){
		var me = this,
			templateStr = '<form id="'+me.$getId('form')+'" method="POST" autocomplete="off">',
			hiddenFields = {
				codeString: '',
				isphone: 0,
				safeFlag: me.config.safeFlag,
				u: me.config.u,
				subpro: me.config.subpro,
				staticPage: me.config.staticPage,
				loginmerge:1
			};
		
		templateStr += me._getIrregularField('generalError');

		templateStr += me._getHiddenField(hiddenFields);
		
		templateStr += me._getIrregularField('username');

		templateStr += me._getIrregularField('password');


		templateStr += me._getIrregularField('verifycode');



		templateStr += me._getIrregularField('submit');

		templateStr += me._getIrregularField('forgot');

		templateStr += '</form>';
		
		return templateStr;
	},

	_getSeverTime : function(){
		var me = this;
		//if(Math.floor(Math.random()*100) > 10) return;
		passport.data.jsonp(me._domain.auto + '/wp/api/security/antireplaytoken?tpl='+me.config.product+'&v='+new Date().getTime(),{})
		.success(function(rsp){
			me.serverTime = rsp.data.time;
		})



	},


	render: function(id){
		var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement());//baidu('#'+id);
        //target.addClass(me.constant.CONTAINER_CLASS);
		
		var template = me._getTemplate();
		target.get(0).appendChild(baidu(template).get(0));

		var returnValue = me.fireEvent('render');
        if(!returnValue) return;
        
		me._setValidator();

		me._getSeverTime();

		me._setEvent();
		me._moudleEvent();
	},

    insertNoCaptchaScript: function () {
        var me = this;
        me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {});
    },

    insertScriptW: function (u, cb) {
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[u]) {
            window._loadedFilesW[u] = true;
            var d = document;
            var s = d.createElement('SCRIPT');
            s.type = 'text/javascript';
            s.charset = 'UTF-8';
            if (s.readyState) {// IE
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

    getDv: function () {
        if (window.LG_DV_ARG.dvjsInput) {
            return window.LG_DV_ARG.dvjsInput;
        } else if (document.getElementById('dv_Input')) {
            return document.getElementById('dv_Input').value;
        } else {
            return '';
        }
    },

	_moudleEvent : function(){
		var me = this;
		var fn = function(e){
			me._eventHandler.entrance.apply(me, [e]);
		};
		baidu('.pass-input-clearValue', me.getElement()).on({
			'click': fn
		});
		baidu('.pass-verifycode', me.getElement()).on({
			'click': fn
		});
		baidu('.pass-change-verifycode', me.getElement()).on({
			'click': fn
		});

		

		baidu('.pass-input-pwdToggle', me.getElement()).on({
			'click': fn
		});

	},

	_getVerifyCode : function(codeString){
        var me = this;	        
        me.getElement('verifycodeChange').parentNode.style.display = '';
        if(codeString && codeString.length){
        	me.getElement('verifycodeImg').src = 'http://wappass.baidu.com/cgi-bin/genimage?' + codeString + '&v='+new Date().getTime();
            if(!me.getElement('vcodestr')){
            	baidu(me.getElement('hiddenFields')).append('<input type="hidden" id="'+me.$getId('vcodestr')+'" name="vcodestr" value="" />')
            };
            me.getElement('vcodestr').value = codeString;
        }else{
            var img = me.getElement('verifycodeImg'),
            	src = img.src.split('&')[0];
            img.src = src+'&v='+new Date().getTime();
        }
        me.getElement('verifycode').value = '';
        me.getElement('verifycode').focus();
        me._setSubmitStyle()
	},

	_clearVerifyCode : function(){
        var me = this;
        me.getElement('verifycodeImgWrapper').style.display = 'none';
       	me.getElement('vcodestr').value = ''; 
    },

	_sureAccountType : function(){
		var me = this;
    	var temp = '<div class="pass-sureAccount-content" id="'+me.$getId('sureAccountType')+'">'+
    					'<p>亲爱的用户:</p>'+
    					'<p>为了确保您的帐号安全，请先确认您输入的帐号是用户名还是手机号</p>'+
    					'<div class="pass-sureAccount-btn">'+
    						'<input type="button" value="手机号" class="pass-button-auto" id="'+me.$getId('accountTypePhone')+'">'+
    						'<input type="button" value="用户名" class="pass-button-auto" id="'+me.$getId('accountTypeUsername')+'">'+
    					'</div>'+
    					'<p class="pass-goback-login"><a href="###">帐号密码登录</a></p>'+
    				'</div>';

        me.getElement().appendChild(baidu(temp).get(0));
        me.getElement('form').style.position = 'absolute';
        me.getElement('form').style.left = '-10000px';

        baidu('.pass-button-auto', me.getElement()).on('click',function(evt){
        	me.getElement('loginmerge').value = 0;
        	me.getElement('isphone').value = (evt.target.value == '手机号' ? 1 :0);
        	me._submit();
        	evt.preventDefault();
        });

        baidu('.pass-goback-login a', me.getElement()).on('click',function(evt){
        	var dom = me.getElement('sureAccountType');
        	var parent = dom.parentNode;
        	parent.removeChild(dom);
        	me.getElement('loginmerge').value = 1;
        	me.getElement('form').style.position = 'static';
        	evt.preventDefault();
        })

	},
	_setValidator: function(){
		var me = this;
		me.validateRules = {
			'username': {
				rules: ['required'],
				desc: me.lang.username
			},
			'password': {
				rules: ['required'],
				desc: me.lang.password
			},
			'verifycode': {
				rules: ['required'],
				desc: me.lang.verifycode
			}
		}
		me._validator.init(me, me.validateRules);
	},

	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		me.setGeneralError(info.msg);
		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));	
		me.clearGeneralError();
		opt && opt.callback && callback();
	},

    _setSubmitStyle : function(time){
    	var me = this;
        clearTimeout(me.keyupTimer);
        function callback(){
            me.keyupTimer = true;
            for(var i in me.validateRules){
                var ele = me.getElement(i);
                if(!ele || ele.offsetHeight == 0) continue
                if(ele.value == ''){
                    if(me.getElement('submit').className.indexOf('pass-button-disabled') == -1){
                        baidu(me.getElement('submit')).addClass('pass-button-disabled')
                    }
                    return false;
                }
            }
            baidu(me.getElement('submit')).removeClass('pass-button-disabled')                
        }
        if(time === 0){
            callback()
        }else{
            me.keyupTimer = setTimeout(function(){
                callback()
            },200)
        }
    },

	_submit: function(e){
		var me = this;
        var ele = me.getElement('submit');
        if(ele.disabled) return;

		me.validateAll({
			success: function(){
                me.getElement('submit').focus();
                var returnValue = me.fireEvent('beforeSubmit');
	       	 	if(!returnValue) return;
				ele.disabled = true;
                ele.value = me.lang.submitLoading;

				var data = baidu.form.json(me.getElement('form'));
				data.password = me.getElement('password').value;
				var passwordVar = data.password;
				data.timeSpan = new Date().getTime() - me.initTime;
				data.apitype = 'wap';
                var dv = me.getDv();
                data.dv = dv || '';
				try{
            		setMaxDigits(131);
            		if(me.serverTime){
                        data.password = data.password + me.serverTime;
                        data.servertime = me.serverTime;
                    }
            		var key = new RSAKeyPair("10001", '', me.rsa);
					data.password = encryptedString(key, data.password);
            	}catch(err){}
				passport.data.post(me._domain.auto + '/wp/api/login?v='+new Date().getTime(),data).success(function(rsp){
					ele.disabled = false;
                    clearTimeout(me.submitTimer10s);
					if(rsp.errInfo.no == 0){
						var returnValue = me.fireEvent('loginSuccess', {
							rsp: rsp
						});
       	 				if(!returnValue) return;
                        document.location = rsp.data.u;
                    }else{
                    	me._getSeverTime();
                    	if(!me.getElement('password').value){
                    		me.getElement('password').value = passwordVar;
                    	}

						var returnValue = me.fireEvent('loginError', {
							rsp: rsp
						});
       	 				if(!returnValue) return;

       	 				if(rsp.data.gotoUrl){
       	 					document.location = rsp.data.gotoUrl;
       	 				}else if(rsp.errInfo.no == 400401){
                            me._sureAccountType()
                        }else if(rsp.errInfo.no == 50018 && me.serverTimeCount <= 2){
                            //me.serverTime = rsp.data.serverTime;
                            me._submit(e);
                            return;
                        }else{
                        	if(rsp.errInfo.msg.indexOf('系统繁忙') > -1 || passport.data.base.array.indexOf( ['500004','400012','50000'],rsp.errInfo.no) > -1){
                                rsp.errInfo.msg += '，<a href="http://passport.baidu.com/passApi/js/modules/' + me._domain.auto + '/wp/feedback?errno=' + rsp.errInfo.no + '">帮助中心</a>';
                            }else if(passport.data.base.array.indexOf( ['400010'],rsp.errInfo.no) > -1){
                                rsp.errInfo.msg += '或<a href="http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/passport/login?sms=1">短信登录</a>'
                            }else if(passport.data.base.array.indexOf( ['900001'],rsp.errInfo.no) > -1){
                                rsp.errInfo.msg += '，<a href="http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/wp/feedback?errno='+rsp.errInfo.no+'#faq5">如何开启？</a>'
                            }
                        }

                        me.setGeneralError(rsp.errInfo['msg']);

                        if(rsp.data.codeString){
                            me._getVerifyCode(rsp.data.codeString);
                            var dom = me.getElement('sureAccountType');
                            if(dom){
                            	var parent = dom.parentNode;
                            	parent.removeChild(dom);
                            	me.getElement('form').style.position = 'static';
                            }
                        }

                    }
                    ele.value = me.lang.submitText;


				})

				me.submitTimer10s = setTimeout(function(){
					ele.disabled = false;
					ele.value = me.lang.submitText;
					me.setGeneralError('网络连接失败，请检查您的网络设置并稍后再试。');
				},10000)


            }
        },true)

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

				if(me.getElement(field).value != '' && me.getElement(field+'ClearValue')){
					me.getElement(field+'ClearValue').style.display = 'block';
				}

				var returnValue = me.fireEvent('fieldFocus', {
					ele: this
				});

	       	 	if(!returnValue) return;

	       	 	if(me.getElement(field+'Label')){
	       	 		baidu(me.getElement(field+'Label')).addClass('pass-label-'+field+'-focus')
	       	 	}

	       	 		       	 				
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
				if(me.getElement(field+'ClearValue')){
					setTimeout(function(){
						me.getElement(field+'ClearValue').style.display = 'none';
					},300)
				}

				me._setSubmitStyle(0);

				var returnValue = me.fireEvent('fieldBlur', {
					ele: this
				});
	       	 	if(!returnValue) return;
	       	 	
	       	 	if(me.getElement(field+'Label')){
	       	 		baidu(me.getElement(field+'Label')).removeClass('pass-label-'+field+'-focus')
	       	 	}

	       	 	
				
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
			},
			keyup : function(field,e){
				if(me.getElement(field).value != '' && me.getElement(field+'ClearValue')){
					me.getElement(field+'ClearValue').style.display = 'block';
				}
				me._setSubmitStyle();
			}
		},

		behaviour = {
			focus: {
				'username': function(field,e){

					
					
				},
				'password': function(field , e){
				},
				'verifycode': function(field,e){
					
					
				}
			},
			blur: {
				'userName': function(field, e){
					
				},
				'password': function(field, e){
					
					
				},
				'verifycode': function(field, e){
					
					
				}
			},
			change: {
				'username': function(field, e){
					var value = this.get(0).value;
					if(value.length){
						me.validate(field, {
							success: function(){
								passport.data.jsonp(me._domain.auto + '/wp/api/login/check?username='+value+'&apitype=wap&tpl='+me.config.product+'&v='+new Date().getTime(),{})
								.success(function(rsp){
									if(rsp.data.codeString){
										me._getVerifyCode(rsp.data.codeString);
									}else {
										me._clearVerifyCode();
									}
								})
							}
						});
					}

					
				}
			},
			click: {
				'usernameClearValue' : function(fiele,e){
					me.getElement('username').value = ''
				},
				'passwordClearValue' : function(fiele,e){
					me.getElement('password').value = ''
				},
				'verifycodeClearValue' : function(fiele,e){
					me.getElement('verifycode').value = ''
				},
				'verifycodeImg' : function(field, e){
					me._getVerifyCode();
					e.preventDefault();

				},
				'pwdToggle' : function(field,e){
					var input = me.getElement('password')
					if(input.type == 'text'){
						input.type = 'password';
						baidu(me.getElement(field)).removeClass('pass-input-pwdToggle-show')
					}else{
						input.type = 'text';
						baidu(me.getElement(field)).addClass('pass-input-pwdToggle-show')
					}
					me.getElement('password').focus()
				},
				'verifycodeChange': function(field, e){
					me._getVerifyCode();
					e.preventDefault();
				}
			},
			submit: function(e){
				e.preventDefault();
                me._submit(e);
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
	$dispose: function(){
		var me = this;
		if(me.disposed){return;}
		me.getElement().removeChild(me.getElement('form'));
		magic.Base.prototype.$dispose.call(me);
	}		
});
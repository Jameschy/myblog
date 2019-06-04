///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 补填用户名模块
 * @class
 * @name magic.passport.multiBind
 * @grammar new magic.passport.multiBind(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.multiBind} magic.passport.multiBind 实例
 * @superClass magic.passport
 */
magic.passport.multiBind = baidu.lang.createClass(function(options){
	var me = this;
	me.config = {
		staticPage: '',
		product: '',
		charset: '',
		token: '',
		lang: 'zh-CN',
		subpro:''
	};
	baidu.extend(me.config, options);
	this.module = 'multiBind';
	me.constant = {
		CONTAINER_CLASS: 'tang-pass-fill',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error'
	};
	
	me.lang = passport.err.getCurrent().labelText.multiBind;

	// init data
	passport.data.setContext(baidu.extend({}, me.config));
},{
    type: "magic.passport.multiBind",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			generalError: '<p id="'+me.$getId('errorWrapper')+'" class="pass-generalErrorWrapper">'+
						        '<span id="'+me.$getId('error')+'" class="pass-generalError"></span>'+
						    '</p>',
			submit: '<p id="'+me.$getId('submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('submit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit" />'+
			    '</p>',
			warning: '<div id="'+me.$getId('warning')+'" class="pass-warning" style="display:none;">'+
						'<h3 class="pass-warning-title" id="'+me.$getId('warningTitle')+'"></h3>'+
						'<div class="pass-warning-button clearfix">'+
							'<button class="pass-button pass-button-grey pass-warning-pre-button" id="'+me.$getId('preBtn')+'">'+me.lang.preBtn+'</button>'+
							'<button class="pass-button pass-warning-next-button" id="'+me.$getId('nextBtn')+'">'+me.lang.nextBtn+'</button>'+
						'</div>'+
					'</div>',
			success: '<div id="'+me.$getId('success')+'" class="pass-success" style="display:none;">'+
						'<h3 class="pass-success-title">'+me.lang.submitSuccessTitle+'</h3>'+
						'<div class="pass-success-info clearfix">'+
							'<span class="pass-success-phone" id="'+me.$getId('successPhone')+'"></span>'+
							'<span class="pass-success-uname" id="'+me.$getId('successUname')+'"></span>'+
						'</div>'+
						'<div class="pass-success-close">'+
							'<button class="pass-button pass-success-close-button" id="'+me.$getId('successBtn')+'">'+me.lang.submitSuccessBtn+'</button>'+
						'</div>'+
					'</div>'
		}
		return template[field];
	},
	_getTemplate: function(containerId){
		var me = this,
		templateStr = '<form autocomplete="off" id="'+me.$getId('form')+'" method="POST">',
		hiddenFields = {
            tpl: me.config.product,
			token: me.config.token,
			rsakey: me.rsaKey,
			subpro:me.config.subpro
		},
		regRegularField = [{
			field: 'userName',
			label: me.lang.userName,
            hasSucc: true
		},{
			field: 'password',
			label: me.lang.password,
			pwd:true,
            hasSucc: true
		}];
		
		templateStr += me._getIrregularField('generalError');
		for(var i = 0 ; i < regRegularField.length; i++){
			templateStr += me._getRegularField(regRegularField[i]);
		}
		templateStr += me._getHiddenField(hiddenFields);
		templateStr += me._getIrregularField('submit');
		templateStr += '</form>';

		templateStr += me._getIrregularField('success');

		templateStr += me._getIrregularField('warning');
		
		return templateStr;
	},
	/**
	 * @description render 渲染组件到页面
	 * @function
	 * @name magic.passport.multiBind#render
	 * @grammar magic.passport.multiBind#render(id)
	 * @param {String} id 渲染到的容器的 id
	 */
	render: function(id){
		var me = this;

		if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement()),//baidu('#'+id),
			template = me._getTemplate();
        target.addClass(me.constant.CONTAINER_CLASS);
        for(var i=0;i<baidu(template).length;i++){
			target.get(0).appendChild(baidu(template).get(i));
        }

		me._getPlaceholder([{
			label:"userName",
			placeholder:"userNamePh"
		},{
			label:"password",
			placeholder:"password"
		}])

		me._getRSA();

		/**
		 * @description render 渲染组件到页面
		 * @event
		 * @name magic.passport.multiBind#render
		 * @grammar magic.passport.multiBind#render
		 */
        var returnValue = me.fireEvent('render');
		if(!returnValue) return;
        					
		me._setValidator();
		me._setEvent();
		me._init();
		me.initTime = new Date().getTime();
	},
	_format:function(source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments,1);
        var toString = Object.prototype.toString;
        if(data.length){
            data = data.length == 1 ? 
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' == toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        }
        return source;
    },
	_getRSA:function(){
		var me = this;
		passport.data.getRsaKey().success(function(cert){
			if(!cert.errInfo.no && cert.errInfo.no != 0){
				cert = cert.data;
			}
		    me.rsa = new passport.lib.RSA();
	        me.rsa.setKey(cert.pubkey);
	        me.rsaKey = cert.key;
	        
	        if(me.getElement('rsakey')){
	        	me.getElement('rsakey').value = me.rsaKey;
	        }
		})	
	},
	_init:function(){
		var me = this;
		baidu(me.getElement('preBtn')).on('click',function(evt){
			evt.preventDefault();
			me.$hide('warning').$show('form')
		})
		baidu(me.getElement('nextBtn')).on('click',function(evt){
			evt.preventDefault();
			me._submitData();
		})
	},
	_setValidator: function(){
		var me = this;
		me._validator.addRule('userNameLength',function(ele){
			// ByteLength<14 && 不全是数字
			var len = ele.value.replace(/[^\x00-\xff]/g, 'ci').length;
			return len<=14;
		});
		me._validator.addMsg('userNameLength', me.lang.userNameRulesError);

		me._validator.addRule('passwordRequired',function(ele){
			// ByteLength<14 && 不全是数字
			var len = ele.value.length;
			if(me.needPassword && len<1){
				return false
			}
			return true;
		});
		me._validator.addMsg('passwordRequired', me.lang.passwordRequired);
		
		me.validateRules = {
			'userName': {
				rules: ['required','userNameLength'],
				desc: me.lang.userName
			},
			'password': {
				rules: ['passwordRequired'],
				desc: me.lang.password,
				pwd:true
			}
		}
		me._validator.init(me, me.validateRules);
	},
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		ele.addClass(me.constant.ERROR_CLASS);
		me.$show('error');
		me.getElement('error').innerHTML = info.msg;
		opt && opt.callback && callback();
	},
	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		me.getElement('error').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
	},
	_setPasswordfield:function(userExsit){
		var me = this;
		if(userExsit == '1'){
			baidu(me.getElement('userNameTipText')).removeClass('right').addClass('warn')

			me.getElement('userNameTipText').innerHTML = me.lang.userNameNeedpwd;
			me.$show('passwordWrapper').$hide('userNameSucc').$show('userNameTip')
			me.getElement('password').focus();
			me.needPassword = true

			var returnValue = me.fireEvent('needPassword', {
				ele: this
			});
			if(!returnValue) return;
		}else{
			baidu(me.getElement('userNameTipText')).removeClass('warn').addClass('right')

			me.getElement('userNameTipText').innerHTML = me.lang.userNameNewacc;
			me.$hide('passwordWrapper').$show('userNameSucc').$hide('userNameTip')
			me.needPassword = false

			var returnValue = me.fireEvent('newAccount', {
				ele: this
			});
			if(!returnValue) return;
		}
		me.$show('userNameTip')
	},
	_checkUserName: function(){
		var me = this,
			ele = me.getElement('userName');

		if(ele.value.length < 1){
			me.getElement('userNameTipText').innerHTML = ''
			return;
		}

		passport.data.multiCheckUserName({
			userName: ele.value
		})
		.success(function(rsp){
			if(rsp.errInfo.no == 0){
				me._setPasswordfield(rsp.data.userExsit);
                me.getElement('error').innerHTML = '';
			} else {
				me.$hide('userNameTip').$hide('passwordWrapper');
                me.getElement('error').innerHTML = rsp.errInfo.msg;
            }
		});
	},
	_multiSuccess:function(rsp){
		var me = this,
			startTime = 10;

		me.successTimer;

		var returnValue = me.fireEvent('multiBindBeforeend', {
			rsp: rsp
		});
		if(!returnValue) return;

		me.successTimer = setInterval(function(){
			if(startTime<1){
				var returnValue = me.fireEvent('multiBindEnd', {
					rspData: rsp.data
				});
				if(!returnValue) return;
				clearInterval(me.successTimer)
			}else{
				me.getElement('successBtn').innerHTML = me.lang.submitSuccessBtn + '('+startTime+')';
				startTime--;
			}
		},1000)

		baidu(me.getElement('successBtn')).on('click',function(evt){
			evt.preventDefault();
			clearInterval(me.successTimer);

			var returnValue = me.fireEvent('multiBindEnd', {
				rspData: rsp.data
			});
			if(!returnValue) return;
		})		
	},
	_submitData:function(){
		var me = this;			
		/**
		 * @description 表单提交前
		 * @name magic.passport.multiBind#beforeSubmit
		 * @event
		 * @grammar magic.passport.multiBind#beforeSubmit(e)
		 */
		var returnValue = me.fireEvent('beforeSubmit');
		if(!returnValue) return;

		var data = baidu.form.json(me.getElement('form'));
		if(me.needPassword){
			if(me.rsa){
				data.password = me.rsa.encrypt(data.password)
			}else{
				me.getElement('error').innerHTML = me.lang.sysError;
				return;
			}
		}

		data.action = 'send';
		data.timeSpan = new Date().getTime() - me.initTime;
		passport.data.multiBind(data)
			.success(function(rsp){
				me.currentPhone = rsp.data.phone;

				clearInterval(me.successTimer)

				if(rsp.errInfo.no == 0){
					/**
					 * @description 补填用户名成功
					 * @name magic.passport.multiBind#multiBindSuccess
					 * @event
					 * @grammar magic.passport.multiBind#multiBindSuccess(e)
	                 * @param {Object} e 事件参数
	                 * @param {Object} e.data 服务器返回信息
	                 * @param {Boolean} evt.returnValue 返回false时，组织跳转
					 */
					var returnValue = me.fireEvent('multiBindSuccess', {
						rsp: rsp
					});
					if(!returnValue) return;
					
					me.getElement('successUname').innerHTML = rsp.data.uname;
					me.getElement('successPhone').innerHTML = me.config.phone || me.currentPhone;
					me.$show('success').$hide('form').$hide('warning')
					
					me._multiSuccess(rsp);
				}else{
					/**
					 * @description 补填用户名失败
					 * @name magic.passport.multiBind#multiBindError
					 * @event
					 * @grammar magic.passport.multiBind#multiBindError(e)
	                 * @param {Object} e 事件参数
	                 * @param {Object} e.rsp 服务器返回信息
					 */
					var returnValue = me.fireEvent('multiBindError', {
						rsp: rsp
					});
					if(!returnValue) return;

					me.$show('form').$hide('warning').$hide('success')
					
					if(rsp.errInfo['field']){
						me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
					}else{
						me.setGeneralError(rsp.errInfo['msg']);
					}

					if(me.needPassword){
						me._getRSA()
					}
				}
			});
	},
	_eventHandler: (function(){
		var me,
		inputOriginalValue = '',
		style  ={
			focus: function(field, e){
				/**
				 * @description 表单域获得焦点
				 * @name magic.passport.reg#fieldFocus
				 * @event
				 * @grammar magic.passport.multiBind#fieldFocus(e)
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
				 * @grammar magic.passport.multiBind#fieldBlur(e)
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
				 * @grammar magic.passport.multiBind#fieldMouseover(e)
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
				 * @grammar magic.passport.multiBind#fieldMouseout(e)
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
				'userName': function(field, e){
					inputOriginalValue = me.getElement(field).value;
				}
			},
			blur: {
				'userName': function(field, e){
					me._checkUserName()
				},
				'password': function(field, e){
				}
			},
			submit: function(e){
				me.validateAll({
					success: function(){
                        me.getElement('submit').focus();

                        var showWarning = function(){
							var returnValue = me.fireEvent('warning');
							if(!returnValue) return;

							me.$show('warning').$hide('form');
							me.getElement('warningTitle').innerHTML = me._format(me.lang.warningTitle,{
								uname:me.getElement('userName').value,
								phone:me.config.phone||me.currentPhone
							})

							me._getRSA();                  
                        }
                        var checkData = function(){	
							var returnValue = me.fireEvent('checkSubmit');
							if(!returnValue) return;

							var data = baidu.form.json(me.getElement('form'));
							if(me.needPassword){
								if(me.rsa){
									data.password = me.rsa.encrypt(data.password)
								}else{
									me.getElement('error').innerHTML = me.lang.sysError;
									return;
								}
							}
							data.action = 'check'
							passport.data.multiBind(data)
								.success(function(rsp){
									if(rsp.errInfo.no == 0){
										me.currentPhone = rsp.data.phone;

										var returnValue = me.fireEvent('checkSuccess', {
											rsp: rsp
										});
										if(!returnValue) return;
										showWarning();
									}else{
										var returnValue = me.fireEvent('checkError', {
											rsp: rsp
										});
										if(!returnValue) return;
										
										if(rsp.errInfo['field']){
											me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
										}else{
											me.setGeneralError(rsp.errInfo['msg']);
										}

										if(me.needPassword){
											me._getRSA()
										}
									}
							});
                        }

                    	checkData();
					},
					error: function(){
					}
				},true);

				e.preventDefault();
			},
			change: {
				'userName': function(field, e){
					
				}
			},
			click: {
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
	})()
});
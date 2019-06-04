///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 补填用户名模块
 * @class
 * @name magic.passport.multiUnbind
 * @grammar new magic.passport.multiUnbind(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.multiUnbind} magic.passport.multiUnbind 实例
 * @superClass magic.passport
 */
magic.passport.multiUnbind = baidu.lang.createClass(function(options){
	var me = this;
	me.config = {
		staticPage: '',
		product: '',
		charset: '',
		token: '',
		lang: 'zh-CN',
		subpro: ''
	};
	baidu.extend(me.config, options);
	this.module = 'multiUnbind';
	me.constant = {
		CONTAINER_CLASS: 'tang-pass-fill',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error'
	};
	
	me.lang = passport.err.getCurrent().labelText.multiUnbind;

	// init data
	passport.data.setContext(baidu.extend({}, me.config));
},{
    type: "magic.passport.multiUnbind",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			intro: '<p id="'+me.$getId('intro')+'" class="pass-intro clearfix">'+
						'<span class="pass-intro-title">'+me.lang.introTitle+'</span>'+
						'<span class="pass-intro-info clearfix">'+
							'<em class="pass-intro-phone" id="'+me.$getId('introPhone')+'">'+me.config.phone+'</em>'+
							'<em class="pass-intro-uname" id="'+me.$getId('introUname')+'">'+me.config.uname+'</em>'+
						'</span>'+
					'</p>',
			generalError: '<p id="'+me.$getId('errorWrapper')+'" class="pass-form-item pass-generalErrorWrapper">'+
						        '<span id="'+me.$getId('error')+'" class="pass-generalError"></span>'+
						    '</p>',
			smsVcode: '<p id="'+me.$getId('smsVcodeWrapper')+'" class="pass-form-item pass-form-item-smsVcode">'+
                    '<label for="'+me.$getId('smsVcode')+'" id="'+me.$getId('smsVcodeLabel')+'" class="pass-label pass-label-smsVcode">'+me.lang.smsVcode+'</label>'+
                    '<input id="'+me.$getId('smsVcode')+'" type="text" name="smsVcode" class="pass-text-input pass-text-input-smsVcode" />'+
                    '<input id="'+me.$getId('smsVcodeSend')+'" type="button" class="pass-button pass-button-grey pass-button-smsvcodesend" value='+me.lang.smsVcodeSend+'>'+
                    '<span id="'+me.$getId('smsVcodeTip')+'" class="pass-item-tip pass-item-tip-smsVcode"><span class="pass-item-tiptext pass-item-tiptext-smsVcode" id="'+me.$getId('smsVcodeTipText')+'"></span></span>'+
                '</p>',
			submit: '<p id="'+me.$getId('submitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('submit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit" />'+
			    '</p>',
			success: '<div id="'+me.$getId('success')+'" class="pass-success" style="display:none">'+
			        '<h3 id="'+me.$getId('successTitle')+'" class="pass-success-title"></h3>'+
			        '<button id="'+me.$getId('successBtn')+'" class="pass-button pass-success-btn">'+me.lang.successBtn+'</button>'+
			    '</div>',
			failed: '<div id="'+me.$getId('failed')+'" class="pass-failed" style="display:none">'+
			        '<h3 id="'+me.$getId('failedTitle')+'" class="pass-failed-title"></h3>'+
			        '<p id="'+me.$getId('failedInfo')+'" class="pass-failed-info">'+me.lang.failedInfo+'</p>'+
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
			username: me.config.uname,
			subpro: me.config.subpro
		};
		
		templateStr += me._getHiddenField(hiddenFields);
		templateStr += me._getIrregularField('intro');
		templateStr += me._getIrregularField('generalError');
		templateStr += me._getIrregularField('smsVcode');
		templateStr += me._getIrregularField('submit');
		templateStr += '</form>';

		templateStr += me._getIrregularField('success');
		templateStr += me._getIrregularField('failed');
		
		return templateStr;
	},
	/**
	 * @description render 渲染组件到页面
	 * @function
	 * @name magic.passport.multiUnbind#render
	 * @grammar magic.passport.multiUnbind#render(id)
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
		target.get(0).appendChild(baidu(template).get(0));
		target.get(0).appendChild(baidu(template).get(1));
		target.get(0).appendChild(baidu(template).get(2));

		me._getPlaceholder([{
			label:"smsVcode",
			placeholder:"smsVcodePh"
		}])

		/**
		 * @description render 渲染组件到页面
		 * @event
		 * @name magic.passport.multiUnbind#render
		 * @grammar magic.passport.multiUnbind#render
		 */
        var returnValue = me.fireEvent('render');
		if(!returnValue) return;
        					
		me._setValidator();
		me._setEvent();
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
	changeUname: function(uname){
		var me = this;
		uname = uname || me.config.uname;

		me.config.uname = uname;

		me.getElement('introUname').innerHTML = uname;
		me.getElement('username').value = uname;

		me.$show('form').$hide('success').$hide('failed')
	},
	_setValidator: function(){
		var me = this;
		me.validateRules = {
			'smsVcode': {
				rules: ['required'],
				desc: me.lang.smsVcode
			}
		}
		me._validator.init(me, me.validateRules);
	},
	_validateError: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		ele.addClass(me.constant.ERROR_CLASS);
		me.$show('error')
		me.getElement('error').innerHTML = info.msg;
		opt && opt.callback && callback();
	},
	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));
		me.$hide('error')
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
	},
	_sendSmsvcode: function(){
		var me = this,
			flag = true,
			startTime = 60,
			ele = me.getElement('smsVcodeSend');

		if(me.sendSmsvcodeFlag){return}

		var _success = function(){
			me.getElement('smsVcodeTipText').innerHTML = me.lang.smsVcodeSucc;
			me.setGeneralError('')
		}
		var _failed = function(msg){
			flag = true;
			me.sendSmsvcodeFlag = false;
			ele.value = me.lang.smsVcodeResend;
			baidu(ele).removeClass('pass-button-disable');

			if(msg){
				me.setGeneralError(msg)
				me.$show('error');
			}
		}

		baidu(ele).addClass('pass-button-disable');
		ele.value = me.lang.smsVcodeSending;
		me.sendSmsvcodeFlag = true;
		clearInterval(me.timer);

		passport.data.authwidGetverify({
			authtoken:me.config.token,
			type:'mobile',
			jsonp:1,
			action:'send'
		}).success(function(rsp){
			if(!rsp.errInfo.no && rsp.errInfo.no!=0){
				rsp.errInfo = {
					no:rsp.data.errno == 110000?0:rsp.data.errno
				}
			}

			flag = false;
			if(rsp.errInfo.no == 0){
				_success()
				me.timer = setInterval(function(){
					if(startTime<1){
						me.sendSmsvcodeFlag = false;
						baidu(ele).removeClass('pass-button-disable');
						ele.value = me.lang.smsVcodeResend
					}else{
						ele.value = me.lang.smsVcodeResend+"("+(startTime--)+")";
					}			
				},1000)
			}else{
				_failed(rsp.data.msg || me.lang.smsVcodeSendErr);
			}
		})

		setTimeout(function(){
			if(flag){
				_failed(me.lang.smsVcodeSendErr);
			}
		},5000)
	},
	_multiSuccess:function(rsp){
		var me = this,
			startTime = 10,
			successTimer;

		var returnValue = me.fireEvent('multiUnbindBeforeend', {
			rsp: rsp
		});
		if(!returnValue) return;

		me.getElement('successTitle').innerHTML = me._format(me.lang.successTitle,{
			uname:me.config.uname
		})

		successTimer = setInterval(function(){
			if(startTime<1){
				var returnValue = me.fireEvent('multiUnbindEnd', {
					rsp: rsp
				});
				if(!returnValue) return;
				clearInterval(successTimer)
			}else{
				me.getElement('successBtn').innerHTML = me.lang.successBtn + '('+startTime+')';
				startTime--;
			}
		},1000)

		baidu(me.getElement('successBtn')).on('click',function(evt){
			evt.preventDefault();
			clearInterval(successTimer);

			var returnValue = me.fireEvent('multiUnbindEnd', {
				rsp: rsp
			});
			if(!returnValue) return;
		})		
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
				 * @grammar magic.passport.multiUnbind#fieldFocus(e)
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
				 * @grammar magic.passport.multiUnbind#fieldBlur(e)
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
				 * @grammar magic.passport.multiUnbind#fieldMouseover(e)
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
				 * @grammar magic.passport.multiUnbind#fieldMouseout(e)
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
			click: {
				'smsVcodeSend': function(field,e){
					me._sendSmsvcode();
				}
			},
			blur: {
				'smsVcode': function(field, e){
				}
			},
			submit: function(e){
				me.validateAll({
					success: function(){
                        me.getElement('submit').focus();
						/**
						 * @description 表单提交前
						 * @name magic.passport.multiUnbind#beforeSubmit
						 * @event
						 * @grammar magic.passport.multiUnbind#beforeSubmit(e)
						 */
						var returnValue = me.fireEvent('beforeSubmit');
						if(!returnValue) return;
						
						var data = baidu.form.json(me.getElement('form'));
						// 处理suggName
						if(data.userName != data.selectedSuggestName) data.selectedSuggestName = '';
                        data.timeSpan = new Date().getTime() - me.initTime;
						passport.data.multiUnbind(data)
							.success(function(rsp){
								if(rsp.errInfo.no == 0){
									/**
									 * @description 补填用户名成功
									 * @name magic.passport.multiUnbind#multiUnbindSuccess
									 * @event
									 * @grammar magic.passport.multiUnbind#multiUnbindSuccess(e)
					                 * @param {Object} e 事件参数
					                 * @param {Object} e.data 服务器返回信息
					                 * @param {Boolean} evt.returnValue 返回false时，组织跳转
									 */
									var returnValue = me.fireEvent('multiUnbindSuccess', {
										rsp: rsp
									});
									if(!returnValue) return;
									
									me.getElement('successTitle').innerHTML = rsp.data.uname+me.lang.successTitle;
									me.$hide('form').$show('success');
									me._multiSuccess(rsp)
								}else{
									/**
									 * @description 补填用户名失败
									 * @name magic.passport.multiUnbind#multiUnbindError
									 * @event
									 * @grammar magic.passport.multiUnbind#multiUnbindError(e)
					                 * @param {Object} e 事件参数
					                 * @param {Object} e.rsp 服务器返回信息
									 */
									var returnValue = me.fireEvent('multiUnbindError', {
										rsp: rsp
									});
									if(!returnValue) return;
									
									if(rsp.errInfo.no == 401005){
										me.$hide('form').$show('failed');
										me.getElement('failedTitle').innerHTML = me._format(me.lang.failedTitle,{
											uname:me.config.uname
										})
									}else{
										if(rsp.errInfo['field']){
											me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
										}else{
											me.setGeneralError(rsp.errInfo['msg']);
										}
										me.$show('error');
									}
								}
							});
					},
					error: function(){
					}
				},true);

				e.preventDefault();
			},
			change: {
				'userName': function(field, e){
					
				}
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
///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 验证身份证
 * @class
 * @name magic.passport.checkIDcard
 * @grammar new magic.passport.checkIDcard(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @param {Boolean} options.isPhone 是否使用手机登录
 * @param {Boolean} options.memberPass 是否提供记住登录状态选项
 * @return {magic.passport.checkIDcard} magic.passport.checkIDcard 实例
 * @superClass magic.passport
 */
magic.passport.checkIDcard = baidu.lang.createClass(function(options){
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
		hasPlaceholder:true,
		staticPage: '',//string,静态跳转文件
		u: '',
		token: '',
		lang: 'zh-CN',
		bdstoken:'',
		nowStep:1,   //当前的验证状态，1未认证：用户开通百度钱包后的初始状态，无姓名身份证号2已填写：用户只填写的姓名，且姓名是可以自行更改的3已验证：用户姓名及身份证号通过公安网校验正确无误4快捷认证成功：用户通过银行卡支付成功，且用户姓名及身份证号通过银行通道校验正确无误5身份证认证成功：用户通自行提交身份证正反面照片，并通百度钱包后台客服审核，确认身份证照片正确无误6快捷且身份证认证成功：用户既通过了快捷实名认证，又通过了身份证实名认证
		toStep:3,   //要达到的状态，同上
		frontOk:'',
		backOk:'',
		catchOk:'',
		reValidatePic:0
	};

	baidu.extend(me.config, options);

	this.module = 'checkIDcard';
	me.constant = {
		CHECKVERIFYCODE:true,
		CONTAINER_CLASS: 'tang-pass-checkIDcard',
		LABEL_FOCUS_CLASS: 'pass-text-label-focus',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error',
		VERIFYCODE_URL_PREFIX: me._domain.https+'/cgi-bin/genimage?'
	};

	me.lang = passport.err.getCurrent().labelText.checkIDcard;
	apiMargicInstance = me.config.apiMargicInstance || {} ;
	me.initialized = '';
	me.guideRandom = (function(){
    	return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
    		var r = Math.random() * 16 | 0;
    		var v = c === 'x' ? r : (r & 0x3|0x8);
    		return v.toString(16); 
    	}).toUpperCase();
    })()
},{
    type: "magic.passport.checkIDcard",
    superClass: magic.passport
}).extend({
	_getIrregularField: function(field){
		var me = this,
		template = {
			tip: '<p class="pass-checkIDcard-tip">'+me.lang.tip+'</p>',
			generalError: '<p id="'+me.$getId('checkIDcardErrorWrapper')+'" class="pass-generalErrorWrapper">'+
						  	 '<span id="'+me.$getId('checkIDcardError')+'" class="pass-generalError pass-generalError-error"></span>'+
						  '</p>',
			frontIdcardImg: '<div class="img-container" style="margin-top:20px;" id="'+me.$getId('frontIdcardImg')+'">'+
								'<div class="pre-info">个人信息面（格式：2M以下的jpg、png或bmp）</div>'+
									'<div class="'+ (me.config.nowStep<5 ? 'pic-contain' : 'pic-contain-uploaded-front') +'" id="pic-contain-frontIdcard">'+
										'<img '+(me.config.nowStep<5 ? '' : 'style="display:none"')+' id="contain-frontIdcard" class="img-style" name="contain-frontIdcard" src="front-idcard-1.png"/*tpa=http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/passApi/img/front-idcard.png*//></br>'+
										'<a class="upload-href" '+(me.config.nowStep<5 ? '' : 'style="display:none"')+'>'+
											'<input id="'+me.$getId('frontIdcard')+'" data-role="frontIdcard" name="frontIdcard"  value="点此上传" class="upload-bt" type="file"/><span class="span-class">' + (me.config.nowStep<5 ? '点此上传' : '已上传') + //' 点此上传'+
										'</span></a>'+
									'</div>'+
									'<img style="float:left" src="'+me._domain.auto+'/passApi/img/front-example.png">'+
								'</div>',
			backIdcardImg: '<div class="img-container" id="'+me.$getId('backIdcardImg')+'">'+
								'<div class="pre-info" >国徽面（格式：2M以下的jpg、png或bmp）</div>'+
								'<div class="'+ (me.config.nowStep<5 ? 'pic-contain' : 'pic-contain-uploaded-back') +'" id="pic-contain-backIdcard">'+
									'<img '+(me.config.nowStep<5 ? '' : 'style="display:none"')+' id="contain-backIdcard" class="img-style" name="contain-backIdcard" src="back-idcard-1.png"/*tpa=http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/passApi/img/back-idcard.png*//></br>'+
									'<a class="upload-href" '+(me.config.nowStep<5 ? '' : 'style="display:none"')+'>'+
										'<input id="'+me.$getId('backIdcard')+'" data-role="backIdcard" name="backIdcard"  value="点此上传" class="upload-bt" type="file"/><span class="span-class">' + (me.config.nowStep<5 ? '点此上传' : '已上传') +//点此上传'+
									'</span></a>'+
								'</div>'+
								'<img style="float:left" src="'+me._domain.auto+'/passApi/img/back-example.png">'+		
							'</div>',
			catchIdcardImg: '<div class="img-container" id="'+me.$getId('catchIdcardImg')+'">'+
								'<div class="pre-info">手持身份证（格式：2M以下的jpg、png或bmp）</div>'+
								'<div class="pic-contain" id="pic-contain-catchIdcard">'+
									'<img id="contain-catchIdcard" class="img-style" name="contain-catchIdcard-back" src="catch-idcard-1.png"/*tpa=http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/passApi/img/catch-idcard.png*//></br>'+
									'<a class="upload-href">'+
										'<input id="'+me.$getId('catchIdcard')+'" data-role="catchIdcard" name="catchIdcard"  value="点此上传" class="upload-bt" type="file"/><span class="span-class">点此上传</span>'+
									'</a>'+
								'</div>'+
								'<img style="float:left" src="'+me._domain.auto+'/passApi/img/catch-example.png">'+
							'</div>',
			submit: '<p id="'+me.$getId('checkIDcardSubmitWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('checkIDcardSubmit')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit pass-button-disabled" />'+
			    '</p>',
			submitNext: '<p id="'+me.$getId('checkIDcardSubmitNextWrapper')+'" class="pass-form-item pass-form-item-submit">'+
			        '<input id="'+me.$getId('checkIDcardSubmitNext')+'" type="submit" value="下一步" class="pass-button pass-button-submit pass-button-disabled" />'+
			    '</p>',
			submitAll: '<p id="'+me.$getId('checkIDcardSubmitAllWrapper')+'" class="pass-form-item pass-form-item-submit">'+
				        '<input id="'+me.$getId('checkIDcardSubmitAll')+'" type="submit" value="'+me.lang.submit+'" class="pass-button pass-button-submit pass-button-disabled" />'+
				    '</p>',
			submitResult:'<div id="'+me.$getId('submitResult')+'" style="display:none">'+
						'<div class="" style="text-align:center;">'+
							'<img class="" src="idcard-result-1.png"/*tpa=http://passport.baidu.com/passApi/js/modules/'+me._domain.auto+'/passApi/img/idcard-result.png*//></br>'+
							'<p class="pre-info">身份证照片审核通过后可在帐号中心查看</p>'+
							'<p class="pre-info"><span id="countText">5</span>s后自动关闭...</p>'+
						'</div>'+
					'</div>',
			iframe:'<iframe class="ajaxupload-iframe"  name="ajaxUploadIframe" id="upload-iframe-to" style="display:none"></iframe>',//src="'+me._domain.auto+'/passApi/html/api_idcardverify.html//javascript:void((function(){document.open();document.domain=\'' + document.domain + '\';document.close()})())
			layerContent: '<div class="layer-content" id="tip-pop"></div>'
		}
		return template[field];
	},

	_getTemplate: function(action,opt){
		var me = this,
			templateStr = '<form id="'+me.$getId('form')+'" target="ajaxUploadIframe" action="'+me._domain.auto+'/v3/finance/main/upcert" class="pass-form pass-form-checkIDcard" method="POST" enctype="multipart/form-data" autocomplete="off">',
			hiddenFields = {
				u: me.config.u,
				tpl: me.config.product,
				subpro: me.config.subpro ? me.config.subpro:'',
				staticpage: me.config.staticPage,
				bdstoken:me.config.bdstoken,
				nowStep:me.config.nowStep,
				toStep:me.config.toStep
			},
			IDcardRegularField = [{
				field: 'realname',
				label: me.lang.realname,
                noError: true
			},{
				field: 'idcard',
				label: me.lang.idcard,
                noError: true
			}];
		templateStr += me._getIrregularField('tip');
		templateStr += me._getIrregularField('generalError');
		templateStr += me._getHiddenField(hiddenFields);
		if(me.config.nowStep>=3&&me.config.reValidatePic==1){//增加api内照片上传的同步校验
			if(me.config.frontOk==undefined||me.config.backOk==undefined||me.config.frontOk==false||me.config.backOk==false){
				me.config.nowStep=3;
			}else if(me.config.frontOk==true&&me.config.backOk==true&&me.config.catchOk==false){
				me.config.nowStep=5;
			}else if(me.config.frontOk==true&&me.config.backOk==true&&me.config.catchOk==true){
				me.config.nowStep=7;
			}
		}
		if(me.config.nowStep==1||me.config.nowStep==2){
			templateStr += '<div id="'+me.$getId('firstStepInfo')+'">';
			for(var i = 0 ; i < IDcardRegularField.length; i++){
				templateStr += me._getRegularField(IDcardRegularField[i]);
			}
			if(me.config.toStep<5){
				templateStr+=me._getIrregularField('submit');
			}else{
				templateStr+=me._getIrregularField('submitNext');
			}
			templateStr += '</div>';
			if(me.config.toStep==5||me.config.toStep==6){
				templateStr+='<div id="'+me.$getId('allImgInfo')+'" style="display:none">';
				templateStr+=me._getIrregularField('frontIdcardImg');
				templateStr+=me._getIrregularField('backIdcardImg');
				templateStr += me._getIrregularField('submitAll');
				templateStr+='</div>';
				
			}else if(me.config.toStep==7||me.config.toStep==8){
				templateStr+='<div id="'+me.$getId('allImgInfo')+'" style="display:none">';
				templateStr+=me._getIrregularField('frontIdcardImg');
				templateStr+=me._getIrregularField('backIdcardImg');
				templateStr+=me._getIrregularField('catchIdcardImg');
				templateStr += me._getIrregularField('submitAll');
				templateStr+='</div>';
				
			}
			
		}else if(me.config.nowStep==3||me.config.nowStep==4){
			if(me.config.toStep==5||me.config.toStep==6){
				templateStr+='<div id="'+me.$getId('allImgInfo')+'" style="display:block">';
				templateStr+=me._getIrregularField('frontIdcardImg');
				templateStr+=me._getIrregularField('backIdcardImg');
				templateStr += me._getIrregularField('submitAll');
				templateStr+='</div>';
			}else if(me.config.toStep==7||me.config.toStep==8){
				templateStr+='<div id="'+me.$getId('allImgInfo')+'" style="display:block">';
				templateStr+=me._getIrregularField('frontIdcardImg');
				templateStr+=me._getIrregularField('backIdcardImg');
				templateStr+=me._getIrregularField('catchIdcardImg');
				templateStr += me._getIrregularField('submitAll');
				templateStr+='</div>';
			}
		}else if(me.config.nowStep==5||me.config.nowStep==6){
			templateStr+='<div id="'+me.$getId('allImgInfo')+'" style="display:block">';
				templateStr+=me._getIrregularField('frontIdcardImg');
				templateStr+=me._getIrregularField('backIdcardImg');
				templateStr+=me._getIrregularField('catchIdcardImg');
				templateStr += me._getIrregularField('submitAll');
				templateStr+='</div>';
		}
		templateStr+=me._getIrregularField('submitResult');
		templateStr +=me._getIrregularField('iframe');
		templateStr += '</form>';
		templateStr += me._getIrregularField('layerContent');
		return templateStr;

	},

	_setValidator: function(){
		var me = this;
			me.validatorInited = true;
			if(me.config.nowStep<3){
				me.validateRules = {
					'realname': {
						rules: ['required'],
						desc: me.lang.realname
					},
					'idcard': {
						rules: ['required','idcard'],
						desc: me.lang.idcard
					}
				}
			}else{
				if(me.config.nowStep<5){
					me.validateRules = {
						'frontIdcard': {
							rules: ['required'],
							desc: me.lang.frontIdcard
						},
						'backIdcard': {
							rules: ['required'],
							desc: me.lang.backIdcard
						},
						'catchIdcard': {
							rules: ['required'],
							desc: me.lang.catchIdcard
						}
					}
				}else{
					me.validateRules = {
						'catchIdcard': {
							rules: ['required'],
							desc: me.lang.catchIdcard
						}
					}
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
		this.getElement('checkIDcardError').innerHTML = info.msg;

		opt && opt.callback && callback();
	},

	_validateSuccess: function(info, opt){
		var me = this,
			ele = baidu(me.getElement(info.field));

		this.getElement('checkIDcardError').innerHTML = '';
		ele.removeClass(me.constant.ERROR_CLASS);
		opt && opt.callback && callback();
	},

	render: function(id,callback){
		var me = this;

        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var checkData={
        	bdstoken:me.config.bdstoken,
        	tpl:me.config.product
        }
        passport.data.checkIDcardState(checkData).success(function(res){//增加api内照片上传的同步校验
        	if(res.errno==0){
        		me.config.reValidatePic=1;
    			me.config.frontOk=res.result.frontPic;
    			me.config.backOk=res.result.backPic;
    			me.config.catchOk=res.result.handPic;
    		}
        });
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);

		var template = me._getTemplate();
		target.get(0).appendChild(baidu(template).get(0));
		var rendList =[];
		if(me.config.nowStep<3){
			rendList = [{
	        	label:'realname',
	        	placeholder:"inrealname"
	        },{
				label:'idcard',
	        	placeholder:"inidcard"
	        }];
			me._getPlaceholder(rendList)
		}
        me._setValidator();
		me._setEvent();
		me.closeEvent();
	},

	_setEvent: function(){
		var me=this;
		var fn = function(e){
			me._eventHandler.entrance.apply(me, [e]);
		};
		baidu('.pass-text-input', me.getElement()).on({
			'focus': fn,
			'blur': fn,
			'change': fn,
			'keyup': fn,
			'mouseover': fn,
			'mouseout': fn
		});
		baidu(me.getElement('form')).on('submit', fn);
		//baidu('.upload-bt',me.getElement()).on('change',fn);
		baidu('.img-style',me.getElement()).on('click',fn);
		baidu('.upload-bt').on('change',function(evt){
			var e=evt.target.attributes['data-role'].value;
			me.uploadImg(e);
		})
		
	},
	renderResult: function(result,sta){
		var me=this;
        if(result.errno == '0'||result.errno==9||result.errno==23){
        	if(me.config.nowStep<5){
            	if(me.config.toStep>6){
            		me.config.nowStep=6;
					me.getElement('form').action=me._domain.auto+'/v3/finance/main/handupcert';
					me.getElement('form').submit();
					me.checkCallBack();
            	}else{
            		if(result.errno==9||result.errno==23){
            			me._validateError({msg:result.errmsg});
            		}else{
            			me._validateSuccess({msg:result.errmsg});
	            		me.getElement('allImgInfo').style.display='none';
	            		me.getElement('submitResult').style.display='block';
	            		var interval;
	            		var count=0;
	            		interval=setInterval(function(){
	            			if(count<5){
	            				document.getElementById('countText').innerHTML=count++;
	            			}else{
	            				clearInterval(interval);
	            				var returnValue = me.fireEvent('submitSuccess');
			       	 			if(!returnValue) return;
			       	 			me._ownerDialog&&me._ownerDialog.hide('unHide');
	            			}
	            		},1000);
            		}
            	}
            }else{
            	if(result.errno==9||result.errno==23){
            		me._validateError({msg:result.errmsg});
            	}else{
            		me.getElement('allImgInfo').style.display='none';
	            	me.getElement('submitResult').style.display='block';
	            	me._validateSuccess({msg:result.errmsg});
	            	var interval;
	        		var count=5;
	        		interval=setInterval(function(){
	        			if(count>0){
	        				document.getElementById('countText').innerHTML=--count;
	        			}else{
	        				clearInterval(interval);
	        				var returnValue = me.fireEvent('submitSuccess');
		       	 			if(!returnValue) return;
		       	 			me._ownerDialog&&me._ownerDialog.hide('unHide');
	        			}
	        		},1000);
            	}
            }
        }else{
            me._validateError({msg:result.errmsg});
        }
    },

    GetQueryString:function(searchPara,name) { 
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"); 
		var r = searchPara.substr(1).match(reg); 
		if (r!=null) return (r[2]); return null; 
	},
    checkCallBack: function(){
    	var me=this;
    	var times = 0;
    	var interval,result;
    	interval=setInterval(function(){
    		if(times<10){//times<90
                var xml={};
                var rtresult=window.frames.ajaxUploadIframe.frameElement.contentWindow.document.location.search;
                var errno,errmsg;
                if(rtresult!=undefined){
	                errno=me.GetQueryString(rtresult,'err_no');
	                errmsg=decodeURI(me.GetQueryString(rtresult,'err_msg'));
	                xml.errno=errno;
	                xml.errmsg=errmsg;

                }
                result=xml;
                if(result.errno!=undefined){
                    clearInterval(interval);
                    return me.renderResult(result,me);
                }
                times++;
            }else{
            	result={};
                clearInterval(interval)
                result.msg = '上传超时，请稍后再试！';
                result.errno = '110000';
                return me.renderResult(result,me);
            }
    	},1000);
    },

	getFileInfo: function(event){		
		var filesData = {};
        if(event.files && event.files[0]){
            filesData.type = event.files[0].type;
            filesData.name = event.files[0].name;
            filesData.size = event.files[0].size;
        }else if(event && event.value){
            filesData.type = 'image/' + event.value.substr(event.value.lastIndexOf('.')+1);
            filesData.name = event.value.substr(event.value.lastIndexOf('\\')+1);
            filesData.size;
        }
        return filesData;
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

    setPwdAction: function(options) {
        var me = this;
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
            setPwd.show();
        }
    },

    loginSuccess: function(options) {
    	var me = this;
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

    disabledSubmit: function() {
    	var me = this;
    	if(me.getElement('realname').value && me.getElement('idcard').value) {
    		if(baidu(me.getElement('checkIDcardSubmit')).hasClass('pass-button-disabled')) {
    			baidu(me.getElement('checkIDcardSubmit')).removeClass('pass-button-disabled');
    		}
    	} else {
    		if(!baidu(me.getElement('checkIDcardSubmit')).hasClass('pass-button-disabled')) {
    			baidu(me.getElement('checkIDcardSubmit')).addClass('pass-button-disabled');
    		}
    	}
    },
    
    uploadImg: function(evt){
    	var me=this;
    	var ele=baidu(evt.target);
		var picDom=ele.attr('data-role');
		var pic=baidu('#contain-'+evt);
		var file=me.getElement(evt);
		var container=document.getElementById('pic-contain-'+evt);
		var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();
		// gif在IE浏览器暂时无法显示
	     if(ext!=''&&ext!='png'&&ext!='jpg'&&ext!='jpeg'){
	     	 me._validateError({msg:'图片的格式必须为png或者jpg或者jpeg格式！'})
	         //alert("图片的格式必须为png或者jpg或者jpeg格式！"); 
	         return;
	     }
	     var isIE = navigator.userAgent.match(/MSIE/)!= null,
	         isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;
		if(isIE) {
	        file.select();
	        var reallocalpath = document.selection.createRange().text;
		     	pic.css('opacity',0);//alert(reallocalpath);
		     	container.style.background="url('"+reallocalpath+"')";
		     	container.style.backgroundSize="170px 108px";
	        // IE6浏览器设置img的src为本地路径可以直接显示图片
	         if (isIE6) {
	         	//pic.attr('src',reallocalpath);
	         }else {
	            // 非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现
	            if(picDom==undefined){
	            	picDom=evt;
	            }
	            var pic=document.getElementById('contain-'+picDom);
	            pic.style.opacity='0';
	            pic=container;
	            pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
	             // 设置img的src为base64编码的透明图片 取消显示浏览器默认图片
	            pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
	            var picContain=baidu('pic-contain-'+picDom);
	            picContain.css('background','url("'+reallocalpath+'") no-repeat 50% 50%');
	         }
	     }else {
	        var file = file.files[0];
		     var reader = new FileReader();
		     reader.readAsDataURL(file);
		     reader.onload = function(e){
		     	pic.css('opacity',0);
		     	container.style.background="url('"+this.result+"')";
		     	container.style.backgroundSize="170px 108px";
		     }
	     }


    },

	_eventHandler: (function(){
		var me=this,
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

	       	},
	       	change: function(field,e){

			}
		},
		behaviour = {
			focus: {
			},
			blur: {
			
			},
			change: {
				'upcert[]':function(e){
					me.uploadImg(e);
				}/*,
				'backIdcard':function(e){
					me.uploadImg(e);
				},
				'catchIdcard':function(e){
					me.uploadImg(e);
				}*/
			},
			click: {
				'contain-frontIdcard':function(e){
					var type=e.substring(8,e.length);
					me.getElement(type).click();
				},
				'contain-backIdcard':function(e){
					var type=e.substring(8,e.length);
					me.getElement(type).click();
				},
				'contain-catchIdcard':function(e){
					var type=e.substring(8,e.length);
					me.getElement(type).click();
				}
			},
			keyup: {
				'realname' : function() {
					me.disabledSubmit();
				},
				'idcard' : function() {
					me.disabledSubmit();
				}
			},
			submit: function(e){
				e.preventDefault();
				me.validateAll({
					success: function(){
						if(me.config.toStep<=4){
							me.getElement('checkIDcardSubmit').focus();
						}else if(me.config.nowStep<3){
							me.getElement('checkIDcardSubmitNext').focus();
						}else{
							me.getElement('checkIDcardSubmitAll').focus();
						}
						/**
						 * @description 表单提交前
						 * @name magic.passport.login#beforeSubmit
						 * @event
						 * @grammar magic.passport.login#beforeSubmit
						 */
						var returnValue = me.fireEvent('beforeSubmit');
			       	 	if(!returnValue) return;
			       	 	var isIE = navigator.userAgent.match(/MSIE/)!= null;
			       	 	if(isIE){
			       	 		var iframe=baidu('#upload-iframe-to');//window.frames['ajaxUploadIframe'];
			       	 		//iframe.src=document.domain;
			       	 		iframe.attr("src","javascript:void((function(){document.open();document.domain='"+ document.domain + "';document.close()})())");
			       	 	}
						var data = baidu.form.json(me.getElement('form'));
						if(me.config.nowStep<3){
							data.name=me.getElement('realname').value;
							data.idnum=me.getElement('idcard').value;
							data.realname='';
							data.idcard='';							
							passport.data.checkIDcard(data).success(function(rsp){
	                        	if(rsp.data.errno == '0'){//rsp.errInfo.no == '0'
	                        		if(me.config.toStep>4){
	                        			me.config.nowStep=3;
	                        			me.getElement('firstStepInfo').style.display='none';
	                        			me.getElement('allImgInfo').style.display='block';
	                        		}else{
	                        			me.config.nowStep=3;
	                        			var successLayer='<div class="success-layer" id="success-layer">验证成功</div>';
		                        		document.body.innerHTML+=successLayer;
		                        		setTimeout(function(){
		                        			document.getElementById('success-layer').style.display='none';
		                        		},2000);
		                    			var returnValue = me.fireEvent('submitSuccess');
					       	 			if(!returnValue) return;

					       	 			me._ownerDialog&&me._ownerDialog.hide('unHide');
					       	 			/*returnValue = apiMargicInstance.fire("loginSuccess", {
					                        rsp: rsp
					                    });
									    if (!returnValue)
									        return;
					       	 			me.loginSuccess(rsp);*/
	                        		}
	                        		
				       	 		}else if(rsp.data.errno == '20') {
				       	 			me._ownerDialog&&me._ownerDialog.hide('unHide')
				       	 			me.setPwdAction(rsp);
	                        	}else if(rsp.data.errno==1){
	                        		me._validateError({msg:rsp.data.errmsg})
	                        	}else if(rsp.data.errno==2){
	                                me._validateError({msg:'认证失败'});
	                            }else if(rsp.data.errno==3){
	                                me._validateError({msg:'请登陆后进行认证'});
	                            }else if(rsp.data.errno==4){
	                                me._validateError({msg:'该身份证已经用于超过5个帐户的实名认证，请更换其他身份证认证'});
	                            }else if(rsp.data.errno==5){
	                                me._validateError({msg:'今日认证次数已超限请24小时后再次认证'});
	                            }else if(rsp.data.errno==6){
	                                me._validateError({msg:'您的身份证号不存在'});
	                            }else if(rsp.data.errno==7){
	                                me._validateError({msg:'您的身份证号与姓名不符'});
	                            }else if(rsp.data.errno==-1||rsp.data.errno==-2||rsp.data.errno==-3){
	                                me._validateError({msg:rsp.data.errmsg});
	                            }else if(rsp.data.errno==9){
	                            	me._validateError({msg:'您已认证过了'});
	                            }else if(rsp.data.errno==-5){
	                            	me._validateError({msg:'参数错误'});
	                            }else if(rsp.data.errno==-7){
	                            	me._validateError({msg:'token错误'});
	                            }else{
	                        		var tipcontent='<div class="layer-content" id="tip-pop"><div class="tip-container">'
										            +'<div class="tip-header"><span class="tipx" onclick="document.getElementById(\'tip-pop\').style.display=\'none\'">x</span></div>'
										            +'<div style="clear:both"></div>'
										            +'<div class="tip-text">'
										                +'<div class="tip-text-detail">'
										                +'由于认证系统测试，暂时无法进行认证，请稍候重试'
										                +'</div>'
										            +'</div>'
										            +'<div class="tip-confirm"><input value="确定" class="tip-button" type="button" onclick="document.getElementById(\'tip-pop\').style.display=\'none\'"/></div>'
										        +'</div></div>';
										        document.body.innerHTML+=tipcontent;
	                        		//tiptarget.innerHTML=tipcontent;
	                        		var tiptarget=document.getElementById('tip-pop');
	                        		tiptarget.style.display='block';
	                        	}
	                        })
						}else if(me.config.toStep==5||me.config.toStep==6){
							me.getElement('form').action=me._domain.auto+'/v3/finance/main/upcert';
							me.getElement('form').submit();
							me.checkCallBack();
							/*passport.data.checkIDcardSecondStep(data).success(function(rsp){
								if(rsp.data.errno == '0'){
									me.getElement('allImgInfo').style.display='none';
									me.getElement('submitResult').style.display='block';
								}else{
									alert('error');
								}
							})*/
						}else if(me.config.toStep==7||me.config.toStep==8){
							if(me.config.nowStep<5){
								me.getElement('form').action=me._domain.auto+'/v3/finance/main/upcert';
								me.getElement('form').submit();
								me.checkCallBack();
								/*passport.data.checkIDcardSecondStep(data).success(function(rsp){
									if(rsp.data.errno == '0'){
										passport.data.checkIDcardAllStep(data).success(function(rsp){
											if(rsp.data.errno == '0'){
												me.getElement('allImgInfo').style.display='none';
												me.getElement('submitResult').style.display='block';
											}else{
												alert('error');
											}
										})
									}else{
										alert('error');
									}
								})*/
							}else{
								me.getElement('form').action=me._domain.auto+'/v3/finance/main/handupcert';
								me.getElement('form').submit();
								me.checkCallBack();
								/*passport.data.checkIDcardAllStep(data).success(function(rsp){
									if(rsp.data.errno == '0'){
										me.getElement('allImgInfo').style.display='none';
										me.getElement('submitResult').style.display='block';
									}else{
										alert('error');
									}
								})*/
							}
						}
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

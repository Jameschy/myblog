///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 补填用户名模块
 * @class
 * @name magic.passport.changeUser
 * @grammar new magic.passport.changeUser(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.changeUser} magic.passport.changeUser 实例
 * @superClass magic.passport
 */
var magic = magic || window.magic || {};
	magic.passport = magic.passport || {};

magic.passport.changeUser = (function(){
	var _loadedCssFiles = {},
		_domain = (window.location ? 
                    ((window.location.protocol.toLowerCase()=="http:")?"http://passport.baidu.com/":"https://passport.baidu.com") : 
                    ((document.location.protocol.toLowerCase()=="http:")?"http://passport.baidu.com/":"https://passport.baidu.com"));

	var changeUser = function(options){
		var me = this;

		me._target = document.getElementById(options.id);
		if(!me._target){return}

		me.config = {
			product: 'pp',
			token: '',
			id:'',
			subpro:'',
			panelList:[
				{
					text:'个人资料',
					list:[
						{
							text:'个人主页',
							href:'http://www.baidu.com/p/xiongwilee'
						},{
							text:'修改资料',
							href:'http://passport.baidu.com/'
						}
					]
				},{
					text:'帐号切换',
					href:''
				},{
					text:'退出',
					href:'http://passport.baidu.com/v2/?logout?u=http://www.baidu.com'
				}
			]
		};
		if(!options.panelList){
			options.panelList = eval(baidu(me._target).attr('data-panellist'));
		}
		me.config = baidu.extend(me.config,options);
		me._ids = baidu.id()+'__';
		this.lang = passport.err.getCurrent().labelText.changeUser;
	}
	changeUser.prototype = {
		getElement:function(field){
			return document.getElementById(this.getId(field));
		},
		getId:function(field){
			return this._ids+field;
		},
		_getTemplate:function(){
			var me = this,
				templateStr = '<div id="'+me.getId('pass_userpanel')+'" class="tang-pass-changeUser pass-userpanel-wrapper" style="display:none;"><ul class="pass-userpanel clearfix">';

			for(var i=0;i<me.config.panelList.length;i++){
				var panel = me.config.panelList[i];

				if((typeof panel.list).toLowerCase() == 'object'){
					templateStr += 
						'<li class="pass-list pass-list-'+(i+1)+' pass-list-needselect">'+
							'<a href="'+panel.href+'" class="pass-item" target="_blank">'+panel.text+'<span class="arr-right"></span>'+'</a>'+
							'<ul class="pass-userpanel-sub pass-userpanel-sub-'+(i+1)+'" style="display:none;">'
					for(var j=0;j<panel.list.length;j++){
						templateStr += '<li class="pass-sublist pass-sublist-'+(j+1)+'"><a href="'+panel.list[j].href+'" class="pass-item"'+(panel.list[j].isSelfOpen == 1 ? '' : ' target="_blank"')+'>'+panel.list[j].text+'</a></li>';
					}
					templateStr += '</ul></li>'
				}else if(panel.href == ''){
					templateStr += 
						'<li class="pass-list pass-list-'+(i+1)+' pass-list-needselect pass-list-needselect-changeuser" id="'+me.getId("changeUser")+'">'+
							'<a href="'+panel.href+'" class="pass-item">'+panel.text+'<span class="arr-right"></span>'+'</a>'+							
							'<ul class="pass-userpanel-sub pass-userpanel-sub-'+(i+1)+'" style="display:none;" id="'+me.getId("changeUser_ul")+'">' +
							'</ul>'+
						'</li>';		
				}else if((typeof panel.href).toLowerCase() == 'string'){
					templateStr += 
						'<li class="pass-list pass-list-'+(i+1)+'"><a href="'+panel.href+'" class="pass-item"'+(panel.isSelfOpen == 1 ? '' : ' target="_blank"')+'>'+panel.text+'</a></li>'
				}
			}

			templateStr += '</ul></div>'

			return templateStr;

		},
		show:function(){
			this.isShow = true;
			this.getElement('pass_userpanel').style.display = 'block'			
		},
		hide:function(){
			this.isShow = false;
			this.getElement('pass_userpanel').style.display = 'none'
		},
		loadCssFile:function(url){
	        if(!_loadedCssFiles[url]) {
	            _loadedCssFiles[url] = true;
	            var l = document.createElement("link");
	            l.rel = "stylesheet";
	            l.type = "text/css";
	            l.href = url;
	            document.getElementsByTagName("head")[0].appendChild(l);
	        }
	        return true;
		},
		loginCrossToHao123:function(hao123Param){
			return passport.data.request.load(document.location.protocol + "//user.hao123.com/static/crossdomain.php?bdu=" + encodeURIComponent(hao123Param) + "&t=" + new Date().getTime());
		},
		_rendUser:function(){
			var me = this;
			var target = me.getElement('changeUser'),
				targetUl = me.getElement('changeUser_ul');

			var cutUsername = function(username){
				if(username.length>6){
					return username.substr(0,3)+'..'+username.substr(username.length-2,2)
				}else{
					return username
				}
			}

			passport.data.multiGetaccounts({
				tpl:me.config.product,
				subpro:me.config.subpro
			}).success(function(rsp){
				if(rsp.errInfo.no == '0'){
					me.multibindToken = rsp.data.multibindToken;
					me.switchToken = rsp.data.switchToken;
					me.currentUser = rsp.data.currentAcc;
					me.selectUsers = rsp.data.assoiateAcc;
					me.currentPhone = rsp.data.phone;
					var templateStr = '';
					if(me.selectUsers.length>0){
						for(var i = 0;i<me.selectUsers.length;i++){
							templateStr += '<li class="pass-list"><a class="pass-item pass-item-user" data-user="'+me.selectUsers[i]+'" title="'+me.selectUsers[i]+'">'+cutUsername(me.selectUsers[i])+'</a></li>';
						}
					}
					templateStr += '<li class="pass-list pass-list-add"><a class="pass-item pass-item-add">'+me.lang.add+'</a></li>';
					targetUl.innerHTML = templateStr;
				}else{
					me.getElement('changeUser').innerHTML = ''
					me.getElement('changeUser').style.display = 'none'
					me.getElement('changeUser').style.height = '0px'
				}
			})
		},
		_setEvent:function(){
			var me = this,
				$target = baidu(me._target),
				$selects = baidu('#'+me.getId('pass_userpanel')+' li'),
				$changeUser = baidu(me.getElement('changeUser_ul'));
			$target.on('mouseover',function(evt){
				me.show();
			})
			$target.on('mouseout',function(evt){
				evt.stopPropagation();
				me.hide();
			})
			$selects.on('mouseover',function(evt){
				var $subList = baidu('.pass-userpanel-sub',this);
				if($subList.length>0){
					$subList[0].style.display = 'block';
				}
			})
			$selects.on('mouseout',function(evt){
				var $subList = baidu('.pass-userpanel-sub',this);
				if($subList.length>0){
					$subList[0].style.display = 'none';					
				}
			})
			$changeUser.on('click',function(evt){
				evt.preventDefault()
				var target = evt.target,
					user = baidu(target).attr('data-user');
				
				if(!user && me.multibindToken){
					me.addMultiUser();
				}else if(user){
					me.changeToUser(user)
				}
			})
		},
		addMultiUser:function(){
			var me = this;
				addFun = function(){
					var diaMultiBind = passport.pop.init({
						type:'multiBind',
						tangram:true,
						apiOpt:{
							token:me.multibindToken,
							product:me.config.product,
							phone:me.currentPhone,
							subpro:me.config.subpro
						},
						onMultiBindEnd:function(api,data){
							me.changeToUser(data.rspData.uname)
						}
					})
					diaMultiBind.show();
			}
			if(passport.pop.init){
				addFun()
			}else{
				passport._use('uni_wrapper','uni_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_wrapper.js*/,function(){
					addFun()
				})
			}
		},
    	verifyAction:function(options){
	        var me = this,
	        	warnHtml,warnMsg,
		        _bizMods = {
		            "uni_forceverify" : "uni_forceverify.js"/*tpa=http://passport.baidu.com/passApi/js/uni_forceverify.js*/
		        },
		        verifyModName = "uni_forceverify";

	        var getWarnHTML = function(msg){
	            var msg = msg || '系统检测到您的帐号('+options.username+')疑似被盗，存在安全风险。请尽快修改密码。';
	            return '<div class="passport-forceverify-risk">'+
	                        '<p class="passport-forceverify-risk-msg">'+msg+'</p>'+
	                        '<div  class="passport-forceverify-risk-con clearfix">'+
	                            '<a class="passport-forceverify-risk-btn" href="http://passport.baidu.com/v2/account/password" target="_blank" >立即修改</a>'+
	                            '<a class="passport-forceverify-risk-next" id="passport_forceverify_risk_next" href="###">下次提醒</a>'+
	                        '</div>'+
	                    '</div>'
	        }
	        
	        if(options.secstate){
	            if(options.secstate == 'risk'){
	                //被盗
	                warnHtml = getWarnHTML('您的帐号('+options.username+')疑似被盗，存在严重的安全风险，请您尽快修改密码。<br/>* 在您成功修改密码前，您每次登录都需要进行安全验证')
	                warnMsg = '系统监测到您的帐号('+options.username+')疑似被盗，为确保本人操作，请先进行安全验证。如果以下密保工具不是您本人绑定，或已经被盗号者更改，请直接进入<a href="#" id="passport_forceverify_risk_appeal" target="_blank">帐号申诉</a>'
	            }else if(options.secstate == 'cheat'){
	                //马甲
	                warnMsg = '由于您的帐号('+options.username+')存在安全风险，为了确保您的帐号安全，请先进行安全验证，验证成功后您可以正常使用该帐号。'
	            }else{
	            	//长时间未登录帐号
	                warnMsg = '由于您的帐号('+options.username+')存在安全风险，为了确保您的帐号安全，请先进行安全验证，验证成功后您可以正常使用该帐号。'
	            }        
	        }


	        var verifyOpt = {
	            '400031':{
	                title:"登录保护",
	                msg:"您的帐号("+options.username+")已开启登录保护服务，登录前请先进行安全验证。"
	            },
	            '5':{
	                title:"登录安全验证",
	                msg:"您所处的网络环境存在安全风险，为保证帐号("+options.username+")安全，请先进行安全验证",
	                onSuccess:function(self,data){
	                    var gotoUrl = options.gotourl + "&authsid=" + data.authsid;
	                    
	                    passport.data.jsonp(gotoUrl).success(function(result){
	                        if(result.errInfo.no == 0 || result.data.errno == 0){
	                            self.hide();
	                            args.isCompleted = false;
	                            alert('验证成功请重新切换帐号，或找回密码');
	                        }else{
	                            self.hide();
	                            me._ownerDialog && me._ownerDialog.show();
	                            alert(me.lang.sysError);
	                        }
	                    })
	                },
	                onGetapiError:function(){
	                    alert('您所处的网络环境存在安全风险，请10分钟再试')
	                }
	            },
	            '120019':{
	                title:"登录解冻验证",
	                msg:"您最近密码输入错误过于频繁，为保证帐号("+options.username+")安全，请先进行安全验证",
	                onSuccess:function(self,data){
	                    var gotoUrl = options.gotourl + "&authsid=" + data.authsid;
	                    
	                    passport.data.jsonp(gotoUrl).success(function(result){
	                        if(result.errInfo.no == 0 || result.data.errno == 0){
	                            self.hide();
	                            args.isCompleted = false;
	                            alert('验证成功请重新切换帐号，或找回密码');
	                        }else{
	                            self.hide();
	                            me._ownerDialog && me._ownerDialog.show();
	                            alert(me.lang.sysError);
	                        }
	                    })
	                },
	                onGetapiError:function(){
	                    alert('您最近密码输入错误过于频繁，请稍后再试')
	                }
	            },
	            '120021':{
	                title:"安全验证",
	                msg:warnMsg,
	                defaultHTML:warnHtml,
	                onSuccess:function(self){
	                    passport.data.jsonp(options.loginproxy).success(function(result){
	                        if(result.errInfo.no == 0){
	                        	if(warnHtml){
		                            self.getElement('article').innerHTML = warnHtml;
		                            baidu(self.getElement('header_a')).on('click',function(){
		                                self.hide()
			                            me.loginCrossToHao123(result.data.hao123Param).success(function(){
			                            	me.switchSuccessed();
			                            })
		                            })
		                            baidu(document.getElementById('passport_forceverify_risk_next')).on('click',function(){
		                                self.hide()
			                            me.loginCrossToHao123(result.data.hao123Param).success(function(){
			                            	me.switchSuccessed();
			                            })
		                            })
	                        	}else{
		                            me.loginCrossToHao123(result.data.hao123Param).success(function(){
		                            	me.switchSuccessed();
		                            })
	                        	}
	                        }else{
	                            alert(me.lang.sysError);
	                        }
	                    })
	                    return false;   
	                },
	                onRender:function(self){
	                    if(document.getElementById('passport_forceverify_risk_appeal')){
	                        document.getElementById('passport_forceverify_risk_appeal').href = self.url_forgot;
	                    }
	                }
	            }
	        }[options.errno]

	        passport._use(verifyModName,_bizMods[verifyModName],function(){
	            //authtoken可能变化，所以必须重新执行Forceverify。
	            forceverifyLoginverify = passport.pop.Forceverify({
	                token:options.authtoken,//必须传入该参数
	                title:verifyOpt.title,
	                msg:verifyOpt.msg,
	                subpro:me.config.subpro,
	                onRender:function(self){
	                    verifyOpt.onRender && verifyOpt.onRender(self)
	                },
	                onSubmitSuccess:function(self,data){
	                    if(verifyOpt.onSuccess){
	                        verifyOpt.onSuccess(self,data)
	                        return;
	                    }
	                    var loginProxyUrl = options.loginproxy;

	                    passport.data.jsonp(options.loginproxy).success(function(result){
	                        if(result.errInfo.no == 0 || result.data.errno == 0){
	                            self.hide();
		                        me.loginCrossToHao123(result.data.hao123Param).success(function(){
		                        	me.switchSuccessed();
		                        })
	                        }else{
	                            self.hide();
	                            alert(me.lang.sysError);
	                        }
	                    })
	                },
	                onGetapiError:function(self){
	                    if(verifyOpt.onGetapiError){
	                        verifyOpt.onGetapiError(self)
	                        return;
	                    }
	                    alert(me.lang.sysError);
	                },
	                onHide:function(){
	                }
	            },true);
	        })
	    },
	    switchSuccessed:function(){
	    	var me = this;

			var returnValue = true;
			if(me.config.onSuccess){
				returnValue = me.config.onSuccess(me)
			}
			if(!returnValue){return}

			window.location.reload()	    	
	    },
		changeToUser:function(user){
			var me = this;
			passport.data.multiSwitchuser({
				token:me.switchToken,
				username:user,
				tpl:me.config.tpl || 'pp'
			}).success(function(rsp){
				if(rsp.errInfo.no == 0){
					me.switchSuccessed();
				}else{
					if(rsp.errInfo.no == 400031 || rsp.errInfo.no == 5 || rsp.errInfo.no == 120019 || rsp.errInfo.no == 120021){	            
						var returnValue = true;
						if(me.config.onNeedverify){
							returnValue = me.config.onNeedverify(me)
						}
						if(!returnValue){return}

			            //引用CSS ， 如果引用一次不会再引用
			            me.loadCssFile(_domain + '/passApi/css/uni_forceverify.css');
						me.verifyAction({
							secstate:rsp.data.secstate,
							authtoken:rsp.data.authtoken,
							loginproxy:rsp.data.loginproxy,
							gotourl:rsp.data.gotourl,
							username:user,
							errno:rsp.errInfo.no
						})
					}else{						
						var returnValue = true;
						if(me.config.onFailed){
							returnValue = me.config.onFailed(me)
						}
						if(!returnValue){return}
						alert(rsp.errInfo['msg'] || me.lang.sysError)						
					}
				}
			})
		},
		render:function(){
			var me = this;

			var template = baidu(me._getTemplate());
			me._target.appendChild(template.get(0));

			me._setEvent();
			me._rendUser();
		}
	}
	return changeUser;
})()
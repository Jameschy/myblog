/**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api登录api挂接analysis，用以统计数据
 * @Date: 2012-12-26
 */

var passport = passport || window.passport || {};
passport.analysis = passport.analysis || {};
(function(ns) {
    var log = function(api, data){
        var logintype = api.config.diaPassLogin ? 'dialogLogin' : 'basicLogin';
        var merge = api.config.loginMerge?1:0;
        var tpl = api.config.product || 'isnull';
        var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
        var otherValue = '';
        var t = '&tt='+new Date().getTime();
        var gid = api.guideRandom ? api.guideRandom : '';
        for(var i in data){
            otherValue  = otherValue + '&'+i+'='+data[i]
        }

        if(protocol == 'http:'){
            var link = 'http://nsclick.baidu.com/v.gif?pid=111&url=&logintype='+logintype+'&gid='+gid+'&merge='+merge+'&tpl='+tpl+otherValue + t;
        }else if(protocol == 'https:'){
            var link = 'https://passport.baidu.com/img/v.gif?logintype='+logintype+'&gid='+gid+'&merge='+merge+'&tpl='+tpl+otherValue + t;
        }
        if(link){
            var img = new Image();
                img.onload = img.onerror = function() {
                    img.onload = img.onerror = null;
                    img = null
                };
                img.src = link;            
        }
    }
    ns.login = {
        render:function(api){
            //内嵌展示数据

            log(api,{type:'firstrender',loginurl:encodeURIComponent(document.location.href)})

            baidu(api.getPhoenixElement('pass_phoenix_list_login')).on('click',function(evt){
                var $target = baidu(evt.target),
                    currentSite;
                if($target && $target.attr('title')){
                    switch($target.attr('title')){
                        case '普通登录':
                            currentSite = 'normal'
                        break;
                        case '二维码登录':
                            currentSite = 'qrcode'
                        break;
                        case '短信登录':
                            currentSite = 'sms'
                        break;
                        case 'QQ帐号':
                            currentSite = 'qq'
                        break;
                        case '新浪微博':
                            currentSite = 'weibo'
                        break;
                        case '人人网':
                            currentSite = 'renren'
                        break;
                        case '腾讯微博':
                            currentSite = 'tqq'
                        break;
                        case '飞信':
                            currentSite = 'fetion'
                        break;
                        case '微信':
                            currentSite = 'weixin'
                        break;
                        case '天翼':
                            currentSite = 'tianyi'
                        break;
                    }
                    //第三方被点击的数据
                    log(api,{phoenix:currentSite})
                }
            })

            var formEle = api.getElement();
            /*baidu(formEle).on('click',function(event){
                if(!api.loginfirstclick){
                    api.loginfirstclick = true; 
                    //有操作的次数
                    log(api,{type:'loginfirst'})              
                }              
            })*/





            var $form = api.getElement('form');
            baidu($form).on('submit',function(event){
                if(!api.loginfirstsubmit){
                    api.loginfirstsubmit = true; 
                    //第一次有submit行为的次数
                    log(api,{type:'loginfirstsubmit'})              
                }              
            })

        },
        changeLoginType : function(api,args){
            log(api,{type:'changelogintype',logintype:(args && args.loginType)||''})
        },
        fieldFocus: function(api, args) {
            //有输入的次数
            if((args.ele.get(0).id == api.$getId('smsPhone') || args.ele.get(0).id == api.$getId('smsVerifyCode')) && !api.smsloginfirstlog){
                api.smsloginfirstlog = true;
                //有操作的次数
                log(api,{type:'smsloginfirst'})
            }else{
                if(!api.loginfirstlog){
                    api.loginfirstlog = true;
                    //有操作的次数
                    log(api,{type:'loginfirst'})
                }
            }
        },
        loginSuccess: function(api, args) {
            //提交成功的次数
            log(api,{type:'loginsuccess'})
        },
        loginError: function(api, args) {
        },
        validateError:function(api,ele){
            if(ele.validate){
                log(api,{errno:encodeURIComponent(ele.validate.msg),type:'loginerrno'})               
            }
            return {preventEvent : false, preventDefault : false};
        },
        fieldKeyup: function(api, args) {
            //有输入的次数
            if(!api.KEYUPFLAG){
                log(api,{type:'typein'})
                api.KEYUPFLAG = true;
            }
        }
    };
})(passport.analysis);
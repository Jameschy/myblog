!function(){var t=t||window.passport||{},e=t.tangramInst||e||window.baidu;!function(t){t.apiDomain={staticDomain:window.location?"http:"==window.location.protocol.toLowerCase()?"http://passport.bdimg.com/":"https://passport.baidu.com":"http:"==document.location.protocol.toLowerCase()?"http://passport.bdimg.com/":"https://passport.baidu.com"}}(t);var i=null;if("function"!=typeof i)var i=function(){};i.resourcePath="",i.skinName="default",i.version="1.0.2.2",/msie 6/i.test(navigator.userAgent)&&document.execCommand("BackgroundImageCache",!1,!0),i.Base=function(){e.lang.Class.call(this),this._ids={},this._eid=this.guid+"__"},e.lang.inherits(i.Base,e.lang.Class,"http://passport.baidu.com/passApi/js/magic.Base").extend({getElement:function(t){return document.getElementById(this.$getId(t))},getElements:function(){var t={},e=this._ids;for(var i in e)t[i]=this.getElement(i);return t},$getId:function(t){return t=e.lang.isString(t)?t:"",this._ids[t]||(this._ids[t]=this._eid+t)},$mappingDom:function(t,i){return e.lang.isString(i)?this._ids[t]=i:i&&i.nodeType&&(i.id?this._ids[t]=i.id:i.id=this.$getId(t)),this},$dispose:function(){this.fire("ondispose")&&e.lang.Class.prototype.dispose.call(this)}}),i.control=i.control||{},i.control.Layer=e.lang.createClass(function(t){this.width="auto",this.height="auto",e.object.extend(this,t||{})},{type:"magic.control.Layer",superClass:i.Base}).extend({show:function(){this.fire("onbeforeshow")&&(this.getElement().style.display="",this.fire("onshow"))},hide:function(){this.fire("onbeforehide")&&(this.getElement().style.display="none",this.fire("onhide"))},setWidth:function(t){e.dom.setPixel(this.getElement(),"width",this.width=t)},setHeight:function(t){e.dom.setPixel(this.getElement(),"height",this.height=t)},setSize:function(t){this.setWidth(t.width||t[0]),this.setHeight(t.height||t[1])}}),i.control.Dialog=e.lang.createClass(function(t){var i=this;t=e.object.extend({width:400,height:300,left:0,top:0,contentType:"html",draggable:!0},t||{}),e.object.extend(i._options||(i._options={}),t),i._footerHeight=0,t.width<100&&(t.width=100),t.height<100&&(t.height=100),this.zIndex=60001,this.disposeProcess=[],this.on("load",function(){var t=this.getElement(),i=this,s=i._options;("number"==typeof s.left||"number"==typeof s.top)&&this.setPosition(s),("number"==typeof s.width||"number"==typeof s.height)&&this.setSize(this._options),this._isShown=!0,this.focus();var n=function(t){i.focus(t)};if(e(document).on("mousedown",n),this.disposeProcess.unshift(function(){e(document).off("mousedown",n)}),s.draggable){var o,a=this.getElement("title"),r=e.fn.bind,i=this,c=t.parentNode,d=e(c).position();a.className+=" tang-title-dragable";var l={top:function(){var t=e(c).css("borderTopWidth");return t=/px/.test(t)?parseInt(t):0,c==document.body?0-t:0-(d.top+t)},right:function(){var i=e(".tang-background-inner",t)[0],s="auto"==e(i).css("marginLeft")?i.offsetLeft+"px":e(i).css("marginLeft");return e.page.getWidth()+l.left()-parseInt(s)},bottom:function(){var i=e(".tang-background-inner",t)[0],s="auto"==e(i).css("marginTop")?i.offsetTop+"px":e(i).css("marginTop");return e.page.getHeight()+l.top()-parseInt(s)},left:function(){var t=e(c).css("borderLeftWidth");return t=/px/.test(t)?parseInt(t):0,c==document.body?0-t:0-(d.top+t)}};e(a).on("mousedown",o=r(function(i){i.preventDefault(),e.dom.drag(t,{ondragstart:r(function(){this.fire("dragstart")},this),ondrag:r(function(){this.fire("drag")},this),ondragend:r(function(){this.fire("dragstop")},this),range:[l.top(),l.right(),l.bottom(),l.left()]})},this)),this.disposeProcess.unshift(function(){e(a).off("mousedown",o)})}}),this.on("resize",function(){this.getElement("titleText"),this.getElement("titleButtons")})},{type:"magic.control.Dialog",superClass:i.Base}),i.control.Dialog.extend({isShowing:function(){return this._isShown},show:function(){return this.fire("beforeshow")===!1?this:(this.getElement().style.display="",this._isShown=!0,void this.fire("show"))},hide:function(t){return this.fire("beforehide")===!1?this:(this._isShown=!1,this.getElement().style.display="none","unHide"==t?(this.hideMask(),this):void this.fire("hide"))},setTitleText:function(t){var i=this.getElement("titleText");return i.innerHTML=e.string.encodeHTML(t)||"&nbsp;",this},setContent:function(t,i){var s,n,o,a=this.getElement("content");if(s=this._lastDom){if(o=s.parent,s.content===t)return this;s.target?o.insertBefore(s.content,s.target):o.appendChild(s.content),this._lastDom=null}switch(i){case"text":a.innerHTML=e.string.encodeHTML(t),e(a).removeClass("contentFrame");break;case"element":o=t.parentNode,o&&(o.insertBefore(n=document.createTextNode(""),t),this._lastDom={content:t,parent:t.parentNode,target:n}),a.innerHTML="",a.appendChild(t);break;case"frame":e(a).css("height",e(this.getElement("body")).css("height")),a.innerHTML="<iframe frameborder='no' src='"+t+"'></iframe>",e(a).hasClass("contentFrame")||e(a).addClass("contentFrame");break;default:a.innerHTML=t,e(a).removeClass("contentFrame")}return this},focus:function(t){var i=e.global.get("dialogFocused").map,s=this.$getId()+"focus",n=function(){for(var t in i)t!=s&&(i[t]=!1)};if(i||(e.global.get("dialogFocused").map=i={}),arguments.length){var o=t.target;e(o).closest(this.getElement()).size()>0?(e(this.getElement()).css("zIndex",this.zIndex=60001),1!=i[s]&&(this.fire("focus"),n(),i[s]=!0)):i[s]=!1}else e(this.getElement()).css("zIndex",this.zIndex=60001),i[s]=!0,n(),this.fire("focus")},setSize:function(t){var i=this.getElement("foreground");if("number"==typeof t.width&&e(i).css("width",(this._options.width=t.width)+"px"),"number"==typeof t.height){e(i).css("height",(this._options.height=t.height)+"px");var s=Math.max(0,this._options.height-this._titleHeight-this._footerHeight)+"px";e(this.getElement("body")).css("height",s)}this.fire("resize",t)},getSize:function(){return{width:this._options.width,height:this._options.height}},setPosition:function(t){"number"==typeof t.left&&e(this.getElement()).css("left",(this._options.left=t.left)+"px"),"number"==typeof t.top&&e(this.getElement()).css("top",(this._options.top=t.top)+"px"),this.fire("move",t)},getPosition:function(){return{left:this._options.left,top:this._options.top}},center:function(){var t=document[e.browser.isStrict?"documentElement":"body"],i=t.clientWidth,s=t.clientHeight,n=((i-this._options.width)/2|0)+e.page.getScrollLeft(),o=((s-this._options.height)/2|0)+e.page.getScrollTop();this.setPosition({left:n,top:o})},$dispose:function(){var t=e.global.get("dialogFocused").map;t&&delete t[this.$getId()+"focus"];for(var s=0,n=this.disposeProcess.length;n>s;s++)this.disposeProcess[s].call(this);i.Base.prototype.$dispose.call(this)}}),i.Background=e.lang.createClass(function(t){var i=t||{},s=this;s.coverable=i.coverable||!1,s.styleBox=i.styleBox,s.tagName="div";var n="filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;";s._coverDom="<div style='"+n+"opacity:0;background-color:#FFFFFF'></div>";var o=e.browser;o.ie<7&&(s._coverDom="<iframe frameborder='0' style='"+n+"' src='"+("https:"==(window.location?window.location.protocol.toLowerCase():document.location.protocol.toLowerCase())?"https://passport.baidu.com/passApi/html/_blank.html":"about:blank")+"'></iframe>"),o.ie&&(!o.isStrict||o.ie<8)&&(s.size=[0,0],s.timer=setInterval(function(){s._forIE()},80)),this._innerHTML="<div class='tang-background-inner' style='width:100%;height:100%;' id='"+this.$getId("inner")+"'></div>"},{type:"magic.Background",superClass:i.Base}).extend({render:function(t){var i=e.dom(t).get(0);i!=document.body&&"static"==e.dom(i).css("position"),e.dom(i).insertHTML("afterbegin",this.toHTMLString())},$dispose:function(){var t=this.getElement();t.parentNode.removeChild(t),clearInterval(this.timer)},toHTMLString:function(t){return["<",t||this.tagName," class='tang-background",e.browser.ie<7?" ie6__":"","' id='",this.$getId(),"' style='position:absolute; top:0px; left:0px;",this.timer?"width:10px;height:10px;":"width:100%;height:100%;","z-index:-9; -webkit-user-select:none; -moz-user-select:none;' ","onselectstart='return false'>",this._innerHTML,this.coverable?this._coverDom||"":"","</",t||this.tagName,">"].join("")},setContent:function(t){this.getElement("inner").innerHTML=t},_forIE:function(){if(this.guid&&this.layer||(this.layer=this.getElement())&&this.layer.offsetHeight){var t=this.layer,i=this.container||t.parentNode;if(i&&i.style){var s=i.style,n=parseInt(s.borderTopWidth)||0,o=parseInt(s.borderRightWidth)||0,a=parseInt(s.borderBottomWidth)||0,r=parseInt(s.borderLeftWidth)||0,c=i.offsetWidth-o-r,d=i.offsetHeight-n-a;if((this.size[0]!=c||this.size[1]!=d)&&(t.style.width=(this.size[0]=c)+"px",t.style.height=(this.size[1]=d)+"px"),this.styleBox&&this.table||(this.table=this.getElement("table"))){var l,h;l=l||parseInt(e.dom(this.table.rows[0]).getCurrentStyle("height")),h=h||parseInt(e.dom(this.table.rows[2]).getCurrentStyle("height")),this.table.rows[0].style.height=l+"px",this.table.rows[2].style.height=h+"px",this.table.rows[1].style.height=this.layer.offsetHeight-l-h+"px"}}}}}),i.Dialog=e.lang.createClass(function(){},{type:"magic.Dialog",superClass:i.control.Dialog}),i.Dialog.extend({render:function(t){"string"===e.type(t)&&(t="#"+t),t=e(t)[0],t||document.body.appendChild(t=document.createElement("div"));var s=i.Dialog.template.join(""),n=this._options;e(t).addClass(n.className||"tang-pass-pop-login"),e(t).insertHTML("beforeEnd",e.string.format(s,{content:"",titleId:this.$getId("title"),bodyId:this.$getId("body"),contentId:this.$getId("content"),foregroundId:this.$getId("foreground"),footerId:this.$getId("footer"),footerContainerId:this.$getId("footerContainer")})),this._background=new i.Background({coverable:!0}),this._background.render(t),this.$mappingDom("",t),this._renderHeader(),this._titleHeight=this.getElement("title").offsetHeight||30,e(this.getElement("footer")).hide(),this.fire("footer"),this.setSize(n),this.setPosition(n),n.content&&this.setContent(n.content,n.contentType),this.fire("load"),this.show(),this.disposeProcess.push(function(){e(this.getElement("closeBtn")).off("click",this._closeBtnFn),this._background.$dispose(),t.innerHTML="",e(t).removeClass("tang-ui tang-dialog")})},_renderHeader:function(){var t=["<div class='buttons' id='",this.$getId("titleButtons"),"'>","<a id='",this.$getId("closeBtn"),"' class='close-btn' href='###' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a>","</div>","<span id='",this.$getId("titleText"),"'>",e.string.encodeHTML(this._options.titleText||"")||"&nbsp;","</span>"];e(this.getElement("title")).insertHTML("beforeEnd",t.join("")),e(this.getElement("closeBtn")).on("click",this._closeBtnFn=e.fn.bind(this.hide,this))}}),i.Dialog.template=["<div class='tang-foreground' id='#{foregroundId}'>","<div class='tang-title' id='#{titleId}'>","</div>","<div class='tang-body' id='#{bodyId}'>","<div class='tang-content' id='#{contentId}'>#{content}</div>","</div>","<div class='tang-footer' id='#{footerId}'>","<div id='#{footerContainerId}'></div>","</div>","</div>"],e.lang.register(i.control.Dialog,function(t){t&&t.buttons&&t.buttons.enable&&this.on("footer",function(){this.buttons=null,e(this.getElement("footer")).show(),this._createButton(t.buttons),e(this.getElement("footerContainer")).addClass("tang-footerContainer");var i=this.getElement("footer").offsetHeight;(!this.buttons||0==this.buttons.length)&&(i=30)&&e(this.getElement("footer")).css("height",30),this._footerHeight=i})},{_createButton:function(){var t=this,i=arguments.length>0?arguments[0]:{},s=e(t.getElement("footerContainer")),n=t.buttons||(t.buttons=[]),o=!1,a=function(){var t=['<a href="#" onClick="return false;" class="tang-dialog-button ',"",'">','<span class="tang-dialog-button-s">','<span class="tang-dialog-button-s-space">&nbsp;</span>','<span class="tang-dialog-button-s-text">',"","</span>","</span>","</a>"];return function(i,s){return t[1]=i.disabled?"tang-dialog-button-disabled":"",t[6]=i.text||"&nbsp;",e(s).insertHTML("beforeEnd",t.join("")),e(s).children().get(0)}}();e.forEach(i.items||[],function(i,r){var c,d;s.append(d=e('<span class="tang-dialog-button-carrier"></span>')[0]),d="object"==typeof i?(i.builder||a).call(this,i,d,t,r):i,!o&&i.focused&&!i.disabled&&(o=!0)&&d.focus(),n.push(d),i.disabled||i.click&&e(d).on("click",c=function(){i.click.call(this,t)}),c&&this.disposeProcess.push(function(){e(d).off("click",c)})},t),s.addClass("tang-button-"+(i.align||"right"))}}),i.Mask=function(t){function s(){if(a.container==document.body){var t=a.getElement().style;t.display="none",a.setSize([e.page.getViewWidth(),e.page.getViewHeight()]),t.display=""}}function n(){if(a.container==document.body){var t=a.getElement().style;t.display="none",t.top=e.page.getScrollTop()+"px",t.left=e.page.getScrollLeft()+"px",t.display=""}}function o(t){for(var e,i=document.getElementsByTagName("object"),s=t?"visible":"hidden",n=0,o=i.length;o>n;n++)e=i[n],e.style.visibility=s}var a=this;i.control.Layer.call(this),a.zIndex=999,a.opacity=.3,a.bgColor="#000000",a.coverable=!1,a.container=document.body,e.object.extend(a,t||{});var r=e.browser.safari,c=e.browser.ie;e.dom(a.container).insertHTML("afterBegin",a.toHTMLString()),6==c&&(a.getElement().style.position="absolute"),a.on("show",function(){s(),6==c&&n(),e.dom(window).on("resize",s),6==c&&e.dom(window).on("scroll",n);var t=a.getElement().style;t.opacity=a.opacity,t.zIndex=a.zIndex,t.filter="alpha(opacity="+100*a.opacity+")",t.backgroundColor=a.bgColor,r&&o(!1)}),a.on("hide",function(){e.dom(window).off("resize",s),6==c&&e.dom(window).off("scroll",n),r&&o(!0)})},e.lang.inherits(i.Mask,i.control.Layer,"http://passport.baidu.com/passApi/js/magic.Mask").extend({toHTMLString:function(){return"<div id='"+this.$getId()+"' class='pop-mask' style='top:0px; left:0px; position:fixed; display:none;'>"+("<iframe frameborder='0' style='filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1' src='"+("https:"==(window.location?window.location.protocol.toLowerCase():document.location.protocol.toLowerCase())?"https://passport.baidu.com/passApi/html/_blank.html":"about:blank")+"'></iframe><div style='position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;'>&nbsp;</div>")+"</div>"}}),e.lang.register(i.control.Dialog,function(t){t&&t.mask&&t.mask.enable&&(this.renderMask(),this.on("load",function(){this._options.left||this.center()}),this.on("show",function(){this.showMask()}),this.on("hide",function(){this.hideMask()}))},{renderMask:function(){if(this._mask)return this;var t=this._options.mask;this._mask=new i.Mask({opacity:t.opacity||.15,bgColor:t.bgColor||"#000",zIndex:this.zIndex-1});var s=this;return this.disposeProcess.push(function(){e(s._mask.getElement()).remove()}),this},showMask:function(){return this._mask.show(),this},hideMask:function(){return this._mask.hide(),this}});var t=t||window.passport||{};t._modulePool=t._modulePool||{},t._define=t._define||function(e,i){t._modulePool[e]=i&&i()},t._getModule=t._getModule||function(e){return t._modulePool[e]};var t=window.passport||{};t._load=t._load||function(t,e,i){var s=document,n=s.createElement("SCRIPT");if(e){n.type="text/javascript",n.charset="UTF-8";var o=t.split("?")[0],a=Math.round(1e3*Math.random()),r=(new Date).getTime();n.readyState?n.onreadystatechange=function(){if("loaded"===n.readyState||"complete"===n.readyState){if(n.onreadystatechange=null,100===a){var t=(new Date).getTime()-r;(new Image).src=document.location.protocol+"//nsclick.baidu.com/v.gif?pid=111&type=1023&url="+encodeURIComponent(o)+"&time="+t}i&&i()}}:n.onload=function(){if(100===a){var t=(new Date).getTime()-r;(new Image).src=document.location.protocol+"//nsclick.baidu.com/v.gif?pid=111&type=1023&url="+encodeURIComponent(o)+"&time="+t}i&&i()},n.src=100===a?o+"?t="+Math.random():t,s.getElementsByTagName("head")[0].appendChild(n)}else n.type="text/javascript",n.charset="UTF-8",n.src=t,s.getElementsByTagName("head")[0].appendChild(n),n.readyState?n.onreadystatechange=function(){("loaded"===n.readyState||"complete"===n.readyState)&&(n.onreadystatechange=null,i&&i())}:n.onload=function(){i&&i()}},t.ieVersion=function(){var t,e=navigator.userAgent.toLowerCase(),i=e.indexOf("msie")>-1;return i&&(t=e.match(/msie ([\d.]+)/)[1]),t},t._use=t._use||function(e,i,s){function n(){var e=t._getModule(c);if(!e)throw new Error("load "+c+"module script error.");s&&s(e)}var o={"http:":"http://passport.bdimg.com/","https:":"https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv"};t.ieVersion()<=8&&(o={"http:":"http://passport.baidu.com/","https:":"https://passport.baidu.com"});var a;a=t&&"https"===t._protocol?"https:":window.location?window.location.protocol.toLowerCase():document.location.protocol.toLowerCase();var r=(o[a]||o["https:"])+i,c=e+".js",d=t._getModule(c);d?s&&s(d):t._load(r,!0,n)},t.use=t.use||function(e,i,s){var n=i&&i.tangram===!1?"":"_tangram";i&&i.protocol&&(t._protocol=i.protocol),"reg"===e&&i&&i.regPhoneOnly&&(e="regPhone");var o="login"===e&&i&&i.loginVersion&&"v4"===i.loginVersion,a=o?"loginv4_2a0aa34.js"/*tpa=http://passport.baidu.com/passApi/js/loginv4_2a0aa34.js*/:"login_b6ddb5d.js"/*tpa=http://passport.baidu.com/passApi/js/login_b6ddb5d.js*/,r=o?"loginv4_tangram_51175aa.js"/*tpa=http://passport.baidu.com/passApi/js/loginv4_tangram_51175aa.js*/:"login_tangram_cbb2f15.js"/*tpa=http://passport.baidu.com/passApi/js/login_tangram_cbb2f15.js*/,c={login:a,login_tangram:r,smsloginEn:"smsloginEn_6e229f0.js"/*tpa=http://passport.baidu.com/passApi/js/smsloginEn_6e229f0.js*/,smsloginEn_tangram:"smsloginEn_tangram_7824f1f.js"/*tpa=http://passport.baidu.com/passApi/js/smsloginEn_tangram_7824f1f.js*/,loginWLtoPC:"loginWLtoPC_98684d0.js"/*tpa=http://passport.baidu.com/passApi/js/loginWLtoPC_98684d0.js*/,accConnect:"accConnect_8dea38d.js"/*tpa=http://passport.baidu.com/passApi/js/accConnect_8dea38d.js*/,accConnect_tangram:"accConnect_tangram_b42d6cb.js"/*tpa=http://passport.baidu.com/passApi/js/accConnect_tangram_b42d6cb.js*/,accRealName:"accRealName_cf7f3e5.js"/*tpa=http://passport.baidu.com/passApi/js/accRealName_cf7f3e5.js*/,accRealName_tangram:"accRealName_tangram_58165f1.js"/*tpa=http://passport.baidu.com/passApi/js/accRealName_tangram_58165f1.js*/,checkPhone:"checkPhone_d490a05.js"/*tpa=http://passport.baidu.com/passApi/js/checkPhone_d490a05.js*/,checkPhone_tangram:"checkPhone_tangram_d734576.js"/*tpa=http://passport.baidu.com/passApi/js/checkPhone_tangram_d734576.js*/,checkIDcard:"checkIDcard_59a38e5.js"/*tpa=http://passport.baidu.com/passApi/js/checkIDcard_59a38e5.js*/,checkIDcard_tangram:"checkIDcard_tangram_801bdc5.js"/*tpa=http://passport.baidu.com/passApi/js/checkIDcard_tangram_801bdc5.js*/,travelComplete:"travelComplete_86e2912.js"/*tpa=http://passport.baidu.com/passApi/js/travelComplete_86e2912.js*/,travelComplete_tangram:"travelComplete_tangram_a3d4b0a.js"/*tpa=http://passport.baidu.com/passApi/js/travelComplete_tangram_a3d4b0a.js*/,bindGuide:"bindGuide_abc8126.js"/*tpa=http://passport.baidu.com/passApi/js/bindGuide_abc8126.js*/,bindGuide_tangram:"bindGuide_tangram_5781ac6.js"/*tpa=http://passport.baidu.com/passApi/js/bindGuide_tangram_5781ac6.js*/,accSetPwd:"accSetPwd_8109ba5.js"/*tpa=http://passport.baidu.com/passApi/js/accSetPwd_8109ba5.js*/,accSetPwd_tangram:"accSetPwd_tangram_d00b180.js"/*tpa=http://passport.baidu.com/passApi/js/accSetPwd_tangram_d00b180.js*/,IDCertify:"IDCertify_cf99365.js"/*tpa=http://passport.baidu.com/passApi/js/IDCertify_cf99365.js*/,IDCertify_tangram:"IDCertify_tangram_ef7eb24.js"/*tpa=http://passport.baidu.com/passApi/js/IDCertify_tangram_ef7eb24.js*/,secondCardVerify:"secondCardVerify_7d5de75.js"/*tpa=http://passport.baidu.com/passApi/js/secondCardVerify_7d5de75.js*/,secondCardVerify_tangram:"secondCardVerify_tangram_918560f.js"/*tpa=http://passport.baidu.com/passApi/js/secondCardVerify_tangram_918560f.js*/,IDCertifyQrcode:"IDCertifyQrcode_4db6064.js"/*tpa=http://passport.baidu.com/passApi/js/IDCertifyQrcode_4db6064.js*/,IDCertifyQrcode_tangram:"IDCertifyQrcode_tangram_6536ce1.js"/*tpa=http://passport.baidu.com/passApi/js/IDCertifyQrcode_tangram_6536ce1.js*/,loadingApi:"loadingApi_c483bcd.js"/*tpa=http://passport.baidu.com/passApi/js/loadingApi_c483bcd.js*/,loadingApi_tangram:"loadingApi_tangram_6256e4f.js"/*tpa=http://passport.baidu.com/passApi/js/loadingApi_tangram_6256e4f.js*/,loginWap:"loginWap_6da7ccb.js"/*tpa=http://passport.baidu.com/passApi/js/loginWap_6da7ccb.js*/,reg:"reg_33edf97.js"/*tpa=http://passport.baidu.com/passApi/js/reg_33edf97.js*/,reg_tangram:"reg_tangram_931dbc1.js"/*tpa=http://passport.baidu.com/passApi/js/reg_tangram_931dbc1.js*/,regPhone:"regPhone_3576a13.js"/*tpa=http://passport.baidu.com/passApi/js/regPhone_3576a13.js*/,regPhone_tangram:"regPhone_tangram_9b9baf8.js"/*tpa=http://passport.baidu.com/passApi/js/regPhone_tangram_9b9baf8.js*/,fillUserName:"fillUserName_ed92944.js"/*tpa=http://passport.baidu.com/passApi/js/fillUserName_ed92944.js*/,fillUserName_tangram:"fillUserName_tangram_6ee9d13.js"/*tpa=http://passport.baidu.com/passApi/js/fillUserName_tangram_6ee9d13.js*/,qrcode:"qrcode_5efa25e.js"/*tpa=http://passport.baidu.com/passApi/js/qrcode_5efa25e.js*/,qrcode_tangram:"qrcode_tangram_ade950f.js"/*tpa=http://passport.baidu.com/passApi/js/qrcode_tangram_ade950f.js*/,realUserTag:"realUserTag_0013893.js"/*tpa=http://passport.baidu.com/passApi/js/realUserTag_0013893.js*/,realUserTag_tangram:"realUserTag_tangram_e5f75f4.js"/*tpa=http://passport.baidu.com/passApi/js/realUserTag_tangram_e5f75f4.js*/,bind:"bind_dc6801e.js"/*tpa=http://passport.baidu.com/passApi/js/bind_dc6801e.js*/,bind_tangram:"bind_tangram_6252ab0.js"/*tpa=http://passport.baidu.com/passApi/js/bind_tangram_6252ab0.js*/,multiBind:"multiBind_ca67689.js"/*tpa=http://passport.baidu.com/passApi/js/multiBind_ca67689.js*/,multiBind_tangram:"multiBind_tangram_36a0fe6.js"/*tpa=http://passport.baidu.com/passApi/js/multiBind_tangram_36a0fe6.js*/,multiUnbind:"multiUnbind_6370bbd.js"/*tpa=http://passport.baidu.com/passApi/js/multiUnbind_6370bbd.js*/,multiUnbind_tangram:"multiUnbind_tangram_14f0f35.js"/*tpa=http://passport.baidu.com/passApi/js/multiUnbind_tangram_14f0f35.js*/,changeUser:"changeUser_4191a2a.js"/*tpa=http://passport.baidu.com/passApi/js/changeUser_4191a2a.js*/,changeUser_tangram:"changeUser_tangram_d21b67c.js"/*tpa=http://passport.baidu.com/passApi/js/changeUser_tangram_d21b67c.js*/,loginMultichoice:"loginMultichoice_cdef7c5.js"/*tpa=http://passport.baidu.com/passApi/js/loginMultichoice_cdef7c5.js*/,loginMultichoice_tangram:"loginMultichoice_tangram_4d221fa.js"/*tpa=http://passport.baidu.com/passApi/js/loginMultichoice_tangram_4d221fa.js*/,confirmWidget:"confirmWidget_8e53be9.js"/*tpa=http://passport.baidu.com/passApi/js/confirmWidget_8e53be9.js*/,confirmWidget_tangram:"confirmWidget_tangram_b35a593.js"/*tpa=http://passport.baidu.com/passApi/js/confirmWidget_tangram_b35a593.js*/,uni_rebindGuide:"uni_rebindGuide_4224215.js"/*tpa=http://passport.baidu.com/passApi/js/uni_rebindGuide_4224215.js*/,uni_rebindGuide_tangram:"uni_rebindGuide_tangram_4234c58.js"/*tpa=http://passport.baidu.com/passApi/js/uni_rebindGuide_tangram_4234c58.js*/},d=e+n;2===arguments.length&&(s=i),i&&i.tangramInst&&(t.tangramInst=i.tangramInst),t._use(d,c[d],s)},t.pop.accRealName=function(s,n,o){function a(){var t=l.dialog,e=l.accRealName;n.show=function(){return n.reset(),t.show.call(t),n},n.hide=function(){return t.hide.call(t),n},n.center=function(){return t._center.call(t),n},n.reset=function(){return n.center(),n},n.setToken=function(t,i){return e.setToken(t,i),n},n.destroy=function(){for(var i=0,n=p.length;n>i;i++){var o=p[i];o.el.off(o.event,o.handler)}e.$dispose(),t.$dispose(),s&&s.onDestroy&&s.onDestroy()}}function r(){var t=l.dialog,e=l.accRealName;s&&s.onShow&&t.on("show",s.onShow),s&&s.onHide&&t.on("hide",function(){e.isverify?s.onverifyHide&&s.onverifyHide(e.verify_authsid):s.onHide&&s.onHide()}),s&&s.onSubmitStart&&e.on("beforeSubmit",s.onSubmitStart),s&&s.onSubmitedErr&&e.on("submitedErr",s.onSubmitedErr),s&&s.onSubmitSuccess&&e.on("submitSuccess",s.onSubmitSuccess),s&&s.onNotloginAction&&e.on("notloginAction",s.onNotloginAction),s&&s.onVerifyalreadyAction&&e.on("verifyalreadyAction",s.onVerifyalreadyAction),s&&s.onSystemErr&&e.on("onSystemErr",s.onSystemErr)}function c(){t.use("accRealName",{tangram:!1,tangramInst:s.tangram?e:null},function(t){m.init(t),a(),r(),o&&o()})}var d=function(t, e){var i=document.createElement("div");return i.id=t,e?i:document.body.appendChild(i)},l={},h={main:d("passport-accRealName-pop"),dialog:d("passport-accRealName-pop-dialog")},p=[],g=function(){var t=[];return t.push('<div class="clearfix">'),t.push('<div class="pass-accRealName-pop-content" id="passport-accRealName-pop-api">'),t.push("</div>"),t.push("</div>"),t.join("")},m={template:function(){e(h.main).addClass("tang-pass-pop-accRealName-color-"+("pink"==s.color?"pink":"blue")),h.dialog.innerHTML=g()},dialog:function(){l.dialog=new i.Dialog({draggable:!0,titleText:"验证手机",className:"tang-pass-pop-accRealName",content:h.dialog,contentType:"element",width:393,height:"auto",mask:{enable:!0}}),l.dialog.render(h.main),l.dialog.hide(),l.dialog._center=function(){l.dialog.center(),l.dialog.setPosition({top:(e(window).height()-e(l.dialog.getElement()).height())/2+e(window).scrollTop()})},e(window).on("resize",function(){l.dialog._center()})},accRealName:function(){var t=l.accRealName=new this.apiMagic.passport.accRealName(s.apiOpt);t.render("passport-accRealName-pop-api",function(){l.dialog._center()}),l.dialog._center(),t._ownerDialog=l.dialog},init:function(t){this.apiMagic=t,this.template(),this.dialog(),this.accRealName()}};c()}}();
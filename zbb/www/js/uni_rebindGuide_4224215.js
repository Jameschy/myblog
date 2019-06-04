

passport._define('uni_rebindGuide.js'/*tpa=http://passport.baidu.com/passApi/js/uni_rebindGuide.js*/, function() {
    var passport=passport||window.passport||{},baidu=passport.tangramInst||baidu||window.baidu;!function(o){o.apiDomain={staticDomain:window.location?"http:"==window.location.protocol.toLowerCase()?"http://passport.bdimg.com/":"https://passport.baidu.com":"http:"==document.location.protocol.toLowerCase()?"http://passport.bdimg.com/":"https://passport.baidu.com"}}(passport);;
    var passport=passport||window.passport||{};passport._modulePool=passport._modulePool||{},passport._define=passport._define||function(o,p){passport._modulePool[o]=p&&p()},passport._getModule=passport._getModule||function(o){return passport._modulePool[o]};;
    var magic=null;if("function"!=typeof magic)var magic=function(){};magic.resourcePath="",magic.skinName="default",magic.version="1.0.2.2",/msie 6/i.test(navigator.userAgent)&&document.execCommand("BackgroundImageCache",!1,!0),magic.Base=function(){baidu.lang.Class.call(this),this._ids={},this._eid=this.guid+"__"},baidu.lang.inherits(magic.Base,baidu.lang.Class,"http://passport.baidu.com/passApi/js/magic.Base").extend({getElement:function(t){return document.getElementById(this.$getId(t))},getElements:function(){var t={},e=this._ids;for(var i in e)t[i]=this.getElement(i);return t},$getId:function(t){return t=baidu.lang.isString(t)?t:"",this._ids[t]||(this._ids[t]=this._eid+t)},$mappingDom:function(t,e){return baidu.lang.isString(e)?this._ids[t]=e:e&&e.nodeType&&(e.id?this._ids[t]=e.id:e.id=this.$getId(t)),this},$dispose:function(){this.fire("ondispose")&&baidu.lang.Class.prototype.dispose.call(this)}}),magic.control=magic.control||{},magic.control.Layer=baidu.lang.createClass(function(t){this.width="auto",this.height="auto",baidu.object.extend(this,t||{})},{type:"magic.control.Layer",superClass:magic.Base}).extend({show:function(){this.fire("onbeforeshow")&&(this.getElement().style.display="",this.fire("onshow"))},hide:function(){this.fire("onbeforehide")&&(this.getElement().style.display="none",this.fire("onhide"))},setWidth:function(t){baidu.dom.setPixel(this.getElement(),"width",this.width=t)},setHeight:function(t){baidu.dom.setPixel(this.getElement(),"height",this.height=t)},setSize:function(t){this.setWidth(t.width||t[0]),this.setHeight(t.height||t[1])}}),magic.control.Dialog=baidu.lang.createClass(function(t){var e=this;t=baidu.object.extend({width:400,height:300,left:0,top:0,contentType:"html",draggable:!0},t||{}),baidu.object.extend(e._options||(e._options={}),t),e._footerHeight=0,t.width<100&&(t.width=100),t.height<100&&(t.height=100),this.zIndex=60001,this.disposeProcess=[],this.on("load",function(){var t=this.getElement(),e=this,i=e._options;("number"==typeof i.left||"number"==typeof i.top)&&this.setPosition(i),("number"==typeof i.width||"number"==typeof i.height)&&this.setSize(this._options),this._isShown=!0,this.focus();var o=function(t){e.focus(t)};if(baidu(document).on("mousedown",o),this.disposeProcess.unshift(function(){baidu(document).off("mousedown",o)}),i.draggable){var s,n=this.getElement("title"),a=baidu.fn.bind,e=this,r=t.parentNode,d=baidu(r).position();n.className+=" tang-title-dragable";var h={top:function(){var t=baidu(r).css("borderTopWidth");return t=/px/.test(t)?parseInt(t):0,r==document.body?0-t:0-(d.top+t)},right:function(){var e=baidu(".tang-background-inner",t)[0],i="auto"==baidu(e).css("marginLeft")?e.offsetLeft+"px":baidu(e).css("marginLeft");return baidu.page.getWidth()+h.left()-parseInt(i)},bottom:function(){var e=baidu(".tang-background-inner",t)[0],i="auto"==baidu(e).css("marginTop")?e.offsetTop+"px":baidu(e).css("marginTop");return baidu.page.getHeight()+h.top()-parseInt(i)},left:function(){var t=baidu(r).css("borderLeftWidth");return t=/px/.test(t)?parseInt(t):0,r==document.body?0-t:0-(d.top+t)}};baidu(n).on("mousedown",s=a(function(e){e.preventDefault(),baidu.dom.drag(t,{ondragstart:a(function(){this.fire("dragstart")},this),ondrag:a(function(){this.fire("drag")},this),ondragend:a(function(){this.fire("dragstop")},this),range:[h.top(),h.right(),h.bottom(),h.left()]})},this)),this.disposeProcess.unshift(function(){baidu(n).off("mousedown",s)})}}),this.on("resize",function(){this.getElement("titleText"),this.getElement("titleButtons")})},{type:"magic.control.Dialog",superClass:magic.Base}),magic.control.Dialog.extend({isShowing:function(){return this._isShown},show:function(){return this.fire("beforeshow")===!1?this:(this.getElement().style.display="",this._isShown=!0,void this.fire("show"))},hide:function(t){return this.fire("beforehide")===!1?this:(this._isShown=!1,this.getElement().style.display="none","unHide"==t?(this.hideMask(),this):void this.fire("hide"))},setTitleText:function(t){var e=this.getElement("titleText");return e.innerHTML=baidu.string.encodeHTML(t)||"&nbsp;",this},setContent:function(t,e){var i,o,s,n=this.getElement("content");if(i=this._lastDom){if(s=i.parent,i.content===t)return this;i.target?s.insertBefore(i.content,i.target):s.appendChild(i.content),this._lastDom=null}switch(e){case"text":n.innerHTML=baidu.string.encodeHTML(t),baidu(n).removeClass("contentFrame");break;case"element":s=t.parentNode,s&&(s.insertBefore(o=document.createTextNode(""),t),this._lastDom={content:t,parent:t.parentNode,target:o}),n.innerHTML="",n.appendChild(t);break;case"frame":baidu(n).css("height",baidu(this.getElement("body")).css("height")),n.innerHTML="<iframe frameborder='no' src='"+t+"'></iframe>",baidu(n).hasClass("contentFrame")||baidu(n).addClass("contentFrame");break;default:n.innerHTML=t,baidu(n).removeClass("contentFrame")}return this},focus:function(t){var e=baidu.global.get("dialogFocused").map,i=this.$getId()+"focus",o=function(){for(var t in e)t!=i&&(e[t]=!1)};if(e||(baidu.global.get("dialogFocused").map=e={}),arguments.length){var s=t.target;baidu(s).closest(this.getElement()).size()>0?(baidu(this.getElement()).css("zIndex",this.zIndex=60001),1!=e[i]&&(this.fire("focus"),o(),e[i]=!0)):e[i]=!1}else baidu(this.getElement()).css("zIndex",this.zIndex=60001),e[i]=!0,o(),this.fire("focus")},setSize:function(t){var e=this.getElement("foreground");if("number"==typeof t.width&&baidu(e).css("width",(this._options.width=t.width)+"px"),"number"==typeof t.height){baidu(e).css("height",(this._options.height=t.height)+"px");var i=Math.max(0,this._options.height-this._titleHeight-this._footerHeight)+"px";baidu(this.getElement("body")).css("height",i)}this.fire("resize",t)},getSize:function(){return{width:this._options.width,height:this._options.height}},setPosition:function(t){"number"==typeof t.left&&baidu(this.getElement()).css("left",(this._options.left=t.left)+"px"),"number"==typeof t.top&&baidu(this.getElement()).css("top",(this._options.top=t.top)+"px"),this.fire("move",t)},getPosition:function(){return{left:this._options.left,top:this._options.top}},center:function(){var t=document[baidu.browser.isStrict?"documentElement":"body"],e=t.clientWidth,i=t.clientHeight,o=((e-this._options.width)/2|0)+baidu.page.getScrollLeft(),s=((i-this._options.height)/2|0)+baidu.page.getScrollTop();this.setPosition({left:o,top:s})},$dispose:function(){var t=baidu.global.get("dialogFocused").map;t&&delete t[this.$getId()+"focus"];for(var e=0,i=this.disposeProcess.length;i>e;e++)this.disposeProcess[e].call(this);magic.Base.prototype.$dispose.call(this)}}),magic.Background=baidu.lang.createClass(function(t){var e=t||{},i=this;i.coverable=e.coverable||!1,i.styleBox=e.styleBox,i.tagName="div";var o="filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;";i._coverDom="<div style='"+o+"opacity:0;background-color:#FFFFFF'></div>";var s=baidu.browser;s.ie<7&&(i._coverDom="<iframe frameborder='0' style='"+o+"' src='"+("https:"==(window.location?window.location.protocol.toLowerCase():document.location.protocol.toLowerCase())?"https://passport.baidu.com/passApi/html/_blank.html":"about:blank")+"'></iframe>"),s.ie&&(!s.isStrict||s.ie<8)&&(i.size=[0,0],i.timer=setInterval(function(){i._forIE()},80)),this._innerHTML="<div class='tang-background-inner' style='width:100%;height:100%;' id='"+this.$getId("inner")+"'></div>"},{type:"magic.Background",superClass:magic.Base}).extend({render:function(t){var e=baidu.dom(t).get(0);e!=document.body&&"static"==baidu.dom(e).css("position"),baidu.dom(e).insertHTML("afterbegin",this.toHTMLString())},$dispose:function(){var t=this.getElement();t.parentNode.removeChild(t),clearInterval(this.timer)},toHTMLString:function(t){return["<",t||this.tagName," class='tang-background",baidu.browser.ie<7?" ie6__":"","' id='",this.$getId(),"' style='position:absolute; top:0px; left:0px;",this.timer?"width:10px;height:10px;":"width:100%;height:100%;","z-index:-9; -webkit-user-select:none; -moz-user-select:none;' ","onselectstart='return false'>",this._innerHTML,this.coverable?this._coverDom||"":"","</",t||this.tagName,">"].join("")},setContent:function(t){this.getElement("inner").innerHTML=t},_forIE:function(){if(this.guid&&this.layer||(this.layer=this.getElement())&&this.layer.offsetHeight){var t=this.layer,e=this.container||t.parentNode;if(e&&e.style){var i=e.style,o=parseInt(i.borderTopWidth)||0,s=parseInt(i.borderRightWidth)||0,n=parseInt(i.borderBottomWidth)||0,a=parseInt(i.borderLeftWidth)||0,r=e.offsetWidth-s-a,d=e.offsetHeight-o-n;if((this.size[0]!=r||this.size[1]!=d)&&(t.style.width=(this.size[0]=r)+"px",t.style.height=(this.size[1]=d)+"px"),this.styleBox&&this.table||(this.table=this.getElement("table"))){var h,l;h=h||parseInt(baidu.dom(this.table.rows[0]).getCurrentStyle("height")),l=l||parseInt(baidu.dom(this.table.rows[2]).getCurrentStyle("height")),this.table.rows[0].style.height=h+"px",this.table.rows[2].style.height=l+"px",this.table.rows[1].style.height=this.layer.offsetHeight-h-l+"px"}}}}}),magic.Dialog=baidu.lang.createClass(function(){},{type:"magic.Dialog",superClass:magic.control.Dialog}),magic.Dialog.extend({render:function(t){"string"===baidu.type(t)&&(t="#"+t),t=baidu(t)[0],t||document.body.appendChild(t=document.createElement("div"));var e=magic.Dialog.template.join(""),i=this._options;baidu(t).addClass(i.className||"tang-pass-pop-login"),baidu(t).insertHTML("beforeEnd",baidu.string.format(e,{content:"",titleId:this.$getId("title"),bodyId:this.$getId("body"),contentId:this.$getId("content"),foregroundId:this.$getId("foreground"),footerId:this.$getId("footer"),footerContainerId:this.$getId("footerContainer")})),this._background=new magic.Background({coverable:!0}),this._background.render(t),this.$mappingDom("",t),this._renderHeader(),this._titleHeight=this.getElement("title").offsetHeight||30,baidu(this.getElement("footer")).hide(),this.fire("footer"),this.setSize(i),this.setPosition(i),i.content&&this.setContent(i.content,i.contentType),this.fire("load"),this.show(),this.disposeProcess.push(function(){baidu(this.getElement("closeBtn")).off("click",this._closeBtnFn),this._background.$dispose(),t.innerHTML="",baidu(t).removeClass("tang-ui tang-dialog")})},_renderHeader:function(){var t=["<div class='buttons' id='",this.$getId("titleButtons"),"'>","<a id='",this.$getId("closeBtn"),"' class='close-btn' href='###' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a>","</div>","<span id='",this.$getId("titleText"),"'>",baidu.string.encodeHTML(this._options.titleText||"")||"&nbsp;","</span>"];baidu(this.getElement("title")).insertHTML("beforeEnd",t.join("")),baidu(this.getElement("closeBtn")).on("click",this._closeBtnFn=baidu.fn.bind(this.hide,this))}}),magic.Dialog.template=["<div class='tang-foreground' id='#{foregroundId}'>","<div class='tang-title' id='#{titleId}'>","</div>","<div class='tang-body' id='#{bodyId}'>","<div class='tang-content' id='#{contentId}'>#{content}</div>","</div>","<div class='tang-footer' id='#{footerId}'>","<div id='#{footerContainerId}'></div>","</div>","</div>"],baidu.lang.register(magic.control.Dialog,function(t){t&&t.buttons&&t.buttons.enable&&this.on("footer",function(){this.buttons=null,baidu(this.getElement("footer")).show(),this._createButton(t.buttons),baidu(this.getElement("footerContainer")).addClass("tang-footerContainer");var e=this.getElement("footer").offsetHeight;(!this.buttons||0==this.buttons.length)&&(e=30)&&baidu(this.getElement("footer")).css("height",30),this._footerHeight=e})},{_createButton:function(){var t=this,e=arguments.length>0?arguments[0]:{},i=baidu(t.getElement("footerContainer")),o=t.buttons||(t.buttons=[]),s=!1,n=function(){var t=['<a href="#" onClick="return false;" class="tang-dialog-button ',"",'">','<span class="tang-dialog-button-s">','<span class="tang-dialog-button-s-space">&nbsp;</span>','<span class="tang-dialog-button-s-text">',"","</span>","</span>","</a>"];return function(e,i){return t[1]=e.disabled?"tang-dialog-button-disabled":"",t[6]=e.text||"&nbsp;",baidu(i).insertHTML("beforeEnd",t.join("")),baidu(i).children().get(0)}}();baidu.forEach(e.items||[],function(e,a){var r,d;i.append(d=baidu('<span class="tang-dialog-button-carrier"></span>')[0]),d="object"==typeof e?(e.builder||n).call(this,e,d,t,a):e,!s&&e.focused&&!e.disabled&&(s=!0)&&d.focus(),o.push(d),e.disabled||e.click&&baidu(d).on("click",r=function(){e.click.call(this,t)}),r&&this.disposeProcess.push(function(){baidu(d).off("click",r)})},t),i.addClass("tang-button-"+(e.align||"right"))}}),magic.Mask=function(t){function e(){if(s.container==document.body){var t=s.getElement().style;t.display="none",s.setSize([baidu.page.getViewWidth(),baidu.page.getViewHeight()]),t.display=""}}function i(){if(s.container==document.body){var t=s.getElement().style;t.display="none",t.top=baidu.page.getScrollTop()+"px",t.left=baidu.page.getScrollLeft()+"px",t.display=""}}function o(t){for(var e,i=document.getElementsByTagName("object"),o=t?"visible":"hidden",s=0,n=i.length;n>s;s++)e=i[s],e.style.visibility=o}var s=this;magic.control.Layer.call(this),s.zIndex=999,s.opacity=.3,s.bgColor="#000000",s.coverable=!1,s.container=document.body,baidu.object.extend(s,t||{});var n=baidu.browser.safari,a=baidu.browser.ie;baidu.dom(s.container).insertHTML("afterBegin",s.toHTMLString()),6==a&&(s.getElement().style.position="absolute"),s.on("show",function(){e(),6==a&&i(),baidu.dom(window).on("resize",e),6==a&&baidu.dom(window).on("scroll",i);var t=s.getElement().style;t.opacity=s.opacity,t.zIndex=s.zIndex,t.filter="alpha(opacity="+100*s.opacity+")",t.backgroundColor=s.bgColor,n&&o(!1)}),s.on("hide",function(){baidu.dom(window).off("resize",e),6==a&&baidu.dom(window).off("scroll",i),n&&o(!0)})},baidu.lang.inherits(magic.Mask,magic.control.Layer,"http://passport.baidu.com/passApi/js/magic.Mask").extend({toHTMLString:function(){return"<div id='"+this.$getId()+"' class='pop-mask' style='top:0px; left:0px; position:fixed; display:none;'>"+("<iframe frameborder='0' style='filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1' src='"+("https:"==(window.location?window.location.protocol.toLowerCase():document.location.protocol.toLowerCase())?"https://passport.baidu.com/passApi/html/_blank.html":"about:blank")+"'></iframe><div style='position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;'>&nbsp;</div>")+"</div>"}}),baidu.lang.register(magic.control.Dialog,function(t){t&&t.mask&&t.mask.enable&&(this.renderMask(),this.on("load",function(){this._options.left||this.center()}),this.on("show",function(){this.showMask()}),this.on("hide",function(){this.hideMask()}))},{renderMask:function(){if(this._mask)return this;var t=this._options.mask;this._mask=new magic.Mask({opacity:t.opacity||.15,bgColor:t.bgColor||"#000",zIndex:this.zIndex-1});var e=this;return this.disposeProcess.push(function(){baidu(e._mask.getElement()).remove()}),this},showMask:function(){return this._mask.show(),this},hideMask:function(){return this._mask.hide(),this}});;
    /* 用于动态加载 rebindGuidewidget 实现 */;
passport.pop = passport.pop || {};


passport.pop.rebindGuideImp = function(options, callback){
    var domains = {
        "http:": "http://passport.baidu.com/",
        "https:": "https://passport.baidu.com"
    };

    /**
        @基础方法封装 start
    */
    var Base = {};
    var Request = {};

    var W = window;
    var D = W.document;
    var B = D.body;
    var E = D.documentElement;

    var voidFunc = function() {
    };
    function Promise(initCallback) {
        this._requests = [];
        this._value = null;
        this._exception = null;
        this._isComplete = false;
        var self = this;
        initCallback(
                function(value) {
                    self._fulfillPromise(value);
                },
                function(value) {
                    self._breakPromise(value);
                });
    }
    Promise.prototype = {
        get_isComplete: function() {
            return this._isComplete;
        },
        get_value: function() {
            if (!this._isComplete) {
                return undefined;
            }
            if (this._exception) {
                throw this._exception;
            }
            return this._value;
        },
        call: function(name, params) {
            var args = [];
            for (var i = 0, l = arguments.length - 1; i < l; i++) {
                args[i] = arguments[i + 1];
            }
            return this.when(function(v) {
                return v[name].apply(v, args);
            });
        },
        getValue: function(name) {
            return this.when(function(v) {
                return v[name];
            });
        },
        setValue: function(name, value) {
            this.whenOnly(function(v) {
                v[name] = value;
            });
        },
        when: function(fulfillPromise, breakPromise, context) {
            return Promise.when(this, fulfillPromise, breakPromise, context);
        },
        whenOnly: function(fulfillPromise, breakPromise, context) {
            Promise.whenOnly(this, fulfillPromise, breakPromise, context);
        },
        success: function(fulfillPromise, context) {
            return this.when(fulfillPromise, voidFunc, context);
        },
        fail: function(breakPromise, context) {
            return this.when(voidFunc, breakPromise, context);
        },
        _enqueueOne: function(op) {
            if (this._isComplete) {
                this._notify(op);
            } else {
                this._requests.push(op);
            }

        },
        _notify: function(op) {
            if (this._exception) {
                if (op.breakPromise) {
                    op.breakPromise(this._exception);
                }
            } else {
                if (op.fulfillPromise) {
                    op.fulfillPromise(this._value);
                }
            }

        },
        _notifyAll: function() {
            for (var i = 0, l = this._requests.length; i < l; i++) {
                this._notify(this._requests[i]);
            }

        },
        _fulfillPromise: function(value) {
            this._value = value;
            this._exception = null;
            this._isComplete = true;
            this._notifyAll();
        },
        _breakPromise: function(exception) {
            this._value = null;
            this._exception = exception || new Error("An error occured");
            this._isComplete = true;
            this._notifyAll();
        }
    };
    Promise.when = function(promise, fulfillPromise, breakPromise, context) {
        return new Promise(function(fp, bp) {
            Promise.make(promise)._enqueueOne({
                fulfillPromise: function(value) {
                    if (fulfillPromise) {
                        fp(fulfillPromise.call(context, value));
                    } else {
                        fp(value);
                    }
                },
                breakPromise: function(exception) {
                    if (breakPromise) {
                        try {
                            fp(breakPromise.call(context, exception));
                        } catch (e) {
                            bp(e);
                        }
                    } else {
                        bp(exception);
                    }
                }
            });
        });
    };
    Promise.whenOnly = function(promise, fulfillPromise, breakPromise, context) {
        Promise.make(promise)._enqueueOne({
            fulfillPromise: function(value) {
                if (fulfillPromise)
                    fulfillPromise.call(context, value);
            },
            breakPromise: function(exception) {
                if (breakPromise)
                    breakPromise.call(context, exception);
            }
        });
    };
    Promise.make = function(value) {
        if (value instanceof Promise) {
            return value;
        }
        return Promise.immediate(value);
    };
    Promise.immediate = function(value) {
        return new Promise(function(fulfillPromise, breakPromise) {
            fulfillPromise(value);
        });
    };
    (function(Base) {
        Base.browser = Base.browser || {};
        Base.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || +RegExp['\x241']) : undefined;
        Base.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ? +(RegExp["\x246"] || RegExp["\x242"]) : undefined;
        Base.g = function(id) {
            if (!id)
                return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
            if ('string' === typeof id || id instanceof String) {
                return D.getElementById(id);
            } else if (id.nodeName && (id.nodeType === 1 || id.nodeType === 9)) {
                return id;
            }
            return null;
        };
        Base.id = function() {
            if (baidu && baidu.guid) {

            } else if (baidu) {
                baidu.guid = "$BAIDU$";
            } else {
                var baidu = {};
                baidu.guid = "$BAIDU$";
            }
            window[baidu.guid] = window[baidu.guid] || {};
            window[baidu.guid]._counter = window[baidu.guid]._counter || '1';
            return 'TANGRAM__' + window[baidu.guid]._counter++;
        };
        Base.on = function(ele, type, func) {
            if (ele && ele.addEventListener) {
                ele.addEventListener(type, func, false);
            } else if (ele && ele.attachEvent) {
                ele.attachEvent("on" + type, func);
            }
        };
        Base.unon = function(ele, type, func) {
            if (ele.removeEventListener) {
                ele.removeEventListener(type, func, false);
            } else if (ele.detachEvent) {
                ele.detachEvent("on" + type, func);
            }
        };
        Base.getUniqueId = function(prefix) {
            return prefix + Math.floor(Math.random() * 2147483648).toString(36);
        };
        Base.createScriptTag = function(a, b, c) {
            a.setAttribute('type', 'text/javascript');
            c && a.setAttribute('charset', c);
            a.setAttribute('src', b);
            D.getElementsByTagName('head')[0].appendChild(a);
        };
        Base.removeScriptTag = function(a) {
            if (a.clearAttributes) {
                a.clearAttributes();
            } else {
                for (var b in a) {
                    if (a.hasOwnProperty(b) && 'parentNode' !== b) {
                        delete a[b];
                    }
                }
            }
            if (a && a.parentNode) {
                a.parentNode.removeChild(a);
            }
            a = null;
        };
        Base.getSize = function(ele) {
            if (ele) {
                return {
                    w: (ele.clientWidth),
                    h: (ele.innerHeight || ele.clientHeight)
                };
            } else {
                return {
                    w: (E.clientWidth || B.clientWidth),
                    h: (W.innerHeight || E.clientHeight || B.clientHeight)
                };
            }
        };
        Base.getViewHeight = function() {
            var i = document,
                    j = Base.browser.ie || 1,
                    h = i.compatMode === "BackCompat" && j < 9 ? i.body : i.documentElement;
            return h.clientHeight;
        };
        Base.getViewWidth = function() {
            var i = document,
                    h = i.compatMode === "BackCompat" ? i.body : i.documentElement;
            return h.clientWidth;
        };
        Base.getScrollTop = function() {
            var d = document;
            return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
        };
        Base.getPosition = function(a) {
            var s = Base.getSize(),
                    o = a,
                    pos = {
                        t: 0,
                        l: 0
                    },
            gecko = /gecko/.test(navigator.userAgent),
                    posAdd = function(t, l) {
                        pos.t += t;
                                pos.l += l;
                    };
            if (o && o !== B) {
                if (o.getBoundingClientRect) {
                    var b = o.getBoundingClientRect(),
                            doc = a.ownerDocument,
                            body = doc.body,
                            html = doc.documentElement,
                            clientTop = html.clientTop || body.clientTop || 0,
                            clientLeft = html.clientLeft || body.clientLeft || 0;
                    if (b.top === b.bottom) {
                        var g = o.style.display;
                        o.style.display = "block";
                        o.style.display = g;
                    }
                    posAdd(b.top + s.t - clientTop, b.left + s.l - clientLeft);
                } else {
                    var c = D.View;
                    while (o) {
                        posAdd(o.offsetTop, o.offsetLeft);
                        var e = c.getComputedStyle(o, null);
                        if (gecko) {
                            var f = parseInt(e.getPropertyValue("border-left-width"), 10) || 0,
                                    bs = parseInt(e.getPropertyValue("border-top-width"), 10) || 0;
                            posAdd(bs, f);
                            if (o !== a && e.getPropertyValue("overflow") !== "visible") {
                                posAdd(bs, f);
                            }
                        }
                        o = o.offsetParent;
                    }
                    o = a.parentNode;
                    while (o && o !== B) {
                        posAdd(-o.scrollTop, -o.scrollLeft);
                        o = o.parentNode;
                    }
                }
            }
            return pos;
        };
        Base.setStyle = function(a, b) {
            var s = b.split(';'),
                    sl = s.length;
            while (sl--) {
                if (s[sl]) {
                    var p = s[sl].split(':');
                    if (p)
                        a.style[p[0]] = p[1];
                }
            }
        };
        Base.getMousePos = function(ev) {
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            }
            if (document.documentElement && document.documentElement.scrollTop) {
                return {
                    x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                    y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
                };
            }
            else if (document.body) {
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            }
        };
        Base.getTarget = function(evt) {
            return evt.target || evt.srcElement;
        };
        Base.addClass = function(ele, className) {
            element = Base.g(ele);
            var classArray = className.split(/\s+/),
                    result = element.className,
                    classMatch = " " + result + " ",
                    i = 0,
                    l = classArray.length;
            for (; i < l; i++) {
                if (classMatch.indexOf(" " + classArray[i] + " ") < 0) {
                    result += (result ? ' ' : '') + classArray[i];
                }
            }

            element.className = result;
            return element;
        };
        Base.removeClass = function(element, className) {
            element = Base.g(element);
            if (element) {
                var oldClasses = element.className.split(/\s+/),
                        newClasses = className.split(/\s+/),
                        lenOld,
                        lenDel = newClasses.length,
                        j,
                        i = 0;
                //考虑到同时删除多个className的应用场景概率较低,故放弃进一步性能优化 
                // by rocy @1.3.4
                for (; i < lenDel; ++i) {
                    for (j = 0, lenOld = oldClasses.length; j < lenOld; ++j) {
                        if (oldClasses[j] === newClasses[i]) {
                            oldClasses.splice(j, 1);
                            break;
                        }
                    }
                }
                element.className = oldClasses.join(' ');
                return element;
            }
        };
        Base.insertHTML = function(element, position, html) {
            element = Base.g(element);
            var range, begin;
            //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
            //by lixiaopeng @ 2011-8-19
            if (element.insertAdjacentHTML && !Base.browser.opera) {
                element.insertAdjacentHTML(position, html);
            } else {
                // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
                // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
                range = element.ownerDocument.createRange();
                // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
                // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
                position = position.toUpperCase();
                if (position === 'AFTERBEGIN' || position === 'BEFOREEND') {
                    range.selectNodeContents(element);
                    range.collapse(position === 'AFTERBEGIN');
                } else {
                    begin = position === 'BEFOREBEGIN';
                    range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                    range.collapse(begin);
                }
                range.insertNode(range.createContextualFragment(html));
            }
            return element;
        };
    })(Base);
    (function(Request) {
        var _postContainer = "__bdpp_pstc__" + new Date().getTime(),
                _postForm = _postContainer + "_form",
                _postTarget = _postContainer + "_ifr";
        var _buildQuery = function(query) {
            if (typeof (query) === "object") {
                var builder = [];
                for (var p in query) {
                    var value = query[p];
                    if (value !== undefined && value !== null) {
                        if (builder.length)
                            builder.push("&");
                        var valueString = encodeURIComponent(typeof (value) === "boolean" ? (value ? "1" : "0") : value.toString());
                        builder.push(encodeURIComponent(p), "=", valueString);
                    }
                }
                return builder.join("");
            }
            if (typeof (query) === "string") {
                return query;
            }
            return null;
        };
        var _appendQuery = function(url, query) {
            query = _buildQuery(query);
            if (typeof (query) === "string") {
                var hasQuery = (/\?/g).test(url);
                url += (hasQuery ? "&" : "?") + _buildQuery(query);
            }
            return url;
        };
        var _createScriptTag = function(scr, url, charset) {
            scr.setAttribute('type', 'text/javascript');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        };
        var _removeScriptTag = function(scr) {
            if (scr.clearAttributes) {
                scr.clearAttributes();
            } else {
                for (var attr in scr) {
                    if (scr.hasOwnProperty(attr)) {
                        delete scr[attr];
                    }
                }
            }
            if (scr && scr.parentNode) {
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        };
        var _callByServer = function(url, callback, opt_options) {
            var scr = document.createElement('SCRIPT'),
                    prefix = 'bd__cbs__',
                    callbackName,
                    callbackImpl,
                    options = opt_options || {},
                    charset = options['charset'],
                    queryField = options['queryField'] || 'callback',
                    timeOut = options['timeOut'] || 0,
                    timer,
                    reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
                    matches;
            callbackName = Base.getUniqueId(prefix);
            window[callbackName] = getCallBack(0);
            if (timeOut) {
                timer = setTimeout(getCallBack(1), timeOut);
            }

            //如果用户在URL中已有callback，用参数传入的callback替换之
            url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
            if (url.search(reg) < 0) {
                url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
            }
            _createScriptTag(scr, url, charset);
            /*
             * 返回一个函数，用于立即（挂在window上）或者超时（挂在setTimeout中）时执行
             */
            function getCallBack(onTimeOut) {
                /*global callbackName, callback, scr, options;*/
                return function() {
                    try {
                        if (onTimeOut) {
                            options.onfailure && options.onfailure();
                        } else {
                            callback.apply(window, arguments);
                            clearTimeout(timer);
                        }
                        window[callbackName] = null;
                        delete window[callbackName];
                    } catch (exception) {
                        // ignore the exception
                    } finally {
                        _removeScriptTag(scr);
                    }
                };
            }
        };
        var _renderDataForm = function(url, segments) {
            var builder = [];
            builder.push("<form id='", _postForm, "' target='", _postTarget, "' ");
            builder.push("action='", Base.encodeHTML(url), "' method='post'>");
            for (var p in segments) {
                if (segments.hasOwnProperty(p)) {
                    var value = segments[p];
                    if (value !== undefined && value !== null) {
                        var valueString = Base.encodeHTML(typeof (value) === "boolean" ? (value ? "1" : "0") : value);
                        builder.push("<input type='hidden' name='", Base.encodeHTML(p), "' value='", valueString, "' />");
                    }
                }
            }
            builder.push("</form>");
            return builder.join("");
        };
        var _postInIframe = function(url, data, callback, options) {
            options = options || {};
            var timeOut = options['timeOut'] || 0,
                    timer = false,
                    callbackName = Base.getUniqueId("bd__pcbs__");
            data[options["queryField"] || "callback"] = "parent." + callbackName;
            var formHtml = _renderDataForm(url, data);
            if (Base.g(_postForm)) {
                Base.getParent(_postForm).innerHTML = formHtml;
            } else {
                var htmlBuilder = [];
                htmlBuilder.push("<div id='", _postContainer, "' style='display:none;'>");
                htmlBuilder.push("<div>", formHtml, "</div>");
                htmlBuilder.push("<iframe name='", _postTarget, "' src='" + (window.location.protocol.toLowerCase() === "https:" ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank") + "' style='display:none;'></iframe>");
                htmlBuilder.push("</div>");
                Base.insertHTML(document.body, "beforeEnd", htmlBuilder.join(""));
            }
            window[callbackName] = getCallBack();
            if (timeOut) {
                timer = setTimeout(getCallBack(1), timeOut);
            }
            function getCallBack(onTimeOut) {
                /*global callbackName, callback, scr, options;*/
                return function() {
                    try {
                        if (onTimeOut) {
                            options.onfailure && options.onfailure();
                        } else {
                            callback.apply(window, arguments);
                            timer && clearTimeout(timer);
                        }
                        window[callbackName] = null;
                        delete window[callbackName];
                    } catch (exception) {
                        // ignore the exception
                    }
                };
            }

            Base.g(_postForm).submit();
        };
        /**
         * jsonp请求
         * @param {String} url 请求url
         * @param {Object} query 请求参数，键值对
         * @param {Object} options 选项
         *                      charset : {String} 编码
         *                      queryField : {String} 回调函数参数名称，默认：callback
         *                      timeOut : {Number} 请求超时时间，单位ms
         *                      processData : {Function} 返回数据处理函数
         * @returns {Promise} 
         */
        Request.jsonp = function(url, query, options) {
            options = options || {};
            var originUrl = url;
            return new Promise(
                    function(fulfillPromise, breakProimise) {
                        url = _appendQuery(url, query);
                        _callByServer(url, function(jsonResult) {
                            if (options.processData) {
                                jsonResult = options.processData(jsonResult);
                            }
                            fulfillPromise && fulfillPromise(jsonResult);
                        }, {
                            charset: options.charset,
                            queryField: options.queryField,
                            timeOut: options.timeOut,
                            onfailure: function() {
                                breakProimise && breakProimise();
                            }
                        });
                    }
            );
        };
        /**
         * 提交请求
         * @param {String} url 请求url
         * @param {Object} data 提交的数据，键值对
         * @param {Object} options 选项
         *                      charset : {String} 编码
         *                      queryField : {String} 回调函数参数名称，默认：callback
         *                      timeOut : {Number} 请求超时时间，单位ms
         *                      processData : {Function} 返回数据处理函数
         * @returns {Promise} 
         */
        Request.submit = function(url, data, options) {
            if (url && data) {
                return new Promise(
                        function(fulfillPromise, breakProimise) {
                            _postInIframe(url, data, function(jsonResult) {
                                if (options.processData) {
                                    jsonResult = options.processData(jsonResult);
                                }
                                fulfillPromise && fulfillPromise(jsonResult);
                            }, options);
                        }
                );
            }
        };
        var _loadImgList = [];
        Request.load = function(src) {
            return new Promise(
                    function(fulfillPromise, breakProimise) {
                        var index = _loadImgList.push(new Image) - 1,
                                done = false,
                                timer = setTimeout(function() {
                                    done = true;
                                    fulfillPromise && fulfillPromise();
                                }, 1000);
                        _loadImgList[index].onload = function() {
                            clearTimeout(timer);
                            if (!done) {
                                fulfillPromise && fulfillPromise();
                            }
                            done = true;
                            _loadImgList[index] = _loadImgList[index].onload = null;
                        };
                        _loadImgList[index].src = src;
                    }
            );
        };
    })(Request);
    /**
        @基础方法封装 end
    */

    var createElement = function(id, notAppend){
        var el = document.createElement('div');
        el.id = id;
        return notAppend ? el : document.body.appendChild(el);
    };
    
    var instance = {},
        rebindGuidegetId = baidu.id(),
        opts = options,
    container = {
        main: createElement('passport-rebindGuide-pop'),
        dialog: createElement('passport-rebindGuide-pop-dialog')
    };

    var rebindGuidegetElement = function(field){
        return baidu('#'+rebindGuidegetId + '__' + field);
    }

    var getTpl = function(){
        var dialogHtml= [],bindPhoneNumber=opts.apiOpt.phoneNumber;
        var domain = domains[(window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase())];
        var smsRebindMobile = domain + '/v2/accountsecurity?act=rebindmobile';
        var appealLink = domain + '/?getpassappeal&code=' + opts.apiOpt.code + '&bdToken=' + opts.apiOpt.bdToken;
        dialogHtml.push('<div class="clearfix">');
        dialogHtml.push('<div class="pass-rebindGuide-pop-content">');
        dialogHtml.push('<div class="pass-rebindGuide-pop-first" id="'+rebindGuidegetId+'__rebindGuideFirst">');
        dialogHtml.push('<p class="pass-rebindGuide-pop-tiptitle">'+bindPhoneNumber+' 是否仍是您的手机？</p>');
        dialogHtml.push('<p class="pass-rebindGuide-pop-tipmsg">手机用来进行找回密码，验证帐号安全，如果已换号请改绑新号码</p>');
        dialogHtml.push('<div class="pass-rebindGuide-pop-btn">');
        dialogHtml.push('<input id="'+rebindGuidegetId+'__rebindGuideCancel" type="button" value="没换号" class="pass-rebindGuide-button" />');
        dialogHtml.push('<input id="'+rebindGuidegetId+'__rebindGuideRebind" type="button" value="换号了" class="pass-rebindGuide-button" />');
        dialogHtml.push('</div>');
        dialogHtml.push('</div>');
        dialogHtml.push('<div class="pass-rebindGuide-pop-second" id="'+rebindGuidegetId+'__rebindGuideSecond" style="display:none;">');
        dialogHtml.push('<p class="pass-rebindGuide-pop-tiptitle">'+bindPhoneNumber+' 是否能收到验证短信？</p>');
        dialogHtml.push('<div class="pass-rebindGuide-pop-btn">');
        dialogHtml.push('<label class="pass-rebindGuide-label">可以收到短信</label>');
        dialogHtml.push('<a href="'+smsRebindMobile+'" target="_blank" id="'+rebindGuidegetId+'__rebindGuideSmsrebind" class="pass-rebindGuide-button">通过短信验证改绑手机</a>');
        dialogHtml.push('</div>');
        dialogHtml.push('<div class="pass-rebindGuide-pop-btn">');
        dialogHtml.push('<label class="pass-rebindGuide-label">不能收到短信</label>');        
        dialogHtml.push('<a href="'+appealLink+'" target="_blank" id="'+rebindGuidegetId+'__rebindGuideAppeal" class="pass-rebindGuide-button">通过帐号申诉改绑手机</a>');
        dialogHtml.push('</div>');
        dialogHtml.push('</div>');
        dialogHtml.push('<div class="pass-rebindGuide-pop-footer footer-bottom"></div>');
        dialogHtml.push('</div>');
        dialogHtml.push('</div>');
        return dialogHtml.join('');
    };

    var setupComponents = {
        template: function(){
            baidu(container.main).addClass('pass-rebindGuide-'+opts.color);
            container.dialog.innerHTML = getTpl();
        },
        dialog: function(){
            instance['dialog'] = new magic.Dialog({
                draggable: true,
                titleText: "",
                className :  "tang-pass-pop-rebindGuide",
                content: container['dialog'],
                contentType: 'element',
                width: opts.width || 393,
                height: opts.height || 272,
                mask: {
                    enable: true
                }
            });
            instance['dialog'].render(container['main']);
            instance['dialog']._center = function(){
                instance['dialog'].center();
                instance['dialog'].setPosition({
                    top: (baidu(window).height() - baidu(instance['dialog'].getElement()).height()) / 2 + baidu(window).scrollTop()
                });
            };
            instance['dialog'].show();
            baidu(window).on('resize',function(){
                instance['dialog']._center();
            });
            instance['dialog']._center();
        },
        init:function(){
            this.template();
            this.dialog();
        }
        
    };
    function attachMethod(){
        var dialog = instance['dialog'],
        var domain = domains[(window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase())];
        var bindvalidLink = domain + '/v2/?bindvalid';
        var rebindType = opts.rebindType == 'rebindPhone' ? 1 : 2;
       
        var hideDialog = function(){
            dialog.hide();
            rebindGuidegetElement('rebindGuideSecond').hide();
            rebindGuidegetElement('rebindGuideFirst').show();
        }

        document.getElementById(dialog['guid']+'__closeBtn').onclick = function(event){
            hideDialog();
            Request.jsonp(bindvalidLink,{
                'type':rebindType,
                'status':3,  //点击关闭浮层
                'bdToken':opts.apiOpt.bdToken
            },{});
            opts.onrebindGuideCompleted && opts.onrebindGuideCompleted();
            event.stopPropagation && event.stopPropagation(); 
            event.cancelBubble = true; 
            return false;
        }
        document.getElementById(rebindGuidegetId+'__rebindGuideCancel').onclick = function(){
            hideDialog();
            Request.jsonp(bindvalidLink,{
                'type':rebindType,
                'status':1,  //点击手机没有换
                'bdToken':opts.apiOpt.bdToken
            },{});
            opts.onrebindGuideCompleted && opts.onrebindGuideCompleted();
        };
        document.getElementById(rebindGuidegetId+'__rebindGuideRebind').onclick = function(){
            rebindGuidegetElement('rebindGuideFirst').hide();
            rebindGuidegetElement('rebindGuideSecond').show();
            Request.jsonp(bindvalidLink,{
                'type':rebindType,
                'status':2, //点击改绑手机
                'bdToken':opts.apiOpt.bdToken
            },{});
        };
        document.getElementById(rebindGuidegetId+'__rebindGuideSmsrebind').onclick = function(){
            hideDialog();
            opts.onrebindGuideCompleted && opts.onrebindGuideCompleted();
        };
        document.getElementById(rebindGuidegetId+'__rebindGuideAppeal').onclick = function(){
            hideDialog();
            opts.onrebindGuideCompleted && opts.onrebindGuideCompleted();
        };
    }
    var isInit = false;
    function init(){
        setupComponents.init();
        attachMethod();
        isInit = true;
        
    }
    callback && callback();
    return {
        show : function(){
            if(isInit){
                instance['dialog'].show();
            }else{
                setTimeout(function(){
                    init();
                    instance['dialog'].show();
                },200);
            }
            
        }
    }
};


/**
 *  引导换绑
 *  
 * @param map options
 *                                     filepath: passApi/css/uni_rebindGuide.css
 *                                     css文件名称固定为 uni_rebindGuide.css
 *                       
 * @returns passport.pop.rebindGuideWidget
 */
if (!passport.pop.rebindGuideWidget) {

    passport.pop.rebindGuideWidget = function(options) {
        if (window.passport_pop_rebindGuideWidget_instance) {
            return widget;
        }
        window.passport_pop_rebindGuideWidget_instance = true;

        var domain = {
            "http:": "http://passport.baidu.com/",
            "https:": "https://passport.baidu.com"
        }[window.location.protocol.toLowerCase()];

        var rebindImp = new passport.pop.rebindGuideImp(options);

        var options = options || {};
        var cssDir = options.cssDir || [domain, "/passApi/css"].join("");
        var css = [cssDir, "/uni_rebindGuide.css?cdnversion=" + new Date().getTime()].join("");

        var widget = {
            show: function() {
                rebindImp.show();
            },
            loadStyle: function() {
                var link = document.createElement("link");
                link.rel = "stylesheet";
                link.type = "text/css";
                link.href = css;
                link.disabled = false;
                link.setAttribute('data-for','result');
                document.getElementsByTagName("head")[0].appendChild(link);
                delete widget.loadStyle;
            }
            
           
        };
        widget.loadStyle();
        return widget;
    };
}
;
    return true;
})
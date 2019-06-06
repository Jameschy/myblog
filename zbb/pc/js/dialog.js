var magic = null;//window.magic;
if(typeof magic != "function"){
    var magic = function(){
        // TODO: 
    };
}

magic.resourcePath = "";
magic.skinName = "default";
magic.version = "1.0.2.2";

/msie 6/i.test(navigator.userAgent) && 
document.execCommand("BackgroundImageCache", false, true);













magic.Base = function(){
    baidu.lang.Class.call(this);

    this._ids = {};
    this._eid = this.guid +"__";
};
baidu.lang.inherits(magic.Base, baidu.lang.Class, "http://passport.baidu.com/passApi/js/uni/magic.Base").extend(

{
    
    getElement : function(id) {
        return document.getElementById(this.$getId(id));
    },

    
    getElements: function(){
        var result = {};
        var _ids = this._ids;
        for(var key in _ids)
            result[key] = this.getElement(key);
        return result;
    },

    
    $getId : function(key) {
        key = baidu.lang.isString(key) ? key : "";
        // 2012-3-23: 使 _ids 存入所以可能被建立映射的 key
        return this._ids[key] || (this._ids[key] = this._eid + key);
    }

    
    ,$mappingDom : function(key, dom){
        if (baidu.lang.isString(dom)) {
            this._ids[key] = dom;
        } else if (dom && dom.nodeType) {
            dom.id ? this._ids[key] = dom.id : dom.id = this.$getId(key);
        }
        return this;
    }

    
    ,$dispose : function() {
        this.fire("ondispose") && baidu.lang.Class.prototype.dispose.call(this);
    }
});

//  20120110    meizz   简化eid去掉其中的__type部分；事件派发使用fire方法替换原来 dispatchEvent
//  20111129    meizz   实例化效率大比拼
//                      new ui.Base()           效率为 1
//                      new ui.control.Layer()  效率为 2
//                      new ui.Dialog()         效率为 3.5





magic.control = magic.control || {};











magic.control.Layer = baidu.lang.createClass(function(setting){
    this.width = "auto";
    this.height= "auto";

    baidu.object.extend(this, setting||{});
},{
    type : "magic.control.Layer"
    ,superClass : magic.Base
})
.extend(

{
    
    show : function(){
        if (this.fire("onbeforeshow")) {
            this.getElement().style.display = "";
            this.fire("onshow");
        }
    }
    
    ,hide :  function(){
        if (this.fire("onbeforehide")) {
            this.getElement().style.display = "none";
            this.fire("onhide");
        }
    }

    
    ,setWidth :  function(width) {
        baidu.dom.setPixel(this.getElement(), "width",(this.width=width));
    }
    
    
    ,setHeight :  function(height) {
        baidu.dom.setPixel(this.getElement(), "height",(this.height=height));
    }
    
     
    ,setSize : function(size){
        this.setWidth(size.width || size[0]);
        this.setHeight(size.height||size[1]);
    }
});















































magic.control.Dialog = baidu.lang.createClass(
     function(options){
        var me = this;
        options = baidu.object.extend({
            width: 400,
            height: 300,
            left: 0,
            top: 0,
            contentType: "html",
            draggable: true
        }, options || {});

        baidu.object.extend(me._options || (me._options = {}), options);

        me._footerHeight = 0;

        if(options.width < 100)
            options.width = 100;
        if(options.height < 100)
            options.height = 100;

        this.zIndex = 60001; //baidu.global.getZIndex("dialog", 5);
        
        this.disposeProcess = [];

        this.on("load", function(){
            var container = this.getElement();
            var me = this;
            var options = me._options;
            
            if(typeof options.left == "number" || typeof options.top == "number")
                this.setPosition(options);
            if(typeof options.width == "number" || typeof options.height == "number")
                this.setSize(this._options);

            this._isShown = true;
            this.focus();

            // 处理聚焦
            var focusFn = function(e){ me.focus(e); };
            
            
            // baidu(container).on("mousedown", focusFn);
            
            baidu(document).on("mousedown", focusFn);
            
            this.disposeProcess.unshift(function(){
                baidu(document).off("mousedown", focusFn);
            });

            // 定义拖拽事件
            if(options.draggable){
                var title = this.getElement("title");
                var dragFn;
                var bind = baidu.fn.bind;
                var me = this;
                var container_parent = container.parentNode;
                var parent_position = baidu(container_parent).position();
                title.className += " tang-title-dragable";

                var getRange = {
                    'top': function(){
                        var parent_border_top = baidu(container_parent).css("borderTopWidth");

                        if(!/px/.test(parent_border_top)){
                            parent_border_top = 0;
                        }else{
                            parent_border_top = parseInt(parent_border_top);
                        }

                        if(container_parent == document.body){
                            return 0 - parent_border_top;
                        }else{
                            return 0 - (parent_position.top + parent_border_top);
                        }
                    },
                    'right': function(){
                        //TODO 如果没有background层，会报错
                        var background_inner = baidu(".tang-background-inner", container)[0];
                        var background_inner_ml = baidu(background_inner).css("marginLeft") == "auto" ? background_inner.offsetLeft + "px" : baidu(background_inner).css("marginLeft");
                        return baidu.page.getWidth() + getRange['left']() - parseInt(background_inner_ml);
                    },
                    'bottom': function(){
                        var background_inner = baidu(".tang-background-inner", container)[0];
                        var background_inner_mt = baidu(background_inner).css("marginTop") == "auto" ? background_inner.offsetTop + "px" : baidu(background_inner).css("marginTop");
                        return baidu.page.getHeight() + getRange['top']() - parseInt(background_inner_mt);
                    },
                    'left': function(){
                        var parent_border_left = baidu(container_parent).css("borderLeftWidth");

                        if(!/px/.test(parent_border_left)){
                            parent_border_left = 0;
                        }else{
                            parent_border_left = parseInt(parent_border_left);
                        }

                        if(container_parent == document.body){
                            return 0 - parent_border_left;
                        }else{
                            return 0 - (parent_position.top + parent_border_left);
                        }
                    }
                };

                baidu(title).on("mousedown", dragFn = bind(function(evt){
                    evt.preventDefault();
                    baidu.dom.drag(container, {
                        ondragstart: bind(function(){ this.fire("dragstart"); }, this),
                        ondrag: bind(function(){ this.fire("drag"); }, this),
                        ondragend: bind(function(){ this.fire("dragstop"); }, this),
                        range: [
                            getRange['top'](),
                            getRange['right'](),
                            getRange['bottom'](),
                            getRange['left']()
                        ]
                        
                    });
                }, this));
                this.disposeProcess.unshift(function(){
                    baidu(title).off("mousedown", dragFn);
                });
            }
        });

        this.on("resize", function(event, pos){
           var titleText = this.getElement("titleText");
           var buttons = this.getElement("titleButtons");
           //if(typeof pos.width == "number")
                //baidu(titleText).css("width", Math.max(0, pos.width - buttons.clientWidth - 20) + "px");   
        });
    }, 

     { 
        type: "magic.control.Dialog",
        superClass: magic.Base
    });

magic.control.Dialog.extend(

{
    

    
    isShowing: function(){
        return this._isShown;
    },

    
    show: function(){
        if(this.fire("beforeshow") === false)
            return this;
        this.getElement().style.display = "";
        this._isShown = true;

         
        this.fire("show");
    },

    
    hide: function(type){
        
        if(this.fire("beforehide") === false)
            return this;
        this._isShown = false;
        this.getElement().style.display = "none";
        if(type == 'unHide'){//并不是所有的隐藏该窗口就会派发所有的hide事件 
            this.hideMask();
            return this;
        }
        this.fire("hide");
    },
    
    setTitleText: function(title){
        var titleText = this.getElement("titleText");
          titleText.innerHTML = baidu.string.encodeHTML(title) || "&nbsp;";
          return this;
    },

    
    setContent: function(content, contentType){
        var contentEl = this.getElement("content");

        var lastDom, target, parent;
        lastDom = this._lastDom
        if (lastDom) {
           parent = lastDom.parent;
           if(lastDom.content === content)
               return this;
           if(lastDom.target){ // 原还位置
               parent.insertBefore(lastDom.content, lastDom.target);
           }else{
               parent.appendChild(lastDom.content);
           }
           this._lastDom = null;
        }

        switch(contentType){
            case "text":
                contentEl.innerHTML = baidu.string.encodeHTML(content);
                baidu(contentEl).removeClass("contentFrame");
                break;
            case "element":
                parent = content.parentNode
                if (parent) { // 做标记
                    parent.insertBefore(target = document.createTextNode(""), content);
                    this._lastDom = { content: content, parent: content.parentNode, target: target };                    
                }
                contentEl.innerHTML = "";
                contentEl.appendChild(content);         
                break;            
            case "frame":
                baidu(contentEl).css("height", baidu(this.getElement('body')).css('height'));
                contentEl.innerHTML = "<iframe frameborder='no' src='" + content + "'></iframe>";
                baidu(contentEl).hasClass("contentFrame") || 
                    baidu(contentEl).addClass("contentFrame");        
                break;
            default:
                contentEl.innerHTML = content;
                baidu(contentEl).removeClass("contentFrame");
                break;
        }

        return this;
    },

    
    focus: function(e){
        var  focusedMap = baidu.global.get("dialogFocused").map,
             idty = this.$getId() + "focus",
             updateStatus = function(){
                for(var attr in focusedMap){
                    attr != idty && (focusedMap[attr] = false);
                }
             };
        focusedMap || (baidu.global.get("dialogFocused").map = focusedMap = {});
        if(arguments.length){
            var target = e.target;
            if(baidu(target).closest(this.getElement()).size() > 0){
                baidu(this.getElement()).css("zIndex", 
                    this.zIndex = 60001); // baidu.global.getZIndex("dialog", 5));
                if(focusedMap[idty] != true){
                    this.fire("focus");
                    updateStatus();
                    focusedMap[idty] = true;
                }
            }else{
                focusedMap[idty] = false;
            }
        }else{
            baidu(this.getElement()).css("zIndex", 
                    this.zIndex = 60001);// baidu.global.getZIndex("dialog", 5));
            focusedMap[idty] = true;
            updateStatus();
            this.fire("focus");
        }
        
        
        
        
        
    },

    
    setSize: function(size){
        var foreground = this.getElement("foreground");
        if(typeof size.width == "number")
            baidu(foreground).css("width", (this._options.width = size.width) + "px");
        if(typeof size.height == "number"){
            baidu(foreground).css("height", (this._options.height = size.height) + "px");
            var height = Math.max(0, this._options.height - this._titleHeight - this._footerHeight) + "px";
            baidu(this.getElement("body")).css("height", height);
            // baidu(this.getElement("content")).css("height", height);
        }
        
        this.fire("resize", size);
    },

    
    getSize: function(){
        return {
            width: this._options.width,
            height: this._options.height
        }
    },

    
    setPosition: function(pos){

        if(typeof pos.left == "number")
            baidu(this.getElement()).css("left", (this._options.left = pos.left) + "px");
        if(typeof pos.top == "number")
            baidu(this.getElement()).css("top", (this._options.top = pos.top) + "px");
        
        this.fire("move", pos);
    },

    
    getPosition: function(){
        return {
            left: this._options.left,
            top: this._options.top
        }
    },

    
    center: function(){
        var body = document[baidu.browser.isStrict ? "documentElement" : "body"];
        var bodyWidth = body.clientWidth;
        var bodyHeight = body.clientHeight;
        //在Chrome下，document.documentElement.scrollTop取值为0，所以改用已经做过兼容的baidu.page.getScrollTop()。
        //scrollLeft同上
        //fixed by Dengping
        var left = (((bodyWidth - this._options.width) / 2) | 0) + baidu.page.getScrollLeft();
        var top = (((bodyHeight - this._options.height) / 2) | 0) + baidu.page.getScrollTop();
        this.setPosition({ left: left, top: top });
    },

    
    $dispose: function(){
        var focusedMap = baidu.global.get("dialogFocused").map;
        if(focusedMap){ delete focusedMap[this.$getId() + "focus"] };
        for(var i = 0, l = this.disposeProcess.length; i < l; i ++)
            this.disposeProcess[i].call(this);
        magic.Base.prototype.$dispose.call(this);
    }
});









































magic.Background = baidu.lang.createClass(function(options){
    var opt = options || {}
        ,me = this;

    me.coverable = opt.coverable || false;  // 是否创建<iframe>覆盖<select>|Flash
    me.styleBox  = opt.styleBox;
    me.tagName   = "div";

    // 一个透明的层能够阻止鼠标“穿透”图层
    var _cssText = "filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;z-index:-1;top:0;left:0;width:100%;height:100%;";
    me._coverDom = "<div style='"+ _cssText +"opacity:0;background-color:#FFFFFF'></div>";

    // 针对IE浏览器需要用一个定时器来维持高宽的正确性
    var bb = baidu.browser;
    bb.ie < 7 && (me._coverDom = "<iframe frameborder='0' style='"+ _cssText +"' src='" + ((window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase()) == "https:" ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank") + "'></iframe>");
    if (bb.ie && (!bb.isStrict || bb.ie < 8)) {
        me.size  = [0,0];
        me.timer = setInterval(function(){me._forIE()}, 80);
    }
    this._innerHTML = "<div class='tang-background-inner' style='width:100%;height:100%;' id='"+ this.$getId("inner")+"'></div>";
}, {
    type : "magic.Background"
    ,superClass : magic.Base
})
.extend(

{
    
    render : function(container) {
        var box = baidu.dom(container).get(0);

        box != document.body
            && baidu.dom(box).css('position')=="static";
            //&& (box.style.position="relative");
        baidu.dom(box).insertHTML("afterbegin", this.toHTMLString());
    },

    
    $dispose: function(){
        var layer = this.getElement();
        layer.parentNode.removeChild(layer);
        clearInterval(this.timer);
    }

    
    ,toHTMLString : function(tagName) {
        return [
            "<",(tagName||this.tagName)," class='tang-background"
            ,(baidu.browser.ie < 7 ?" ie6__":""),"' id='",this.$getId()
            ,"' style='position:absolute; top:0px; left:0px;"
            ,(this.timer ? "width:10px;height:10px;" : "width:100%;height:100%;")
            ,"z-index:-9; -webkit-user-select:none; -moz-user-select:none;' "
            ,"onselectstart='return false'>", this._innerHTML
            ,(this.coverable ? this._coverDom || "" : "")
            ,"</",(tagName||this.tagName),">"
        ].join("");
    }
    
    ,setContent : function(content){
        this.getElement("inner").innerHTML = content;
    }

    
    ,_forIE : function(){
        if (this.guid && this.layer || ((this.layer = this.getElement()) && this.layer.offsetHeight)) {
            var bgl = this.layer;
            var box = this.container || bgl.parentNode;
            // 在 dispose 后取不到 parentNode 会报错 20120207
            if (box && box.style) {
                var  bs = box.style
                    ,bt = parseInt(bs.borderTopWidth) || 0
                    ,br = parseInt(bs.borderRightWidth) || 0
                    ,bb = parseInt(bs.borderBottomWidth) || 0
                    ,bl = parseInt(bs.borderLeftWidth) || 0

                    ,w = box.offsetWidth  - br - bl
                    ,h = box.offsetHeight - bt - bb;

                if (this.size[0] != w || this.size[1] != h) {
                    bgl.style.width = (this.size[0] = w) + "px";
                    bgl.style.height= (this.size[1] = h) + "px";
                }

                // 20120207 meizz 针对IE对于Table行高分配不公的处理
                if (this.styleBox && this.table || (this.table = this.getElement("table"))) {
                    var h0, h1, h2;
                    h0 = h0 || parseInt(baidu.dom(this.table.rows[0]).getCurrentStyle("height"));
                    h2 = h2 || parseInt(baidu.dom(this.table.rows[2]).getCurrentStyle("height"));
                    this.table.rows[0].style.height = h0 +"px";
                    this.table.rows[2].style.height = h2 +"px";
                    this.table.rows[1].style.height = (this.layer.offsetHeight - h0 - h2) +"px";
                }
            }
        }
    }
});

// 20111214 meizz   添加<iframe>达到在IE6下遮挡<select>和Flash的效果
// 20111215 meizz   添加一个透明的DIV层，阻止鼠标事件“穿透”图层
// 20120105 xzh     修改注释



























magic.Dialog = baidu.lang.createClass(function(options){
    
}, { type: "magic.Dialog", superClass : magic.control.Dialog });


magic.Dialog.extend(

{
    
    render: function(el){
        if(baidu.type(el) === "string"){
            el = '#' + el;
        }
        el = baidu(el)[0];
        el || document.body.appendChild(el = document.createElement("div"));
        var template = magic.Dialog.template.join("");
        var options = this._options;
        baidu(el).addClass(options.className || "tang-pass-pop-login");

        // var content = "";
        // if(typeof this.content == "string")
        //     content = this.content;

        baidu(el).insertHTML("beforeEnd", baidu.string.format(template, {
            content: "",
            titleId: this.$getId("title"),
            bodyId: this.$getId("body"),
            contentId: this.$getId("content"),
            foregroundId: this.$getId("foreground"),
            footerId: this.$getId("footer"),
            footerContainerId: this.$getId("footerContainer")
        }));
        this._background = new magic.Background({ coverable: true });
        this._background.render(el);

        this.$mappingDom("", el);

        this._renderHeader();
        this._titleHeight = this.getElement("title").offsetHeight || 30;

        baidu(this.getElement("footer")).hide();
        //派发底部渲染事件，仅供内部使用
        this.fire("footer");

        this.setSize(options);
        this.setPosition(options);

        if(options.content)
            this.setContent(options.content, options.contentType);
          
        this.fire("load");
        this.show();

        this.disposeProcess.push(
            function(){
                baidu(this.getElement("closeBtn")).off("click", this._closeBtnFn);
                this._background.$dispose();
                el.innerHTML = "";
                baidu(el).removeClass("tang-ui tang-dialog");
            }
        );
    },
    
    _renderHeader:function(){
        var template = [
            "<div class='buttons' id='",this.$getId("titleButtons"),"'>",
                "<a id='",this.$getId("closeBtn"),"' class='close-btn' href='###' onmousedown='event.stopPropagation && event.stopPropagation(); event.cancelBubble = true; return false;' onclick='return false;'></a>",
            "</div>",
            "<span id='",this.$getId("titleText"),"'>",baidu.string.encodeHTML(this._options.titleText || "") || "&nbsp;","</span>"];
        baidu(this.getElement("title")).insertHTML("beforeEnd", template.join(""));
        baidu(this.getElement("closeBtn")).on("click", this._closeBtnFn = baidu.fn.bind(this.hide, this));
    }
});

magic.Dialog.template = [
    "<div class='tang-foreground' id='#{foregroundId}'>",
        "<div class='tang-title' id='#{titleId}'>",
        "</div>",
        "<div class='tang-body' id='#{bodyId}'>",
            "<div class='tang-content' id='#{contentId}'>#{content}</div>",
        "</div>",
        "<div class='tang-footer' id='#{footerId}'>",
            "<div id='#{footerContainerId}'></div>",
        "</div>",
    "</div>"];






 

 

 

 

 

 
 

 baidu.lang.register(magic.control.Dialog, 
     function(options){
        options && options.buttons && options.buttons.enable && this.on("footer", function(){
            
            this.buttons = null;
            baidu(this.getElement("footer")).show();
            this._createButton(options.buttons);
            baidu(this.getElement("footerContainer")).addClass("tang-footerContainer");
            var h = this.getElement("footer").offsetHeight;
            (!this.buttons || this.buttons.length == 0) && (h = 30) && baidu(this.getElement("footer")).css('height', 30); 
            this._footerHeight = h;
        });
    },
    {
        
        _createButton: function(){
            var me = this,
                btnConfig = arguments.length > 0 ? arguments[0] : {},
                footerContainer = baidu(me.getElement("footerContainer")),
                buttons = me.buttons || (me.buttons = []),
                hasFocused = false,
                _defaultCreator = (function(){
                    var btnTemplate = ['<a href="#" onClick="return false;" class="tang-dialog-button ','','">',
                                        '<span class="tang-dialog-button-s">',
                                            '<span class="tang-dialog-button-s-space">&nbsp;</span>',
                                            '<span class="tang-dialog-button-s-text">','','</span>',
                                        '</span>',
                                        '</a>'];
                    return function(btnOptions, anchor){
                        btnOptions.disabled ? (btnTemplate[1] = 'tang-dialog-button-disabled') : (btnTemplate[1] = '');
                        btnTemplate[6] = btnOptions.text || '&nbsp;';
                        baidu(anchor).insertHTML('beforeEnd', btnTemplate.join(''));
                        return  baidu(anchor).children().get(0);                            
                    };
                })();
            baidu.forEach(btnConfig.items || [], function(item, index){
                var clickFn, node;
                footerContainer.append(node = baidu('<span class="tang-dialog-button-carrier"></span>')[0]);
                node = typeof item == "object" ? (item.builder || _defaultCreator).call(this, item, node, me, index) : item;
                !hasFocused && item.focused && !item.disabled && (hasFocused = true) && node.focus();
                buttons.push(node);
                item.disabled || item.click && baidu(node).on('click', clickFn = function(){
                    item.click.call(this, me);
                });
                clickFn && this.disposeProcess.push(function(){
                    baidu(node).off('click', clickFn);
                });
            }, me);
            
            footerContainer.addClass("tang-button-" + (btnConfig.align||'right'));
        }
    }
);

(function(){
    
    var disposeProcess = [];
    
    function dispose(){
        for(var i = 0, l = disposeProcess.length; i < l; i ++)
            disposeProcess[i]();
        disposeProcess = [];
    }

    function createMask(){
        var ie = baidu.browser.ie;
        var mask = document.createElement('div');
        mask.className = 'tang-mask';
        ie == 6 && baidu(mask).css('position', 'absolute');
        baidu(mask).css("zIndex", 59999/*baidu.global.getZIndex("dialog", -5)*/);
        

        document.body.appendChild(mask);

        function resize(){
            mask.style.display = 'none';
            baidu(mask).css('height', baidu.page.getViewHeight() + 'px');
            baidu(mask).css('width', baidu.page.getViewWidth() + 'px');
            mask.style.display = '';
        }

        function position(){
            mask.style.display = 'none';
            baidu(mask).css('top', baidu.page.getScrollTop() + 'px');
            baidu(mask).css('left', baidu.page.getScrollLeft() + 'px');
            mask.style.display = '';
        }

        resize();
        ie == 6 && position();

        baidu(window).on('resize', resize);
        disposeProcess.push(function(){
            baidu(window).off('resize', resize);
        });
        ie == 6 && baidu(window).on("scroll", position);
        ie == 6 && disposeProcess.push(function(){
            baidu(window).off('scroll', position);
        });

        disposeProcess.push(function(){
            document.body.removeChild(mask);
        });
    }
})();









































magic.Mask = function(options){
    var me = this;
    magic.control.Layer.call(this);

    me.zIndex = 999;
    me.opacity = 0.3;
    me.bgColor = "#000000";
    me.coverable = false;
    me.container = document.body;

    baidu.object.extend(me, options || {});

    var sf = baidu.browser.safari,
        ie = baidu.browser.ie;
        
    baidu.dom(me.container).insertHTML("afterBegin", me.toHTMLString());
    
    if(ie == 6){
        me.getElement().style.position = "absolute";
    }
    
    
    function resize(){
        if (me.container == document.body) {
            var ls = me.getElement().style;
                
            ls.display = "none";
            me.setSize([baidu.page.getViewWidth(), baidu.page.getViewHeight()]);
            ls.display = "";
        }
    }
    
    
    function scroll(){
        if (me.container == document.body) {
            var ls = me.getElement().style;
            ls.display = "none";
            ls.top = baidu.page.getScrollTop()  + "px";
            ls.left = baidu.page.getScrollLeft() + "px";
            ls.display = "";
        }
    }

    
    function showObjects(bool){
        var objects = document.getElementsByTagName("object");
        var v = bool ? "visible" : "hidden";
        for(var i = 0, o, l = objects.length; i < l; i ++){
            o = objects[i];
            o.style.visibility = v;
        }
    }

    me.on("show", function(){
        resize();
        ie == 6 && scroll();
        baidu.dom(window).on("resize", resize);
        ie == 6 && baidu.dom(window).on("scroll", scroll);

        var es = me.getElement().style;
        es.opacity = me.opacity;
        es.zIndex = me.zIndex;
        es.filter = "alpha(opacity=" + me.opacity * 100 + ")";
        es.backgroundColor = me.bgColor;
        sf && showObjects(false);
    });

    me.on("hide", function(){
        baidu.dom(window).off("resize", resize);
        ie == 6 && baidu.dom(window).off("scroll", scroll);
        sf && showObjects(true);
    });

};
baidu.lang.inherits(magic.Mask, magic.control.Layer, "http://passport.baidu.com/passApi/js/uni/magic.Mask").extend(

{
    
    toHTMLString : function(){
        return "<div id='" + this.$getId() + "' class='pop-mask' style='top:0px; left:0px; position:fixed; display:none;'>"
            +("<iframe frameborder='0' style='"
            +"filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);"
            +"position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1' "
            +"src='" + ((window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase()) == "https:" ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank") + "'></iframe><div style='position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;'>&nbsp;</div>") +"</div>";
    }
});





baidu.lang.register(magic.control.Dialog, 
     function(options){
        if(options && options.mask && options.mask.enable){
            this.renderMask();

            this.on("load", function(){
                if(! this._options.left )
                    this.center();
            });

            this.on("show", function(){
                this.showMask();
            });

            this.on("hide", function(){
                this.hideMask();
            });
        }
    },

     {
        
        renderMask: function(){
            if(this._mask)
                return this;
            var maskOpt = this._options.mask;
            this._mask = new magic.Mask({
                opacity: maskOpt.opacity || .15,
                bgColor: maskOpt.bgColor || "#000",
                zIndex: this.zIndex - 1
            });
            var that = this;
            this.disposeProcess.push(function(){
                baidu(that._mask.getElement()).remove();
            });
            return this;
        },

        
        showMask: function(){
            this._mask.show();
            return this;
        },

        
        hideMask: function(){
            this._mask.hide();
            return this;
        }
    }
);

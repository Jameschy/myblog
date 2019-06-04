/**
 * 所有 Layer 基类
 * @class
 * @name magic.control.Layer
 * @grammar new magic.control.Layer(options)
 * @superClass magic.Base
 * @author meizz
 * @param {Object} options 选项参数
 * @config {Object} width 宽度，默认auto
 * @config {Object} height 高度，默认auto
 * @class magic.control.Layer
 * @author meizz
 */
magic.control.Layer = baidu.lang.createClass(function(setting){
    this.width = "auto";
    this.height= "auto";

    baidu.object.extend(this, setting||{});
},{
    type : "magic.control.Layer"
    ,superClass : magic.Base
})
.extend(
/** @lends magic.control.Layer.prototype */
{
    /**
     * @description 通用展现方法
     * @name magic.control.Layer#show
     * @function
     * @grammar magic.control.Layer#show()
     */
    show : function(){
        if (this.fire("onbeforeshow")) {
            this.getElement().style.display = "";
            this.fire("onshow");
        }
    }
    /**
     * @description 通用隐藏方法
     * @name magic.control.Layer#hide
     * @function
     * @grammar magic.control.Layer#hide()
     */
    ,hide :  function(){
        if (this.fire("onbeforehide")) {
            this.getElement().style.display = "none";
            this.fire("onhide");
        }
    }

    /**
     * @description 通用设置宽度
     * @name magic.control.Layer#setWidth
     * @function
     * @grammar magic.control.Layer#setWidth()
     * @param {Number} width 宽度值:30%|30px|30em|3cm
     */
    ,setWidth :  function(width) {
        baidu.dom.setPixel(this.getElement(), "width",(this.width=width));
    }
	
    /**
     * @description 通用设置高度
     * @name magic.control.Layer#setHeight
     * @function
     * @grammar magic.control.Layer#setHeight()
     * @param {Number} height 高度值:30%|30px|30em|3cm
     */
    ,setHeight :  function(height) {
        baidu.dom.setPixel(this.getElement(), "height",(this.height=height));
    }
    
     /**
     * @description 通用设置大小
     * @name magic.control.Layer#setSize
     * @function
     * @grammar magic.control.Layer#setSize()
     * @param {Number} size {width, height}|[width, height]
     * @param {Number} size.width 宽度值:30%|30px|30em|3cm
     * @param {Number} size.height 高度值:30%|30px|30em|3cm
     */
    ,setSize : function(size){
        this.setWidth(size.width || size[0]);
        this.setHeight(size.height||size[1]);
    }
});

/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/27
 * author: meizz
 */














/**
 * @description 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 * @class
 * @name magic.control.Popup
 * @superClass magic.control.Layer
 * @grammar new magic.control.Popup(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} options.autoHide 是否自动隐藏，，默认true
 * @param {Boolean} options.visible 弹出层当前是否显示，默认false
 * @param {Boolean} options.smartPosition 弹出层会根据屏幕可视区域的大小自动向下或向上翻转，默认false
 * @param {Boolean} options.disposeOnHide 在 hide 方法执行的时候自动析构，默认false
 * @param {Boolean} options.hideOnEscape 在用户按[ESC]键时是否隐藏当前弹出层，默认true
 * @param {Number} options.offsetX 定位时的偏移量，X方向，默认0
 * @param {Number} options.offsetY 定位时的偏移量，Y方向，默认0
 * @param {Number|String} options.top 弹出层的定位点
 * @param {Number|String} options.left 弹出层的定位点 200|200px|50%|12em|12cm
 * @param {Number|String} options.width 弹出层的宽度，默认值 auto
 * @param {Number|String} options.height 弹出层的高度，默认值 auto
 * @return {magic.control.Popup} Popup实例
 * @author meizz
 * @example
 * /// for options.autoHide,options.visible,options.smartPosition
 * var instance = new magic.Popup({
 * 		autoHide: true,		// 自动隐藏
 * 		visible: true,		// 显示弹出层
 * 		smartPosition: true		// 自动向下或向上翻转
 * });
 * @example
 * /// for options.disposeOnHide,options.hideOnEscape
 * var instance = new magic.Popup({
 * 		disposeOnHide: true,		// 在 hide 方法执行的时候自动析构
 * 		hideOnEscape: true		// 在用户按[ESC]键时是否隐藏当前弹出层
 * });
 * @example
 * /// for options.offsetX,options.offsetY,options.top,options.left,options.width,options.height
 * var instance = new magic.Popup({
 * 		offsetX: 10,		// X方向偏移10px
 * 		offsetY: 20,		// Y方向偏移20px
 * 		left: 200,			// X轴坐标 200px
 * 		top: 500,			// Y轴坐标 500px
 * 		width: 300,			// 宽 300px
 * 		height:80			// 高 80px
 * });
 */
magic.control.Popup = baidu.lang.createClass(function(options){
    var me = this;

    me.visible = false;
    me.autoHide = true;
    me.hideOnEscape = true;
    me.disposeOnHide = false;
    me.smartPosition = false;

    me.offsetX = 0;
    me.offsetY = 0;

    baidu.object.extend(this, options||{});
    
    // [private]
    me._parent = null;    // 可以多级 popup 嵌套
    me._host = null;    // 被绑定的DOM对象，作为定位

    me._init_control_popup();
}, {
    superClass: magic.control.Layer
    , type:"magic.control.Popup"
})
.extend(
    /** @lends magic.control.Popup.prototype */
    {
    	
    /**
     * @description 向弹出层写入内容，支持HTML
     * @name magic.control.Popup#setContent
     * @function 
     * @grammar magic.control.Popup#setContent(content)
     * @param {String} content 将要写入的内容
     * @example
     * var instance = new magic.Popup(option);
     * instance.setContent('some text');
     */
    setContent : function(content){
        this.getElement("content").innerHTML = content;
    }
    
    /**
     * @description 将弹出层与某个DOM元素进行展现的位置绑定
     * @name magic.control.Popup#attach
     * @function 
     * @grammar magic.control.Popup#attach(el, options)
     * @param {HTMLElement} el 被绑定的元素
     * @param {JSON} options 展现的时候一个参数设置
     * @param {Number} options.offsetX 定位时的偏移量，X方向
     * @param {Number} options.offsetY 定位时的偏移量，Y方向
     * @param {Number|String} options.width 弹出层的宽度，默认值 auto；200|200px|50%|12em|12cm
     * @param {Number|String} options.height 弹出层的高度，默认值 auto
     * @example
     * var instance = new magic.Popup(option);
     * instance.attach(baidu('#target').get(0), {
     * 		offsetX: 10,
     * 		offsetY: 20,
     * 		width: baidu('#target').width(),
     * 		height: 150
     * });
     */
    ,attach : function(el, options) {
        if(baidu.dom(el).size()) {
            baidu.object.extend(this, options||{});

            this._host = baidu(el)[0];
            this.show();
        }
    }
    /**
     * @description 对弹出层重新定位，主要是应对页面resize时绑定的目标元素位置发生改变时重定位
     * @name magic.control.Popup#reposition
     * @function 
     * @grammar magic.control.Popup#reposition(position)
     * @param {JSON|Array} position [可选]{top, left}|[top, left]
     * @example
     * var instance = new magic.Popup(option);
     * instance.reposition({
     * 		left: 200,
     * 		top: 20
     * });
     */
    ,reposition : function(position){
        var me = this;
        !position && me._host && (position = baidu.dom(me._host).offset());
        if (position) {
            me.top = position.top + me.offsetY + me._host.offsetHeight;
            me.left= position.left+ me.offsetX;
            // 20120116 meizz
            me._resupinate = false;    // 向上翻转的
            if(me.smartPosition) {
                var oh = me.getElement().offsetHeight;    // popup.offsetHeight
                var ph = baidu.page.getViewHeight();    // 浏览器可视区域高
                var st = baidu.page.getScrollTop();        // 浏览器滚动条位置 Y
                var up = position.top-me.offsetY-oh;    // popup向上翻时的 top 值
                if(me.top+oh > st+ph && up > st && up < st+ph) {
                    me.top = position.top-me.offsetY-oh;
                    me._resupinate = true;
                }
            }
        }
        me.fire("reposition");
        me.setPosition([me.left, me.top]);
    }
	/**
     * @description 弹出层的定位
     * @name magic.control.Popup#setPosition
     * @function 
     * @grammar magic.control.Popup#setPosition(position)
     * @param {JSON|Array} position [可选]{top, left}|[top, left]
     * @example
     * var instance = new magic.Popup(option);
     * instance.setPosition({
     * 		left: 200,
     * 		top: 20
     * });
     */
    ,setPosition : function(position){
        this.setTop(position.top || position[1]);
        this.setLeft(position.left||position[0]);
    }
    /**
     * @description 设置对象Top偏移
     * @name magic.control.Popup#setTop
     * @function 
     * @grammar magic.control.Popup#setTop(top)
     * @param {Number} top 偏移数值
     * @example
     * var instance = new magic.Popup(option);
     * instance.setTop(20);
     */
    ,setTop : function(top) {
        baidu.dom(this.getElement()).css("top", (this.top=top)+"px");
    }
    /**
     * @description 设置对象Left偏移
     * @name magic.control.Popup#setLeft
     * @function 
     * @grammar magic.control.Popup#setLeft(left)
     * @param {Number} left 偏移数值
     * @example
     * var instance = new magic.Popup(option);
     * instance.setLeft(20);
     */
    ,setLeft : function(left) {
        baidu.dom(this.getElement()).css("left", (this.left=left)+"px");
    }
    /**
     * 初始化popup
     * @private
     */
    ,_init_control_popup : function(){
        var me = this;
        function resize(){me.reposition();}
        function escape(e){
            	e.keyCode == 27
                && me.hideOnEscape
                && me.autoHide
                && me.hide();
        }
        function protect(){
            var pp = me;
            do {
                prot[pp.guid] = true;
                pp = pp._parent
            } while(pp);
        }

        var list = baidu.global.get("popupList");
        var prot = baidu.global.get("popupProtect");
        me.on("show", function(){
            me.reposition();
            // 这句延迟是为了el.click->show()，doc.click->hide()导致popup不能显示的问题
            setTimeout(function(){me.guid && (list[me.guid] = true);}, 1);
            me._host && baidu.dom(me._host).on("click", protect);
            baidu.dom(me.getElement()).on("click", protect);
            baidu.dom(window).on("resize", resize);
            baidu.dom(document).on("keyup", escape);
            me.width!="auto" && me.setWidth(me.width);
            me.height!="auto" && me.setHeight(me.height);
            me.visible = true;
        });
        
        function hide(val){
            me.visible = false;
            delete list[me.guid];
            me._host && baidu.dom(me._host).off("click", protect);
            baidu.dom(me.getElement()).off("click", protect);
            baidu.dom(window).off("resize", resize);
            baidu.dom(document).off("keyup", escape);
            val && me.$dispose();
//            me.disposeOnHide && me.$dispose();
        }
        
        me.on('hide', function(){hide(me.disposeOnHide)});
        me.on('dispose', function(){hide(false)});
    }
});

// 页面全局管理 popup，自动隐藏
(function(){
    var list = baidu.global.set("popupList", {}, true);
    var protect = baidu.global.set("popupProtect", {}, true);

    function hide() {
        for (var guid in list) {
            var pop = baiduInstance(guid);
            !protect[guid] && pop.autoHide && pop.hide();
        }
        for (var guid in protect) delete protect[guid];
    }

    baidu.dom(window).on("resize", hide);
    baidu.dom(window).on("scroll", hide);
    baidu.dom(document).on("click", hide);
})();

// 20120114 meizz 支持多级嵌套，通过 _parent 指向到父级 popup

/*
 * Tangram
 * Copyright 2009 Baidu Inc. All rights reserved.
 * 
 * version: 0.1
 * create: 2011/11/25
 * author: meizz
 * modify: 2011/12/15
 */










/**
 * @description 创造一个背景层，可以在这个层上用CSS构造出阴影、圆角、渐变透明的效果；提供一组可外调的CSS：tang-background、tang-background-inner
 * @author meizz
 * @class
 * @name    magic.Background
 * @superClass magic.Base
 * @grammar new magic.Background(options)
 * @param {Object} options 参数设置
 * @param {Boolean} options.coverable 添加背景覆盖层，防止鼠标事件穿透，同时IE6里还可以遮盖select、Flash等，默认false
 * @plugin styleBox 使按钮支持capture
 * @return {magic.Background} Background实例.
 * @example
 * /// for options.coverable
 * var instance = new magic.Background({
 * 		coverable: true		// 遮盖 select、flash
 * });
 */
magic.Background = baidu.lang.createClass(function(options){
	var opt = options || {}
		,me = this;

	me.coverable = opt.coverable || false;	// 是否创建<iframe>覆盖<select>|Flash
	me.styleBox  = opt.styleBox;
	me.tagName	 = "div";

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
/**
 *  @lends magic.Background.prototype
 */
{
	/**
     * @description 将背景图层附着到DOM元素上
     * @name magic.Background#render
     * @function 
     * @grammar magic.Background#render(container)
     * @param {HTMLElement} container 被附加背景层的DOM元素
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     */
	render : function(container) {
		var box = baidu.dom(container).get(0);

		box != document.body
			&& baidu.dom(box).css('position')=="static"
			&& (box.style.position="relative");
		baidu.dom(box).insertHTML("afterbegin", this.toHTMLString());
	},

	/**
     * @description 析构
     * @name magic.Background#$dispose
     * @function 
     * @grammar magic.Background#$dispose()
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     * instance.$dispose();	// 销毁元素
     */
	$dispose: function(){
	    var layer = this.getElement();
	    layer.parentNode.removeChild(layer);
	    clearInterval(this.timer);
	}

	/**
	 * 生成控件对应的 HTMLString
	 * @param	{String}	tagName 	用户可以指定背景层的HTML标签名，比如在<ul>里嵌套时就需要使用<li>而不能再使用<div>了
	 */
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
	/**
     * @description 向背景层注入HTML，以便完成更复杂的背景需求
     * @name magic.Background#setContent
     * @function 
     * @grammar magic.Background#setContent(content)
     * @param {HTMLString} content 注入的HTML文本
     * @example
     * var instance = new magic.Background(option);
     * instance.render(baidu('#bg').get(0));
     * instance.setContent('some text');
     */
	,setContent : function(content){
		this.getElement("inner").innerHTML = content;
	}

	/*
	 * 在IE浏览器某些CSS盒模型下解析不正确，需要用此脚本调整
	 * @private
	 */
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

// 20111214	meizz	添加<iframe>达到在IE6下遮挡<select>和Flash的效果
// 20111215 meizz	添加一个透明的DIV层，阻止鼠标事件“穿透”图层
// 20120105 xzh	    修改注释
/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/27
 * author: meizz
 */












/**
 * @description 弹出窗的窗体，此类没有render()方法，直接 new，指定参数后直接 attach() 或者 show()
 * @class
 * @superClass magic.control.Popup
 * @name magic.Popup
 * @grammar new magic.Popup(options)
 * @param {JSON} options 参数设置
 * @param {Boolean} options.autoHide 是否自动隐藏，，默认true
 * @param {Boolean} options.visible 弹出层当前是否显示，默认false
 * @param {Boolean} options.smartPosition 弹出层会根据屏幕可视区域的大小自动向下或向上翻转，默认false
 * @param {Boolean} options.disposeOnHide 在 hide 方法执行的时候自动析构，默认false
 * @param {Boolean} options.hideOnEscape 在用户按[ESC]键时是否隐藏当前弹出层，默认true
 * @param {Number} options.offsetX 定位时的偏移量，X方向，默认0
 * @param {Number} options.offsetY 定位时的偏移量，Y方向，默认0
 * @param {Number|String} options.top 弹出层的定位点
 * @param {Number|String} options.left 弹出层的定位点 200|200px|50%|12em|12cm
 * @param {Number|String} options.width 弹出层的宽度，默认值 auto
 * @param {Number|String} options.height 弹出层的高度，默认值 auto
 * @return {magic.Popup} Popup实例
 * @author meizz
 * @example
 * /// for options.autoHide,options.visible,options.smartPosition
 * var instance = new magic.Popup({
 * 		autoHide: true,		// 自动隐藏
 * 		visible: true,		// 显示弹出层
 * 		smartPosition: true		// 自动向下或向上翻转
 * });
 * @example
 * /// for options.disposeOnHide,options.hideOnEscape
 * var instance = new magic.Popup({
 * 		disposeOnHide: true,		// 在 hide 方法执行的时候自动析构
 * 		hideOnEscape: true		// 在用户按[ESC]键时是否隐藏当前弹出层
 * });
 * @example
 * /// for options.offsetX,options.offsetY,options.top,options.left,options.width,options.height
 * var instance = new magic.Popup({
 * 		offsetX: 10,		// X方向偏移10px
 * 		offsetY: 20,		// Y方向偏移20px
 * 		left: 200,			// X轴坐标 200px
 * 		top: 500,			// Y轴坐标 500px
 * 		width: 300,			// 宽 300px
 * 		height:80			// 高 80px
 * });
 */


(function(){
    magic.Popup = function(options){
        var me = this;
        magic.control.Popup.call(me, options);

        me.content = "";
        me.className = "";
        me.styleBox  = false;

        baidu.object.extend(this, options||{});


        var box = factory.produce();
        me.$mappingDom("", box.getElement());
        me.$mappingDom("content", box.getElement("content"));
        box.getElement().style.zIndex = baidu.global.getZIndex("popup");
        me.setContent(me.content);
        me.className && baidu.dom(box.getElement()).addClass(me.className);

        me.on("dispose", function(){
            me.className && baidu.dom(box.getElement()).removeClass(me.className);
            me.setContent("");
            box.busy = false;
        });
    };
    baidu.lang.inherits(magic.Popup, magic.control.Popup, "magic.Popup");

    // 工厂模式：重复使用popup壳体DOM，减少DOM的生成与销毁
    var factory = {list:[], produce : function(){
        for(var i=0, n=this.list.length; i<n; i++) {
            if (!this.list[i].busy) {
                this.list[i].busy = true;
                return this.list[i];
            }
        }
        var box = new magic.Base();
        baidu.dom(document.body).insertHTML("afterbegin", [
            "<div class='tang-popup' id='",box.$getId(),"' "
            ,"style='position:absolute; display:none;'>"
                ,(box.background = new magic.Background({coverable:false})).toHTMLString()
                ,"<div class='tang-foreground' id='",box.$getId("content"),"'></div>"
            ,"</div>"
        ].join(""));
        box.busy = true;
        this.list.push(box);
        return box;
    }};
})();

//    20120114 meizz 实现了工厂模式，重复使用POPUP的外壳，在 dispose 析构方法执行时回收DOM资源
/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/12/12
 * author: zhaochengyang
 */














/**
 * @description 输入框提示组件的控制器
 * @class
 * @name magic.control.Suggestion
 * @superClass magic.Base
 * @grammar new magic.control.Suggestion(options)
 * @param {Object} options 选项
 * @param {Object} options.offset 输入框提示组件相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @param {Function} options.getData 在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，调用receiveData，并传入参数，例如me.receiveData(query, returnValue);
 * @param {String} options.prependHTML 写在下拉框列表前面的html
 * @param {String} options.appendHTML 写在下拉框列表后面的html
 * @param {Boolean} options.holdHighLight 鼠标移出待选项区域后，是否保持条目的高亮状态，默认false
 * @author meizz, zhaochengyang
 * @return {magic.control.Suggestion} Suggestion实例
 * @example
 * /// for options.offset
 * var instance = magic.setup.suggestion('sgt', {
 * 		offset: {
 *          'offsetX': 0,
 *          'offsetY': 0
 *      }
 * });
 * @example
 * /// for options.getData
 * var getData = function(key){
 * 		var me = this;
 * 		// 向服务器发送用户输入
 * 		baiud.ajax.get('search.php?'+key), function(xhr, rsp){
 * 			// 获取数据后, 传递给 receiveData
 * 			var data = eval(rsp);
 * 			me.receiveData(key, data);
 * 		});
 * }
 * var instance = magic.setup.suggestion('sgt', {
 * 		getData: getData
 * });
 * @example
 * /// for options.prependHTML,options.appendHTML
 * var instance = magic.setup.suggestion('sgt', {
 * 		prependHTML: '写在下拉框列表前面的HTML',
 * 		appendHTML: '<span class="tang-suggestion-closeBtn">关闭</span>';
 * });
 * @example
 * /// for options.holdHighLight
 * var instance = magic.setup.suggestion('sgt', {
 * 		getData: getData,
 * 		holdHighLight: false	//鼠标移出待选项区域后消除高亮状态
 * });
 */
magic.control.Suggestion = baidu.lang.createClass(function(options){
	var me = this;
    
    baidu.object.extend(this, options||{});
    
    me.dataCache = {};      //本地缓存suggestion数据
	me.enableIndexs = [];   //包含enable的选项数组
	me.selectedIndex = -1;  //指当前选中的选项的索引在enableIndexs数组中的索引
    me.currentQuery = '';   //currentQuery保存当前suggestion对应的query，用于在某些情况下还原input中的值
    me.oldInputValue = '';  //存储input中的值，用于轮询器与当前input值对比
    me.upDownArrowTimer = null;   //用来处理键盘上下键一直被按下的情况

    me.on('onload', function() {
        var input_el = me.getElement("input"),
            timer = null;
            
        me.oldInputValue = me.getElement("input").value;
        
        //轮询器，检查input中值的变化
        function createTimer(){
            timer = setInterval(function(){
                var query = input_el.value;
                if(!query && me.isShowing()){
                    me._hide();
                }else if(query != me.oldInputValue){
                    query && me.fire("onneeddata", query);
                    me.oldInputValue = query;
                }
            }, 100);
        }
        
        createTimer();
        
        //监听键盘按键
        var _keydownHandler = (function(){
            return  me._keydownHandler();
        })();
        var _keyupHandler = function(e){
            if(timer){
                clearInterval(timer);
                createTimer();
            }
            //处理上下键长按的延时器
            if(me.upDownArrowTimer){
                clearTimeout(me.upDownArrowTimer);
                me.upDownArrowTimer = null;
            }
        };
        baidu.dom(input_el).on("keydown", _keydownHandler);
        baidu.dom(input_el).on("keyup", _keyupHandler);
        
        //解决某些输入法输入过程中会将字符上框的问题
        me.on("onmousedownitem", function(){
            clearInterval(timer);
            setTimeout(function(){
                createTimer();
            }, 500);
        });
        
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.dom(input_el).off("keydown", _keydownHandler);
            baidu.dom(input_el).off("keyup", _keyupHandler);
            clearInterval(timer);
        });
    });
    
    //监听suggestion的render事件，suggestion在第一次请求数据时渲染
    me.on("onrender", function(){
        var input_el = me.getElement("input"),
            suggestion_el = me.getElement("suggestion"),
            windowBlurHandler = function(){
                me.hide();
            },
            documentClickHandler = function(e){
                var e = e || window.event,
                    element = e.target || e.srcElement;
                if(!me.suggestion){
                    return;
                }
                    
                if (element == suggestion_el || baidu.dom.contains(suggestion_el, element) || element == me.getElement("input")) {
                    return;
                }
                me.hide();
            };

        baidu.dom(window).on('blur', windowBlurHandler);
        baidu.dom(document).on("click", documentClickHandler);
        
        //dispose时移除事件监听
        me.on('ondispose', function(){
            baidu.dom(window).off('blur', windowBlurHandler);
            baidu.dom(document).off('click', documentClickHandler);
        });
        
    });


    /*
     * 触发请求suggestion数据的自定义事件
     */
    me.on('onneeddata', function(ev, query) {
        var dataCache = me.dataCache;
        me.currentQuery = query;
        if (typeof dataCache[query] == 'undefined') {
            //没有数据就去取数据
            me.getData(query);
        }else {
            //有数据就直接显示，（需要排除缓存的数据为空数组的情况）
            me.currentData = dataCache[query];
            (me.currentData.length > 0) ? me.show() : me.hide();
        }
    });
    
    
    //在显示suggestion之前，保存所有enable数据项的索引
    me.on("beforeshow", function(){
        var data = me.currentData,
            i = 0,
            len = data.length;
        me.enableIndexs = [];
        for(; i<len; i++){
            if(typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) {
                me.enableIndexs.push(i);
            }
        }
    });
    
},{
	type: "magic.control.Suggestion",
	superClass: magic.Base
})
.extend(
     /**
     * @lends magic.control.Suggestion.prototype
     */
{
    
    /**
     * suggestion各部分的模板
     */
    tpl: {
        //在suggestion之前或之后显示内容的模板
        fix: "<div id='#{0}' class='#{1}'>#{2}</div>",
        //suggestion数据部分的模版
        body: '<table cellspacing="0" cellpadding="2" class="tang-suggestion-table"><tbody>#{0}</tbody></table>',
        //suggestion每一项数据的模版
        item: '<tr><td id="#{0}" onmouseover="#{2}" onmouseout="#{3}" onmousedown="#{4}" onclick="#{5}" class="#{6}">#{1}</td></tr>'
    },
    
    
    /**
     * @description 创建输入框提示组件容器，并渲染到dom树中
     * @name magic.control.Suggestion#render
     * @function
     * @grammar magic.control.Suggestion#render()
     * @example 
     * var instance = new magic.control.Suggestion(option);
     * instance.render();
     */
    render: function(){
        var me = this,
            popup = new magic.Popup({"autoHide": false, "autoTurn": false, 'disposeOnHide': false});
        popupContainer = popup.getElement();
        baidu.dom(popupContainer).addClass("tang-suggestion-popup");
        
        me.$mappingDom("suggestion", popupContainer);
        
        me.suggestion = popup;  //指向suggestion的popup实例
        
        baidu.dom(me.getElement("input")).attr("autocomplete", "off");
        
        /**
         * @description 渲染输入框提示容器时触发
         * @name magic.control.Suggestion#onrender
         * @event 
         * @grammar magic.control.Suggestion#onrender(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onrender = function(){
         * 		// do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('render', function(){
         * 		// do something
         * });
         */
        me.fire("onrender");
        
        return popupContainer;
    },
    /**
     * @description 判断输入框提示是否显示
     * @name magic.control.Suggestion#isShowing
     * @function
     * @grammar magic.control.Suggestion#isShowing()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.isShowing();		// true OR false
     */
    isShowing: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        return suggestion && baidu.dom(suggestion).css('display') != "none";
    },
    /**
     * @description 显示输入框提示容器
     * @name magic.control.Suggestion#show
     * @function
     * @grammar magic.control.Suggestion#show()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.show();		// 显示suggestion容器
     */
    show: function(){
        var me = this,
            suggestion_el = me.getElement("suggestion") || me.render(),
            input_el = me.getElement("input"),
            customWidth = (me.offset && me.offset.width) || input_el.offsetWidth;
        /**
         * @description 试图显示输入框提示时触发
         * @name magic.control.Suggestion#onbeforeshow
         * @event 
         * @grammar magic.control.Suggestion#onbeforeshow(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @param {Boolean} evt.returnValue 返回false时，会阻止下拉菜单展现。
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onbeforeshow = function(evt){
         * 		evt.returnValue = false; //此时会阻止下拉菜单展现。
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('beforeshow', function(evt){
         * 		// do something
         * });
         */
       var returValue =  me.fire("beforeshow");
        if(returValue === false){
                return false;
        }       

        //设置suggestion的内容
        me.suggestion.setContent(me._getSuggestionString());
        //调用popup的attach方法定位
        me.suggestion.attach(input_el, {
            "offsetX": (me.offset && me.offset.offsetX) || 0,
            "offsetY": (me.offset && me.offset.offsetY) || -1
        });
        //设置suggestion的宽度
        baidu.dom(suggestion_el).css("width", parseInt(customWidth) + 'px');
        //显示suggestion
        baidu.dom(suggestion_el).css("display", "block");
        
        //将selectedIndex重置为-1
        me.selectedIndex = -1;
        /**
         * @description 输入框提示显示后触发
         * @name magic.control.Suggestion#onshow
         * @event 
         * @grammar magic.control.Suggestion#onshow(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onshow = function(){
         * 		// do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('show', function(){
         * 		// do something
         * });
         */
        me.fire("onshow");
    },
    /**
     * @description 隐藏输入框提示容器
     * @name magic.control.Suggestion#hide
     * @function
     * @grammar magic.control.Suggestion#hide()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.hide();		// 隐藏suggestion容器
     */
    hide: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        
        //如果不存在suggestion或者suggestion处于关闭状态，不需要后续操作
        if(!suggestion || !me.isShowing()){
            return;
        }
        
        //如果当前有选中的条目，将其放到input中
        if(me.selectedIndex >= 0 && me.holdHighLight){
            var currentData = me.currentData,
                i = me.enableIndexs[me.selectedIndex];
            if(currentData[i] && (typeof currentData[i].disable == 'undefined' || currentData[i].disable == false)){
                me.$pick(i);
            }
        }else{
            me.oldInputValue = me.getElement("input").value;
        }
        
        me._hide();
    },
    
    /**
     * 隐藏suggestion容器
     * @private
     */
    _hide: function(){
        var me = this,
            suggestion = me.getElement("suggestion");
        baidu.dom(suggestion).css("display", "none");
        
        //重置selectedIndex
        me.selectedIndex = -1;
        /**
         * @description 输入框提示隐藏时触发
         * @name magic.control.Suggestion#onhide
         * @event 
         * @grammar magic.control.Suggestion#onhide(evt)
         * @param {baidu.lang.Event} evt 事件参数
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onhide = function(){
         * 		// do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('hide', function(){
         * 		// do something
         * });
         */
        me.fire("onhide");
    },
    
    /**
     * 获取suggestion部分的html
     * @private
     * @return {String}
     */
    _getSuggestionString: function(){
        var me = this,
            html = '',
            itemsHTML = [],
            data = me.currentData,
            len = data.length,
            i = 0,
            ins;
            
        //生成在suggestion之前或之后显示的内容的HTML
        function getfix(name) {
            return baidu.string.format(
                me.tpl.fix,
                me.$getId(name),
                me._getClass(name),
                me[name + 'HTML']
            );
        }

        me.prependHTML && (html += getfix('prepend'));

        var instanceName = magic._baiduInstName;
        for (; i < len; i++) {
            ins = instanceName + "('"+ me.guid +"')";
            itemsHTML.push(baidu.string.format(
                me.tpl.item,
                me.$getId('item' + i),
                data[i].content,
                ins + '._mouseOver(event, ' + i + ')',
                ins + '._mouseOut(event, ' + i + ')',
                ins + '._mouseDown(event, ' + i + ')',
                ins + '._mouseClick(event, ' + i + ')',
                (typeof data[i]['disable'] == 'undefined' || data[i]['disable'] == false) ? '' : 'tang-suggestion-disable'
            ));
        }

        html += baidu.string.format(
            me.tpl.body, 
            itemsHTML.join('')
        );
        me.appendHTML && (html += getfix('append'));
        return html;
    },
    /**
     * @description 取得input中的值
     * @name magic.control.Suggestion#getInputValue
     * @function
     * @grammar magic.control.Suggestion#getInputValue()
     * @return {String} value input中的值
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getInputValue();		// input 的 value
     */
    getInputValue: function(){
        return this.getElement("input").value;
    },
    
    /**
     * @description 根据index获取对应的输入框提示值
     * @name magic.control.Suggestion#getDataByIndex
     * @function
     * @grammar magic.control.Suggestion#getDataByIndex(index)
     * @param {Integer} index 索引
     * @return {String} data 该索引对应的suggestion值 
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getDataByIndex(0);		// 对应的suggestion值
     */
    getDataByIndex: function(index) {
        return this.currentData[index];
    },
    
    /**
     * 判断suggestion某一项是否处于enable状态
     * @private
     * @param {Integer} index 选项的索引
     * @return {Boolean} suggestion某一项是否处于enable状态
     */
    _isEnable: function(index){
        var me = this;
        return baidu.array(me.enableIndexs).contains(index);
    },
    
    /**
     * 取得某个选项对应的的DOM
     * @private
     * @param {Integer} index
     * @return {HTMLElement}
     */
    _getItemDom: function(index){
        return baidu.dom('#'+this.$getId('item' + index)).get(0);
    },
    
    /**
     * 返回以tang-suggestion开头的classname字符串
     * @private
     * @param {String} name
     * @return {String} 以tang-suggestion-为前缀的class名
     */
    _getClass: function(name){
        return "tang-suggestion-" + name;
    },

    /**
     * 选择某个选项，即高亮并上框某个选项
     * @private
     * @param {String} selectedIndex 需要高亮的选项的索引在enableIndexs数组中的索引
     */
    _focus: function(selectedIndex){
        var enableIndexs = this.enableIndexs;
        this.$pick(enableIndexs[selectedIndex]);
        this.$highlight(enableIndexs[selectedIndex]);
    },
    /**
     * @description 高亮某个选项
     * @name magic.control.Suggestion#$highlight
     * @function
     * @grammar magic.control.Suggestion#$highlight(index)
     * @param {String} index 需要高亮 的选项索引
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$highlight(0);		// 高亮第一个 选项
     */
    $highlight: function(index) {
        var me = this,
            enableIndexs = me.enableIndexs,
            item = null;

        //若需要高亮的选项被设置了disable，则直接返回
        if (!me._isEnable(index)) return;
        me.selectedIndex >= 0 && me.$clearHighlight();
        
        item = me._getItemDom(index);
        baidu.dom(item).addClass('tang-suggestion-current');
        
        //修改索引
        me.selectedIndex = baidu.array(enableIndexs).indexOf(index);
        /**
         * @description 高亮某个选项时触发
         * @name magic.control.Suggestion#onhighlight
         * @event 
         * @grammar magic.control.Suggestion#onhighlight(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onhighlight = function(index, value){
         * 		alert('第'+index+'条高亮');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('highlight', function(index, value){
         * 		alert('第'+index+'条高亮');
         * });
         */
        me.fire('onhighlight', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
    /**
     * @description 清除选项高亮状态
     * @name magic.control.Suggestion#$clearHighlight
     * @function
     * @grammar magic.control.Suggestion#$clearHighlight()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$clearHighlight();
     */
    $clearHighlight: function() {
        var me = this,
            selectedIndex = me.selectedIndex,
            item = null;
            index = 0;
        index = me.enableIndexs[selectedIndex];
        if (selectedIndex >= 0) {
            item = me._getItemDom(index);
            baidu.dom(item).removeClass(me._getClass('current'));
            me.selectedIndex = -1;
            /**
	         * @description 去除某个选项高亮时触发，若当前没有元素处于高亮状态，则不发出事件
	         * @name magic.control.Suggestion#onclearhighlight
	         * @event 
	         * @grammar magic.control.Suggestion#onclearhighlight(index, value)
	         * @param {Number} index 选项的索引
	         * @param {Object} value 该选项对应的value值
	         * @example
	         * var instance = magic.setup.suggestion('sgt', option);
	         * instance.onclearhighlight = function(index, value){
	         * 		alert('第'+index+'条高亮去除');
	         * }
	         * @example
	         * var instance = magic.setup.suggestion('sgt', option);
	         * instance.on('clearhighlight', function(index, value){
	         * 		alert('第'+index+'条高亮去除');
	         * });
	         */
            me.fire('onclearhighlight', {
                index: index,
                value: me.getDataByIndex(index).value
            });
        }
    },
	/**
     * @description 把某个条目放到input框中
     * @name magic.control.Suggestion#$pick
     * @function
     * @grammar magic.control.Suggestion#$pick(index)
     * @param {String} index 条目索引.
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$pick(1);
     */
	$pick: function(index){
	    // 不检查index的有效性
		var me = this,
            currentData = me.currentData,
            returnData = currentData[index];
        /**
         * @description 试图将某个选项上框时触发
         * @name magic.control.Suggestion#onbeforepick
         * @event 
         * @grammar magic.control.Suggestion#onbeforepick(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onbeforepick = function(index, value){
         * 		// do something
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('beforepick', function(index, value){
         * 		// do something
         * });
         */
        if(me.fire('onbeforepick', {
                'index': index,
                'value': returnData.value})
        ){
            me.getElement("input").value = returnData.value;
            me.oldInputValue = returnData.value;
            
        /**
         * @description 将某个选项上框时触发
         * @name magic.control.Suggestion#onpick
         * @event 
         * @grammar magic.control.Suggestion#onpick(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onpick = function(index, value){
         * 		alert('第'+index+'条放入 input');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('pick', function(index, value){
         * 		alert('第'+index+'条放入 input');
         * });
         */
	        me.fire('onpick', {
	            'index': index,
	            'value': returnData.value
	        });
        }
	},
	/**
     * @description confirm指定的条目
     * @name magic.control.Suggestion#$confirm
     * @function
     * @grammar magic.control.Suggestion#$confirm(index)
     * @param {Integer} index suggestion中选项节点的序号，即当前suggestion值在data中的序号
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$confirm(1);
     */
    $confirm: function(index) {
        // 不检查index的有效性
        var me = this;

        if(!me._isEnable(index)){
            return;
        }
        me.$pick(index);
        /**
         * @description 提交某个选项时触发
         * @name magic.control.Suggestion#onconfirm
         * @event 
         * @grammar magic.control.Suggestion#onconfirm(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onconfirm = function(index, value){
         * 		alert('提交了：'+value);
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('confirm', function(index, value){
         * 		alert('提交了：'+value);
         * });
         */
        me.fire('onconfirm', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
        me._hide();
    },
	
	/**
	 * 将返回的提示信息包装成标准的data对象
	 * @private
	 * @param {Array} data 需要包装的数据
	 * @return {Array} 包装后的标准格式data {value:value, content:content [, disable:true]}
	 */
	_wrapData: function(data){
	    var me = this;
	    var _data = [];
	    var i = 0;
	    var len = data.length;

        //Attention: 对返回值中可能包含的实体字符，如：<、>等，使用encodeHTML转义
        for (; i < len; i++) {
            if (typeof data[i].value != 'undefined') {
                _data.push(data[i]);
            }else {
                _data.push({
                    'value': data[i],
                    'content': baidu.string.encodeHTML(data[i])
                });
            }
        }
        
        return _data;
	},
	/**
     * @description 取输入框提示数据
     * @name magic.control.Suggestion#getData
     * @function
     * @grammar magic.control.Suggestion#getData(query)
     * @param {String} query 搜索关键字
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getData(key);
     */
	getData: function(query){},
	/**
     * @description 取到数据后调用的方法
     * @name magic.control.Suggestion#getData
     * @function
     * @grammar magic.control.Suggestion#getData(query, data)
     * @param {String} query 搜索关键字
     * @param {Array} data 返回的数据
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
	 * baiud.ajax.get('search.php?'+key), function(xhr, rsp){
	 * 		var data = eval(rsp);
	 * 		instance.receiveData(key, data);
	 * });
     */
    receiveData: function(query, data){
        var me = this,
            _data = me.$cacheData(query, data);

        me.selectedIndex = -1;
        if(query == me.getInputValue()){
            me.currentData = _data;
            (data.length > 0) ? me.show() : me.hide();   //返回的数组为空则不显示suggestion
        }
    },
	/**
     * @description 缓存一组输入框提示数据
     * @name magic.control.Suggestion#$cacheData
     * @function
     * @grammar magic.control.Suggestion#$cacheData(query)
     * @param {String} query 查找的关键字
     * @param {Array} data 通过关键字查找出的提示
     * @return {Array} 包装后的标准格式data {value:value, content:content [, disable:true]}
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$cacheData(query, data);	// 缓存
     */
    $cacheData: function(query, data) {
        var me = this,
            _data = me._wrapData(data);
        me.dataCache[query] = _data;
        return _data;
    },
	
	/**
     * 当鼠标移入某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseOver: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        
        if(me._isEnable(index)){
            me.$highlight(index);
            me.selectedIndex = baidu.array(me.enableIndexs).indexOf(index);
        }
        /**
         * @description 鼠标移入某个选项时触发
         * @name magic.control.Suggestion#onmouseoveritem
         * @event 
         * @grammar magic.control.Suggestion#onmouseoveritem(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseoveritem = function(index, value){
         * 		alert('移入第：'+index+'个');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseoveritem', function(index, value){
         * 		alert('移入第：'+index+'个');
         * });
         */
        me.fire('onmouseoveritem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },

    /**
     * 当鼠标移出某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseOut: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        
        if(!me.holdHighLight){
            me._isEnable(index) && me.$clearHighlight();
        }
        /**
         * @description 鼠标移出某个选项时触发
         * @name magic.control.Suggestion#onmouseoutitem
         * @event 
         * @grammar magic.control.Suggestion#onmouseoutitem(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseoutitem = function(index, value){
         * 		alert('移出第：'+index+'个');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseoutitem', function(index, value){
         * 		alert('移出第：'+index+'个');
         * });
         */
        me.fire('onmouseoutitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
	
	/**
     * 当通过鼠标选中某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseDown: function(e, index){
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
        /**
         * @description 鼠标选中某个选项时触发
         * @name magic.control.Suggestion#onmousedownitem
         * @event 
         * @grammar magic.control.Suggestion#onmousedownitem(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmousedownitem = function(index, value){
         * 		alert('选中第：'+index+'个');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mousedownitem', function(index, value){
         * 		alert('选中第：'+index+'个');
         * });
         */
        me.fire('onmousedownitem', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });
    },
	
	/**
     * 当鼠标点击某个选项
     * @private
     * @param {Event} e 事件对象
     * @param {Number} index 当前选项在dom中的序列号
     */
    _mouseClick: function(e, index) {
        var me = this;
        e = baidu.event(e);
        e.stopPropagation();
		/**
         * @description 鼠标点击某个选项时触发
         * @name magic.control.Suggestion#onmouseclick
         * @event 
         * @grammar magic.control.Suggestion#onmouseclick(index, value)
         * @param {Number} index 选项的索引
         * @param {Object} value 该选项对应的value值
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.onmouseclick = function(index, value){
         * 		alert('点击第：'+index+'个');
         * }
         * @example
         * var instance = magic.setup.suggestion('sgt', option);
         * instance.on('mouseclick', function(index, value){
         * 		alert('点击第：'+index+'个');
         * });
         */
        me.fire('onmouseclick', {
            'index': index,
            'value': me.getDataByIndex(index).value
        });

        me.$confirm(index);
    },
    
    /**
     * 处理键盘keydown事件
     * @private
     */
    _keydownHandler: function() {
        var me = this;
        
        /*
         * 键盘上下键的处理方法
         */
        function upDownArrowHandler(direction){
            var query = me.getInputValue(),
                enableIndexs = me.enableIndexs,
                selectedIndex = me.selectedIndex;
                
            if(!query){ //input中没有值时，理论上suggestion不显示，直接返回
                return;
            }
            
            if((query && !me.isShowing())){ //suggestion没有显示
                me.fire("onneeddata", query);
                return;
            }
            
            //只剩下suggestion处于显示状态且当前suggestion对应的query与input中的query一致的情况
            
            //当所有的选项都处于disable状态,直接返回
            if(enableIndexs.length == 0){
                return;
            }
            
            //如果处于延时处理状态，则返回
            if(me.upDownArrowTimer){
                return;
            }
            me.upDownArrowTimer = setTimeout(function(){
                clearTimeout(me.upDownArrowTimer);
                me.upDownArrowTimer = null;
            }, 200);
            
            if("up" == direction) {
                switch (selectedIndex) {
                    case -1:
                        me.$clearHighlight();
                        selectedIndex = enableIndexs.length - 1;
                        me._focus(selectedIndex);
                        break;
                    case 0:
                        selectedIndex = -1;
                        me.$clearHighlight();
                        me.getElement("input").value = me.currentQuery;
                        me.oldInputValue = me.currentQuery;
                        break;
                    default:
                        selectedIndex--;
                        me._focus(selectedIndex);
                        break;
                }
            }else {
                switch (selectedIndex) {
                    case -1:
                        selectedIndex = 0;
                        me._focus(selectedIndex);
                        break;
                    case enableIndexs.length - 1:
                        selectedIndex = -1;
                        me.$clearHighlight();
                        me.getElement("input").value = me.currentQuery;
                        me.oldInputValue = me.currentQuery;
                        break;
                    default:
                        selectedIndex++;
                        me._focus(selectedIndex);
                        break;
                }
            }
            me.selectedIndex = selectedIndex;
        }
        return function(e) {
            var direction = "up";
            switch (e.keyCode) {
                case 27:    //esc
                case 9:     //tab
                    me.hide();
                    break;
                case 13:    //回车，默认为表单提交
                    e.preventDefault();
                    e.stopPropagation();
                    //当前有选中的选项且holdHighLight打开
                    if(me.selectedIndex >= 0 && me.holdHighLight){
                        me.$confirm(me.enableIndexs[me.selectedIndex]);
                    }else{
                    	/**
				         * @description 提交某个选项时触发
				         * @name magic.control.Suggestion#onconfirm
				         * @event 
				         * @grammar magic.control.Suggestion#onconfirm(data)
				         * @param {Object} data 该选项对应的值
				         * @example
				         * var instance = magic.setup.suggestion('sgt', option);
				         * instance.onconfirm = function(data){
				         * 		alert('提交:'+data);
				         * }
				         * @example
				         * var instance = magic.setup.suggestion('sgt', option);
				         * instance.on('confirm', function(data){
				         * 		alert('提交:'+data);
				         * });
				         */
                        me.fire('onconfirm', {
                            'data': me.getInputValue()
                        });
                        if(me.isShowing()){
                            me._hide();
                        }
                    }
                    break;
                case 40:    //向下
                    direction = "down";
                    // falls through
                case 38:    //向上
                    e.preventDefault();
                    e.stopPropagation();
                    upDownArrowHandler(direction);
                    break;
                default:
                    break;
            }
        };
    },
    /**
     * @description 析构
     * @name magic.control.Suggestion#$dispose
     * @function
     * @grammar magic.control.Suggestion#$dispose()
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.$dispose();	// 销毁组件
     */
    $dispose: function(){
        var me = this;
        if(me.disposed){
            return;
        }
        if(me.suggestion){
            me.suggestion.$dispose();
            me.hide();
        }
        magic.Base.prototype.$dispose.call(me);
        
    }
    /**
     * @description 获得输入框提示组件结构里的 HtmlElement对象
     * @name magic.control.Suggestion#getElement
     * @function
     * @grammar magic.control.Suggestion#getElement(name)
     * @param {String} name 可选的值包括：input(输入框)|suggestion(suggestion部分的容器)
     * @example 
     * var instance = magic.setup.suggestion('sgt', option);
     * instance.getElement();
     */	
});

/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 * 
 * version: 2.0
 * date: 2011/11/28
 * author: zhaochengyang
 */




/**
 * @description 由HTML反向创建输入框提示组件
 * @name magic.setup.suggestion
 * @function
 * @grammar magic.setup.suggestion(el, options)
 * @param {String|HTMLElement} el 输入框提示组件对应的input输入框ID或者dom元素
 * @param {Object} options 选项
 * @param {Object} options.offset suggestion相对于输入框的偏移量，传入的参数中可包括offsetX、 offsetY、width三个值（在CSS中使用margin同样可以定位）。
 * @param {Function} options.getData 在需要获取数据的时候会调用此函数来获取数据，传入的参数query是用户在输入框中输入的数据。在获取到数据后，需要触发ongetdata事件，并传入参数，例如me.fire("ongetdata", query, returnValue);
 * @param {String} options.prependHTML 写在下拉框列表前面的html
 * @param {String} options.appendHTML 写在下拉框列表后面的html
 * @param {Boolean} options.holdHighLight 鼠标移出待选项区域后，是否保持条目的高亮状态，默认false
 * @return {magic.control.Suggestion} Suggestion实例.
 * @author meizz, zhaochengyang
 * @example
 * /// for options.offset
 * var sgt = magic.setup.suggestion('sgt', {
 * 		offset: {
 *          'offsetX': 0,
 *          'offsetY': 0
 *      }
 * });
 * @example
 * /// for options.getData
 * var getData = function(key){
 * 		var me = this;
 * 		// 向服务器发送用户输入
 * 		baiud.ajax.get('search.php?'+key), function(xhr, rsp){
 * 			// 获取数据后, 传递给 receiveData
 * 			var data = eval(rsp);
 * 			me.receiveData(key, data);
 * 		});
 * }
 * var sgt = magic.setup.suggestion('sgt', {
 * 		getData: getData
 * });
 * @example
 * /// for options.prependHTML,options.appendHTML
 * var sgt = magic.setup.suggestion('sgt', {
 * 		prependHTML: '写在下拉框列表前面的HTML',
 * 		appendHTML: '<span class="tang-suggestion-closeBtn">关闭</span>';
 * });
 * @example
 * /// for options.holdHighLight
 * var sgt = magic.setup.suggestion('sgt', {
 * 		getData: getData,
 * 		holdHighLight: false	//鼠标移出待选项区域后消除高亮状态
 * });
 */
magic.setup.suggestion = function(el, options){
	/**
	 *@description suggestion 组件 setup 模式的实例对象
	 *@instace
	 *@name magic.setup.suggestion!
	 *@superClass magic.control.Suggestion
	 *@return {instace} magic.control.Suggestion 实例对象
	 */
    var el = baidu.dom('#'+el).get(0),
	    instance = magic.setup(el, magic.control.Suggestion, options);
	instance.$mappingDom('input', el);
	instance.fire('onload');
	return instance;
};

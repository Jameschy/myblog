;
var magic = null;//window.magic;
if(typeof magic != "function"){
    var magic = function(){
    	// TODO: 
    };
}

magic._baiduInstName = magic._baiduInstName || "bdInst_" + new Date().getTime();
var baiduInstance = baiduInstance || baidu.baiduInstance || window.baiduInstance;
window[magic._baiduInstName] = window[magic._baiduInstName] || baiduInstance;

magic.resourcePath = "";
magic.skinName = "default";
magic.version = "1.0.0.0";

/msie 6/i.test(navigator.userAgent) && 
document.execCommand("BackgroundImageCache", false, true);

baidu.form = baidu.form || {};
/**
 * 操作url的方法
 * @namespace baidu.url
 */
baidu.url = baidu.url || {};
/**
 * 对字符串进行%#&+=以及和\s匹配的所有字符进行url转义
 * @name baidu.url.escapeSymbol
 * @function
 * @grammar baidu.url.escapeSymbol(source)
 * @param {string} source 需要转义的字符串.
 * @return {string} 转义之后的字符串.
 * @remark
 * 用于get请求转义。在服务器只接受gbk，并且页面是gbk编码时，可以经过本转义后直接发get请求。
 *
 * @return {string} 转义后的字符串
 */
baidu.url.escapeSymbol = baidu.url.escapeSymbol || function(source) {
    
    //TODO: 之前使用\s来匹配任意空白符
    //发现在ie下无法匹配中文全角空格和纵向指标符\v，所以改\s为\f\r\n\t\v以及中文全角空格和英文空格
    //但是由于ie本身不支持纵向指标符\v,故去掉对其的匹配，保证各浏览器下效果一致
    return String(source).replace(/[#%&+=\/\\\ \　\f\r\n\t]/g, function(all) {
        return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
    });
};

/**
 * josn化表单数据
 * @name baidu.form.json
 * @function
 * @grammar baidu.form.json(form[, replacer])
 * @param {HTMLFormElement} form        需要提交的表单元素
 * @param {Function} replacer           对参数值特殊处理的函数,replacer(string value, string key)
	           
 * @returns {data} 表单数据js对象
 */
baidu.form.json = baidu.form.json || function (form, replacer) {
    var elements = form.elements,
        replacer = replacer || function (value, name) {
            return value;
        },
        data = {},
        item, itemType, itemName, itemValue, 
        opts, oi, oLen, oItem;
        
    /**
     * 向缓冲区添加参数数据
     * @private
     */
    function addData(name, value) {
        var val = data[name];
        if(val){
            val.push || ( data[name] = [val] );
            data[name].push(value);
        }else{
            data[name] = value;
        }
    }
    
    for (var i = 0, len = elements.length; i < len; i++) {
        item = elements[i];
        itemName = item.name;
        
        // 处理：可用并包含表单name的表单项
        if (!item.disabled && itemName) {
            itemType = item.type;
            itemValue = baidu.url.escapeSymbol(item.value);//此时对表单中的密码再进行转义将产生意外的问题，比如密码中出现%就会被转义成%25

            switch (itemType) {
            // radio和checkbox被选中时，拼装queryString数据
            case 'radio':
            case 'checkbox':
                if (item.checked) {
                    addData(itemName, replacer(itemValue, itemName));
                }
                break;
            // 默认类型，拼装queryString数据
            case 'textarea':
            case 'text':
            case 'password':
            case 'hidden':
            case 'file':
            case 'select-one':
                addData(itemName, replacer(itemValue, itemName));
                break;
                
            // 多行选中select，拼装所有选中的数据
            case 'select-multiple':
                opts = item.options;
                oLen = opts.length;
                for (oi = 0; oi < oLen; oi++) {
                    oItem = opts[oi];
                    if (oItem.selected) {
                        addData(itemName, replacer(oItem.value, itemName));
                    }
                }
                break;
            }
        }
    }

    return data;
};

magic.Base = function(){
    baidu.lang.Class.call(this);

    this._ids = {};
    this._eid = this.guid +"__";
};
baidu.lang.inherits(magic.Base, baidu.lang.Class, "http://passport.baidu.com/passApi/js/lib/magic.Base").extend(
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
    ,$hide:function(ele){
        if((typeof ele).toLowerCase() == 'string' || ele===''){
            ele = this.getElement(ele)
        }
        if(ele && ele.style){
            ele.style.display = 'none';
            ele.style.visibility = 'hidden';
        }
        return this;
    }
    ,$show:function(ele){
        if((typeof ele).toLowerCase() == 'string' || ele===''){
            ele = this.getElement(ele)
        }
        if(ele && ele.style){
            ele.style.display = 'block';
            ele.style.visibility = 'visible';
            ele.style.opacity = '1';
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

/*
 * Tangram
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * namespace: magic.control
 * author: meizz
 * version: 0.1
 * date: 2011/11/28
 */


magic.control = magic.control || {};
(function(){
	magic.setup = magic.setup || function(el, Type, options){
		// 从HTML标签属性 tang-param 里分解出用户指定的参数
		var opt = parseAttr(el, "tang-param") || {};

		// 脚本里直接指定的参数权重要高于HTML标签属性里的tang-param
		for (var i in options) opt[i] = options[i];

		var ui = new Type(opt);
		ui.$mappingDom("", el);

		// 添加DOM元素直接调用实例方法的模式	20111205 meizz
		// tang-event="onclick:$.hide()"
		attachEvent(el, ui.guid);
		var doms = el.getElementsByTagName("*");
		for (var i = doms.length - 1; i >= 0; i--) {
			attachEvent(doms[i], ui.guid);
		};

		return ui;
	};

	// 解析DOM元素标签自定义属性值，返回 JSON 对象
	function parseAttr(el, attr) {
		var str = el.getAttribute(attr);
        var keys;
        var json = false;

		if (str && (keys = str.match(reg[0]))) {
			json = {};
			for (var i = 0, a; i < keys.length; i++) {
				a = keys[i].match(reg[1]);

				// Number类型的处理
				!isNaN(a[2]) && (a[2] = +a[2]);

				// 去引号
				reg[2].test(a[2]) && (a[2] = a[2].replace(reg[3], "\x242"));

				// Boolean类型的处理
				reg[4].test(a[2]) && (a[2] = reg[5].test(a[2]));

				json[a[1]] = a[2];
			};
		}
		return json;
	}
	var reg = [
		/\b[\w\$\-]+\s*:\s*[^;]+/g 		/*0*/
		,/([\w\$\-]+)\s*:\s*([^;]+)\s*/	/*1*/
		,/\'|\"/ 						/*2*/
		,/^\s*(\'|\")([^\1]*)\1\s*/		/*3*/
		,/^(true|false)\s*$/i			/*4*/
		,/\btrue\b/i 					/*5*/
	]

	// 解析 DOM 元素标签属性 tang-event ，动态绑定事件
	function attachEvent(el, guid) {
		var json = parseAttr(el, "tang-event");
		if (json) {
			for (var i in json) {
				var method = json[i].substr(1);
				// 如果用户已经指定参数，有效
				method.indexOf("(") < 0 && (method += "()");
				baidu.dom(el).on(i, new Function(magic._baiduInstName + "('"+guid+"') && " + magic._baiduInstName + "('"+guid+"')"+method));
			}
		}
	}
})();

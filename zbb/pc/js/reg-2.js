/**
 * @file 注册入口文件
 */
var passport = window.passport || {};
passport._define('reg-2.js'/*tpa=http://passport.baidu.com/passApi/js/reg.js*/, function () {
    var passport = passport || window.passport || {},
    baidu = passport.tangramInst || baidu || window.baidu;
(function(ns) {
    ns.apiDomain = {
        staticDomain : (window.location ? 
					((window.location.protocol.toLowerCase()=="http:")?"http://passport.bdimg.com/":"https://passport.baidu.com") : 
					((document.location.protocol.toLowerCase()=="http:")?"http://passport.bdimg.com/":"https://passport.baidu.com"))
    };
})(passport);;
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
baidu.lang.inherits(magic.Base, baidu.lang.Class, "http://passport.baidu.com/passApi/js/magic.Base").extend(
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
;
    passport=passport||{};passport.lib=passport.lib||{};passport.lib.RSAExport={};(function(exports){var dbits;var canary=0xdeadbeefcafe;var j_lm=(canary&16777215)==15715070;function BigInteger(a,b,c){if(a!=null)if("number"==typeof a)this.fromNumber(a,b,c);else if(b==null&&"string"!=typeof a)this.fromString(a,256);else this.fromString(a,b)}function nbi(){return new BigInteger(null)}function am1(i,x,w,j,c,n){while(--n>=0){var v=x*this[i++]+w[j]+c;c=Math.floor(v/67108864);w[j++]=v&67108863}return c}function am2(i,x,w,j,c,n){var xl=x&32767,xh=x>>15;while(--n>=0){var l=this[i]&32767;var h=this[i++]>>15;var m=xh*l+h*xl;l=xl*l+((m&32767)<<15)+w[j]+(c&1073741823);c=(l>>>30)+(m>>>15)+xh*h+(c>>>30);w[j++]=l&1073741823}return c}function am3(i,x,w,j,c,n){var xl=x&16383,xh=x>>14;while(--n>=0){var l=this[i]&16383;var h=this[i++]>>14;var m=xh*l+h*xl;l=xl*l+((m&16383)<<14)+w[j]+c;c=(l>>28)+(m>>14)+xh*h;w[j++]=l&268435455}return c}if(j_lm&&navigator.appName=="Microsoft Internet Explorer"){BigInteger.prototype.am=am2;dbits=30}else if(j_lm&&navigator.appName!="Netscape"){BigInteger.prototype.am=am1;dbits=26}else{BigInteger.prototype.am=am3;dbits=28}BigInteger.prototype.DB=dbits;BigInteger.prototype.DM=(1<<dbits)-1;BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP);BigInteger.prototype.F1=BI_FP-dbits;BigInteger.prototype.F2=2*dbits-BI_FP;var BI_RM="0123456789abcdefghijklmnopqrstuvwxyz";var BI_RC=new Array;var rr,vv;rr="0".charCodeAt(0);for(vv=0;vv<=9;++vv)BI_RC[rr++]=vv;rr="a".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;rr="A".charCodeAt(0);for(vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(n){return BI_RM.charAt(n)}function intAt(s,i){var c=BI_RC[s.charCodeAt(i)];return c==null?-1:c}function bnpCopyTo(r){for(var i=this.t-1;i>=0;--i)r[i]=this[i];r.t=this.t;r.s=this.s}function bnpFromInt(x){this.t=1;this.s=x<0?-1:0;if(x>0)this[0]=x;else if(x<-1)this[0]=x+DV;else this.t=0}function nbv(i){var r=nbi();r.fromInt(i);return r}function bnpFromString(s,b){var k;if(b==16)k=4;else if(b==8)k=3;else if(b==256)k=8;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else{this.fromRadix(s,b);return}this.t=0;this.s=0;var i=s.length,mi=false,sh=0;while(--i>=0){var x=k==8?s[i]&255:intAt(s,i);if(x<0){if(s.charAt(i)=="-")mi=true;continue}mi=false;if(sh==0)this[this.t++]=x;else if(sh+k>this.DB){this[this.t-1]|=(x&(1<<this.DB-sh)-1)<<sh;this[this.t++]=x>>this.DB-sh}else this[this.t-1]|=x<<sh;sh+=k;if(sh>=this.DB)sh-=this.DB}if(k==8&&(s[0]&128)!=0){this.s=-1;if(sh>0)this[this.t-1]|=(1<<this.DB-sh)-1<<sh}this.clamp();if(mi)BigInteger.ZERO.subTo(this,this)}function bnpClamp(){var c=this.s&this.DM;while(this.t>0&&this[this.t-1]==c)--this.t}function bnToString(b){if(this.s<0)return"-"+this.negate().toString(b);var k;if(b==16)k=4;else if(b==8)k=3;else if(b==2)k=1;else if(b==32)k=5;else if(b==4)k=2;else return this.toRadix(b);var km=(1<<k)-1,d,m=false,r="",i=this.t;var p=this.DB-i*this.DB%k;if(i-- >0){if(p<this.DB&&(d=this[i]>>p)>0){m=true;r=int2char(d)}while(i>=0){if(p<k){d=(this[i]&(1<<p)-1)<<k-p;d|=this[--i]>>(p+=this.DB-k)}else{d=this[i]>>(p-=k)&km;if(p<=0){p+=this.DB;--i}}if(d>0)m=true;if(m)r+=int2char(d)}}return m?r:"0"}function bnNegate(){var r=nbi();BigInteger.ZERO.subTo(this,r);return r}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(a){var r=this.s-a.s;if(r!=0)return r;var i=this.t;r=i-a.t;if(r!=0)return this.s<0?-r:r;while(--i>=0)if((r=this[i]-a[i])!=0)return r;return 0}function nbits(x){var r=1,t;if((t=x>>>16)!=0){x=t;r+=16}if((t=x>>8)!=0){x=t;r+=8}if((t=x>>4)!=0){x=t;r+=4}if((t=x>>2)!=0){x=t;r+=2}if((t=x>>1)!=0){x=t;r+=1}return r}function bnBitLength(){if(this.t<=0)return 0;return this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(n,r){var i;for(i=this.t-1;i>=0;--i)r[i+n]=this[i];for(i=n-1;i>=0;--i)r[i]=0;r.t=this.t+n;r.s=this.s}function bnpDRShiftTo(n,r){for(var i=n;i<this.t;++i)r[i-n]=this[i];r.t=Math.max(this.t-n,0);r.s=this.s}function bnpLShiftTo(n,r){var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<cbs)-1;var ds=Math.floor(n/this.DB),c=this.s<<bs&this.DM,i;for(i=this.t-1;i>=0;--i){r[i+ds+1]=this[i]>>cbs|c;c=(this[i]&bm)<<bs}for(i=ds-1;i>=0;--i)r[i]=0;r[ds]=c;r.t=this.t+ds+1;r.s=this.s;r.clamp()}function bnpRShiftTo(n,r){r.s=this.s;var ds=Math.floor(n/this.DB);if(ds>=this.t){r.t=0;return}var bs=n%this.DB;var cbs=this.DB-bs;var bm=(1<<bs)-1;r[0]=this[ds]>>bs;for(var i=ds+1;i<this.t;++i){r[i-ds-1]|=(this[i]&bm)<<cbs;r[i-ds]=this[i]>>bs}if(bs>0)r[this.t-ds-1]|=(this.s&bm)<<cbs;r.t=this.t-ds;r.clamp()}function bnpSubTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]-a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c-=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c-=a[i];r[i++]=c&this.DM;c>>=this.DB}c-=a.s}r.s=c<0?-1:0;if(c<-1)r[i++]=this.DV+c;else if(c>0)r[i++]=c;r.t=i;r.clamp()}function bnpMultiplyTo(a,r){var x=this.abs(),y=a.abs();var i=x.t;r.t=i+y.t;while(--i>=0)r[i]=0;for(i=0;i<y.t;++i)r[i+x.t]=x.am(0,y[i],r,i,0,x.t);r.s=0;r.clamp();if(this.s!=a.s)BigInteger.ZERO.subTo(r,r)}function bnpSquareTo(r){var x=this.abs();var i=r.t=2*x.t;while(--i>=0)r[i]=0;for(i=0;i<x.t-1;++i){var c=x.am(i,x[i],r,2*i,0,1);if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1))>=x.DV){r[i+x.t]-=x.DV;r[i+x.t+1]=1}}if(r.t>0)r[r.t-1]+=x.am(i,x[i],r,2*i,0,1);r.s=0;r.clamp()}function bnpDivRemTo(m,q,r){var pm=m.abs();if(pm.t<=0)return;var pt=this.abs();if(pt.t<pm.t){if(q!=null)q.fromInt(0);if(r!=null)this.copyTo(r);return}if(r==null)r=nbi();var y=nbi(),ts=this.s,ms=m.s;var nsh=this.DB-nbits(pm[pm.t-1]);if(nsh>0){pm.lShiftTo(nsh,y);pt.lShiftTo(nsh,r)}else{pm.copyTo(y);pt.copyTo(r)}var ys=y.t;var y0=y[ys-1];if(y0==0)return;var yt=y0*(1<<this.F1)+(ys>1?y[ys-2]>>this.F2:0);var d1=this.FV/yt,d2=(1<<this.F1)/yt,e=1<<this.F2;var i=r.t,j=i-ys,t=q==null?nbi():q;y.dlShiftTo(j,t);if(r.compareTo(t)>=0){r[r.t++]=1;r.subTo(t,r)}BigInteger.ONE.dlShiftTo(ys,t);t.subTo(y,y);while(y.t<ys)y[y.t++]=0;while(--j>=0){var qd=r[--i]==y0?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);if((r[i]+=y.am(0,qd,r,j,0,ys))<qd){y.dlShiftTo(j,t);r.subTo(t,r);while(r[i]<--qd)r.subTo(t,r)}}if(q!=null){r.drShiftTo(ys,q);if(ts!=ms)BigInteger.ZERO.subTo(q,q)}r.t=ys;r.clamp();if(nsh>0)r.rShiftTo(nsh,r);if(ts<0)BigInteger.ZERO.subTo(r,r)}function bnMod(a){var r=nbi();this.abs().divRemTo(a,null,r);if(this.s<0&&r.compareTo(BigInteger.ZERO)>0)a.subTo(r,r);return r}function Classic(m){this.m=m}function cConvert(x){if(x.s<0||x.compareTo(this.m)>=0)return x.mod(this.m);else return x}function cRevert(x){return x}function cReduce(x){x.divRemTo(this.m,null,x)}function cMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}function cSqrTo(x,r){x.squareTo(r);this.reduce(r)}Classic.prototype.convert=cConvert;Classic.prototype.revert=cRevert;Classic.prototype.reduce=cReduce;Classic.prototype.mulTo=cMulTo;Classic.prototype.sqrTo=cSqrTo;function bnpInvDigit(){if(this.t<1)return 0;var x=this[0];if((x&1)==0)return 0;var y=x&3;y=y*(2-(x&15)*y)&15;y=y*(2-(x&255)*y)&255;y=y*(2-((x&65535)*y&65535))&65535;y=y*(2-x*y%this.DV)%this.DV;return y>0?this.DV-y:-y}function Montgomery(m){this.m=m;this.mp=m.invDigit();this.mpl=this.mp&32767;this.mph=this.mp>>15;this.um=(1<<m.DB-15)-1;this.mt2=2*m.t}function montConvert(x){var r=nbi();x.abs().dlShiftTo(this.m.t,r);r.divRemTo(this.m,null,r);if(x.s<0&&r.compareTo(BigInteger.ZERO)>0)this.m.subTo(r,r);return r}function montRevert(x){var r=nbi();x.copyTo(r);this.reduce(r);return r}function montReduce(x){while(x.t<=this.mt2)x[x.t++]=0;for(var i=0;i<this.m.t;++i){var j=x[i]&32767;var u0=j*this.mpl+((j*this.mph+(x[i]>>15)*this.mpl&this.um)<<15)&x.DM;j=i+this.m.t;x[j]+=this.m.am(0,u0,x,i,0,this.m.t);while(x[j]>=x.DV){x[j]-=x.DV;x[++j]++}}x.clamp();x.drShiftTo(this.m.t,x);if(x.compareTo(this.m)>=0)x.subTo(this.m,x)}function montSqrTo(x,r){x.squareTo(r);this.reduce(r)}function montMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}Montgomery.prototype.convert=montConvert;Montgomery.prototype.revert=montRevert;Montgomery.prototype.reduce=montReduce;Montgomery.prototype.mulTo=montMulTo;Montgomery.prototype.sqrTo=montSqrTo;function bnpIsEven(){return(this.t>0?this[0]&1:this.s)==0}function bnpExp(e,z){if(e>4294967295||e<1)return BigInteger.ONE;var r=nbi(),r2=nbi(),g=z.convert(this),i=nbits(e)-1;g.copyTo(r);while(--i>=0){z.sqrTo(r,r2);if((e&1<<i)>0)z.mulTo(r2,g,r);else{var t=r;r=r2;r2=t}}return z.revert(r)}function bnModPowInt(e,m){var z;if(e<256||m.isEven())z=new Classic(m);else z=new Montgomery(m);return this.exp(e,z)}BigInteger.prototype.copyTo=bnpCopyTo;BigInteger.prototype.fromInt=bnpFromInt;BigInteger.prototype.fromString=bnpFromString;BigInteger.prototype.clamp=bnpClamp;BigInteger.prototype.dlShiftTo=bnpDLShiftTo;BigInteger.prototype.drShiftTo=bnpDRShiftTo;BigInteger.prototype.lShiftTo=bnpLShiftTo;BigInteger.prototype.rShiftTo=bnpRShiftTo;BigInteger.prototype.subTo=bnpSubTo;BigInteger.prototype.multiplyTo=bnpMultiplyTo;BigInteger.prototype.squareTo=bnpSquareTo;BigInteger.prototype.divRemTo=bnpDivRemTo;BigInteger.prototype.invDigit=bnpInvDigit;BigInteger.prototype.isEven=bnpIsEven;BigInteger.prototype.exp=bnpExp;BigInteger.prototype.toString=bnToString;BigInteger.prototype.negate=bnNegate;BigInteger.prototype.abs=bnAbs;BigInteger.prototype.compareTo=bnCompareTo;BigInteger.prototype.bitLength=bnBitLength;BigInteger.prototype.mod=bnMod;BigInteger.prototype.modPowInt=bnModPowInt;BigInteger.ZERO=nbv(0);BigInteger.ONE=nbv(1);function bnClone(){var r=nbi();this.copyTo(r);return r}function bnIntValue(){if(this.s<0){if(this.t==1)return this[0]-this.DV;else if(this.t==0)return-1}else if(this.t==1)return this[0];else if(this.t==0)return 0;return(this[1]&(1<<32-this.DB)-1)<<this.DB|this[0]}function bnByteValue(){return this.t==0?this.s:this[0]<<24>>24}function bnShortValue(){return this.t==0?this.s:this[0]<<16>>16}function bnpChunkSize(r){return Math.floor(Math.LN2*this.DB/Math.log(r))}function bnSigNum(){if(this.s<0)return-1;else if(this.t<=0||this.t==1&&this[0]<=0)return 0;else return 1}function bnpToRadix(b){if(b==null)b=10;if(this.signum()==0||b<2||b>36)return"0";var cs=this.chunkSize(b);var a=Math.pow(b,cs);var d=nbv(a),y=nbi(),z=nbi(),r="";this.divRemTo(d,y,z);while(y.signum()>0){r=(a+z.intValue()).toString(b).substr(1)+r;y.divRemTo(d,y,z)}return z.intValue().toString(b)+r}function bnpFromRadix(s,b){this.fromInt(0);if(b==null)b=10;var cs=this.chunkSize(b);var d=Math.pow(b,cs),mi=false,j=0,w=0;for(var i=0;i<s.length;++i){var x=intAt(s,i);if(x<0){if(s.charAt(i)=="-"&&this.signum()==0)mi=true;continue}w=b*w+x;if(++j>=cs){this.dMultiply(d);this.dAddOffset(w,0);j=0;w=0}}if(j>0){this.dMultiply(Math.pow(b,j));this.dAddOffset(w,0)}if(mi)BigInteger.ZERO.subTo(this,this)}function bnpFromNumber(a,b,c){if("number"==typeof b){if(a<2)this.fromInt(1);else{this.fromNumber(a,c);if(!this.testBit(a-1))this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);if(this.isEven())this.dAddOffset(1,0);while(!this.isProbablePrime(b)){this.dAddOffset(2,0);if(this.bitLength()>a)this.subTo(BigInteger.ONE.shiftLeft(a-1),this)}}}else{var x=new Array,t=a&7;x.length=(a>>3)+1;b.nextBytes(x);if(t>0)x[0]&=(1<<t)-1;else x[0]=0;this.fromString(x,256)}}function bnToByteArray(){var i=this.t,r=new Array;r[0]=this.s;var p=this.DB-i*this.DB%8,d,k=0;if(i-- >0){if(p<this.DB&&(d=this[i]>>p)!=(this.s&this.DM)>>p)r[k++]=d|this.s<<this.DB-p;while(i>=0){if(p<8){d=(this[i]&(1<<p)-1)<<8-p;d|=this[--i]>>(p+=this.DB-8)}else{d=this[i]>>(p-=8)&255;if(p<=0){p+=this.DB;--i}}if((d&128)!=0)d|=-256;if(k==0&&(this.s&128)!=(d&128))++k;if(k>0||d!=this.s)r[k++]=d}}return r}function bnEquals(a){return this.compareTo(a)==0}function bnMin(a){return this.compareTo(a)<0?this:a}function bnMax(a){return this.compareTo(a)>0?this:a}function bnpBitwiseTo(a,op,r){var i,f,m=Math.min(a.t,this.t);for(i=0;i<m;++i)r[i]=op(this[i],a[i]);if(a.t<this.t){f=a.s&this.DM;for(i=m;i<this.t;++i)r[i]=op(this[i],f);r.t=this.t}else{f=this.s&this.DM;for(i=m;i<a.t;++i)r[i]=op(f,a[i]);r.t=a.t}r.s=op(this.s,a.s);r.clamp()}function op_and(x,y){return x&y}function bnAnd(a){var r=nbi();this.bitwiseTo(a,op_and,r);return r}function op_or(x,y){return x|y}function bnOr(a){var r=nbi();this.bitwiseTo(a,op_or,r);return r}function op_xor(x,y){return x^y}function bnXor(a){var r=nbi();this.bitwiseTo(a,op_xor,r);return r}function op_andnot(x,y){return x&~y}function bnAndNot(a){var r=nbi();this.bitwiseTo(a,op_andnot,r);return r}function bnNot(){var r=nbi();for(var i=0;i<this.t;++i)r[i]=this.DM&~this[i];r.t=this.t;r.s=~this.s;return r}function bnShiftLeft(n){var r=nbi();if(n<0)this.rShiftTo(-n,r);else this.lShiftTo(n,r);return r}function bnShiftRight(n){var r=nbi();if(n<0)this.lShiftTo(-n,r);else this.rShiftTo(n,r);return r}function lbit(x){if(x==0)return-1;var r=0;if((x&65535)==0){x>>=16;r+=16}if((x&255)==0){x>>=8;r+=8}if((x&15)==0){x>>=4;r+=4}if((x&3)==0){x>>=2;r+=2}if((x&1)==0)++r;return r}function bnGetLowestSetBit(){for(var i=0;i<this.t;++i)if(this[i]!=0)return i*this.DB+lbit(this[i]);if(this.s<0)return this.t*this.DB;return-1}function cbit(x){var r=0;while(x!=0){x&=x-1;++r}return r}function bnBitCount(){var r=0,x=this.s&this.DM;for(var i=0;i<this.t;++i)r+=cbit(this[i]^x);return r}function bnTestBit(n){var j=Math.floor(n/this.DB);if(j>=this.t)return this.s!=0;return(this[j]&1<<n%this.DB)!=0}function bnpChangeBit(n,op){var r=BigInteger.ONE.shiftLeft(n);this.bitwiseTo(r,op,r);return r}function bnSetBit(n){return this.changeBit(n,op_or)}function bnClearBit(n){return this.changeBit(n,op_andnot)}function bnFlipBit(n){return this.changeBit(n,op_xor)}function bnpAddTo(a,r){var i=0,c=0,m=Math.min(a.t,this.t);while(i<m){c+=this[i]+a[i];r[i++]=c&this.DM;c>>=this.DB}if(a.t<this.t){c+=a.s;while(i<this.t){c+=this[i];r[i++]=c&this.DM;c>>=this.DB}c+=this.s}else{c+=this.s;while(i<a.t){c+=a[i];r[i++]=c&this.DM;c>>=this.DB}c+=a.s}r.s=c<0?-1:0;if(c>0)r[i++]=c;else if(c<-1)r[i++]=this.DV+c;r.t=i;r.clamp()}function bnAdd(a){var r=nbi();this.addTo(a,r);return r}function bnSubtract(a){var r=nbi();this.subTo(a,r);return r}function bnMultiply(a){var r=nbi();this.multiplyTo(a,r);return r}function bnSquare(){var r=nbi();this.squareTo(r);return r}function bnDivide(a){var r=nbi();this.divRemTo(a,r,null);return r}function bnRemainder(a){var r=nbi();this.divRemTo(a,null,r);return r}function bnDivideAndRemainder(a){var q=nbi(),r=nbi();this.divRemTo(a,q,r);return new Array(q,r)}function bnpDMultiply(n){this[this.t]=this.am(0,n-1,this,0,0,this.t);++this.t;this.clamp()}function bnpDAddOffset(n,w){if(n==0)return;while(this.t<=w)this[this.t++]=0;this[w]+=n;while(this[w]>=this.DV){this[w]-=this.DV;if(++w>=this.t)this[this.t++]=0;++this[w]}}function NullExp(){}function nNop(x){return x}function nMulTo(x,y,r){x.multiplyTo(y,r)}function nSqrTo(x,r){x.squareTo(r)}NullExp.prototype.convert=nNop;NullExp.prototype.revert=nNop;NullExp.prototype.mulTo=nMulTo;NullExp.prototype.sqrTo=nSqrTo;function bnPow(e){return this.exp(e,new NullExp)}function bnpMultiplyLowerTo(a,n,r){var i=Math.min(this.t+a.t,n);r.s=0;r.t=i;while(i>0)r[--i]=0;var j;for(j=r.t-this.t;i<j;++i)r[i+this.t]=this.am(0,a[i],r,i,0,this.t);for(j=Math.min(a.t,n);i<j;++i)this.am(0,a[i],r,i,0,n-i);r.clamp()}function bnpMultiplyUpperTo(a,n,r){--n;var i=r.t=this.t+a.t-n;r.s=0;while(--i>=0)r[i]=0;for(i=Math.max(n-this.t,0);i<a.t;++i)r[this.t+i-n]=this.am(n-i,a[i],r,0,0,this.t+i-n);r.clamp();r.drShiftTo(1,r)}function Barrett(m){this.r2=nbi();this.q3=nbi();BigInteger.ONE.dlShiftTo(2*m.t,this.r2);this.mu=this.r2.divide(m);this.m=m}function barrettConvert(x){if(x.s<0||x.t>2*this.m.t)return x.mod(this.m);else if(x.compareTo(this.m)<0)return x;else{var r=nbi();x.copyTo(r);this.reduce(r);return r}}function barrettRevert(x){return x}function barrettReduce(x){x.drShiftTo(this.m.t-1,this.r2);if(x.t>this.m.t+1){x.t=this.m.t+1;x.clamp()}this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);while(x.compareTo(this.r2)<0)x.dAddOffset(1,this.m.t+1);x.subTo(this.r2,x);while(x.compareTo(this.m)>=0)x.subTo(this.m,x)}function barrettSqrTo(x,r){x.squareTo(r);this.reduce(r)}function barrettMulTo(x,y,r){x.multiplyTo(y,r);this.reduce(r)}Barrett.prototype.convert=barrettConvert;Barrett.prototype.revert=barrettRevert;Barrett.prototype.reduce=barrettReduce;Barrett.prototype.mulTo=barrettMulTo;Barrett.prototype.sqrTo=barrettSqrTo;function bnModPow(e,m){var i=e.bitLength(),k,r=nbv(1),z;if(i<=0)return r;else if(i<18)k=1;else if(i<48)k=3;else if(i<144)k=4;else if(i<768)k=5;else k=6;if(i<8)z=new Classic(m);else if(m.isEven())z=new Barrett(m);else z=new Montgomery(m);var g=new Array,n=3,k1=k-1,km=(1<<k)-1;g[1]=z.convert(this);if(k>1){var g2=nbi();z.sqrTo(g[1],g2);while(n<=km){g[n]=nbi();z.mulTo(g2,g[n-2],g[n]);n+=2}}var j=e.t-1,w,is1=true,r2=nbi(),t;i=nbits(e[j])-1;while(j>=0){if(i>=k1)w=e[j]>>i-k1&km;else{w=(e[j]&(1<<i+1)-1)<<k1-i;if(j>0)w|=e[j-1]>>this.DB+i-k1}n=k;while((w&1)==0){w>>=1;--n}if((i-=n)<0){i+=this.DB;--j}if(is1){g[w].copyTo(r);is1=false}else{while(n>1){z.sqrTo(r,r2);z.sqrTo(r2,r);n-=2}if(n>0)z.sqrTo(r,r2);else{t=r;r=r2;r2=t}z.mulTo(r2,g[w],r)}while(j>=0&&(e[j]&1<<i)==0){z.sqrTo(r,r2);t=r;r=r2;r2=t;if(--i<0){i=this.DB-1;--j}}}return z.revert(r)}function bnGCD(a){var x=this.s<0?this.negate():this.clone();var y=a.s<0?a.negate():a.clone();if(x.compareTo(y)<0){var t=x;x=y;y=t}var i=x.getLowestSetBit(),g=y.getLowestSetBit();if(g<0)return x;if(i<g)g=i;if(g>0){x.rShiftTo(g,x);y.rShiftTo(g,y)}while(x.signum()>0){if((i=x.getLowestSetBit())>0)x.rShiftTo(i,x);if((i=y.getLowestSetBit())>0)y.rShiftTo(i,y);if(x.compareTo(y)>=0){x.subTo(y,x);x.rShiftTo(1,x)}else{y.subTo(x,y);y.rShiftTo(1,y)}}if(g>0)y.lShiftTo(g,y);return y}function bnpModInt(n){if(n<=0)return 0;var d=this.DV%n,r=this.s<0?n-1:0;if(this.t>0)if(d==0)r=this[0]%n;else for(var i=this.t-1;i>=0;--i)r=(d*r+this[i])%n;return r}function bnModInverse(m){var ac=m.isEven();if(this.isEven()&&ac||m.signum()==0)return BigInteger.ZERO;var u=m.clone(),v=this.clone();var a=nbv(1),b=nbv(0),c=nbv(0),d=nbv(1);while(u.signum()!=0){while(u.isEven()){u.rShiftTo(1,u);if(ac){if(!a.isEven()||!b.isEven()){a.addTo(this,a);b.subTo(m,b)}a.rShiftTo(1,a)}else if(!b.isEven())b.subTo(m,b);b.rShiftTo(1,b)}while(v.isEven()){v.rShiftTo(1,v);if(ac){if(!c.isEven()||!d.isEven()){c.addTo(this,c);d.subTo(m,d)}c.rShiftTo(1,c)}else if(!d.isEven())d.subTo(m,d);d.rShiftTo(1,d)}if(u.compareTo(v)>=0){u.subTo(v,u);if(ac)a.subTo(c,a);b.subTo(d,b)}else{v.subTo(u,v);if(ac)c.subTo(a,c);d.subTo(b,d)}}if(v.compareTo(BigInteger.ONE)!=0)return BigInteger.ZERO;if(d.compareTo(m)>=0)return d.subtract(m);if(d.signum()<0)d.addTo(m,d);else return d;if(d.signum()<0)return d.add(m);else return d}var lowprimes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];var lplim=(1<<26)/lowprimes[lowprimes.length-1];function bnIsProbablePrime(t){var i,x=this.abs();if(x.t==1&&x[0]<=lowprimes[lowprimes.length-1]){for(i=0;i<lowprimes.length;++i)if(x[0]==lowprimes[i])return true;return false}if(x.isEven())return false;i=1;while(i<lowprimes.length){var m=lowprimes[i],j=i+1;while(j<lowprimes.length&&m<lplim)m*=lowprimes[j++];m=x.modInt(m);while(i<j)if(m%lowprimes[i++]==0)return false}return x.millerRabin(t)}function bnpMillerRabin(t){var n1=this.subtract(BigInteger.ONE);var k=n1.getLowestSetBit();if(k<=0)return false;var r=n1.shiftRight(k);t=t+1>>1;if(t>lowprimes.length)t=lowprimes.length;var a=nbi();for(var i=0;i<t;++i){a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);var y=a.modPow(r,this);if(y.compareTo(BigInteger.ONE)!=0&&y.compareTo(n1)!=0){var j=1;while(j++<k&&y.compareTo(n1)!=0){y=y.modPowInt(2,this);if(y.compareTo(BigInteger.ONE)==0)return false}if(y.compareTo(n1)!=0)return false}}return true}BigInteger.prototype.chunkSize=bnpChunkSize;BigInteger.prototype.toRadix=bnpToRadix;BigInteger.prototype.fromRadix=bnpFromRadix;BigInteger.prototype.fromNumber=bnpFromNumber;BigInteger.prototype.bitwiseTo=bnpBitwiseTo;BigInteger.prototype.changeBit=bnpChangeBit;BigInteger.prototype.addTo=bnpAddTo;BigInteger.prototype.dMultiply=bnpDMultiply;BigInteger.prototype.dAddOffset=bnpDAddOffset;BigInteger.prototype.multiplyLowerTo=bnpMultiplyLowerTo;BigInteger.prototype.multiplyUpperTo=bnpMultiplyUpperTo;BigInteger.prototype.modInt=bnpModInt;BigInteger.prototype.millerRabin=bnpMillerRabin;BigInteger.prototype.clone=bnClone;BigInteger.prototype.intValue=bnIntValue;BigInteger.prototype.byteValue=bnByteValue;BigInteger.prototype.shortValue=bnShortValue;BigInteger.prototype.signum=bnSigNum;BigInteger.prototype.toByteArray=bnToByteArray;BigInteger.prototype.equals=bnEquals;BigInteger.prototype.min=bnMin;BigInteger.prototype.max=bnMax;BigInteger.prototype.and=bnAnd;BigInteger.prototype.or=bnOr;BigInteger.prototype.xor=bnXor;BigInteger.prototype.andNot=bnAndNot;BigInteger.prototype.not=bnNot;BigInteger.prototype.shiftLeft=bnShiftLeft;BigInteger.prototype.shiftRight=bnShiftRight;BigInteger.prototype.getLowestSetBit=bnGetLowestSetBit;BigInteger.prototype.bitCount=bnBitCount;BigInteger.prototype.testBit=bnTestBit;BigInteger.prototype.setBit=bnSetBit;BigInteger.prototype.clearBit=bnClearBit;BigInteger.prototype.flipBit=bnFlipBit;BigInteger.prototype.add=bnAdd;BigInteger.prototype.subtract=bnSubtract;BigInteger.prototype.multiply=bnMultiply;BigInteger.prototype.divide=bnDivide;BigInteger.prototype.remainder=bnRemainder;BigInteger.prototype.divideAndRemainder=bnDivideAndRemainder;BigInteger.prototype.modPow=bnModPow;BigInteger.prototype.modInverse=bnModInverse;BigInteger.prototype.pow=bnPow;BigInteger.prototype.gcd=bnGCD;BigInteger.prototype.isProbablePrime=bnIsProbablePrime;BigInteger.prototype.square=bnSquare;function Arcfour(){this.i=0;this.j=0;this.S=new Array}function ARC4init(key){var i,j,t;for(i=0;i<256;++i)this.S[i]=i;j=0;for(i=0;i<256;++i){j=j+this.S[i]+key[i%key.length]&255;t=this.S[i];this.S[i]=this.S[j];this.S[j]=t}this.i=0;this.j=0}function ARC4next(){var t;this.i=this.i+1&255;this.j=this.j+this.S[this.i]&255;t=this.S[this.i];this.S[this.i]=this.S[this.j];this.S[this.j]=t;return this.S[t+this.S[this.i]&255]}Arcfour.prototype.init=ARC4init;Arcfour.prototype.next=ARC4next;function prng_newstate(){return new Arcfour}var rng_psize=256;var rng_state;var rng_pool;var rng_pptr;function rng_seed_int(x){rng_pool[rng_pptr++]^=x&255;rng_pool[rng_pptr++]^=x>>8&255;rng_pool[rng_pptr++]^=x>>16&255;rng_pool[rng_pptr++]^=x>>24&255;if(rng_pptr>=rng_psize)rng_pptr-=rng_psize}function rng_seed_time(){rng_seed_int((new Date).getTime())}if(rng_pool==null){rng_pool=new Array;rng_pptr=0;var t;if(navigator.appName=="Netscape"&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=z.charCodeAt(t)&255}while(rng_pptr<rng_psize){t=Math.floor(65536*Math.random());rng_pool[rng_pptr++]=t>>>8;rng_pool[rng_pptr++]=t&255}rng_pptr=0;rng_seed_time()}function rng_get_byte(){if(rng_state==null){rng_seed_time();rng_state=prng_newstate();rng_state.init(rng_pool);for(rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(ba){var i;for(i=0;i<ba.length;++i)ba[i]=rng_get_byte()}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;function parseBigInt(str,r){return new BigInteger(str,r)}function linebrk(s,n){var ret="";var i=0;while(i+n<s.length){ret+=s.substring(i,i+n)+"\n";i+=n}return ret+s.substring(i,s.length)}function byte2Hex(b){if(b<16)return"0"+b.toString(16);else return b.toString(16)}function pkcs1pad2(s,n){if(n<s.length+11){console.error("Message too long for RSA");return null}var ba=new Array;var i=s.length-1;while(i>=0&&n>0){var c=s.charCodeAt(i--);if(c<128){ba[--n]=c}else if(c>127&&c<2048){ba[--n]=c&63|128;ba[--n]=c>>6|192}else{ba[--n]=c&63|128;ba[--n]=c>>6&63|128;ba[--n]=c>>12|224}}ba[--n]=0;var rng=new SecureRandom;var x=new Array;while(n>2){x[0]=0;while(x[0]==0)rng.nextBytes(x);ba[--n]=x[0]}ba[--n]=2;ba[--n]=0;return new BigInteger(ba)}function RSAKey(){this.n=null;this.e=0;this.d=null;this.p=null;this.q=null;this.dmp1=null;this.dmq1=null;this.coeff=null}function RSASetPublic(N,E){if(N!=null&&E!=null&&N.length>0&&E.length>0){this.n=parseBigInt(N,16);this.e=parseInt(E,16)}else console.error("Invalid RSA public key")}function RSADoPublic(x){return x.modPowInt(this.e,this.n)}function RSAEncrypt(text){var m=pkcs1pad2(text,this.n.bitLength()+7>>3);if(m==null)return null;var c=this.doPublic(m);if(c==null)return null;var h=c.toString(16);if((h.length&1)==0)return h;else return"0"+h}RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt;function pkcs1unpad2(d,n){var b=d.toByteArray();var i=0;while(i<b.length&&b[i]==0)++i;if(b.length-i!=n-1||b[i]!=2)return null;++i;while(b[i]!=0)if(++i>=b.length)return null;var ret="";while(++i<b.length){var c=b[i]&255;if(c<128){ret+=String.fromCharCode(c)}else if(c>191&&c<224){ret+=String.fromCharCode((c&31)<<6|b[i+1]&63);++i}else{ret+=String.fromCharCode((c&15)<<12|(b[i+1]&63)<<6|b[i+2]&63);i+=2}}return ret}function RSASetPrivate(N,E,D){if(N!=null&&E!=null&&N.length>0&&E.length>0){this.n=parseBigInt(N,16);this.e=parseInt(E,16);this.d=parseBigInt(D,16)}else console.error("Invalid RSA private key")}function RSASetPrivateEx(N,E,D,P,Q,DP,DQ,C){if(N!=null&&E!=null&&N.length>0&&E.length>0){this.n=parseBigInt(N,16);this.e=parseInt(E,16);this.d=parseBigInt(D,16);this.p=parseBigInt(P,16);this.q=parseBigInt(Q,16);this.dmp1=parseBigInt(DP,16);this.dmq1=parseBigInt(DQ,16);this.coeff=parseBigInt(C,16)}else console.error("Invalid RSA private key")}function RSAGenerate(B,E){var rng=new SecureRandom;var qs=B>>1;this.e=parseInt(E,16);var ee=new BigInteger(E,16);for(;;){for(;;){this.p=new BigInteger(B-qs,1,rng);if(this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE)==0&&this.p.isProbablePrime(10))break}for(;;){this.q=new BigInteger(qs,1,rng);if(this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE)==0&&this.q.isProbablePrime(10))break}if(this.p.compareTo(this.q)<=0){var t=this.p;this.p=this.q;this.q=t}var p1=this.p.subtract(BigInteger.ONE);var q1=this.q.subtract(BigInteger.ONE);var phi=p1.multiply(q1);if(phi.gcd(ee).compareTo(BigInteger.ONE)==0){this.n=this.p.multiply(this.q);this.d=ee.modInverse(phi);this.dmp1=this.d.mod(p1);this.dmq1=this.d.mod(q1);this.coeff=this.q.modInverse(this.p);break}}}function RSADoPrivate(x){if(this.p==null||this.q==null)return x.modPow(this.d,this.n);var xp=x.mod(this.p).modPow(this.dmp1,this.p);var xq=x.mod(this.q).modPow(this.dmq1,this.q);while(xp.compareTo(xq)<0)xp=xp.add(this.p);return xp.subtract(xq).multiply(this.coeff).mod(this.p).multiply(this.q).add(xq)}function RSADecrypt(ctext){var c=parseBigInt(ctext,16);var m=this.doPrivate(c);if(m==null)return null;return pkcs1unpad2(m,this.n.bitLength()+7>>3)}RSAKey.prototype.doPrivate=RSADoPrivate;RSAKey.prototype.setPrivate=RSASetPrivate;RSAKey.prototype.setPrivateEx=RSASetPrivateEx;RSAKey.prototype.generate=RSAGenerate;RSAKey.prototype.decrypt=RSADecrypt;(function(){var RSAGenerateAsync=function(B,E,callback){var rng=new SecureRandom;var qs=B>>1;this.e=parseInt(E,16);var ee=new BigInteger(E,16);var rsa=this;var loop1=function(){var loop4=function(){if(rsa.p.compareTo(rsa.q)<=0){var t=rsa.p;rsa.p=rsa.q;rsa.q=t}var p1=rsa.p.subtract(BigInteger.ONE);var q1=rsa.q.subtract(BigInteger.ONE);var phi=p1.multiply(q1);if(phi.gcd(ee).compareTo(BigInteger.ONE)==0){rsa.n=rsa.p.multiply(rsa.q);rsa.d=ee.modInverse(phi);rsa.dmp1=rsa.d.mod(p1);rsa.dmq1=rsa.d.mod(q1);rsa.coeff=rsa.q.modInverse(rsa.p);setTimeout(function(){callback()},0)}else{setTimeout(loop1,0)}};var loop3=function(){rsa.q=nbi();rsa.q.fromNumberAsync(qs,1,rng,function(){rsa.q.subtract(BigInteger.ONE).gcda(ee,function(r){if(r.compareTo(BigInteger.ONE)==0&&rsa.q.isProbablePrime(10)){setTimeout(loop4,0)}else{setTimeout(loop3,0)}})})};var loop2=function(){rsa.p=nbi();rsa.p.fromNumberAsync(B-qs,1,rng,function(){rsa.p.subtract(BigInteger.ONE).gcda(ee,function(r){if(r.compareTo(BigInteger.ONE)==0&&rsa.p.isProbablePrime(10)){setTimeout(loop3,0)}else{setTimeout(loop2,0)}})})};setTimeout(loop2,0)};setTimeout(loop1,0)};RSAKey.prototype.generateAsync=RSAGenerateAsync;var bnGCDAsync=function(a,callback){var x=this.s<0?this.negate():this.clone();var y=a.s<0?a.negate():a.clone();if(x.compareTo(y)<0){var t=x;x=y;y=t}var i=x.getLowestSetBit(),g=y.getLowestSetBit();if(g<0){callback(x);return}if(i<g)g=i;if(g>0){x.rShiftTo(g,x);y.rShiftTo(g,y)}var gcda1=function(){if((i=x.getLowestSetBit())>0){x.rShiftTo(i,x)}if((i=y.getLowestSetBit())>0){y.rShiftTo(i,y)}if(x.compareTo(y)>=0){x.subTo(y,x);x.rShiftTo(1,x)}else{y.subTo(x,y);y.rShiftTo(1,y)}if(!(x.signum()>0)){if(g>0)y.lShiftTo(g,y);setTimeout(function(){callback(y)},0)}else{setTimeout(gcda1,0)}};setTimeout(gcda1,10)};BigInteger.prototype.gcda=bnGCDAsync;var bnpFromNumberAsync=function(a,b,c,callback){if("number"==typeof b){if(a<2){this.fromInt(1)}else{this.fromNumber(a,c);if(!this.testBit(a-1)){this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this)}if(this.isEven()){this.dAddOffset(1,0)}var bnp=this;var bnpfn1=function(){bnp.dAddOffset(2,0);if(bnp.bitLength()>a)bnp.subTo(BigInteger.ONE.shiftLeft(a-1),bnp);if(bnp.isProbablePrime(b)){setTimeout(function(){callback()},0)}else{setTimeout(bnpfn1,0)}};setTimeout(bnpfn1,0)}}else{var x=new Array,t=a&7;x.length=(a>>3)+1;b.nextBytes(x);if(t>0)x[0]&=(1<<t)-1;else x[0]=0;this.fromString(x,256)}};BigInteger.prototype.fromNumberAsync=bnpFromNumberAsync})();var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var b64pad="=";function hex2b64(h){var i;var c;var ret="";for(i=0;i+3<=h.length;i+=3){c=parseInt(h.substring(i,i+3),16);ret+=b64map.charAt(c>>6)+b64map.charAt(c&63)}if(i+1==h.length){c=parseInt(h.substring(i,i+1),16);ret+=b64map.charAt(c<<2)}else if(i+2==h.length){c=parseInt(h.substring(i,i+2),16);ret+=b64map.charAt(c>>2)+b64map.charAt((c&3)<<4)}while((ret.length&3)>0)ret+=b64pad;return ret}function b64tohex(s){var ret="";var i;var k=0;var slop;for(i=0;i<s.length;++i){if(s.charAt(i)==b64pad)break;v=b64map.indexOf(s.charAt(i));if(v<0)continue;if(k==0){ret+=int2char(v>>2);slop=v&3;k=1}else if(k==1){ret+=int2char(slop<<2|v>>4);slop=v&15;k=2}else if(k==2){ret+=int2char(slop);ret+=int2char(v>>2);slop=v&3;k=3}else{ret+=int2char(slop<<2|v>>4);ret+=int2char(v&15);k=0}}if(k==1)ret+=int2char(slop<<2);return ret}function b64toBA(s){var h=b64tohex(s);var i;var a=new Array;for(i=0;2*i<h.length;++i){a[i]=parseInt(h.substring(2*i,2*i+2),16)}return a}var JSX=JSX||{};JSX.env=JSX.env||{};var L=JSX,OP=Object.prototype,FUNCTION_TOSTRING="[object Function]",ADD=["toString","valueOf"];JSX.env.parseUA=function(agent){var numberify=function(s){var c=0;return parseFloat(s.replace(/\./g,function(){return c++==1?"":"."}))},nav=navigator,o={ie:0,opera:0,gecko:0,webkit:0,chrome:0,mobile:null,air:0,ipad:0,iphone:0,ipod:0,ios:null,android:0,webos:0,caja:nav&&nav.cajaVersion,secure:false,os:null},ua=agent||navigator&&navigator.userAgent,loc=window&&window.location,href=loc&&loc.href,m;o.secure=href&&href.toLowerCase().indexOf("https")===0;if(ua){if(/windows|win32/i.test(ua)){o.os="windows"}else if(/macintosh/i.test(ua)){o.os="macintosh"}else if(/rhino/i.test(ua)){o.os="rhino"}if(/KHTML/.test(ua)){o.webkit=1}m=ua.match(/AppleWebKit\/([^\s]*)/);if(m&&m[1]){o.webkit=numberify(m[1]);if(/ Mobile\//.test(ua)){o.mobile="Apple";m=ua.match(/OS ([^\s]*)/);if(m&&m[1]){m=numberify(m[1].replace("_","."))}o.ios=m;o.ipad=o.ipod=o.iphone=0;m=ua.match(/iPad|iPod|iPhone/);if(m&&m[0]){o[m[0].toLowerCase()]=o.ios}}else{m=ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);if(m){o.mobile=m[0]}if(/webOS/.test(ua)){o.mobile="WebOS";m=ua.match(/webOS\/([^\s]*);/);if(m&&m[1]){o.webos=numberify(m[1])}}if(/ Android/.test(ua)){o.mobile="Android";m=ua.match(/Android ([^\s]*);/);if(m&&m[1]){o.android=numberify(m[1])}}}m=ua.match(/Chrome\/([^\s]*)/);if(m&&m[1]){o.chrome=numberify(m[1])}else{m=ua.match(/AdobeAIR\/([^\s]*)/);if(m){o.air=m[0]}}}if(!o.webkit){m=ua.match(/Opera[\s\/]([^\s]*)/);if(m&&m[1]){o.opera=numberify(m[1]);m=ua.match(/Version\/([^\s]*)/);if(m&&m[1]){o.opera=numberify(m[1])}m=ua.match(/Opera Mini[^;]*/);if(m){o.mobile=m[0]}}else{m=ua.match(/MSIE\s([^;]*)/);if(m&&m[1]){o.ie=numberify(m[1])}else{m=ua.match(/Gecko\/([^\s]*)/);if(m){o.gecko=1;m=ua.match(/rv:([^\s\)]*)/);if(m&&m[1]){o.gecko=numberify(m[1])}}}}}}return o};JSX.env.ua=JSX.env.parseUA();JSX.isFunction=function(o){return typeof o==="function"||OP.toString.apply(o)===FUNCTION_TOSTRING};JSX._IEEnumFix=JSX.env.ua.ie?function(r,s){var i,fname,f;for(i=0;i<ADD.length;i=i+1){fname=ADD[i];f=s[fname];if(L.isFunction(f)&&f!=OP[fname]){r[fname]=f}}}:function(){};JSX.extend=function(subc,superc,overrides){if(!superc||!subc){throw new Error("extend failed, please check that "+"all dependencies are included.")}var F=function(){},i;F.prototype=superc.prototype;subc.prototype=new F;subc.prototype.constructor=subc;subc.superclass=superc.prototype;if(superc.prototype.constructor==OP.constructor){superc.prototype.constructor=superc}if(overrides){for(i in overrides){if(L.hasOwnProperty(overrides,i)){subc.prototype[i]=overrides[i]}}L._IEEnumFix(subc.prototype,overrides)}};if(typeof KJUR=="undefined"||!KJUR)KJUR={};if(typeof KJUR.asn1=="undefined"||!KJUR.asn1)KJUR.asn1={};KJUR.asn1.ASN1Util=new function(){this.integerToByteHex=function(i){var h=i.toString(16);if(h.length%2==1)h="0"+h;return h};this.bigIntToMinTwosComplementsHex=function(bigIntegerValue){var h=bigIntegerValue.toString(16);if(h.substr(0,1)!="-"){if(h.length%2==1){h="0"+h}else{if(!h.match(/^[0-7]/)){h="00"+h}}}else{var hPos=h.substr(1);var xorLen=hPos.length;if(xorLen%2==1){xorLen+=1}else{if(!h.match(/^[0-7]/)){xorLen+=2}}var hMask="";for(var i=0;i<xorLen;i++){hMask+="f"}var biMask=new BigInteger(hMask,16);var biNeg=biMask.xor(bigIntegerValue).add(BigInteger.ONE);h=biNeg.toString(16).replace(/^-/,"")}return h};this.getPEMStringFromHex=function(dataHex,pemHeader){var dataWA=CryptoJS.enc.Hex.parse(dataHex);var dataB64=CryptoJS.enc.Base64.stringify(dataWA);var pemBody=dataB64.replace(/(.{64})/g,"$1\r\n");pemBody=pemBody.replace(/\r\n$/,"");return"-----BEGIN "+pemHeader+"-----\r\n"+pemBody+"\r\n-----END "+pemHeader+"-----\r\n"}};KJUR.asn1.ASN1Object=function(){var isModified=true;var hTLV=null;var hT="00";var hL="00";var hV="";this.getLengthHexFromValue=function(){if(typeof this.hV=="undefined"||this.hV==null){throw"this.hV is null or undefined."}if(this.hV.length%2==1){throw"value hex must be even length: n="+hV.length+",v="+this.hV}var n=this.hV.length/2;var hN=n.toString(16);if(hN.length%2==1){hN="0"+hN}if(n<128){return hN}else{var hNlen=hN.length/2;if(hNlen>15){throw"ASN.1 length too long to represent by 8x: n = "+n.toString(16)}var head=128+hNlen;return head.toString(16)+hN}};this.getEncodedHex=function(){if(this.hTLV==null||this.isModified){this.hV=this.getFreshValueHex();this.hL=this.getLengthHexFromValue();this.hTLV=this.hT+this.hL+this.hV;this.isModified=false}return this.hTLV};this.getValueHex=function(){this.getEncodedHex();return this.hV};this.getFreshValueHex=function(){return""}};KJUR.asn1.DERAbstractString=function(params){KJUR.asn1.DERAbstractString.superclass.constructor.call(this);var s=null;var hV=null;this.getString=function(){return this.s};this.setString=function(newS){this.hTLV=null;this.isModified=true;this.s=newS;this.hV=stohex(this.s)};this.setStringHex=function(newHexString){this.hTLV=null;this.isModified=true;this.s=null;this.hV=newHexString};this.getFreshValueHex=function(){return this.hV};if(typeof params!="undefined"){if(typeof params["str"]!="undefined"){this.setString(params["str"])}else if(typeof params["hex"]!="undefined"){this.setStringHex(params["hex"])}}};JSX.extend(KJUR.asn1.DERAbstractString,KJUR.asn1.ASN1Object);KJUR.asn1.DERAbstractTime=function(params){KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);var s=null;var date=null;this.localDateToUTC=function(d){utc=d.getTime()+d.getTimezoneOffset()*6e4;var utcDate=new Date(utc);return utcDate};this.formatDate=function(dateObject,type){var pad=this.zeroPadding;var d=this.localDateToUTC(dateObject);var year=String(d.getFullYear());if(type=="utc")year=year.substr(2,2);var month=pad(String(d.getMonth()+1),2);var day=pad(String(d.getDate()),2);var hour=pad(String(d.getHours()),2);var min=pad(String(d.getMinutes()),2);var sec=pad(String(d.getSeconds()),2);return year+month+day+hour+min+sec+"Z"};this.zeroPadding=function(s,len){if(s.length>=len)return s;return new Array(len-s.length+1).join("0")+s};this.getString=function(){return this.s};this.setString=function(newS){this.hTLV=null;this.isModified=true;this.s=newS;this.hV=stohex(this.s)};this.setByDateValue=function(year,month,day,hour,min,sec){var dateObject=new Date(Date.UTC(year,month-1,day,hour,min,sec,0));this.setByDate(dateObject)};this.getFreshValueHex=function(){return this.hV}};JSX.extend(KJUR.asn1.DERAbstractTime,KJUR.asn1.ASN1Object);KJUR.asn1.DERAbstractStructured=function(params){KJUR.asn1.DERAbstractString.superclass.constructor.call(this);var asn1Array=null;this.setByASN1ObjectArray=function(asn1ObjectArray){this.hTLV=null;this.isModified=true;this.asn1Array=asn1ObjectArray};this.appendASN1Object=function(asn1Object){this.hTLV=null;this.isModified=true;this.asn1Array.push(asn1Object)};this.asn1Array=new Array;if(typeof params!="undefined"){if(typeof params["array"]!="undefined"){this.asn1Array=params["array"]}}};JSX.extend(KJUR.asn1.DERAbstractStructured,KJUR.asn1.ASN1Object);KJUR.asn1.DERBoolean=function(){KJUR.asn1.DERBoolean.superclass.constructor.call(this);this.hT="01";this.hTLV="0101ff"};JSX.extend(KJUR.asn1.DERBoolean,KJUR.asn1.ASN1Object);KJUR.asn1.DERInteger=function(params){KJUR.asn1.DERInteger.superclass.constructor.call(this);this.hT="02";this.setByBigInteger=function(bigIntegerValue){this.hTLV=null;this.isModified=true;this.hV=KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue)};this.setByInteger=function(intValue){var bi=new BigInteger(String(intValue),10);this.setByBigInteger(bi)};this.setValueHex=function(newHexString){this.hV=newHexString};this.getFreshValueHex=function(){return this.hV};if(typeof params!="undefined"){if(typeof params["bigint"]!="undefined"){this.setByBigInteger(params["bigint"])}else if(typeof params["int"]!="undefined"){this.setByInteger(params["int"])}else if(typeof params["hex"]!="undefined"){this.setValueHex(params["hex"])}}};JSX.extend(KJUR.asn1.DERInteger,KJUR.asn1.ASN1Object);KJUR.asn1.DERBitString=function(params){KJUR.asn1.DERBitString.superclass.constructor.call(this);this.hT="03";this.setHexValueIncludingUnusedBits=function(newHexStringIncludingUnusedBits){this.hTLV=null;this.isModified=true;this.hV=newHexStringIncludingUnusedBits};this.setUnusedBitsAndHexValue=function(unusedBits,hValue){if(unusedBits<0||7<unusedBits){throw"unused bits shall be from 0 to 7: u = "+unusedBits}var hUnusedBits="0"+unusedBits;this.hTLV=null;this.isModified=true;this.hV=hUnusedBits+hValue};this.setByBinaryString=function(binaryString){binaryString=binaryString.replace(/0+$/,"");var unusedBits=8-binaryString.length%8;if(unusedBits==8)unusedBits=0;for(var i=0;i<=unusedBits;i++){binaryString+="0"}var h="";for(var i=0;i<binaryString.length-1;i+=8){var b=binaryString.substr(i,8);var x=parseInt(b,2).toString(16);if(x.length==1)x="0"+x;h+=x}this.hTLV=null;this.isModified=true;this.hV="0"+unusedBits+h};this.setByBooleanArray=function(booleanArray){var s="";for(var i=0;i<booleanArray.length;i++){if(booleanArray[i]==true){s+="1"}else{s+="0"}}this.setByBinaryString(s)};this.newFalseArray=function(nLength){var a=new Array(nLength);for(var i=0;i<nLength;i++){a[i]=false}return a};this.getFreshValueHex=function(){return this.hV};if(typeof params!="undefined"){if(typeof params["hex"]!="undefined"){this.setHexValueIncludingUnusedBits(params["hex"])}else if(typeof params["bin"]!="undefined"){this.setByBinaryString(params["bin"])}else if(typeof params["array"]!="undefined"){this.setByBooleanArray(params["array"])}}};JSX.extend(KJUR.asn1.DERBitString,KJUR.asn1.ASN1Object);KJUR.asn1.DEROctetString=function(params){KJUR.asn1.DEROctetString.superclass.constructor.call(this,params);this.hT="04"};JSX.extend(KJUR.asn1.DEROctetString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERNull=function(){KJUR.asn1.DERNull.superclass.constructor.call(this);this.hT="05";this.hTLV="0500"};JSX.extend(KJUR.asn1.DERNull,KJUR.asn1.ASN1Object);KJUR.asn1.DERObjectIdentifier=function(params){var itox=function(i){var h=i.toString(16);if(h.length==1)h="0"+h;return h};var roidtox=function(roid){var h="";var bi=new BigInteger(roid,10);var b=bi.toString(2);var padLen=7-b.length%7;if(padLen==7)padLen=0;var bPad="";for(var i=0;i<padLen;i++)bPad+="0";b=bPad+b;for(var i=0;i<b.length-1;i+=7){var b8=b.substr(i,7);if(i!=b.length-7)b8="1"+b8;h+=itox(parseInt(b8,2))}return h};KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);this.hT="06";this.setValueHex=function(newHexString){this.hTLV=null;this.isModified=true;this.s=null;this.hV=newHexString};this.setValueOidString=function(oidString){if(!oidString.match(/^[0-9.]+$/)){throw"malformed oid string: "+oidString}var h="";var a=oidString.split(".");var i0=parseInt(a[0])*40+parseInt(a[1]);h+=itox(i0);a.splice(0,2);for(var i=0;i<a.length;i++){h+=roidtox(a[i])}this.hTLV=null;this.isModified=true;this.s=null;this.hV=h};this.setValueName=function(oidName){if(typeof KJUR.asn1.x509.OID.name2oidList[oidName]!="undefined"){var oid=KJUR.asn1.x509.OID.name2oidList[oidName];this.setValueOidString(oid)}else{throw"DERObjectIdentifier oidName undefined: "+oidName}};this.getFreshValueHex=function(){return this.hV};if(typeof params!="undefined"){if(typeof params["oid"]!="undefined"){this.setValueOidString(params["oid"])}else if(typeof params["hex"]!="undefined"){this.setValueHex(params["hex"])}else if(typeof params["name"]!="undefined"){this.setValueName(params["name"])}}};JSX.extend(KJUR.asn1.DERObjectIdentifier,KJUR.asn1.ASN1Object);KJUR.asn1.DERUTF8String=function(params){KJUR.asn1.DERUTF8String.superclass.constructor.call(this,params);this.hT="0c"};JSX.extend(KJUR.asn1.DERUTF8String,KJUR.asn1.DERAbstractString);KJUR.asn1.DERNumericString=function(params){KJUR.asn1.DERNumericString.superclass.constructor.call(this,params);this.hT="12"};JSX.extend(KJUR.asn1.DERNumericString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERPrintableString=function(params){KJUR.asn1.DERPrintableString.superclass.constructor.call(this,params);this.hT="13"};JSX.extend(KJUR.asn1.DERPrintableString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERTeletexString=function(params){KJUR.asn1.DERTeletexString.superclass.constructor.call(this,params);this.hT="14"};JSX.extend(KJUR.asn1.DERTeletexString,KJUR.asn1.DERAbstractString);KJUR.asn1.DERIA5String=function(params){KJUR.asn1.DERIA5String.superclass.constructor.call(this,params);this.hT="16"};JSX.extend(KJUR.asn1.DERIA5String,KJUR.asn1.DERAbstractString);KJUR.asn1.DERUTCTime=function(params){KJUR.asn1.DERUTCTime.superclass.constructor.call(this,params);this.hT="17";this.setByDate=function(dateObject){this.hTLV=null;this.isModified=true;this.date=dateObject;this.s=this.formatDate(this.date,"utc");this.hV=stohex(this.s)};if(typeof params!="undefined"){if(typeof params["str"]!="undefined"){this.setString(params["str"])}else if(typeof params["hex"]!="undefined"){this.setStringHex(params["hex"])}else if(typeof params["date"]!="undefined"){this.setByDate(params["date"])}}};JSX.extend(KJUR.asn1.DERUTCTime,KJUR.asn1.DERAbstractTime);KJUR.asn1.DERGeneralizedTime=function(params){KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this,params);this.hT="18";this.setByDate=function(dateObject){this.hTLV=null;this.isModified=true;this.date=dateObject;this.s=this.formatDate(this.date,"gen");this.hV=stohex(this.s)};if(typeof params!="undefined"){if(typeof params["str"]!="undefined"){this.setString(params["str"])}else if(typeof params["hex"]!="undefined"){this.setStringHex(params["hex"])}else if(typeof params["date"]!="undefined"){this.setByDate(params["date"])}}};JSX.extend(KJUR.asn1.DERGeneralizedTime,KJUR.asn1.DERAbstractTime);KJUR.asn1.DERSequence=function(params){KJUR.asn1.DERSequence.superclass.constructor.call(this,params);this.hT="30";this.getFreshValueHex=function(){var h="";for(var i=0;i<this.asn1Array.length;i++){var asn1Obj=this.asn1Array[i];h+=asn1Obj.getEncodedHex()}this.hV=h;return this.hV}};JSX.extend(KJUR.asn1.DERSequence,KJUR.asn1.DERAbstractStructured);KJUR.asn1.DERSet=function(params){KJUR.asn1.DERSet.superclass.constructor.call(this,params);this.hT="31";this.getFreshValueHex=function(){var a=new Array;for(var i=0;i<this.asn1Array.length;i++){var asn1Obj=this.asn1Array[i];a.push(asn1Obj.getEncodedHex())}a.sort();this.hV=a.join("");return this.hV}};JSX.extend(KJUR.asn1.DERSet,KJUR.asn1.DERAbstractStructured);KJUR.asn1.DERTaggedObject=function(params){KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);this.hT="a0";this.hV="";this.isExplicit=true;this.asn1Object=null;this.setASN1Object=function(isExplicitFlag,tagNoHex,asn1Object){this.hT=tagNoHex;this.isExplicit=isExplicitFlag;this.asn1Object=asn1Object;if(this.isExplicit){this.hV=this.asn1Object.getEncodedHex();this.hTLV=null;this.isModified=true}else{this.hV=null;this.hTLV=asn1Object.getEncodedHex();this.hTLV=this.hTLV.replace(/^../,tagNoHex);this.isModified=false}};this.getFreshValueHex=function(){return this.hV};if(typeof params!="undefined"){if(typeof params["tag"]!="undefined"){this.hT=params["tag"]}if(typeof params["explicit"]!="undefined"){this.isExplicit=params["explicit"]}if(typeof params["obj"]!="undefined"){this.asn1Object=params["obj"];this.setASN1Object(this.isExplicit,this.hT,this.asn1Object)}}};JSX.extend(KJUR.asn1.DERTaggedObject,KJUR.asn1.ASN1Object);(function(undefined){"use strict";var Hex={},decoder;Hex.decode=function(a){var i;if(decoder===undefined){var hex="0123456789ABCDEF",ignore=" \f\n\r\t \u2028\u2029";decoder=[];for(i=0;i<16;++i)decoder[hex.charAt(i)]=i;hex=hex.toLowerCase();for(i=10;i<16;++i)decoder[hex.charAt(i)]=i;for(i=0;i<ignore.length;++i)decoder[ignore.charAt(i)]=-1}var out=[],bits=0,char_count=0;for(i=0;i<a.length;++i){var c=a.charAt(i);if(c=="=")break;c=decoder[c];if(c==-1)continue;if(c===undefined)throw"Illegal character at offset "+i;bits|=c;if(++char_count>=2){out[out.length]=bits;bits=0;char_count=0}else{bits<<=4}}if(char_count)throw"Hex encoding incomplete: 4 bits missing";return out};window.Hex=Hex})();(function(undefined){"use strict";var Base64={},decoder;Base64.decode=function(a){var i;if(decoder===undefined){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ignore="= \f\n\r\t \u2028\u2029";decoder=[];for(i=0;i<64;++i)decoder[b64.charAt(i)]=i;for(i=0;i<ignore.length;++i)decoder[ignore.charAt(i)]=-1}var out=[];var bits=0,char_count=0;for(i=0;i<a.length;++i){var c=a.charAt(i);if(c=="=")break;c=decoder[c];if(c==-1)continue;if(c===undefined)throw"Illegal character at offset "+i;bits|=c;if(++char_count>=4){out[out.length]=bits>>16;out[out.length]=bits>>8&255;out[out.length]=bits&255;bits=0;char_count=0}else{bits<<=6}}switch(char_count){case 1:throw"Base64 encoding incomplete: at least 2 bits missing";case 2:out[out.length]=bits>>10;break;case 3:out[out.length]=bits>>16;out[out.length]=bits>>8&255;break}return out};Base64.re=/-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/;Base64.unarmor=function(a){var m=Base64.re.exec(a);if(m){if(m[1])a=m[1];else if(m[2])a=m[2];else throw"RegExp out of sync"}return Base64.decode(a)};window.Base64=Base64})();(function(undefined){"use strict";var hardLimit=100,ellipsis="…",DOM={tag:function(tagName,className){var t=document.createElement(tagName);t.className=className;return t},text:function(str){return document.createTextNode(str)}};function Stream(enc,pos){if(enc instanceof Stream){this.enc=enc.enc;this.pos=enc.pos}else{this.enc=enc;this.pos=pos}}Stream.prototype.get=function(pos){if(pos===undefined)pos=this.pos++;if(pos>=this.enc.length)throw"Requesting byte offset "+pos+" on a stream of length "+this.enc.length;return this.enc[pos]};Stream.prototype.hexDigits="0123456789ABCDEF";Stream.prototype.hexByte=function(b){return this.hexDigits.charAt(b>>4&15)+this.hexDigits.charAt(b&15)};Stream.prototype.hexDump=function(start,end,raw){var s="";for(var i=start;i<end;++i){s+=this.hexByte(this.get(i));if(raw!==true)switch(i&15){case 7:s+="  ";break;case 15:s+="\n";break;default:s+=" "}}return s};Stream.prototype.parseStringISO=function(start,end){var s="";for(var i=start;i<end;++i)s+=String.fromCharCode(this.get(i));return s};Stream.prototype.parseStringUTF=function(start,end){var s="";for(var i=start;i<end;){var c=this.get(i++);if(c<128)s+=String.fromCharCode(c);else if(c>191&&c<224)s+=String.fromCharCode((c&31)<<6|this.get(i++)&63);else s+=String.fromCharCode((c&15)<<12|(this.get(i++)&63)<<6|this.get(i++)&63)}return s};Stream.prototype.parseStringBMP=function(start,end){var str="";for(var i=start;i<end;i+=2){var high_byte=this.get(i);var low_byte=this.get(i+1);str+=String.fromCharCode((high_byte<<8)+low_byte)}return str};Stream.prototype.reTime=/^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;Stream.prototype.parseTime=function(start,end){var s=this.parseStringISO(start,end),m=this.reTime.exec(s);if(!m)return"Unrecognized time: "+s;s=m[1]+"-"+m[2]+"-"+m[3]+" "+m[4];if(m[5]){s+=":"+m[5];if(m[6]){s+=":"+m[6];if(m[7])s+="."+m[7]}}if(m[8]){s+=" UTC";if(m[8]!="Z"){s+=m[8];if(m[9])s+=":"+m[9]}}return s};Stream.prototype.parseInteger=function(start,end){var len=end-start;if(len>4){len<<=3;var s=this.get(start);if(s===0)len-=8;else while(s<128){s<<=1;--len}return"("+len+" bit)"}var n=0;for(var i=start;i<end;++i)n=n<<8|this.get(i);return n};Stream.prototype.parseBitString=function(start,end){var unusedBit=this.get(start),lenBit=(end-start-1<<3)-unusedBit,s="("+lenBit+" bit)";if(lenBit<=20){var skip=unusedBit;s+=" ";for(var i=end-1;i>start;--i){var b=this.get(i);for(var j=skip;j<8;++j)s+=b>>j&1?"1":"0";skip=0}}return s};Stream.prototype.parseOctetString=function(start,end){var len=end-start,s="("+len+" byte) ";if(len>hardLimit)end=start+hardLimit;for(var i=start;i<end;++i)s+=this.hexByte(this.get(i));if(len>hardLimit)s+=ellipsis;return s};Stream.prototype.parseOID=function(start,end){var s="",n=0,bits=0;for(var i=start;i<end;++i){var v=this.get(i);n=n<<7|v&127;bits+=7;if(!(v&128)){if(s===""){var m=n<80?n<40?0:1:2;s=m+"."+(n-m*40)}else s+="."+(bits>=31?"bigint":n);n=bits=0}}return s};function ASN1(stream,header,length,tag,sub){this.stream=stream;this.header=header;this.length=length;this.tag=tag;this.sub=sub}ASN1.prototype.typeName=function(){if(this.tag===undefined)return"unknown";var tagClass=this.tag>>6,tagConstructed=this.tag>>5&1,tagNumber=this.tag&31;switch(tagClass){case 0:switch(tagNumber){case 0:return"EOC";case 1:return"BOOLEAN";case 2:return"INTEGER";case 3:return"BIT_STRING";case 4:return"OCTET_STRING";case 5:return"NULL";case 6:return"OBJECT_IDENTIFIER";case 7:return"ObjectDescriptor";case 8:return"EXTERNAL";case 9:return"REAL";case 10:return"ENUMERATED";case 11:return"EMBEDDED_PDV";case 12:return"UTF8String";case 16:return"SEQUENCE";case 17:return"SET";case 18:return"NumericString";case 19:return"PrintableString";case 20:return"TeletexString";case 21:return"VideotexString";case 22:return"IA5String";case 23:return"UTCTime";case 24:return"GeneralizedTime";case 25:return"GraphicString";case 26:return"VisibleString";case 27:return"GeneralString";case 28:return"UniversalString";case 30:return"BMPString";default:return"Universal_"+tagNumber.toString(16)}case 1:return"Application_"+tagNumber.toString(16);case 2:return"["+tagNumber+"]";case 3:return"Private_"+tagNumber.toString(16)}};ASN1.prototype.reSeemsASCII=/^[ -~]+$/;ASN1.prototype.content=function(){if(this.tag===undefined)return null;var tagClass=this.tag>>6,tagNumber=this.tag&31,content=this.posContent(),len=Math.abs(this.length);if(tagClass!==0){if(this.sub!==null)return"("+this.sub.length+" elem)";var s=this.stream.parseStringISO(content,content+Math.min(len,hardLimit));if(this.reSeemsASCII.test(s))return s.substring(0,2*hardLimit)+(s.length>2*hardLimit?ellipsis:"");else return this.stream.parseOctetString(content,content+len)}switch(tagNumber){case 1:return this.stream.get(content)===0?"false":"true";case 2:return this.stream.parseInteger(content,content+len);case 3:return this.sub?"("+this.sub.length+" elem)":this.stream.parseBitString(content,content+len);case 4:return this.sub?"("+this.sub.length+" elem)":this.stream.parseOctetString(content,content+len);case 6:return this.stream.parseOID(content,content+len);case 16:case 17:return"("+this.sub.length+" elem)";case 12:return this.stream.parseStringUTF(content,content+len);case 18:case 19:case 20:case 21:case 22:case 26:return this.stream.parseStringISO(content,content+len);case 30:return this.stream.parseStringBMP(content,content+len);case 23:case 24:return this.stream.parseTime(content,content+len)}return null};ASN1.prototype.toString=function(){return this.typeName()+"@"+this.stream.pos+"[header:"+this.header+",length:"+this.length+",sub:"+(this.sub===null?"null":this.sub.length)+"]"};ASN1.prototype.print=function(indent){if(indent===undefined)indent="";document.writeln(indent+this);if(this.sub!==null){indent+="  ";for(var i=0,max=this.sub.length;i<max;++i)this.sub[i].print(indent)}};ASN1.prototype.toPrettyString=function(indent){if(indent===undefined)indent="";var s=indent+this.typeName()+" @"+this.stream.pos;if(this.length>=0)s+="+";s+=this.length;if(this.tag&32)s+=" (constructed)";else if((this.tag==3||this.tag==4)&&this.sub!==null)s+=" (encapsulates)";s+="\n";if(this.sub!==null){indent+="  ";for(var i=0,max=this.sub.length;i<max;++i)s+=this.sub[i].toPrettyString(indent)}return s};ASN1.prototype.toDOM=function(){var node=DOM.tag("div","node");node.asn1=this;var head=DOM.tag("div","head");var s=this.typeName().replace(/_/g," ");head.innerHTML=s;var content=this.content();if(content!==null){content=String(content).replace(/</g,"&lt;");var preview=DOM.tag("span","preview");preview.appendChild(DOM.text(content));head.appendChild(preview)}node.appendChild(head);this.node=node;this.head=head;var value=DOM.tag("div","value");s="Offset: "+this.stream.pos+"<br/>";s+="Length: "+this.header+"+";if(this.length>=0)s+=this.length;else s+=-this.length+" (undefined)";if(this.tag&32)s+="<br/>(constructed)";else if((this.tag==3||this.tag==4)&&this.sub!==null)s+="<br/>(encapsulates)";if(content!==null){s+="<br/>Value:<br/><b>"+content+"</b>";if(typeof oids==="object"&&this.tag==6){var oid=oids[content];if(oid){if(oid.d)s+="<br/>"+oid.d;if(oid.c)s+="<br/>"+oid.c;if(oid.w)s+="<br/>(warning!)"}}}value.innerHTML=s;node.appendChild(value);var sub=DOM.tag("div","sub");if(this.sub!==null){for(var i=0,max=this.sub.length;i<max;++i)sub.appendChild(this.sub[i].toDOM())}node.appendChild(sub);head.onclick=function(){node.className=node.className=="node collapsed"?"node":"node collapsed"};return node};ASN1.prototype.posStart=function(){return this.stream.pos};ASN1.prototype.posContent=function(){return this.stream.pos+this.header};ASN1.prototype.posEnd=function(){return this.stream.pos+this.header+Math.abs(this.length)};ASN1.prototype.fakeHover=function(current){this.node.className+=" hover";if(current)this.head.className+=" hover"};ASN1.prototype.fakeOut=function(current){var re=/ ?hover/;this.node.className=this.node.className.replace(re,"");if(current)this.head.className=this.head.className.replace(re,"")};ASN1.prototype.toHexDOM_sub=function(node,className,stream,start,end){if(start>=end)return;var sub=DOM.tag("span",className);sub.appendChild(DOM.text(stream.hexDump(start,end)));node.appendChild(sub)};ASN1.prototype.toHexDOM=function(root){var node=DOM.tag("span","hex");if(root===undefined)root=node;this.head.hexNode=node;this.head.onmouseover=function(){this.hexNode.className="hexCurrent"};this.head.onmouseout=function(){this.hexNode.className="hex"};node.asn1=this;node.onmouseover=function(){var current=!root.selected;if(current){root.selected=this.asn1;this.className="hexCurrent"}this.asn1.fakeHover(current)};node.onmouseout=function(){var current=root.selected==this.asn1;this.asn1.fakeOut(current);if(current){root.selected=null;this.className="hex"}};this.toHexDOM_sub(node,"tag",this.stream,this.posStart(),this.posStart()+1);this.toHexDOM_sub(node,this.length>=0?"dlen":"ulen",this.stream,this.posStart()+1,this.posContent());if(this.sub===null)node.appendChild(DOM.text(this.stream.hexDump(this.posContent(),this.posEnd())));else if(this.sub.length>0){var first=this.sub[0];var last=this.sub[this.sub.length-1];this.toHexDOM_sub(node,"intro",this.stream,this.posContent(),first.posStart());for(var i=0,max=this.sub.length;i<max;++i)node.appendChild(this.sub[i].toHexDOM(root));this.toHexDOM_sub(node,"outro",this.stream,last.posEnd(),this.posEnd())}return node};ASN1.prototype.toHexString=function(root){return this.stream.hexDump(this.posStart(),this.posEnd(),true)};ASN1.decodeLength=function(stream){var buf=stream.get(),len=buf&127;if(len==buf)return len;if(len>3)throw"Length over 24 bits not supported at position "+(stream.pos-1);if(len===0)return-1;buf=0;for(var i=0;i<len;++i)buf=buf<<8|stream.get();return buf};ASN1.hasContent=function(tag,len,stream){if(tag&32)return true;if(tag<3||tag>4)return false;var p=new Stream(stream);if(tag==3)p.get();var subTag=p.get();if(subTag>>6&1)return false;try{var subLength=ASN1.decodeLength(p);return p.pos-stream.pos+subLength==len}catch(exception){return false}};ASN1.decode=function(stream){if(!(stream instanceof Stream))stream=new Stream(stream,0);var streamStart=new Stream(stream),tag=stream.get(),len=ASN1.decodeLength(stream),header=stream.pos-streamStart.pos,sub=null;if(ASN1.hasContent(tag,len,stream)){var start=stream.pos;if(tag==3)stream.get();sub=[];if(len>=0){var end=start+len;while(stream.pos<end)sub[sub.length]=ASN1.decode(stream);if(stream.pos!=end)throw"Content size is not correct for container starting at offset "+start}else{try{for(;;){var s=ASN1.decode(stream);if(s.tag===0)break;sub[sub.length]=s}len=start-stream.pos}catch(e){throw"Exception while decoding undefined length content: "+e}}}else stream.pos+=len;return new ASN1(streamStart,header,len,tag,sub)};ASN1.test=function(){var test=[{value:[39],expected:39},{value:[129,201],expected:201},{value:[131,254,220,186],expected:16702650}];for(var i=0,max=test.length;i<max;++i){var pos=0,stream=new Stream(test[i].value,0),res=ASN1.decodeLength(stream);if(res!=test[i].expected)document.write("In test["+i+"] expected "+test[i].expected+" got "+res+"\n")}};window.ASN1=ASN1})();ASN1.prototype.getHexStringValue=function(){var hexString=this.toHexString();var offset=this.header*2;var length=this.length*2;return hexString.substr(offset,length)};RSAKey.prototype.parseKey=function(pem){try{var reHex=/^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;var der=reHex.test(pem)?Hex.decode(pem):Base64.unarmor(pem);var asn1=ASN1.decode(der);if(asn1.sub.length===9){var modulus=asn1.sub[1].getHexStringValue();this.n=parseBigInt(modulus,16);var public_exponent=asn1.sub[2].getHexStringValue();this.e=parseInt(public_exponent,16);var private_exponent=asn1.sub[3].getHexStringValue();this.d=parseBigInt(private_exponent,16);var prime1=asn1.sub[4].getHexStringValue();this.p=parseBigInt(prime1,16);var prime2=asn1.sub[5].getHexStringValue();this.q=parseBigInt(prime2,16);var exponent1=asn1.sub[6].getHexStringValue();this.dmp1=parseBigInt(exponent1,16);var exponent2=asn1.sub[7].getHexStringValue();this.dmq1=parseBigInt(exponent2,16);var coefficient=asn1.sub[8].getHexStringValue();this.coeff=parseBigInt(coefficient,16)}else if(asn1.sub.length===2){var bit_string=asn1.sub[1];var sequence=bit_string.sub[0];var modulus=sequence.sub[0].getHexStringValue();this.n=parseBigInt(modulus,16);var public_exponent=sequence.sub[1].getHexStringValue();this.e=parseInt(public_exponent,16)}else{return false}return true}catch(ex){return false}};RSAKey.prototype.getPrivateBaseKey=function(){var options={array:[new KJUR.asn1.DERInteger({int:0}),new KJUR.asn1.DERInteger({bigint:this.n}),new KJUR.asn1.DERInteger({int:this.e}),new KJUR.asn1.DERInteger({bigint:this.d}),new KJUR.asn1.DERInteger({bigint:this.p}),new KJUR.asn1.DERInteger({bigint:this.q}),new KJUR.asn1.DERInteger({bigint:this.dmp1}),new KJUR.asn1.DERInteger({bigint:this.dmq1}),new KJUR.asn1.DERInteger({bigint:this.coeff})]};var seq=new KJUR.asn1.DERSequence(options);return seq.getEncodedHex()};RSAKey.prototype.getPrivateBaseKeyB64=function(){return hex2b64(this.getPrivateBaseKey())};RSAKey.prototype.getPublicBaseKey=function(){var options={array:[new KJUR.asn1.DERObjectIdentifier({oid:"1.2.840.113549.1.1.1"}),new KJUR.asn1.DERNull]};var first_sequence=new KJUR.asn1.DERSequence(options);options={array:[new KJUR.asn1.DERInteger({bigint:this.n}),new KJUR.asn1.DERInteger({int:this.e})]};var second_sequence=new KJUR.asn1.DERSequence(options);options={hex:"00"+second_sequence.getEncodedHex()};var bit_string=new KJUR.asn1.DERBitString(options);options={array:[first_sequence,bit_string]};var seq=new KJUR.asn1.DERSequence(options);return seq.getEncodedHex()};RSAKey.prototype.getPublicBaseKeyB64=function(){return hex2b64(this.getPublicBaseKey())};RSAKey.prototype.wordwrap=function(str,width){width=width||64;if(!str)return str;var regex="(.{1,"+width+"})( +|$\n?)|(.{1,"+width+"})";return str.match(RegExp(regex,"g")).join("\n")};RSAKey.prototype.getPrivateKey=function(){var key="-----BEGIN RSA PRIVATE KEY-----\n";key+=this.wordwrap(this.getPrivateBaseKeyB64())+"\n";key+="-----END RSA PRIVATE KEY-----";return key};RSAKey.prototype.getPublicKey=function(){var key="-----BEGIN PUBLIC KEY-----\n";key+=this.wordwrap(this.getPublicBaseKeyB64())+"\n";key+="-----END PUBLIC KEY-----";return key};RSAKey.prototype.hasPublicKeyProperty=function(obj){obj=obj||{};return obj.hasOwnProperty("n")&&obj.hasOwnProperty("e")};RSAKey.prototype.hasPrivateKeyProperty=function(obj){obj=obj||{};return obj.hasOwnProperty("n")&&obj.hasOwnProperty("e")&&obj.hasOwnProperty("d")&&obj.hasOwnProperty("p")&&obj.hasOwnProperty("q")&&obj.hasOwnProperty("dmp1")&&obj.hasOwnProperty("dmq1")&&obj.hasOwnProperty("coeff")};RSAKey.prototype.parsePropertiesFrom=function(obj){this.n=obj.n;this.e=obj.e;if(obj.hasOwnProperty("d")){this.d=obj.d;this.p=obj.p;this.q=obj.q;this.dmp1=obj.dmp1;this.dmq1=obj.dmq1;this.coeff=obj.coeff}};var JSEncryptRSAKey=function(key){RSAKey.call(this);if(key){if(typeof key==="string"){this.parseKey(key)}else if(this.hasPrivateKeyProperty(key)||this.hasPublicKeyProperty(key)){this.parsePropertiesFrom(key)}}};JSEncryptRSAKey.prototype=new RSAKey;JSEncryptRSAKey.prototype.constructor=JSEncryptRSAKey;var JSEncrypt=function(options){options=options||{};this.default_key_size=parseInt(options.default_key_size)||1024;this.default_public_exponent=options.default_public_exponent||"010001";this.log=options.log||false;this.key=null};JSEncrypt.prototype.setKey=function(key){if(this.log&&this.key)console.warn("A key was already set, overriding existing.");this.key=new JSEncryptRSAKey(key)};JSEncrypt.prototype.setPrivateKey=function(privkey){this.setKey(privkey)};JSEncrypt.prototype.setPublicKey=function(pubkey){this.setKey(pubkey)};JSEncrypt.prototype.decrypt=function(string){try{return this.getKey().decrypt(b64tohex(string))}catch(ex){return false}};JSEncrypt.prototype.encrypt=function(string){try{return hex2b64(this.getKey().encrypt(string))}catch(ex){return false}};JSEncrypt.prototype.getKey=function(cb){if(!this.key){this.key=new JSEncryptRSAKey;if(cb&&{}.toString.call(cb)==="[object Function]"){this.key.generateAsync(this.default_key_size,this.default_public_exponent,cb);return}this.key.generate(this.default_key_size,this.default_public_exponent)}return this.key};JSEncrypt.prototype.getPrivateKey=function(){return this.getKey().getPrivateKey()};JSEncrypt.prototype.getPrivateKeyB64=function(){return this.getKey().getPrivateBaseKeyB64()};JSEncrypt.prototype.getPublicKey=function(){return this.getKey().getPublicKey()};JSEncrypt.prototype.getPublicKeyB64=function(){return this.getKey().getPublicBaseKeyB64()};exports.JSEncrypt=JSEncrypt})(passport.lib.RSAExport);passport.lib.RSA=passport.lib.RSAExport.JSEncrypt;
;
    var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz))}function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz))}function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz))}function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data))}function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data))}function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data))}function md5_vm_test(){return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72"}function core_md5(x,len){x[len>>5]|=128<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd)}return Array(a,b,c,d)}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t)}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t)}function core_hmac_md5(key,data){var bkey=str2binl(key);if(bkey.length>16){bkey=core_md5(bkey,key.length*chrsz)}var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128)}function safe_add(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function str2binl(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32)}return bin}function binl2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz){str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask)}return str}function binl2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&15)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&15)}return str}function binl2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&255)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&255)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&255);
for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32){str+=b64pad}else{str+=tab.charAt((triplet>>6*(3-j))&63)}}}return str};;
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
;
    /**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api网络层错误信息(中文)
 * @Date: 2012-11-27
 */

var passport = passport || window.passport || {};
passport.err = passport.err || {};
(function(ns) {
    var lang = null;

    if ((typeof (ns.getCurrent)).toLowerCase() === "function") {
        lang = ns.getCurrent();
    } else {
        lang = {
            errMsg: {},
            labelText: {}
        };
    }

    lang.errMsg.reg = {
                '-1':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u4f11\u606f\u4e00\u4f1a\u513f,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "100027": {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: 'isAgree'},
                // checkUserName
                "110002": {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                '130006': {msg: '\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'userName'},
                '130007': {msg: '\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'userName'},
                //checkMail
                "110023": {msg: "\u8be5\u90ae\u7bb1\u5df2\u6ce8\u518c\u53ef<a href=\"http://passport.baidu.com/v2/?login#{urldata}\">\u76f4\u63a5\u767b\u5f55</a>,\u5982\u5fd8\u8bb0\u5bc6\u7801<a href=\"http://passport.baidu.com/?getpassindex#{urldata}\">\u70b9\u6b64\u5904\u627e\u56de</a>" , field: "email"},
                "110024": {msg: "\u8be5\u90ae\u7bb1\u5df2\u88ab\u6ce8\u518c,\u4f46\u672a\u6fc0\u6d3b,\u8bf7\u5230\u9a8c\u8bc1\u90ae\u4ef6\u4e2d\u6fc0\u6d3b\u6216\u8005<a href=\"#{gotourl}\" target=\"_blank\">\u91cd\u53d1\u9a8c\u8bc1\u90ae\u4ef6</a>" , field: "email"},
                "130036": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>" , field: "email"},
                //reg
                "10":     {msg: "\u8bf7\u60a8\u586b\u5199\u7528\u6237\u540d" , field: "userName"},
                "11":     {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                "12":     {msg: "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57" , field: "userName"},
                "14":     {msg: "\u6b64\u7528\u6237\u540d\u592a\u53d7\u6b22\u8fce,\u8bf7\u66f4\u6362\u4e00\u4e2a" , field: "userName"},
                "15":     {msg: "\u60a8\u7684\u7528\u6237\u540d\u4e0d\u53ef\u7528" , field: "userName"},
                '16':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "20":     {msg: "\u8bf7\u586b\u5199\u5bc6\u7801" , field: "password"},
                "21":     {msg: "\u5bc6\u7801\u5fc5\u987b\u75318-14\u4e2a\u5b57\u7b26\u7ec4\u6210" , field: "password"},
                "22":     {msg: "\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4" , field: "verifyPass"},
                "23":     {msg: "\u5bc6\u7801\u4ec5\u80fd\u7531\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7\u7ec4\u6210 / \u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c" , field: "password"},
                "24":     {msg: "\u60a8\u7684\u5bc6\u7801\u592a\u8fc7\u7b80\u5355,\u8bf7\u4f7f\u7528\u5b57\u6bcd\u548c\u6570\u5b57\u7684\u7ec4\u5408,\u5426\u5219\u65e0\u6cd5\u6ce8\u518c\u6210\u529f" , field: "password"},
                "30":     {msg: "\u8bf7\u60a8\u8f93\u5165\u65b0\u7684\u90ae\u7bb1" , field: "email"},
                "31":     {msg: "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef,\u8bf7\u91cd\u65b0\u8f93\u5165" , field: "email"},
                "40":     {msg: "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801" , field: "verifyCode"},
                "41":     {msg: "\u9a8c\u8bc1\u7801\u683c\u5f0f\u9519\u8bef" , field: "verifyCode"},
                "42":     {msg: "\u60a8\u8f93\u5165\u7684\u9a8c\u8bc1\u7801\u6709\u8bef" , field: "verifyCode"},
                '-2':     {msg: '\u670d\u52a1\u6b63\u5728\u5347\u7ea7\u4e2d,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field:''}
            };
// 发短信接口文案
    lang.errMsg.regPhone = {
                '-1':     {msg: '\u7cfb\u7edf\u9519\u8bef,\u4f11\u606f\u4e00\u4f1a\u513f,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "100027": {msg: '\u767e\u5ea6\u6b63\u5728\u8fdb\u884c\u7cfb\u7edf\u5347\u7ea7\uff0c\u6682\u65f6\u4e0d\u80fd\u63d0\u4f9b\u670d\u52a1\uff0c\u656c\u8bf7\u8c05\u89e3', field: 'isAgree'},
                "130018": {msg: "\u8bf7\u60a8\u8f93\u5165\u624b\u673a\u53f7" , field: "phone"},
                "130019": {msg: "\u60a8\u8f93\u5165\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef" , field: "phone"},
                '130020': {msg: '\u8be5\u624b\u673a\u5df2\u6ce8\u518c\u53ef\u76f4\u63a5\u767b\u5f55', field: 'phone'},
                "130035": {msg: "\u60a8\u7684\u624b\u673a\u53f7\u5df2\u88ab\u6ce8\u518c,\u8bf7<a href=\"http://passport.baidu.com/v2/?login#{urldata}\">\u76f4\u63a5\u767b\u5f55</a>\u6216\u66f4\u6362\u624b\u673a\u53f7\u6ce8\u518c" , field: "phone"},
                "130017": {msg: "\u53d1\u9001\u77ed\u4fe1\u8fc7\u591a,\u8bf724\u5c0f\u65f6\u540e\u518d\u8bd5" , field: "verifyCodeSend"},
                "130038": {msg: "\u53d1\u9001\u77ed\u4fe1\u8fc7\u4e8e\u9891\u7e41,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5" , field: "verifyCodeSend"},
                "130010": {msg: "\u8bf7\u60a8\u8f93\u5165\u5bc6\u7801" , field: "password"},
                "130011": {msg: "\u5bc6\u7801\u5fc5\u987b\u75318-14\u4e2a\u5b57\u7b26\u7ec4\u6210" , field: "password"},
                "110013": {msg: "\u5bc6\u7801\u4ec5\u652f\u6301\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7,\u4e14\u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c" , field: "password"},
                "110012": {msg: "\u5bc6\u7801\u8fc7\u4e8e\u7b80\u5355,\u5efa\u8bae\u4f7f\u7528\u6570\u5b57\u52a0\u5b57\u6bcd\u7ec4\u5408,\u5426\u5219\u65e0\u6cd5\u6ce8\u518c\u6210\u529f" , field: "password"},
                "130023": {msg: "\u8bf7\u8f93\u5165\u77ed\u4fe1\u6fc0\u6d3b\u7801" , field: "smsCode"},
                "130021": {msg: "\u8bf7\u60a8\u8f93\u5165\u77ed\u4fe1\u6fc0\u6d3b\u7801" , field: "smsCode"},
                "130022": {msg: "\u77ed\u4fe1\u6fc0\u6d3b\u7801\u9519\u8bef" , field: "smsCode"},
                "130003": {msg: "\u60a8\u8f93\u5165\u7684\u77ed\u4fe1\u6fc0\u6d3b\u7801\u6709\u8bef" , field: "smsCode"},
                "130036": {msg: "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>" , field: "smsCode"},
                "130037": {msg: "\u6fc0\u6d3b\u7801\u9519\u8bef\u6b21\u6570\u8fc7\u591a,\u8bf724\u5c0f\u65f6\u540e\u91cd\u65b0\u6ce8\u518c" , field: "smsCode"},
                "130004": {msg: "\u6fc0\u6d3b\u7801\u5df2\u5931\u6548,\u8bf7\u60a8\u91cd\u65b0\u83b7\u53d6" , field: "smsCode"},
                "130032": {msg: "\u60a8\u8fd8\u672a\u63a5\u53d7\u767e\u5ea6\u7528\u6237\u534f\u8bae,\u8bf7\u52fe\u9009" , field: "isAgree"},
                '130039': {msg: '\u7cfb\u7edf\u7e41\u5fd9,\u8bf7\u7a0d\u540e\u518d\u8bd5,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: 'isAgree'},
                "130040": {msg: "" , field: ""},
                '130044': {msg: '\u7cfb\u7edf\u68c0\u6d4b\u5230\u5f53\u524d\u5e10\u53f7\u901a\u8fc7\u975e\u6cd5\u6e20\u9053\u6ce8\u518c\uff0c\u4e3a\u4e86\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7\u91cd\u8bd5', field: ''},
                "130041": {msg: "\u9a8c\u8bc1\u7801\u4e3a\u7a7a" , field: "confirmVerifyCode"},
                "130042": {msg: "\u9a8c\u8bc1\u7801\u9519\u8bef" , field: "confirmVerifyCode"},
                '340001': {msg: '网络不给力， 请刷新重试 ,<a href="http://passport.baidu.com/v2/?ucenterfeedback#{urldata}#reg">\u5e2e\u52a9\u4e2d\u5fc3</a>', field: ''},
                '400001': {msg: '已被其他帐号绑定', field: 'phone'},
                '400003': {msg: '已被其他帐号绑定', field: 'phone'},
                "400005": {msg: "已被其他帐号绑定" , field:"phone"},
        '400603': {msg: '\u5f53\u524d\u60a8\u7684\u624b\u673a\u53f7\u7801\u4ec5\u652f\u6301\u5feb\u901f\u6ce8\u518c\uff0c\u8bf7\u60a8\u91c7\u7528\u5feb\u901f\u6ce8\u518c\u65b9\u5f0f\uff0c\u6ce8\u518c\u767e\u5ea6\u5e10\u53f7', field: 'phone'},
                "50023": {msg: "\u0031\u4e2a\u624b\u673a\u53f7\u0033\u0030\u65e5\u5185\u6700\u591a\u6362\u7ed1\u0033\u4e2a\u8d26\u53f7" , field:"phone"},
                "50024": {msg: "\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5" , field:""},
        '50025': {msg: '\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u5019\u518d\u8bd5\uff1b\u4e5f\u53ef\u4ee5\u901a\u8fc7\u4e0a\u884c\u77ed\u4fe1\u7684\u65b9\u5f0f\u8fdb\u884c\u6ce8\u518c', field: ''},
        '50030': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u65e5\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50031': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u5f53\u6708\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50032': {msg: '\u62b1\u6b49\uff0c\u8be5\u624b\u673a\u53f7\u7684\u7533\u8bf7\u6b21\u6570\u5df2\u8fbe\u672c\u5b63\u5ea6\u4e0a\u9650\uff0c\u8bf7\u66f4\u6362\u624b\u673a\u53f7', field: 'phone'},
        '50036': {msg: '\u6ce8\u518c\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5'},
        '130045': {msg: '系统检测到当前帐号通过非法渠道注册，为了您的帐号安全，请使用正规渠道注册', field: 'verifyCode'},
        '50043': {msg: '当前浏览器版本过低，请升级或更换浏览器后重试', field: ''},
        '100060': {msg: '因系统升级暂不支持注册，预计6月7日恢复服务', field: 'verifyCode'},
                "71000" : {msg: "" , field:""}
            };

    lang.labelText.reg = {
                "captcha"               : "\u9a8c\u8bc1\u7801",
                "captchaAlt"            : "\u9a8c\u8bc1\u7801\u56fe\u7247",
                "captchaChange"         : "\u6362\u4e00\u5f20",
                "captchaTip"            : "\u8bf7\u8f93\u5165\u56fe\u7247\u4e2d\u7684\u5b57\u7b26,\u4e0d\u533a\u5206\u5927\u5c0f\u5199",
                "agree"                 : "\u9605\u8bfb\u5e76\u63a5\u53d7",
                "password"              : "\u5bc6\u7801",
                "passwordPlaceholder"   : "\u8bf7\u8bbe\u7f6e\u767b\u5f55\u5bc6\u7801",
                "baiduUserProtocal"     : "\u300a\u767e\u5ea6\u7528\u6237\u534f\u8bae\u300b",
                "getSMSKey"             : "\u83b7\u53d6\u77ed\u4fe1\u9a8c\u8bc1\u7801",
                "register"              : "\u6ce8\u518c",
                "strength"              : "\u5f3a\u5ea6\uff1a",
                "strengthTip"           : "\u5bc6\u7801\u957f\u5ea66~14\u4f4d,\u5b57\u6bcd\u533a\u5206\u5927\u5c0f\u5199",
                "phoneNum"              : "\u624b\u673a\u53f7",
                "phoneNumTip"           : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7,\u5176\u4ed6\u7528\u6237\u4e0d\u53ef\u89c1",
                "foreignMobileError"    : "\u624b\u673a\u53f7\u7801\u683c\u5f0f\u4e0d\u6b63\u786e",
                "SMSKey"                : "\u77ed\u4fe1\u6fc0\u6d3b\u7801",
                "SMSKeyTip"             : "\u8bf7\u8f93\u5165\u60a8\u624b\u673a\u77ed\u4fe1\u4e2d\u7684\u6fc0\u6d3b\u7801",
                "SMSKeySendTip"         : "\u77ed\u4fe1\u6fc0\u6d3b\u7801\u5df2\u53d1\u9001,\u8bf7\u60a8\u572830\u5206\u949f\u5185\u586b\u5199\u3002<a href=\"http://help.baidu.com/question?prod_en=passport&class=%D7%A2%B2%E1%BC%B0%B5%C7%C2%BC&id=1000318\" target=\"_blank\">\u65e0\u6cd5\u83b7\u53d6</a>\uff1f",
                'VoiceKeySendTip': '\u8bed\u97f3\u6fc0\u6d3b\u7801\u5df2\u53d1\u9001\u002c\u8bf7\u60a8\u5728\u0033\u0030\u5206\u949f\u5185\u586b\u5199\u3002<a href=\"http://help.baidu.com/question?prod_en=passport&class=%D7%A2%B2%E1%BC%B0%B5%C7%C2%BC&id=1000318\" target=\"_blank\">\u65e0\u6cd5\u83b7\u53d6</a>\uff1f',
                "SMSKeyResendTip"       : "\u79d2\u540e\u91cd\u65b0\u83b7\u53d6\u6fc0\u6d3b\u7801",
                "SMSKeyResendTipMerge"  : "\u91cd\u65b0\u53d1\u9001",
                "account"               : "\u624b\u673a/\u90ae\u7bb1",
                "accountTip"            : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7\u6216\u5e38\u7528\u90ae\u7bb1,\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801,\u6ce8\u518c\u6210\u529f\u540e,\u6240\u6709\u767e\u5ea6\u4ea7\u54c1\u901a\u7528",
                "account_username"      : "\u5e10\u53f7",
                "accountTip_username"   : "\u8bf7\u8f93\u5165\u4e2d\u56fd\u5927\u9646\u624b\u673a\u53f7/\u5e38\u7528\u90ae\u7bb1/\u7528\u6237\u540d",
                "email"                 : "\u90ae\u7bb1",
                "emailTip"              : "\u8bf7\u8f93\u5165\u5e38\u7528\u90ae\u7bb1,\u901a\u8fc7\u9a8c\u8bc1\u540e\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801",
                "userName"              : "\u7528\u6237\u540d",
                "userNamePlaceholder"   : "\u8bf7\u8bbe\u7f6e\u7528\u6237\u540d",
                "userNameTip"           : "\u8bbe\u7f6e\u540e\u4e0d\u53ef\u66f4\u6539<br>\u4e2d\u82f1\u6587\u5747\u53ef\uff0c\u6700\u957f\u0031\u0034\u4e2a\u82f1\u6587\u6216\u0037\u4e2a\u6c49\u5b57",
                "confirmPassword"       : "\u786e\u8ba4\u5bc6\u7801",
                "mailLengthError"       : "\u90ae\u7bb1\u5730\u5740\u8fc7\u957f,\u8bf7\u66f4\u6362\u8f83\u77ed\u90ae\u7bb1,\u603b\u4f53\u4e0d\u8d85\u8fc760\u4e2a\u5b57\u7b26",
                "mainEmailError"        : "\u4e3a\u4e86\u786e\u4fdd\u60a8\u80fd\u53ca\u65f6\u6536\u5230\u90ae\u4ef6,\u8bf7\u4f7f\u7528<a href=\"http://www.baidu.com/search/passport_help.html#09\" target=\"_blank\">\u4e3b\u6d41\u90ae\u7bb1</a>",
                "pwdCharError"          : "\u5bc6\u7801\u4ec5\u652f\u6301\u6570\u5b57,\u5b57\u6bcd\u548c\u7b26\u53f7,\u4e14\u5bc6\u7801\u4e2d\u4e0d\u80fd\u542b\u6709\u7a7a\u683c",
                "matchPwdError"         : "\u5bc6\u7801\u4e0e\u786e\u8ba4\u5bc6\u7801\u4e0d\u4e00\u81f4",
                "pwdLengthError"        : "\u5bc6\u7801\u5fc5\u987b\u7531\u0038\u002d\u0031\u0034\u4e2a\u5b57\u7b26\u7ec4\u6210",
                'checkLicenseError': '\u8bf7\u52fe\u9009\u201c\u9605\u8bfb\u5e76\u63a5\u53d7\u767e\u5ea6\u7528\u6237\u534f\u8bae\u201d',
                "userNameRulesError"    : "\u7528\u6237\u540d\u4e0d\u80fd\u8d85\u8fc77\u4e2a\u6c49\u5b57\u621614\u4e2a\u5b57\u7b26",
                "userNameNumberError"   : "\u7528\u6237\u540d\u4ec5\u652f\u6301\u4e2d\u82f1\u6587\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf,\u4e14\u4e0d\u80fd\u4e3a\u7eaf\u6570\u5b57",
                "weakPwdError"          : "\u60a8\u7684\u5bc6\u7801\u592a\u8fc7\u7b80\u5355,\u8bf7\u4f7f\u7528\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u7b26\u53f7\u7684\u7ec4\u5408,\u4ee5\u4fbf\u5b8c\u6210\u6ce8\u518c",
                "userNameExistsError"   : "\u6b64\u7528\u6237\u540d\u592a\u53d7\u6b22\u8fce,\u8bf7\u66f4\u6362\u4e00\u4e2a",
                "nopwd"                 : "",
                "nopwdMsg"              : "\u8bf7\u8f93\u5165\u5bc6\u7801",
                "weak"                  : "\u5f31",
                "weakMsg"               : "\u8bf7\u91cd\u65b0\u8bbe\u7f6e,\u8bd5\u8bd5\u6570\u5b57\u3001\u5b57\u6bcd\u3001\u7b26\u53f7\u7ec4\u5408",
                "middle"                : "\u4e2d",
                "middleMsg"             : "\u60a8\u7684\u5bc6\u7801\u8fd8\u53ef\u4ee5\u66f4\u590d\u6742\u4e9b",
                "strong"                : "\u5f3a",
                "strongMsg"             : "\u60a8\u7684\u5bc6\u7801\u5f88\u5b89\u5168,\u8bf7\u7262\u8bb0\uff01",
                "placeholder"           : "\u53ef\u7528\u4e8e\u767b\u5f55\u548c\u627e\u56de\u5bc6\u7801",
                "regMergePlaceholder"   : "\u624b\u673a/\u90ae\u7bb1",
                "regMergePlaceholder_username": "\u624b\u673a/\u90ae\u7bb1/\u7528\u6237\u540d",
                "matchGmailError"       : "gmail\u90ae\u7bb1\u6536\u4fe1\u65f6\u4f1a\u81ea\u52a8\u8fc7\u6ee4\u7528\u6237\u540d\u5185\u7684\u5706\u70b9,\u60a8\u53ef\u4ee5\u53bb\u6389\u7528\u6237\u540d\u5185\u7684\u5706\u70b9\u76f4\u63a5\u6ce8\u518c",
                "emailLimitError"       : "\u4e0d\u80fd\u4f7f\u7528\u8be5\u90ae\u7bb1",
                "accountMergeError"     : "\u8bf7\u586b\u5199\u6b63\u786e\u7684\u624b\u673a/\u90ae\u7bb1",
                "accountEmpty"          : "\u90ae\u7bb1/\u624b\u673a",
                "accountEmpty_username" : "\u90ae\u7bb1/\u624b\u673a/\u7528\u6237\u540d",
                "emailEmptyError"       : "\u60a8\u586b\u5199\u7684\u90ae\u7bb1\u683c\u5f0f\u6709\u8bef,\u8bf7\u91cd\u65b0\u8f93\u5165",
                "phoneEmptyError"       : "\u60a8\u586b\u5199\u7684\u624b\u673a\u53f7\u683c\u5f0f\u6709\u8bef,\u8bf7\u8f93\u516511\u4f4d\u5927\u9646\u624b\u673a\u53f7",
                "confirmVerCodeEmpty"   : "\u9a8c\u8bc1\u7801\u4e3a\u7a7a",
                "pwdChecklist_len"      : "\u957f\u5ea6\u4e3a\u0038\u007e\u0031\u0034\u4e2a\u5b57\u7b26",
                "pwdChecklist_cha"      : "\u652f\u6301\u6570\u5b57,\u5927\u5c0f\u5199\u5b57\u6bcd\u548c\u6807\u70b9\u7b26\u53f7",
                "pwdChecklist_spa"      : "\u4e0d\u5141\u8bb8\u6709\u7a7a\u683c",
                "verifyCode"            : "\u9a8c\u8bc1\u7801",
                "verifyCodePlaceholder" : "\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801",
                "smsVerifyCode"         : "\u77ed\u4fe1\u6fc0\u6d3b\u7801",
                "sysUpdate"             : "\u670d\u52a1\u6b63\u5728\u5347\u7ea7\u4e2d,\u8bf7\u60a8\u7a0d\u540e\u518d\u8bd5",
                "multiTip"              : "\u4e00\u4e2a\u624b\u673a\u53f7\u7ed1\u5e26\u591a\u4e2a\u5e10\u53f7\uff1f<a href='http://passport.baidu.com/export/multi/index.html' target='_blank'>\u7acb\u5373\u4f53\u9a8c</a>",
                "notsafeMsg"            : "\u4e3a\u4e86\u63d0\u5347\u60a8\u7684\u5e10\u53f7\u5b89\u5168\uff0c\u5efa\u8bae\u4e0d\u8981\u4f7f\u7528\u60a8\u7684\u5e38\u7528\u5bc6\u7801\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165",
                'notsafe': '',
        'baiduPersonalProtocal': '\u300a\u767e\u5ea6\u9690\u79c1\u6743\u4fdd\u62a4\u58f0\u660e\u300b',
        'sysError': '\u7cfb\u7edf\u9519\u8bef\uff0c\u4f11\u606f\u4e00\u4f1a\u513f\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5'
    };

    ns.getCurrent = function() {
        return lang;
    };
})(passport.err);;
    /**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api网络层接口
 * @Date: 2012-11-13
 */
/**
 * 登录时检查
 * @param {Object} params 参数
 *                      userName : {String} //用户名
 */
//passport.data.loginCheck = function(params) {};
/**
 * 获取验证码
 */
//passport.data.getVerifyCodeStr = function() {};
/**
 * 用户名检查及推荐
 * @param {Object} params 参数
 *                      userName : {String} //用户名
 */
//passport.data.checkUserName = function(params) {};
/**
 * 密码强度检查
 * @param {Object} params 参数
 *                      password : {String} //密码
 */
//passport.data.checkPassword = function(params) {};
/**
 * email地址检查
 * @param {Object} params 参数
 *                      email : {String} //邮箱地址
 */
//passport.data.checkMail = function(params) {};
/**
 * 获取用户信息
 */
//passport.data.isUserNoName = function() {};
/**
 * 登录
 * @param {Object} params 参数
 *                      userName : {String} //用户名/手机号
 *                      codeString : {String} //验证码串
 *                      isPhone : {Boolean} //是否是手机登录
 *                      password : {String}	密码
 *                      verifyCode : {String}	用户输入的验证码，无需验证码时为空
 *                      safeFlg : {Number}	安全控件，百付宝
 *                      memberPass : {Boolean}	是否需要记住密码
 *                      u : {String}	登录成功跳转地址
 */
//passport.data.login = function(params) {};
/**
 * 注册
 * @param {Object} params 参数
 *                      codeString : {String}	验证码串
 *                      email : {String}	邮件地址
 *                      userName : {String}	用户名/手机号
 *                      isAgree : {Boolean}	是否同意协议
 *                      verifyCode : {String}	用户输入的验证码，无需验证码时为空
 *                      loginPass : {String}	登录密码
 *                      verifyPass : {String}	重复密码
 *                      suggestIndex : {Number}	用户名推荐的顺序 abtest
 *                      suggestType : {Number}	用户名推荐接口返回的type
 *                      registerType : {Boolean}	有无用户名注册
 *                      u : {String}	注册成功跳转地址
 *                      retu	{String}	激活后的跳转地址
 */
//passport.data.reg = function(params) {};
/**
 * 补填用户名
 * @param {Object} params 参数
 *                      userName : {String}	输入的用户名
 *                      selectedSuggestName : {String}	选中推荐的用户名
 */
//passport.data.fillUserName = function(params) {};
 
var passport = passport || window.passport || {};
passport.data = passport.data || {};
(function(ns) {
    var _blankFunc = function() {};
    function Promise(initCallback) {
        this._requests = [];
        this._value = null;
        this._exception = null;
        this._isComplete = false
        var promise = this;
        initCallback(
            function(value) { promise._fulfillPromise(value) },
            function(value) { promise._breakPromise(value) });
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
        success : function(fulfillPromise, context) {
            return this.when(fulfillPromise, _blankFunc, context);
        },
        fail : function(breakPromise, context) {
            return this.when(_blankFunc, breakPromise, context);
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
            fulfillPromise: function(value) { if (fulfillPromise) fulfillPromise.call(context, value); },
            breakPromise: function(exception) { if (breakPromise) breakPromise.call(context, exception); }
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
    
    var Base = {};
    (function(Base) {
        var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        Base.trim = function (source) {
            return String(source).replace(trimer, "");
        };
        Base.getUniqueId = function(prefix) { return prefix + Math.floor(Math.random() * 2147483648).toString(36); };
        Base.g = function(id) {
            if (!id) return null; //修改IE下baidu.dom.g(baidu.dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
            if ('string' == typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
                return id;
            }
            return null;
        };
        Base.getParent = function (a) { a=Base.g(a);return a.parentElement||a.parentNode||null};
        Base.encodeHTML = function(a) { return String(a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")};
        Base.array = Base.array || {};
        Base.array.indexOf = function (source, match, fromIndex) {
            var len = source.length,
                iterator = match;
            fromIndex = fromIndex | 0;
            if(fromIndex < 0){//小于0
                fromIndex = Math.max(0, len + fromIndex)
            }
            for ( ; fromIndex < len; fromIndex++) {
                if(fromIndex in source && source[fromIndex] === match) {
                    return fromIndex;
                }
            }
            return -1;
        };
        Base.browser = Base.browser || {};
        Base.browser.opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;
        Base.insertHTML = function (element, position, html) {
            element = Base.g(element);
            var range,begin;

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
                if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
                    range.selectNodeContents(element);
                    range.collapse(position == 'AFTERBEGIN');
                } else {
                    begin = position == 'BEFOREBEGIN';
                    range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                    range.collapse(begin);
                }
                range.insertNode(range.createContextualFragment(html));
            }
            return element;
        };
    })(Base);
    ns.base = Base;
    //Request Object
    var Request = {};
    (function(Request) {
        var _postContainer = "__bdpp_pstc__" + new Date().getTime(),
            _postForm = _postContainer + "_form",
            _postTarget = _postContainer + "_ifr";
        var _buildQuery = function(query) {
            if (typeof (query) == "object") {
                var builder = [];
                for (var p in query) {
                    var value = query[p];
                    if (value !== undefined && value !== null) {
                        if (builder.length) builder.push("&");
                        var valueString = encodeURIComponent(typeof(value) == "boolean" ? (value ? "1" : "0") : value.toString());
                        builder.push(encodeURIComponent(p), "=", valueString);
                    }
                }
                return builder.join("");
            }
            if (typeof (query) == "string") {
                return query;
            }
            return null;
        };
        var _appendQuery = function(url, query) {
            query = _buildQuery(query);
            if (typeof (query) == "string") {
                var hasQuery = (/\?/g).test(url);
                url += (hasQuery ? "&" : "?") + _buildQuery(query);
            }
            return url;
        };
        var _createScriptTag = function(scr, url, charset){
            scr.setAttribute('type', 'text/javascript');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        };
        var _removeScriptTag = function(scr){
            if (scr.clearAttributes) {
                scr.clearAttributes();
            } else {
                for (var attr in scr) {
                    if (scr.hasOwnProperty(attr)) {
                        delete scr[attr];
                    }
                }
            }
            if(scr && scr.parentNode){
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

            if( timeOut ){
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
            function getCallBack(onTimeOut){
                /*global callbackName, callback, scr, options;*/
                return function(){
                    try {
                        if( onTimeOut ){
                            options.onfailure && options.onfailure();
                        }else{
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
                }
            }
        };
        
        var _renderDataForm = function(url, segments) {
            var builder = [];
            builder.push("<form id='", _postForm, "' target='", _postTarget, "' ");
            builder.push("action='", Base.encodeHTML(url), "' method='post'>");
            for(var p in segments) {
                if(segments.hasOwnProperty(p)) {
                    var value = segments[p];
                    if (value !== undefined && value !== null) {
                        var valueString = Base.encodeHTML(typeof(value) == "boolean" ? (value ? "1" : "0") : value);
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
            if(Base.g(_postForm)) {
                Base.getParent(_postForm).innerHTML = formHtml;
            } else {
                var htmlBuilder = [];
                htmlBuilder.push("<div id='", _postContainer, "' style='display:none;'>");
                htmlBuilder.push("<div>", formHtml, "</div>");
                htmlBuilder.push("<iframe name='", _postTarget, "' src='" + ((window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase()) == "https:" ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank") + "' style='display:none;'></iframe>");
                htmlBuilder.push("</div>");
                Base.insertHTML(document.body, "beforeEnd", htmlBuilder.join(""));
            }
            window[callbackName] = getCallBack();
            if( timeOut ){
                timer = setTimeout(getCallBack(1), timeOut);
            }
            function getCallBack(onTimeOut){
                /*global callbackName, callback, scr, options;*/
                return function(){
                    try {
                        if( onTimeOut ){
                            options.onfailure && options.onfailure();
                        }else{
                            callback.apply(window, arguments);
                            timer && clearTimeout(timer);
                        }
                        window[callbackName] = null;
                        delete window[callbackName];
                    } catch (exception) {
                        // ignore the exception
                    }
                }
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
            if (ns && ns.traceID && ns.traceID.createTraceID) {
                query.traceid = ns.traceID.createTraceID();
            }
            return new Promise(
                function(fulfillPromise, breakProimise) {
                    url = _appendQuery(url, query);
                    _callByServer(url, function(jsonResult) {
                        if(options.processData) {
                            jsonResult = options.processData(jsonResult);
                        }
                        fulfillPromise && fulfillPromise(jsonResult);
                    }, {
                        charset : options.charset,
                        queryField : options.queryField,
                        timeOut : options.timeOut,
                        onfailure : function() {
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
            if (ns && ns.traceID && ns.traceID.createTraceID) {
                data.traceid = ns.traceID.createTraceID();
            }
            if(url && data) {
                return new Promise(
                    function(fulfillPromise, breakProimise) {
                        _postInIframe(url, data, function(jsonResult) {
                            if(options.processData) {
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
                    var index = _loadImgList.push(new Image) -1,
                        done = false,
                        timer = setTimeout(function() {
                            done = true;
                            fulfillPromise && fulfillPromise();
                        }, 1000);
                    _loadImgList[index].onload = function() {
                        clearTimeout(timer);
                        if(!done) {
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
    
    //网络层接口
    var _domain = "https://passport.baidu.com",//"https://passport.baidu.com",
        _getInterfaces = { //get接口定义
            getApiInfo : "/v2/api/?getapi",
            getLoginHistory : "/v2/api/?loginhistory",
            loginCheck : "/v2/api/?logincheck",
            getVerifyCodeStr : "/v2/?reggetcodestr",
            getRegSmsVerifyCodeStr : "/v2/?regsmscodestr",
            checkUserName : "/v2/?regnamesugg",
            checkPassword : "/v2/?regpwdcheck",
            checkMail : "/v2/?regmailcheck",
            isUserNoName : "/v2/api/?ucenteradduname",
            checkPhone : "/v2/?regphonecheck",
            getphonestatus : "/v2/?getphonestatus",
            sendPhoneCode : "/v2/?regphonesend",
            multiBind : "/v2/?multiaccountassociate",
            multiUnbind : "/v2/?multiaccountdisassociate",
            multiCheckUserName : "/v2/?multiaccountusername",
            multiGetaccounts: "/v2/?multiaccountget",
            multiSwitchuser: "/v2/?loginswitch",
            checkVerifycode: "/v2/?checkvcode",
            getRsaKey : "/v2/getpublickey",
            authwidGetverify : "/v2/sapi/authwidgetverify",
            checkIDcard : "/v3/finance/main/idnumcert",
            checkIDcardSecondStep : "/v3/finance/main/upcert",
            checkIDcardAllStep : "/v3/finance/main/idnumcert" ,
            checkIDcardState : "/v3/finance/main/checkupcert"
        },
        _postInterfaces = { //post接口定义
            login : "/v2/api/?login",
            reg : "/v2/api/?reg",
            fillUserName : "/v2/api/?ucenteradduname",
            regPhone : "/v2/api/?regphone",
            checkIDcard : "/v3/finance/main/idnumcert",
            checkIDcardSecondStep : "/v3/finance/main/upcert",
            checkIDcardAllStep : "/v3/finance/main/idnumcert"
        },
        _paramNameMapping = {  //参数名称映射
            getApiInfo : {apiType : "class"},
            login : {memberPass : "mem_pass", safeFlag : "safeflg", isPhone : "isPhone", timeSpan : "ppui_logintime",logLoginType:"logLoginType"},
            fillUserName : {selectedSuggestName : "pass_fillinusername_suggestuserradio", timeSpan : "ppui_fillusernametime"},
            reg : {password : "loginpass", timeSpan : "ppui_regtime", suggestIndex: "suggestIndex", suggestType: "suggestType", selectedSuggestName: "pass_reg_suggestuserradio_0",logRegType:"logRegType"},
            regPhone : {password : "loginpass", timeSpan : "ppui_regtime", suggestIndex: "suggestIndex", suggestType: "suggestType", selectedSuggestName: "pass_reg_suggestuserradio_0",logRegType:"logRegType"}
        },
        _paramValueMapping = {  //参数值映射
            loginCheck : {isPhone : function(val, params) { return val ? "true" : "false"; }},
            login : {memberPass : function(val, params) { return (val ? "on" : ""); }}
        },
        _paramDefaultValue = {  //接口默认参数值
            checkPassword : {fromreg : 1},
            reg : {registerType : 1, verifypass : function(params) { return params.password; }}
        },
        _paramSpaceIgnoreList = { //不进行去除空白字符的参数
            password: true
        },
        _resultProcessFunc = {  //返回结果处理函数
            login : function(jsonResult) {  //登录处理
            }
        },
        _errInfoFieldMapping = { //错误号与域的映射
            checkUserName : "reg",
            checkMail : "reg",
            checkPhone : "regPhone",
            sendPhoneCode : "regPhone",
            multiCheckUserName : "multiBind",
            multiSwitchuser : "changeUser",
            checkVerifycode:"checkVerifycode"
        },
        _errMsg = passport.err.getCurrent().errMsg || passport.err.getCurrent(), //获取错误信息
        _ctx = {};
    /**
     * 登录时检查
     * @param {Object} ctxInfo 公共参数
     *                      product : {String} //产品线标志
     *                      charset : {String} //页面编码
     *                      staticPage : {String} //产品线跳转页面编码
     *                      token : {String} //token
     */
    ns.setContext = function(ctxInfo) {
        _ctx.product = ctxInfo.product || _ctx.product;
        _ctx.charset = ctxInfo.charset || _ctx.charset;
        _ctx.staticPage = ctxInfo.staticPage || _ctx.staticPage;
        _ctx.token = ctxInfo.token || _ctx.token;
        _ctx.subpro = ctxInfo.subpro || _ctx.subpro;
    };

    // traceID 追踪用户在一个功能流程中的完整访问路径 traceID 随机6位十六进制+2位流程位
    ns.traceID = {
        /**
            headID: 头部位
            flowID: 流程位
            cases: 小流量
            init: 初始化traceID
            getRandom: 生成2位随机数10-99
            createHeadID: 生成随机6位十六进制 -- 使用时间戳+ 2位随机数 组成头部位
            createTraceID: 生成traceID
            getTraceID: 获取traceID
            getFlowID: 获取流程位 (01--login流程, 02 -- reg流程)
            destory: 销毁traceID
            startFlow: 流程开始
            finishFlow: 流程结束
            setData: 给请求
        */
        headID: (ns.traceID && ns.traceID.headID) || '',
        flowID: (ns.traceID && ns.traceID.flowID) || '',
        cases: (ns.traceID && ns.traceID.cases) || '',
        initTraceID: function (traceID) {
            var me = this;
            if (traceID && traceID.length > 0) {
                me.headID = traceID.slice(0, 6);
                me.flowID = traceID.slice(6, 8);
            } else {
                me.destory();
            }
        },
        createTraceID: function () {
            var me = this;
            return me.headID + me.flowID + me.cases;
        },
        startFlow: function (flowName) {
            var me = this;
            // 如果没有获取到traceID或是流程位是当前流程 -- 重新生成TraceID
            var id = me.getFlowID(flowName);
            if (me.flowID.length === 0 || me.flowID === id) {
                me.createHeadID();
                me.flowID = id;
            } else {
                me.finishFlow(id);
            }
        },
        finishFlow: function (flowID) {
            var me = this;
            me.destory();
        },
        getRandom: function () {
            var me = this;
            return parseInt(Math.random() * 90 + 10, 10);
        },
        createHeadID: function () {
            var me = this;
            var timeID = new Date().getTime() + me.getRandom().toString();
            var timeIDHex = Number(timeID).toString(16);
            var timeIDHexLen = timeIDHex.length;
            var headID = timeIDHex.slice(timeIDHexLen - 6, timeIDHexLen).toUpperCase();
            me.headID = headID;
        },
        getTraceID: function (data) {
            var me = this;
            var traceID = data && data.traceid || '';
            me.initTraceID(traceID);
        },
        getFlowID: function (flowName) {
            var me = this;
            var flowID = {
                'login': '01',
                'reg': '02'
            };
            return flowID[flowName];
        },
        setData: function (options) {
            var me = this;
            if (options.data) {
                options.data.traceid = me.createTraceID();
            } else {
                options.url = options.url + (options.url.indexOf('?') > -1 ? '&' : '?')
                            + 'traceid=' + me.createTraceID();
            }
            return options;

        },
        destory: function () {
            var me = this;
            me.headID = '';
            me.flowID = '';
        }
    };
    
    /**
     * 定义接口
     * @param {String} interfaceName 接口名称
     * @param {String} url 接口url
     * @param {Boolean} isPost 是否post
     * @returns {Function} 
     */
    function defineInterface(interfaceName, url, isPost) {
        if(url) {
            if(!isPost) {
                return function(params) {
                    return Request.jsonp(
                        _domain + url, 
                        processParam(params, interfaceName, _paramNameMapping[interfaceName], _paramValueMapping[interfaceName], false), 
                        {
                            charset : "utf-8",
                            processData : function(jsonResult) {
                                return processResult(interfaceName, jsonResult);
                            }
                        }
                    );
                };
            } else {
                return function(params) {
                    params = params || {};
                    //params["ppui_" + interfaceName.toLowerCase() + "time"] = new Date().getTime();
                    return Request.submit(
                        _domain + url, 
                        processParam(params, interfaceName, _paramNameMapping[interfaceName], _paramValueMapping[interfaceName], true), 
                        {
                            charset : "utf-8", 
                            processData : function(jsonResult) {
                                //decode
                                if(jsonResult) {
                                    for(var p in jsonResult) {
                                        if(jsonResult.hasOwnProperty(p)) {
                                            var v = jsonResult[p];
                                            if(v) { 
                                                jsonResult[p] = decodeURIComponent(v);
                                            }
                                        }
                                    }
                                }
                                return processResult(interfaceName, jsonResult);
                            }
                        }
                    );
                };
            }
        } else { return _blankFunc; }
    }
    /**
     * 处理请求参数
     * @param {Object} params 参数对象
     * @param {String} interfaceName 接口名称
     * @param {Object} paramNameMap 参数名称映射
     * @param {Object} paramValueMap 参数值映射
     * @param {Boolean} isPost 是否post
     * @returns {Object} 
     */
    function processParam(params, interfaceName, paramNameMap, paramValueMap, isPost) {
        var retParam = (isPost 
                            ? {staticpage : _ctx.staticPage, charset : _ctx.charset || document.characterSet || document.charset || ""}
                            : {}
                        ),
            defaultParam = _paramDefaultValue[interfaceName];
        if(defaultParam) { 
            //扩展默认参数
            for(var p in defaultParam) {
                if(defaultParam.hasOwnProperty(p)) {
                    var v = defaultParam[p];
                    retParam[p] = (typeof(v) == "function" ? v(params) : v);
                }
                if(p == 'verifypass'){
                    retParam[p] = decodeURIComponent(retParam[p]);
                }
            }
        }
        
        retParam.token = _ctx.token;
        retParam.tpl = _ctx.product || '';
        retParam.subpro = _ctx.subpro;
        //retParam.charset = _ctx.charset;
        retParam.apiver = "v3"; //remark:标识新版api调用
        retParam.tt = new Date().getTime();
        if(params) {
            paramNameMap = paramNameMap || {};
            paramValueMap = paramValueMap || {};
            for(var p in params) {
                if(params.hasOwnProperty(p)) {
                    var valFn = paramValueMap[p],
                        val = (!!valFn ? valFn(params[p], params) : params[p]);
                    if(typeof(val) == "string") {
                        if(isPost) { val = decodeURIComponent(val); }
                        if(!_paramSpaceIgnoreList[p]) {
                            val = Base.trim(val);
                        }
                    }
                    retParam[paramNameMap[p] || p.toLowerCase()] = val;
                }
            }
        }
        return retParam;
    }
    /**
     * 处理返回的结果
     * @param {String} interfaceName 接口名称
     * @param {Object} jsonResult 返回结果对象
     * @returns {Object} 
     */
    function processResult(interfaceName, jsonResult) {
        if (ns && ns.traceID) {
            ns.traceID.getTraceID && ns.traceID.getTraceID(jsonResult);
        }
        if(jsonResult) {
            var processFunc = _resultProcessFunc[interfaceName];
            if(processFunc) { processFunc(jsonResult); }
            var errInfo = jsonResult.errInfo,
                data = jsonResult,
                result = data;
            if(!errInfo) {
                errInfo = {no : jsonResult.err_no, msg : jsonResult.err_msg || ""};
                delete data["err_no"];
                delete data["err_msg"];
                result = {data : data, errInfo : processReturnErrInfo(interfaceName, errInfo, data)};
            } else {
                data.errInfo = processReturnErrInfo(interfaceName, errInfo, data);
            }
            return result;
        }
        return jsonResult;
    }
    /**
     * 处理返回的错误信息，增加错误信息对应的域
     * @param {String} interfaceName 接口名称
     * @param {Object} errInfo 错误信息对象
     * @param {Object} data 返回的数据对象
     * @returns {Object} 
     */
    function processReturnErrInfo(interfaceName, errInfo, data) {
        var cfg = _errMsg[_errInfoFieldMapping[interfaceName] || interfaceName];
        if(cfg && errInfo && (errInfo.no != 0)) {
            var msgDefine = cfg[errInfo.no] || cfg["-1"];
            if(msgDefine) {
                var msg = msgDefine.msg; 
                errInfo.msg = msg;
                errInfo.field = msgDefine.field;
            }
        }
        return errInfo;
    }
    //生成get接口
    for(var p in _getInterfaces) {
        if(_getInterfaces.hasOwnProperty(p)) {
            ns[p] = defineInterface(p, _getInterfaces[p]);
        }
    }
    //提交接口
    for(var p in _postInterfaces) {
        if(_postInterfaces.hasOwnProperty(p)) {
            ns[p] = defineInterface(p, _postInterfaces[p], true);
        }
    }
    //外部暴露的提交接口
    function processSimpleResult(jsonResult) {
        if (ns && ns.traceID) {
            ns.traceID.getTraceID && ns.traceID.getTraceID(jsonResult);
        }
        if(jsonResult) {
            var errInfo = jsonResult.errInfo,
                data = jsonResult;
            if(!errInfo) {
                for(var p in jsonResult) {
                    if(jsonResult.hasOwnProperty(p)) {
                        var v = jsonResult[p];
                        if(v) { 
                            jsonResult[p] = decodeURIComponent(v);
                        }
                    }
                }
            }
            if(!errInfo) {
                errInfo = {no : jsonResult.err_no, msg : jsonResult.err_msg || ""};
                delete data["err_no"];
                delete data["err_msg"];
                jsonResult = {data : data, errInfo : errInfo};
            }
        }
        return jsonResult;
    }
    ns.jsonp = function(url, params) {
        if(url.indexOf("http") != 0) { url = _domain + url; }
        params = params || {};
        if(params.flag_code&&params.flag_code==1){

        }else{
            params.apiver = "v3"; //remark:标识新版api调用
        }
        
        params.tt = new Date().getTime();
        return Request.jsonp(
            url, 
            params,
            {
                charset : "utf-8",
                processData : function(jsonResult) {
                    return processSimpleResult(jsonResult);
                }
            }
        );
    };
    ns.post = function(url, data) {

        data = data || {};
        if (data.apitype !== 'wap') { 
            url = _domain + url
        }
        data.staticpage = data.staticpage || _ctx.staticPage;
        data.charset = data.charset || _ctx.charset || document.characterSet || document.charset || "";
        data.token = data.token || _ctx.token;
        data.tpl = data.tpl || _ctx.product;
        return Request.submit(
                    url,
                    data,
                    {
                        charset : "utf-8", 
                        processData : function(jsonResult) {
                            //decode
                            return processSimpleResult(jsonResult);
                        }
                    }
                );
    };
    ns.request = Request;
})(passport.data);
;
    /**
 * @Author: yangkun | yangkun01@baidu.com
 * @Overview: pass api登录api挂接analysis，用以统计数据
 * @Date: 2012-12-26
 */

var passport = passport || window.passport || {};
passport.analysis = passport.analysis || {};
(function(ns) {
    var getCookie =  function(key){
        var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
            result = reg.exec(document.cookie) || [];
            return result[2] || null;
    }
    var log = function(api, data){
        var merge = api.config.regMerge?1:0;
        var tpl = api.config.product || 'isnull';
        var protocol = window.location ? window.location.protocol.toLowerCase() : document.location.protocol.toLowerCase();
        var otherValue = '';
        var t = '&tt='+new Date().getTime();
        var gid = api.guideRandom ? api.guideRandom : '';
        for(var i in data){
            otherValue  = otherValue + '&'+i+'='+data[i]
        }

        if(protocol == 'http:'){
            var link = 'http://nsclick.baidu.com/v.gif?pid=111&url=&merge='+merge+'&gid='+gid+'&tpl='+tpl+otherValue + t;
        }else if(protocol == 'https:'){
            var link = 'https://passport.baidu.com/img/v.gif?merge='+merge+'&gid='+gid+'&tpl='+tpl+otherValue + t;
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
    ns.reg = {
        render:function(api){
            var formEle = api.getElement('form');
            baidu(formEle).on('click',function(){
                if(!api.REGFIRSTCLICK){
                    api.REGFIRSTCLICK = true;   
                    log(api,{
                        regtype:api.config.isPhone?'phone':'email',
                        type:'regfirst'
                    })                   
                }
            })

            log(api,{type:'regfirstrender',regurl:encodeURIComponent(document.location.href)})

            return {preventEvent : false, preventDefault : false};
        },
        validateError:function(api,ele){
            if(ele.validate){
                log(api,{errno:encodeURIComponent(ele.validate.msg),type:'regerrno'})
            }
            return {preventEvent : false, preventDefault : false};
        },
        fieldKeyup: function(api, args) {
            //有输入的次数
            if(!api.KEYUPFLAG){
                log(api,{type:'typein',module:'reg'})
                api.KEYUPFLAG = true;
            }
        }
    };
})(passport.analysis);;
    /**
 * @Author: xiongweilie | xiongweilie@baidu.com
 * @Overview: pass api注册api挂接hook
 * @Date: 2013-3-13
 */

var passport = passport || window.passport || {};
passport.hook = passport.hook || {};
(function(ns) {
    var W = window,
        D = window.document,
        B = window.document.body,
        E = window.document.documentElement,
        base = {
            _createScriptTag: function(a, b, c) {
                a.setAttribute('type', 'text/javascript');
                c && a.setAttribute('charset', c);
                a.setAttribute('src', b);
                D.getElementsByTagName('head')[0].appendChild(a)
            },
            _removeScriptTag: function(a) {
                if (a.clearAttributes) {
                    a.clearAttributes()
                } else {
                    for (var b in a) {
                        if (a.hasOwnProperty(b) && 'parentNode' != b) {
                            delete a[b]
                        }
                    }
                }
                if (a && a.parentNode) {
                    a.parentNode.removeChild(a)
                }
                a = null
            },
            "on":function(ele,type,func){
                if(ele.addEventListener){
                    ele.addEventListener(type,func,false);
                }else if(ele.attachEvent){
                    ele.attachEvent("on" + type,func);
                }
            },
            "unon":function(ele,type,func){
                if(ele.removeEventListener){
                    ele.removeEventListener(type,func,false);
                }else if(ele.detachEvent){
                    ele.detachEvent("on" + type,func);
                }
            },
            getSize: function() {
                return {
                    t: (B.scrollTop || E.scrollTop),
                    l: (B.scrollLeft || E.scrollLeft),
                    w: (E.clientWidth || B.clientWidth),
                    h: (W.innerHeight || E.clientHeight || B.clientHeight)
                }
            },
            getEleWidth:function(elem){
                var  size;
                if(elem.style.width)sizeelem.style.width;
                if(elem.currentStyle)return elem.currentStyle.width;
                if(document.defaultView && document.defaultView.getComputedStyle)
                return document.defaultView.getComputedStyle(elem,"").getPropertyValue("width");
            },
            getEleHeight:function(elem){
                var  size;
                if(elem.style.height)sizeelem.style.height;
                if(elem.currentStyle)return elem.currentStyle.height;
                if(document.defaultView && document.defaultView.getComputedStyle)
                return document.defaultView.getComputedStyle(elem,"").getPropertyValue("height");
            },
            getPosition: function(a) {
                var s = base.getSize(),
                o = a,
                pos = {
                    t: 0,
                    l: 0
                },
                gecko = /gecko/.test(navigator.userAgent),
                posAdd = function(t, l) {
                    pos.t += t;
                    pos.l += l
                };
                if (o && o != B) {
                    if (o.getBoundingClientRect) {
                        var b = o.getBoundingClientRect(),
                            doc =  a.ownerDocument,
                            body = doc.body,
                            html = doc.documentElement,
                            clientTop = html.clientTop || body.clientTop || 0,
                            clientLeft = html.clientLeft || body.clientLeft || 0;
                        if (b.top == b.bottom) {
                            var g = o.style.display;
                            o.style.display = "block";
                            o.style.display = g
                        }
                        posAdd(b.top + s.t - clientTop, b.left + s.l - clientLeft)
                    } else {
                        var c = D.defaultView;
                        while (o) {
                            posAdd(o.offsetTop, o.offsetLeft);
                            var e = c.getComputedStyle(o, null);
                            if (gecko) {
                                var f = parseInt(e.getPropertyValue("border-left-width"), 10) || 0,
                                bs = parseInt(e.getPropertyValue("border-top-width"), 10) || 0;
                                posAdd(bs, f);
                                if (o != a && e.getPropertyValue("overflow") != "visible") {
                                    posAdd(bs, f)
                                }
                            }
                            o = o.offsetParent
                        }
                        o = a.parentNode;
                        while (o && o != B) {
                            posAdd( - o.scrollTop, -o.scrollLeft);
                            o = o.parentNode
                        }
                    }
                }
                return pos
            },
            children:function(ele){
                for (var children = [], tmpEl = ele.firstChild; tmpEl; tmpEl = tmpEl.nextSibling) {
                    if (tmpEl.nodeType == 1) {
                        children.push(tmpEl);
                    }
                }
                return children;
            },
            "generateRandom":function(str,n){
                var m = str.length;
                var s = '';
                for(var i = 1; i <= n; i++){
                    var r = Math.floor(m*Math.random());
                    s = s + str.charAt(r);
                }
                return s;
            },
            "getMousePos":function(ev){
                if (ev.pageX || ev.pageY) {
                    return {
                        x: ev.pageX,
                        y: ev.pageY
                    };
                }

                if (D.documentElement && D.documentElement.scrollTop) {
                    return {
                        x: ev.clientX + D.documentElement.scrollLeft - D.documentElement.clientLeft,
                        y: ev.clientY + D.documentElement.scrollTop - D.documentElement.clientTop
                    };
                }
                else if (D.body) {
                    return {
                        x: ev.clientX + B.scrollLeft - B.clientLeft,
                        y: ev.clientY + B.scrollTop - B.clientTop
                    };
                }
            },
            getViewHeight : function () {
                var client = D.compatMode == 'BackCompat' ? D.body : D.documentElement;
                return client.clientHeight;
            },
            getScrollTop : function () {
                return window.pageYOffset || D.documentElement.scrollTop || B.scrollTop;
            }
        };
    /**
     * @description 挂接弹层处理的业务
     * @function
     * @param {Object} api api实例对象
     * @param {Object} args 事件参数
     * @param {Object} cfg 挂接配置，可选
     *                      onCompleted : {Function} 业务流程完成的回调函数
     *                      onCancel : {Function} 业务流程被取消的回调函数
     # @return {Object} {preventEvent : {Boolean}, preventDefault : {Boolean}}
     */
    var _loadedCssFiles = {},
        _dataString     = '',
        _slocEle        = '',
        _formItems      = {},
        _monitorData    = {};
        _monitorData.loaded     = {};//进入页面时
        _monitorData.email      = {};//邮件
        _monitorData.userName   = {};//用户名
        _monitorData.phone      = {};//手机号
        _monitorData.smscode    = {};//短信验证码
        _monitorData.verifyCode = {};//验证码
        _monitorData.password   = {};//密码
        _monitorData.submit     = {};//提交
    ns.reg = {
        getApiInfo: function(api, args) {
            api.firstShow = true;
            _hiddenFields = api.getElement('hiddenFields')//获取隐藏表单节点
            _formItems.emailEle = api.getElement('email')//获取表单节点
            _formItems.userNameEle = api.getElement('userName')//获取表单节点
            _formItems.phoneEle = api.getElement('phone')//获取表单节点
            _formItems.smsCodeEle = api.getElement('smscode')//获取表单节点
            _formItems.verifyCodeEle = api.getElement('verifyCode')//获取表单节点
            _formItems.passwordEle = api.getElement('password')//获取表单节点
            _formItems.submitEle = api.getElement('submit')//获取表单节点
            
            function getLoadedXY(e){
            //获取用户刚刚进入页面时用户的鼠标位置和当前时间
                var e = e||window.event;
                var mousePos = base.getMousePos(e);
                if(mousePos.x>0&&mousePos.y>0){
                    base.unon(document,"mousemove",getLoadedXY);
                    _monitorData.loaded.n = 'loaded';
                    _monitorData.loaded.x = mousePos.x;
                    _monitorData.loaded.y = mousePos.y;
                    _monitorData.loaded.t1 = new Date().getTime();

                }
            }
            base.on(document,"mousemove",getLoadedXY);

            for(var item in _formItems){
                (function(ele){
                    if(ele){
                        base.on(ele,'focus',function(e){
                            var getNowTime  = new Date().getTime(),
                                eleName     = ele.name || ele.type;

                            if(typeof(_monitorData[eleName]) == 'object' && !_monitorData[eleName].w ){
                            //获取第一次表单获得焦点的时间点
                                _monitorData[eleName].w = base.getEleWidth(ele).replace(/[^\d]/g,'');
                                _monitorData[eleName].h = base.getEleHeight(ele).replace(/[^\d]/g,'');
                            }
                        })

                        base.on(ele,'click',function(e){
                            var getNowTime  = new Date().getTime(),
                                mousePos    = base.getMousePos(e),
                                getElePos   = base.getPosition(ele),
                                eleName     = ele.name || ele.type;
                            if(typeof(_monitorData[eleName]) == 'object' && !_monitorData[eleName].t1 ){
                            //获取第一次表单被点击的时间点
                                _monitorData[eleName].n = eleName;
                                _monitorData[eleName].x = mousePos.x-getElePos.l;
                                _monitorData[eleName].y = mousePos.y-getElePos.t;
                                _monitorData[eleName].t1 = getNowTime;
                            }
                        })

                        base.on(ele,'keydown',function(e){
                            var getNowTime  = new Date().getTime(),
                                eleName     = ele.name || ele.type;
                            if(typeof(_monitorData[eleName]) == 'object' && !_monitorData[eleName].t2 ){
                            //获取第一次开始输入的时间点
                                _monitorData[eleName].t2 = getNowTime;
                            }
                        })

                        base.on(ele,'blur',function(e){
                            var getNowTime  = new Date().getTime(),
                                eleName     = ele.name || ele.type;
                            if(typeof(_monitorData[eleName]) == 'object' && !_monitorData[eleName].t3 ){
                            //获取第一次表单失去焦点的时间点
                                _monitorData[eleName].t3 = getNowTime;
                            }
                        })
                    }
                })(_formItems[item])
            }

            baidu(_hiddenFields).insertHTML('beforeEnd','<input type="hidden" name="sloc" value id="'+api._eid+'sloc">')
            return {preventEvent : false, preventDefault : false};
        },
        beforeSubmit:function(api,args){
            if(_monitorData['loaded']){
                //如果存在基本的loaded参数则提交数据
                _monitorData['loaded'].t3 = new Date().getTime();

                //打包数据
                var userUIdata = '';
                for(var item in _monitorData){
                    userUIdata = userUIdata + item + '#' + _monitorData[item].w + '#' + _monitorData[item].h + '#' + _monitorData[item].x + '#' + _monitorData[item].y + '#' + _monitorData[item].t1 + '#' + _monitorData[item].t2 + '#' + _monitorData[item].t3 + '@' 
                }
                if( baidu("#"+api.guid+"__sloc")[0].name == 'sloc') baidu("#"+api.guid+"__sloc")[0].value = userUIdata.replace(/undefined/g, "");
            }
            return {preventEvent : false, preventDefault : false};
        }
    };
})(passport.hook);;
    ///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.dom.on;
///import baidu.dom.delegate;
///import baidu.event.preventDefault;

/**
 * @description passport ui, 为 passport 各模块提供公共方法
 * @class
 * @name magic.passport
 * @superClass magic.Base
 */
/* globals passport */
/* eslint-disable */
magic.passport = baidu.lang.createClass(function () {

    this._validateInfo = {
        /** field: true|false **/	// 一个表单项是否处于验证失败的状态
    };

}, {
    type: 'magic.passport',
    superClass: magic.Base
}).extend({
    /* eslint-disable fecs-camelcase */
    _getRegularField: function (opt, action) {
        var type = opt.pwd ? 'password' : 'text';
        var me = this;
        var autoComplete = 'autocomplete="off"';
        var maxLength = opt.maxLength ? 'maxlength="' + opt.maxLength + '"' : '';
        var tip = opt.tip ? opt.tip : '';
        var value = opt.value ? opt.value : '';
        var display = opt.field + '' === 'verifycode' ? 'none' : '';

        var forbidInputAutoFill = '';
        if (type === 'text') {
            forbidInputAutoFill = '<input type="text" style="display:none;">';
        } else {
            forbidInputAutoFill = '<input type="password" style="display: none;">';
        }

        var str = '<p id="' + me.$getId(opt.field + 'Wrapper')
            + '" class="pass-form-item pass-form-item-'
            + opt.field + '" style="display:' + display + '">'
            + (opt.label
                ? '<label for="' + me.$getId(opt.field) + '" id="'
                + me.$getId(opt.field + 'Label') + '" class="pass-label pass-label-'
                + opt.field + '">' + opt.label + '</label>'
                : '')
            + '' + forbidInputAutoFill + ''
            + '<input id="' + me.$getId(opt.field) + '" type="' + type + '" name="' + opt.field
            + '" class="pass-text-input pass-text-input-' + opt.field + '" ' + maxLength
            + (opt.placeholder ? ('placeholder="' + opt.placeholder + '" ') : '')
            + autoComplete + (opt.disabled ? '" disabled' : '') + ' value="' + value + '"/>'
            + (!opt.noError
                ? '<span id="' + me.$getId(opt.field + 'Error')
                + '" class="pass-item-error pass-item-error-' + opt.field + '"></span>' : '')
            + (opt.hasSucc
                ? '<span id="' + me.$getId(opt.field + 'Succ')
                + '" class="pass-item-succ pass-item-succ-'
                + opt.field + '" style="display:none;"></span>' : '')
            + '<span id="' + me.$getId(opt.field + 'Tip') + '" class="pass-item-tip pass-item-tip-'
            + opt.field + '" style="display:none"><span id="'
            + me.$getId(opt.field + 'TipText') + '" class="pass-item-tiptext pass-item-tiptext-'
            + opt.field + '">' + tip
            + '</span></span>'
            + '</p>';
        return str;
    },
    /* eslint-disable fecs-camelcase */
    _getHiddenField: function (fields, type) {
        var me = this;
        var value;
        var str = '<p id="' + me.$getId(type || 'hiddenFields') + '" style="display:none">';
        for (var i in fields) {
            if (fields.hasOwnProperty(i)) {
                if (typeof(fields[i]) === 'string') {
                    // 防止第三方传递的参数出现XSS漏洞
                    value = fields[i]
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/\x22/g, '&quot;')
                    .replace(/\x27/g, '&#39;');
                } else {
                    value = fields[i];
                }
                str += '<input type="hidden" id="'
                    + me.$getId((type ? type + '_' : '') + i) + '" name="'
                    + i + '" value="' + value + '" />';
            }
        }
        str += '</p>';
        return str;
    },
    /* eslint-disable fecs-camelcase */
    _setEvent: function () {
        var me = this;
        var container = this.getElement();

        var fn = function (e) {
            me._eventHandler.entrance.apply(me, [e]);
        };
        baidu(me.getElement()).on('resize', function () {
            var usagent = navigator.userAgent;
            // 为true则是ios9以上
            var iosVersion = !navigator.userAgent.match(/OS [1-8]_\d[_\d]* like Mac OS X/i);
            var isIos = !!navigator.userAgent.toString().match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            var isPad = navigator.userAgent.toString().indexOf('iPad');
            if (iosVersion && isIos && isPad != null) {
                var a = document.getElementsByClassName('popBox');
                if (a != null && a.length > 0) {
                    if (window.screen.height > document.body.clientHeight) {
                        a[0].style.height = window.screen.height
                            * (window.screen.height / document.body.clientHeight)
                            + 120 + 'px';
                    } else {
                        a[0].style.height = window.screen.height * (window.screen.height / document.body.clientHeight);
                    }
                }
            }

        });
        baidu(me.getElement('form')).on('submit', fn);
        baidu(me.getElement('license')).on('click', fn);
        baidu(me.getElement('verifyCodeChange')).on('click', fn);
        baidu(me.getElement('verifyCodeSend')).on('click', fn);
        baidu(me.getElement('smsVcodeSend')).on('click', fn);
        // baidu('.upload-bt',me.getElement()).on('change',fn);
        // baidu('.img-style',me.getElement()).on('click',fn);

        // baidu('.pass_form_item_suggest').delegate('input', 'click', fn);
        // baidu(container).delegate('.pass-suggest-item-radio', 'click', fn);
        baidu(container).delegate('.pass-suggest-item label', 'click', fn);

        baidu('.pass-text-input', me.getElement()).on({
            'focus': fn,
            'blur': fn,
            'change': fn,
            'keyup': fn,
            'mouseover': fn,
            'mouseout': fn
        });
    },
    /* eslint-disable fecs-camelcase */
    _validator: {
        confStorage: {},
        builtInMsg: {
            required: '请您输入%s',
            phone: '手机号码格式不正确',
            email: '邮箱格式不正确',
            idcard: '身份证格式不正确'
        },
        builtInRules: {
            // rule 可以为:  regString|regObject|function
            required: /\S+/,
            phone: /^1[3456789]\d{9}$/,
            email: /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            idcard: /(^\d{15}$)|(^\d{17}(\d|X|x)$)/
        },

        /**
         * _validator的入口，配置表单验证信息
         * @param {Object} me 实例指针
         * @param {Object} conf 验证配置项
         */
        init: function (me, conf) {
            this.confStorage[me.$getId()] = conf;
        },

        /**
         * * 校验单个表单域
         * @param {Object} me 上下文
         * @param {string} field 要校验的表单域
         * @param {string} callbacks 校验完成回调，可选
         * @param {string} type 校验类型，可选
         * @returns {boolean} 校验是否通过
         */
        validate: function (me, field, callbacks, type) {
            var ele = me.getElement(field);
            var output = {
                field: field
            };
            var re = /^\s*(.+?)\s*$/;
            // skip hidden
            if (!ele || +ele.offsetHeight === 0) {
                return false;
            }

            // 同步校验
            var value = ele.value.replace(re, '$1');
            var conf = this.confStorage[me.$getId()][field];
            var rules = conf.rules;

            for (var i = 0, j = rules.length; i < j; i++) {
                var ruleName = rules[i];
                var rule = this.builtInRules[ruleName];
                var result;
                if (Object.prototype.toString.call(rule).toLowerCase() === '[object function]') {
                    result = rule.call(me, ele, type);
                } else {
                    result = new RegExp(rule).test(value);
                }
                if (!result) {
                    // 同步校验 -> 未通过
                    output['error'] = true;
                    me._validateInfo[field] = 0;
                    output['msg'] = this.builtInMsg[ruleName].replace(/\%s/, conf.desc);
                    me._validateError(output);
                    callbacks.error(output);

                    return;
                }
            }

            // 同步校验通过, 开始异步校验
            if (!conf.asyncRule) {
                // 没有异步校验 -> 校验通过
                output['error'] = false;
                me._validateInfo[field] = 1;
                me._validateSuccess(output);
                callbacks.success(output);
            } else {
                // 有异步校验
                conf.asyncRule.call(me, {
                    success: function (rsp) {
                        // 异步校验通过
                        output['error'] = false;
                        output['data'] = rsp.data;
                        me._validateInfo[field] = 1;
                        me._validateSuccess(output);
                        callbacks.success(output);
                    },
                    error: function (rsp) {
                        // // 异步校验未通过
                        output['error'] = true;
                        me._validateInfo[field] = 0;
                        output['msg'] = rsp.msg;
                        me._validateError(output);
                        callbacks.error(output);
                    }
                }, type);
            }
        },

        /**
         * 校验整个表单
         * @param {Object} me 上下文
         * @param {Object} callbacks 回调
         * @param {boolean} breakOnError 有验证项未通过，则不再往下继续验证
         */
        validateAll: function (me, callbacks, breakOnError) {
            var all = this.confStorage[me.$getId()];
            var counter = 0;
            var error = false;
            // onComplete 是否已经被调用, if true, 则不再继续验证, 用于 breakOnError
            var completed = false;
            var result = [];
            var allLen = this._getActiveValidate(me, true);
            for (var i in all) {
                if (completed) {
                    break;
                }
                this.validate(me, i, {
                    success: function (input) {
                        counter++;
                        result.push(input);

                        // 全部校验完成
                        if (counter === allLen) {
                            onComplete();
                        }
                    },
                    error: function (input) {
                        // 一项为 error, 则 validateAll 的结果为 error
                        error = true;
                        counter++;
                        result.push(input);

                        if (breakOnError) {
                            onComplete();
                            return;
                        }

                        // 全部校验完成
                        if (counter === allLen) {
                            onComplete();
                        }
                    }
                }, 'all');
            }

            function onComplete() {
                completed = true;
                if (error) {
                    callbacks && callbacks.error(result);
                } else {
                    callbacks && callbacks.success(result);
                }
            }
        },

        /**
         * @description 获取当前可参与验证的元素。(主要用来排除配置中添加，但是在DOM树中不存在或不可见的元素)
         * @function
         * @private
         * @param {Boolean} lenthOnly 是否只返回满足条件元素的数量
         * @return {Number|Array} 满足条件元素的数量或集合
         */
        /* eslint-disable fecs-camelcase */
        _getActiveValidate: function (me, lenthOnly) {
            var all = this.confStorage[me.$getId()];
            var result = [];
            for (var i in all) {
                var ele = me.getElement(i);
                if (!ele || ele.offsetHeight === 0) {
                    continue;
                }
                result.push(ele);
            }
            return lenthOnly ? result.length : result;
        },

        /**
         * 增加规则
         * @param {string} key 规则名
         * @param {RegExp|string|Function} rule 规则，可以是正则表达式、正则表达式字符串、返回布尔值的函数
         */
        addRule: function (key, rule) {
            var newRule = {};
            newRule[key] = rule;
            baidu.extend(this.builtInRules, newRule);
        },

        /**
         * 增加消息
         * @param {string} key 消息名
         * @param {string} msg 消息实际内容
         */
        addMsg: function (key, msg) {
            var newMsg = {};
            newMsg[key] = msg;
            baidu.extend(this.builtInMsg, newMsg);
        }
    },

    /**
     * 校验单个表单域
     * @param {string} field 要校验的表单域
     * @param {string} callbacks 校验完成回调，可选
     */
    validate: function (field, callbacks) {
        var me = this;

        /**
         * @description 开始校验单个表单域前
         * @name magic.passport#beforeValidate
         * @event
         * @grammar magic.passport#beforeValidate(e)
         * @param {Object} e 事件参数
         * @param {Object} e.validate 校验信息
         * @param {string} e.validate.field 参与校验的表单项名
         * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
         */
        var returnValue = me.fireEvent('beforeValidate', {
            validate: {
                field: field,
                ele: baidu(me.getElement(field))
            }
        });
        if (!returnValue) {
            return;
        }

        me._validator.validate(me, field, {
            success: function (validate) {

                /**
                 * @description 单项表单域校验通过
                 * @name magic.passport#validateSuccess
                 * @event
                 * @grammar magic.passport#validateSuccess(e)
                 * @param {Object} e 事件参数
                 * @param {Object} e.validate 校验结果
                 * @param {Object} e.validate.ele 参与校验的元素
                 */
                var returnValue = me.fireEvent('validateSuccess', {
                    validate: validate
                });
                if (!returnValue) {
                    return;
                }

                callbacks && callbacks.success && callbacks.success(validate);
            },
            error: function (validate) {

                /**
                 * @description 单项表单域校验未通过
                 * @name magic.passport#validateError
                 * @event
                 * @grammar magic.passport#validateError(e)
                 * @param {Object} e 事件参数
                 * @param {Object} e.validate 校验结果
                 * @param {Object} e.validate.ele 参与校验的元素
                 * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
                 */
                var returnValue = me.fireEvent('validateError', {
                    validate: validate
                });
                if (!returnValue) {
                    return;
                }

                callbacks && callbacks.error && callbacks.error(validate);
            }
        });
    },

    /**
     * 校验整个表单
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    validateAll: function (callbacks, breakOnError) {
        var me = this;
        if (typeof callbacks === 'boolean') {
            breakOnError = callbacks;
        } else {
            breakOnError = breakOnError ? breakOnError : false;
        }

        /**
         * @description 开始校验整个表单前
         * @name magic.passport#beforeValidateAll
         * @grammar magic.passport#beforeValidateAll()
         * @event
         */
        var returnValue = me.fireEvent('beforeValidateAll');
        if (!returnValue) {
            return;
        }

        me._validator.validateAll(me, {
            success: function (validates) {

                /**
                 * @description 全表单校验通过
                 * @name magic.passport#validateAllSuccess
                 * @event
                 * @grammar magic.passport#validateAllSuccess(e)
                 * @param {Object} e 事件参数
                 * @param {Array} e.validates 校验结果的集合
                 */
                var returnValue = me.fireEvent('validateAllSuccess', {
                    validates: validates
                });
                if (!returnValue) {
                    return;
                }

                callbacks && callbacks.success && callbacks.success(validates);
            },
            error: function (validates) {

                /**
                 * @description 全表单校验未通过
                 * @name magic.passport#validateAllError
                 * @event
                 * @grammar magic.passport#validateAllError(e)
                 * @param {Object} e 事件参数
                 * @param {Array} e.validates 校验结果的集合
                 */
                var returnValue = me.fireEvent('validateAllError', {
                    validates: validates
                });
                if (!returnValue) {
                    return;
                }

                callbacks && callbacks.error && callbacks.error(validates);
            }
        }, breakOnError);
    },

    /**
     * 获取表单项的校验状态
     * @param {string} field 表单域
     * @return {Enum} status 状态。1: 验证通过; 0: 验证未通过; -1: 尚未参与验证
     */
    getValidateStatus: function (field) {
        return this._validateInfo.hasOwnProperty(field) ? this._validateInfo[field] : -1;
    },

    /**
     * 设置表单项的校验状态为通过
     * @param {string} field 表单域
     */
    setValidateSuccess: function (field) {
        var me = this;
        me._validateInfo[field] = 1;
        me._validateSuccess({
            field: field
        });
    },

    /**
     * 设置表单项的校验状态为未通过
     * @param {string} field 表单域
     * @param {string} msg 错误消息
     * @param {Object} opt 配置参数
     */
    setValidateError: function (field, msg, opt) {
        var me = this;
        me._validateInfo[field] = 0;
        me._validateError({
            field: field,
            msg: msg
        }, opt);
    },
    setGeneralError: function (msg) {
        this.getElement('error').innerHTML = msg;
    },
    /* eslint-disable fecs-camelcase */
    clearGeneralError: function () {
        this.getElement('error').innerHTML = '';
    },
    /* eslint-disable fecs-camelcase */
    _isSupportPlaceholder: function () {
        return 'placeholder' in document.createElement('input');
    },
    /* eslint-disable fecs-camelcase */
    _getPlaceholder: function (rendList) {
        var me = this;
        var holder = {};
        var phContent = '';
        var clear = {};
        for (var i = 0; i < rendList.length; i++) {
            phContent = me.lang[rendList[i].placeholder];

            if (+rendList[i].clearbtn !== 0) {
                clear[i] = baidu('<span id="'
                    + me.$getId(rendList[i].label + '_clearbtn')
                    + '" class="pass-clearbtn pass-clearbtn-' + rendList[i].label
                    + '" style="display:none;"></span>');
                baidu(me.getElement(rendList[i].label)).after(clear[i]);
            }

            if (me._isSupportPlaceholder() && !baidu.browser.ie) {
                // 高级浏览器（除了IE）均使用浏览器自带的placeholder功能
                baidu(me.getElement(rendList[i].label)).attr({
                    placeholder: phContent
                });
            } else {
                // IE浏览器也使用通用的placeholder功能
                holder[i] = baidu('<span id="'
                    + me.$getId(rendList[i].label + '_placeholder')
                    + '" class="pass-placeholder pass-placeholder-'
                    + rendList[i].label + '">' + phContent + '</span>');
                baidu(me.getElement(rendList[i].label)).after(holder[i]);
            }

            me._rendEventPlaceholder(me.getElement(rendList[i].label), holder[i], clear[i]);
        }
    },
    /* eslint-disable fecs-camelcase */
    _getCookie: function (name) {
        var arr;
        var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    },
    /* eslint-disable fecs-camelcase */
    _logPass: function (urlData, auto_statisticObj) {
        var link = document.location.protocol + '//nsclick.baidu.com/v.gif?pid=111&v=' + new Date().getTime();
        var auto_statistic = '';
        for (var i in auto_statisticObj) {
            auto_statistic = auto_statistic + i + ':' + auto_statisticObj[i] + ',';
        }
        auto_statistic = base64encode('{' + auto_statistic.substring(0, auto_statistic.length - 1) + '}');
        for (var x in urlData) {
            if (urlData.hasOwnProperty(x)) {
                link += '&' + x + '=' + urlData[x];
            }
        }
        link += '&source=pc';
        link += '&auto_statistic=' + auto_statistic + '&auto_en=' + auto_statisticObj.eventType;
        if (link) {
            var img = new Image();
            img.onload = img.onerror = function () {
                img.onload = img.onerror = null;
                img = null;
            };
            img.src = link;
        }

        function base64encode(str) {
            var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var out;
            var i;
            var len;
            var c1;
            var c2;
            var c3;
            len = str.length;
            i = 0;
            out = '';
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i === len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    out += '==';
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i === len) {
                    out += base64EncodeChars.charAt(c1 >> 2);
                    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    out += '=';
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += base64EncodeChars.charAt(c3 & 0x3F);
            }
            return out;
        }
    },

    logClickLink: function (data, event) {
        data = data || {};
        data = this.formatLogData(data);
        var target = event.target || event.srcElement;
        var attribute = target && target.getAttribute && target.getAttribute('target');
        var isSelf = attribute === '_self' || attribute === null;
        var link = this.makeImgSrc(data);

        if (isSelf) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }

        if (window.navigator.sendBeacon && isSelf) {
            window.navigator.sendBeacon(link);
            window.location.href = target.getAttribute('href');
        } else if (isSelf) {
            this.lazyLog(target, link, null);
        } else {
            var img = new Image();
            img.onload = img.onerror = function () {
                img.onload = img.onerror = null;
                img = null;
            };
            img.src = link;
        }
    },

    logCallBack: function (data, callback) {
        data = data || {};
        data = this.formatLogData(data);
        var link = this.makeImgSrc(data);

        this.lazyLog({}, link, callback);
    },

    formatLogData: function (data) {
        var config = this.config || {};
        return baidu.extend({}, {
            'page': data.logPage || '',
            'source': 'pc-api',
            'tpl': config.product || '',
            'subpro': config.subpro || '',
            'extrajson': config.extrajson || '',
            'data_source': 'fe'
        }, data);
    },

    makeImgSrc: function (data) {
        var link = document.location.protocol + '//nsclick.baidu.com/v.gif?pid=111&type=1023&v='
            + new Date().getTime();
        var urlDataParams = '';
        for (var x in data) {
            if (data.hasOwnProperty(x)) {
                if (x !== 'en') {
                    urlDataParams += '&' + x + '=' + data[x];
                } else {
                    urlDataParams += '&auto_en=' + data[x];
                }
            }
        }

        var autoStatistic = '{eventType:' + (data.en || '') + '}';
        autoStatistic = this.base64encode(autoStatistic);
        link += '&auto_statistic=' + autoStatistic;
        link += '&auto_en=' + (data.en || '');

        link += urlDataParams;
        return link;
    },

    lazyLog: function (target, imgSrc, callback) {
        var href = target.getAttribute && target.getAttribute('href');
        var img = new Image();
        var timer = setTimeout(function () {
            img.onload = img.onerror = img = null;
            doNext('imgTimeout');
        }, 200);
        img.onload = img.onerror = function () {
            clearTimeout(timer);
            img.onload = img.onerror = img = null;
            doNext('imgSuccess');
        };
        img.src = imgSrc;

        function doNext(witch) {
            if (callback) {
                callback();
            } else {
                window.location.href = href;
            }
        }
    },

    base64encode: function (str) {
        var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var out;
        var i;
        var len;
        var c1;
        var c2;
        var c3;
        len = str.length;
        i = 0;
        out = '';
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += '==';
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i === len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += '=';
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },

    /* eslint-disable fecs-camelcase */
    _rendEventPlaceholder: function (self, holder, clear) {
        if (!self && !clear) {
            return;
        }

        var me = this;
        var clearDbClick;
        var mouseDownFlag;
        var hasValueFunc = function (hasValue) {
            if (+hasValue === 1) {
                holder && holder[0] && me.$hide(holder[0]);
                clear && clear[0] && me.$show(clear[0]);
            } else {
                holder && holder[0] && me.$show(holder[0]);
                clear && clear[0] && me.$hide(clear[0]);
            }
        };

        setTimeout(function () {
            if (self && self.value) {
                // 如果已经有值了就隐藏
                hasValueFunc(1);
            }
        }, 200);
        baidu(holder).on('mousedown', function () {
            mouseDownFlag = true;
            clearTimeout(clearDbClick);
            clearDbClick = setTimeout(function () {
                if (!(me.suggestionDom && me.suggestionDom.style.display !== 'none')) {
                    self.focus();
                }
            }, 0);
        });
        baidu(clear).on('click', function () {
            self.value = '';
            hasValueFunc(0);
            // setTimeout(function(){
            self.focus();
            // },0)
            if (me.suggestionDom) {
                me.suggestionDom.data_delete = true;
                setTimeout(function () {
                    me.suggestionDom.data_delete = false;
                }, 200);
            }
        });
        baidu(self).on('keyup', function () {
            if (self.value) {
                hasValueFunc(1);
            } else {
                hasValueFunc(0);
            }
        });
        baidu(self).on('focus', function () {
            window.inputCheckTimer = setInterval(function () {
                if (self.value.length) {
                    hasValueFunc(1);
                    clearInterval(window.inputCheckTimer);
                } else {
                    hasValueFunc(0);
                }
            }, 30);
        });
    },
    SBCtoDBC: function (str) {
        var result = '';
        if (str) {
            var len = str.length;
            for (var i = 0; i < len; i++) {
                var cCode = str.charCodeAt(i);
                // 全角与半角相差（除空格外）：65248（十进制）
                cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
                // 处理空格
                cCode = (cCode == 0x03000) ? 0x0020 : cCode;
                result += String.fromCharCode(cCode);
            }
            return result;
        } else {
            return;
        }
    },
    hide: function () {
        /**
         * @description 隐藏模块
         * @name magic.passport#hide
         * @grammar magic.passport#hide
         * @function
         */
        this.getElement().style.display = 'none';
    },
    show: function () {
        /**
         * @description 显示模块
         * @name magic.passport#show
         * @grammar magic.passport#show
         * @function
         */
        this.getElement().style.display = 'block';
    },
    /* eslint-disable fecs-camelcase */
    _analysis: function (name, extraParam) {
        if (window.passport.analysis
            && window.passport.analysis[this.module]
            && window.passport.analysis[this.module][name]) {
            window.passport.analysis[this.module][name](this, extraParam);
            return {
                preventDefault: false,
                preventEvent: false
            };
        }
    },
    /* eslint-disable fecs-camelcase */
    _hook: function (event, param) {
        if (window.passport.hook
            && window.passport.hook[this.module]
            && window.passport.hook[this.module][event]) {
            return window.passport.hook[this.module][event](this, param);
        } else {
            return {
                preventDefault: false,
                preventEvent: false
            };
        }
    },
    fireEvent: function (event, param) {
        var hook = this._hook(event, param);
        var continueDefault = true;
        if (!hook.preventEvent) {
            continueDefault = this.fire(event, param);
        }
        return !hook.preventDefault && continueDefault;
    },
    getQueryString: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return '';
	}
});
;
    /**
 * @file passport 注册模块
 * @name magic.passport.reg
 * @grammar new magic.passport.reg(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 注册成功后的跳转页面
 * @param {String} options.retu 注册成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Boolean} options.isPhone 是否使用手机号注册，默认 false
 * @param {Boolean} options.userName 是否需要填写用户名，默认 false
 * @return {magic.passport.reg} magic.passport.reg 实例
 * @superClass magic.passport
 */

///import baidu.lang.createClass;
///import baidu.object.extend;
///import baidu.string.getByteLength;
///import baidu.form.json;
///import baidu.dom;
///import baidu.dom.show;
///import baidu.dom.hide;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import baidu.dom.remove;
///import baidu.dom.empty;
///import baidu.dom.append;
///import baidu.dom.insertAfter;
///import baidu.dom.offset;
///import magic.passport;
///import magic.setup.suggestion;
/* eslint-disable */
magic.passport.reg = baidu.lang.createClass(function (options) {
    var me = this;
    me.config = {
        isPhone: false,
        userName: false,
        staticPage: '',
        u: '',
        retu: '',
        passwordConfirm: false,
        product: '',
        charset: '',
        lang: 'zh-CN',
        isexchangeable: 0,
        // 待定参数，用以统计
        subpro: '',
        // nocaptcha: !!window.NoCaptcha && (!baidu.browser.ie || parseInt(baidu.browser.ie) > 8) && window.location.search.indexOf('lightwebapp') == -1 && window.location.search.indexOf("cloudforbusiness") == -1 && window.location.search.indexOf("bceplat") == -1// 已加载行为验证码库并且IE8以上则开启行为验证码
        nocaptcha: false,
        isVoiceSms: 0
    };
    baidu.object.extend(me.config, options);
    this.module = 'reg';
    this.guideRandom = (function () {
        return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    })();
    me._domain = {
        'https': 'https://passport.baidu.com',
        'http': 'http://passport.baidu.com/',
        'auto': (window.location
            ? ((window.location.protocol.toLowerCase() === 'https:')
                ? 'https://passport.baidu.com' : 'http://passport.baidu.com/')
            : ((document.location.protocol.toLowerCase() === 'https:')
                ? 'https://passport.baidu.com' : 'http://passport.baidu.com/')),
        'wapAuto': (window.location
            ? ((window.location.protocol.toLowerCase() === 'https:')
                ? 'https://wappass.baidu.com' : 'http://wappass.baidu.com/')
            : ((document.location.protocol.toLowerCase() === 'https:')
                ? 'https://wappass.baidu.com' : 'http://wappass.baidu.com/'))
    };
    me.constant = {
        CONTAINER_CLASS: 'tang-pass-reg',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        DISABLED_CLASS: 'pass-text-input-disabled',
        VERIFYCODE_URL_PREFIX: me._domain.https + '/cgi-bin/genimage?',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif',
        PROTOCAL_URL: me._domain.http + '/static/passpc-account/html/protocal.html',
        MODIFY_PWD_URL_PREFIX: me._domain.https + '/forcsdnpasschange',
        PERSONAL_PROTOCAL_URL: 'https://www.baidu.com/duty/yinsiquan.html',
        NOCAPTCHA_URL: me._domain.auto + '/static/passpc-base/js/ld.min.js?cdnversion=' + (new Date().getTime()),
        TOUCHAPIMKD_URL: me._domain.wapAuto + '/static/touch/js/api/wrapper_touch.js?cdnversion=' + (new Date().getTime()),
    };
    me.lang = passport.err.getCurrent().labelText.reg;

    // 是否注册覆盖已注册过的邮箱OR手机号状态机
    me.AccountExchangeFlag = 0;

    me.initTime = new Date().getTime();
    /*var countryTpl = ['pp','se','lv','tb','mn'] ;
    if(('|'+countryTpl.join('|')+'|').indexOf('|'+me.config.product+'|') > -1){
        this.foreignMobile = true ;
    }*/
    // 人机
    me.insertNoCaptchaScript();
    // 新人机
    me.initMkd();
    if (me.config.overseas && (+me.config.overseas === 1)) {
        this.foreignMobile = true;
    }
    this.internation = false;
    // 下掉合并用户名注册
    me.config.regMergeUserName = false;
    me.config.userName = 1;
    // init data
    passport.data.setContext(baidu.extend({}, me.config));

    // 是否是嵌入的还是独立的
    this.isBrowser = /passport\.baidu\.com/ig.test(window.location.href);
    /**
     * 发送统计
     * @param {Object} me 执行上下文
     * @param {string} eventType en字段
     * @param {Object} anotherData 需要发送的其他字段
     */
    me.sendLog = function (me, eventType, anotherData) {
        var urlData = {
            // 区分客户端是pc网页还是pc客户端内嵌
            'page': me.isBrowser ? 'pc-browser' : 'pc-inside',
            'tpl': me.config.product || ''
        };
        if (anotherData) {
            for (var x in anotherData) {
                if (anotherData.hasOwnProperty(x)) {
                    urlData[x] = anotherData[x];
                }
            }
        }
        var autoStatisticObj = {
            'eventType': eventType
        };
        me._logPass(urlData, autoStatisticObj);
    };

    // 发送注册页面展现量
    me.sendLog(me, 'pc-register-show', {});

}, {
    type: 'http://passport.baidu.com/passApi/js/magic.passport.reg',
    superClass: magic.passport
}).extend({
    /* eslint-disable fecs-camelcase */
    _getIrregularField: function (field) {
        var me = this;
        var template = {
            verifyCode: '<p id="' + me.$getId('verifyCodeImgWrapper')
            + '" class="pass-form-item pass-form-item-verifyCode" style="display:none">'
            + '<label for="' + me.$getId('verifyCode')
            + '" id="' + me.$getId('verifyCodeLabel')
            + '" class="pass-label pass-label-verifyCode">'
            + me.lang.captcha + '</label>'
            + '<input id="' + me.$getId('verifyCode')
            + '" type="text" name="verifyCode" class="pass-text-input pass-text-input-verifyCode" '
            + 'autocomplete="off" maxlength="6"/>'
            + '<span><img id="' + me.$getId('verifyCodeImg') + '" title="'
            + me.lang.captchaAlt + '" alt="' + me.lang.captchaAlt
            + '" class="pass-verifyCode" src="' + me.constant.BLANK_IMG_URL + '" /></span>'
            + '<a id="' + me.$getId('verifyCodeChange')
            + '" href="#" class="pass-change-verifyCode">' + me.lang.captchaChange + '</a>'
            + (me.config.regMerge
                ? '<input id="' + me.$getId('verifyCodeSend') + '" type="button" value="'
                + me.lang.getSMSKey
                + '" class="pass-button pass-button-verifyCodeSend" autocomplete="off" style="display:none"/>'
                : '') + (me.config.regMerge
                ? '<span id="' + me.$getId('verifyCodeSendTip')
                + '" class="pass-item-tip pass-item-tip-verifyCodeSend" style="display:none;"></span>' : '')
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCode"></span>'
            + '<span id="' + me.$getId('verifyCodeTip')
            + '" class="pass-item-tip pass-item-tip-verifyCode" style="display:none;"><span id="'
            + me.$getId('verifyCodeTipText') + '" class="pass-item-tiptext pass-item-tiptext-verifycode">'
            + me.lang.captchaTip + '</span></span>'
            + '</p>',
            generalError: '<p id="' + me.$getId('errorWrapper')
            + '" class="pass-generalErrorWrapper">'
            + '<span id="' + me.$getId('error') + '" class="pass-generalError"></span>'
            + '</p>',
            suggestName: '<div id="' + me.$getId('suggestNameWrapper') + '" class="pass-suggest-name"></div>',
            isAgree: '<p id="' + me.$getId('isAgreeWrapper') + '" class="pass-form-item pass-form-item-isAgree">'
            + '<input name="isAgree" id="' + me.$getId('isAgree')
            + '" type="checkbox" class="pass-checkbox-input pass-checkbox-isAgree" autocomplete="off" />'
            + '<label for="' + me.$getId('isAgree') + '">' + me.lang.agree + '</label>'
            + '<a target="_blank" href="' + me.constant.PROTOCAL_URL + '">'
            + me.lang.baiduUserProtocal + '</a></span>'
            + '及<a target="_blank" href="' + me.constant.PERSONAL_PROTOCAL_URL + '">'
            + me.lang.baiduPersonalProtocal
            + '<a></span>'
            + '<span id="' + me.$getId('isAgreeError') + '" class="pass-item-error pass-item-error-isAgree"></span>'
            + '</p>',
            submit: '<p id="' + me.$getId('submitWrapper') + '" class="pass-form-item pass-form-item-submit">'
            + '<input id="' + me.$getId('submit') + '" type="submit" value="'
            + me.lang.register + '" class="pass-button pass-button-submit" />'
            + '</p>',
            tip: '<div id="' + me.$getId('tip')
            + '" class="pass-pop-tip" style="display:none"><div class="pass-pop-tip-header">'
            + '</div><div class="pass-pop-tip-container"><div class="pass-pop-tip-body">'
            + '<div class="pass-pop-tip-content" id="'
            + me.$getId('tipContainer')
            + '"></div></div></div></div>',
            verifyCodeSend: '<p id="' + me.$getId('verifyCodeSendWrapper')
            + '" class="pass-form-item pass-form-item-verifyCodeSend">'
            + (!me.config.regMerge && me.config.isPhone
                ? '<label for="' + me.$getId('verifyCode') + '" id="'
                + me.$getId('verifyCodeLabel') + '" class="pass-label pass-label-verifyCode">'
                + me.lang.captcha + '</label>'
                : '')
            + (!me.config.regMerge && me.config.isPhone
                ? '<input id="' + me.$getId('verifyCode') + '" type="text"'
                + 'name="verifyCode" class="pass-text-input pass-text-input-verifyCode" '
                + 'autocomplete="off" maxlength="6"/>'
                : '')
            + '<input id="' + me.$getId('verifyCodeSend') + '" type="button" value="' + me.lang.getSMSKey
            + '" class="pass-button pass-button-verifyCodeSend" autocomplete="off"/>'
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCodeSend">'
            + '</span>'
            + '<span id="' + me.$getId('verifyCodeSendTip')
            + '" class="pass-item-tip pass-item-tip-verifyCodeSend">'
            + '</span>'
            + '</p>',
            nocaptchaContainer: '<div id="' + me.$getId('nocaptchaWrapper')
            + '" class="pass-nocaptcha"></div>',
            nocaptchaVCode: '<p id="' + me.$getId('verifyCodeSendWrapper')
            + '" class="pass-form-item pass-form-item-verifyCodeSend pass-captcha-resend-hide">'
            + '<label for="' + me.$getId('verifyCode') + '" id="'
            + me.$getId('verifyCodeLabel') + '" class="pass-label pass-label-verifyCode">'
            + me.lang.captcha + '</label>'
            + '<input id="' + me.$getId('verifyCode') + '" type="text" '
            + 'name="verifyCode" class="pass-text-input" autocomplete="off" maxlength="6"/>'
            + '<input type="text" style="visibility:hidden;height:0px;border:none;float:left;"/>'
            + '<span id="' + me.$getId('verifyCodeResend') + '" class="pass-captcha-resend"></span>'
            + '<span id="' + me.$getId('verifyCodeError')
            + '" class="pass-item-error pass-item-error-verifyCodeSend">'
            + '</span>'
            + '<span id="' + me.$getId('verifyCodeSendTip')
            + '" class="pass-item-tip pass-item-tip-verifyCodeSend">'
            + '</span>'
            + '</p>',
            nocaptchaMargin: '<div style="height:40px"></div>',
            strengthTip: '<span id="' + me.$getId('strengthTip') + '"><span class="pwd-strength clearfix">'
            + '<span class="strength-title">' + me.lang.strength + '</span>'
            + '<span id="' + me.$getId('strengthTipText')
            + '" class="strength-value pass-item-tiptext pass-item-tiptext-strength"></span>'
            + '<span class="strength-bg"><span class="strength-inner" id="'
            + me.$getId('strengthTipPic') + '"></span>'
            + '</span></span><span class="strength-explain">' + me.lang.strengthTip
            + '</span></span>',
            passwordCheck: '<div  id="' + me.$getId('passwordCheck')
            + ' class="pass-pop-tip pass-pop-tip-passwordCheck">'
            + '<ul id="' + me.$getId('passwordCheckList') + ' class="pass-pop-tip-passwordCheck-list"></ul>'
            + '<span class="pass-pop-tip-passwordCheck-arrow"></span>'
            + '</div>',
            pwdChecklist: '<div class="pwd-checklist-wrapper">'
            + '<span class="pwd-checklist-arrow"><em class="arrowa">◆</em><em class="arrowb">◆</em></span>'
            + '<ul id="' + me.$getId('pwdChecklist') + '" class="pwd-checklist">'
            + '<li id="' + me.$getId('pwd_checklist_len')
            + '" data-rule="len" class="pwd-checklist-item">' + me.lang.pwdChecklist_len + '</li>'
            + '<li id="' + me.$getId('pwd_checklist_cha') + '" data-rule="cha" class="pwd-checklist-item">'
            + me.lang.pwdChecklist_cha + '</li>'
            + '<li id="' + me.$getId('pwd_checklist_spa') + '" data-rule="spa" class="pwd-checklist-item">'
            + me.lang.pwdChecklist_spa + '</li>'
            + '</ul>' + '</div>',
            foreignMobileWrapper: '<div class="pass-form-item '
            + 'pass-form-item-phone pass-form-item-PhoneCountry" id="'
            + me.$getId('foreignMobileWrapper') + '">' + '<label for="'
            + me.$getId('phone') + '" id="' + me.$getId('phoneLabel') + '" class="pass-label pass-label-phone">'
            + me.lang.phoneNum + '</label>' + '<span id="' + me.$getId('foreignMobileLabel')
            + '" class="pass-foreign-label" data-countryCode="">+86</span>'
            + '<input id="' + me.$getId('phone')
            + '" type="text" name="phone" maxlength="11" '
            + 'autocomplete="off" class="pass-text-input pass-foreign-input"/>'
            + '<span id="' + me.$getId('phoneError')
            + '" class="pass-item-error pass-item-error-phone"></span>'
            + '<span id="' + me.$getId('phoneSucc')
            + '" class="pass-item-succ pass-item-succ-phone" style="display:none;"></span>'
            + '<span id="' + me.$getId('phoneTip')
            + '" class="pass-item-tip pass-item-tip-phone" style="display:none;">'
            + '<span id="' + me.$getId('phoneTipText') + '" class="pass-item-tiptext pass-item-tiptext-phone">'
            + me.lang.phoneNumTip + '</span>' + '</span>'
            + '<ul id="' + me.$getId('foreignCountryList') + '" class="pass-country-list"></ul>' + '</div>',
            multiTip: '<div class="pass-multiTip" id="' + me.$getId('multiTip')
            + '" style="position:absolute;top:0px;left:0px;background:#ffffda;'
            + 'border:1px solid #d1b07c;border-radius:3px;z-index:5000;margin:0px;">'
            + '<span class="pass-multiTip-text" style="display:block;padding:5px 10px;font-size:12px;color:#907448;">'
            + me.lang.multiTip + '</span>'
            + '<span class="pass-multiTup-arrow" style="position:absolute;'
            + 'bottom:6px;left:10px;"><em style="position:absolute;top:0px;'
            + 'left:0px;color:#d1b07c;font-style:normal;font-size:12px;line-height:14px;">◆</em>'
            + '<em style="position:absolute;top:-1px;left:0px;color:#ffffda;font-style:normal;'
            + 'font-size:12px;line-height:14px;">◆</em></span>'
            + '</div>',
            dvInput: '<input type="hidden" node-type="_username" id="_username" name="_username" value="">'
            + '<input type="hidden" node-type="_regpass" id="_regpass" name="_regpass" value="">'
            + '<input type="hidden" node-type="_rsakey" id="_rsakey" name="_rsakey" value="">'
            + '<input type="hidden" node-type="_regfrom" id="_regfrom" name="_regfrom" value="reg">'
        };
        return template[field];
    },
    /* eslint-disable fecs-camelcase */
    _getTemplate: function (containerId) {
        var me = this;
        var templateStr = '<form autocomplete="off" id="' + me.$getId('form') + '" method="POST">';
        var hiddenFields = {
            // registerType: me.config.userName ? true : false,
            retu: me.config.retu,
            u: me.config.u,
            // 如果是的仅仅用户名注册，则为1
            quick_user: (!me.config.isPhone && (!!me.config.email === false)) ? 1 : 0,
            regMerge: me.config.regMerge ? true : false,
            suggestIndex: '',
            suggestType: '',
            codeString: '',
            vcodesign: '',
            vcodestr: '',
            gid: me.guideRandom || '',
            app: (me.config.app ? me.config.app : ''),
            staticPage: me.config.staticPage,
            selectedSuggestName: '',
            isLowpwdCheck: me.config.isLowpwdCheck,
            // 用以zmon监控统计,
            logRegType: (me.config.diaPassreg ? 'pc_regDialog' : 'pc_regBasic'),
            isexchangeable: me.config.isexchangeable,
            exchange: me.AccountExchangeFlag,
            subpro: me.config.subpro
        };
        var regRegularField = [];

        if (me.config.userName) {
            regRegularField.push({
                field: 'userName',
                label: me.lang.userName,
                tip: me.lang.userNameTip,
                hasSucc: true
            });
        }
        if (me.config.regMerge) {
            regRegularField.push({
                field: 'account',
                label: me.config.regMergeUserName ? me.lang.account_username : me.lang.account,
                tip: me.config.regMergeUserName ? me.lang.accountTip_username : me.lang.accountTip,
                hasSucc: true
            });
        } else if (me.config.isPhone) {
            if (!me.foreignMobile) {
                regRegularField.push({
                    field: 'phone',
                    label: me.lang.phoneNum,
                    tip: me.lang.phoneNumTip,
                    maxLength: 11,
                    hasSucc: true
                });
            }
            // add this condition by Alien at：2013.05.30
        } else if (!!me.config.email !== false) {
            regRegularField.push({
                field: 'email',
                label: me.lang.email,
                tip: me.lang.emailTip,
                hasSucc: true
            });
        }

        if (me.config.nocaptcha) {
            regRegularField.push({
                field: 'nocaptchaVCode'
            });
        }

        regRegularField.push({
            field: 'password',
            pwd: true,
            label: me.lang.password,
            hasSucc: true
        });

        if (me.config.passwordConfirm) {
            regRegularField.push({
                field: 'verifyPass',
                pwd: true,
                label: me.lang.confirmPassword,
                hasSucc: true
            });
        }
        templateStr += me._getIrregularField('generalError');
        templateStr += me._getHiddenField(hiddenFields);
        templateStr += me._getIrregularField('dvInput');
        if (!me.config.regMerge && me.config.isPhone && me.foreignMobile) {
            templateStr += me._getIrregularField('foreignMobileWrapper');
        }
        for (var i = 0; i < regRegularField.length; i++) {
            if (regRegularField[i].field + '' === 'nocaptchaVCode') {
                templateStr += me._getIrregularField('nocaptchaContainer');
                templateStr += me._getIrregularField(regRegularField[i].field);
                continue;
            }
            if (regRegularField[i].field === 'password') {
                templateStr += '<input type="password" name="password" style="display:none"/>';
            }
            templateStr += me._getRegularField(regRegularField[i], 'reg');
            /*if(regRegularField[i].field == 'phone'){
                 templateStr += me._getIrregularField('verifyCodeSend');
            }*/
        }
        if (!me.config.regMerge && me.config.isPhone && !me.config.nocaptcha) {
            templateStr += me._getIrregularField('verifyCodeSend');
        }

        if (me.config.verifyCode !== false) {
            if (!me.config.isPhone) {
                templateStr += me._getIrregularField('verifyCode');
            }
        }

        templateStr += me._getIrregularField('isAgree');
        templateStr += me._getIrregularField('submit');
        templateStr += me._getIrregularField('tip');

        if (me.config.nocaptcha) {
            templateStr += me._getIrregularField('nocaptchaMargin');
        }
        templateStr += '</form>';

        return templateStr;
    },
    initMkd: function () {
        // 新人机
        var me = this;
        me.insertScriptW(me.constant.TOUCHAPIMKD_URL, function () {
            window.passportTouch.use('mkd', {
                defaultCss: true
            }, function () {
                if (window.Pass && window.Pass.mkd && !me.regPassMkd) {
                    var PassMkd = window.Pass.mkd;
                    me.regPassMkd = new PassMkd({
                        maskModule: true,
                        // 产品线接入ak
                        ak: '1e3f2dd1c81f2075171a547893391274',
                        // 验证结果的回调函数
                        verifySuccessFn: function (data) {
                            // me.mkdData = data;
                            me._sendSMSVcode(null, null, {
                                success: function () {
                                    me.disableSmsButton();
                                }
                            }, null, data);
                            me.regPassMkd.removeMask();
                            // 可以拿到ds 和 tk 去问反作弊是否是人机。
                        }
                    });
                }
            });
        });
    },
    insertNoCaptchaScript: function () {
        // 人机
        var me = this;
        me.insertScriptW(me.constant.NOCAPTCHA_URL, function () {
        });
    },
    insertScriptW: function (u, cb) {
        window._loadedFilesW = window._loadedFilesW || {};
        if (!window._loadedFilesW[u]) {
            window._loadedFilesW[u] = true;
            var d = document, s = d.createElement('SCRIPT');
            s.type = 'text/javascript';
            s.charset = 'UTF-8';
            // IE
            if (s.readyState) {
                s.onreadystatechange = function () {
                    if (s.readyState === 'loaded' || s.readyState === 'complete') {
                        s.onreadystatechange = null;
                        cb && cb();
                    }
                };
            } else {
                s.onload = function () {
                    cb && cb();
                };
            }
            s.src = u;
            d.getElementsByTagName('head')[0].appendChild(s);
        }
    },

    /**
     * 获取验证码 magic.passport.reg#getVerifyCode
     * @param {string} codeString 验证码字符串
     */
    getVerifyCode: function (codeString) {
        var me = this;
        if (me.config.verifyCode === false) {
            return;
        }
        me.getElement('verifyCodeImg').src = '';
        if (codeString && codeString.length) {
            me.getElement('verifyCodeImgWrapper').style.display = 'block';
            me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + codeString;
            me.getElement('codeString').value = codeString;
        } else {
            passport.data.getVerifyCodeStr({
                app: me.config.app ? me.config.app : ''
            })
            .success(function (rsp) {
                if (+rsp.errInfo.no === 0) {
                    me.getElement('verifyCodeImgWrapper').style.display = 'block';
                    me.getElement('verifyCodeImg').src = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.verifyStr;
                    me.getElement('codeString').value = rsp.data.verifyStr;
                }
            });
        }
        if (me.getElement('verifyCode')) {
            me.getElement('verifyCode').value = '';
        }
        if (me.getElement('verifyCode_clearbtn')) {
            me.getElement('verifyCode_clearbtn').style.display = 'none';
        }
    },
    /* eslint-disable fecs-camelcase */
    _loadWCss: function () {
        if (!passport.loadWCss) {
            passport.loadWCss = true;
            var css = '.pass-item-placeholder{color: #ABABAB;cursor:'
                + ' text;display: block;font-size: 12px;height: 20px;left:'
                + ' 163px;line-height: 20px;position: absolute;top: 5px;width: 160px;}'
                + '.pass-item-placeholder-inactive{color:#ccc;}';
            var linkNode = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild(linkNode);
            try {
                linkNode.innerHTML = css;
            } catch (e) {
                try {
                    linkNode.styleSheet.cssText = css;
                } catch (e) {
                }
            }
        }
    },
    /* eslint-disable fecs-camelcase */
    _setPlaceholder: function () {
        var me = this;
        var type;
        var placeholder;
        var item;
        var inputCheckTimer;
        if (!me.config.isPhone && (!!me.config.email === false) && !me.config.regMerge) {
            return;
        }
        me._loadWCss();
        if (me.config.regMerge) {
            type = 'account';
        } else if (me.config.isPhone) {
            type = 'phone';
        } else if (!!me.config.email !== false) {
            type = 'email';
        }

        if (type) {
            placeholder = baidu('<span class="pass-item-placeholder" id="'
                + me.$getId('Placeholder') + '">'
                + (me.config.regMerge
                    ? (me.config.regMergeUserName
                        ? me.lang.regMergePlaceholder_username
                        : me.lang.regMergePlaceholder)
                    : me.lang.placeholder) + '</span>');
            item = baidu(me.getElement(type + 'Wrapper'));
            item.append(placeholder);

            function h() {
                me.getElement(type).focus();
            }

            placeholder.on('click', h);
            baidu(me.getElement(type)).on('focus', function (e) {
                placeholder.addClass('pass-item-placeholder-inactive');
                inputCheckTimer = setInterval(inputValueCheck, 1);

            });
            baidu(me.getElement(type)).on('blur', function (e) {
                placeholder.removeClass('pass-item-placeholder-inactive');
                clearInterval(inputCheckTimer);
                if (!me.getElement(type).value) {
                    placeholder.show();
                }
            });

            function inputValueCheck() {
                if (me.getElement(type).value.length) {
                    placeholder.hide();
                    clearInterval(inputCheckTimer);
                }
            }

            inputValueCheck();
        }
    },

    /**
     * render 渲染组件到页面 magic.passport.reg#render(id)
     * @param {string} id 渲染到的容器的 id
     */
    render: function (id) {
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }

        var target = baidu(me.getElement()),//baidu('#'+id),
            template = me._getTemplate();

        target.addClass(me.constant.CONTAINER_CLASS);
        target.append(baidu(template));
        /**
         * @description render 渲染组件到页面
         * @event
         * @grammar magic.passport.reg#render()
         * @name magic.passport.reg#render
         */
        var returnValue = me.fireEvent('render');
        if (!returnValue) {
            return;
        }

        me._initApi();
        me._setValidator();
        me._setEvent();
        me._initNocaptcha();
        if (me.foreignMobile) {
            me._getCountryCode();
            me._setForeignMobileEvent();
        }
        // me.getVerifyCode();
        if (me.config.displayMail) {
            me._setSuggestion();
        }
        me.suggestion && me.suggestion.hide();
        me._setPwdStrengthTip();
        me._setPlaceholder();
        me._accountFocus();
    },
    /* eslint-disable fecs-camelcase */
    _accountFocus: function () {
        var me = this;
        if (me.config.userName) {
            me.getElement('userName').focus();
        } else if (me.config.regMerge) {
            me.getElement('account').focus();
        } else if (me.config.isPhone) {
            me.getElement('phone').focus();
        }
    },
    /* eslint-disable fecs-camelcase */
    _bindShowPwdEvent: function () {
        var me = this;
        var ele = me.getElement('showpwdbtn_password');
        if (ele) {
            var showpwdEle = me.getElement('showpwd_password');
            baidu(ele).on('click', function () {
                if (showpwdEle.style.display !== 'none') {
                    showpwdEle.style.display = 'none';
                } else {
                    showpwdEle.style.display = 'block';
                }
            });
        }
    },
    /* eslint-disable fecs-camelcase */
    _showPasswordTip: function () {
        var me = this;
        var tpl = '<span class="pass-showpwd pass-showpwd-password" id="'
            + me.$getId('showpwd_password') + '" style="display:none">'
            + '<span class="pass-showpwd-arrow"><em class="arrowa">◆</em><em class="arrowb">◆</em></span>'
            + '<span class="pass-showpwd-content" id="'
            + me.$getId('showpwd_password_content') + '">' + me.getElement('password').value
            + '</span>' + '</span>';
        var tplBtn = '<span class="pass-showpwdbtn pass-showpwdbtn-password" id="'
            + me.$getId('showpwdbtn_password') + '"></span>';
        baidu(me.getElement('passwordWrapper')).append(tpl).append(tplBtn);
        me._bindShowPwdEvent();
    },

    // 行为验证码部分 ************************
    /* eslint-disable fecs-camelcase */
    _initNocaptcha: function () {
        var me = this;
        if (!me.config.nocaptcha || !window.NoCaptcha) {
            return;
        }
        var time = 60, timer = null;
        var countdown = function () {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            if (time <= 0) {
                baidu('#' + me.$getId('verifyCodeResend')).removeClass('pass-captcha-resend-disabled').text('重新获取验证码');
                var phoneEle = me.getElement(me.config.regMerge ? 'account' : 'phone');
                baidu('#' + me.$getId('phoneWrapper')).removeClass('pass-captcha-disabled');
                phoneEle.readOnly = false;
            } else {
                baidu('#' + me.$getId('verifyCodeResend')).text(time + 's 后重新发送');
                time--;
                timer = setTimeout(function () {
                    countdown();
                }, 1000);
            }
        };
        baidu('#' + me.$getId('verifyCodeResend')).on('click', function () {
            if (this.className.indexOf('pass-captcha-resend-disabled') === -1) {
                me._sendSMSVcode(null, null, {
                    success: function () {
                        me.nocaptcha.sendSMS();
                    }
                });
            }
        });
        me.nocaptcha = NoCaptcha.create({
            'dom': baidu('#' + me.$getId('nocaptchaWrapper')),
            'hideDisplay': true,
            'lang': {
                'SLIDE_TIP': '拖动右侧图片完成拼图以获取验证码'
            },
            'success': function (e, validateData) {
                e.cancelTip = true;
                me._sendSMSVcode(null, null, {
                    success: function () {
                        me.nocaptcha.tip('验证码已发送到你的手机', true);
                        setTimeout(function () {
                            me.nocaptcha.hide();
                        }, 2000);
                        me.nocaptcha.sendSMS();
                    },
                    error: function (msg) {
                        var regExp = /<a.*>(.*)<\/a>/ig;
                        var arr = msg.match(regExp);
                        var newMsg = msg.replace(arr, '');
                        me.nocaptcha.tip(newMsg, false);
                        setTimeout(function () {
                            me.nocaptcha.hide();
                            me.nocaptcha.refresh();
                        }, 2000);
                    },
                    validate: function () {
                        me.nocaptcha.hide();
                        me.nocaptcha.refresh();
                    }
                }, validateData);
            }
        });
        me.nocaptcha.sendSMS = function () {
            var phoneEle = me.getElement(me.config.regMerge ? 'account' : 'phone');
            me.nocaptcha.phone = phoneEle.value;
            var resendBtn = baidu('#' + me.$getId('verifyCodeResend'));
            resendBtn.addClass('pass-captcha-resend-disabled').text('');
            baidu('#' + me.$getId('verifyCodeSendWrapper')).removeClass('pass-captcha-resend-hide');
            time = 60;
            countdown();
            baidu('#' + me.$getId('phoneWrapper')).addClass('pass-captcha-disabled');
            phoneEle.readOnly = true;
        };
    },
    /* eslint-disable fecs-camelcase */
    _showNocaptcha: function (show, ele) {
        var me = this;
        if (me.config.nocaptcha && me.nocaptcha) {
            if (show) {
                if (me.nocaptcha.phone) {
                    if (me.nocaptcha.phone !== ele.value) {
                        me.nocaptcha.refresh();
                        me.nocaptcha.show();
                        baidu('#' + me.$getId('verifyCodeSendWrapper')).addClass('pass-captcha-resend-hide');
                    }
                } else {
                    me.nocaptcha.init ? me.nocaptcha.show() : me.nocaptcha.sendSMS();
                }
            } else {
                me.nocaptcha.hide();
            }
        }
    },
    /* eslint-disable fecs-camelcase */
    _initApi: function (callbacks) {
        var me = this;
        me.initTime = new Date().getTime();
        me.unbindRegConfirm = null;
        me.changeRegConfirm = null;
        me.confirmRegVerifyWidget = null;
        passport.data.getApiInfo({
            apiType: me.config.isPhone ? 'regPhone' : 'reg',
            gid: me.guideRandom || '',
            app: me.config.app ? me.config.app : ''
        })
        .success(function (rsp) {
            /**
             * @description 获取api初始化信息
             * @name magic.passport#getApiInfo
             * @event
             * @grammar magic.passport.reg#getApiInfo(e)
             * @param {Object} e 事件参数
             * @param {Object} e.rsp 服务器返回信息
             */
            var returnValue = me.fireEvent('getApiInfo', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }

            if (+rsp.data.disable === 1) {
                me.setGeneralError(me.lang.sysUpdate);
            }

            if (+rsp.errInfo.no === 0) {
                var token = rsp.data.token;
                var codeString = rsp.data.codeString;

                // data: setContext
                passport.data.setContext({
                    token: token
                });

                // set captcha
                if (codeString && codeString.length) {
                    me.getVerifyCode(codeString);
                }

                // clearbtn
                if (me.config.regMerge) {
                    me.config.hasPlaceholder && me._getPlaceholder([{
                        label: 'account',
                        placeholder: (me.config.regMergeUserName
                            ? 'regMergePlaceholder_username'
                            : 'regMergePlaceholder')
                    }, {
                        label: 'password',
                        placeholder: 'passwordPlaceholder'
                    }, {
                        label: 'verifyCode',
                        placeholder: 'verifyCodePlaceholder'
                    }, {
                        label: 'userName',
                        placeholder: 'userNamePlaceholder'
                    }]);

                    baidu(me.getElement('password_clearbtn')).on('mousedown', function () {
                        baidu(me.getElement('pwd_checklist_len'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');

                        baidu(me.getElement('pwd_checklist_cha'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');

                        baidu(me.getElement('pwd_checklist_spa'))
                        .removeClass('pwd-checklist-item-success')
                        .removeClass('pwd-checklist-item-error');
                    });
                } else if (me.config.isPhone) {
                    me.config.hasPlaceholder && me._getPlaceholder([{
                        label: 'phone',
                        placeholder: 'placeholder'
                    }, {
                        label: 'password',
                        placeholder: 'passwordPlaceholder'
                    }, {
                        label: 'verifyCode',
                        placeholder: 'verifyCodePlaceholder'
                    }, {
                        label: 'userName',
                        placeholder: 'userNamePlaceholder'
                    }]);

                    baidu(me.getElement('password_clearbtn')).on('mousedown', function () {
                        var baiduLen = baidu(me.getElement('pwd_checklist_len'));
                        baiduLen.removeClass('pwd-checklist-item-success');
                        baiduLen.removeClass('pwd-checklist-item-error');
                        var baiduCha = baidu(me.getElement('pwd_checklist_cha'));
                        baiduCha.removeClass('pwd-checklist-item-success');
                        baiduCha.removeClass('pwd-checklist-item-error');
                        var baiduSpa = baidu(me.getElement('pwd_checklist_spa'));
                        baiduSpa.removeClass('pwd-checklist-item-success');
                        baiduSpa.removeClass('pwd-checklist-item-error');
                    });
                }
                callbacks && callbacks.success(rsp);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _setSuggestion: function () {
        var me = this;
        /* eslint-disable */
        if (!me.getElement(me.config.regMerge ? 'account' : 'email') || !magic.setup.suggestion) {
            return;
        }
        var options = {
            getData: function (key) {
                var list = [];
                var buildIn = me.mainEmailSP;
                var name = (name === key.match(/(.*)@/)) ? name[1] : key;
                var sp = (sp === key.match(/\@(.*)$/)) ? sp[1] : false;
                baidu.each(buildIn, function (index, value) {
                    if (sp && ~value.indexOf(sp)) {
                        // service provider typed and it's in the build-in list
                        list.push(name + '@' + value);
                    } else if (!sp) {
                        // service provider not typed
                        list.push(name + '@' + value);
                    }
                    // else: service provider typed but it's not in the build-in list
                });
                this.receiveData(key, list);
            }
        };
        /* eslint-disable */
        me.suggestion = magic.setup.suggestion(me.$getId(me.config.regMerge ? 'account' : 'email'), options);

        if (me.config.regMerge) {
            me.suggestion.on('beforeshow', function (evt) {
                if (me.getElement('account') && me.getElement('account').value.indexOf('@') === -1) {
                    evt.returnValue = false;
                }
            });
        }

        me.suggestion.on('confirm', function () {
            if (me.getElement('password')) {
                me.getElement('password').focus();
            }
            if (me.config.regMerge) {
                return;
            }
            me.validate('email');

        });
        me.suggestion.on('highlight', function () {
            me.suggestionHighlight = true;
        });
        me.suggestion.on('clearhighlight', function () {
            me.suggestionHighlight = false;
        });
    },
    /* eslint-disable fecs-camelcase */
    _setValidator: function () {
        // 生成正则，自定义校验规则
        // 主流邮箱
        var me = this;
        var mainEmailSP = me.mainEmailSP = [
            'http://passport.baidu.com/passApi/js/qq.com',
            'http://passport.baidu.com/passApi/js/163.com',
            'http://passport.baidu.com/passApi/js/126.com',
            'http://passport.baidu.com/passApi/js/sohu.com',
            'http://passport.baidu.com/passApi/js/sina.com',
            'http://passport.baidu.com/passApi/js/21cn.com',
            'http://passport.baidu.com/passApi/js/vip.qq.com',
            'http://passport.baidu.com/passApi/js/yeah.net']
        ;
        var mainEmailSPRegStr = mainEmailSP.join(')|(\\@').replace(/\./g, '\\.');
        mainEmailSPRegStr = '((\\@' + mainEmailSPRegStr + '))$';
        mainEmailSPRegStr = '^([a-zA-Z0-9_\\.\\-\\+])+' + mainEmailSPRegStr;
        // 邮箱长度
        me._validator.addRule('mailLength', function (ele) {
            return String(ele.value).length <= 60;
        });
        me._validator.addMsg('mailLength', me.lang.mailLengthError);
        // me._validator.addRule('mainEmail', mainEmailSPRegStr);
        // me._validator.addMsg('mainEmail', me.lang.mainEmailError);

        // 密码匹配
        me._validator.addRule('matchedPwd', function (ele) {
            return ele.value === this.getElement('password').value;
        });
        me._validator.addMsg('matchedPwd', me.lang.matchPwdError);

        /*检测gmail邮箱
		me._validator.addRule('gmailEmail',function(ele){
			if(/^([^.]*\.){2}.*@gmail\.com$/.test(ele.value)){
				return false
			}
			return true;
		});
		me._validator.addMsg('gmailEmail', me.lang.matchGmailError);*/

        // 限制gmail、hotmail、baidu邮箱
        me._validator.addRule('emailLimit', function (ele) {
            if (/([a-zA-Z0-9_\.\-\+])+\@(baidu|gmail|hotmail)\.com$/.test(ele.value)) {
                return false;
            }
            return true;
        });
        me._validator.addMsg('emailLimit', me.lang.emailLimitError);

        // 密码字符
        me._validator.addRule('pwdChar', function (ele) {
            return /^([0-9a-zA-Z\_`!~@#$%^*+=,.?;'":)(}{/\\\|<>&\[\-]|\])+$/.test(ele.value);
        });
        me._validator.addMsg('pwdChar', me.lang.pwdCharError);

        // 密码长度
        me._validator.addRule('pwdLength', function (ele) {
            var len = ele.value.length;
            return (len <= 14 && len >= 8);
        });
        me._validator.addMsg('pwdLength', me.lang.pwdLengthError);

        me._validator.addRule('passwordStrength', function (ele) {
            var len = ele.value.length;
            return len > 0;
        });
        me._validator.addMsg('passwordStrength', me.setPwdCheckStren(3));

        // 协议是否选中
        me._validator.addRule('checkedLicense', function (ele) {
            return ele.checked;
        });
        me._validator.addMsg('checkedLicense', me.lang.checkLicenseError);

        // 用户名
        me._validator.addRule('userNameLength', function (ele) {
            // ByteLength<14 && 不全是数字
            var len = baidu.string.getByteLength(ele.value);
            return len <= 14;
        });
        me._validator.addMsg('userNameLength', me.lang.userNameRulesError);

        me._validator.addRule('userNameNumber', function (ele) {
            // ByteLength<14 && 不全是数字
            var len = baidu.string.getByteLength(ele.value);
            return !/^\d+$/.test(ele.value);
        });
        me._validator.addMsg('userNameNumber', me.lang.userNameNumberError);

        // 手机/邮箱
        me._validator.addRule('accountMerge', function (ele) {
            var value = ele.value;
            if (/^(([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)|(1[3456789]\d{9})$/.test(value)) {
                return true;
            }
            return false;
        });
        me._validator.addMsg('accountMerge', me.lang.accountMergeError);

        me.validateRules = {
            'account': {
                rules: ['required'],
                desc: me.lang.account
            },
            'email': {
                rules: ['required', 'mailLength', 'email', 'emailLimit'],
                asyncRule: me._asyncValidate.checkEmail,
                desc: me.lang.email
            },
            'phone': {
                rules: ['required', 'phone'],
                asyncRule: me._asyncValidate.phoneCheck,
                desc: me.lang.phoneNum
            },
            'userName': {
                rules: ['required', 'userNameLength', 'userNameNumber'],
                asyncRule: me._asyncValidate.checkUserName,
                desc: me.lang.userName
            },
            'password': {
                rules: !me.config.hasPasswordcheck
                    ? (me.config.isLowpwdCheck ? ['required'] : ['required', 'pwdLength', 'pwdChar'])
                    : ['passwordStrength'],
                asyncRule: me.config.isLowpwdCheck ? null : me._asyncValidate.checkPassword,
                desc: me.lang.password
            },
            'verifyPass': {
                rules: ['required', 'matchedPwd'],
                desc: me.lang.confirmPassword
            },
            'verifyCode': {
                rules: ['required'],
                desc: me.lang.captcha
            },
            'smsCode': {
                rules: ['required'],
                desc: me.lang.SMSKey
            },
            'isAgree': {
                rules: ['checkedLicense']
            }
        };
        me._validator.init(me, me.validateRules);
        if (me.config.regMerge) {
            me._validator.builtInMsg['email'] = me.lang.emailEmptyError;
            me._validator.builtInMsg['phone'] = me.lang.phoneEmptyError;

        }
    },
    /* eslint-disable fecs-camelcase */
    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        ele.addClass(me.constant.ERROR_CLASS);
        baidu(me.getElement(info.field + 'Succ')).hide();
        baidu(me.getElement(info.field + 'Error')).show().get(0).innerHTML = info.msg;
        if (me.config.regMerge && info.field === 'verifyCode') {
            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
        }
        // hide tip on error , except password!
        if (info.field !== 'password' && !me.config.hasPasswordcheck) {
            me._hideTip(info.field);
        } else if (!me.config.hasPasswordcheck && !me.config.isLowpwdCheck) {
            me.setPwdStrength(-1);
        }
        opt && opt.callback && opt.callback();
    },
    /* eslint-disable fecs-camelcase */
    _validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        if (!(me.config.regMerge && info.field === 'password')) {
            baidu(me.getElement(info.field + 'Error')).hide();
            baidu(me.getElement(info.field + 'Succ')).show();
            ele.removeClass(me.constant.ERROR_CLASS);
        }
        opt && opt.callback && opt.callback();
    },
    setPwdCheckStren: function (level, rsp, callbacks) {
        var me = this;
        var ele = baidu(me.getElement('password'));
        var errEle = baidu(me.getElement('passwordError'));
        var levelMap = {
            '3': {
                text: me.lang.nopwd,
                msg: me.lang.nopwdMsg,
                className: 'nopwd'
            },
            '2': {
                text: me.lang.weak,
                msg: me.lang.weakMsg,
                className: 'weak'
            },
            '1': {
                text: me.lang.middle,
                msg: me.lang.middleMsg,
                className: 'middle'
            },
            '0': {
                text: me.lang.strong,
                msg: me.lang.strongMsg,
                className: 'strong'
            },
            '-1': {
                text: me.lang.weak,
                msg: me.lang.weakMsg,
                className: 'weak'
            },
            '5': {
                text: me.lang.notsafe,
                msg: me.lang.notsafeMsg,
                className: 'notsafe'
            }
        };
        var tpl = '<span class="pwd-strength ' + levelMap[level].className + '">'
            + '<span class="pwd-strength-sum">'
            + '<em class="pwd-strength-bg">&nbsp;</em>'
            + '<em class="pwd-strength-sco">&nbsp;</em>'
            + '<span class="pwd-strength-title">' + levelMap[level].text + '</span>'
            + '</span>' + '<span class="pwd-strength-detail">' + levelMap[level].msg + '</span>'
            + '</span>';

        errEle.show().get(0).innerHTML = tpl;
        if (+level === 3) {
            errEle.hide();
        }
        if (+level === 2 || +level === 5) {
            ele.addClass(me.constant.ERROR_CLASS);
            me.getElement('passwordSucc').style.display = 'none';
        } else {
            callbacks && callbacks.success(rsp);
        }
        return tpl;
    },
    passwordCheckList: function (field) {
        var me = this;
        var $ele = baidu(me.getElement(field));
        var $passwordTip = baidu(me.getElement('passwordTip'));
        var tipText = baidu(me.getElement(field + 'tipText'));
        var lenEle = baidu(me.getElement('pwd_checklist_len'));
        var chaEle = baidu(me.getElement('pwd_checklist_cha'));
        var spaEle = baidu(me.getElement('pwd_checklist_spa'));
        $passwordTip.show();
        me.password = {};
        me.password.err = 0;
        if (!$ele.val().length) {
            lenEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            chaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            spaEle.removeClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
            return;
        }

        if ($ele.val().length > 14 || $ele.val().length < 8) {
            me.password.err++;
            lenEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        } else {
            lenEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        }

        if ($ele.val().indexOf(' ') !== -1) {
            me.password.err++;
            spaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        } else {
            spaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        }

        if ($ele.val().length) {
            chaEle.addClass('pwd-checklist-item-success').removeClass('pwd-checklist-item-error');
        } else {
            me.password.err++;
            chaEle.removeClass('pwd-checklist-item-success').addClass('pwd-checklist-item-error');
        }
    },
    /* eslint-disable fecs-camelcase */
    _getRSA: function (callback) {
        var me = this;
        passport.data.getRsaKey({
            gid: me.guideRandom || ''
        }).success(function (cert) {
            if (!cert.errInfo.no && +cert.errInfo.no !== 0) {
                cert = cert.data;
            }
            var RSA = new passport.lib.RSA();
            RSA.setKey(cert.pubkey);

            callback && callback({
                RSA: RSA,
                rsakey: cert.key
            });
        });
    },
    /**
     * @description _initCountryCode 初始化国家区域代码已经国家名称
     * @function
     * @name
     * @grammar
     * @param {object} domField 插入海外手机号dom
     */
    /* eslint-disable fecs-camelcase */
    _initCountryCode: function (domField) {
        var me = this;
        var countryTempStr = '<li class="pass-item-country">'
            + '<span class="pass-country-code" data-countryCode="">+86</span>大陆地区</li>';
        var data = me.countryCodeList || {};
        var countryLen = data.length;
        if (countryLen <= 0) {
            return;
        }
        for (var i = 0; i < countryLen; i++) {
            countryTempStr += '<li class="pass-item-country"><span class="pass-country-code" data-countryCode='
                + data[i].code + '>+' + data[i].code.substring(2)
                + '</span>' + data[i].name + '</li>';
        }
        baidu(domField).html(countryTempStr);
    },
    /**
     * @description _getCountryCode 获取国家区域代码已经国家名称
     * @function
     * @name
     * @grammar
     * @param {fn} callback callback函数
     */
    /* eslint-disable fecs-camelcase */
    _getCountryCode: function (callback) {
        var me = this;
        var data = {
            apiver: 'v3',
            subpro: me.config.subpro
        };
        passport.data.jsonp('https://passport.baidu.com/v2/?securitygetcountrycode', data).success(function (rsp) {
            if (rsp.data.country.length > 0) {
                me.countryCodeList = rsp.data.country;
                if (me.getElement('foreignCountryList')) {
                    me._initCountryCode(me.getElement('foreignCountryList'));
                }
                callback && callback();
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _selectCountryList: function () {
        var me = this;
        var countryList = me.getElement('foreignCountryList');
        var labelCode = me.getElement('foreignMobileLabel');
        if (+labelCode.length === 0) {
            return;
        }
        baidu(countryList).on('click', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(labelCode).html(baidu(target).find('span.pass-country-code').eq(0).html());
                var value = baidu(target).find('span.pass-country-code').eq(0).attr('data-countryCode');
                baidu(labelCode).attr('data-countryCode', value);
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(labelCode).html(baidu(target).html());
                baidu(labelCode).attr('data-countryCode', baidu(target).attr('data-countryCode'));
            }
            me.$hide(countryList);
            baidu(labelCode).removeClass('pass-label-code-up');
            if (me.getElement('phone') && me.getElement('phone').value) {
                if (me.getElement('foreignMobileLabel')
                    && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
                    // 海外手机号校验，非空+数字
                    var ele = baidu(me.getElement('phone'))[0];
                    me._validator.addRule('foreignmobile', function (ele) {
                        return /^(\d)*$/.test(ele.value);
                    });
                    me._validator.addMsg('foreignmobile', me.lang.foreignMobileError);
                    me._validator.confStorage[me.$getId()]['phone'] = {
                        rules: ['required', 'foreignmobile'],
                        asyncRule: me._asyncValidate.phoneCheck,
                        desc: me.lang.phoneNum
                    };
                } else {
                    me._validator.confStorage[me.$getId()]['phone'] = {
                        rules: ['required', 'phone'],
                        asyncRule: me._asyncValidate.phoneCheck,
                        desc: me.lang.phoneNum
                    };
                }
                me.validate('phone');
            }
            evt.preventDefault();
        });
        baidu(countryList).on('mouseover', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(countryList).find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).addClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(countryList).find('.pass-item-country-hover').removeClass('pass-item-country-hover');
                baidu(target).parent('li.pass-item-country').addClass('pass-item-country-hover');
            }
        });
        baidu(countryList).on('mouseout', function (evt) {
            var target = evt.target;
            if (target.tagName.toLowerCase() === 'li') {
                baidu(target).removeClass('pass-item-country-hover');
            } else if (target.tagName.toLowerCase() === 'span') {
                baidu(target).parent('li.pass-item-country').removeClass('pass-item-country-hover');
            }
        });
        // 点击其他区域收起国家代码list
        baidu('html').on('click', function (evt) {
            var target = evt.target;
            if (!labelCode) {
                return false;
            }
            // 需要判断多个点击label的id
            if ((baidu(target).attr('id') !== baidu(me.getElement('foreignMobileLabel')).attr('id'))) {
                setTimeout(function () {
                    me.$hide(countryList);
                    baidu(labelCode).removeClass('pass-label-code-up');
                }, 200);
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _setForeignMobileEvent: function () {
        var me = this;
        if (me.getElement('foreignMobileLabel')) {
            baidu(me.getElement('foreignMobileLabel')).on('click', function (evt) {
                var countryList = me.getElement('foreignCountryList');
                if (countryList && countryList.style.display !== 'block') {
                    me.$show(countryList);
                    baidu(me.getElement('foreignMobileLabel')).addClass('pass-label-code-up');
                } else if (countryList) {
                    me.$hide(countryList);
                    baidu(me.getElement('foreignMobileLabel')).removeClass('pass-label-code-up');
                }
                me._selectCountryList();
                evt.preventDefault();
            });
        }
    },

    /**
     * 设置密码强度等级
     * @param {string} level 密码强度等级
     */
    setPwdStrength: function (level) {
        var me = this;
        var levelMap = {
            '2': {
                text: me.lang.weak,
                className: 'weak'
            },
            '1': {
                text: me.lang.middle,
                className: 'middle'
            },
            '0': {
                text: me.lang.strong,
                className: 'strong'
            },
            '-1': {
                text: '',
                className: ''
            }
        };
        me.getElement('strengthTipText').innerHTML = levelMap[level].text;
        baidu(me.getElement('strengthTipPic'))
        .removeClass('weak middle strong')
        .addClass(levelMap[level].className);
    },
    /* eslint-disable fecs-camelcase */
    _setPwdStrengthTip: function () {
        var me = this;
        var strengthTip = me.config.hasPasswordcheck
            ? baidu(me.getElement('pwdChecklist'))
            : baidu(me.getElement('strengthTip'));
        var passwordTip = baidu(me.getElement('passwordTipText'));
        if (me.config.isLowpwdCheck) {
            return;
        }
        if (!strengthTip.length && !me.config.hasPasswordcheck) {
            strengthTip = baidu(me._getIrregularField('strengthTip'));
            passwordTip.append(strengthTip);
        } else {
            strengthTip = baidu(me._getIrregularField('pwdChecklist'));
            passwordTip.append(strengthTip);
        }
    },
    /**
     * @description 重置密码强度等级提示的位置, 主要用于tip位置计算完成后，表单位置发生变化，如：suggName 展现
     * @function
     * @private
     */
    /* eslint-disable fecs-camelcase */
    _resetPwdStrengthTipPos: function () {
        var me = this;
        me._hideTip('password');
        me._showTip('password');
    },
    /* eslint-disable fecs-camelcase */
    _showTip: function (field) {
        var me = this;
        var tipContainer = baidu(me.getElement('tipContainer'));
        var tip = baidu(me.getElement('tip'));
        var ele = baidu(me.getElement(field));
        var tipText = me.getElement(field + 'TipText');
        var succEle = baidu(me.getElement(field + 'Succ'));
        var errEle = baidu(me.getElement(field + 'Error'));
        if (me.config.hasPasswordcheck && field === 'password') {
            me.getElement('passwordTip').style.display = 'block';
            tipContainer.empty();
            me.getElement('passwordError').style.display = 'none';
        } else {
            if (!tipText || !tipText.innerHTML.length) {
                return false;
            }
            tipContainer.empty().append(tipText);

            errEle.hide();
            succEle.hide();
        }

        // 420 = the most with input's (offset().left + outerWidth() + 5)
        tip.css({
            left: 420,
            top: ele.offset().top - baidu(me.getElement()).offset().top
        });
        /**
         * @description 气泡提示显示
         * @name magic.passport.reg#tipShow
         * @event
         * @grammar magic.passport.reg#tipShow(e)
         * @param {Object} e 事件参数
         * @param {TangramDOM} e.tip 气泡提示对象
         * @param {TangramDOM} e.ele 触发气泡提示显示的表单域
         */
        var returnValue = me.fireEvent('tipShow', {
            tip: tip
        });
        if (!returnValue) {
            return;
        }

        tip.show();
    },
    /* eslint-disable fecs-camelcase */
    _hideTip: function (field) {
        var me = this;
        if (me.config.hasPasswordcheck && field === 'password' && me.password && +me.password.err !== 0) {
            return;
        } else if (me.config.hasPasswordcheck && field === 'password') {
            me.getElement('passwordTip').style.display = 'none';
        } else {
            baidu(me.getElement(field + 'Tip')).append(me.getElement(field + 'TipText'));
        }
        /**
         * @description 气泡提示隐藏
         * @name magic.passport.reg#tipHide
         * @grammar magic.passport.reg#tipHide()
         * @event
         */
        var returnValue = me.fireEvent('tipHide');
        if (!returnValue) {
            return;
        }

        baidu(me.getElement('tip')).hide();
    },
    /* eslint-disable fecs-camelcase */
    _showSuggestNames: function (suggestNames, key, userType) {
        var me = this;
        // 防止频繁 blur 使推荐列表被更新
        if (key === me.suggestListKey) {
            return;
        }
        // 生成容器
        if (!baidu(me.getElement('suggestNameWrapper')).length) {
            baidu(me._getIrregularField('suggestName'))
            .insertAfter(me.getElement(me.config.regMergeUserName ? 'accountWrapper' : 'userNameWrapper'));
        }
        me.suggestListKey = key;
        var suggestNameWrapper = baidu(me.getElement('suggestNameWrapper'));
        if (!suggestNames || !suggestNames.length) {
            suggestNameWrapper.empty();
        } else {
            suggestNameWrapper.empty();
            for (var i = 0, j = suggestNames.length; i < j; i++) {
                suggestNameWrapper.append('<p class="pass-suggest-item">'
                    + '<label name="suggestName"><input name="suggestName" id="'
                    + me.$getId('suggestName__' + i) + '" type="radio" class="pass-suggest-item-radio" value="'
                    + suggestNames[i] + '" />' + suggestNames[i]
                    + '</label></p>');
            }

            // set suggestType
            me.getElement('suggestType').value = userType;
        }

        // fix tip's position
        if (me.getElement('tip').style.display === 'block') {
            me._resetPwdStrengthTipPos();
        }
    },
    disableSmsButton: function () {
        var me = this;
        var ele = me.getElement('verifyCodeSend');
        // error = me.getElement(me.config.regMerge ? 'verifyCodeError' : 'verifyCodeSendError'),
        var error = me.getElement('verifyCodeError');
        var tip = me.getElement('verifyCodeSendTip');
        var value = ele.value;
        var timmer;
        var counter = 60;
        baidu(ele).addClass(me.constant.DISABLED_CLASS);
        ele.disabled = true;
        if (me.unbindRegConfirm && me.unbindRegConfirm.getElement('confirm_cancel')) {
            baidu(me.unbindRegConfirm.getElement('confirm_cancel')).addClass('pass-confirm-btn-disabled');
            me.unbindRegConfirm.getElement('confirm_cancel').disabled = true;
        }
        if (error) {
            error.style.display = 'none';
        }
        if (tip) {
            if (me.config.isVoiceSms) {
                tip.innerHTML = me.lang.VoiceKeySendTip;
            } else {
                tip.innerHTML = me.lang.SMSKeySendTip;
            }
            if (me.config.regMerge) {
                baidu(tip).show();
            } else if (me.config.isPhone) {
                baidu(tip).show();
            }
        }

        function countdown() {
            if (--counter === 0) {
                ele.value = value;
                baidu(ele).removeClass(me.constant.DISABLED_CLASS);
                ele.disabled = false;
                if (me.unbindRegConfirm && me.unbindRegConfirm.getElement('confirm_cancel')) {
                    baidu(me.unbindRegConfirm.getElement('confirm_cancel')).removeClass('pass-confirm-btn-disabled');
                    me.unbindRegConfirm.getElement('confirm_cancel').disabled = false;
                }
                if (tip) {
                    tip.innerHTML = '';
                    if (me.config.regMerge) {
                        baidu(tip).hide();
                    } else if (me.config.isPhone) {
                        baidu(tip).hide();
                    }
                }
                return;
            }
            var fn = arguments.callee;
            ele.value = me.config.regMerge
                ? (me.lang.SMSKeyResendTipMerge + '(' + counter + ')')
                : (counter + me.lang.SMSKeyResendTip);
            timmer = setTimeout(function () {
                fn();
            }, 1000);
        }

        countdown();
    },

    /* eslint-disable fecs-camelcase */
    _asyncValidate: {
        // 异步校验，由validator 在同步校验通过后直接调用
        checkEmail: function (callbacks) {
            var me = this;
            var ele = me.getElement(me.config.regMerge ? 'account' : 'email');
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
            /* globals passport */
            passport.data.checkMail({
                email: ele.value,
                moonshad: cryptdata
            })
            .success(function (rsp) {
                /**
                 * @description 邮箱检查
                 * @name magic.passport.reg#emailCheck
                 * @event
                 * @grammar magic.passport.reg#emailCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('emailCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    callbacks && callbacks.success(rsp);
                } else {
                    if (rsp.errInfo.msg.indexOf('#{') > 0) {
                        var account = me.getElement('account')
                            ? me.getElement('account').value
                            : me.getElement('email').value;
                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                            urldata: '&account=' + account + '&tpl='
                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                        });
                    }
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                }
            });
        },
        checkPassword: function (callbacks) {
            var me = this;
            var ele = me.getElement('password');
            var userName = '';
            var mobile = '';

            if (me.config.hasPasswordcheck && me.password && +me.password.err !== 0) {
                return;
            } else if (me.config.hasPasswordcheck) {
                me._hideTip('password');
            }

            if (me.getElement('userName')) {
                userName = me.getElement('userName').value || '';
            }

            if (me.getElement('phone')) {
                mobile = me.getElement('phone').value || '';
            }
            var rsaPwd = ele.value || '';
            if (me.RSA && me.rsakey) {
                var passwordVal = ele.value;
                if (passwordVal.length < 128 && !me.config.safeFlag) {
                    rsaPwd = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
                }
            }

            passport.data.checkPassword({
                password: rsaPwd,
                gid: me.guideRandom || '',
                rsakey: me.rsakey,
                crypttype: 12,
                userName: userName,
                mobile: mobile
            })
            .success(function (rsp) {
                /**
                 * @description 密码强度检查
                 * @name magic.passport.reg#passwordStrengthCheck
                 * @event
                 * @grammar magic.passport.reg#passwordStrengthCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('passwordStrengthCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    var level = rsp.data.pwdWeak;
                    rsp.msg = me.lang.weakPwdError;
                    if (me.config.hasPasswordcheck) {
                        me.setPwdCheckStren(level, rsp, callbacks);
                    } else {
                        me.setPwdStrength(level);
                        if (+level === 2) {
                            // rsp.msg = rsp.errInfo.msg;
                            callbacks && callbacks.error(rsp);
                        } else {
                            // success
                            callbacks && callbacks.success(rsp);
                        }
                    }
                } else if (+rsp.errInfo.no === 4) {
                    var level = rsp.data.pwdWeak;
                    rsp.msg = me.lang.weakPwdError;
                    me.setPwdCheckStren(level, rsp, callbacks);
                }
            });
        },
        checkUserName: function (callbacks) {
            var me = this;
            var ele = me.getElement(me.config.regMergeUserName ? 'account' : 'userName');

            passport.data.checkUserName({
                gid: me.guideRandom || '',
                userName: ele.value
            })
            .success(function (rsp) {
                /**
                 * @description 用户名检查
                 * @name magic.passport.reg#userNameCheck
                 * @event
                 * @grammar magic.passport.reg#userNameCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('userNameCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (+rsp.errInfo.no === 0) {
                    if (+rsp.data.userExsit === 1) {
                        // fail
                        rsp.msg = me.lang.userNameExistsError;
                        callbacks && callbacks.error(rsp);
                        me._showSuggestNames(rsp.data.suggNames, ele.value, rsp.data.userType);
                    } else {
                        me._showSuggestNames([], ele.value, rsp.data.userType);
                        // success
                        callbacks && callbacks.success(rsp);
                    }
                } else {
                    me._showSuggestNames([], ele.value, rsp.data.userType);
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                }
            });
        },
        phoneCheck: function (callbacks) {
            var me = this;
            var ele = this.getElement(me.config.regMerge ? 'account' : 'phone');
            me.AccountExchangeFlag = me.getElement('exchange').value;
            /* globals hex_md5 */
            var cryptdata = hex_md5(ele.value + 'Moonshadow');
            cryptdata = cryptdata.replace(/o/, 'ow').replace(/d/, 'do').replace(/a/, 'ad');
            cryptdata = cryptdata.replace(/h/, 'ha').replace(/s/, 'sh').replace(/n/, 'ns').replace(/m/, 'mo');
            passport.data.checkPhone({
                phone: ele.value,
                moonshad: cryptdata,
                countrycode: me.getElement('foreignMobileLabel') ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '') : '',
                gid: me.guideRandom || '',
                exchange: me.AccountExchangeFlag,
                isexchangeable: me.config.isexchangeable,
                action: 'reg'
            })
            .success(function (rsp) {
                /**
                 * @description 手机号检查
                 * @name magic.passport.reg#phoneCheck
                 * @event
                 * @grammar magic.passport.reg#phoneCheck(e)
                 * @param {Object} e 事件参数
                 * @param {String} e.rsp 服务器返回信息
                 */
                var returnValue = me.fireEvent('phoneCheck', {
                    rsp: rsp
                });
                if (!returnValue) {
                    return;
                }

                if (rsp.data.isCheatUser === '1') {
                    me.config.isVoiceSms = parseInt(rsp.data.isCheatUser, 10) || 0;
                    me.getElement('verifyCodeSend').value = '获取语音验证码';
                } else {
                    me.config.isVoiceSms = 0;
                    me.getElement('verifyCodeSend').value = '获取短信验证码';
                }
                if (+rsp.errInfo.no === 0) {
                    callbacks && callbacks.success(rsp);
                    if (me.$multiTip) {
                        me.$multiTip.hide();
                    }
                } else if (rsp.errInfo.no + '' === '130020') {
                    // TODO 出取消&登录提示  changeRegConfirm作用域问题处理。
                    var newRegAccount = (!me.config.regMerge && me.config.isPhone) ? '手机号' : '手机号或邮箱';
                    var countryCode = '';
                    if (me.getElement('foreignMobileLabel')) {
                        countryCode = baidu(me.getElement('foreignMobileLabel')).html();
                    }
                    if (me.unbindRegConfirm) {
                        me.unbindRegConfirm.hide();
                    }
                    if (me.changeRegConfirm) {
                        baidu(me.getElement('changeRegPhone')).html(countryCode + ele.value);
                        me.changeRegConfirm.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                            me.changeRegConfirm = passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                width: 390,
                                apiOpt: {
                                    Cancel: '取消',
                                    Continue: '登录',
                                    contentHTML: '<div class="pass-confirmContent-wrapper">'
                                    + '<div class="pass-confirmContent-msg">该手机已注册，可以通过密码或短信快捷登录。</div>'
                                    + '</div>'
                                },
                                onConfirmClose: function (evt) {
                                    me.changeRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmCancel: function (evt) {
                                    me.changeRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmContinue: function (evt) {
                                    var account = ele.value;
                                    var url = 'http://passport.baidu.com/v2/?login&account='
                                        + account + '&tpl=' + me.config.product
                                        + '&u=' + (me.config.retu || me.config.u);
                                    me.changeRegConfirm.hide();
                                    if (window.location) {
                                        window.location.href = url;
                                    } else {
                                        document.location.href = url;
                                    }
                                }
                            });
                            me.changeRegConfirm.show();
                        });
                    }
                } else if (rsp.errInfo.no + '' === '400005' || rsp.errInfo.no + '' === '400001' || rsp.errInfo.no + '' === '400003') {
                    // TODO 出解绑&登录提示
                    if (me.changeRegConfirm) {
                        me.changeRegConfirm.hide();
                    }
                    var countryCode = '';
                    if (me.getElement('foreignMobileLabel')) {
                        countryCode = baidu(me.getElement('foreignMobileLabel')).html();
                    }
                    if (me.unbindRegConfirm) {
                        baidu(me.getElement('unbindRegPhone')).html(countryCode + ele.value);
                        me.unbindRegConfirm.show();
                    } else {
                        passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                            me.unbindRegConfirm = passport.pop.init({
                                type: 'confirmWidget',
                                tangram: true,
                                width: 390,
                                apiOpt: {
                                    Cancel: '取消',
                                    Continue: '登录',
                                    contentHTML: '<div class="pass-confirmContent-wrapper">'
                                    + '<div class="pass-confirmContent-msg">该手机已注册，可以通过密码或短信快捷登录。</div>'
                                    + '</div>'
                                },
                                onConfirmClose: function (evt) {
                                    me.unbindRegConfirm.hide();
                                    ele.value = '';
                                    ele.focus();
                                },
                                onConfirmCancel: function (evt) {
                                    me.unbindRegConfirm.hide();
                                    // me.getElement('exchange').value = 1 ;
                                    // me.getElement('password').focus();
                                    // me.getElement('verifyCodeSend').click();
                                    // me._sendSMSVcode(null, null);
                                    me.getElement('phone').value = '';
                                    me.getElement('phone').focus();
                                },
                                onConfirmContinue: function (evt) {
                                    var account = ele.value;
                                    var url = 'http://passport.baidu.com/v2/?login&account='
                                        + account + '&tpl=' + me.config.product
                                        + '&u=' + (me.config.retu || me.config.u);
                                    me.unbindRegConfirm.hide();
                                    if (window.location) {
                                        window.location.href = url;
                                    } else {
                                        document.location.href = url;
                                    }
                                }
                            });
                            me.unbindRegConfirm.show();
                        });
                    }
                } else {
                    if (rsp.errInfo.msg.indexOf('#{') > 0) {
                        var account = me.getElement('account')
                            ? me.getElement('account').value
                            : me.getElement('phone').value;
                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                            urldata: '&account=' + account + '&tpl='
                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                        });
                    }
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                    /*
					if(rsp.errInfo.no == '130020'){
						if(me.$multiTip){
							me.$multiTip.show()
						}else{
							me.$multiTip = baidu(me._getIrregularField('multiTip'));
							var phonePosition = baidu(ele).offset();
							me.$multiTip.css({
								top:phonePosition.top-35+'px',
								left:phonePosition.left+'px'
							})
							baidu(document.body).append(me.$multiTip[0])
						}
					}else{
						if(me.$multiTip){
							mu.$multiTip.hide()
						}
					}*/
                }
            });
        }
    },
    cutVerifyCode: function (type) {
        var me = this;
        var element = me.getElement('verifyCode_placeholder');
        var element1 = me.getElement('verifyCodeTipText');
        if (type === 'phone') {
            baidu(me.getElement('verifyCodeImg')).parent().hide();
            baidu(me.getElement('verifyCodeChange')).hide();
            baidu(me.getElement('verifyCodeSend')).show();
            if (element1) {
                element1.innerHTML = me.lang.SMSKeyTip;
            }
            if (element) {
                element.innerHTML = me.lang.smsVerifyCode;
            }
        } else {
            baidu(me.getElement('verifyCodeImg')).parent().show();
            baidu(me.getElement('verifyCodeChange')).show();
            baidu(me.getElement('verifyCodeSend')).hide();
            if (element1) {
                element1.innerHTML = me.lang.captchaTip;
            }
            if (element) {
                element.innerHTML = me.lang.captcha;
            }
        }
        baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
        me.regMergeType = type;
    },
    _sendSMSVcode: function (field, e, callbacks, validateData, mkdData) {
        var me = this;
        // 发送短信
        var phoneNum = me.getElement(me.config.regMerge ? 'account' : 'phone').value;
        if (me.config.isexchangeable) {
            me.AccountExchangeFlag = 1;
        }
        me.validate(me.config.regMerge ? 'account' : 'phone', {
            success: function () {
                var params = {
                    /* eslint-disable fecs-camelcase */
                    is_voice_sms: me.config.isVoiceSms,
                    /* eslint-enable fecs-camelcase */
                    phone: phoneNum,
                    countrycode: me.getElement('foreignMobileLabel')
                        ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '')
                        : '',
                    gid: me.guideRandom || '',
                    isexchangeable: me.config.isexchangeable,
                    subpro: me.config.subpro,
                    validatedata: validateData,
                    dv: document.getElementById('dv_Input')
                        ? document.getElementById('dv_Input').value
                        : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '')
                };
                if (mkdData && mkdData.ds && mkdData.tk) {
                    params.ds = mkdData.ds;
                    params.tk = mkdData.tk;
                };
                passport.data.sendPhoneCode(params)
                .success(function (rsp) {
                    /**
                     * @description 短信激活码发送
                     * @name magic.passport.reg#smsCodeSend
                     * @event
                     * @grammar magic.passport.reg#smsCodeSend(e)
                     * @param {Object} e 事件参数
                     * @param {Object} e.rsp 服务器返回信息
                     */
                    var returnValue = me.fireEvent('smsCodeSend', {
                        rsp: rsp
                    });
                    if (!returnValue) {
                        return;
                    }

                    if (+rsp.errInfo.no === 0) {
                        callbacks && callbacks.success && callbacks.success();
                    }
                    else if (+rsp.errInfo.no === 50042) {
                        me.regPassMkd.initVcode();
                    }
                    else if (+rsp.errInfo.no === 130040) {
                        callbacks && callbacks.validate && callbacks.validate();

                        var confirmVerifyCodeImgSrc = me.constant.VERIFYCODE_URL_PREFIX + rsp.data.vcodestr;
                        me.getElement('vcodesign').value = rsp.data.vcodesign;
                        me.getElement('vcodestr').value = rsp.data.vcodestr;
                        if (me.confirmRegVerifyWidget) {
                            // TODO 切换验证码图片
                            me.getElement('confirmVerifyCodeImg').src = confirmVerifyCodeImgSrc;
                            baidu(me.getElement('confirmVerifyCode')).val('');
                            me.confirmRegVerifyWidget.show();
                        } else {
                            setTimeout(function () {
                                passport._load(me._domain.auto + '/passApi/js/uni_wrapper.js', true, function () {
                                    me.confirmRegVerifyWidget = passport.pop.init({
                                        type: 'confirmWidget',
                                        tangram: true,
                                        titleText: '安全验证',
                                        width: 490,
                                        apiOpt: {
                                            Continue: '确定',
                                            contentHTML: '<p class="pass-confirmReg-verifyWidget-msg">请填写图中的验证码</p>'
                                            + '<p class="pass-confirmReg-verifyWidget-imgWrapper">'
                                            + '<input type="text"'
                                            + ' class="pass-text-input pass-confirmReg-verifyWidget-verifyCode" id="'
                                            + me.$getId('confirmVerifyCode')
                                            + '" name="confirmVerifyCode" value="" />'
                                            + '<img src="' + confirmVerifyCodeImgSrc
                                            + '" title="" class="pass-confirmReg-verifyWidget-verifyCode-img" id="'
                                            + me.$getId('confirmVerifyCodeImg')
                                            + '" />'
                                            + '<a href="#" class="pass-confirmReg-verifyWidget-imgChange" id="'
                                            + me.$getId('confirmVerifyCodeChange') + '">换一张</a>'
                                            + '<span class="pass-confirmReg-verifyWidget-error" id="'
                                            + me.$getId('confirmVerifyCodeError')
                                            + '"></span>' + '</p>'
                                        },
                                        onRender: function (evt) {
                                            baidu(me.confirmRegVerifyWidget.getElement('confirmWidget_footer'))
                                            .addClass('pass-confirmReg-verifyWidget-bottom');
                                            me.config.hasPlaceholder && me._getPlaceholder([{
                                                label: 'confirmVerifyCode',
                                                placeholder: 'verifyCode'
                                            }]);
                                            baidu(me.getElement('confirmVerifyCodeChange')).on('click', function () {
                                                passport.data.getRegSmsVerifyCodeStr()
                                                .success(function (rsp) {
                                                    if (+rsp.errInfo.no === 0) {
                                                        var element = me.getElement('confirmVerifyCodeImg');
                                                        element.src = me.constant.VERIFYCODE_URL_PREFIX
                                                            + rsp.data.verifyStr;
                                                        me.getElement('vcodesign').value = rsp.data.vcodesign;
                                                        me.getElement('vcodestr').value = rsp.data.vcodestr;
                                                    }
                                                });
                                            });
                                            baidu(me.getElement('confirmVerifyCode')).on('keyup', function () {
                                                baidu(me.getElement('confirmVerifyCode')).removeClass('pass-text-input-error');
                                                var baidu1 = baidu(me.getElement('confirmVerifyCodeError'));
                                                baidu1.hide();
                                                baidu1.get(0).innerHTML = '';
                                            });
                                            baidu(me.getElement('confirmVerifyCode')).on('change', function () {
                                                var element = me.getElement('confirmVerifyCode');
                                                element.value = element.value.replace(/\s/g, '');
                                            });
                                        },
                                        onConfirmCancel: function (evt) {

                                        },
                                        onConfirmContinue: function (evt) {
                                            var baiduVCode = baidu(me.getElement('confirmVerifyCode'));
                                            if (baiduVCode.val() === '') {
                                                baiduVCode.addClass('pass-text-input-error');
                                                var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                                baiduCodeError.show();
                                                baiduCodeError.get(0).innerHTML = me.lang.confirmVerCodeEmpty;
                                                return;
                                            }
                                            var baidu1 = baidu(me.getElement('foreignMobileLabel'));
                                            passport.data.sendPhoneCode({
                                                /* eslint-disable fecs-camelcase */
                                                is_voice_sms: me.config.isVoiceSms,
                                                /* eslint-enable fecs-camelcase */
                                                phone: phoneNum,
                                                countrycode: me.getElement('foreignMobileLabel')
                                                    ? (baidu1.attr('data-countrycode') || '')
                                                    : '',
                                                isexchangeable: me.config.isexchangeable,
                                                subpro: me.config.subpro,
                                                confirmVerifyCode: baiduVCode.val(),
                                                vcodesign: me.getElement('vcodesign').value,
                                                dv: document.getElementById('dv_Input')
                                                    ? document.getElementById('dv_Input').value
                                                    : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || ''),
                                                vcodestr: me.getElement('vcodestr').value
                                            })
                                            .success(function (rsp) {
                                                var baiduCodeError = baidu(me.getElement('confirmVerifyCodeError'));
                                                if (+rsp.errInfo.no === 0) {
                                                    baiduCodeError.hide();
                                                    baidu(me.getElement('verifyCodeError')).hide();
                                                    me.confirmRegVerifyWidget.hide();
                                                    if (me.config.nocaptcha) {
                                                        me.nocaptcha.sendSMS();
                                                    } else {
                                                        me.disableSmsButton();
                                                    }
                                                } else if (+rsp.errInfo.no === 130041 || +rsp.errInfo.no === 130042) {
                                                    baidu(me.getElement('confirmVerifyCode')).addClass('pass-text-input-error');
                                                    baiduCodeError.show();
                                                    baiduCodeError.get(0).innerHTML = rsp.errInfo.msg;
                                                } else {
                                                    baiduCodeError.hide();
                                                    me.confirmRegVerifyWidget.hide();
                                                    baidu(me.getElement('verifyCodeError')).show().get(0).innerHTML = rsp.errInfo.msg;
                                                    baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                                                }
                                            });
                                        }
                                    });
                                    me.confirmRegVerifyWidget.show();
                                });
                            }, 80);

                        }
                    } else {
                        /*if(me.config.regMerge){
                            baidu(me.getElement('verifyCodeError')).show().get(0).innerHTML = rsp.errInfo.msg;
                            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                        }else{
                            me.getElement('verifyCodeSendError').show().get(0).innerHTML = rsp.errInfo.msg;
                            baidu(me.getElement('verifyCodeSendTip')).hide().get(0).innerHTML = '';
                        }*/
                        if (me.getElement('verifyCodeError')) {
                            baidu(me.getElement('verifyCodeError')).show();
                            baidu(me.getElement('verifyCodeError')).get(0).innerHTML = rsp.errInfo.msg;
                        }
                        if (me.getElement('verifyCodeSendTip')) {
                            baidu(me.getElement('verifyCodeSendTip')).hide();
                            baidu(me.getElement('verifyCodeSendTip')).get(0).innerHTML = '';
                        }
                        callbacks && callbacks.error && callbacks.error(rsp.errInfo.msg);
                    }
                });
                // me.getElement('exchange').value = 0;
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _format: function (source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments, 1);
        var toString = Object.prototype.toString;
        if (data.length) {
            data = data.length === 1
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
                ? (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key) {
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if ('[object Function]' === toString.call(replacer)) {
                    replacer = replacer(key);
                }
                return ('undefined' === typeof replacer ? '' : replacer);
            });
        }
        return source;
    },
    /* eslint-disable fecs-camelcase */
    _eventHandler: (function () {
        var me;
        var style = {
            focus: function (field, e) {
                /**
                 * @description 表单域获得焦点
                 * @name magic.passport.reg#fieldFocus
                 * @event
                 * @grammar magic.passport.reg#fieldFocus(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 focus 事件的表单域
                 */
                var returnValue = me.fireEvent('fieldFocus', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }

                this.addClass(me.constant.FOCUS_CLASS);
                this.removeClass(me.constant.ERROR_CLASS);
            },
            blur: function (field, e) {
                /**
                 * @description 表单域失去焦点
                 * @name magic.passport.reg#fieldBlur
                 * @event
                 * @grammar magic.passport.reg#fieldBlur(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 blur 事件的表单域
                 */
                me.getElement(field).value = me.getElement(field).value.replace(/\s/g, '');
                var returnValue = me.fireEvent('fieldBlur', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }

                this.removeClass(me.constant.FOCUS_CLASS);
            },
            mouseover: function (field, e) {
                /**
                 * @description 鼠标移入表单域
                 * @name magic.passport.reg#fieldMouseover
                 * @event
                 * @grammar magic.passport.reg#fieldMouseover(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 mouseover 事件的表单域
                 */
                var returnValue = me.fireEvent('fieldMouseover', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }

                this.addClass(me.constant.HOVER_CLASS);
            },
            mouseout: function (field, e) {
                /**
                 * @description 鼠标移出表单域
                 * @name magic.passport.reg#fieldMouseout
                 * @event
                 * @grammar magic.passport.reg#fieldMouseout(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 fieldMouseout 事件的表单域
                 */
                var returnValue = me.fireEvent('fieldMouseout', {
                    ele: this
                });
                if (!returnValue) {
                    return;
                }

                this.removeClass(me.constant.HOVER_CLASS);
            },
            keyup: function (field, e) {
                /**
                 * @description 表单域keyup事件
                 * @name magic.passport.reg#fieldMouseout
                 * @event
                 * @grammar magic.passport.reg#fieldMouseout(e)
                 * @param {Object} e 事件参数
                 * @param {TangramDOM} e.ele 触发 fieldMouseout 事件的表单域
                 */
                var returnValue = me.fireEvent('fieldKeyup', {
                    ele: this
                });
            }
        };
        var behaviour = {
            focus: {
                'account': function () {
                    me.getElement('exchange').value = 0;
                    me._showTip('account');
                },
                'email': function () {
                    me._showTip('email');
                },
                'phone': function () {
                    me.getElement('exchange').value = 0;
                    me._showTip('phone');
                    me._showNocaptcha(false);
                },
                'userName': function () {
                    me._showTip('userName');
                },
                'password': function () {
                    me._showTip('password');
                    me._getRSA(function (result) {
                        me.RSA = result.RSA;
                        me.rsakey = result.rsakey;
                    });
                },
                'verifyPass': function () {
                    me._showTip('verifyPass');
                },
                'verifyCode': function () {
                    me._showTip('verifyCode');
                    if (me.getElement('verifyCodeSendTip')) {
                        me.getElement('verifyCodeSendTip').style.display = 'none';
                    }
                    if (me.getElement('verifyCodeError')) {
                        me.getElement('verifyCodeError').style.display = 'none';
                    }
                },
                'smsCode': function () {
                    me._showTip('smsCode');
                }
            },
            blur: {
                'account': function (field, e) {

                    var ele = me.getElement(field);
                    if (!ele.value) {
                        return;
                    }

                    if (me.$multiTip) {
                        me.$multiTip.hide();
                    }

                    if (!/\S+/.test(ele.value)) {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required'],
                            desc: me.config.regMergeUserName ? me.lang.accountEmpty_username : window.accountEmpty
                        };
                        me.validate(field);
                    } else if (/^\d+$/.test(ele.value)) {
                        // 改状态机设置为默认状态
                        me.AccountExchangeFlag = 0;

                        if (me.getElement('suggestNameWrapper')) {
                            baidu(me.getElement('suggestNameWrapper')).empty();
                        }
                        if (me.suggestListKey) {
                            me.suggestListKey = '';
                        }
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'phone'],
                            asyncRule: me._asyncValidate.phoneCheck,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('phone');
                        me.validate(field);
                    } else if (ele.value.indexOf('@') > -1) {
                        if (me.suggestListKey) {
                            me.suggestListKey = '';
                        }
                        if (me.getElement('suggestNameWrapper')) {
                            baidu(me.getElement('suggestNameWrapper')).empty();
                        }

                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'mailLength', 'email', 'emailLimit'],
                            asyncRule: me._asyncValidate.checkEmail,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('email');
                        setTimeout(function () {
                            me.validate(field);
                        }, 200);
                    } else if (me.config.regMergeUserName) {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['required', 'userNameLength', 'userNameNumber'],
                            asyncRule: me._asyncValidate.checkUserName,
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('userName');
                        me.validate(field);
                    } else {
                        me._validator.confStorage[me.$getId()][field] = {
                            rules: ['accountMerge'],
                            desc: me.lang.account
                        };
                        me.cutVerifyCode('email');
                        me.validate(field);
                    }

                },
                'email': function (field, e) {
                    // 如果 suggestion 某项处于高亮状态，则不调用验证，因为 suggestion 中的 onpick 会调用
                    // if(!me.suggestionHighlight){
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                    // }
                },
                'phone': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        if (me.getElement('foreignMobileLabel')
                            && (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') !== '')) {
                            // 海外手机号校验，非空+数字
                            me._validator.addRule('foreignmobile', function (ele) {
                                return /^(\d)*$/.test(ele.value);
                            });
                            me._validator.addMsg('foreignmobile', me.lang.foreignMobileError);
                            me._validator.confStorage[me.$getId()]['phone'] = {
                                rules: ['required', 'foreignmobile'],
                                asyncRule: me._asyncValidate.phoneCheck,
                                desc: me.lang.phoneNum
                            };
                        } else {
                            me._validator.confStorage[me.$getId()]['phone'] = {
                                rules: ['required', 'phone'],
                                asyncRule: me._asyncValidate.phoneCheck,
                                desc: me.lang.phoneNum
                            };
                        }
                        me.validate(field, {
                            success: function (e) {
                                ele.value && me._showNocaptcha(true, ele);
                            }
                        });

                    }
                },
                'userName': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'password': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'verifyPass': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'verifyCode': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                },
                'smsCode': function (field, e) {
                    var ele = me.getElement(field);
                    if (ele.value) {
                        me.validate(field);
                    }
                }
            },
            change: {
                'email': function (field, e) {

                }
            },
            keyup: {
                'account': function (field, e) {
                    var value = me.getElement(field).value;
                    if (me.suggestion && value.indexOf('@') === -1) {
                        me.suggestion.hide();

                    }
                },
                'password': function (field, e) {
                    var ele = me.getElement(field);
                    if (!me.isInputPassword) {
                        me.isInputPassword = true;
                        // 发送输入密码统计
                        me.sendLog(me, 'pc-register-password-input', {});
                    }
                    if (me.config.isLowpwdCheck) {
                        return;
                    }
                    if (ele.value.length < 8 && !me.config.hasPasswordcheck) {
                        me.setPwdStrength(-1);
                    } else if (me.config.hasPasswordcheck) {
                        me.passwordCheckList(field);
                    } else {
                        me.validate(field);
                    }

                    if (me.getElement('showpwd_password_content')) {
                        me.getElement('showpwd_password_content').innerHTML = ele.value;
                    }
                },
                'phone': function (field, e) {
                    var value = me.getElement(field).value;
                    if (!me.isInputPhone) {
                        me.isInputPhone = true;
                        // 发送输入电话号码统计
                        me.sendLog(me, 'pc-register-phone-input', {});
                    }
                },
                'userName': function () {
                    if (!me.isInputUserName) {
                        me.isInputUserName = true;
                        // 发送输入用户名统计
                        me.sendLog(me, 'pc-register-username-input', {});
                    }
                },
                'verifyCode': function () {
                    if (!me.isInputSmsCode) {
                        me.isInputSmsCode = true;
                        // 发送输入验证码统计
                        me.sendLog(me, 'pc-register-sms-input', {});
                    }
                }
            },
            click: {
                'isAgree': function (field, e) {
                    me.validate(field);
                },
                'suggestName': function () {
                    var box = this;
                    var boxDom = box.get(0);
                    if (!boxDom.tagName || (boxDom.tagName !== 'LABEL')) {
                        box = box.parent();
                    }
                    box = box.find('input');
                    var value = box.get(0).value;
                    /**
                     * @description 用户从推荐用户名列表中选择
                     * @name magic.passport.reg#selectSuggestName
                     * @event
                     * @grammar magic.passport.reg#selectSuggestName(e)
                     * @param {Object} e 事件参数
                     * @param {String} e.suggestName 被选中的用户名
                     */
                    var returnValue = me.fireEvent('selectSuggestName', {
                        suggestName: value
                    });
                    if (!returnValue) {
                        return;
                    }

                    baidu(me.getElement('suggestNameWrapper')).empty();
                    me.getElement(me.config.regMergeUserName ? 'account' : 'userName').value = value;
                    me.getElement(me.config.regMergeUserName ? 'account' : 'userName').focus();
                    me._hideTip(me.config.regMergeUserName ? 'account' : 'userName');
                    if (me.config.regMerge) {
                        baidu(me.getElement('Placeholder')).hide();
                    }

                    // TODO: 考虑选中推荐用户名后，不通过调用验证消除错误提示
                    // me.validate('userName');
                    me.setValidateSuccess(me.config.regMergeUserName ? 'account' : 'userName');
                    me.suggestListKey = value;

                    // set index
                    var index = box.attr('id').match(/(\d+)$/)[1];
                    me.getElement('selectedSuggestName').value = value;
                    me.getElement('suggestIndex').value = index;

                },
                'verifyCodeChange': function (field, e) {
                    // 更换验证码
                    me.getVerifyCode();
                    me.getElement('verifyCode').focus();
                    e.preventDefault();
                    // 点击更换验证码统计
                    me.sendLog(me, 'pc-register-sms-again-click', {});
                },
                'verifyCodeSend': function (field, e) {
                    if (me.regPassMkd && me.regPassMkd.getDataAsync) {
                        var mkdData = {};
                        me.regPassMkd.getDataAsync(function (rsp) {
                            mkdData.ds = rsp.ds || 'xxx';
                            mkdData.tk = rsp.tk || 'xxx';
                            me._sendSMSVcode(field, e, {
                                success: function () {
                                    me.disableSmsButton();
                                }
                            }, null, mkdData);
                        });
                    } else {
                        me._sendSMSVcode(field, e, {
                            success: function () {
                                me.disableSmsButton();
                            }
                        });
                    }
                    // 点击发送验证码统计
                    me.sendLog(me, 'pc-register-sms-click', {});
                }
            },
            submit: function (e) {
                if (me.config.isexchangeable) {
                    me.AccountExchangeFlag = 1;
                }
                // 点击注册统计
                me.sendLog(me, 'pc-register-submit-click', {});
                me.validateAll({
                    success: function () {
                        me.getElement('submit').focus();
                        /**
                         * @description 表单提交前
                         * @name magic.passport.reg#beforeSubmit
                         * @event
                         * @grammar magic.passport.reg#beforeSubmit()
                         */
                        var returnValue = me.fireEvent('beforeSubmit');
                        if (!returnValue) {
                            return;
                        }

                        var data = baidu.form.json(me.getElement('form'));

                        if (!me.config.regMerge && me.config.isPhone) {
                            data.smscode = data.verifyCode;
                        }

                        // 用户名推荐
                        if (me.regMergeType === 'userName' || me.config.userName) {
                            if (data.userName !== data.selectedSuggestName) {
                                data.suggestIndex = '';
                                data.suggestType = '';
                            }
                        }
                        me.getElement('submit').style.color = '#9ebef4';
                        data.timeSpan = new Date().getTime() - me.initTime;

                        var submitCallback = function (rsp) {
                            if (+rsp.errInfo.no === 0) {
                                me.getElement('submit').style.color = '#fff';
                                if (rsp.data.needToModifyPassword) {
                                    // 修改密码
                                    window.loaction.href = me.constant.MODIFY_PWD_URL_PREFIX
                                        + '?u=' + window.u || '';
                                } else {
                                    /**
                                     * @description 注册成功
                                     * @name magic.passport.reg#regSuccess
                                     * @event
                                     * @grammar magic.passport.reg#regSuccess(e)
                                     * @param {Object} e 事件参数
                                     * @param {Object} e.rsp 服务器返回信息
                                     * @param {Boolean} evt.returnValue 返回false时，阻止跳转
                                     */
                                    var returnValue = me.fireEvent('regSuccess', {
                                        rsp: rsp
                                    });
                                    if (!returnValue) {
                                        return;
                                    }

                                    window.location.href = rsp.data.u;
                                }
                            } else if (rsp.errInfo.no === '400413' || rsp.errInfo.no === '400414') {
                                // 强制出选择页面
                                var domain = (window.location
                                    ? ((window.location.protocol.toLowerCase() === 'http:')
                                        ? 'http://passport.baidu.com/'
                                        : 'https://passport.baidu.com')
                                    : ((document.location.protocol.toLowerCase() === 'http:')
                                        ? 'http://passport.baidu.com/'
                                        : 'https://passport.baidu.com'));
                                // 业务模块配置
                                var bizMods = {
                                    'uni_armorwidget': 'uni_armorwidget.js'/*tpa=http://passport.baidu.com/passApi/js/uni_armorwidget.js*/,
                                    'uni_forceverify': 'uni_forceverify.js'/*tpa=http://passport.baidu.com/passApi/js/uni_forceverify.js*/,
                                    'uni_accConnect': 'uni_accConnect_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_accConnect_wrapper.js*/,
                                    'uni_wrapper': 'uni_wrapper.js'/*tpa=http://passport.baidu.com/passApi/js/uni_wrapper.js*/
                                };
                                var secondCard;

                                me.config.u = rsp.data.u || me.config.u;

                                // ns.login.secondCardAction()
                                setTimeout(function () {
                                    passport._load(domain + bizMods.uni_wrapper, true, function () {
                                        if (!secondCard) {
                                            secondCard = passport.pop.init({
                                                type: 'secondCardVerify',
                                                tangram: true,
                                                color: me.config.color || 'blue',
                                                apiOpt: {
                                                    u: me.config.u,
                                                    product: me.config.product,
                                                    lstr: rsp.data.lstr || '',
                                                    ltoken: rsp.data.ltoken || '',
                                                    token: rsp.data.authtoken || '',
                                                    staticPage: me.config.staticPage,
                                                    select: rsp.errInfo.no === '400413' ? '1' : '0',
                                                    scscene: rsp.data.scscene || '',
                                                    scnewuser: rsp.data.scnewuser || '',
                                                    // loginType: options.rsp.rsp.loginType,
                                                    loginproxy: rsp.data.loginproxy || ''
                                                },
                                                onloginSuccess: function (data) {
                                                    location.href = data.target.config.u;
                                                },
                                                onSubmitSuccess: function (self, result) {
                                                    if (result.rsp.data.loginproxy) {
                                                        passport.data.jsonp(result.rsp.data.loginproxy)
                                                        .success(function (proxyrsp) {
                                                            if (proxyrsp.errInfo.no === '0') {
                                                                document.location.href = 'https://passport.baidu.com/v3/security/main/secondcardmodifyaccinfo?tpl='
                                                                    + me.config.product + '&bdstoken='
                                                                    + result.rsp.data.bdstoken + '&authsid='
                                                                    + result.rsp.data.mod_authsid
                                                                    + '&u=' + encodeURIComponent(proxyrsp.data.u)
                                                                    + '&loginType=' + result.rsp.data.loginType
                                                                    + '&hasUsername=' + result.rsp.data.hasUsername;
                                                            } else {
                                                                self.target.getElement('secondCardError').innerHTML
                                                                = me.lang.sysError;
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                            secondCard.show();
                                        } else {
                                            if (secondCard.reRender) {
                                                secondCard.reRender({
                                                    lstr: rsp.data.lstr || '',
                                                    ltoken: rsp.data.ltoken || '',
                                                    token: rsp.data.authtoken || '',
                                                    loginproxy: rsp.data.loginproxy || '',
                                                    select: rsp.errInfo.no === '400413' ? '1' : '0'
                                                    // loginType: options.rspData.rsp.loginType
                                                });
                                            }
                                            secondCard.show();
                                        }
                                    });
                                }, 80);

                                return false;
                            } else {
                                /**
                                 * @description 注册失败
                                 * @name magic.passport.reg#regError
                                 * @event
                                 * @grammar magic.passport.reg#regError(e)
                                 * @param {Object} e 事件参数
                                 * @param {Object} e.rsp 服务器返回信息
                                 */
                                me.getElement('submit').style.color = '#fff';
                                var returnValue = me.fireEvent('regError', {
                                    rsp: rsp
                                });
                                if (!returnValue) {
                                    return;
                                }

                                if (rsp.errInfo.msg && (rsp.errInfo.msg.indexOf('#{') >= 0)) {
                                    // 如果需要替换errrsp.errInfo.msg中的字符
                                    if (+rsp.errInfo.no === 110024) {
                                        var linkUrl = me._domain.https + '/v2/?regnotify&action=resend&tpl='
                                            + me.config.product + '&email=' + encodeURIComponent(rsp.data.email)
                                            + '&u=' + encodeURIComponent(rsp.data.u);
                                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {gotourl: linkUrl});
                                    } else {
                                        var account = me.getElement('account').value;
                                        rsp.errInfo.msg = me._format(rsp.errInfo.msg, {
                                            urldata: '&account=' + account + '&tpl='
                                            + me.config.product + '&u=' + (me.config.retu || me.config.u)
                                        });
                                    }
                                }

                                if (rsp.errInfo['field']) {
                                    if (me.config.regMerge) {
                                        if ((/^(phone|email|userName)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'account';
                                        } else if ((/^(smsCode)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'verifyCode';
                                        }
                                    } else if (me.config.isPhone) {
                                        if ((/^(phone)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'phone';
                                        } else if ((/^(smsCode)$/g).test(rsp.errInfo['field'])) {
                                            rsp.errInfo['field'] = 'verifyCode';
                                        }
                                    }
                                    me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
                                } else {
                                    me.setGeneralError(rsp.errInfo['msg']);
                                }

                                var isConfirmReg = parseInt(rsp.errInfo.no, 10) === 71000;

                                if (!me.config.isPhone && !isConfirmReg) {
                                    // 错误后刷新验证码
                                    me.getVerifyCode();
                                }

                                if (isConfirmReg) {
                                    var jsUrl = me._domain.auto + '/passApi/js/uni_wrapper.js';
                                    passport._load(jsUrl, true, function () {
                                        var confirmWidget = passport.pop.init({
                                            type: 'confirmWidget',
                                            tangram: true,
                                            apiOpt: {
                                                Cancel: '取消',
                                                Continue: '登录',
                                                contentHTML: '<div class="pass-reg-confirm-dia">'
                                                + '<span class="pass-reg-confirm-diamsg">'
                                                + '该手机已注册，可以通过密码或短信快捷登录。'
                                                + '</span>'
                                                + '</div>'
                                            },
                                            onRender: function (evt) {

                                            },
                                            onConfirmClose: function (evt) {
                                                confirmWidget.hide();
                                                me.getElement('phone').value = '';
                                                me.getElement('phone').focus();
                                            },
                                            onConfirmCancel: function (evt) {
                                                // me.getElement('exchange').value = 0;
                                                confirmWidget.hide();
                                                me.getElement('phone').val('');
                                                me.getElement('phone').focus();
                                            },
                                            onConfirmContinue: function (evt) {
                                                // me.getElement('exchange').value = 1;
                                                // me.getElement('submit').click();
                                                var account = me.getElement('phone').value;
                                                var url = 'http://passport.baidu.com/v2/?login&account='
                                                    + account + '&tpl=' + me.config.product
                                                    + '&u=' + (me.config.retu || me.config.u);
                                                confirmWidget.hide();
                                                if (window.location) {
                                                    window.location.href = url;
                                                } else {
                                                    document.location.href = url;
                                                }
                                            }
                                        });
                                        confirmWidget.show();
                                    });
                                }
                            }
                        };

                        // 马甲号注册后端打点区分
                        if (me.config.isVoiceSms) {
                            data.isVoiceSmsReg = 1;
                        } else {
                            data.isVoiceSmsReg = 0;
                        }
                        if (me.regMergeType === 'phone') {
                            data.phone = data.account;
                            data.smscode = data.verifyCode;
                            data.registerType = 0;
                        } else if (me.regMergeType === 'email') {
                            data.email = data.account;
                        } else if (me.regMergeType === 'userName') {
                            data.username = data.account;
                            /* eslint-disable fecs-camelcase */
                            data.quick_user = me.config.regMergeUserName;
                        }
                        if (me.RSA && me.rsakey) {
                            var passwordVal = me.getElement('password').value;
                            if (passwordVal.length < 128 && !me.config.safeFlag) {
                                data.loginpass = baidu.url.escapeSymbol(me.RSA.encrypt(passwordVal));
                                data.rsakey = me.rsakey;
                                data.crypttype = 12;

                                // 缓存rsakey loginpass 供二次卡使用

                                document.getElementById('_rsakey').value = data.rsakey;
                                document.getElementById('_regpass').value = data.loginpass;
                                document.getElementById('_username').value = data.userName;
                            }
                        }
                        var dvValue = document.getElementById('dv_Input');
                        data.dv = dvValue
                            ? dvValue.value
                            : ((window.LG_DV_ARG && window.LG_DV_ARG.dvjsInput) || '');
                        // 增加是否为独立页的参数，用户判断注册成功是否为独立页还是内嵌页
                        if (!me.isBrowser) {
                            data.isInside = 1;
                        }
                        // submit
                        if (me.regMergeType === 'phone' || me.config.isPhone) {
                            data.countrycode = (me.getElement('foreignMobileLabel')
                                ? (baidu(me.getElement('foreignMobileLabel')).attr('data-countrycode') || '') : '');
                            passport.data.regPhone(data)
                            .success(submitCallback);
                        } else {
                            data.verifypass = data.loginpass || '';
                            passport.data.reg(data)
                            .success(submitCallback);
                        }
                    },
                    error: function () {
                        baidu(me.getElement('tipContainer')).hide();
                    }
                });
                e.preventDefault();
            }
        };

        return {
            entrance: function (e) {
                me = this;
                var target = baidu(e.target);
                var field = e.target.name;
                if (!field && e.target.id) {
                    var matches = e.target.id.match(/\d+__(.*)$/);
                    if (matches) {
                        field = matches[1];
                    }
                }
                if (!field) {
                    return;
                }
                if (style.hasOwnProperty(e.type)) {
                    style[e.type].apply(baidu(e.target), [field, e]);
                }

                if (behaviour.hasOwnProperty(e.type)) {
                    if (typeof behaviour[e.type] === 'function') {
                        // for submit
                        behaviour[e.type].apply(baidu(e.target), [e]);
                    }
                    if (behaviour[e.type].hasOwnProperty(field)) {
                        behaviour[e.type][field].apply(baidu(e.target), [field, e]);
                    }
                }

                if (e.type === 'blur') {
                    me._hideTip(field);
                }
            }
        };
    })(),
    /**
     * @description 显示该模块
     * @name magic.passport.reg#show
     * @grammar magic.passport.reg#show
     * @function
     */
    /**
     * @description 隐藏该模块
     * @name magic.passport.reg#hide
     * @grammar magic.passport.reg#hide
     * @function
     */
    /**
     * @description 校验单个表单域
     * @name magic.passport.reg#validate
     * @function
     * @grammar magic.passport.reg#validate(field, callbacks)
     * @param {String} field 要校验的表单域
     * @param {String} callbacks 校验完成回调，可选
     * @param {String} callbacks.succcess 校验通过回调，可选
     * @param {String} callbacks.error 校验未通过回调，可选
     */
    /**
     * @description 开始校验单个表单域前
     * @name magic.passport.reg#beforeValidate
     * @event
     * @grammar magic.passport.reg#beforeValidate(e)
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验信息
     * @param {String} e.validate.field 参与校验的表单项名
     * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
     */
    /**
     * @description 单项表单域校验通过
     * @name magic.passport.reg#validateSuccess
     * @grammar magic.passport.reg#validateSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     */
    /**
     * @description 单项表单域校验未通过
     * @name magic.passport.reg#validateError
     * @grammar magic.passport.reg#validateError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
     */
    /**
     * @description 校验整个表单
     * @name magic.passport.reg#validateAll
     * @grammar magic.passport.reg#validateAll(callbacks, breakOnError)
     * @function
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {Boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    /**
     * @description 开始校验整个表单前
     * @name magic.passport.reg#beforeValidateAll
     * @grammar magic.passport.reg#beforeValidateAll
     * @event
     */
    /**
     * @description 全表单校验通过
     * @name magic.passport.reg#validateAllSuccess
     * @grammar magic.passport.reg#validateAllSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 全表单校验未通过
     * @name magic.passport.reg#validateAllError
     * @grammar magic.passport.reg#validateAllError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 析构
     * @name magic.passport.reg#$dispose
     * @function
     * @grammar magic.passport.reg#$dispose()
     */
    $dispose: function () {
        var me = this;
        if (me.disposed) {
            return;
        }
        baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
        baidu.dom(me.getElement('form')).remove();
        /* eslint-disable */
        magic.Base.prototype.$dispose.call(me);
    }
});
;
    return magic;
});

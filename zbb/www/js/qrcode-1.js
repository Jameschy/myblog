/**
 * @description passport 二维码模块
 * @class
 * @name passport.pop.Qrcode
 * @param {Object} config 配置项
 * @param {Boolean} config.charset 页面编码
 * @param {String} config.product 产品线标识
 * @param {String} config.staticPage 本域下部署的jump地址
 */
magic.passport = baidu.lang.createClass(function(){   
    this._validateInfo = {
        /** field: true|false **/   // 一个表单项是否处于验证失败的状态
    }   
},{
    type: "magic.passport",
    superClass: magic.Base
}).extend({})

var passport = passport || window.passport || {};
passport.qrcode = passport.qrcode || {};
passport.qrcode.data = passport.qrcode.data || {};
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
            Base.array.contains = function(source, obj) {
                return (baidu.array.indexOf(source, obj) >= 0);
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
            Base.format = function (source, opts) {
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
            };
            Base.on=function(ele,type,func){
                if(ele.addEventListener){
                    ele.addEventListener(type,func,false);
                }else if(ele.attachEvent){
                    ele.attachEvent("on" + type,func);
                }else{
                    ele['on'+type] = func
                }
            };
            Base.off=function(ele,type,callback){
                if(ele.removeEventListener){
                    ele.removeEventListener(type,func,false);
                }else if(ele.detachEvent){
                    ele.detachEvent("on" + type,func);
                }else{
                    ele['on'+type] = null;
                }
            };
            Base.addClass=function(ele,className){
                element = ns.base.g(ele);
                var classArray = className.split(/\s+/),
                    result = element.className,
                    classMatch = " " + result + " ",
                    i = 0,
                    l = classArray.length;

                for (; i < l; i++){
                     if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
                         result += (result ? ' ' : '') + classArray[i];
                     }
                }

                element.className = result;
                return element;
            };
            Base.removeClass=function(ele,className){
                element = ns.base.g(ele);
                var oldClasses = element.className.split(/\s+/),
                    newClasses = className.split(/\s+/),
                    lenOld,
                    lenDel = newClasses.length,
                    j,
                    i = 0;
                //考虑到同时删除多个className的应用场景概率较低,故放弃进一步性能优化 
                // by rocy @1.3.4
                for (; i < lenDel; ++i){
                    for(j = 0, lenOld = oldClasses.length; j < lenOld; ++j){
                        if(oldClasses[j] == newClasses[i]){
                            oldClasses.splice(j, 1);
                            break;
                        }
                    }
                }
                element.className = oldClasses.join(' ');
                return element;            
            }

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
                    htmlBuilder.push("<iframe name='", _postTarget, "' src='" + (window.location.protocol.toLowerCase() == "https:" ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank") + "' style='display:none;'></iframe>");
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

        ns.setContext = function(ctxInfo) {
            _ctx.product = ctxInfo.product || _ctx.product;
            _ctx.charset = ctxInfo.charset || _ctx.charset;
            _ctx.staticPage = ctxInfo.staticPage || _ctx.staticPage;
            _ctx.token = ctxInfo.token || _ctx.token;
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
            retParam.tpl = _ctx.product;
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
            var config = _errMsg[_errInfoFieldMapping[interfaceName] || interfaceName];
            if(config && errInfo && (errInfo.no != 0)) {
                var msgDefine = config[errInfo.no] || config["-1"];
                if(msgDefine) {
                    var msg = msgDefine.msg;                
                    if(msg && (msg.indexOf("#{") >= 0)) {
                        if(interfaceName == "login" && (errInfo.no == 110024)) {
                            var linkUrl = _domain + "/v2/?regnotify&needresend=true&tpl=" + encodeURIComponent(_ctx.product) + "&user=" + encodeURIComponent(data.mail) + "&u=" + encodeURIComponent(data.u);
                            msg = Base.format(msg, {gotourl : linkUrl});
                        } else {
                            msg = Base.format(msg, data || {});
                        }
                    }
                    errInfo.msg = msg;
                    errInfo.field = msgDefine.field;
                }
            }
            return errInfo;
        }
        var _getInterfaces = {},
            _postInterfaces = {},
            _ctx = {},
            _domain = "https://passport.baidu.com";

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
            params.apiver = "v3"; //remark:标识新版api调用
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
            data.staticpage = data.staticpage || _ctx.staticPage;
            data.charset = data.charset || _ctx.charset || document.characterSet || document.charset || "";
            data.token = data.token || _ctx.token;
            data.tpl = data.tpl || _ctx.product;
            return Request.submit(
                        _domain + url,
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
})(passport.qrcode.data)


magic.passport.Qrcode = baidu.lang.createClass(function(options){
    var me = this;
    function guid(){
        if(baidu && baidu.guid){

        }else if(baidu){
            baidu.guid = "$BAIDU$";
        }else{
            var baidu = {};
            baidu.guid = "$BAIDU$"
        }
        window[baidu.guid] = window[baidu.guid] || {};
        window[baidu.guid]._counter = window[baidu.guid]._counter || '1';
        return 'TANGRAM__' + window[baidu.guid]._counter++
    };
    me.config = {
        product: '',
        charset: '',
        staticPage: '',
        u: '',
        lang: 'zh-CN'
    };
    baidu.extend(me.config, options);
    this.module = 'qrcoe';
    me.constant = {
            CONTAINER_CLASS: 'tang-pass-qrcode',
            FOCUS_CLASS: 'pass-input-focus',
            HOVER_CLASS: 'pass-input-hover',
            ERROR_CLASS: 'pass-input-error',
            HOVER_CLASS_SUBMIT: 'pass-button-submit-hover',
            PRESS_CLASS_SUBMIT: 'pass-button-submit-press'
    };
    
    me.lang = {
        'zh-CN': {
                "nextStep" : "\u4E0B\u4E00\u6B65",
                "firstStepText" : options.firstStepText || "\u4E00\u626B\u5373\u4E0A\uFF0C\u83B7\u53D6\u4E8C\u7EF4\u7801\u626B\u63CF\u767B\u5F55\uFF0C\u4E3A\u786E\u4FDD\u662F\u60A8\u672C\u4EBA\u64CD\u4F5C\uFF0C\u8BF7\u8F93\u5165\u5BC6\u7801：",
                "secondStepText" : options.secondStepText || "\u4E00\u626B\u5373\u4E0A\uFF0C\u626B\u63CF\u4E8C\u7EF4\u7801\u626B\u63CF\u5373\u53EF\u767B\u5F55"
        }
    }[me.config.lang];
    me._ids = guid();
    me._initApi();
},{
    type: "qrcode",
    superClass: magic.passport
}).extend({
    _getTemplate:function(field){
        var me = this,
        template = {
            firstStep: '<div class="tang-pass-qrcode-step1" id="'+me.$getId('qrcodeStep1')+'"><form method="post" id="'+me.$getId('qrcodeform')+'">' +
                            '<p class="pass-qrcode-step1-title">'+me.lang.firstStepText+'</p>'+
                            '<div class="pass-qrcode-step1-wrapper">'+
                                '<input id="'+me.$getId('qrcodePassword')+'" type="password" class="pass-input" name="password" value=""/>'+
                                '<span id="'+me.$getId('qrcodeError')+'" class="pass-generalError"></span>'+
                            '</div>'+
                            '<p class="pass-qrcode-step1-submit"><input id="'+me.$getId('qrcodeSubmit')+'" type="submit" value="'+me.lang.nextStep+'" class="pass-button pass-button-submit"></p>'+
                        '</form></div>',
            secondStep:'<div id="'+me.$getId('qrcodeStep2')+'" class="tang-pass-qrcode-step2" >' +
                            '<p class="pass-qrcode-step2-title">'+me.lang.secondStepText+'</p>'+
                            '<div class="pass-qrcode-step2-wrapper"><img id="'+me.$getId('qrcodeImg')+'"/></div>'+
                            '<div class="pass-qrcode-step2-resend"><a href="###" id="'+me.$getId('qrcodelink')+'">\u91CD\u65B0\u83B7\u53D6\u4E8C\u7EF4\u7801</a></div>'+
                        '</div>'
        }
        return template[field];
    },
    _initApi:function(){
        var me = this,
            network = passport.qrcode.data;
        network.base.g(me.config.id).appendChild(baidu(me._getTemplate('firstStep')).get(0));
        if(me.config.onRender){me.config.onRender(me._ids)}
        me.addEvent()
    },
    addEvent:function(){
        var me = this,
            network = passport.qrcode.data,
            input = network.base.g(me._ids+'__qrcodePassword'),
            submit = network.base.g(me._ids+'__qrcodeSubmit'),
            span = network.base.g(me._ids+'__qrcodeError'),
            step1Dom = network.base.g(me._ids+'__qrcodeStep1'),

            getEvent = function(evt){
                var evt = window.event ? window.event : evt;
                return evt;
            },
            blurFn = function(){
                if(input.className.indexOf(me.constant.FOCUS_CLASS) >= 0){
                    network.base.removeClass(input,me.constant.FOCUS_CLASS)
                }
                if(input.value !== ''){
                    input.errNo = 0;
                    network.base.removeClass(input,me.constant.ERROR_CLASS);
                    if(me.config.onValidateSuccess){me.config.onValidateSuccess(input)}
                }else{
                    input.errNo = 1;
                    network.base.addClass(input,me.constant.ERROR_CLASS);
                    span.innerHTML = '\u8BF7\u586B\u5199\u5BC6\u7801';
                    if(me.config.onValidateError){me.config.onValidateError(input)}
                }                    
            },
            formSubmit = function(){
                blurFn();
                if(input.errNo === 0){
                    if(me.config.onBeforeSubmit){me.config.onBeforeSubmit()}
                    var j = network.post('/v2/api/getqrcode?lp=app', {
                        password: network.base.g(me._ids + '__qrcodePassword').value,
                        u: me.config.u || '',
                        staticpage: me.config.staticPage,
                        tpl: me.config.product || ''
                    });
                    j.success(function(rsp){
                        clearTimeout(me.timer)
                        if(rsp.errInfo.no === '0'){
                            input.value = '';
                            if(!me.secondStepInit){
                                me.secondStepInit = true;
                                network.base.g(me.config.id).appendChild(baidu(me._getTemplate('secondStep')).get(0));
                                network.base.on(network.base.g(me._ids+'__qrcodelink'),'click',function(){me.goBack()})
                            }else{
                                network.base.g(me._ids+'__qrcodeStep2').style.display = '';
                            }
                            network.base.g(me._ids+'__qrcodeImg').src = (window.location ? window.location.protocol : document.location.protocol)+'//'+rsp.data.imgurl;
                            step1Dom.style.display = 'none';
                            me.timer = setTimeout(function(){
                                me.goBack()
                            },me.config.timer || 5*60*1000)
                            if(me.config.onSubmitSuccess){me.config.onSubmitSuccess(rsp)}
                        }else{
                            network.base.addClass(input,me.constant.ERROR_CLASS);
                            span.innerHTML = rsp.errInfo.msg;
                            if(me.config.onSubmitError){me.config.onSubmitError(rsp)}
                        }
                    })
                }
            };
        network.base.on(input,'mouseover',function(evt){
            var evt = getEvent(evt);
            evt.ids = me._ids;
            if(input.className.indexOf(me.constant.HOVER_CLASS) == -1){
                network.base.addClass(input,me.constant.HOVER_CLASS)
            }
            if(input.className.indexOf(me.constant.FOCUS_CLASS) >= 0 ){
                network.base.removeClass(input,me.constant.FOCUS_CLASS)
            }
            if(input.className.indexOf(me.constant.ERROR_CLASS) >= 0){
                network.base.removeClass(input,me.constant.ERROR_CLASS)
            }
        });

        network.base.on(input,'mouseout',function(evt){
            var evt = getEvent(evt);
            evt.ids = me._ids;
            if(input.className.indexOf(me.constant.HOVER_CLASS) >= 0){
                network.base.removeClass(input,me.constant.HOVER_CLASS)
            }
        });

        network.base.on(input,'focus',function(evt){
            var evt = getEvent(evt);
            evt.ids = me._ids;
            if(input.className.indexOf(me.constant.HOVER_CLASS) >= 0){
                network.base.removeClass(input,me.constant.HOVER_CLASS)
            }
            if(input.className.indexOf(me.constant.ERROR_CLASS) >= 0){
                network.base.removeClass(input,me.constant.ERROR_CLASS)
            }
            if(input.className.indexOf(me.constant.FOCUS_CLASS) == -1){
                network.base.addClass(input,me.constant.FOCUS_CLASS);
            }
            span.innerHTML = ''
            if(me.config.onFieldFocus){me.config.onFieldFocus(evt)}
        });

        network.base.on(input,'keydown',function(evt){
            var evt = getEvent(evt);
            if(evt.keyCode == 13){
                input.blur()
                formSubmit()
                if(evt.preventDefault){
                   evt.preventDefault(); 
                }else{
                    evt.returnValue = false;
                }
            }
        });


        network.base.on(input,'blur',function(evt){
            blurFn();
            var evt = getEvent(evt);
            evt.ids = me._ids;
            if(me.config.onFieldBlur){me.config.onFieldBlur(evt)}
        });

        network.base.on(submit,'mouseover',function(){
            if(submit.className.indexOf(me.constant.PRESS_CLASS_SUBMIT) >= 0){
                network.base.removeClass(submit,me.constant.PRESS_CLASS_SUBMIT)
            }
            if(submit.className.indexOf(me.constant.HOVER_CLASS_SUBMIT) == -1){
                network.base.addClass(submit,me.constant.HOVER_CLASS_SUBMIT)
            }
        });

        network.base.on(submit,'mouseout',function(){
            if(submit.className.indexOf(me.constant.HOVER_CLASS_SUBMIT) >= 0){
                network.base.removeClass(submit,me.constant.HOVER_CLASS_SUBMIT)
            }                
        });

        network.base.on(submit,'mousedown',function(){
            if(submit.className.indexOf(me.constant.HOVER_CLASS_SUBMIT) >= 0){
                network.base.removeClass(submit,me.constant.HOVER_CLASS_SUBMIT)
            }
            if(submit.className.indexOf(me.constant.PRESS_CLASS_SUBMIT) == -1){
                network.base.addClass(submit,me.constant.PRESS_CLASS_SUBMIT)
            }
        });

        network.base.on(submit,'mouseup',function(){
            if(submit.className.indexOf(me.constant.PRESS_CLASS_SUBMIT) >= 0){
                network.base.removeClass(submit,me.constant.PRESS_CLASS_SUBMIT)
            }
        });         

        network.base.on(submit,'click',function(evt){
            var evt = getEvent(evt);
            evt.ids = me._ids;
            formSubmit()
            if(evt.preventDefault){
               evt.preventDefault(); 
            }else{
                evt.returnValue = false;
            }
        })
    },
    $getId:function(str){
        return this._ids +'__'+ str
    },
    goBack: function(){
        var me = this,
            network = passport.qrcode.data,
            step1Dom = network.base.g(me._ids+'__qrcodeStep1'),
            step2Dom = network.base.g(me._ids+'__qrcodeStep2');
        if(me.secondStepInit){
            clearTimeout(me.timer)
            step2Dom.style.display = 'none';
            step1Dom.style.display = '';
        }
        if(me.config.onGoBack){me.config.onGoBack()}
    }
}) 



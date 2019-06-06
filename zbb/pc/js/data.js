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

/**
 * @file 验证控件核心类
 * @author pass-fe@baidu.com
 */
var passport = window.passport || {};
passport.pop = passport.pop || {};
passport.pop.Forceverify = function(config, isRenderShow, diaVerify) {
    var W = window,
            D = W.document,
            B = D.body,
            E = D.documentElement,
            reqDomain = {
                "http:": "http://passport.baidu.com/",
                "https:": "https://passport.baidu.com"
            },
    //<editor-fold defaultstate="collapsed" desc="comment">


    Base = {},
            Request = {};
    var _blankFunc = function() {
    };
    function Promise(initCallback) {
        this._requests = [];
        this._value = null;
        this._exception = null;
        this._isComplete = false;
        var promise = this;
        initCallback(
                function(value) {
                    promise._fulfillPromise(value);
                },
                function(value) {
                    promise._breakPromise(value);
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
            return this.when(fulfillPromise, _blankFunc, context);
        },
        fail: function(breakPromise, context) {
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

            } else if (op.fulfillPromise) {
                op.fulfillPromise(this._value);
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
            if (baidu) {
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
        Base.arrayOn = function (array, type, func) {
            var length = array.length;
            for (var i = 0; i < length; i++) {
                Base.on(array[i], type, func);
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
                    h = i.compatMode === "BackCompat" ? i.body : i.documentElement;
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
        Base.getScrollLeft = function() {
            var d = document;
            return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
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
                    if (p) {
                        a.style[p[0]] = p[1];
                    }
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
            } else if (document.body) {
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


    //</editor-fold>
    var cfg = {/*
     verifyData : config.verifyData,//该参数在wrapper中进行了严格校验，可以信任
     verifyTypes : config.verifyTypes,//wrapper中生成的verifyTypes，统计当前verify的种类*/
        title: config.title || "\u5b89\u5168\u9a8c\u8bc1",
        msg: config.msg || "\u60a8\u7684\u5e10\u53f7\u53ef\u80fd\u5b58\u5728\u5b89\u5168\u98ce\u9669\uff0c\u4e3a\u4e86\u786e\u4fdd\u4e3a\u60a8\u672c\u4eba\u64cd\u4f5c\uff0c\u8bf7\u5148\u8fdb\u884c\u5b89\u5168\u9a8c\u8bc1\u3002",
        footerHTML: config.footerHTML,
        currentType: config.curType || 'softtoken', //默认强制验证类型，默认为 softtoken,
        token: config.token//获取token
    };

    this._ids = Base.id();
    this.domain = reqDomain[window.location.protocol.toLowerCase()];
    this.url_get_public_key = this.domain + '/v2/getpublickey';
    this.url_get_api = this.domain + '/v2/sapi/authwidgetverify';
    this.url_send = this.domain + '/v2/sapi/authwidgetverify';
    this.url_submit = this.domain + '/v2/sapi/authwidgetverify';
    this.url_qrcode = this.domain + '/v2/?authwidget-qrcode';
    this.url_qrcode_channel = "https://passport." + "baidu.com/channel/unicast";
    this.url_onekey_channel = "https://passport." + "baidu.com/channel/unicast";
    this.url_upsms_channel = "https://passport." + "baidu.com/channel/unicast";
    this.url_onekey_push = this.domain + '/v2/?authwidget-onekeypush';
    this.url_channel = '';
    this.url_forgot = '';
    this.msg = cfg.msg;
    this.color = config.color;//color:blue green red
    this.app = {};
    this.title = cfg.title;
    this.auth_types = [];
    this.hasEmailForceverify = false;
    this.hasQuestionForceverify = false;
    this.needsid = config.needsid || 0;
    this.def_html = config.defaultHTML || '';//如果没有获取到用户名，
    this.onRender = config.onRender || function() {
    };
    this.isShow = false;
    this.onHide = config.onHide || function() {
    };
    this.onSendvcodeSuccess = config.onSendvcodeSuccess || function() {
    };
    this.onSubmitSuccess = config.onSubmitSuccess || function() {
    };
    this.onSubmitFailure = config.onSubmitFailure || function() {
    };
    this.onGetapiError = config.onGetapiError || function() {
    };
    this.onForceverifySuccess = config.onForceverifySuccess || function(){};
    this.current_type = cfg.currentType;
    this.current_app_type = cfg.currentAppType || 'softtoken';
    this.texts = {
        email: {
            name: "密保邮箱",
            tip: '请输入六位数验证码',
            empty: "请输入邮箱验证码",
            format: "验证码为六位数字"
        },
        mobile: {
            name: "手机",
            tip: '请输入六位数验证码',
            empty: "请输入短信验证码",
            format: '验证码为六位数字',
            faceidcardformat: '身份证号格式错误'
        },
        softtoken: {
            name: '百度帐号管家',
            tip: "6位动态数字",
            empty: "请输入6位动态数字",
            format: "验证码为六位数字"
        },
        password: {
            name: "登录密码",
            tip: '当前登录密码',
            empty: "请输入当前登录密码"
        },
        original_email: {
            name: "当前邮箱",
            msg: "您的当前密保邮箱是：$value",
            tip: "请输入完整的当前邮箱地址",
            empty: "请输入当前邮箱地址",
            format: "邮箱格式不正确"
        },
        original_mobile: {
            name: "当前手机",
            msg: "您的当前手机是：$value",
            tip: "请输入完整的当前手机号码",
            empty: "请输入当前手机号码",
            format: "号码格式不正确"
        },
        question: {
            name: "密保问题",
            tip: "请填写答案",
            empty: "请输入1-20个中文或2-40个英文",
            format: "请输入1-20个中文或2-40个英文"
        },
        bank: {
            name: '银行卡验证',
            msg: '填写银行卡信息验证身份',
            labelcard: '银行卡号',
            labelcardname: '姓名',
            labelidcard: '身份证号',
            labelbankphone: '预留手机号',
            tipcard: '填写尾号$value完整的银行卡号',
            tipcardname: '请填写真实姓名',
            tipidcard: '填写持卡人身份证',
            tipbankphone: '填写银行预留手机号',
            idcardempty: '请输入身份证号',
            cardnameempty: '请输入真实姓名',
            bankphoneempty: '请输入银行预留手机号',
            cardempty: '请输入银行卡号',
            bankphoneformat: '银行预留手机号格式不正确',
            idcardformat: '身份证号格式错误',
            tip: '请输入六位数验证码',
            empty: '请输入验证码'
        },
        newcard: {
            name: '新增银行卡验证（无需绑定）',
            msg: '填写银行卡信息验证身份',
            labelcard: '银行卡号',
            labelcardname: '姓名',
            labelidcard: '身份证号',
            labelbankphone: '预留手机号',
            tipcard: '填写尾号$value完整的银行卡号',
            tipcardname: '请填写真实姓名',
            tipidcard: '填写持卡人身份证',
            tipbankphone: '填写银行预留手机号',
            idcardempty: '请输入身份证号',
            cardnameempty: '请输入真实姓名',
            bankphoneempty: '请输入银行预留手机号',
            cardempty: '请输入银行卡号',
            bankphoneformat: '银行预留手机号格式不正确',
            idcardformat: '身份证号格式错误',
            tip: '请输入六位数验证码',
            empty: '请输入验证码'
        },
        face: {
            name: "刷脸验证",
            labelfaceidcard: '身份证号',
            labeltruename: '真实姓名',
            msg: '请输入$value的真实信息',
            tipfaceidcard: '填写持卡人身份证',
            tiptruename: '填写真实姓名',
            faceidcardempty: '请输入身份证号',
            faceidcardformat: '身份证号格式错误',
            truenameempty: '请输入真实姓名'
        }
    };
    this.longRequestStatus = true;
    this.smsVertifyAuthsid = '';

    var self = this;
    var AuthItem = function(name, value) {
        this.name = name;
        this.value = value;
    };
    var id = this.id = self._ids;
    var get_id = this.getById /* extern */ = function(suffix) {
        return [id, suffix].join("__");
    };

    var globalTraceId = config.traceid;
    var get_item = function(name) {
        name = name || self.current_type;
        for (var i = 0; i < self.auth_types.length; i++) {
            if (name === self.auth_types[i].name) {
                return self.auth_types[i];
            }
        }
        return new AuthItem("", "");
    };
    var is_in_authtypes = function(name) {
        for (var i = 0; i < self.auth_types.length; i++) {
            if (name === self.auth_types[i].name) {
                return true;
            }
        }
        return false;
    };
    var display = function(id, text) {
        var el = self.getElement(id);
        if (el) {
            el.style.display = text;
        }
    };

    var hide = function(id) {
        display(id, "none");
    };

    var show = function(id) {
        display(id, "block");
    };
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function(className, element) {
            var children = (element || document).getElementsByTagName('*');
            var elements = new Array();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                var classNames = child.className.split(' ');
                for (var j = 0; j < classNames.length; j++) {
                    if (classNames[j] == className) {
                        elements.push(child);
                        break;
                    }
                }
            }
            return elements;
        };
    }
    var classShow  = function (className) {
        var classList = document.getElementsByClassName(className);
        for (var i = 0; i < classList.length; i++) {
            classList[i].style.display = 'show';
        }
    };
    var classHide  = function (className) {
        var classList = document.getElementsByClassName(className);
        for (var i = 0; i < classList.length; i++) {
            classList[i].style.display = 'none';
        }
    };

    var internationInit = false;
    var countrycode = '';
    var internationStatus = 0;

    var get_by_id = this.getById/* extern */ = function(suffix) {
        var el = typeof (suffix) === "string" ? Base.g([id, suffix].join("__")) : suffix;
        if (el) {
            el.hide = function(type) {
                this.style.display = type ? type : "none";
            };
            el.show = function(type) {
                this.style.display = type ? type : "block";
            };

            el.html = function(html) {
                this.innerHTML = html;
            };

            el.attr = function(name, value) {
                this.setAttribute(name, value);
            };

            el.on = function(ename, callback) {
                Base.on(this, ename, callback);
            };
            el.addClass = function(className) {
                Base.addClass(this, className);
            };
            el.removeClass = function(className) {
                Base.removeClass(this, className);
            };
        }

        return el;
    };


    var get_tpl = function(type) {
        var _ids = self._ids;
        var select_tpl = '';
        var template = {};

        var is_display_original_mobile = 'none';
        var is_display_original_email = 'none';
        var is_display_password = 'none';
        var is_display_email = 'none';
        var is_display_emailquestion = 'none';
        var is_display_mobile = 'none';
        var is_display_app = 'none';
        var is_display_send = 'none';
        var is_display_question = 'none';
        var isDisplayBank = 'none';
        var is_display_face = 'none';
        var isDisplayCardlist = 'none';
        var isDisplayNewcard = 'none';
        var select_list = [];
        var question_wrapper = [];
        var question_list = [];
        var email_question_wrapper = [];
        var email_question_list = [];
        var bankWrapper = '';
        var faceWrapper = '';
        var footer = cfg.footerHTML;
        function getFaceQrcode() {
            // 二维码调起活体
            var qrcodeHtml = [];
            qrcodeHtml.push('<div class="face-qrcode-content">');
            qrcodeHtml.push('<div class="Qrcode-status-con tang-pass-qrcode-init" id="'
                                + _ids + '__QrcodeMain">');
            qrcodeHtml.push('<div class="tang-pass-qrcode-imgWrapper">'
                               + '<img class="tang-pass-qrcode-img" src="' + self.domain
                               + '/passApi/img/loading.gif" id="' + _ids + '__qrcodeImg"/>'
                            + '</div>');
            qrcodeHtml.push('</div>');
            qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-success" id="'
                                + _ids + '__QrcodeSuccess">'
                                + '<p class="Qrcode-status-icon"></p>'
                                + '<p>扫描成功</p>'
                                + '<p class="Qrcode-status-msg">请在手机端完成刷脸</p>'
                            + '</div>');
            qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-error" id="'
                                + _ids + '__QrcodeError">'
                                + '<p class="Qrcode-status-icon"></p>'
                                + '<p>网络链接失败</p>'
                                + '<p class="Qrcode-status-msg">请稍后再试</p>'
                            + '</div>');
            qrcodeHtml.push('<div class="Qrcode-status-con Qrcode-status-refresh" id="'
                                + _ids + '__QrcodeRefresh">'
                                + '<p class="Qrcode-status-icon"></p>'
                                + '<p class="refresh-title refresh-timeout">二维码获取失败</p>'
                                + '<p class="Qrcode-refresh-btn" id="'
                                + _ids + '__QrcodeRefreshBtn">刷新二维码</p>'
                            + '</div>');
            qrcodeHtml.push('<p class="qrcode-bottomtip">百度技术加密，保障您的隐私安全</p>');
            qrcodeHtml.push('</div>');
            return qrcodeHtml;
        }
        if (type === 'wrapper') {
                var current_item = get_item();
                var select_tpl = null;

            do {
                if (self.current_type === "original_mobile") {
                    is_display_original_mobile = "block";
                    select_tpl = [
                        "<span class=\"forceverify-error\" id=\"",_ids,"__forceverify_error\"></span>",
                        "<div class=\"content-element content-msg\">",
                        /*    */"<p class=\"content-msgtext\" id=\"", _ids, "__content_original_mobile_msg\">",
                        /*        */self.texts[self.current_type].msg.replace("$value", current_item.value),
                        /*    */"</p>",
                        "</div>"
                    ].join("");
                    break;
                }
                if (self.current_type === "original_email") {
                    is_display_original_email = "block";
                    select_tpl = [
                        "<span class=\"forceverify-error\" id=\"",_ids,"__forceverify_error\"></span>",
                        "<div class=\"content-element content-msg\">",
                        /*    */"<p class=\"content-msgtext\" id=\"", _ids, "__content_original_email_msg\">",
                        /*        */self.texts[self.current_type].msg.replace("$value", current_item.value),
                        /*    */"</p>",
                        "</div>"
                    ].join("");
                    break;
                }

                if (self.current_type === "softtoken") {
                    is_display_app = 'block';
                }

                if (self.current_type === "password") {
                    is_display_password = 'block';
                }

                if (self.current_type === "mobile") {
                    is_display_send = "block";
                    is_display_mobile = 'block';
                }

                if (self.current_type === "email") {
                    is_display_send = "block";
                    is_display_email = 'block';
                    if(config.emailAndQuestion && self.hasQuestionForceverify){
                        is_display_emailquestion = 'block'
                    }
                }

                if (self.current_type === "question") {
                    is_display_question = 'block';
                }

                if (self.current_type === 'bank') {
                    isDisplayBank = 'block';
                    isDisplayCardlist = 'block';
                }
                if (self.current_type === 'newcard') {
                    isDisplayNewcard = 'block';
                    isDisplayBank = 'block';
                }
                if (self.current_type === 'face') {
                    is_display_face = 'block';
                }

                for (var i = 0; i < self.auth_types.length; i++) {
                    var item = self.auth_types[i];
                    var name = item.name;
                    var value = (name ==="question") ? "" : item.value;
                    if(name !=="question"){
                         select_list.push(["<li class=\"passapi-select-list select-list-", name, "\">",
                        /*    */"<a class=\"passapi-select-item select-item-", name, "\" id=\"", _ids, "__select_", name, "\" data-curr=\"", name, "\">",
                        /*        */ (name === 'bank' || name === 'face') ? [value, '的', self.texts[name].name].join('') : [value, self.texts[name].name].join(''),
                        /*    */"</a>",
                        "</li>"].join(""));
                   }else if(name ==="question" && config.questionForceverify){
                        select_list.push(["<li class=\"passapi-select-list select-list-", name, "\">",
                        /*    */"<a class=\"passapi-select-item select-item-", name, "\" id=\"", _ids, "__select_", name, "\" data-curr=\"", name, "\">",
                        /*        */ self.texts[name].name, value,
                        /*    */"</a>",
                        "</li>"].join(""));
                   }
                    function addInput(name, item) {
                        return '<div class="forceverify-input-wrapper-new clearfix"'
                        + (item === 'cardname' ? ' id="' + _ids
                        + '__newcardName" style="display:' + isDisplayNewcard + '"' : '') + '>'
                            + '<input type="text" class="forceverify-input forceverify-input-new"'
                            + 'id="' + _ids + '__input_' + item + '"/>'
                            + '<label class="forceverify-input-label-before">'
                                + self.texts[name]['label' + item]
                            + '</label>'
                            + '<label  class="forceverify-input-label"  id="' + _ids + '__input_label_' + item + '">'
                                + (item === 'card' ? (name === 'bank'
                                    ? self.texts[name]['tip' + item].replace('$value', self.bankcardlist[0].card_no)
                                    : '填写持卡人银行卡号')
                                : self.texts[name]['tip' + item])
                            + '</label>'
                            + '</div>';
                    }
                    /* 密保问题内容tpl*/
                    if(name === "question"){
                        var parentItem = item.value;
                        var count;

                        for(var i=0;i<parentItem.length;i++){
                            count = i+1;
                            if(config.questionForceverify){
                                question_list.push([
                                    "<div class=\"question-detail-list clearfix\">",
                                        "<label class=\"question-detail-title\">问题",count,"：</label>",
                                        "<p class=\"question-detail-content\" id=\"",_ids,"__question_qid_",count,"\" data-questionid=\"",parentItem[i].id,"\">",parentItem[i].msg,"</p>",
                                    "</div>",
                                    "<div class=\"question-detail-list clearfix\">",
                                        "<label class=\"question-detail-title\">答案：</label>",
                                        "<p class=\"question-detail-content\">",
                                            "<input type=\"text\" class=\"forceverify-input forceverify-input-question\" id=\"",_ids,"__input_",name,"_",count,"\" />",
                                            "<label class=\"forceverify-input-label\" id=\"",_ids,"__input_label_",name,"_",count,"\">请填写答案</label>",
                                        "</p>",
                                    "</div>"
                                ].join(""));
                            }
                            if(config.emailAndQuestion && self.hasEmailForceverify){
                                email_question_list.push([
                                    "<div class=\"question-detail-list clearfix\">",
                                        "<label class=\"question-detail-title\">问题",count,"：</label>",
                                        "<p class=\"question-detail-content\" id=\"",_ids,"__emailquestion_qid_",count,"\" data-emailquestionid=\"",parentItem[i].id,"\">",parentItem[i].msg,"</p>",
                                    "</div>",
                                    "<div class=\"question-detail-list clearfix\">",
                                        "<label class=\"question-detail-title\">答案：</label>",
                                        "<p class=\"question-detail-content\">",
                                            "<input type=\"text\" class=\"forceverify-input forceverify-input-question\" id=\"",_ids,"__input_email",name,"_",count,"\" />",
                                            "<label class=\"forceverify-input-label\" id=\"",_ids,"__input_label_email",name,"_",count,"\">请填写答案</label>",
                                        "</p>",
                                    "</div>"
                                ].join(""));
                            }

                        }
                        if(config.questionForceverify && parentItem.length>0){
                            question_wrapper.push([
                                "<div class=\"content-element content-question clearfix\" id=\"", _ids, "__content_question\" style=\"display:", is_display_question, "\">",
                                    "<div class=\"question-detail-wrapper clearfix\">",
                                        question_list ? question_list.join("") : "",
                                    "</div>",
                                    "<div class=\"content-element content-submit-question clearfix\" id=\"", _ids, "__content_submit_question\">",
                                        "<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__submit_question\" value=\"确定\" />",
                                    "</div>",
                                "</div>"
                            ].join(""));
                        }
                        if(config.emailAndQuestion && self.hasEmailForceverify && parentItem.length>0){
                            email_question_wrapper.push([
                                "<div class=\"content-element content-emailquestion clearfix\" id=\"", _ids, "__content_emailquestion\" style=\"display:", is_display_emailquestion, "\">",
                                    "<div class=\"question-detail-wrapper clearfix\">",
                                        "<div class=\"emailquestion-title\"><label>密保问题</label></div>",
                                        email_question_list ? email_question_list.join("") : "",
                                    "</div>",
                                "</div>"
                            ].join(""));
                        }
                    } else if (name === 'bank' || name === 'newcard') {
                        bankWrapper += '<div class="content-element content-bank clearfix" id="'
                                    + _ids + '__content_bank" style="display:' + isDisplayBank + '">';
                        var banklist = ['card', 'cardname', 'idcard', 'bankphone'];
                        if (name === 'bank') {
                            bankWrapper += '<div class="bank_display-content clearfix">'
                                        + '<span class="select-show-uname" id="' + _ids + '__bank_display">'
                                        + '<img class="bank-img" src="' + self.bankcardlist[0].img + '">'
                                        + self.bankcardlist[0].bank_name + self.bankcardlist[0].bank_type
                                        + '（' + self.bankcardlist[0].card_no + '）</span>';
                            bankWrapper += '<div class="bank-change" id=' + _ids + '__bankChange>更换</div>'
                                      + '<ul class="passapi-select-banklist" id="' + _ids + '__selectList">';
                            var banksLength = self.bankcardlist.length;
                            for (var j = 0; j < banksLength; j++) {
                                bankWrapper += '<li class="passapi-select-list bank-li">'
                                    + '<a class="passapi-select-item bank-li-content">'
                                    + '<img class="bank-img" src="' + self.bankcardlist[j].img + '">'
                                    + self.bankcardlist[j].bank_name + self.bankcardlist[j].bank_type + '（'
                                    + '<span class="bank-cardno">' + self.bankcardlist[j].card_no + '</span>）</a>'
                                + '</li>';
                            }
                            if (self.newcard === '1') {
                                bankWrapper += '<li class="passapi-select-list bank-li-add" id="'
                                        + _ids + '__verifynew">'
                                        + '<p class="bank-p-add">验证其他银行卡</p>'
                                        + '<p class="bank-p-tip">银行卡仅用于身份验证，此卡不会绑定至帐号</p>'
                                + '</li>';
                            }
                            bankWrapper += '</ul>';
                            bankWrapper += '</div>';
                        }
                        if (name === 'bank') {
                            self.currentBankno = self.bankcardlist[0].card_no;
                            self.currentBankType = 'verify';
                        } else {
                            self.currentBankno = '';
                            self.currentBankType = 'addverify';
                        }
                        bankWrapper += '<p class="newcard-tip" id="' + _ids + '__newcardTip" style="display:'
                                + isDisplayNewcard + '">所填写信息仅用于身份验证，此卡不会绑定至帐号，请放心填写</p>';
                        for (var j = 0; j < banklist.length; j++) {
                            bankWrapper += addInput(name, banklist[j]);
                        }
                        bankWrapper += '<div class="clearfix">'
                                  + '<input type="button" class="forceverify-button forceverify-button-submit"'
                                  + ' id="' + _ids + '__submit_bank" value="确定" />'
                                  + '</div>';
                        bankWrapper += '</div>';
                    } else if (name === 'face') {
                        if (!config.is_junior_cert) {
                            var qrcodeHtml = getFaceQrcode();
                        }
                        faceWrapper += '<div class="content-element content-face clearfix" id="'
                                    + _ids + '__content_face" style="display:' + is_display_face + '">';
                        faceWrapper += '<div class="content-element-face1" id="' + _ids + '__content_face_block1">';
                        faceWrapper += '<p class="content-title">请输入' + get_item('face').value + '的真实信息</p>';
                        var facelist = ['truename', 'faceidcard'];
                        for (var j = 0; j < facelist.length; j++) {
                            faceWrapper += addInput('face', facelist[j]);
                        }
                        faceWrapper += '<div class="clearfix">'
                                  + '<input type="button" class="forceverify-button forceverify-button-submit"'
                                  + ' id="' + _ids + '__submit_face" value="下一步" />'
                                  + '</div>';
                        faceWrapper += '</div>';
                        if (!config.is_junior_cert) {
                            faceWrapper += '<div class="content-element-face2" id="' + _ids + '__content_face_block2">';
                            faceWrapper += '<p class="content-title">还差一步，完成验证</p>';
                            faceWrapper += '<p class="content-subtitle">请使用最新版百度App扫描下方二维码，完成刷脸验证</p>';
                            faceWrapper += qrcodeHtml.join('');
                            faceWrapper += '</div>';
                        }
                        faceWrapper += '</div>';
                    }
                }
                select_list.push(['<li class="passapi-select-list select-list-other">',
                    /*    */"<a class=\"passapi-select-item select-item-other\" id=\"", _ids, "__select_show_other\"", config.winsdk ? "": "target=\"_blank\""," href=\"", self.url_forgot, "\" data-curr=\"other\">",
                    /*        */is_display_password === "block" ? "忘记密码，点击申诉" : "密保工具均不可用，点击申诉",
                    /*    */"</a>",
                    "</li>"].join(""));
                if ((self.auth_types.length === 1 && config.aim === 'cancleRealname')
                 || (config.aim === 'cancleRealname' && config.is_junior_cert)) {
                    if (name === 'mobile' || (config.is_junior_cert && name === 'face')) {
                        select_tpl = '发送验证码短信到' + current_item.value;
                    } else if (name === 'email') {
                        select_tpl = '发送验证码到绑定邮箱' + current_item.value;
                    } else if (name === 'password') {
                        select_tpl = '请输入' + current_item.value + '的登录密码';
                    }
                    select_tpl = [
                        '<div class="content-element content-type content-type-single clearfix" id="',
                        _ids, '__content_type_contain">',
                            '<span id="', _ids, '__forceverify_mobile_tip_text">', select_tpl, '</span>',
                            '<span class="forceverify-error" id="', _ids, '__forceverify_error"></span>',
                        '</div>'
                    ].join('');
                } else {
                    select_tpl = [
                        '<span class="bank-verify" id="' + _ids + '__bankVerify"></span>',
                        '<span class="forceverify-error" id="', _ids, '__forceverify_error"></span>',
                        '<div class="content-element content-type clearfix" id="', _ids, '__content_type_contain">',
                            '<div class="content-element content-title">',
                                '<label class="content-type-title" id="', _ids, '__content_type_title">',
                                    '验证方式',
                                '</label>',
                            '</div>',
                            '<div class="content-type-select" id="' + _ids + '__content_type_select">',
                                '<div class="passapi-select-show" id="' + _ids + '__content_select_show">',
                                    '<span class="select-show-uname" id="', _ids, '__content_select_uname">',
                                    (self.current_type === 'question') ? '' : current_item.value,
                                    self.texts[self.current_type].name,
                                    '</span>',
                                    '<a class="select-show-arrow" id="', _ids, '__select_show_arrow">',
                                    '</a>',
                                '</div>',
                                '<ul class="passapi-select-handler" id="', _ids, '__content_select_handler">',
                                    select_list.join(''),
                                '</ul>',
                            '</div>',
                        '</div>'
                    ].join('');
                }
            } while (false);

        }



        if (type === "mask") {
            var src = ((window.location ? window.location.protocol.toLowerCase()
                    : document.location.protocol.toLowerCase()) === "https:"
                    ? "https://passport.baidu.com/passApi/html/_blank.html" : "about:blank");
            return ["<div id=\"", _ids, "__mask\" class=\"pass-forceverify-mask\" style=\"top: 0px; left: 0px;width:", Base.getViewWidth(), "px;height:", Base.getViewHeight(), "px; ",
                "position: fixed; _position: absolute;filter: alpha(opacity = 30);opacity: 0.15; z-index: 1004; background-color: rgb(0, 0, 0);display:none;\">",
                /*    */"<iframe frameborder=\"0\" style=\"filter:progid:DXImageTransform.Microsoft.Alpha(opacity:0);position:absolute;top:0px;left:0px;",
                "width:100%;height:100%;z-index:-1\" src=\"", src, "\">",
                /*    */"</iframe>",
                /*    */"<div style=\"position:absolute;top:0px;left:0px;width:100%;height:100%;z-index:-1;\">",
                /*        */"&nbsp;",
                /*    */"</div>",
                "</div>"].join("");
        }
        if (type === "wrapper") {
            if (self.auth_types.length === 0) {
                return '<div class="pass-forceverify-wrapper pass-forceverify-'+self.color+'" id="' + _ids + '__wrapper" style="display:none;">' +
                        '<div class="forceverify-header" id="' + _ids + '__header">' +
                        '<h3 class="forceverify-header-h3" id="' + _ids + '__header_h3">' + self.title + '</h3>' +
                        '<a class="forceverify-header-a" id="' + _ids + '__header_a"></a>' +
                        '</div>' +
                        '<div class="forceverify-article" id="' + _ids + '__article">' +
                        self.def_html +
                        '</div>' +
                        '</div>';
            } else {
                return ["<div class=\"pass-forceverify-wrapper pass-forceverify-"+self.color+"\" id=\"", _ids, "__wrapper\" style=\"display:none;\">",
                    /*    */"<div class=\"forceverify-header\" id=\"", _ids, "__header\">",
                    /*        */"<h3 class=\"forceverify-header-h3\" id=\"", _ids, "__header_h3\">",
                    /*            */self.title,
                    /*        */"</h3>",
                    /*        */"<a class=\"forceverify-header-a\" id=\"", _ids, "__header_a\">",
                    /*        */"</a>",
                    /*    */"</div>",
                    /*    */"<div class=\"forceverify-article\" id=\"", _ids, "__article\">",
                    /*        */"<div class=\"pass-forceverify-content\" id=\"", _ids, "__content\" style=\"\">",
                    /*            */"<div class=\"content-element content-msg\">",
                    /*                */"<p class=\"content-msgtext\" id=\"", _ids, "__content_msgtext\">",
                    /*                    */self.msg,
                    /*                */"</p>",
                    /*            */"</div>",
                    select_tpl ? select_tpl : ("<span class=\"forceverify-error\" id=\"",_ids,"__forceverify_error\"></span>"),
                    /*            */"<div class=\"content-element content-vcode clearfix\" id=\"", _ids, "__content_vcode\" style=\"display:", is_display_send, "\">",
                    /*                */"<input type=\"text\" class=\"forceverify-input forceverify-input-vcode\" autocomplete=\"off\" id=\"", _ids, "__input_vcode\" maxlength=\"8\" /><input type=\"text\" style=\"display:none\"/>",
                    /*                */"<label class=\"forceverify-input-label\" id=\"", _ids, "__input_label_vcode\">",
                    /*                    */ self.texts[self.current_type].tip,
                    /*                */"</label>",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-password clearfix\" id=\"", _ids, "__content_password\" style=\"display:", is_display_password, "\">",
                    /*                */"<input type=\"password\" class=\"forceverify-input forceverify-input-password\" id=\"", _ids, "__input_password\" maxlength=\"50\" />",
                    /*                */"<label class=\"forceverify-input-label\" id=\"", _ids, "__input_label_password\">",
                    /*                    */ self.texts['password'].tip,
                    /*                */"</label>",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-send clearfix\" id=\"", _ids, "__content_send_email\" style=\"display:", is_display_email, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-send\" id=\"", _ids, "__button_send_email\" value=\"发送验证码\" />",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-send clearfix\" id=\"", _ids, "__content_send_mobile\" style=\"display:", is_display_mobile, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-send\" id=\"", _ids, "__button_send_mobile\" value=\"发送验证码\" />",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-original clearfix\" id=\"", _ids, "__content_original_email\" style=\"display:", is_display_original_email, "\">",
                    /*                */"<input type=\"text\" class=\"forceverify-input forceverify-input-original\" id=\"", _ids, "__input_original_email\" maxlength=\"50\" />",
                    /*                */"<label class=\"forceverify-input-label\" id=\"", _ids, "__input_label_original_email\">",
                    /*                    */ self.texts[self.current_type].tip,
                    /*                */"</label>",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-original clearfix\" id=\"", _ids, "__content_original_mobile\" style=\"display:", is_display_original_mobile, "\">",
                    /*                */'<div><label class="label-input-code" id="', _ids, '__fi_content_select_show">' + (countrycode ? ('+' + countrycode.substring(2)) : '+86') + '</label></div>',
                    /*                */'<input type="text" class="forceverify-input forceverify-input-original forceverify-input-code" id="', _ids, '__input_original_mobile" maxlength="50" />',
                    /*                */"<ul class=\"country-select-handler\" id=\"", _ids, "__fi_content_select_handler\"></ul>",
                    /*                */"<label class=\"forceverify-input-label forceverify-input-code-label\" id=\"", _ids, "__input_label_original_mobile\">",
                    /*                    */ self.texts[self.current_type].tip,
                    /*                */"</label>",
                    /*                "<div class=\"forceverify-cut-internation\"><em id=\"",_ids,"__fi_cut_internation_title\">海外</em>手机号请<a id=\"",_ids,"__fi_cut_internation_handler\">点击这里</a></div>",*/
                    /*            */"</div>",

                     /*邮箱+密保问题tpl */
                    /*            */email_question_wrapper ? email_question_wrapper.join("") : "",

                    /*密保问题tpl */
                    /*            */question_wrapper ? question_wrapper.join("") : "",
                                    bankWrapper ? bankWrapper : '',
                                    faceWrapper ? faceWrapper : '',

                    /*            */"<div class=\"content-element content-submit  clearfix\" id=\"", _ids, "__content_submit\" style=\"display:", is_display_send, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__button_submit\" value=\"确定\" />",
                    /*                */"<a class=\"switch_upsms\" style=\"display:none;line-height:30px\" id=\"", _ids, "__udlr\" >收不到短信？</a>",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-submit clearfix\" id=\"", _ids, "__content_submit_password\" style=\"display:", is_display_password, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__submit_password\" value=\"确定\" />",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-submit-original clearfix\" id=\"", _ids, "__content_submit_original_email\" style=\"display:", is_display_original_email, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__submit_original_email\" value=\"确定\" />",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-submit-original clearfix\" id=\"", _ids, "__content_submit_original_mobile\" style=\"display:", is_display_original_mobile, "\">",
                    /*                */"<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__submit_original_mobile\" value=\"确定\" />",
                    /*            */"</div>",
                    /*            */"<div class=\"content-element content-app ", self.current_app_type, " clearfix\" id=\"", _ids, "__content_app\" style=\"display:", is_display_app, "\">",
                    /*                */"<ul class=\"app-select clearfix\" id=\"", _ids, "__content_app_select\">",
                    /*                    */"<li class=\"app-select-list app-softtoken\" data-click=\"softtoken\">",
                    /*                        */"动态令牌",
                    /*                    */"</li>",
                    /*                    */"<li class=\"app-select-list app-qrcode\" data-click=\"qrcode\">",
                    /*                        */"二维码扫描",
                    /*                    */"</li>",
                    /*                    */"<li class=\"app-select-list app-fast\" data-click=\"fast\">",
                    /*                        */"一键验证",
                    /*                    */"</li>",
                    /*                */"</ul>",
                    /*                */"<a class=\"app-select-bottom list-bottom\">",
                    /*                    */"<em class=\"list-bottom-arrow\">",
                    /*                    */"</em>",
                    /*                */"</a>",
                    /*                */"<div class=\"app-detail clearfix\">",
                    /*                    */"<div class=\"app-detail-wrapper clearfix\">",
                    /*                        */"<div class=\"app-detail-list app-detail-softtoken clearfix\">",
                    /*                            */"<p class=\"app-detail-msg app-detail-msg-softtoken\">",
                    /*                                */"请打开您手机上的百度帐号管家客户端，输入动态令牌上随机变化的六位数字：",
                    /*                            */"</p>",
                    /*                            */"<input type=\"text\" name=\"vcode-softtoken\" maxlength=\"6\" id=\"", _ids, "__input_softtoken\" class=\"forceverify-input forceverify-input-vcode\" autocomplete=\"off\" />",
                    /*                            */"<label class=\"forceverify-input-label\" id=\"", _ids, "__input_label_softtoken\">",
                    /*                                */self.texts.softtoken.tip,
                    /*                            */"</label>",
                    /*                            */"<input type=\"button\" class=\"forceverify-button forceverify-button-submit\" id=\"", _ids, "__submit_softtoken\" value=\"确定\" />",
                    /*                        */"</div>",
                    /*                        */"<div class=\"app-detail-list app-detail-qrcode\">",
                    /*                            */"<p class=\"app-detail-qrcode-img\"><img class=\"app-qrcode-img\" src=\"###\" alt=\"二维码验证图片\" id=\"", _ids, "__qrcode_img\" /></p>",
                    /*                            */"<p class=\"app-detail-qrcode-desc\">请打开您手机上的百度帐号管家客户端，扫描左侧二维码</p>",
                    /*                        */"</div>",
                    /*                        */"<div class=\"app-detail-list app-detail-fast\">",
                    /*                            */"<p class=\"app-detail-msg app-detail-msg-fast\" id=\"", _ids, "__fast_msg\">",
                    /*                                */"请打开您手机上的百度帐号管家客户端，点击“一键验证”获取本次的验证请求",
                    /*                            */"</p>",
                    /*                        */"</div>",
                    /*                    */"</div>",
                    /*                */"</div>",
                    /*            */"</div>",
                    /*            */"<div class=\"forceverify-upsms clearfix\" id=\"", _ids, "__content_upsms\" style=\"display:none;z-index: 1;\">",
                    /*                */"<div class=\"upsms-msg\">请使用手机 ", get_item("mobile").value, " 发送短信，到 10690691036581</div>",
                    /*                */"<table class=\"upsms-contain\">",
                    /*                  */"<tr><td class=\"rowname\" >编辑短信：</td><td id=\"", _ids, "__upsms_vcode\" class=\"rowvalue\"> </td><td rowspan=\"3\" class=\"upsms-qrcode\" id=\"", _ids, "__upsms_qrcode\"></td></tr>",
                    /*                  */"<tr><td class=\"rowname\" >发送到：</td><td class=\"rowvalue\" >1069 0691 0365 81</td></tr>",
                    /*                  */"<tr class=\"fillrow\"><td colspan=\"2\" > </td></tr>",
                    /*                  */"<tr class=\"upsms-footer\" >",
                    /*                      */"<td colspan=\"2\">*可能会由运营商收取0.1元短信费用</td>",
                    /*                      */"<td>也可扫描二维码发送短信</td>",
                    /*                  */"</tr>",
                    /*                */"</table>",
                    /*                */"<div class=\"upsms-bottom\">",
                    /*                */"<div class=\"upsms-back forceverify-button-submit\" id=\"", _ids, "__upsms_back\">返回</div>",
                    /*                */"</div>",
                    /*            */"</div>",
                    /*            */"<div class=\"forceverify-fail app-fail\" id=\"", _ids, "__app_fail\">",
                    /*                */"<em class=\"app-fail-icon\">",
                    /*                */"</em>",
                    /*                */"<span class=\"app-fail-msg\" id=\"", _ids, "__app_fail_msg\">",
                    /*                    */"您拒绝了本次安全验证",
                    /*                */"</span>",
                    /*            */"</div>",
                    /*            */_get_feedback_tpl(),
                    /*            */"<div class=\"content-element content-footer clearfix\">",
                    /*                */ footer,
                    /*            */"</div>",
                    /*        */"</div>",
                        '<div class="real-cancle-face" id="' + _ids + '__again_face">',
                        '<p class="content-msgtext">已完成手机验证。仍需进行刷脸验证，以确保您的帐号安全。</p>',
                        '<p class="content-face-msgtext">请用百度App扫描下方二维码，完成'
                        + (config.true_name ? ('<span class="blue">' + config.true_name
                        + '</span>') : '') + '的刷脸验证</p>',
                        config.aim === 'cancleRealname' ? getFaceQrcode().join('') : '',
                        '</div>',
                    /*    */"</div>",
                    "</div>"].join("");

            }
        }
    };

    var _get_feedback_tpl = function() {
        return '\
                <a class="forceverify-feedback clearfix" id="' + self._ids + '__feedback" href="http://passport.baidu.com/v2/?ucenterfeedback#ucenter_0" target="_blank">\
                    <div class="forceverify-feedback-inner">\
                        帮助中心\
                    </div>\
                </a>\
               ';
    };

    var _render_layout = function(callback) {
        if (self.auth_types.length > 0 || self.def_html) {
            Base.insertHTML(B, 'afterBegin', get_tpl('mask'));
            Base.insertHTML(B, 'beforeEnd', get_tpl('wrapper'));

            callback(self);

            if (self.current_type === 'softtoken') {
                _render_qrcode();//如果默认显示安全app验证，则发出qrcode的请求
            }
            // 用户选择数（页面默认）
            var urlData = {
                'page': 'forceverify_core',
                'source': config.winsdk === 1 ? 'winsdk' : 'pc',
                'tpl': config.tpl || '',
                'livinguname': self.livinguname
            };
            var newType = self.current_type;
            if (newType === 'mobile' && self.verifymobile) {
                newType = 'verifymobile';
            }
            var autoStatisticObj = {
                'eventType': 'pcapi-' + self.ppAuthName + '-' + newType + '_click'
            };
            logPass(urlData, autoStatisticObj);
        }

    };
    var _position = function() {
        var mask = self.getElement('mask');
        mask.style.top = Base.getScrollTop() + 'px';
        mask.style.left = Base.getScrollLeft() + 'px';
    };
    var _center = function() {
        var wrapperEle = self.getElement('wrapper'),
                maskEle = self.getElement('mask');

        maskEle.style.height = Base.getViewHeight() + 'px';
        maskEle.style.width = Base.getViewWidth() + 'px';

        wrapperEle.style.top = (Base.getSize().h - Base.getSize(wrapperEle).h) / 2 + Base.getScrollTop() + "px";
        wrapperEle.style.left = (Base.getSize().w - Base.getSize(wrapperEle).w) / 2 + "px";

    };
    var _get_jsonp = function(cfg, callback) {
        var data = {
            authtoken: cfg.authtoken || '',
            type: cfg.type || '',
            jsonp: 1,
            apiver: 'v3',
            verifychannel: cfg.verifychannel || '',
            action: cfg.action,
            vcode: cfg.vcode || '',
            questionAndAnswer : cfg.questionAndAnswer || '',
            needsid: cfg.needsid || '',
            rsakey: cfg.rsakey || '',
            countrycode: (internationStatus == 1 && countrycode) ? countrycode : '',
            subpro: config.subpro,
            u: config.u,
            lstr: config.lstr,
            ltoken: config.ltoken,
            tpl: config.tpl,
            card_no: cfg.cardNo,
            cert_no: cfg.certNo,
            bind_mobile: cfg.bindMobile,
            true_name: cfg.trueName,
            channel_id: cfg.channel_id,
            callback_key: cfg.callback_key,
            secret: cfg.secret,
            winsdk: config.winsdk || '',
            authAction: cfg.authAction || ''
        };

        if (globalTraceId && globalTraceId.length > 0) {
            data.traceid = globalTraceId;
        }
        Request.jsonp(cfg.url, data, {
            charset: 'UTF-8',
            processData: function(data) {
                globalTraceId = data.traceid || '';
                callback && callback(data);
            }
        });
    };
    var _get_jsonp_question = function(cfg, callback) {
        Request.jsonp(cfg.url, {
            authtoken: cfg.authtoken || '',
            type: cfg.type || '',
            jsonp: 1,
            apiver: 'v3',
            verifychannel: cfg.verifychannel || '',
            action: cfg.action,
            vcode: cfg.vcode || '',
            needsid: cfg.needsid || '',
            rsakey: cfg.rsakey || '',
            subpro : config.subpro
        }, {
            charset: 'UTF-8',
            processData: function(data) {
                callback && callback(data);
            }
        });
    };
    var _get_channel = function(cfg, callback, on_retry) {
        var channel_id = '';

        if (self.current_app_type === 'qrcode') {
            channel_id = self.app.qrcode.channel_id;
        } else if (self.current_app_type === 'fast') {
            channel_id = cfg.channel_id || self.app.fast.channel_id;
        } else if (self.current_type === 'upsms') {
            channel_id = cfg.channel_id;
        }


        if (channel_id && self.longRequestStatus) {
            Request.jsonp(cfg.url || self.url_qrcode_channel, {
                channel_id: channel_id,
                apiver: 'v3',
                tt: new Date().getTime()
            }, {
                charset: 'UTF-8',
                processData: function(data) {
                    if (data.errno === 1) {//返回参数等于1，管道结束，未收到消息,则继续发消息
                        on_retry && on_retry(data);
                        _get_channel(cfg, callback, on_retry);
                    } else {
                        callback && callback(data);
                    }

                }
            });
        }

    };
    var _get_api = function() {
        var _token = config.token;
        _get_jsonp({
            url: self.url_get_api,
            action: "getapi",
            authtoken: _token,
            winsdk: config.winsdk
        }, function(result) {
            self.url_forgot = result.forgot + (config.winsdk?'&windowSdk=1':'');
            self.ppAuthName = result.ppAuthName || 'ppAuthName';
            // 这种情况服务端有坑，所以需要前端在判断一下
            if (self.ppAuthName === 'bindwidget') {
                self.ppAuthName = result.ppBindAction || 'ppBindAction';
            }
            // 当ppAuthName不能用，做的兼容逻辑
            if (result.ppNewAuthName) {
                self.ppAuthName = result.ppNewAuthName;
            }
            self.livinguname = result.ppEncryptuid || 'ppEncryptuid';
            if (result.errno === "110000") {
                if (result.countrycode) {
                    countrycode = result.countrycode;
                    internationStatus = 1;
                }
                var data = result.data || {};
                do {
                    if (data.original_mobile) {
                        self.auth_types.push(new AuthItem("original_mobile", data.original_mobile));
                        break;
                    }
                    if (data.original_email) {
                        self.auth_types.push(new AuthItem("original_email", data.original_email));
                        break;
                    }

                    if (data.softtoken === "1") {
                        self.auth_types.push(new AuthItem("softtoken", ""));
                    }

                    if (data.mobile) {
                        self.auth_types.push(new AuthItem("mobile", data.mobile));
                    }

                    if (data.email) {
                        self.auth_types.push(new AuthItem("email", data.email));
                        self.hasEmailForceverify = true ;
                    }

                    if (data.password === "1") {
                        self.auth_types.push(new AuthItem("password", ""));
                    }

                    if (data.question && Object.prototype.toString.call(data.question) === '[object Array]' && data.question.length>0) {
                        self.auth_types.push(new AuthItem("question", data.question));
                        self.hasQuestionForceverify = true ;
                    }

                    if (data.bank === '1') {
                        self.auth_types.push(new AuthItem('bank', data.cardlist[0].card_holder));
                        self.bankcardlist = data.cardlist;
                        if (data.newcard === '1') {
                            self.newcard = '1';
                        }
                    } else if (data.newcard === '1') {
                        self.auth_types.push(new AuthItem('newcard', ''));
                    }

                    if (data.face === '1') {
                        self.auth_types.push(new AuthItem('face', data.uname));
                    }

                    if (config.is_junior_cert) {
                        self.auth_types.push(new AuthItem('face', config.true_name));
                    }
                    self.verifymobile = undefined;
                    if (data.verifymobile) {
                        self.verifymobile = 1;
                    }
                } while (false);
            } else {
                self.onGetapiError(self, result);
            }
            /* if (config.testtest === '1') {
                self.auth_types.push(new AuthItem('bank', '*文文'));
                self.bankcardlist = [{'bank_name': '招商银行', 'card_no': '1231', 'bank_type': '信用卡'},
                    {'bank_name': '建设银行', 'card_no': '2323', 'bank_type': '储蓄卡'}];
                self.auth_types.push(new AuthItem('face', '*文文'));
            }*/

            if (self.auth_types.length > 0 || self.def_html) {
                self.show = function() {
                    show("mask");
                    show("wrapper");
                    _center();
                    Base.browser.ie < 7 && _position();
                    Base.on(W, 'resize', function() {
                        _center();
                    });

                    self.isShow = true;
                };

                if (!is_in_authtypes(self.current_type)) {
                    self.current_type = self.auth_types.length > 0 ? self.auth_types[0].name : null;
                }

            } else {
                self.show = function() {
                    self.onGetapiError(self, result);
                };
            }

            if (diaVerify) {
                diaVerify.show = self.show;
            }

            _render_layout(_render);//渲染弹层
        });
    };
    var logPass = function (urlData, autoStatisticObj) {
        var link = document.location.protocol + '//nsclick.baidu.com/v.gif?pid=111&v=' + new Date().getTime();
        var autoStatistic = '';
        for (var i in autoStatisticObj) {
            autoStatistic = autoStatistic + i + ':' + autoStatisticObj[i] + ',';
        }
        autoStatistic = base64encode('{' + autoStatistic.substring(0, autoStatistic.length - 1) + '}');
        var urlDataParams = '&page=' + urlData.page + '&source=' + urlData.source + '&tpl='
         + urlData.tpl + '&auto_statistic=' + autoStatistic + '&livinguname=' + (urlData.livinguname || '') + '&en=' + autoStatisticObj.eventType;
        link += urlDataParams;
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
    };
    var _render_qrcode = function() {
        var _token = config.token;
        _get_jsonp({
            url: self.url_send,
            type: 'qrcode',
            action: "send",
            authtoken: _token
        }, function(result) {
            if (result.errno === "110000") {
                self.app.qrcode = {
                    bdstoken: result.bdstoken,
                    verifytoken: result.verifytoken,
                    channel_id: result.channel_id
                };
                self.getElement('qrcode_img').src = self.url_qrcode + '&bdstoken=' + self.app.qrcode.bdstoken
                + '&verifytoken=' + self.app.qrcode.verifytoken + '&tpl=' + config.tpl;
            } else {
                hide("qrcode_img");
                self.getElement('forceverify_error').innerHTML = result.msg;
            }

        });
    };
    var _check_qrcode = function() {
        self.app.qrcode.status = true;
        _get_channel({
            url: self.url_qrcode_channel,
            channel_id: self.app.qrcode.channel_id
        }, function(result) {
            if (result.errno === 0) {
                if (result.channel_v === "2") {
                    _get_jsonp({
                        url: self.url_send,
                        verifychannel: self.app.qrcode.channel_id,
                        authtoken: config.token,
                        type: 'qrcode',
                        action: 'check'
                    }, function(data) {
                        if (data.errno === '110000') {
                            _verify_success(data);
                        } else {
                            _app_verify_denied(data);
                        }

                    });
                } else {
                    result.msg = '您拒绝了本次安全验证';
                    _app_verify_denied(result);
                }

            }

        });
    };
    var _get_onekey = function() {
        //第一步，获取一步验证token
        var _token = config.token;
        _get_jsonp({
            url: self.url_send,
            type: 'onekey',
            action: "send",
            authtoken: _token
        }, _render_onekey);
    };
    var _render_onekey = function(result) {
        //第二步，检测用户是否准备好了进行一键验证
        if (result.errno === '110000') {
            self.app.fast = {
                bdstoken: result.bdstoken,
                verifytoken: result.verifytoken,
                channel_id: result.channel_id,
                readychannel_id: result.readychannel_id,
                pushchannel_id: result.pushchannel_id
            };
            _get_channel({
                "url": self.url_onekey_channel,
                "channel_id": self.app.fast.readychannel_id
            }, function(result) {
                // skiped ready channel
            });
            _check_onekey();
        } else {
            hide("fast_msg");
            self.getElement('forceverify_error').innerHTML = result.msg;
        }

    };
    var _check_onekey = function() {
        //第三部，呈递verifytoken到APP端
        Request.jsonp(self.url_onekey_push, {
            bdstoken: self.app.fast.bdstoken,
            channel_id: self.app.fast.pushchannel_id,
            verifytoken: self.app.fast.verifytoken,
            tpl: config.tpl
        }, {
            charset: 'UTF-8',
            processData: function(data) {
                if (data.errno === "0") {
                    _get_channel({
                        // 长链接验证用户是否已确认了一键验证
                        url: self.url_onekey_channel,
                        channel_id: self.app.fast.channel_id
                    }, function(result) {
                        if (result.errno === 0 && result.channel_v === "2") {
                            result.errno = "110000";
                            _check_onekey_status(result);
                        } else if (result.errno === 0 && result.channel_v === "3") {
                            _app_verify_denied({msg: '您拒绝了本次安全验证'});
                        } else {
                            hide("fast_msg");
                            self.getElement('forceverify_error').innerHTML = "获取验证信息失败，请稍后再试";
                        }

                    });
                } else {
                    hide("fast_msg");
                    self.getElement('forceverify_error').innerHTML = "获取验证信息失败，请稍后再试";
                }

            }
        });
    };
    var _check_onekey_status = function() {
        //第四步，检测用户是否同意进行一键验证
        _get_jsonp({
            url: self.url_send,
            verifychannel: self.app.fast.channel_id,
            authtoken: config.token,
            type: 'onekey',
            action: "check"
        }, function(result) {
            if (result.errno === "110000") {
                _verify_success(result);
            } else {
                _app_verify_denied(result);
            }


        });
    };


    var _get_upsms = function() {
        _get_jsonp({
            url: self.url_send,
            type: 'upsms',
            action: "send",
            authtoken: config.token
        }, function(result) {
            /**
             * "upsmsqrcode_token":'',
             * "upsmsqrcode_vcode":'',
             * "upsmschannel_id":''
             */
            if (result.errno === '110000') {
                var qrcode = self.getElement('upsms_qrcode');
                var img = ["<img src=\"", self.url_qrcode,
                    "&bdstoken=", result.upsmsqrcode_token,
                    "&vcode=", result.upsmsqrcode_vcode,
                    "&channel=", result.upsmschannel_id,
                    "\" />"
                ].join("");

                if (qrcode.innerHTML.indexOf("img") === -1) {
                    qrcode.innerHTML = img;
                }
                self.getElement("upsms_vcode").innerHTML = result.upsmsqrcode_vcode;

                _get_channel({
                    url: self.url_upsms_channel,
                    channel_id: result.upsmschannel_id
                }, function(result) {
                    if (result.errno === 0) {
                        _check_upsms();
                    } else {
                        self.getElement('forceverify_error').innerHTML = "获取验证信息失败，请稍后再试";
                    }
                }, function() {
                    var timer = 10;
                    if (!self.is_show_upsms_error) {
                        self.getElement('forceverify_error').innerHTML = ["尚未接收到您的短信，请重新发送(", timer, ")"].join("");
                    }


                    var err_counter = window.setInterval(function() {
                        timer--;
                        if (self.is_show_upsms_error) {
                            window.clearInterval(err_counter);
                            return;
                        }
                        if (timer <= 0) {
                            self.getElement('forceverify_error').innerHTML = "";
                            window.clearInterval(err_counter);
                        } else {
                            self.getElement('forceverify_error').innerHTML = ["尚未接收到您的短信，请重新发送(", timer, ")"].join("");
                        }
                    }, 1000);
                });
            } else {
                self.getElement('forceverify_error').innerHTML = result.msg;
            }

        });
    };

    var _check_upsms = function() {
        _get_jsonp({
            url: self.url_submit,
            type: self.current_type,
            action: "check",
            authtoken: config.token
        }, function(result) {
            if (result.errno === "110000") {
                _verify_success(result);
            } else if (result.errno === '62004') {
                self.onSubmitFailure(self, result);
                var timer = 5;
                /* eslint-disable fecs-camelcase */
                self.is_show_upsms_error = true;
                self.getElement('forceverify_error').innerHTML = ['短信内容错误，请重新发送(', timer, ')'].join('');

                var err_counter = window.setInterval(function () {
                    timer--;
                    if (timer <= 0) {
                        /* eslint-disable fecs-camelcase */
                        self.is_show_upsms_error = false;
                        self.getElement('forceverify_error').innerHTML = '';
                        window.clearInterval(err_counter);
                    } else {
                        self.getElement('forceverify_error').innerHTML = ['短信内容错误，请重新发送(', timer, ')'].join('');
                    }
                }, 1000);
                _get_upsms();
            } else {
                self.onSubmitFailure(self, result);
                self.getElement('forceverify_error').innerHTML = result.msg;
            }

        });
    };
    var _submit_vcode = function() {
        /* eslint-disable fecs-camelcase */
        var _token = config.token;
        var vcode = '';
        /* eslint-disable fecs-camelcase */
        var is_password = false;

        if (self.current_type === 'password') {
            vcode = self.getElement('input_password').value;
            is_password = true;
        } else if (self.current_type === 'softtoken') {
            vcode = self.getElement('input_softtoken').value;
        } else if (self.current_type === 'original_email') {
            vcode = self.getElement('input_original_email').value;
            self.getElement('submit_original_email').disabled = true;
            Base.addClass(self.getElement('submit_original_email'), 'forceverify-button-disable');
        } else if (self.current_type === 'original_mobile') {
            vcode = self.getElement('input_original_mobile').value;
            self.getElement('submit_original_mobile').disabled = true;
            Base.addClass(self.getElement('submit_original_mobile'), 'forceverify-button-disable');
        } else {
            vcode = self.getElement('input_vcode').value;
        }

        if (is_password) {
            Request.jsonp(self.url_get_public_key, {
            }, {
                charset: 'UTF-8',
                processData: function(cert) {
                    var rsa = new passport.lib.RSA();
                    rsa.setKey(cert.pubkey);
                    vcode = rsa.encrypt(vcode);
                    _get_jsonp({
                        url: self.url_submit,
                        type: self.current_type,
                        action: "check",
                        authtoken: _token,
                        vcode: vcode,
                        rsakey: cert.key
                    }, _check_submit);
                }
            });

        }else if(self.current_type === 'question'){
            var queId1 = get_by_id("question_qid_1").attributes["data-questionid"].value,
                queId2 = get_by_id("question_qid_2").attributes["data-questionid"].value,
                queId3 = get_by_id("question_qid_3").attributes["data-questionid"].value,
                anw1 = get_by_id("input_question_1").value,
                anw2 = get_by_id("input_question_2").value,
                anw3 = get_by_id("input_question_3").value,
                vcodeStr = '{"'+queId1+'":"'+anw1+'","'+queId2+'":"'+anw2+'","'+queId3+'":"'+anw3+'"}';
            _get_jsonp_question({
                url: self.url_submit,
                type: self.current_type,
                action: "check",
                authtoken: _token,
                needsid: self.needsid,
                vcode: vcodeStr
            }, _check_submit);
        } else if(self.current_type === 'email' && config.emailAndQuestion && self.hasQuestionForceverify){
            var queId1 = get_by_id("emailquestion_qid_1").attributes["data-emailquestionid"].value,
                queId2 = get_by_id("emailquestion_qid_2").attributes["data-emailquestionid"].value,
                queId3 = get_by_id("emailquestion_qid_3").attributes["data-emailquestionid"].value,
                anw1 = get_by_id("input_emailquestion_1").value,
                anw2 = get_by_id("input_emailquestion_2").value,
                anw3 = get_by_id("input_emailquestion_3").value,
                questionAndAnswer = '{"'+queId1+'":"'+anw1+'","'+queId2+'":"'+anw2+'","'+queId3+'":"'+anw3+'"}';
            _get_jsonp({
                url: self.url_submit,
                type: self.current_type,
                action: "check",
                countrycode: (self.current_type == 'original_mobile' && internationStatus == 1) ? countrycode : '',
                authtoken: _token,
                vcode: vcode,
                questionAndAnswer: questionAndAnswer,
                needsid: self.needsid
            }, _check_submit);
        }else {
            var sendType = self.current_type;
            if (self.bankstep === 'mobile') {
                sendType = 'bankcard';
            } else if (self.current_type !== 'email' && self.verifymobile === 1) {
                sendType = 'verifymobile';
            }
            _get_jsonp({
                url: self.url_submit,
                type: sendType,
                action: "check",
                authtoken: _token,
                vcode: vcode,
                needsid: self.needsid,
                secret: self.secret ? self.secret : ''
            }, _check_submit);
        }


        /*_buttonSubmit({errno:0,msg:'失败'});*/
    };
    var _submit_bank = function() {
        self.getElement('submit_bank').disabled = true;
        Base.addClass(self.getElement('submit_bank'), 'forceverify-button-disable');
        var token = config.token;
        var cardNo = self.getElement('input_card').value;
        var certNo = self.getElement('input_idcard').value;
        var bindMobile = self.getElement('input_bankphone').value;
        var truename = self.getElement('input_cardname').value;
        var error = get_by_id('forceverify_error');
        _get_jsonp({
            url: self.url_submit,
            type: 'bankcard',
            action: "check",
            authtoken: token,
            cardNo: cardNo,
            certNo: certNo,
            bindMobile: bindMobile,
            trueName: truename
        }, function (result) {
            if (result.errno === "110000") {
                if (result.secret) {
                    // 需要验证银行卡手机号
                    self.bankmobile = bindMobile;
                    self.secret = result.secret;
                    hide('content_type_contain');
                    show('content_send_mobile');
                    show('content_vcode');
                    hide('content_bank');
                    self.getElement('bankVerify').innerHTML = '发送验证码短信到' + self.bankmobile;
                    show('bankVerify');
                    show('content_submit');
                    self.bankstep = 'mobile';
                } else {
                    _verify_success(result);
                }
            } else {
                var msg = result.msg;
                self.onSubmitFailure(self, result);
                error.innerHTML = msg;
                self.getElement('submit_bank').disabled = '';
                Base.removeClass(self.getElement('submit_bank'), 'forceverify-button-disable');
            }
        });
    };

    /* globals passport */
    var setChannel = function () {
        classHide('Qrcode-status-con');
        show('QrcodeMain');
        var error = get_by_id('forceverify_error');
        passport.spareWData = passport.spareWData || {};
        _get_jsonp({
            url: reqDomain['https:'] + '/v3/ucenter/main/livingcertgetqrcode?lp=pc'
            + (config.aim === 'cancleRealname' ? '&from=certcancle' : '') + '&v=' + new Date().getTime(),
            apiver: 'v3',
            tt: new Date().getTime()
        }, function (args) {
            if (args.imgurl) {
                passport.spareWData.channelimg = args.imgurl;
                passport.spareWData.sign = args.sign;
                var img = get_by_id('qrcodeImg');
                img.src = passport.spareWData.channelimg;
                createChannel();
            } else {
                clearInterval(passport.spareWData.timer);
                classHide('Qrcode-status-con');
                classShow('refresh-title');
                show('QrcodeRefresh');
            }
        });
    };

    var createChannel = function () {
        var sign;
        passport.spareWData = passport.spareWData || {};
        sign = passport.spareWData.sign;
        _get_jsonp({
            url: reqDomain['https:'] + '/channel/unicast?v=' + new Date().getTime(),
            apiver: 'v3',
            channel_id: passport.spareWData.sign,
            tt: new Date().getTime()
        }, function (d) {
            if (d.channel_v) {
                try {
                    d.channel_v = eval('(' + d.channel_v + ')');
                } catch (e) {
                    d.channel_v = {};
                }
            } else {
                d.channel_v = {};
            }

            if (d.errno === 0 && d.channel_v.status === 0) {
                clearInterval(passport.spareWData.timer);
                if (d.channel_v.u) {
                    d.channel_v.u = decodeURIComponent(d.channel_v.u);
                }
                if (config.aim === 'cancleRealname') {
                    _verify_success(d.channel_v);
                    // 进入活体验证的人数打点
                    var urlData = {
                        'page': 'forceverify_core',
                        'source': config.winsdk === 1 ? 'winsdk' : 'pc',
                        'tpl': config.tpl || ''
                    };
                    var autoStatisticObj = {
                        'eventType': 'passFaceidcardVertify'
                    };
                    logPass(urlData, autoStatisticObj);
                } else {
                    _submit_face(d.channel_v.key);
                }
            } else if (d.errno === 0 && d.channel_v.status === 1) {
                // 扫码成功
                classHide('Qrcode-status-con');
                show('QrcodeSuccess');
                if (sign === passport.spareWData.sign) {
                    createChannel();
                }
                // 进入活体验证的人数打点
                var urlData = {
                    'page': 'forceverify_core',
                    'source': config.winsdk === 1 ? 'winsdk' : 'pc',
                    'tpl': config.tpl || ''
                };
                var autoStatisticObj = {
                    'eventType': 'enterFaceidcardVertify'
                };
                logPass(urlData, autoStatisticObj);
            } else if (d.errno === 0 && d.channel_v.status === 2) {
                // 二维码过期
                clearInterval(passport.spareWData.timer);
                classHide('Qrcode-status-con');
                classShow('refresh-title');
                show('QrcodeRefresh');
            } else if (sign === passport.spareWData.sign) {
                createChannel();
            }
        });
    };

    var actionQrcode = function () {
        var me = this;
        passport.spareWData = passport.spareWData || {}
        setChannel();
        passport.spareWData.timer = setInterval(function () {
            setChannel();
        }, 5 * 60 * 1000);
    };

    var refreshQrcode = function () {
        // 点击刷新二维码
        var qrcodeImg = get_by_id(qrcodeImg);
        if (qrcodeImg) {
            qrcodeImg.src = reqDomain['https:'] + '/passApi/img/loading.gif';
        }
        setChannel();
        passport.spareWData.timer = setInterval(function () {
            setChannel();
        }, 5 * 60 * 1000);
    };

    var setqrcodeEvent = function () {
        Base.on(get_by_id('QrcodeRefreshBtn'), 'click', function () {
            refreshQrcode();
        });
    };
    var SBCtoDBC = function (str) {
        var result = '';
        if (str) {
            var len = str.length;
            for (var i = 0; i < len; i ++) {
                var cCode = str.charCodeAt(i);
                // 全角与半角相差（除空格外）：65248（十进制）
                cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode;
                // 处理空格
                cCode = (cCode == 0x03000) ? 0x0020 : cCode;
                result += String.fromCharCode(cCode);
            }
            return result;
        }
    };
    var _submit_face = function (key) {
        self.getElement('submit_face').disabled = true;
        Base.addClass(self.getElement('submit_face'), 'forceverify-button-disable');
        var token = config.token;
        var trueName = SBCtoDBC(self.getElement('input_truename').value);
        var certNo = self.getElement('input_faceidcard').value;
        key = key || '';
        var error = get_by_id('forceverify_error');
        _get_jsonp({
            url: self.url_submit,
            type: config.is_junior_cert ? 'idcard' : 'facematch',
            action: 'check',
            authtoken: token,
            trueName: trueName,
            certNo: certNo,
            callback_key: key
        }, function (result) {
            if (result.errno === '110000') {
                if (config.is_junior_cert) {
                    result.idcardAuthsid = result.authsid;
                    _verify_success(result);
                } else if (key) {
                    _verify_success(result);
                } else {
                    show('content_face_block2');
                    hide('content_face_block1');
                    actionQrcode();
                    setqrcodeEvent();
                    error.innerHTML = '';
                }
            } else {
                var msg = result.msg;
                self.onSubmitFailure(self, result);
                error.innerHTML = msg;
                self.getElement('submit_face').disabled = '';
                Base.removeClass(self.getElement('submit_face'), 'forceverify-button-disable');
            }
        });
    };


    var _get_submit_btn = function() {
        var btn = null;
        if (self.current_type === "password") {
            btn = get_by_id('submit_password');
        } else if (self.current_type === "softtoken") {
            btn = get_by_id('submit_softtoken');
        } else if (self.current_type === "original_email") {
            btn = get_by_id('submit_original_email');
        } else if (self.current_type === "original_mobile") {
            btn = get_by_id('submit_original_mobile');
        } else if (self.current_type === "question") {
            btn = get_by_id('submit_question');
        } else if (self.current_type === 'bank') {
            btn = get_by_id('submit_bank');
        } else if (self.current_type === 'face' || config.is_junior_cert == 1) {
            btn = get_by_id('submit_face');
        } else {
            btn = get_by_id('button_submit');
        }
        return btn;
    };
    var _get_submit_error = function() {
        var error = null;
        error = get_by_id('forceverify_error');
        return error;
    };
    var _check_submit = function(result) {
        var input, error, submit_error;
        error = self.getElement('forceverify_error')
        if (self.current_type === "password") {
            input = self.getElement('input_password');
        } else if (self.current_type === "softtoken") {
            input = self.getElement('input_softtoken');
        } else if (self.current_type === "original_email") {
            input = self.getElement('input_original_email');
        } else if (self.current_type === "original_mobile") {
            input = self.getElement('input_original_mobile');
        } else {
            input = self.getElement('input_vcode');
        }

        if (result.errno === "110000") {
            if (config.aim === 'cancleRealname' && config.is_junior_cert) {
                self.smsVertifyAuthsid = result.authsid;
                config.token = config.idcardtoken;
                show('content_face');
                hide('content_vcode');
                hide('content_send_mobile');
                hide('content_submit');
                hide('forceverify_mobile_tip_text');
                // 进入身份证填写页的人数
                var urlData = {
                    'page': 'forceverify_core',
                    'source': 'pc',
                    'tpl': config.tpl || ''
                };
                var autoStatisticObj = {
                    'eventType': 'enterIdcardVertify'
                };
                logPass(urlData, autoStatisticObj);
            } else if (config.aim === 'cancleRealname' && self.current_type !== 'againqrcode'
             && !config.is_junior_cert) {
                self.current_type = 'againqrcode';
                self.authsid = result.authsid;
                self.getElement('content').style.display = 'none';
                self.getElement('again_face').style.display = 'block';
                actionQrcode();
                setqrcodeEvent();
            } else {
                _verify_success(result);
            }
            if(self.current_type === "original_mobile"){
                self.getElement('submit_original_mobile').disabled = '';
                Base.removeClass(self.getElement('submit_original_mobile'), 'forceverify-button-disable');
            }else if(self.current_type === "original_email"){
                self.getElement('submit_original_email').disabled = '';
                Base.removeClass(self.getElement('submit_original_email'), 'forceverify-button-disable');
            }
        } else {
            var msg = result.msg;
            if (self.current_type === "mobile") {
                if (result.errno === "62003" || result.errno === "62006") {
                    show("udlr");
                }
            }
            if (self.current_type === "original_email") {
                if (result.errno === "62004") {
                    msg = "邮箱输入错误";
                }

                if (result.errno === "62006") {
                    error = _get_submit_error();
                }
            }

            if (self.current_type === "original_mobile") {
                if (result.errno === "62004") {
                    msg = "手机号输入错误";
                }
                if (result.errno === "62006") {
                    error = _get_submit_error();
                }
            }


                self.onSubmitFailure(self, result);
                error.innerHTML = msg;
                if(self.current_type !== "question"){
                    Base.addClass(input, 'forceverify-input-error');
                }
                if(self.current_type === "original_mobile"){
                    self.getElement('submit_original_mobile').disabled = '';
                    Base.removeClass(self.getElement('submit_original_mobile'), 'forceverify-button-disable');
                }else if(self.current_type === "original_email"){
                    self.getElement('submit_original_email').disabled = '';
                    Base.removeClass(self.getElement('submit_original_email'), 'forceverify-button-disable');
                }

            }

    };
    var _app_verify_denied = function(result) {
        self.getElement("app_fail").style.display = 'block';
        if (result && result.msg) {
            self.getElement('app_fail_msg').innerHTML = result.msg;
        }

    };
    var _verify_success = function(result) {
        if (self.authsid) {
            result.authsid = self.authsid;
        }
        if (self.smsVertifyAuthsid) {
            result.smsVertifyAuthsid = self.smsVertifyAuthsid;
        }
        self.onForceverifySuccess(self,result);
        if (self.isShow && self.onSubmitSuccess(self, result) !== false) {
            self.hide();
        }

    };

    var _get_email_url = function(email) {
        var suffix = email.substr(email.indexOf("@") + 1);
        suffix = suffix.replace(new RegExp("[.]", "g"), "_");
        var urls = {
            "tom_com": "http://mail.tom.com/",
            "163_com": "http://mail.163.com/",
            "qq_com": "http://mail.qq.com/",
            "gmail_com": "https://mail.google.com",
            "yahoo_com_cn": "http://cn.yahoo.com/",
            "yahoo_com": "http://login.yahoo.com/",
            "sohu_com": "http://mail.sohu.com/",
            "sina_com": "http://mail.sina.com/",
            "sina_com_cn": "http://mail.sina.com.cn/",
            "hotmail_com": "https://login.live.com",
            "msn_com": "https://login.live.com",
            "live_cn": "https://login.live.com",
            "live_com": "https://login.live.com",
            "126_com": "http://126.com/",
            "foxmail_com": "http://mail.foxmail.com/",
            "yeah_net": "http://yeah.net/",
            "139_com": "http://mail.10086.cn/",
            "189_cn": "http://webmail11.189.cn/webmail/",
            "21cn_com": "http://mail.21cn.com/",
            "263_net": "http://mail.263.net/",
            "wo_com_cn": "http://mail.wo.com.cn/mail/login.action"
        };

        if (urls[suffix]) {
            return urls[suffix];
        }
        return false;

    };

    var _send_verify = function() {
        var _token = config.token,
                buttonEle = self.getElement('button_send_' + self.current_type);
        if (self.bankstep === 'mobile') {
            buttonEle = self.getElement('button_send_mobile');
        }
        Base.unon(buttonEle, 'click', _send_verify);
        buttonEle.value = "正在发送";
        Base.addClass(buttonEle, "forceverify-button-sent");
        var sendType = self.current_type;
        if (self.bankstep === 'mobile') {
            sendType = 'bankcard';
        } else if (sendType !== 'email' && self.verifymobile === 1) {
            sendType = 'verifymobile';
        }
        _get_jsonp({
            url: self.url_send,
            type: sendType,
            action: "send",
            authtoken: _token,
            secret: self.secret,
            authAction: config.authAction || ''
        }, function(result) {
            if (result.errno === "110000") {
                self.onSendvcodeSuccess(self);
                do {
                    if (self.current_type === "mobile") {
                        self.getElement('forceverify_error').innerHTML = '<span style="color:#333333">发送成功，</span><a class="switch_upsms" title="始终接收不到验证码短信？">收不到验证短信怎么办？</a>';
                        break;
                    }
                    if (self.current_type === "email") {
                        var email_url = _get_email_url(get_item().value);
                        if (email_url) {
                            self.getElement('forceverify_error').innerHTML = ['<span style="color:#333333">发送成功，</span><a class="email_url" href="', email_url, '" title="进入邮箱" target="_blank">立即进入邮箱</a>'].join("");
                            break;
                        }
                    }
                    self.getElement('forceverify_error').innerHTML = '<span style="color:#333333">发送成功</span>';
                } while (0);


                var times = 60;
                buttonEle.value = "重新发送(60)";
                var countDown = setInterval(function() {
                    times--;
                    buttonEle.value = "重新发送(" + times + ")";
                    if (times === 0) {
                        clearInterval(countDown);
                        buttonEle.value = "重新发送";
                        if(self.getElement('forceverify_error')){
                            self.getElement('forceverify_error').innerHTML = '';
                        }
                        Base.removeClass(buttonEle, "forceverify-button-sent");
                        Base.on(buttonEle, 'click', _send_verify);
                    }

                }, 1000);
            } else if (result.errno === '62003' && self.current_type === 'mobile') {
                buttonEle.value = '重新发送';
                if (self.getElement('forceverify_error')) {
                    self.getElement('forceverify_error').innerHTML = '发送次数过多，<a class="switch_upsms" >点此解决</a>';
                }
            } else if (result.errno === '100014') {
                if (self.getElement('forceverify_error')) {
                    self.getElement('forceverify_error').innerHTML = result.msg;
                }
                var times = 60;
                buttonEle.value = '重新发送(60)';
                var countDown = setInterval(function () {
                    times --;
                    buttonEle.value = '重新发送(' + times + ')';
                    if (times === 0) {
                        clearInterval(countDown);
                        buttonEle.value = '重新发送';
                        if (self.getElement('forceverify_error')) {
                            self.getElement('forceverify_error').innerHTML = '';
                        }
                        Base.removeClass(buttonEle, 'forceverify-button-sent');
                        Base.on(buttonEle, 'click', _send_verify);
                    }

                }, 1000);
            } else {
                if (self.getElement('forceverify_error')) {
                    self.getElement('forceverify_error').innerHTML = result.msg;
                }
                buttonEle.value = '重新发送';
                Base.removeClass(buttonEle, 'forceverify-button-sent');
                Base.on(buttonEle, 'click', _send_verify);
            }


        });
    };


    var _clear_errors = function() {
        var names = ["vcode", "softtoken", "password"];
        var error = self.getElement("forceverify_error");
        error.innerHTML = "";
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var input = self.getElement("input_" + name);
            input.value = "";
            Base.removeClass(input, "forceverify-input-error");
            show("input_label_" + name);
        }
    };

    var _check_empty = function(name) {
        var input = get_by_id("input_" + name);
        var error = get_by_id("forceverify_error");
        var value = input.value;
        if (value === "") {
            error.removeClass("forceverify-success");
            input.addClass("forceverify-input-error");
            error.html(self.texts[name === "vcode" ? self.current_type : name].empty);
            return false;
        }
        input.removeClass("forceverify-input-error");
        return true;
    };

        var _check_answer = function(str){
            var reg = /[\u4E00-\u9FA5\uf900-\ufa2d]/g;
            if(str){
                var len = str.replace(reg,"aa").length
                return len >= 2 && len <= 40 ;
            }
            return false ;
        }

        var _check_question = function(nameAry,name,error) {
            var len = nameAry.length;
            var input = [];
            /* eslint-disable fecs-camelcase */
            var _validateAll = true;
            for(var i=0;i<len;i++){
                input[i] = get_by_id("input_" + nameAry[i]);
                if(input[i].value === "" || !_check_answer(input[i].value)){
                    input[i].addClass("forceverify-input-error");
                    error.html(self.texts["question"].empty);
                    _validateAll = false;
                }else{
                    input[i].removeClass("forceverify-input-error");

                }
            }
            if(_validateAll){
                error.html("");
            }
            return _validateAll;
        };
        var checkArray = function (nameAry) {
            var len = nameAry.length;
            var input;
            var name;
            var error;
            for (var i = 0; i < len; i++) {
                name = nameAry[i];
                if (self.currentBankType === 'verify' && name === 'cardname') {
                    // 校验银行卡模式不需要校验姓名
                    continue;
                }
                input = get_by_id('input_' + name);
                error = get_by_id('forceverify_error');
                if (input.value === '') {
                    input.addClass("forceverify-input-error");
                    error.html(self.texts[self.current_type][name + 'empty']);
                    return false;
                } else if (!_check_format(name)) {
                    return false;
                }

            }
            return true;
        };

        var _check_format = function(name, is_no_notice, callback) {
            var input = get_by_id("input_" + name);
            var error = get_by_id("forceverify_error");
            var value = input.value;
            if (value === "") {
                error && error.removeClass("forceverify-success");
                input.removeClass("forceverify-input-error");
                return false;
            }

        if (name === "original_email") {
            if (!(/^[0-9a-zA-Z._-]+@([0-9a-zA-Z-]+\.)+[a-z]{2,4}$/.test(value))) {
                if (!is_no_notice) {
                    error.removeClass("forceverify-success");
                    input.addClass("forceverify-input-error");
                    error.html(self.texts[name].format);
                }
                return false;
            }
            if (callback) {
                callback.apply(self, name, input, value, error);
            } else {
                error.addClass("forceverify-success");
            }
        }

        if (name === "original_mobile") {
            if (!((internationStatus == 1 && !/^(\s*)$/.test(value)) || (internationStatus == 0 && /^1[3456789]\d{9}$/.test(value)))) {
                error.removeClass("forceverify-success");
                input.addClass("forceverify-input-error");
                error.html(self.texts[name].format);
                return false;
            }
            if (callback) {
                callback.apply(self, name, input, value, error);
            } else {
                error.addClass("forceverify-success");
            }
        }

            if (name === "vcode") {
                if (!(/^\d{6}$/.test(value))) {
                    input.addClass("forceverify-input-error");
                    error.html(self.texts[self.current_type].format);
                    return false;
                }
            }

            if(name === "question_1" || name === "question_2" || name === "question_3"){
                var errorQue = get_by_id("forceverify_error"),
                    que1 = get_by_id("input_question_1"),
                    que2 = get_by_id("input_question_2"),
                    que3 = get_by_id("input_question_3");
                if((que1.value !=="") && (que2.value !=="") && (que3.value !=="")){
                    errorQue.html('');
                }
            }
            if(name === "emailquestion_1" || name === "emailquestion_2" || name === "emailquestion_3"){
                var errorQue = get_by_id("forceverify_error"),
                    que1 = get_by_id("input_emailquestion_1"),
                    que2 = get_by_id("input_emailquestion_2"),
                    que3 = get_by_id("input_emailquestion_3");
                if((que1.value !=="") && (que2.value !=="") && (que3.value !=="")){
                    errorQue.html('');
                }
            }
        if (name === 'idcard' || name === 'faceidcard') {
            /* globals GB2260, IDValidator */
            var Validator = new IDValidator(GB2260);
            if (!Validator.isValid(value)) {
                error.removeClass("forceverify-success");
                input.addClass("forceverify-input-error");
                error.html(self.texts[self.current_type][name + 'format']);
                return false;
            }
        }
        if (name === 'bankphone') {
            if (!/^1[3456789]\d{9}$/.test(value)) {
                error.removeClass("forceverify-success");
                input.addClass("forceverify-input-error");
                error.html(self.texts[self.current_type].bankphoneformat);
                return false;
            }
        }
        input.removeClass("forceverify-input-error");
        return true;
    };

    var getCountryCode = function(callback){
        _get_jsonp({
            url: (window.location ? window.location.protocol.toLowerCase()
                    : document.location.protocol.toLowerCase())+'//passport.baidu.com/v2/?securitygetcountrycode'
        },function(rsp) {
            if(rsp.data.country.length > 0){
                initCountryCode(rsp.data.country);
            }
        })
    };

    var initCountryCode = function(data){
        var str = '<li class="clearfix" data-curr="">'
                    + '<span class="left forgot-code">+86</span>'
                    + '<span class="left font-code">大陆地区</span>'
              + '</li>';
        var handler = self.getElement('fi_content_select_handler');
        for(var i = 0, len = data.length; i < len; i++){
            var d = data[i];

            str += '<li class="clearfix" data-curr="'+d.code+'">'+
                        '<span class="left forgot-code">'+'+'+d.code.substring(2)+'</span>'+
                        '<span class="left font-code">'+d.name+'</span>'+
                    '</li>'
        }
        handler.innerHTML = str;
        internationInit = true;

        Base.on(self.getElement('fi_content_select_show'), 'click', function(evt) {
            var getSelect = self.getElement('fi_content_select_handler');
            if (getSelect && getSelect.style.display !== 'block') {
                getSelect.style.display = "block";
            } else if (getSelect) {
                getSelect.style.display = "none";
            }
            evt.stopPropagation();
        });
        if (self.getElement('fi_content_select_handler')) {
            var handlerHide = function(){
                self.getElement("fi_content_select_handler").style.display = "none";
            }

            Base.on(self.getElement('wrapper'), 'click', function(evt) {
                var target = Base.getTarget(evt);
                if (target.id !== self.id + "__fi_content_select_show") {
                    handlerHide()
                }

            });
            Base.on(self.getElement('mask'), 'click', function(evt) {
                handlerHide()
            });

            Base.on(self.getElement('fi_content_select_handler'), 'click', function(evt) {
                var target = Base.getTarget(evt);
                var curr = target.parentNode.attributes["data-curr"].value;
                countrycode = curr;
                if(countrycode) {
                    internationStatus = 1;
                } else {
                    internationStatus = 0;
                }
                self.getElement('fi_content_select_show').innerHTML = target.parentNode.firstChild.innerHTML;
                handlerHide()
            });
        }
    }

    var _render = function() {
        self.onRender(self);
        var mouPosi = {},
                wrapperEle = self.getElement('wrapper'),
                defauPosi = {},
                flag = false;
        if (Base.browser.ie < 7) {
            Base.on(W, 'scroll', function() {
                _position();
            });
        }

        if(!internationInit){
            getCountryCode();
        }

        Base.on(self.getElement('header_h3'), 'mousedown', function(evt) {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                window.event.returnValue = false;
            }

            mouPosi.x = Base.getMousePos(evt).x;
            mouPosi.y = Base.getMousePos(evt).y;
            defauPosi.l = parseInt(wrapperEle.style.left);
            defauPosi.t = parseInt(wrapperEle.style.top);
            flag = true;
        });
        Base.on(B, 'mousemove', function(evt) {
            if (flag) {
                wrapperEle.style.left = (defauPosi.l - mouPosi.x + Base.getMousePos(evt).x) + "px";
                wrapperEle.style.top = (defauPosi.t - mouPosi.y + Base.getMousePos(evt).y) + "px";
            }

        });
        Base.on(B, 'mouseup', function(evt) {
            flag = false;
        });
        Base.on(self.getElement('header_a'), 'click', function() {
            self.hide();
            if (passport.spareWData && passport.spareWData.timer) {
                clearInterval(passport.spareWData.timer);
            }
        });

        Base.on(self.getElement('content_select_show'), 'click', function(evt) {
            var getSelect = self.getElement("content_select_handler");
            var arrow = self.getElement("select_show_arrow");
            if (getSelect && getSelect.style.display !== 'block') {
                getSelect.style.display = "block";
                Base.removeClass(arrow, "select-show-arrow");
                Base.addClass(arrow, "select-show-arrow-up");
            } else if (getSelect) {
                getSelect.style.display = "none";
                Base.removeClass(arrow, "select-show-arrow-up");
                Base.addClass(arrow, "select-show-arrow");
            }

        });

        Base.on(self.getElement('content_type_select'), 'mouseover', function(evt) {
            Base.addClass(self.getElement('content_type_select'), "content-type-select-hover");
        });
        Base.on(self.getElement('content_type_select'), 'mouseout', function(evt) {
            Base.removeClass(self.getElement('content_type_select'), "content-type-select-hover");
        });
        if (self.getElement('content_select_handler')) {
            Base.on(self.getElement('wrapper'), 'click', function(evt) {
                var target = Base.getTarget(evt);
                if (target.id !== self._ids + "__content_select_show"
                        && target.id !== self._ids + "__content_select_uname"
                        && target.id !== self._ids + "__select_show_arrow"
                        && target.id !== self._ids + "__select_show_other"
                        ) {

                    hide("content_select_handler");
                    var arrow = self.getElement("select_show_arrow");

                    if(!arrow){return}

                    Base.removeClass(arrow, "select-show-arrow-up");
                    Base.addClass(arrow, "select-show-arrow");
                }

            });
            Base.on(self.getElement('mask'), 'click', function(evt) {
                hide("content_select_handler");
                var arrow = self.getElement("select_show_arrow");
                Base.removeClass(arrow, 'select-show-arrow-up');
                Base.addClass(arrow, 'select-show-arrow');
            });

            if (is_in_authtypes('bank')) {
                Base.on(self.getElement('bankChange'), 'click', function(evt) {
                    if (get_by_id('selectList').style.display === 'block') {
                        hide('selectList');
                        self.getElement('bankChange').innerHTML = '更换';
                    } else {
                        show('selectList');
                        self.getElement('bankChange').innerHTML = '收起';
                    }
                });
                Base.arrayOn(document.getElementsByClassName('bank-li'), 'click', function (e) {
                    hide('selectList');
                    var target = Base.getTarget(e);
                    while (!/passapi-select-list/.test(target.className) && target.parentNode) {
                        target = target.parentNode;
                    }
                    get_by_id('bank_display').innerHTML = target.getElementsByTagName('a')[0].innerHTML;
                    var bankCardno = target.getElementsByTagName('span')[0].innerHTML;
                    get_by_id('input_label_card').innerHTML = '填写尾号' + bankCardno + '的银行卡号';
                    self.getElement('bankChange').innerHTML = '更换';
                    if (self.currentBankno !== bankCardno) {
                        self.currentBankno = bankCardno;
                        self.getElement('input_card').value = '';
                        get_by_id('input_label_card').show();
                    }
                    hide('newcardName');
                    hide('newcardTip');
                    self.currentBankType = 'verify';
                });
                Base.on(self.getElement('verifynew'), 'click', function (e) {
                    hide('selectList');
                    get_by_id('bank_display').innerHTML = '验其他银行卡';
                    get_by_id('input_label_card').innerHTML = '填写持卡人银行卡号';
                    self.getElement('bankChange').innerHTML = '更换';
                    self.getElement('input_card').value = '';
                    get_by_id('input_label_card').show();
                    self.currentBankno = '';
                    // 显示姓名input
                    show('newcardName');
                    show('newcardTip');
                    self.currentBankType = 'addverify';
                    // 银行卡四项验证选择数
                    var urlData = {
                        'page': 'forceverify_core',
                        'source': config.winsdk === 1 ? 'winsdk' : 'pc',
                        'tpl': config.tpl || '',
                        'livinguname': self.livinguname
                    };
                    var autoStatisticObj = {
                        'eventType': 'pcapi-' + self.ppAuthName + '-newcard_click'
                    };
                    logPass(urlData, autoStatisticObj);
                });

            }

            Base.on(self.getElement('content_select_handler'), 'click', function(evt) {
                var target = Base.getTarget(evt);
                hide("content_select_handler");
                var arrow = self.getElement("select_show_arrow");
                Base.removeClass(arrow, 'select-show-arrow-up');
                Base.addClass(arrow, 'select-show-arrow');

                var curr = target.attributes["data-curr"].value;
                if (curr === "other") {
                    return true;
                }
                self.getElement('content_select_uname').innerHTML = target.innerHTML;
                self.current_type = curr;
                _clear_errors();

                    if (self.current_type === "softtoken") {
                        show("content_type_contain");
                        hide("content_send_email");
                        hide("content_emailquestion");
                        hide("content_send_mobile");
                        hide("content_vcode");
                        hide("content_submit");
                        hide('content_password');
                        hide('content_submit_password');
                        show("content_app");
                        hide("content_upsms");
                        hide("content_question");
                        hide("content_face");
                        hide("content_bank");
                        _render_qrcode();
                    } else if (self.current_type === "password") {
                        // return;
                        show('content_type_contain');
                        hide('content_send_email');
                        hide('content_emailquestion');
                        hide('content_send_mobile');
                        hide('content_vcode');
                        hide('content_submit');
                        hide('content_app');
                        hide('content_upsms');
                        show('content_password');
                        show('content_submit_password');
                        hide('content_face');
                        hide('content_bank');
                    }else if(self.current_type === "question"){
                        show("content_type_contain");
                        hide("content_send_email");
                        hide("content_emailquestion");
                        hide("content_send_mobile");
                        hide("content_vcode");
                        hide("content_submit");
                        hide("content_app");
                        hide("content_upsms");
                        hide('content_password');
                        hide('content_submit_password');
                        show("content_question");
                        hide("content_face");
                        hide("content_bank");
                    } else if (self.current_type === "bank"){
                        show("content_type_contain");
                        hide("content_send_email");
                        hide("content_emailquestion");
                        hide("content_send_mobile");
                        hide("content_vcode");
                        hide("content_submit");
                        hide('content_password');
                        hide('content_submit_password');
                        hide("content_app");
                        hide("content_upsms");
                        hide("content_question");
                        hide("content_face");
                        show("content_bank");
                    } else if (self.current_type === 'bank' || self.current_type === 'newcard') {
                        show('content_type_contain');
                        hide('content_send_email');
                        hide('content_emailquestion');
                        hide('content_send_mobile');
                        hide('content_vcode');
                        hide('content_submit');
                        hide('content_password');
                        hide('content_submit_password');
                        hide('content_app');
                        hide('content_upsms');
                        hide('content_question');
                        hide('content_face');
                        show('content_bank');
                        if (self.current_type === 'newcard') {
                            show('newcardName');
                            show('newcardTip');
                        } else {
                            hide('newcardName');
                            hide('newcardTip');
                        }
                    } else if (self.current_type === "face"){
                        show("content_type_contain");
                        hide("content_send_email");
                        hide("content_emailquestion");
                        hide("content_send_mobile");
                        hide("content_vcode");
                        hide("content_submit");
                        hide('content_password');
                        hide('content_submit_password');
                        hide("content_app");
                        hide("content_upsms");
                        hide("content_question");
                        show("content_face");
                        hide("content_bank");
                    } else {
                        show("content_type_contain");
                        hide("content_send_email");
                        hide("content_emailquestion");
                        hide("content_send_mobile");
                        hide('content_password');
                        hide('content_submit_password');
                        show('content_send_' + self.current_type);
                        show("content_vcode");
                        if(self.current_type === "email" && config.emailAndQuestion){
                            show("content_emailquestion");
                        }
                        show("content_submit");
                        hide("content_app");
                        hide("content_upsms");
                        hide("content_question");
                        hide("content_face");
                        hide("content_bank");
                    }

                if (self.getElement('forceverify_error').innerHTML !== '') {
                    self.getElement('forceverify_error').innerHTML = '请输入' + self.texts[self.current_type].tip;
                }

                self.getElement('input_label_vcode').innerHTML = self.texts[self.current_type].tip;
                // 用户选择数
                var urlData = {
                    'page': 'forceverify_core',
                    'source': config.winsdk === 1 ? 'winsdk' : 'pc',
                    'tpl': config.tpl || '',
                    'livinguname': self.livinguname
                };
                var newType = self.current_type;
                if (newType === 'mobile' && self.verifymobile) {
                    newType = 'verifymobile';
                }
                var autoStatisticObj = {
                    'eventType': 'pcapi-' + self.ppAuthName + '-' + newType + '_click'
                };
                logPass(urlData, autoStatisticObj);
            });
        }


        var suggest_email = function(input, error) {
            var submit = get_by_id("submit_original_email");
            var suffixes = [
                "http://passport.baidu.com/passApi/js/uni/qq.com", "http://passport.baidu.com/passApi/js/uni/163.com", "http://passport.baidu.com/passApi/js/uni/126.com", "http://passport.baidu.com/passApi/js/uni/sohu.com", "http://passport.baidu.com/passApi/js/uni/sina.com",
                "http://passport.baidu.com/passApi/js/uni/gmail.com", "http://passport.baidu.com/passApi/js/uni/21cn.com", "http://passport.baidu.com/passApi/js/uni/hotmail.com", "http://passport.baidu.com/passApi/js/uni/vip.qq.com", "http://passport.baidu.com/passApi/js/uni/yeah.net",
                "http://passport.baidu.com/passApi/js/uni/foxmail.com", "http://passport.baidu.com/passApi/js/uni/sina.cn", "http://passport.baidu.com/passApi/js/uni/yahoo.com.cn", "http://passport.baidu.com/passApi/js/uni/139.com", "http://passport.baidu.com/passApi/js/uni/yahoo.cn",
                "http://passport.baidu.com/passApi/js/uni/tom.com", "http://passport.baidu.com/passApi/js/uni/yahoo.com.tw", "http://passport.baidu.com/passApi/js/uni/live.cn", "http://passport.baidu.com/passApi/js/uni/hanmail.net", "http://passport.baidu.com/passApi/js/uni/189.cn",
                "http://passport.baidu.com/passApi/js/uni/yahoo.com", "http://passport.baidu.com/passApi/js/uni/nate.com", "http://passport.baidu.com/passApi/js/uni/aliyun.com", "http://passport.baidu.com/passApi/js/uni/yahoo.com.hk",
                "http://passport.baidu.com/passApi/js/uni/naver.com", "http://passport.baidu.com/passApi/js/uni/live.com", "http://passport.baidu.com/passApi/js/uni/msn.com", "http://passport.baidu.com/passApi/js/uni/outlook.com", "http://passport.baidu.com/passApi/js/uni/sogou.com",
                "http://passport.baidu.com/passApi/js/uni/sina.com.cn", "http://passport.baidu.com/passApi/js/uni/eyou.com", "http://passport.baidu.com/passApi/js/uni/vip.sina.com", "http://passport.baidu.com/passApi/js/uni/msn.cn", "http://passport.baidu.com/passApi/js/uni/me.com",
                "http://passport.baidu.com/passApi/js/uni/ymail.com", "http://passport.baidu.com/passApi/js/uni/wo.com.cn", "http://passport.baidu.com/passApi/js/uni/vip.163.com", "http://passport.baidu.com/passApi/js/uni/2980.com", "http://passport.baidu.com/passApi/js/uni/263.net",
                "http://passport.baidu.com/passApi/js/uni/kimo.com", "http://passport.baidu.com/passApi/js/uni/yahoo.co.jp"
            ];

            var create_option = function(value, first) {
                var li = document.createElement("li");
                li.className = "pass-item-suggsetion";

                if (first) {
                    li.style.display = "none";
                    li.className = [li.className, "pass-item-suggsetion_hover"].join(" ");
                }
                li.innerHTML = value;
                return li;
            };

            var update_input = function(li) {
                input.value = li.innerHTML.replace(/<[^>]+>/g, "");
            };

            var get_target = function(evt) {
                var el = Base.getTarget(evt);
                if (el.nodeName.toLowerCase() === "li") {
                    return el;
                } else {
                    return el.parentNode;
                }
            };

            var create_select = function(li_frag) {

                if (!self.sug_ul) {
                    self.sug_ul = document.createElement("ul");
                    self.sug_ul.id = get_id("sug_wrapper");
                    self.sug_ul = get_by_id(self.sug_ul);

                    if (input.insertAdjacentElement) {
                        input.insertAdjacentElement("afterEnd", self.sug_ul);
                    } else if (input.nextSibling) {
                        input.parentNode.insertBefore(self.sug_ul, input.nextSibling);
                    } else {
                        input.parentNode.appendChild(self.sug_ul);
                    }

                    self.sug_ul.addClass('pass-suggestion-list');
                    self.sug_ul.on("click", function(evt) {
                        update_input(get_target(evt));

                        self.sug_ul.hide();
                        submit.focus();
                        setTimeout(function() {
                            error.html("");
                        }, 100);
                    });
                }

                self.sug_ul.html("");
                self.sug_ul.style.display = "";
                self.sug_ul.appendChild(li_frag);
                var lis = self.sug_ul.getElementsByTagName("li");
                for (var i = 0; i < lis.length; i++) {
                    var li = get_by_id(lis[i]);
                    li.on("mouseover", function(evt) {
                        for (var j = 0; j < lis.length; j++) {
                            Base.removeClass(lis[j], "pass-item-suggsetion_hover");
                        }
                        Base.addClass(get_target(evt), "pass-item-suggsetion_hover");
                    });

                    li.on("mouseout", function() {
                        for (var j = 0; j < lis.length; j++) {
                            Base.removeClass(lis[j], "pass-item-suggsetion_hover");
                        }
                    });
                }


            };

            var KEYS = {
                UP: 38,
                DOWN: 40,
                ENTER: 13,
                TAB: 9,
                SPACE: 32
            };
            var EMAIL_PREFIX = /^([a-zA-Z0-9_.\-+]+)/;
            var EMAIL_SUFFIX = /@([a-zA-Z0-9\-_.]+)/;
            input.on("keyup", function(evt) {

                var frag = document.createDocumentFragment();
                var option = null;
                var opt_count = 0;
                var value = is_in_authtypes('original_email') && input.value;
                value = !!value ? value : "";
                var prefix_match = value.match(EMAIL_PREFIX);
                var suffix_match = value.match(EMAIL_SUFFIX);
                if (prefix_match) {

                    option = create_option(value, true);
                    frag.appendChild(option);


                    value = prefix_match[1];
                    if (!suffix_match) {
                        for (var i = 0, len = suffixes.length; i < len; i++) {
                            option = create_option([value, suffixes[i]].join("@"));
                            frag.appendChild(option);
                            opt_count++;
                            if (opt_count > 6) {
                                break;
                            }
                        }
                    } else {
                        for (var i = 0, len = suffixes.length; i < len; i++) {
                            var suffix = suffixes[i];
                            var ext = suffix_match[1];
                            if (suffix.indexOf(ext) > -1) {
                                ext = ext.replace(/\./g, '\\.');
                                suffix = suffix.replace(new RegExp(ext, "g"), "<b>$&</b>");
                                option = create_option([value, suffix].join("@"));
                                frag.appendChild(option);
                                opt_count++;
                                if (opt_count > 6) {
                                    break;
                                }
                            }
                        }
                    }
                }

                if (self.sug_ul && (evt.keyCode !== KEYS.UP && evt.keyCode !== KEYS.DOWN)) {
                    self.sug_ul.hide();
                }

                if (opt_count > 0) {
                    if (evt.keyCode !== KEYS.UP && evt.keyCode !== KEYS.DOWN) {
                        create_select(frag);
                    } else if ((evt.keyCode === KEYS.UP || evt.keyCode === KEYS.DOWN) && (self.sug_ul.style.display !== "none")) {
                        var opts = self.sug_ul.childNodes;
                        /* eslint-disable fecs-camelcase */
                        var opt_count = opts.length;
                        var pos = -1;
                        var index = 0;

                        for (var i = 0; i < opt_count; i++) {
                            if (opts[i].className.indexOf('pass-item-suggsetion_hover') > -1) {
                                pos = i;
                            }
                        }

                        if (evt.keyCode === KEYS.UP) {
                            index = pos === -1 ? (opt_count - 1) : (pos === 0 ? (opt_count - 1) : pos - 1);
                        }

                        if (evt.keyCode === KEYS.DOWN) {
                            index = pos === -1 ? 0 : (pos === opt_count - 1 ? 0 : pos + 1);
                        }
                        var lis = self.sug_ul.getElementsByTagName("li");
                        for (var i = 0; i < lis.length; i++) {
                            Base.removeClass(lis[i], "pass-item-suggsetion_hover");
                        }

                        Base.addClass(opts[index], "pass-item-suggsetion_hover");

                        update_input(opts[index]);
                    }
                }
            });

            input.on("keydown", function(evt) {
                if ((evt.keyCode === KEYS.ENTER || evt.keyCode === KEYS.TAB || evt.KeyCode === KEYS.SPACE) && (self.sug_ul && self.sug_ul.style.display !== "none")) {
                    self.sug_ul.hide();
                    submit.focus();
                    try {
                        evt.preventDefault();
                        evt.stopPropagation();
                    } catch (e) {
                        var downError = e;
                    }
                }
            });

            input.on("blur", function() {
                window.setTimeout(function() {
                    if (self.sug_ul) {
                        _check_format("original_email");
                        self.sug_ul.hide();
                    }
                }, 200);
            });
        };


        var bind_input = function(name) {
            var label = get_by_id("input_label_" + name);
            if (!label) {
                return;
            }

            var input = get_by_id("input_" + name);
            var error = get_by_id("forceverify_error");
            var submit_error = _get_submit_error();
            label.on("click", function(evt) {
                input.focus();
            });

            input.on("click", function(evt) {
                input.focus();
            });

            input.on("focus", function(evt) {
                input.addClass("forceverify-input-focus");
            });

            input.on("blur", function(evt) {
                input.removeClass("forceverify-input-focus");
                if (input.value === "") {
                    label.show();
                }
                _check_format(name, name === "original_email");
            });

            input.on("keydown", function(evt) {
                label.hide();
                if(name !== "question_1" && name !== "question_2" && name !== "question_3" && name !== "emailquestion_1" && name !== "emailquestion_2" && name !== "emailquestion_3"){
                    error.html("");
                }
                submit_error.html("");
                var errornew = get_by_id('error_' + name);
                if (errornew) {
                    errornew.html('');
                }
                if (evt.keyCode === /* ENTER */ 13) {
                    _get_submit_btn().click();
                }
            });

            if (name === "original_email") {
                suggest_email(input, error);
            }
        };

        bind_input('original_email');
        bind_input('original_mobile');
        bind_input('vcode');
        bind_input('password');
        bind_input('softtoken');
        bind_input('question_1');
        bind_input('question_2');
        bind_input('question_3');
        bind_input('emailquestion_1');
        bind_input('emailquestion_2');
        bind_input('emailquestion_3');
        if (is_in_authtypes('bank') || is_in_authtypes('newcard')) {
            bind_input('card');
            bind_input('idcard');
            bind_input('bankphone');
            bind_input('cardname');
        }
        if (is_in_authtypes('face')) {
            bind_input('truename');
            bind_input('faceidcard');
        }


        var bind_submit = function(name) {
            var button = self.getElement(name);
            Base.on(button, 'mouseover', function(evt) {
                Base.addClass(button, 'forceverify-button-hover');
            });
            Base.on(button, 'mouseout', function(evt) {
                Base.removeClass(button, 'forceverify-button-hover');
            });

            Base.on(button, 'mousedown', function(evt) {
                Base.addClass(button, 'forceverify-button-press');
            });
            Base.on(button, 'mouseup', function(evt) {
                Base.removeClass(button, 'forceverify-button-press');
            });
            var vcode_name = "vcode";
            if (name === "submit_softtoken") {
                vcode_name = "softtoken";
            } else if (name === "submit_password") {
                vcode_name = "password";
            } else if (name === "submit_original_email") {
                vcode_name = "original_email";
            } else if (name === "submit_original_mobile") {
                vcode_name = "original_mobile";
            }

            Base.on(button, "click", function(evt) {
                if(name === "submit_question"){
                    if(_check_question(['question_1','question_2','question_3'],"question",get_by_id("forceverify_error"))){
                        _submit_vcode();
                    }
                } else if (name === 'submit_bank') {
                    if (checkArray(['card', 'cardname', 'idcard', 'bankphone'])) {
                        _submit_bank();
                    }
                } else if (name === 'submit_face') {
                    if (checkArray(['faceidcard', 'truename'])) {
                        _submit_face();
                    }
                } else if(self.current_type === 'email' && config.emailAndQuestion && self.hasQuestionForceverify){
                    if(_check_empty(vcode_name) && _check_format(vcode_name) && _check_question(['emailquestion_1','emailquestion_2','emailquestion_3'],"question",get_by_id("forceverify_error"))){
                        _submit_vcode();
                    }
                }else if (_check_empty(vcode_name) && _check_format(vcode_name)) {
                    _submit_vcode();
                }
            });
        };


        bind_submit('button_submit');
        bind_submit('submit_softtoken');
        bind_submit('submit_password');
        bind_submit('submit_original_email');
        bind_submit('submit_original_mobile');
        bind_submit('submit_question');
        bind_submit('submit_face');
        bind_submit('submit_bank');

        Base.on(self.getElement('button_send_email'), 'click', _send_verify);
        Base.on(self.getElement('button_send_mobile'), 'click', _send_verify);


        if (isRenderShow) {
            setTimeout(function() {
                self.show();
            }, 50);
        }

        Base.on(self.getElement('content_app_select'), 'click', function(evt) {
            var wrapper = self.getElement('content_app'),
                    target = Base.getTarget(evt),
                    type = target.attributes['data-click'] ? target.attributes['data-click'].value.toLowerCase() : '',
                    classes = wrapper.className.toLowerCase();

            self.current_app_type = type;

            if (self.current_app_type === 'qrcode' && !self.app.qrcode.status) {
                _check_qrcode();
            }


            if (self.current_app_type === 'fast' && !self.app.fast) {
                _get_onekey();
            }


            if (type && classes.indexOf(type) === -1) {
                Base.removeClass(wrapper, 'softtoken');
                Base.removeClass(wrapper, 'qrcode');
                Base.removeClass(wrapper, 'fast');

                Base.addClass(wrapper, type);
            }
        });
        /**
         * 上行短信
         */
        self.latest_type = self.current_type;
        Base.on(D, 'click', function(evt) {
            if (Base.getTarget(evt).className.indexOf("switch_upsms") > -1) {
                try {
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        window.event.returnValue = false;
                    }
                    evt.stopPropagation();
                } catch (e) {
                    var eventError = e;
                }

                hide("content_type_contain");
                hide("content_send_email");
                hide("content_emailquestion");
                hide("content_send_mobile");
                hide("content_vcode");
                hide("content_submit");
                hide("content_app");
                show("content_upsms");
                self.latest_type = self.current_type;
                self.current_type = "upsms";
                self.getElement('forceverify_error').innerHTML = "";
                _get_upsms();
            }
        });


        Base.on(self.getElement('upsms_back'), 'click', function(evt) {
            self.current_type = self.latest_type;

            show("content_type_contain");
            hide("content_send_email");
            hide("content_emailquestion");
            hide("content_send_mobile");
            show('content_send_' + self.current_type);
            show("content_vcode");
            show("content_submit");
            hide("content_app");
            hide("content_upsms");
        hide("content_question");
        });
        /**
         *
         */
        self.key_queue = [];
        Base.on(D, 'keydown', function(evt) {
            // 38 40 37 39
            self.key_queue.push(evt.keyCode);
            while (self.key_queue.length > 4) {
                self.key_queue.shift();
            }

            if (evt.keyCode === 39
                    && self.key_queue.length === 4
                    && self.key_queue.join() === [38, 40, 37, 39].join()
                    ) {
                show("udlr");
            }
        });
    };


    this.getElement = function(field) {
        return Base.g(self._ids + '__' + field);
    };
    this.hide = function() {
        self.onHide(self);
        hide("mask");
        hide("wrapper");
        if (self.getElement('app_fail')) {
            self.getElement("app_fail").style.display = 'none';
        }

        self.isShow = false;
    };
    this.show = function() {
    };
    var self = this;

    function _init() {
        _get_api();
        if (diaVerify) {
            diaVerify.hide = self.hide;
            diaVerify.getElement = self.getElement;
        }
        return self;
    }

    _init();
};

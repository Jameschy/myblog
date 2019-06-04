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

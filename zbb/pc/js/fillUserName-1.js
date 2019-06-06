/**
 * @file passport 补填用户名模块
 * @class
 * @name magic.passport.fillUserName
 * @grammar new magic.passport.fillUserName(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.fillUserName} magic.passport.fillUserName 实例
 * @superClass magic.passport
 */

var passport = window.passport || {};
/* eslint-disable */
magic.passport.fillUserName = baidu.lang.createClass(function (options) {
    var me = this;
    me.config = {
        staticPage: '',
        product: '',
        charset: '',
        token: '',
        lang: 'zh-CN',
        // 待定参数，统计需要
        subpro: ''
    };
    baidu.extend(me.config, options);
    this.module = 'fillUserName';
    me.constant = {
        CONTAINER_CLASS: 'tang-pass-fill',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error'
    };

    me.lang = passport.err.getCurrent().labelText.fillUserName;

    me.initTime = new Date().getTime();
    // init data
    passport.data.setContext(baidu.extend({}, me.config));
}, {
    type: 'magic.passport.fillUserName',
    superClass: magic.passport
}).extend({
    /* eslint-disable fecs-camelcase */
    _getIrregularField: function (field) {
        var me = this;
        var template = {
            generalError: '<p id="' + me.$getId('errorWrapper') + '" class="pass-generalErrorWrapper">' +
            '<span id="' + me.$getId('error') + '" class="pass-generalError"></span>'
            + '</p>',
            suggestName: '<div id="' + me.$getId('suggestNameWrapper') + '" class="pass-suggest-name"></div>',
            submit: '<p id="' + me.$getId('submitWrapper') + '" class="pass-form-item pass-form-item-submit">'
            + '<input id="' + me.$getId('submit') + '" type="submit" value="'
            + me.lang.nextStep + '" class="pass-button pass-button-submit" />'
            + '</p>'
        };
        return template[field];
    },
    /* eslint-disable fecs-camelcase */
    _getTemplate: function (containerId) {
        var me = this;
        var templateStr = '<form autocomplete="off" id="' + me.$getId('form') + '" method="POST">';
        var hiddenFields = {
            u: me.config.u,
            selectedSuggestName: '',
            staticPage: me.config.staticPage,
            subpro: me.config.subpro
        };
        var regRegularField = [{
            field: 'userName',
            // label: me.lang.userName,
            hasSucc: true
        }];

        templateStr += me._getIrregularField('generalError');
        for (var i = 0; i < regRegularField.length; i++) {
            templateStr += me._getRegularField(regRegularField[i]);
        }
        templateStr += me._getHiddenField(hiddenFields);
        templateStr += me._getIrregularField('submit');
        templateStr += '</form>';

        return templateStr;
    },

    /**
     * @description render 渲染组件到页面
     * @function
     * @name magic.passport.fillUserName#render
     * @grammar magic.passport.fillUserName#render(id)
     * @param {string} id 渲染到的容器的 id
     */
    render: function (id) {
        var me = this;
        me._initApi({
            success: function (rspInit) {
                passport.data.isUserNoName({scene: me.config.from || 'default'})
                .success(function (rsp) {
                    if (+rsp.errInfo.no === 0) {
                        if (!me.getElement()) {
                            me.$mappingDom('', id || document.body);
                        }
                        var target = baidu(me.getElement());
                        var template = me._getTemplate();
                        target.addClass(me.constant.CONTAINER_CLASS);
                        target.get(0).appendChild(baidu(template).get(0));
                        /**
                         * @description render 渲染组件到页面
                         * @event
                         * @name magic.passport.fillUserName#render
                         * @grammar magic.passport.fillUserName#render
                         */
                        var returnValue = me.fireEvent('render');
                        if (!returnValue) {
                            return;
                        }

                        me._setValidator();
                        me._setEvent();
                    } else {
                        /**
                         * @description 补填用户名不能使用（已有用户名等...）
                         * @name magic.passport.fillUserName#getError
                         * @event
                         * @grammar magic.passport.fillUserName#getError(e)
                         * @param {Object} e 事件参数
                         * @param {String} e.rsp 服务器返回的出错信息
                         */
                        var returnValue = me.fireEvent('getError', {
                            rsp: rsp
                        });
                        if (!returnValue) {
                            return;
                        }
                    }
                });
            }
        });
    },
    /* eslint-disable fecs-camelcase */
    _initApi: function (callbacks) {
        var me = this;
        me.initTime = new Date().getTime();
        passport.data.getApiInfo({
            apiType: 'fillInUserName'
        })
        .success(function (rsp) {
            /**
             * @description 获取api初始化信息
             * @name magic.passport#getApiInfo
             * @event
             * @grammar magic.passport.fillUserName#getApiInfo(e)
             * @param {Object} e 事件参数
             * @param {Object} e.rsp 服务器返回信息
             */

            var returnValue = me.fireEvent('getApiInfo', {
                rsp: rsp
            });
            if (!returnValue) {
                return;
            }

            if (+rsp.errInfo.no === 0) {
                var token = rsp.data.token;

                // data: setContext
                passport.data.setContext({
                    token: token
                });

                callbacks && callbacks.success(rsp);
            }
        });
    },
    _setValidator: function () {
        var me = this;
        me._validator.addRule('userNameLength', function (ele) {
            // ByteLength<14 && 不全是数字
            var len = ele.value.replace(/[^\x00-\xff]/g, 'ci').length;
            return len <= 14 && !/^\d+$/.test(ele.value);
        });
        me._validator.addMsg('userNameLength', me.lang.userNameRulesError);

        me.validateRules = {
            'userName': {
                rules: ['required', 'userNameLength'],
                asyncRule: me._asyncValidate.checkUserName,
                desc: me.lang.userName
            }
        };
        me._validator.init(me, me.validateRules);
    },
    _validateError: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        if (me.getElement(info.field + 'Succ')) {
            me.getElement(info.field + 'Succ').style.display = 'none';
        }
        ele.addClass(me.constant.ERROR_CLASS);
        me.getElement(info.field + 'Error').style.display = 'block';
        me.getElement(info.field + 'Error').innerHTML = info.msg;
        opt && opt.callback && callback();
    },
    _validateSuccess: function (info, opt) {
        var me = this;
        var ele = baidu(me.getElement(info.field));
        me.getElement(info.field + 'Error').style.display = 'none';
        if (me.getElement(info.field + 'Succ')) {
            me.getElement(info.field + 'Succ').style.display = 'block';
        }
        ele.removeClass(me.constant.ERROR_CLASS);
        opt && opt.callback && callback();
    },
    _showSuggestNames: function (suggestNames, key) {
        var me = this;
        // 防止频繁 blur 使推荐列表被更新
        if (key === me.suggestListKey) {
            return;
        }
        // 生成容器
        if (!baidu(me.getElement('suggestNameWrapper')).length) {
            var newNode = baidu(me._getIrregularField('suggestName')).get(0);
            me.getElement('form').insertBefore(newNode, me.getElement('submitWrapper'));
        }
        me.suggestListKey = key;
        var suggestNameWrapper = me.getElement('suggestNameWrapper');
        if (!suggestNames || !suggestNames.length) {
            suggestNameWrapper.innerHTML = '';
        } else {
            suggestNameWrapper.innerHTML = '';
            for (var i = 0, j = suggestNames.length; i < j; i++) {
                /* eslint-disable max-len */
                var newNode = baidu('<p class="pass-suggest-item"><label name="suggestName"><input name="suggestName" type="radio" class="pass-suggest-item-radio" value="' + suggestNames[i] + '" />' + suggestNames[i] + '</label></p>').get(0);
                suggestNameWrapper.appendChild(newNode);
            }
        }
    },
    /** async validate **/
    _asyncValidate: {
        // 异步校验，由validator 在同步校验通过后直接调用
        checkUserName: function (callbacks) {
            var me = this;
            var ele = me.getElement('userName');
            passport.data.checkUserName({
                userName: ele.value
            })
            .success(function (rsp) {
                if (+rsp.errInfo.no === 0) {
                    if (+rsp.data.userExsit === 1) {
                        // fail
                        rsp.msg = me.lang.userNameExistsError;//rsp.errInfo.msg;
                        callbacks && callbacks.error(rsp);
                    } else {
                        // success
                        callbacks && callbacks.success(rsp);
                    }
                    me._showSuggestNames(rsp.data.suggNames, ele.value);
                } else {
                    me._showSuggestNames([], ele.value);
                    rsp.msg = rsp.errInfo.msg;
                    callbacks && callbacks.error(rsp);
                }
            });
        }
    },
    _eventHandler: (function () {
        var me,
            inputOriginalValue = '',
            style = {
                focus: function (field, e) {
                    /**
                     * @description 表单域获得焦点
                     * @name magic.passport.reg#fieldFocus
                     * @event
                     * @grammar magic.passport.fillUserName#fieldFocus(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 focus 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldFocus', {
                        ele: this
                    });
                    if (!returnValue) return;

                    this.addClass(me.constant.FOCUS_CLASS);
                    this.removeClass(me.constant.ERROR_CLASS);
                },
                blur: function (field, e) {
                    /**
                     * @description 表单域失去焦点
                     * @name magic.passport.reg#fieldBlur
                     * @event
                     * @grammar magic.passport.fillUserName#fieldBlur(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 blur 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldBlur', {
                        ele: this
                    });
                    if (!returnValue) return;

                    this.removeClass(me.constant.FOCUS_CLASS);
                },
                mouseover: function (field, e) {
                    /**
                     * @description 鼠标移入表单域
                     * @name magic.passport.reg#fieldMouseover
                     * @event
                     * @grammar magic.passport.fillUserName#fieldMouseover(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 mouseover 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldMouseover', {
                        ele: this
                    });
                    if (!returnValue) return;

                    this.addClass(me.constant.HOVER_CLASS);
                },
                mouseout: function (field, e) {
                    /**
                     * @description 鼠标移出表单域
                     * @name magic.passport.reg#fieldMouseout
                     * @event
                     * @grammar magic.passport.fillUserName#fieldMouseout(e)
                     * @param {Object} e 事件参数
                     * @param {TangramDOM} e.ele 触发 fieldMouseout 事件的表单域
                     */
                    var returnValue = me.fireEvent('fieldMouseout', {
                        ele: this
                    });
                    if (!returnValue) return;

                    this.removeClass(me.constant.HOVER_CLASS);
                }
            },
            behaviour = {
                focus: {
                    'userName': function (field, e) {
                        inputOriginalValue = me.getElement(field).value;
                    }
                },
                blur: {
                    'userName': function (field, e) {
                        var value = me.getElement(field).value;
                        // if((inputOriginalValue != value) || !value.length){};
                        me.validate(field);
                    }
                },
                submit: function (e) {
                    me.validateAll({
                        success: function () {
                            me.getElement('submit').focus();
                            /**
                             * @description 表单提交前
                             * @name magic.passport.fillUserName#beforeSubmit
                             * @event
                             * @grammar magic.passport.fillUserName#beforeSubmit(e)
                             */
                            var returnValue = me.fireEvent('beforeSubmit');
                            if (!returnValue) return;

                            var data = baidu.form.json(me.getElement('form'));
                            data.scene = me.config.from || 'default';
                            // 处理suggName
                            if (data.userName != data.selectedSuggestName) data.selectedSuggestName = '';
                            data.timeSpan = new Date().getTime() - me.initTime;
                            passport.data.fillUserName(data)
                            .success(function (rsp) {
                                if (rsp.errInfo.no == 0) {
                                    /**
                                     * @description 补填用户名成功
                                     * @name magic.passport.fillUserName#fillUserNameSuccess
                                     * @event
                                     * @grammar magic.passport.fillUserName#fillUserNameSuccess(e)
                                     * @param {Object} e 事件参数
                                     * @param {Object} e.data 服务器返回信息
                                     * @param {Boolean} evt.returnValue 返回false时，组织跳转
                                     */
                                    var returnValue = me.fireEvent('fillUserNameSuccess', {
                                        rsp: rsp
                                    });
                                    if (!returnValue) return;

                                    window.location.href = rsp.data.u;
                                } else {
                                    /**
                                     * @description 补填用户名失败
                                     * @name magic.passport.fillUserName#fillUserNameError
                                     * @event
                                     * @grammar magic.passport.fillUserName#fillUserNameError(e)
                                     * @param {Object} e 事件参数
                                     * @param {Object} e.rsp 服务器返回信息
                                     */
                                    var returnValue = me.fireEvent('fillUserNameError', {
                                        rsp: rsp
                                    });
                                    if (!returnValue) return;

                                    if (rsp.errInfo['field']) {
                                        me.setValidateError(rsp.errInfo['field'], rsp.errInfo['msg']);
                                    } else {
                                        me.setGeneralError(rsp.errInfo['msg']);
                                    }
                                }
                            });
                        },
                        error: function () {

                        }
                    });

                    e.preventDefault();
                },
                change: {
                    'userName': function (field, e) {

                    }
                },
                click: {
                    'suggestName': function () {
                        var boxDom = this.get(0);
                        if (!boxDom.tagName || (boxDom.tagName != 'LABEL')) {
                            boxDom = boxDom.parentElement || boxDom.parentNode || null;
                        }
                        if (boxDom) {
                            boxDom = boxDom.getElementsByTagName('input')[0];
                        }
                        var value = boxDom.value;
                        /**
                         * @description 用户从推荐用户名列表中选择
                         * @name magic.passport.fillUserName#selectSuggestName
                         * @event
                         * @grammar magic.passport.fillUserName#selectSuggestName(e)
                         * @param {Object} e 事件参数
                         * @param {String} e.suggestName 被选中的用户名
                         */

                        var returnValue = me.fireEvent('selectSuggestName', {
                            suggestName: value
                        });
                        if (!returnValue) return;

                        me.getElement('suggestNameWrapper').innerHTML = '';
                        me.getElement('userName').value = value;

                        // TODO: 考虑选中推荐用户名后，不通过调用验证消除错误提示
                        // me.validate('userName');
                        me.setValidateSuccess('userName');
                        me.suggestListKey = value;
                        me.getElement('selectedSuggestName').value = value;
                    }
                }
            };

        return {
            entrance: function (e) {
                me = this;
                var target = baidu(e.target),
                    field = e.target.name;
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
                    if (typeof behaviour[e.type] == 'function') {
                        // for submit
                        behaviour[e.type].apply(baidu(e.target), [e]);
                    }
                    if (behaviour[e.type].hasOwnProperty(field)) {
                        behaviour[e.type][field].apply(baidu(e.target), [field, e]);
                    }
                }
            }
        };
    })(),
    /**
     * @description 显示该模块
     * @name magic.passport.fillUserName#show
     * @grammar magic.passport.fillUserName#show
     * @function
     */
    /**
     * @description 隐藏该模块
     * @name magic.passport.fillUserName#hide
     * @grammar magic.passport.fillUserName#hide
     * @function
     */
    /**
     * @description 校验单个表单域
     * @name magic.passport.fillUserName#validate
     * @function
     * @grammar magic.passport.fillUserName#validate(field, callbacks)
     * @param {String} field 要校验的表单域
     * @param {String} callbacks 校验完成回调，可选
     * @param {String} callbacks.succcess 校验通过回调，可选
     * @param {String} callbacks.error 校验未通过回调，可选
     */
    /**
     * @description 开始校验单个表单域前
     * @name magic.passport.fillUserName#beforeValidate
     * @event
     * @grammar magic.passport.fillUserName#beforeValidate(e)
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验信息
     * @param {String} e.validate.field 参与校验的表单项名
     * @param {TangramDOM} e.validate.ele 参与校验的表单项的 TangramDOM
     */
    /**
     * @description 单项表单域校验通过
     * @name magic.passport.fillUserName#validateSuccess
     * @grammar magic.passport.fillUserName#validateSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     */
    /**
     * @description 单项表单域校验未通过
     * @name magic.passport.fillUserName#validateError
     * @grammar magic.passport.fillUserName#validateError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Object} e.validate 校验结果
     * @param {Object} e.validate.ele 参与校验的元素
     * @param {Object} e.validate.msg 导致校验失败的规则所对应的出错信息
     */
    /**
     * @description 校验整个表单
     * @name magic.passport.fillUserName#validateAll
     * @grammar magic.passport.fillUserName#validateAll(callbacks, breakOnError)
     * @function
     * @param {Object} callbacks 校验完成回调，可选
     * @param {Function} callbacks.succcess 校验全部通过回调，可选
     * @param {Function} callbacks.error 校验未通过回调，可选
     * @param {Boolean} breakOnError 有验证项未通过，则不再往下继续验证，可选，默认 false
     */
    /**
     * @description 开始校验整个表单前
     * @name magic.passport.fillUserName#beforeValidateAll
     * @grammar magic.passport.fillUserName#beforeValidateAll
     * @event
     */
    /**
     * @description 全表单校验通过
     * @name magic.passport.fillUserName#validateAllSuccess
     * @grammar magic.passport.fillUserName#validateAllSuccess(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 全表单校验未通过
     * @name magic.passport.fillUserName#validateAllError
     * @grammar magic.passport.fillUserName#validateAllError(e)
     * @event
     * @param {Object} e 事件参数
     * @param {Array} e.validates 校验结果的集合
     */
    /**
     * @description 析构
     * @name magic.passport.fillUserName#$dispose
     * @function
     * @grammar magic.passport.fillUserName#$dispose()
     */
    $dispose: function () {
        var me = this;
        if (me.disposed) {
            return;
        }
        baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
        me.getElement().removeChild(me.getElement('form'));
        magic.Base.prototype.$dispose.call(me);
    }
});

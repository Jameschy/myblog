///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 身份证实名
 * @class
 * @name magic.passport.IDCertify
 * @grammar new magic.passport.IDCertify(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @return {magic.passport.IDCertify} magic.passport.IDCertify 实例
 * @superClass magic.passport
 */
magic.passport.IDCertify = baidu.lang.createClass(function(options){
  var me = this;
  me._domain = {
    'https': 'https://passport.baidu.com',
    'http': 'http://passport.baidu.com/',
    'staticFile': (document.location.protocol.toLowerCase() === 'https:') ? 'https://ss0.bdstatic.com/5LMZfyabBhJ3otebn9fN2DJv' : 'http://passport.bdimg.com/',
    'auto': (document.location.protocol.toLowerCase() === 'https:') ? 'https://passport.baidu.com' : 'http://passport.baidu.com/'
  };
  me.config = {
    product: '',//string,产品线TPL
    charset: '',
    token : '',
    hasPlaceholder:true,
    staticPage: '',//string,静态跳转文件
    u: '',
    lang: 'zh-CN',
    authsid: ''
  };

  baidu.extend(me.config, options);

  this.module = 'IDCertify';
  me.constant = {
        CHECKVERIFYCODE:true,
        CONTAINER_CLASS: 'tang-pass-IDCertify',
        LABEL_FOCUS_CLASS: 'pass-text-label-focus',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        DISABLED_CLASS :'pass-item-time-timing',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif'
  };
  me.lang = passport.err.getCurrent().labelText.IDCertify;     
  // 是否加载默认CSS
  if (me.config.defaultCss) {
  // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
    me.loadCssFileW('IDCertify.css'/*tpa=http://passport.baidu.com/passApi/css/IDCertify.css*/, function () {});
  }
},{
    type: "magic.passport.IDCertify",
    superClass: magic.passport
}).extend({
    _getIrregularField: function(field){
      var me = this,
      template = {
          generalError : '<p id="' + me.$getId('IDCertifyErrorWrapper')+ '" class="pass-generalErrorWrapper">'
                       + '<span id="' + me.$getId('IDCertifyError') + '" class="pass-generalError pass-generalError-error"></span>'
                       + '</p>',
          submit : '<p id="' + me.$getId('submitWrapper') + '" class="pass-form-item pass-form-item-submit">'
                 +     '<input id="' + me.$getId('submit') + '" type="submit" value="' + me.lang.submit + '" class="pass-button pass-button-submit"/>'
                 + '</p>',
          unametip: '<div id="' + me.$getId('unameTip') + '" class="pass-unametip-wrapper">'
                  + '<span class="pass-unametip-content" id="' + me.$getId('unameTipContent') + '">'
                  + me.lang.unametip + '</span>'
                  + '</div>'
      }
      return template[field];
    },

    _getTemplate: function(action,opt){
        var me = this;
        var templateStr = '<form id="' + me.$getId('form')
        + '" class="pass-form pass-form-IDCertify" method="POST" autocomplete="off">';
        var hiddenFields = {
            u: me.config.u,
            staticPage: me.config.staticPage
        };
        var IDCertifyRegularField = [{
            field: 'idname',
            noError: true
        }, {
            field: 'idcard',
            noError: true
        }];
        if (me.truename) {
            IDCertifyRegularField[0].value = me.truename;
            IDCertifyRegularField[0].disabled = true;
        }
        templateStr += me._getHiddenField(hiddenFields);
        for (var i = 0; i < IDCertifyRegularField.length; i++) {
            templateStr += me._getRegularField(IDCertifyRegularField[i]);
            if (i === 0 && me.truename) {
                templateStr += me._getIrregularField('unametip');
            }
        }
        templateStr += me._getIrregularField('generalError');
        templateStr += me._getIrregularField('submit');
        templateStr += '</form>';
        return templateStr;
    },

    _setValidator: function(){
      var me = this;
      me.validateRules = {
        'idname': {
          rules: ['required'],
          label: '',
          desc: me.lang.idnameError
        },
        'idcard': {
          rules: ['required'],
          label: '',
          desc: me.lang.idcardError
        }
      }

      me._validator.init(me, me.validateRules);
    },
     
    _validateError: function(info, opt){
      var me = this;
      var ele = baidu(me.getElement(info.field));
      if (ele) {
        ele.addClass(me.constant.ERROR_CLASS);
      }
      this.getElement('IDCertifyError').innerHTML = info.msg;
      opt && opt.callback && callback();
    },

     _validateSuccess: function(info, opt){
        var me = this;
        var ele = baidu(me.getElement(info.field));
        if (ele) {
          ele.removeClass(me.constant.ERROR_CLASS);
        }
        this.getElement('IDCertifyError').innerHTML = '';
        opt && opt.callback && callback();
     },
    loadCssFileW: function (url, cb) {
      var me = this;
      window._loadedFilesW = window._loadedFilesW || {};
      if (!window._loadedFilesW[url]) {
        window._loadedFilesW[url] = true;
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.type = 'text/css';
        l.href =  me._domain.staticFile + url;
        document.getElementsByTagName('head')[0].appendChild(l);
        if (l.readyState) {
            // IE
            l.onreadystatechange = function () {
                if (l.readyState === 'loaded' || l.readyState === 'complete') {
                    l.onreadystatechange = null;
                    cb && cb();
                }
            };
        } else {
            l.onload = function () {
                cb && cb();
            };
        }
      }
    },
    insertScriptW: function (u, cb) {
      window._loadedFilesW = window._loadedFilesW || {};
      if (!window._loadedFilesW[u]) {
        window._loadedFilesW[u] = true;
        var d = document;
        var s = d.createElement('SCRIPT');
        s.type = 'text/javascript';
        s.charset = 'UTF-8';
        if (s.readyState) {
          // IE
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
    /*
      检测是否支持css3动画
    */
    supportCss3Anim: function () {
        var test = document.getElementsByTagName('body')[0].style;
        if (typeof test.animation != 'undefined' || typeof test.WebkitAnimation != 'undefined') {
            return true;
        } else {
            return false;
        }
    },
    /* globals passport */
    init: function (callback) {
      var me = this;
      var data = {};
      data.tpl = me.config.product;
      passport.data.jsonp('/v3/finance/main/certinit?v=' + (new Date().getTime()), data).success(function(rsp) {
        if (rsp.errInfo.no == 0) {
            me.bdstoken = rsp.data.bdstoken || '';
            me.truename = rsp.data.truename || '';
            me.config.authsid = rsp.data.authsid || '';
        }
        else if (+rsp.errInfo.no === 6) {
            // 敏感操作，初级实名先调验证控件再实名
            me.bdstoken = rsp.data.bdstoken || '';
            me.truename = rsp.data.truename || '';
            me.idCertifyForceverify = passport.pop.initForceverify({
                token: rsp.data.authtoken,
                title: '安全验证',
                msg: '为保障帐号安全，实名前需验证身份',
                tpl: me.config.product || '',
                onSubmitSuccess: function (self, result) {
                    me.config.authsid = result.authsid || '';
                    me.idCertifyForceverify.hide();
                    me.certifyRequest();
                }
            });
        }
        else {
          //me.setGeneralError(rsp.errInfo.msg || '');
          me.getElement('IDCertifyError').innerHTML = (rsp.errInfo.msg || '');
        }
        callback && callback(me);
      })
    },

    render: function(id,callback){
        var me = this;
        if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
      
        me.init(me.render_template);
    },

    render_template: function(me) {
        var target = baidu(me.getElement());
        target.addClass(me.constant.CONTAINER_CLASS);

        var template = me._getTemplate();
        target.get(0).appendChild(baidu(template).get(0));

        if (me.config.hasPlaceholder) {
            var rendList = [{
                label: 'idname',
                placeholder: 'idnamePlaceholder'
            }, {
                label: 'idcard',
                placeholder: 'idcardPlaceholder'
            }];
            if (me.truename) {
                rendList[0].clearbtn = 0;
            }
            me._getPlaceholder(rendList);
        }

        var urlData = {
            'page': 'IDCertify',
            'source': 'pc',
            'tpl': me.config.product || ''
        };
        var autoStatisticObj = {
            'eventType': 'idcertifyRenderFinish'
        };
        me._logPass(urlData, autoStatisticObj);
        var returnValue = me.fireEvent('renderFinish', {
            ele: this
        });
        if (!returnValue) {
            return;
        }
        me._setValidator();
        me._setEvent();
        me.mouseEvent();
    },
    mouseEvent: function () {
        var me = this;
        baidu(me.getElement('unameTip')).on('mouseover', function () {
            me.getElement('unameTipContent').style.display = 'block';
        });
        baidu(me.getElement('unameTip')).on('mouseout', function () {
            me.getElement('unameTipContent').style.display = 'none';
        });
    },
    certifyRequest: function () {
        var me = this;
        me.getElement('submit').value = me.lang.submitBtnLoading;
        me.getElement('IDCertifyError').innerHTML = ('');
        var data = baidu.form.json(me.getElement('form'));
        data.tpl = me.config.product;
        /* eslint-disable */
        data.idname = me.SBCtoDBC(me.getElement('idname').value);
        data.name = me.SBCtoDBC(me.getElement('idname').value);
        data.idnum = me.getElement('idcard').value;
        data.bdstoken = me.bdstoken;
        data.isGuide = me.getQueryString('isGuide') || 0;
        data.authsid = me.config.authsid;
        passport.data.jsonp('/v3/finance/main/idnumcert?v='
         + (new Date().getTime()), data).success(function (rsp) {
            if (+rsp.errInfo.no === 0) {
                var returnValue = me.fireEvent('submitSuccess');
                if (!returnValue) {
                    return;
                }
                window.location.href = rsp.data.u;
            } else {
                me.getElement('IDCertifyError').innerHTML = (rsp.errInfo.msg || '系统繁忙，请稍候再试');
                me.getElement('submit').value = me.lang.submit;
            }
        });
    },
    _eventHandler: (function(){
      var me,
      style = {
        focus: function(field, e){
          /**
            * @description 表单域获得焦点
            * @name magic.passport.reg#fieldFocus
            * @event
            * @grammar magic.passport.IDCertify#fieldFocus(e)
            * @param {Object} e 事件参数
          * @param {TangramDOM} e.ele 触发 focus 事件的表单域
          */
            var returnValue = me.fireEvent('fieldFocus', {
                 ele: this
            });
            if(!returnValue) return;
               
            this.addClass(me.constant.FOCUS_CLASS);
            this.removeClass(me.constant.ERROR_CLASS);
            baidu(me.getElement(field + 'Label')).addClass(me.constant.LABEL_FOCUS_CLASS);

        },
        blur: function(field, e){
          /**
            * @description 表单域失去焦点
            * @name magic.passport.reg#fieldBlur
            * @event
            * @grammar magic.passport.login#fieldBlur(e)
            * @param {Object} e 事件参数
            * @param {TangramDOM} e.ele 触发 blur 事件的表单域
          */
          var returnValue = me.fireEvent('fieldBlur', {
               ele: this
          });
          if(!returnValue) return;
             
          this.removeClass(me.constant.FOCUS_CLASS);
            baidu(me.getElement(field + 'Label')).removeClass(me.constant.LABEL_FOCUS_CLASS);
        },
        keyup: function(field, e){

        }
      },
      behaviour = {
        focus: {
        },
        blur: {
        },
        change: {
        },
        click: {
        },
        keyup: {
        },
        submit: function(e){                    
          e.preventDefault();
        
          me.validateAll({
            success: function(){
              /**
                * @description 表单提交前
                * @name magic.passport.login#beforeSubmit
                * @event
                * @grammar magic.passport.login#beforeSubmit
              */
                var urlData = {
                    "page": "IDCertify",
                    "source": "pc",
                    "tpl": me.config.product || ''
                }
                var auto_statisticObj = {
                    "eventType": "idcertifySubmit"
                }
                me._logPass(urlData, auto_statisticObj);

                var returnValue = me.fireEvent('beforeSubmit');
                if(!returnValue) return;   
                var Validator = new IDValidator(GB2260);
                var _idcardvalue = me.getElement('idcard').value;
                if (!Validator.isValid(_idcardvalue)) {
                    baidu(me.getElement('idcard')).addClass(me.constant.ERROR_CLASS);
                    me.getElement('IDCertifyError').innerHTML = me.lang.idcardFormatError;
                    return false;
                }
                if (!me.config.authsid) {
                    me.idCertifyForceverify.show();
                    return;
                }
                me.certifyRequest();
            }
          },true)
        }
      };
      return {
        entrance: function(e){
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
          if (style.hasOwnProperty(e.type)){
            style[e.type].apply(baidu(e.target), [field, e]);
          }

          if (behaviour.hasOwnProperty(e.type)){
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
     
    $dispose: function(){
      var me = this;
      if(me.disposed){return;}
      baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
      me.getElement().removeChild(me.getElement('form'));
      magic.Base.prototype.$dispose.call(me);
    }
});

///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 身份证实名
 * @class
 * @name magic.passport.loadingApi
 * @grammar new magic.passport.loadingApi(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @return {magic.passport.loadingApi} magic.passport.loadingApi 实例
 * @superClass magic.passport
 */
magic.passport.loadingApi = baidu.lang.createClass(function(options){
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
    delay: '1000',
    authsid: '',
    loadingFinshText: '\u606d\u559c\uff0c\u5df2\u5b8c\u6210\u5e10\u53f7\u5b9e\u540d',
    loadingText: '\u6b63\u5728\u8ba4\u8bc1\u4e2d\uff0c\u8bf7\u7a0d\u7b49'
  };

  baidu.extend(me.config, options);

  this.module = 'loadingApi';
  me.constant = {
        CHECKVERIFYCODE:true,
        CONTAINER_CLASS: 'tang-pass-loadingApi',
        LABEL_FOCUS_CLASS: 'pass-text-label-focus',
        FOCUS_CLASS: 'pass-text-input-focus',
        HOVER_CLASS: 'pass-text-input-hover',
        ERROR_CLASS: 'pass-text-input-error',
        DISABLED_CLASS :'pass-item-time-timing',
        BLANK_IMG_URL: passport.apiDomain.staticDomain + '/passApi/img/small_blank.gif'
  };
  me.lang = passport.err.getCurrent().labelText.loadingApi;     
  // 是否加载默认CSS
  if (me.config.defaultCss) {
  // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
    me.loadCssFileW('loadingApi.css'/*tpa=http://passport.baidu.com/passApi/css/loadingApi.css*/, function () {});
  }
},{
    type: "magic.passport.loadingApi",
    superClass: magic.passport
}).extend({
    _getIrregularField: function(field){
      var me = this,
      template = {
          loading: '<div id="' + me.$getId('loadingApiWrapper')+ '" class="pass-loadingApiWrapper">'
                 + '<div class="pass-loadingApiAnimate pass-loadingApiSecond" id="' + me.$getId('loadingApiAnimate') + '"></div>'
                 + '<div class="pass-loadingApi-succ pass-loadingApiSecond" id="' + me.$getId('loadingApiSuc') + '">'
                 + '<div class="pass-loadingApi-succImg"></div>'
                 + '</div>'
                 + '<p class="pass-loadingApi-loadingText" id="' + me.$getId('loadingApiText') + '">' + me.config.loadingText + '</p>'
                 + '</div>'
      }
      return template[field];
    },

    _getTemplate: function(action,opt){
      var me = this ;
      var templateStr = '<form id="' + me.$getId('form') + '" class="pass-form pass-form-loadingApi" method="POST" autocomplete="off">';
      var hiddenFields = {
          u: me.config.u,
          staticPage: me.config.staticPage
      };

      templateStr += me._getHiddenField(hiddenFields);

      templateStr += me._getIrregularField('loading');
        
      templateStr += '</form>';
      return templateStr;
    },

    editAnim: function(){
      var me = this;
      setTimeout(function() {
        me.getElement('loadingApiAnimate').style.display = 'none';
        baidu(me.getElement('loadingApiSuc')).show(200).addClass('pass-loadingApi-SuccShow');
        baidu(me.getElement('loadingApiText')).html(me.config.loadingFinshText);
      },me.config.delay);
    },

    _setValidator: function(){
      var me = this;
    },
     
    _validateError: function(info, opt){
      var me = this;
    },

     _validateSuccess: function(info, opt){
        var me = this;
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
    init : function(callback){
      var me = this;
    },

    render: function(id,callback){
      var me = this;
      if (!me.getElement()) {
          me.$mappingDom('', id || document.body);
      }

      var target = baidu(me.getElement());//baidu('#'+id);
      target.addClass(me.constant.CONTAINER_CLASS);

      var template = me._getTemplate();
      target.get(0).appendChild(baidu(template).get(0));
      
      me._setValidator();
      me._setEvent();
      me.editAnim();
    },

    _eventHandler: (function(){
      var me,
      style = {
        focus: function(field, e){
          /**
            * @description 表单域获得焦点
            * @name magic.passport.reg#fieldFocus
            * @event
            * @grammar magic.passport.loadingApi#fieldFocus(e)
            * @param {Object} e 事件参数
          * @param {TangramDOM} e.ele 触发 focus 事件的表单域
          */
            var returnValue = me.fireEvent('fieldFocus', {
                 ele: this
            });
            if(!returnValue) return;
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
              var returnValue = me.fireEvent('beforeSubmit');
              if(!returnValue) return;   
            }
          },true)
        }
      };
      return {
        entrance: function(e){
          me = this;
          var target = baidu(e.target),
              field = e.target.name;
          if(!field && e.target.id) {
            var matches = e.target.id.match(/\d+__(.*)$/);
            if(matches) { field = matches[1]; }
          }
          if(!field) { return; }
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

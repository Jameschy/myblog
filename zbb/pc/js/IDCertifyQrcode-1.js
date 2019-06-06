///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 身份证实名
 * @class
 * @name magic.passport.IDCertifyQrcode
 * @grammar new magic.passport.IDCertifyQrcode(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.u 登录成功后的跳转页面
 * @param {String} options.staticPage 本域下部署的jump地址
 * @param {Number} options.safeFlag 安全标识
 * @return {magic.passport.IDCertifyQrcode} magic.passport.IDCertifyQrcode 实例
 * @superClass magic.passport
 */
magic.passport.IDCertifyQrcode = baidu.lang.createClass(function(options){
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
      authsid: '',
      subpro: 'ppcert' // 活体标识使用，如产品线需要配置类似登录的subpro只能将登录subpro的值和活体subpro的值合并赋予subpro
    };

    baidu.extend(me.config, options);

    this.module = 'IDCertifyQrcode';
    me.constant = {
          CHECKVERIFYCODE:true,
          CONTAINER_CLASS: 'tang-pass-IDCertifyQrcode',
          BLANK_IMG_URL: me._domain.auto + '/passApi/img/small_blank.gif'
    };
    var _passLowerIE = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
    if (_passLowerIE <= 6) {
        me.config.animation = false;
    }
    me.lang = passport.err.getCurrent().labelText.IDCertifyQrcode;
    // 是否加载默认CSS
    if (me.config.defaultCss) {
    // 如果是浮层式就配置defaultCss为false。浮层式默认加载浮层样式文件
      me.loadCssFileW('IDCertifyQrcode.css'/*tpa=http://passport.baidu.com/passApi/css/IDCertifyQrcode.css*/, function () {});
    }
},{
    type: "magic.passport.IDCertifyQrcode",
    superClass: magic.passport
}).extend({
    _getIrregularField: function(field){
        var me = this,
            guideMsg = me.config.guideMsg || me.lang.IDCertifyQrcodeMsg,
        template = {
            IDCertifyQrcodeLoading: '<div class="IDCertifyQrcode-status-con IDCertifyQrcode-status-loading" id="' + me.$getId("IDCertifyQrcodeLoading") + '">'
                                      + '<img src="' + me._domain.auto + '/passApi/img/loading.gif" class="IDCertifyQrcode-loading-img"/>'
                                    + '</div>',
            IDCertifyQrcodeMain: '<div class="IDCertifyQrcode-status-con IDCertifyQrcode-stauts-main" id="' + me.$getId("IDCertifyQrcodeMain") + '">'
                                    + '<img src="' + me.constant.BLANK_IMG_URL + '" id="' + me.$getId('IDCertifyQrcodeMainImg') + '" class="IDCertifyQrcode-main-img" />'
                                    + (me.config.animation ? ('<p class="IDCertifyQrcode-status-animation" id="' + me.$getId('IDCertifyQrcodeAnimation') + '"></p>') : '')
                                 + '</div>',
            IDCertifyQrcodeSuccess: '<div class="IDCertifyQrcode-status-con IDCertifyQrcode-status-success" id="' + me.$getId('IDCertifyQrcodeSuccess') + '">'
                                      + '<p class="IDCertifyQrcode-status-icon"></p>'
                                      + '<p>' + me.lang.IDCertifyQrcodeSuccessTit + '</p>'
                                      + '<p class="IDCertifyQrcode-status-msg">' + me.lang.IDCertifyQrcodeSuccessMsg + '</p>'
                                    + '</div>',
            IDCertifyQrcodeError: '<div class="IDCertifyQrcode-status-con IDCertifyQrcode-status-error" id="' + me.$getId('IDCertifyQrcodeError') + '">'
                                      + '<p class="IDCertifyQrcode-status-icon"></p>'
                                      + '<p>' + me.lang.IDCertifyQrcodeErrorTit + '</p>'
                                      + '<p class="IDCertifyQrcode-status-msg">' + me.lang.IDCertifyQrcodeErrorMsg + '</p>'
                                    + '</div>',
            IDCertifyQrcodeRefresh: '<div class="IDCertifyQrcode-status-con IDCertifyQrcode-status-refresh" id="' + me.$getId('IDCertifyQrcodeRefresh') + '">'
                                      + '<p class="IDCertifyQrcode-status-icon"></p>'
                                      + '<p>' + me.lang.IDCertifyQrcodeRefreshTit + '</p>'
                                      + '<p class="IDCertifyQrcode-refresh-btn" id="' + me.$getId('IDCertifyQrcodeRefreshBtn') + '">' + me.lang.IDCertifyQrcodeRefreshBtn + '</p>'
                                    + '</div>',
            IDCertifyQrcodeGuide: '<p>'+guideMsg+'</p>'
        }
        return template[field];
    },

    _getTemplate: function(action,opt){
        var me = this ;
        var templateStr = '<div class="IDCertifyQrcode-wrapper" id="' + me.$getId('IDCertifyQrcodeWrapper') + '">';
        var hiddenFields = {
            u: me.config.u,
            staticPage: me.config.staticPage
        };

        templateStr += me._getHiddenField(hiddenFields);

        templateStr += '<div class="IDCertifyQrcode-con">';

        templateStr += me._getIrregularField('IDCertifyQrcodeLoading');
        templateStr += me._getIrregularField('IDCertifyQrcodeMain');
        templateStr += me._getIrregularField('IDCertifyQrcodeSuccess');
        templateStr += me._getIrregularField('IDCertifyQrcodeError');
        templateStr += me._getIrregularField('IDCertifyQrcodeRefresh');

        templateStr += '</div>';

        if (me.config.hasGuideMsg) {
            templateStr += me._getIrregularField('IDCertifyQrcodeGuide');
        }

        templateStr += '</div>';
        return templateStr;
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

    /*
      获取二维码图片
    */
    getQrcode: function () {
        var me = this;
        passport.spareWData = passport.spareWData || {};
        var data = {};
        data.lp = 'pc';
        data.apiver = 'v3';
        data.subpro = me.config.subpro;
        data.u = me.config.u;
        data.tpl = me.config.product || 'pp';
        data.from = 'qrcert';
        data.hideQrcodeLiveState = me.config.hideQrcodeLiveState || '0';
        data.isGuide = me.getQueryString('isGuide') || 0;
        baidu.ajax({
            url: me._domain.https + '/v3/ucenter/main/livingcertgetqrcode?v=' + (new Date().getTime()),
            dataType: 'jsonp',
            data: data,
            success: function(rsp){
                passport.spareWData.channelimg = rsp.imgurl;
                passport.spareWData.sign = rsp.sign;
                baidu('.IDCertifyQrcode-status-con', me.getElement('IDCertifyQrcodeWrapper')).hide();

                if (!rsp.imgurl) {
                    var returnValue = me.fireEvent('getQrcodeError');
                    if (!returnValue) {
                        return;
                    }
                    me.getElement('IDCertifyQrcodeMain').innerHTML = me.config.qrcodeErrorMsg || '请到手机百度进行高级实名操作';
                    me.$show(me.getElement('IDCertifyQrcodeMain'));
                    return;
                }

                me.createChannel(passport.spareWData.sign);
                me.getElement('IDCertifyQrcodeMainImg').src = passport.spareWData.channelimg;
                if (me.config.animation) {
                    me.qrcodeAnimationShow();
                    setTimeout(function () {
                      me.qrcodeAnimationHide();
                    },300);
                }
                me.$show(me.getElement('IDCertifyQrcodeMain'));

                var urlData = {
                    "page": "IDCertifyQrcode",
                    "source": "pc",
                    "tpl": me.config.product || ''
                }
                var auto_statisticObj = {
                    "eventType": "getQrcodeSuccess"
                }
                me._logPass(urlData, auto_statisticObj);

                var returnValue = me.fireEvent('getQrcodeSuccess');
            },
            error: function(){
                baidu('.IDCertifyQrcode-status-con',me.getElement('IDCertifyQrcodeWrapper')).hide();
                me.$show(me.getElement('IDCertifyQrcodeError'));
            }
        });
    },

    /*
      轮询扫码状态
    */
    createChannel: function(sign){
        var me = this;
        var qrcodeSign = sign;
        passport.spareWData = passport.spareWData || {};
        var data = {};
        data.channel_id = passport.spareWData.sign;
        data.tpl = me.config.product || '';
        data.subpro = me.config.subpro;
        baidu.ajax({
            url: me._domain.https + '/channel/unicast?v=' + (new Date().getTime()),
            dataType: 'jsonp',
            data: data,
            success: function(rsp){
                if (rsp.channel_v) {
                  try {
                    rsp.channel_v = eval('(' + rsp.channel_v + ')');
                  } catch (e) {
                    rsp.channel_v = {};
                  }
                } else {
                  rsp.channel_v = {};
                }
                if (rsp.errno == '0' && rsp.channel_v.status == '0') {
                    var returnValue = me.fireEvent('IDCertifyQrcodeSuccess', {
                        callbackkey: rsp.channel_v.key || ''
                    });
                    if (!returnValue) {
                      return;
                    }
                    window.location.href = rsp.channel_v.u;
                } else {
                    if (rsp.errno == '0' && rsp.channel_v.status == '1') {
                      var returnValue = me.fireEvent('qrcodeSuccess');
                      if (!returnValue) {
                        return;
                      }
                      baidu('.IDCertifyQrcode-status-con', me.getElement('IDCertifyQrcodeWrapper')).hide();
                      me.$show(me.getElement('IDCertifyQrcodeSuccess'));
                    }
                    if (rsp.errno == '0' && rsp.channel_v.status == '3') {
                        var returnValue = me.fireEvent('productExamine');
                        if (!returnValue) {
                          return;
                        }
                    }
                    if (rsp.errno == '0' && rsp.channel_v.status == '2') {
                        baidu('.IDCertifyQrcode-status-con', me.getElement('IDCertifyQrcodeWrapper')).hide();
                        me.$show(me.getElement('IDCertifyQrcodeRefresh'));
                    }
                    if(qrcodeSign === passport.spareWData.sign){
                      me.createChannel(qrcodeSign)
                    }
                }
            },
            error: function(){
                baidu('.IDCertifyQrcode-status-con',me.getElement('IDCertifyQrcodeWrapper')).hide();
                me.$show(me.getElement('IDCertifyQrcodeError'));
            }
        });
    },

    /*
      手机操作通知pc端
    */
    noticeWeb: function(){
      var me = this;
      var data = {};
      baidu.ajax({
          url: me._domain.https + '/channel/noticeWeb?v=' + (new Date().getTime()),
          dataType: 'jsonp',
          data: data,
          success: function(rsp){
              if (rsp.errInfo.no == 0) {
                baidu('.IDCertifyQrcode-status-con',me.getElement('IDCertifyQrcodeWrapper')).hide();
                me.$show(me.getElement('IDCertifyQrcodeSuccess'));
                var returnValue = me.fireEvent('IDCertifyQrcodeSuccess');
                if (!returnValue) {
                  return;
                }
                setTimeout(function () {
                  window.location.href = rsp.data.u;
                },1000);
              } else {
                baidu('.IDCertifyQrcode-status-con',me.getElement('IDCertifyQrcodeWrapper')).hide();
                me.$show(me.getElement('IDCertifyQrcodeRefresh'));
              }
          },
          error: function(){
              baidu('.IDCertifyQrcode-status-con',me.getElement('IDCertifyQrcodeWrapper')).hide();
              me.$show(me.getElement('IDCertifyQrcodeError'));
          }
      });
    },

    /*
    二维码动画显示
    */
    qrcodeAnimationShow: function() {
      var me = this;
      if (me.supportCss3Anim()) {
        baidu(me.getElement('IDCertifyQrcodeMain')).removeClass('IDCertifyQrcode-animationRight').addClass('IDCertifyQrcode-animation');
      }else {
        baidu(me.getElement('IDCertifyQrcodeMain')).css('margin-left','39px');
      }
      baidu(me.getElement('IDCertifyQrcodeAnimation')).addClass('IDCertifyQrcode-status-guideAnim');
    },

    /*
    二维码动画隐藏
    */
    qrcodeAnimationHide: function() {
      var me = this;
      baidu(me.getElement('IDCertifyQrcodeAnimation')).removeClass('IDCertifyQrcode-status-guideAnim');
      if (me.supportCss3Anim()) {
        baidu(me.getElement('IDCertifyQrcodeMain')).removeClass('IDCertifyQrcode-animation').addClass('IDCertifyQrcode-animationRight');
      }else {
        baidu(me.getElement('IDCertifyQrcodeMain')).css('margin-left','99px');
      }
    },

    init : function(callback){
        var me = this;
        me.getQrcode();
        baidu(me.getElement('IDCertifyQrcodeRefreshBtn')).on('click', function(){
          me.getQrcode();
        });
        if (me.config.animation) {
          baidu(me.getElement('IDCertifyQrcodeMain')).on('mouseenter',function(e){
            if(e && e.preventDefault) {
                e.preventDefault();
            }
            var returnValue = me.fireEvent('fieldMouseenter', {
                ele: baidu(this)
            });
            if(!returnValue) return;
            me.qrcodeAnimationShow();
          });
          baidu(me.getElement('IDCertifyQrcodeMain')).on('mouseleave',function(e){
              if(e && e.preventDefault) {
                  e.preventDefault();
              }
              var returnValue = me.fireEvent('fieldMouseleave', {
                  ele: baidu(this)
              });
              if(!returnValue) return;
              me.qrcodeAnimationHide();
          });
        }

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

        var returnValue = me.fireEvent('renderFinish', {
             ele: this
        });
        if(!returnValue) return;

        me.init();
    },

    $dispose: function(){
        var me = this;
        if(me.disposed){return;}
        baidu.dom(me.getElement()).removeClass(me.constant.CONTAINER_CLASS);
        me.getElement().removeChild(me.getElement('form'));
        magic.Base.prototype.$dispose.call(me);
    }
});

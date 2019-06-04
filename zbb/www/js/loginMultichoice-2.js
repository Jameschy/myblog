///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 补填用户名模块
 * @class
 * @name magic.passport.loginMultichoice
 * @grammar new magic.passport.loginMultichoice(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.loginMultichoice} magic.passport.loginMultichoice 实例
 * @superClass magic.passport
 */
magic.passport.loginMultichoice = baidu.lang.createClass(function(options){
	var me = this;
	me.config = {
		phone:'',
		userList:[
			{
				portrait:'',
				username:''
			}
		]
	};
	baidu.extend(me.config, options);
	this.module = 'loginMultichoice';
	me.constant = {
		CONTAINER_CLASS: 'tang-pass-fill',
		FOCUS_CLASS: 'pass-text-input-focus',
		HOVER_CLASS: 'pass-text-input-hover',
		ERROR_CLASS: 'pass-text-input-error'
	};
	
	//init lang
	me.lang = passport.err.getCurrent().labelText.loginMultichoice;
},{
    type: "magic.passport.loginMultichoice",
    superClass: magic.passport
}).extend({
	_format:function(source, opts) {
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
    },
	_getPortraitUrl:function(portrait){
		if(window.location.protocol.toLowerCase()=="https:" || document.location.protocol.toLowerCase()=="https:"){
			return
		}else{
			return 'http://himg.bdimg.com/sys/portrait/item/'+portrait+'.jpg'
		}
	},
	_getTemplate: function(containerId){
		var me = this,
		templateStr  = '<div id="'+me.$getId('loginMultichoice')+'" class="pass-multichoice">'+
							'<h3 class="pass-title pass-title-multichoice">'+me._format(me.lang.title,{phone:me.config.phone})+'</h3>'+
							'<ul class="pass-ul pass-ul-multichoice" id="'+me.$getId('loginMultichoice_ul')+'">';
		for(var i = 0 ; i < me.config.userList.length; i++){
			var classType = 'pass-item-normal'
			if(i ==0){
				classType = 'pass-item-first'
			}else if(i == (me.config.userList.length-1)){
				classType = 'pass-item-last'
			}

			var portraitUrl = me._getPortraitUrl(me.config.userList[i].portrait);

			templateStr += '<li class="pass-list pass-list-multichoice">'+
								'<a class="pass-item pass-item-content '+classType+' clearfix" data-username="'+me.config.userList[i].username+'">'+
									(portraitUrl?('<img src='+portraitUrl+' class="pass-item-portrait">'):'<span class="pass-item-portrait-default"></span>')+
									'<span class="pass-item-username">'+me.config.userList[i].username+'</span>'+
								'</a>'
							'<li>';
		}
		templateStr += '</ul></div>';
		
		return templateStr;
	},
	/**
	 * @description render 渲染组件到页面
	 * @function
	 * @name magic.passport.loginMultichoice#render
	 * @grammar magic.passport.loginMultichoice#render(id)
	 * @param {String} id 渲染到的容器的 id
	 */
	render: function(id){
		var me = this;

		if (!me.getElement()) {
            me.$mappingDom('', id || document.body);
        }
        var target = baidu(me.getElement()),//baidu('#'+id),
			template = me._getTemplate();

        target.addClass(me.constant.CONTAINER_CLASS);
        for(var i=0;i<baidu(template).length;i++){
			target.get(0).appendChild(baidu(template).get(i));
        }

        var returnValue = me.fireEvent('render');
		if(!returnValue) return;
        					
		me._init();
	},
	_init:function(){
		var me = this;
		baidu('.pass-item',me.getElement('loginMultichoice_ul')).on('click',function(evt){
			evt.preventDefault();

			var $item = baidu(this),
				choicedUser = $item.attr('data-username');

			var returnValue = me.fireEvent('choicedUser', {
				evt: evt,
				username: choicedUser
			});
			if(!returnValue) return;
		})
	}
});
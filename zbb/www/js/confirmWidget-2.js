///import baidu.lang.createClass;
///import baidu.extend;
///import baidu.form.json;
///import baidu.dom.addClass;
///import baidu.dom.removeClass;
///import magic.passport;

/**
 * @description passport 补填用户名模块
 * @class
 * @name magic.passport.confirmWidget
 * @grammar new magic.passport.confirmWidget(options)
 * @param {Object} options 配置项
 * @param {Boolean} options.charset 页面编码
 * @param {String} options.product 产品线标识
 * @param {String} options.staticPage 本域下部署的jump地址
 * @return {magic.passport.confirmWidget} magic.passport.confirmWidget 实例
 * @superClass magic.passport
 */
magic.passport.confirmWidget = baidu.lang.createClass(function(options){
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
	this.module = 'confirmWidget';
	me.constant = {
		CONTAINER_CLASS: 'tang-pass-fill'
	};
	
	//init lang
	me.lang = passport.err.getCurrent().labelText.confirmWidget;
},{
    type: "magic.passport.confirmWidget",
    superClass: magic.passport
}).extend({
	_getTemplate: function(containerId){
		var me = this,
		templateStr  = '<div id="'+me.$getId('confirmWidget')+'" class="pass-confirmwidget">';

		templateStr += 		me.config.contentHTML;

        templateStr += '<div id="' + me.$getId('confirmWidget_footer') + '" class="pass-confirmwidget-bottom"' + (me.config.noFoot && (me.config.noFoot == 1) ? 'style="display:none"' : '') + '>'
                        + (me.config.Cancel !== 'delete' ? ('<button id="' + me.$getId('confirm_cancel')
                        + '" class="pass-button pass-button-grey cancel" data-action="cancel">'
                        + (me.config.Cancel || me.lang.Cancel) + '</button>') : '')
                        + (me.config.Continue !== 'delete' ? ('<button id="' + me.$getId('confirm_continue')
									+ '" class="pass-button pass-button-blue continue" data-action="jixu">'
									+ (me.config.Continue || me.lang.Cancel) + '</button>') : '')
							+ '</div>'

		templateStr += '</div>';
		
		return templateStr;
	},
	/**
	 * @description render 渲染组件到页面
	 * @function
	 * @name magic.passport.confirmWidget#render
	 * @grammar magic.passport.confirmWidget#render(id)
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
		baidu(me.getElement('confirmWidget_footer')).on('click',function(evt){
			evt.preventDefault();

			var $item = baidu(evt.target),
				currentAction = $item.attr('data-action');

			if(currentAction=='cancel'){
				var returnValue = me.fireEvent('confirmCancel', {
					evt: evt
				});
				if(!returnValue) return;			
            } else if (currentAction === 'jixu') {
				var returnValue = me.fireEvent('confirmContinue', {
					evt: evt
				});
				if(!returnValue) return;				
			}
		})
	}
});
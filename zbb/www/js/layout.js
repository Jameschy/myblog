/**
 * @file layout.js
 */
(function () {
    var isMobile = $('#is-mobile').val();
    var url = window.location.search.split('?');
    if (typeof url[1] === 'undefined') {
        var language = 'ch';
    } else {
        var param = url[1];
        var language = param !== '' ? param.split('=')[1] : 'ch';
    }
    var nextLanguage = '';
    if (language === 'en') {
        nextLanguage = 'CH';
    } else {
        nextLanguage = 'EN';
    }
    $('.toggle-language').text(nextLanguage.toUpperCase());

    // var showLogin = '{%$showLogin%}';
    // var oldUrl = '{%$oldUrl%}';
    var config = {
        tangram: true,
        cache: true,
        apiOpt: {
            // 产品线标志，原tpl
            product: 'crt',
            // jump地址，注意大小写
            staticPage: location.protocol + '//' + location.host + '/v3Jump.html',
            // 记住登录状态，原isMen
            memberPass: true,
            // 登录成功跳转地址
            u: ((window.oldUrl !== '') ? window.oldUrl : window.location.protocol + '//'
                + window.location.host + '/mark/home/index')
        },
        // 忘记密码
        forgetLink: 'http://passport.baidu.com/?getpass_index',
        registerLink: 'https://passport.baidu.com/v2/?reg&tpl=crowdtest&u=http%3A%2F%2Ftest.baidu.com%2F',
        // 产品图片
        // img: '/mark/static/img/zhongbao/pass_login_logo.png',
        onLoginSuccess: function (args) {
            // 登录成功后，执行回调函数，在跳转到U之前触发
        }
    };

    if (!isMobile) {
        config.img = '/mark/static/img/zhongbao/pass_login_logo.png';
    }

    var instace = window.passport.pop.init(config);

    if (parseInt(window.showLogin, 10) === 1) {
        instace.show();
    }

    var currentYear = new Date().getFullYear() + '';
    $('#footerYear').text(currentYear);
    $('#js_pass_login_btn').click(function () {
        instace.show();
    });
    $('#js_pass_console_btn').click(function () {
        if (parseInt(window.userId, 10) === 0) {
            $('#js_pass_login_btn').click();
            return false;
        }
    });

    $('.toggle-language').on('click', function () {
        // url方式
        var language = $(this).text().toUpperCase();
        if (language === 'EN') {
            window.location.search = '?language=en';
        } else {
            window.location.href = window.location.href.replace(/\?language=en/g, '');
        }
    });

    function getScrollTop() {
        var sTop = document.body.scrollTop + document.documentElement.scrollTop;
        return sTop;
    }

    if (isMobile) {
        // 切换导航栏
        var navItem = $('.zui-header-menu-item');
        navItem.on('click', function () {
            $(this).addClass('zui-header-menu-item-checked').siblings('li').removeClass('zui-header-menu-item-checked');
            $(this).find('.zui-header-inner-nav').show();
            $(this).siblings('li').find('.zui-header-inner-nav').hide();
        });

        var innerNavItem = $('.zui-header-inner-menu-item');
        innerNavItem.on('click', function () {
            $('.zui-header-inner-nav').hide();
        });

        $('body > *').on('click', function (e) {
            var event = e || window.event;
            var target = event.target || event.srcElement;
            if (target.className !== 'nav-link') {
                $('.zui-header-inner-nav').hide();
            }
        });

        // 移动端导航栏固定
        var nav = $('.zui-header-menu');
        var navTopHeight = $('.zui-header-wrap').height();
        document.onscroll = function () {
            var top = getScrollTop();
            if (navTopHeight <= top) {
                nav.addClass('nav-fixed-top');
            } else {
                nav.removeClass('nav-fixed-top');
            }
        };

    }


    var path = window.location.pathname.split('/');
    var module = path[1];
    var controller = path[2];
    var action = path[3];
    var footer = $('.zui-footer');
    if (!module && !controller && !action) {
        footer.css({
            'margin-bottom': '1.2rem'
        });
    }
    var modelMap = {
        'index': ['index'],
        'service': ['collection', 'mark', 'crawl', 'survey'],
        'case': ['case'],
        'solution': ['autoPilot', 'securitySolution', 'publicOpinion', 'faceRecognition', 'ocr', 'speechSolution'],
        'dataStore': ['dataStore'],
        'about': ['about'],
        'contact': ['contact']
    };
    if (module === 'mark' && controller === 'home') {
        var currentModel;
        Object.keys(modelMap).forEach(function (key) {
            if (modelMap[key].indexOf(action) !== -1) {
                currentModel = key;
            }
        });
        if (currentModel === 'index') {
            footer.css({
                'margin-bottom': '1.2rem'
            });
        }
        $('.zui-header-menu-item-' + currentModel).addClass('zui-header-menu-item-checked');
    }

})();
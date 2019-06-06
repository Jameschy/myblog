/**
 * @file Describe the file
 */
function _(name) {
    alert('undefined:' + name);
}

var passport = passport || window.passport || {};
passport.err = passport.err || {};
(function (ns) {
    var lang = null;

    if ((typeof (ns.getCurrent)).toLowerCase() === 'function') {
        lang = ns.getCurrent();
    } else {
        lang = {
            errMsg: {},
            labelText: {}
        };
    }

    lang.errMsg.login = {
        '-1': {msg: 'System error. Please try again later.', field: ''},
        '3': {msg: 'The verification code does not exist or has expired. Please re-enter it.', field: ''},
        '5': {msg: '', field: ''},
        '6': {msg: 'Your verification code is incorrect.', field: ''},
        '16': {msg: 'Your account has been restricted due to security issues. Please feedback.', field: ''},
        '257': {msg: 'Please enter the verification code.', field: ''},
        '100027': {msg: 'Baidu is upgrading the system. No available services now. Thanks for your cooperation.', field: ''},
        '120016': {msg: '', field: ''},
        '17': {msg: 'Your account has been locked.', field: ''},
        '18': {msg: '', field: ''},
        '19': {msg: '', field: ''},
        '20': {msg: '', field: ''},
        '21': {msg: 'No login permission.', field: ''},
        '22': {msg: '', field: ''},
        '23': {msg: '', field: ''},
        '24': {msg: 'System Updating', field: ''},
        '400032': {msg: '', field: ''},
        '400034': {msg: '', field: ''},
        '401007': {msg: 'Your phone number is associated with other accounts. Please choose one.', field: ''},
        '500010': {msg: 'Too frequent login. Please try again 24 hours later.', field: ''},
        '200010': {msg: 'The verification code does not exist or has expired.', field: ''},
        '100005': {msg: 'System error. Please try again later.', field: ''},
        '100023': {msg: 'Open the Cookies to log in. How to open?', field: ''},
        '400401': {msg: '', field: ''},
        '400037': {msg: '', field: ''},
        '50024': {msg: 'Too frequent registration. Please try again later.', field: ''},
        '400413': {msg: 'Your account has been temporarily frozen due to security issues.', field: ''},
        '400414': {msg: 'Your account has been locked.', field: ''},
        '400415': {msg: 'Your account has been locked.', field: ''},
        '50030': {msg: 'Sorry, the number of applications for this phone number has reached the limit for today. Please change a phone number.', field: ''},
        '50031': {msg: 'Sorry, the number of applications for this phone number has reached the limit for this month. Please change a phone number.', field: ''},
        '50032': {msg: 'Sorry, the number of applications for this phone number has reached the limit for three months. Please change a phone number.', field: ''}
    };

    lang.errMsg.checkVerifycode = {
        '500002': {msg: 'The verification code you entered is incorrect.', field: ''},
        '500018': {msg: 'The verification code is invalid. Please try again.', field: ''}
    };

    lang.labelText.login = {
        'smslogin': 'SMS Login',
        'smstitle': 'Verify for login. It will create a Baidu account automatically if you haven’t registered.',
        'agree': 'Read and accept ',
        'baiduUserProtocal': 'Baidu User Protocol',
        'verifyCode': 'verification code',
        'resend': 'Resend',
        'verifyCodeStaErr': 'The verification code you entered is incorrect.',
        'verifyCodeLenErr': 'The verification code you entered is incorrect.',
        'captcha': 'verification code',
        'captchaErr': 'The dynamic password you entered is incorrect. Please try again.',
        'login': 'log in',
        'register': 'Register now',
        'phoneNum': 'phone number',
        'passwordResetSms': 'SMS login',
        'smsPhone': 'phone number',
        'smsPhoneMsg': 'Please enter your phone number.',
        'smsVerifyCode': 'dynamic password',
        'smsVerifyCodeSend': 'Send a dynamic password',
        'logining': 'logging in',
        'loginsuccess': 'Login Successful',
        'submitTimeup': 'Login timeout. Please try again later.',
        'appHref': 'http://xbox.m.baidu.com/mo/',
        'sysError': 'System error. Have a rest. Please try again later.',
        'sysUpdate': 'The service is being upgraded. Please try again later.',
        'cookieDisable': 'Open the Cookies to log in. How to open?',
        'captchaErr': 'incorrect dynamic password',
        'confirmVerCodeEmpty': 'The verification code is empty. ',
        'foreignMobileError': 'Incorrect phone number format ',
        'foreignMobileMsg': 'Foreign phone number login. Please Select Your Country',
        'foreignMobileLink': 'Foreign phone number'
    };

    ns.getCurrent = function () {
        return lang;
    };
})(passport.err);
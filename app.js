//app.js
const utils = require('/utils/util.js');
const authorize = require('/utils/authorize.js');
var app = {
    utils,
    authorize,
    data: {
        code: "",
        // api: "https://applet.utoapi.com/oli/",
        socketApi: "wss://wss.hkyx365.com",
        api: "https://oil.hkyx365.com/oli/",
        token: "",
        img: "",
        latitude: "",
        longitude: "",
        text_: true,
        car_type: "",
        car_id: ""
    },
    onLaunch: function () {
        let _token = wx.getStorageSync("token") || false;
        if(_token){
            authorize.login().then(function (res) {
                console.info('onLaunch:',res)
            }).catch(function (err) {
                console.warn('onLaunch:',err)
            })
        }
        wx.showShareMenu({
            withShareTicket: true,
            title: '中国石油',
            path: '/page/index/index'
        });
    },
    globalData: {
        userInfo: null,
        onLogined: false,
        formIds: [],
        _isFirstClean: true
    },
    onShareAppMessage: function () {
        return utils.share.getShareInfo();
    },
    dealFormIds: function(formId) {
        let formIds = app.globalData.formIds;//获取全局数据中的推送码gloabalFomIds数组
        if (!formIds) formIds = [];
        if(formId && formId != "the formId is a mock one"){
            let data = {
                formId: formId,
                expire: parseInt(new Date().getTime() / 1000)+604800 //计算7天后的过期时间时间戳
            };
            formIds.push(data);//将data添加到数组的末尾
        }
        app.globalData.formIds = formIds; //保存推送码并赋值给全局变量
    }
};
App(app);
//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    title:""
  },
  onLoad: function (option) {
    var question_id=option.id;
    var post_url=app.data.api;
    var token=app.data.token ? app.data.token : wx.getStorageSync('token');
    var that=this;
    wx.request({
      url: post_url + 'asset/signinrule', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        question_id: question_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          var article = res.data.datas
          WxParse.wxParse('article', 'html', article, that, 5);
        }else{
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          });
        }
      },
    })
  }
})

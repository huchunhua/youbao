//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util.js');

app.authorize.interceptors.identity({
  data: {
    avaterimg:'https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/oil/person/avater_bg.png',
    options:''
  },
  toIntegraldetail:function(){
    wx.navigateTo({
      url: '../integraldetail/index'
    })
  },
  onLoad: function (options) {
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var post_url = app.data.api;
    var type = this.data.type;
    console.log(options);
    that.setData({
      options: options
    })
    wx.request({
      url: post_url + 'member/getLevelSetting', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        type: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          that.setData({
            data : res.data.datas
          })
        } else {
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  }
});

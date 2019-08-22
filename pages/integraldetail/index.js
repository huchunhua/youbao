//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util.js');

app.authorize.interceptors.identity({
  data: {
    type:0,
    income:"",
    list:"",
    list1:"",
    list2:"",
    reduce:"",
    amount:"",
  },
  onLoad: function () {
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var post_url = app.data.api;
    var type = this.data.type;
    wx.request({
      url: post_url + 'member/integral', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        type: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            amount: res.data.datas.amount,
            income: res.data.datas.income,
            list: res.data.datas.list,
            reduce: res.data.datas.reduce
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
    wx.request({
      url: post_url + 'member/integral', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        type: 1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            list1: res.data.datas.list,
          })
        } else {
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
    wx.request({
      url: post_url + 'member/integral', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        type: 2
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            list2: res.data.datas.list,
          })
        } else {
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  click:function(e){
    this.setData({
      type: e.currentTarget.dataset.id
    });
  }
});

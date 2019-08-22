//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    type:0,
    date:"",
    total:"",
    list1:"",
    list2:"",
    end_time:""
  },
  onLoad: function (option) {
    var type=option.type;
    if(type==1){
      this.setData({
        type:1
      })
    }
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var now = Y +"-"+ M ;

    this.setData({
      date:now,
      end_time:now
    })
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    // var token = '52843427acc9ed3ec812f5f9a8fac252';
    var post_url = app.data.api;
    var type = this.data.type;
    wx.request({
      url: post_url + 'bill/index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        time: that.data.date
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            total: res.data.datas.bill_money,
            list1:res.data.datas.bill_1,
            list2:res.data.datas.bill_2
          })
        } else {

        }
      }
    })
  },
  change: function (e) {
    this.setData({
      date: e.detail.value
    });

    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    // var token = '52843427acc9ed3ec812f5f9a8fac252';
    var post_url = app.data.api;
    var type = this.data.type;
    wx.request({
      url: post_url + 'bill/index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        time: that.data.date
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            total: res.data.datas.bill_money,
            list1: res.data.datas.bill_1,
            list2: res.data.datas.bill_2
          })
        } else {

        }
      }
    })
  },
  click:function(e){
    var id =e.currentTarget.dataset.id;
    this.setData({
      type:id
    })
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var post_url = app.data.api;
    var type = this.data.type;
    wx.request({
      url: post_url + 'bill/index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        time: that.data.date
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            total: res.data.datas.bill_money,
            list1: res.data.datas.bill_1,
            list2: res.data.datas.bill_2
          })
        } else {

        }
      }
    })
    wx.stopPullDownRefresh();
  },
  go_detail:function(e){
    var type = e.currentTarget.dataset.type;
    var order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../bill_detail/index?type=' + type + "&id=" + order_id,
    })
  }
})

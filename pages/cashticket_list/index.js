//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    list:"",
    type:1,
    coupon_type:''
  },
  onLoad: function (options) {
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var that = this;
    var coupon_type = options.coupon_type
    that.setData({
      coupon_type: coupon_type
    })
    wx.request({
      url: post_url + 'member/my_new_coupon', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.datas
          })
        }
      }
    })
  },
  nav:function(e){
    this.setData({
      type: e.currentTarget.dataset.id
    });
  },
  click:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../ticket_detail/index?id='+id,
    })
  }
})

//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    add_time: "",
    coupon_title: "",
    discount_amount: "",
    goods_name: "",
    order_amount: "",
    order_sn: "",
    order_state: "",
    pay_amount: "",
    payment_code: "",
    store_name: "",
    trade_no:"",
    payment_time:""
  },
  onLoad: function (option) {
    var type=option.type;
    var order_id=option.id;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var post_url = app.data.api;
    wx.request({
      url: post_url + 'bill/detail', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        type: type,
        order_id: order_id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            add_time: res.data.datas.add_time,
            coupon_title: res.data.datas.coupon_title,
            discount_amount: res.data.datas.discount_amount,
            goods_name: res.data.datas.goods_name,
            order_amount: res.data.datas.order_amount,
            order_sn: res.data.datas.order_sn,
            order_state: res.data.datas.order_state,
            pay_amount: res.data.datas.pay_amount,
            payment_code: res.data.datas.payment_code,
            payment_time: res.data.datas.payment_time,
            store_name: res.data.datas.store_name,
            trade_no: res.data.datas.trade_no,
          })
        } else {

        }
      }
    })
  }
})

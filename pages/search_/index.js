//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    shop:"",
    keyword:""
  },
  onLoad: function () {

    // var data=new Date();
    // var day = data.getDay();
    // console.log(day);
  },
  go_shop:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../station_detail/index?id="+id,
    });
  },
  search:function(){
    wx.showLoading({
      title: '加载中',
    });
    var post_url = app.data.api;
    var that = this;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    wx.request({
      url: post_url + 'index/index_search', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        longitude: wx.getStorageSync('longitude'),
        latitude: wx.getStorageSync('latitude'),
        keyword: that.data.keyword,
        type:1
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if(res.data.datas!=""){
            that.setData({
              shop: res.data.datas.seller_all
            });
          }
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
  change:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  address_click: function (e) {
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var name = e.currentTarget.dataset.name
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      scale: 15
    })
  }
})
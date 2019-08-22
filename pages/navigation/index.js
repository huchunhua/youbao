//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    makers: [],
    longitude: "",
    latitude: "",
    seller_all:"",
    num:"",
    oil_id:"",
    oil_name:"",
    foa_show:false,
    floa:"show",
    keyword:"",
    mark_id:1
  },
  onLoad: function () {
    var that=this;
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    this.mapCtx = wx.createMapContext('myMap');
    this.setData({
      makers: [{
        id: that.data.mark_id,
        longitude: wx.getStorageSync('longitude'),
        latitude: wx.getStorageSync('latitude')
      }],
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude'),
      mark_id: that.data.mark_id+1
    });
    
    wx.request({
      url: post_url + 'nearby/oil_category', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        if (res.data.code == 200) {
            that.setData({
              num:res.data.datas,
              oil_id:res.data.datas[0].children[0].id,
              oil_name: res.data.datas[0].children[0].oil_name,
            });

          wx.request({
            url: post_url + 'navigate/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
              token: token,
              oil: that.data.oil_id,
              longitude: wx.getStorageSync('longitude'),
              latitude: wx.getStorageSync('latitude'),
              keyword: that.data.keyword
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == 200) {
                var arr = [{ latitude:wx.getStorageSync('latitude'), longitude: wx.getStorageSync('longitude')}];
                for (var x in res.data.datas.seller_all){
                  var mark_id = that.data.mark_id;
                  arr[arr.length] = { id: mark_id, latitude: res.data.datas.seller_all[x].seller_latitude, longitude: res.data.datas.seller_all[x].seller_longitude, iconPath: "/image/marker_icon_hover.png", width: 30, height: 33}
                  that.setData({
                    mark_id: mark_id+1
                  })
                }
                that.setData({
                  seller_all: res.data.datas.seller_all,
                  makers:arr,
                  longitude: wx.getStorageSync('longitude'),
                  latitude: wx.getStorageSync('latitude')
                });
              } else {
                wx.showToast({
                  title: res.data.datas.error,
                  icon: 'none',
                  duration: 2000
                });
              }
            }
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
  },
  go_detail:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../station_detail/index?id='+id,
    })
  },
  go_na:function(e){
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var name = e.currentTarget.dataset.name
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      scale: 15
    })
  },
  num_click:function(e){
    wx.showLoading({
      title: '加载中',
    });
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var that=this;
    var oil_id = e.currentTarget.dataset.id;
    var oil_name = e.currentTarget.dataset.name;
    this.setData({
      oil_id: oil_id,
      oil_name: oil_name
    });
    wx.request({
      url: post_url + 'navigate/index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        oil: that.data.oil_id,
        longitude: wx.getStorageSync('longitude'),
        latitude: wx.getStorageSync('latitude'),
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var arr = [{ latitude: wx.getStorageSync('latitude'), longitude: wx.getStorageSync('longitude')}];
          for (var x in res.data.datas.seller_all) {
            var mark_id = that.data.mark_id;
            arr[arr.length] = { id: mark_id, latitude: res.data.datas.seller_all[x].seller_latitude, longitude: res.data.datas.seller_all[x].seller_longitude, iconPath: "/image/marker_icon_hover.png", width: 30, height: 33 }
            that.setData({
              mark_id: mark_id + 1
            })
          }
          that.setData({
            seller_all: res.data.datas.seller_all,
            makers: arr,
            longitude: wx.getStorageSync('longitude'),
            latitude: wx.getStorageSync('latitude')
          });
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
  hide:function(){
    this.setData({
      foa_show:false,
      floa:"show"
    })
  },
  show:function(){
    this.setData({
      foa_show: true,
      floa: "hide"
    })
  },
  edit:function(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  markertap:function(e){
    console.log(e);
  },
  search:function(){
    wx.showLoading({
      title: '加载中',
    });
    var that = this;
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    wx.request({
      url: post_url + 'navigate/index', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        oil: that.data.oil_id,
        longitude: wx.getStorageSync('longitude'),
        latitude: wx.getStorageSync('latitude'),
        keyword: that.data.keyword
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          var arr = [{ latitude: wx.getStorageSync('latitude'), longitude: wx.getStorageSync('longitude'), iconPath: "/image/mine_icon.png", width: 20, height: 20 }];
          for (var x in res.data.datas.seller_all) {
            var mark_id = that.data.mark_id;
            arr[arr.length] = { id: mark_id, latitude: res.data.datas.seller_all[x].seller_latitude, longitude: res.data.datas.seller_all[x].seller_longitude, iconPath: "/image/marker_icon_hover.png", width: 30, height: 33 }
            that.setData({
              mark_id: mark_id + 1
            })
          }
          that.setData({
            seller_all: res.data.datas.seller_all,
            makers: arr,
            longitude: wx.getStorageSync('longitude'),
            latitude: wx.getStorageSync('latitude')
          });
        } else {
          wx.showToast({
            title: res.data.datas.error,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  }
})
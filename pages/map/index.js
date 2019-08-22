//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    makers: [],
    longitude: "",
    latitude: "",
    seller_all: "",
    show: true,
    star: "",
    id: "",
    seller_name: "",
    seller_address: "",
    seller_phone: "",
    seller_tag: "",
    seller_time_end: "",
    seller_time_start: "",
    seller_latitude: "",
    seller_longitude: "",
    distance: ""
  },
  onLoad: function (option) {
    var id = option.id;
    wx.hideTabBar({});
    var that = this;
    var post_url = app.data.api;
    this.mapCtx = wx.createMapContext('myMap');
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    this.setData({
      makers: [{
        id: 0,
        longitude: wx.getStorageSync('longitude'),
        latitude: wx.getStorageSync('latitude')
      }],
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
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
          var arr = [{id: 0, latitude: wx.getStorageSync('latitude'), longitude: wx.getStorageSync('longitude')}];
          for (var x in res.data.datas.seller_all) {
            if (res.data.datas.seller_all[x].id == id) {
              arr[arr.length] = {
                id: res.data.datas.seller_all[x].id,
                latitude: res.data.datas.seller_all[x].seller_latitude,
                longitude: res.data.datas.seller_all[x].seller_longitude,
                iconPath: "/image/marker_icon_hover.png",
                width: 40,
                height: 44
              }
            } else {
              arr[arr.length] = {
                id: res.data.datas.seller_all[x].id,
                latitude: res.data.datas.seller_all[x].seller_latitude,
                longitude: res.data.datas.seller_all[x].seller_longitude,
                iconPath: "/image/marker_icon_hover.png",
                width: 30,
                height: 33
              }
            }
          }
          that.setData({
            seller_all: res.data.datas.seller_all,
            makers: arr,
          });
          wx.request({
            url: post_url + 'seller/index_oil', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
              token: token,
              seller_id: id
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              if (res.data.code == 200) {
                that.setData({
                  id: res.data.datas.seller_all[0].id,
                  star: res.data.datas.seller_all[0].seller_star,
                  seller_tag: res.data.datas.seller_all[0].seller_tag,
                  seller_name: res.data.datas.seller_all[0].seller_name,
                  seller_address: res.data.datas.seller_all[0].seller_address,
                  seller_time_start: res.data.datas.seller_all[0].seller_time_start,
                  seller_time_end: res.data.datas.seller_all[0].seller_time_end,
                  seller_phone: res.data.datas.seller_all[0].seller_phone,
                  seller_latitude: res.data.datas.seller_all[0].seller_latitude,
                  seller_longitude: res.data.datas.seller_all[0].seller_longitude,
                  distance: res.data.datas.seller_all[0].distance,
                  latitude: res.data.datas.seller_all[0].seller_latitude,
                  longitude: res.data.datas.seller_all[0].seller_longitude,
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
  markertap: function (e) {
    var arr = this.data.makers;
    var that = this;
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    for (var x in arr) {
      if (arr[x].id == e.markerId) {
        arr[x].iconPath = "/image/marker_icon_hover.png";
        arr[x].width = 40;
        arr[x].height = 44;
      } else if (arr[x].id != 0) {
        arr[x].iconPath = "/image/marker_icon_hover.png";
        arr[x].width = 30;
        arr[x].height = 33;
      }
    }
    this.setData({
      show: true,
      makers: arr,
      longitude: wx.getStorageSync('longitude'),
      latitude: wx.getStorageSync('latitude')
    });
    wx.request({
      url: post_url + 'seller/index_oil', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        seller_id: e.markerId
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            id: res.data.datas.seller_all[0].id,
            star: res.data.datas.seller_all[0].seller_star,
            seller_tag: res.data.datas.seller_all[0].seller_tag,
            seller_name: res.data.datas.seller_all[0].seller_name,
            seller_address: res.data.datas.seller_all[0].seller_address,
            seller_time_start: res.data.datas.seller_all[0].seller_time_start,
            seller_time_end: res.data.datas.seller_all[0].seller_time_end,
            seller_phone: res.data.datas.seller_all[0].seller_phone,
            seller_latitude: res.data.datas.seller_all[0].seller_latitude,
            seller_longitude: res.data.datas.seller_all[0].seller_longitude,
            distance: res.data.datas.seller_all[0].distance,
            latitude: res.data.datas.seller_all[0].seller_latitude,
            longitude: res.data.datas.seller_all[0].seller_longitude,
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
  close: function () {
    this.setData({
      show: false
    })
  },
  go_station: function () {
    var id = this.data.id;
    wx.navigateTo({
      url: "../station_detail/index?id=" + id,
    });
  },
  go_map: function () {
    var latitude = this.data.seller_latitude;
    var longitude = this.data.seller_longitude;
    var name = this.data.seller_name
    wx.openLocation({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      name: name,
      scale: 15
    })
  }
})
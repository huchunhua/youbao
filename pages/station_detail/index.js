//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        station_info: {},
        pageLoaded: false
    },
    onLoad: function (option) {
        var that = this;
        wx.request({
            url: app.data.api + 'seller/station', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                seller_id: option.id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    res.data.datas.seller_intro = res.data.datas.seller_intro.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
                    that.setData({
                        station_info: res.data.datas,
                        pageLoaded: true
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
    toLocation: function () {
        var latitude = this.data.station_info.seller_latitude;
        var longitude = this.data.station_info.seller_longitude;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: this.data.station_info.seller_name,
            scale: 15
        })
    }
})
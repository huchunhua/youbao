//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        list: "",
        pageLoaded: false
    },
    onLoad: function () {
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'question/index', //仅为示例，并非真实的接口地址
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
                        list: res.data.datas,
                        pageLoaded: true
                    })
                } else {
                    wx.showToast({
                        title: res.data.datas.error,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
        })
    },
    bill: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../help_detail/index?id=' + id
        })
    }
})

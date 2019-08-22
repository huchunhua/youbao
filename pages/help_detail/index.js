const app = getApp()

app.authorize.interceptors.identity({
    data: {
        title: "",
        content: "",
        pageLoaded: false
    },
    onLoad: function (option) {
        var that = this;
        wx.request({
            url: app.data.api + 'question/question', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                question_id: option.id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        title: res.data.datas.question_title,
                        content: res.data.datas.question_content,
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
    }
})

//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        code: ""
    },
    onLoad: function (option) {
    },
    bindGetUserInfo: function (e) {
        wx.showLoading({
            title: '授权中',
            mask: true
        });
        var that = this;
        //接下来写业务代码
        var post_url = app.data.api;

        // 登录
        wx.login({
            success: result => {
                wx.getUserInfo({
                    success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        // this.globalData.userInfo = res.userInfo
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                        let data = res.encryptedData;
                        let iv = res.iv;
                        let _pid = wx.getStorageSync('_pid')
                        let params = {
                            code: result.code,
                            data: data,
                            iv: iv
                        };
                        if(_pid) Object.assign(params,{pid:_pid});
                        app.data.img = res.userInfo.avatarUrl;
                        wx.request({
                            url: post_url + 'login/grant', 
                            method: "POST",
                            data: params,
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                                wx.hideLoading();
                                if (res.data.code == 200) {
                                    app.data._id = res.data.datas.id;
                                    app.data.token = res.data.datas.token;
                                    wx.setStorageSync('_id', res.data.datas.id);
                                    wx.setStorageSync('token', res.data.datas.token);
                                    wx.setStorageSync('_isFirstLogin', res.data.datas.isFirstLogin);
                                    wx.navigateTo({
                                        url: "/pages/index/index"
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
                    }, fail: function () {
                        //获取用户信息失败后。请跳转授权页面
                        wx.showToast({
                            icon: "none",
                            title: '必须要授权才能继续使用小程序！',
                        })
                    }
                })
            }
        })
    }

})

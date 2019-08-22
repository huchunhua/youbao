//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        content:"获取验证码",
        click:true,
        phone:"",
        seccode:"",
        show:1
    },
    onLoad: function (option) {

    },
    change:function(e){
        this.setData({
            phone:e.detail.value
        })
    },
    change_:function(e){
        this.setData({
            seccode: e.detail.value
        })
    },
    click:function(){
        var post_url=app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var mobile=this.data.phone;
        var that = this;
        var phone_ =/^[1][1-9]{1}[0-9]{9}$/;
        // var phone_ = new RegExp('[1][1-9]{1}[0-9]{9}', 'g');
        if (!phone_.test(mobile)){
            wx.showToast({
                title: '手机号码格式错误',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        wx.request({
            url: post_url + 'member/seccode', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                mobile: mobile
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {

                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.datas,
                        icon: 'none',
                        duration: 2000
                    });
                    that.setData({
                        click: false
                    })
                    var num = 60;
                    var tex_ = setInterval(function () {
                        num--;
                        if (num >= 0) {
                            that.setData({
                                content: "重新获取(" + num + "s)"
                            })
                        } else {
                            clearInterval(tex_);
                            that.setData({
                                content: "重新获取",
                                click: true
                            })
                        }
                    }, 1000)
                }else{
                    wx.showToast({
                        title: res.data.datas.error,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
        });
    },
    submit:function(){
        var post_url=app.data.api;
        var that=this;
        var mobile=this.data.phone;
        var seccode = this.data.seccode;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: post_url + 'member/bind', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                mobile: mobile,
                seccode: seccode
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.datas,
                        icon: 'none',
                        duration: 1500,
                        success:function(){
                            setTimeout(function(){
                                wx.switchTab({
                                    url: '../index/index',
                                })
                            },1500)
                        }
                    });
                }else{
                    wx.showToast({
                        title: res.data.datas.error,
                        icon: 'none',
                        duration: 2000
                    });
                }
            },
        });
    },
    getPhoneNumber: function (e) {
        wx.showLoading({
            title: '绑定中',
        });
        console.log(e.detail.errMsg);
        console.log(e.detail.iv);
        console.log(e.detail.encryptedData);
        var iv = e.detail.iv;
        var data = e.detail.encryptedData;
        var post_url = app.data.api;
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                wx.request({
                    url: post_url + 'login/decrypt', //仅为示例，并非真实的接口地址
                    method: "POST",
                    data: {
                        code: res.code,
                        iv: iv,
                        data: data,
                        token:token
                    },
                    header: {
                        'content-type': 'application/json' // 默认值
                    },
                    success: function (res) {
                        wx.hideLoading();
                        if (res.data.code == 200) {
                            var mobile = res.data.datas.phoneNumber;
                            wx.request({
                                url: post_url + 'member/bind_mobile', //仅为示例，并非真实的接口地址
                                method: "POST",
                                data: {
                                    token: token,
                                    mobile: mobile
                                },
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success: function (res) {
                                    if (res.data.code == 200) {
                                        wx.showToast({
                                            title: res.data.datas,
                                            icon: 'none',
                                            duration: 1500,
                                            success: function () {
                                                setTimeout(function () {
                                                    wx.switchTab({
                                                        url: '../index/index',
                                                    })
                                                }, 1500)
                                            }
                                        });
                                    } else {
                                        wx.showToast({
                                            title: res.data.datas.error,
                                            icon: 'none',
                                            duration: 2000
                                        });
                                    }
                                },
                            });

                        } else {
                            wx.showToast({
                                title: res.data.datas.error,
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    },
                });
            }
        })
        this.setData({
            show: 0
        })
    },
    hide:function(){
        this.setData({
            show:0
        })
    }
})

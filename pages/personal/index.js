//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        img: "",
        phone: "",
        nickname: "",
        blind: "",
        pageLoaded: false,
        percent:40,
    },
    onLoad: function () {
        this.setData({
            img: app.data.img
        });
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'member/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    var member_level = res.data.datas.member_level;
                    if(member_level == 0){
                        that.setData({
                            percent: 10
                        })
                    }else if (member_level == 1){
                        that.setData({
                            percent: 40
                        })
                    }else if (member_level == 2){
                        that.setData({
                            percent: 70
                        })
                    }else if (member_level == 3){
                        that.setData({
                            percent: 90
                        })
                    };
                    that.setData({
                        blind: res.data.datas.member_isbind,
                        data: res.data.datas,
                        pageLoaded: true,
                    })
                    if (res.data.datas.member_isbind != 0) {
                        that.setData({
                            phone: res.data.datas.member_mobile,
                            nickname: res.data.datas.member_nickname,
                            avatar: res.data.datas.member_avatar
                        })
                    }
                }
            },
        })
    },
    onShow: function () {
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'member/index', //仅为示例，并非真实的接口地址
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
                        blind: res.data.datas.member_isbind,
                        pageLoaded: true
                    })
                    if (res.data.datas.member_mobile != '') {
                        that.setData({
                            phone: res.data.datas.member_mobile,
                            nickname: res.data.datas.member_nickname,
                            avatar: res.data.datas.member_avatar
                        })
                    }
                }
            },
        })
    },
    personal_: function () {
        var blind = this.data.blind;
        if (blind == false) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../personal_/index',
            })
        }
    },
    share: function () {
        wx.navigateTo({
            url: '../share/index?_id=0'
        })
    },
    expect: function(){
        wx.showToast({
            title: '敬请期待',
            icon: "none",
            duration: 2000,
        })
    },
    integral: function () {
        var blind = this.data.blind;
        var name = this.data.data.member_nickname;
        var member_integral = this.data.data.member_integral;
        var member_level = this.data.data.member_level;
        var member_avatar = this.data.data.member_avatar;
        if (blind == 0) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../integral/index?name=' + name + '&member_integral=' + member_integral + '&member_level=' + member_level + '&member_avatar=' + member_avatar,
            });
        }
    },
    ticket: function (e) {
        var blind = this.data.blind;
        var coupon_type = e.currentTarget.dataset.coupontype;
        if (blind == 0) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../ticket_list/index?coupon_type=' + coupon_type,
            })
        }
    },
    cash: function (e) {
        var blind = this.data.blind;
        var coupon_type = e.currentTarget.dataset.coupontype;
        if (blind == 0) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../cashticket_list/index?coupon_type=' + coupon_type,
            })
        }
    },
    bill: function () {
        var blind = this.data.blind;
        if (blind == 0) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../bill/index',
            })
        }
    },
    bill_: function () {
        var blind = this.data.blind;
        if (blind == 0) {
            wx.navigateTo({
                url: '../register/index'
            })
        } else {
            wx.navigateTo({
                url: '../bill/index?type=1',
            })
        }
    },
    help: function () {
        wx.navigateTo({
            url: '../help/index',
        })
    },
    onFollow: function () {
        wx.navigateTo({
            url: '../activity/index?src=' + encodeURIComponent('https://oil.hkyx365.com/pages/#/official'),
        })
    },
    onGotUserInfo(e) {
    var that = this;
    var userInfo = e.detail.userInfo;
    that.setData({
        userinfo: e.detail.userInfo
    })
    wx.setStorageSync('userInfo', userInfo);
  },
    call(){
        wx.makePhoneCall({
          phoneNumber: "400 030 3332" // 仅为示例，并非真实的电话号码
        })
    }
})

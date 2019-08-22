//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        lists: "",
        message: "",
        list: "",
        arr: "",
        show_: false,
        first_list: "",
        isShowGift: false,
        coupon_gift: []
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中',
        });
        var post_url = app.data.api;
        var that = this;
        var keywords = this.data.keywords;
        // var token = app.data.token ? app.data.token : "19a7cd4a080e933e5df8dc30a701a9ff";
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: post_url + 'pay/pay_ok', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var arr = [];
                    for (var x in res.data.datas.coupon_all) {
                        arr[arr.length] = res.data.datas.coupon_all[x].state;
                    }
                    that.setData({
                        lists: res.data.datas.seller_all,
                        message: res.data.datas.message,
                        list: res.data.datas.coupon_all ? res.data.datas.coupon_all : [],
                        arr: arr,
                        show_: false,
                        first_list: res.data.datas.gift.state ? res.data.datas.gift.list : [],
                        isShowGift: res.data.datas.coupon_gift ? res.data.datas.coupon_gift.state : false,
                        coupon_gift: res.data.datas.coupon_gift ? res.data.datas.coupon_gift.list : false
                    });
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
    go_more: function () {
        wx.redirectTo({
            url: '../receive/index',
        });
    },
    get_tic: function (e) {
        //领取优惠券
        wx.showLoading()
        var id = e.currentTarget.dataset.id;
        var eq = e.currentTarget.dataset.eq;
        var arr = this.data.arr;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'coupon/receive', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                tid: id,
                token: token
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.datas.msg,
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                            arr[eq] = 0;
                            that.setData({
                                arr: arr
                            })
                        }
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
    go_shop: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../shop_detail/index?id=' + id,
        })
    },
    go_home: function () {
        wx.navigateTo({
            url: '../index/index',
        })
    },
    get: function (e) {
        wx.showLoading()
        var id = e.currentTarget.dataset.id;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'coupon/receive', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                tid: id,
                token: token
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.showToast({
                        title: res.data.datas.msg,
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                            that.setData({
                                show_: false
                            })
                        }
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
    list_closed: function () {
        this.setData({
            show_: false
        })
    },
    onMemberCoupon: function () {
        wx.navigateTo({
            url: '../ticket_list/index',
        })
    },
    officialLoad: function (e) {
        console.log(e)
    },
    officialError: function (e) {
        console.log(e)
    },
    jumpToNearby() {
        wx.navigateTo({
            url: '../clean/index',
        })
    }
})
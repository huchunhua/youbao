//index.js
//获取应用实例
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
const utils = require('../../utils/util.js');

Page(utils.interceptors.identity({
    data: {
        seller_address: "",
        seller_logo: "",
        seller_name: "",
        seller_phone: "",
        seller_tag: "",
        seller_service: "",
        seller_time_end: "",
        seller_time_start: "",
        seller_intro: "",
        coupon_buy: "",
        coupon_free: "",
        can_get: "",
        seller_longitude: "",
        seller_latitude: "",
        show: false,
        // article: "",
        coupon_title: "",
        coupon_limit: "",
        coupon_money: "",
        coupon_start: "",
        coupon_end: "",
        isShowCouponArea: false,
        pageLoaded: false
    },
    onLoad: function (option) {
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        var id = option.id;
        var from = option.from;
        wx.request({
            url: post_url + 'seller/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                seller_id: id,
                token: token,
                from: from,
                longitude: wx.getStorageSync('longitude'),
                latitude: wx.getStorageSync('latitude')
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    var isShowCouponArea = true;
                    if (res.data.datas.coupon_buy.length > 0 || res.data.datas.coupon_free.length > 0) {
                        isShowCouponArea = false;
                    }
                    var arr_ = []
                    for (var x in res.data.datas.coupon_free) {
                        arr_[arr_.length] = res.data.datas.coupon_free[x].can_get
                    }
                    // var article = res.data.datas.seller_info.seller_info;
                    // if (article != "" && article != null & article != "null") {
                    //     WxParse.wxParse('article', 'html', article, that, 5);
                    // }
                    that.setData({
                        seller_address: res.data.datas.seller_info.seller_address,
                        seller_logo: res.data.datas.seller_info.seller_logo,
                        seller_name: res.data.datas.seller_info.seller_name,
                        seller_phone: res.data.datas.seller_info.seller_phone,
                        seller_tag: res.data.datas.seller_info.seller_tag,
                        seller_service: res.data.datas.seller_info.seller_service,
                        seller_time_end: res.data.datas.seller_info.seller_time_end,
                        seller_time_start: res.data.datas.seller_info.seller_time_start,
                        seller_intro: res.data.datas.seller_info.seller_intro,
                        coupon_buy: res.data.datas.coupon_buy,
                        coupon_free: res.data.datas.coupon_free,
                        seller_latitude: res.data.datas.seller_info.seller_latitude,
                        seller_longitude: res.data.datas.seller_info.seller_longitude,
                        can_get: arr_,
                        show: res.data.datas.gift.state,
                        // article: res.data.datas.seller_info.seller_info,
                        isShowCouponArea: isShowCouponArea,
                        pageLoaded: true
                    });
                    if (res.data.datas.gift.state) {
                        that.setData({
                            coupon_title: res.data.datas.gift.coupon.title,
                            coupon_limit: res.data.datas.gift.coupon.limit,
                            coupon_money: res.data.datas.gift.coupon.money,
                            coupon_start: res.data.datas.gift.coupon.start,
                            coupon_end: res.data.datas.gift.coupon.end
                        })
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
    calling: function () {
        var that = this;
        wx.makePhoneCall({
            phoneNumber: that.data.seller_phone,
            success: function () {

            },
            fail: function () {

            }
        })

    },
    tack: function (e) {
        var id = e.currentTarget.dataset.id;
        var eq = e.currentTarget.dataset.eq;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        var can_get = this.data.can_get;
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
                            if (!res.data.datas.canReceive) {
                                setTimeout(function () {
                                    can_get[eq] = 0;
                                    that.setData({
                                        can_get: can_get
                                    })
                                }, 2000)
                            }
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
    buy: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../buy/index?id=' + id,
        })
    },
    go_detail: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../coupon_detail/index?&id=' + id + '&isShowSeller=0',
        })
    },
    go_map: function () {
        var latitude = this.data.seller_latitude;
        var longitude = this.data.seller_longitude;
        var name = this.data.seller_name;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: name,
            scale: 15
        })
    },
    closed: function () {
        this.setData({
            show: false
        })
    },
    more: function () {
        wx.redirectTo({
            url: '../ticket_list/index',
        })
    }
}))

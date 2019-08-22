const app = getApp()
const utils = require('../../utils/util.js');
app.authorize.interceptors.identity({
    data: {
        markers: [],
        longitude: "",
        latitude: "",
        station_info: {},
        zIndex: 7,
        showStationDetail: false,
        tpl_count: 0,
        mine_count: 0
    },
    onLoad: function () {
        wx.hideTabBar({});
        var that = this;
        // this.mapCtx = wx.createMapContext('myMap');
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        if (token) {
            wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                    wx.hideLoading();
                    const latitude = res.latitude;
                    const longitude = res.longitude;
                    wx.setStorageSync('latitude',latitude);
                    wx.setStorageSync('longitude',longitude);
                    that.setData({
                        latitude: res.latitude,
                        longitude: res.longitude,
                    });
                    wx.showLoading({
                        title: '请求中',
                        mask: true
                    });
                    wx.request({
                        url: app.data.api + 'navigate/index', //仅为示例，并非真实的接口地址
                        method: "POST",
                        data: {
                            token: token,
                            oil: that.data.oil_id,
                            latitude: res.latitude,
                            longitude: res.longitude,
                            keyword: that.data.keyword
                        },
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function (result) {
                            wx.hideLoading();
                            if (result.data.code == 200) {
                                var markerList = [];
                                result.data.datas.seller_all.map(seller => {
                                    let markerInfo = {
                                        id: seller.id,
                                        latitude: seller.seller_latitude,
                                        longitude: seller.seller_longitude,
                                        zIndex: 5
                                    };
                                    if (seller.seller_isGift == 1) {
                                        Object.assign(markerInfo, {
                                            iconPath: "/image/marker_icon_gift.png",
                                            width: 86,
                                            height: 46,
                                            gift: 1
                                        });
                                    } else {
                                        Object.assign(markerInfo, {
                                            iconPath: "/image/marker_icon_hover.png",
                                            width: 30,
                                            height: 33,
                                            gift: 0
                                        });
                                    }
                                    markerList.push(markerInfo);
                                });
                                that.setData({
                                    markers: markerList,
                                    latitude: res.latitude,
                                    longitude: res.longitude,
                                    tpl_count: result.data.datas.tpl_count,
                                    mine_count: result.data.datas.mine_count
                                });
                            } else {
                                wx.showToast({
                                    title: result.data.datas.error,
                                    icon: 'none',
                                    duration: 2000
                                });
                            }
                        }
                    })
                }, fail: function () {
                    wx.clearStorageSync();
                    wx.redirectTo({
                        url: "/pages/login/index"
                    });
                    return false;
                }
            });
        } else {
            wx.clearStorageSync()
            wx.redirectTo({
                url: "/pages/login/index"
            });
        }
    },
    onMarkerTap: function (e) {
        var that = this;
        var markerList = this.data.markers;
        var zIndex = this.data.zIndex;
        zIndex++;
        markerList.map(item => {
            if (item.gift == 1) {
                item.width = 86;
                item.height = 46;
            } else {
                item.width = 30;
                item.height = 33;
            }
            if (item.id == e.markerId) {
                if (item.gift == 1) {
                    item.width = 110;
                    item.height = 60;
                } else {
                    item.width = 40;
                    item.height = 44;
                }
                item.zIndex = zIndex + 1;
            }
        })

        wx.request({
            url: app.data.api + 'seller/station_info', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                seller_id: e.markerId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        showStationDetail: true,
                        zIndex: zIndex,
                        markers: markerList,
                        station_info: res.data.datas,
                        latitude: res.data.datas.seller_latitude,
                        longitude: res.data.datas.seller_longitude
                    });
                } else {
                    console.log('ERR0002');
                    wx.showToast({
                        title: res.data.datas.error,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    },
    onShow: function () {
        app.data.text_ = true;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var formIds = app.globalData.formIds;
        if (!formIds) formIds = [];
        if (token != "") {
            wx.request({
                url: app.data.api + 'member/index', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token: token,
                    formIds:formIds
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        if (res.data.datas.member_isbind == 0) {
                            wx.navigateTo({
                                url: '../register/index'
                            })
                        }
                        app.globalData.formIds = [];
                    }
                },
            })
        }
    },
    onCloseStation: function () {
        this.setData({
            showStationDetail: false
        })
    },
    toStation: function () {
        var id = this.data.station_info.id;
        wx.navigateTo({
            url: "../station_detail/index?id=" + id,
        });
    },
    toLocation: function () {
        var latitude = this.data.station_info.seller_latitude;
        var longitude = this.data.station_info.seller_longitude;
        var name = this.data.station_info.seller_name;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: name,
            scale: 15
        })
    },
    mineLocation: function () {
        this.setData({
            longitude: wx.getStorageSync('longitude'),
            latitude: wx.getStorageSync('latitude')
        })
    },
    onShareAppMessage: function () {
        return utils.share.getShareInfo();
    },
})
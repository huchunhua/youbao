//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        order_type:1,
        datas:{
            banner:""
        }
    },
    jumpToShop(e) {
        var wash_coupon_tid = e.currentTarget.dataset.washcouponid;
        wx.setStorageSync('wash_coupon_tid', wash_coupon_tid);
        wx.navigateTo({
            url: '../clean_detail/index',
        })
    },
    sort(e){
        var that = this;
        var order_type = e.currentTarget.dataset.ordertype;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var wash_type = wx.getStorageSync('wash_type');
        var wash_car_type = wx.getStorageSync('wash_car_type');
        wx.setStorageSync('order_type', order_type);
        that.setData({
            order_type: order_type,
        });
        wx.request({
            url: app.data.api + 'wash/wash_seller_list', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                wash_type:wash_type,
                wash_car_type:wash_car_type,
                order_type:order_type
            },
            header: {
                'content-type': 'application/json', // 默认值
            },

            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        datas: res.data.datas,
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
    onLoad() {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var wash_type = wx.getStorageSync('wash_type');
        var wash_car_type = wx.getStorageSync('wash_car_type');
        wx.request({
            url: app.data.api + 'wash/wash_seller_list', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                wash_type:wash_type,
                wash_car_type:wash_car_type,
                order_type:1
            },
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        datas: res.data.datas,
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
    }
}) 
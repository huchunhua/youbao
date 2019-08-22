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
        let id = wx.getStorageSync('beaty_id');;
        let car_type = wx.getStorageSync('beaty_car_type');;
        var order_type = e.currentTarget.dataset.ordertype;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'beauty/sellerList', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                id:id,
                token: token,
                car_type: car_type,
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
                        order_type:order_type
                    });
                } else {
                    wx.showToast({
                        title: res.data.datas.error.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    onLoad(option) {
        var that = this;
        let id = decodeURIComponent(option.id);
        let car_type = decodeURIComponent(option.car_type);
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.setStorageSync('beaty_car_type',car_type);
        wx.request({
            url: app.data.api + 'beauty/sellerList', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                id:id,
                token: token,
                longitude: wx.getStorageSync('longitude'),
                latitude: wx.getStorageSync('latitude'),
                car_type: car_type,
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
                        title: res.data.datas.error.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    }
}) 
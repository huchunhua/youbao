//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        order_type:1,
        datas:{
            banner:"https://oil.hkyx365.com//uploads/images/20190213/8251991e66781a8934a7b9e1e3845b7a.png"
        },
        seller_id:''
    },
    jumpToShop(e) {
        var _this = this;
        var seller_id = e.currentTarget.dataset.id;
        wx.navigateTo({
           url: "../shop_detail/index?id=" + seller_id + "&longitude=" + wx.getStorageSync('longitude') + "&latitude=" + wx.getStorageSync('latitude') + "&type=1",
        })
    },
    sort(e){
        var that = this;
        var order_type = e.currentTarget.dataset.ordertype;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        let seller_id = wx.getStorageSync('buy_seller_id');
        if(!seller_id){
                    wx.showToast({
                        title: "参数错误",
                        icon: 'none',
                        duration: 2000
                    });
        }
        wx.setStorageSync('order_type', order_type);
        wx.request({
            url: app.data.api + 'beauty/getSellerList', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                seller_id: seller_id,
                order_type:wx.getStorageSync('order_type')
            },
            header: {
                'content-type': 'application/json', // 默认值
            },

            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        datas: res.data.datas,
                        order_type:wx.getStorageSync('order_type')
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
    onLoad(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.setStorageSync('buy_seller_id',option.seller_id);
        wx.request({
            url: app.data.api + 'beauty/getSellerList', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                seller_id: option.seller_id,
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
                    wx.setStorageSync('longitude',res.data.datas.seller_longitude);
                    wx.setStorageSync('latitude',res.data.datas.seller_latitude);
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
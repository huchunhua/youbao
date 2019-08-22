//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        list1: "",
        list2: "",
        type: 1,
    },
    onLoad: function (options) {
        var that = this;
    },
    loadData(type) {
        var that = this;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var type = that.data.type;
        wx.request({
            url: post_url + 'member/my_new_coupon', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                coupon_gettype: 1,
                type: type
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        list1: res.data.datas
                    })
                }
            }
        });
    },
    onShow() {
        this.loadData(1);
    },
    nav: function (e) {
        this.setData({
            type: e.currentTarget.dataset.id
        });
        this.loadData(e.currentTarget.dataset.id);
    },
    click: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../ticket_detail/index?id=' + id,
        })
    },
    click_: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../coupon_detail/index?&id=' + id + '&isShowSeller=1&isHideReceive=1',
        })
    },
    goHome:function(){
        wx.redirectTo({
            url: '../index/index',
        })        
    }
})

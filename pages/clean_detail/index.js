//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        isReceive: 0,
        sellerInfo:'',
        tplInfo:''
    },
    jumpToShop() {
        wx.navigateTo({
            url: '../clean_detail/index',
        })
    },
    call(){
        wx.makePhoneCall({
          phoneNumber: this.data.sellerInfo.seller_phone // 仅为示例，并非真实的电话号码
        })
    },
    onLocation: function () {
        var latitude = this.data.sellerInfo.seller_latitude;
        var longitude = this.data.sellerInfo.seller_longitude;
        var name = this.data.sellerInfo.seller_name;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: name,
            scale: 15
        })
    },
    onBuy(e) {
        var that = this;
        let id = wx.getStorageSync('wash_coupon_tid');
        wx.navigateTo({
            url: '../buy/index?id=' + id,
        })
    },
    onLoad() {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var id = wx.getStorageSync('wash_coupon_tid');
        app.utils.http.post('coupon/tpl_info', {                
                token: token,
                id: id}).then(function (res) {
                    that.setData({
                       sellerInfo:res.sellerInfo,
                       tplInfo:res.tplInfo
                    })
        });
    }
})
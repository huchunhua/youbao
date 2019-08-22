const app = getApp();
app.authorize.interceptors.identity({
    data: {
        goodsInfo: {},
        totalAmount: 0,
        buyNum: 1,
        isPaying: false,
        pageLoaded: false
    },
    onLoad: function (options) {
        let _id = options.id, that = this;
        if (!_id) {
            wx.showToast({title: '页面缺少参数', icon: 'none', duration: 2000});
            wx.navigateBack({delta: 1})
        }
        app.utils.http.post('coupon/order', {id: options.id}).then(function (res) {
            let totalAmount = parseFloat(res.goods_price) * that.data.buyNum;
            that.setData({
                orderType: 'seller',
                goodsInfo: res,
                totalAmount: totalAmount,
                buyNum: that.data.buyNum,
                pageLoaded: true
            });
        })
    },
    onReduce() {
        let that = this;
        let currentNum = that.data.buyNum;
        if (currentNum > 1) currentNum--;
        let currentTotal = parseFloat(that.data.goodsInfo.goods_price) * currentNum;
        this.setData({
            buyNum: currentNum,
            totalAmount: currentTotal
        })
    },
    onIncrease() {
        let that = this;
        let currentNum = that.data.buyNum;
        currentNum++;
        let currentTotal = parseFloat(that.data.goodsInfo.goods_price) * currentNum;
        this.setData({
            buyNum: currentNum,
            totalAmount: currentTotal
        })
    },
    onWxPay(e) {
        let that = this;
        let buyId = e.currentTarget.dataset.id;
        let buy_seller_id = wx.getStorageSync('buy_seller_id') ? wx.getStorageSync('buy_seller_id') : 0;
        that.setData({isPaying: 'WxPay'});
        app.utils.http.post('coupon/buy', {id: buyId, num: that.data.buyNum,buy_seller_id: buy_seller_id}).then(function (res) {
            wx.requestPayment({
                'timeStamp': res.timeStamp,
                'nonceStr': res.nonceStr,
                'package': res.package,
                'signType': res.signType,
                'paySign': res.paySign,
                'success': function () {
                    wx.redirectTo({
                        url: '../pay_ok/index',
                    });
                },
                'fail': function () {
                    that.setData({isPaying: false});
                    console.log("payment fail from wxpay");
                }
            });
        })
    },
    onBestPay(e) {
        let that = this;
        let buyId = e.currentTarget.dataset.id;
        let buy_seller_id =   wx.getStorageSync('buy_seller_id') ?  wx.getStorageSync('buy_seller_id') : option.buy_seller_id;
        that.setData({isPaying: 'Best'});
        app.utils.http.post('pay/bestpay', {id: buyId, num: that.data.buyNum,buy_seller_id: buy_seller_id}).then(function (res) {
            wx.navigateTo({
                url: '../y_pay/index?id=' + res
            })
        })
    }
});
//index.js
//获取应用实例
const app = getApp()
app.authorize.interceptors.identity({
    data: {
        tpl_info: {},
        seller_info: {},
        isShowSeller: 0,
        isHideReceive: 0,
        isNeedBuy: false,
        isReceive: 0,
        btn_receive: "立即领取",
        btn_buy: "立即抢购",
        pageLoaded: false
    },
    onLoad: function (option) {
        console.log(option)
        var tplId = option.id;
        var isHideReceive = option.isHideReceive ? option.isHideReceive : 0;
        var isShowSeller = option.isShowSeller ? option.isShowSeller : 0;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'coupon/tpl_info', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                id: tplId
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    let _rec = res.data.datas.tplInfo.isReceive,_recText = (_rec == 1) ? "立即领取" : "已领取",isNeedBuy = (res.data.datas.tplInfo.coupon_t_gettype == 1),_buyText = (_rec == 1 && isNeedBuy) ? "立即抢购" : "已拥有";
                    that.setData({
                        tpl_info: res.data.datas.tplInfo,
                        seller_info: res.data.datas.sellerInfo,
                        isShowSeller: isShowSeller,
                        isReceive: _rec,
                        isNeedBuy: isNeedBuy,
                        btn_receive: _recText,
                        btn_buy: _buyText,
                        pageLoaded: true
                    })
                }
            }
        })
        if(isHideReceive){
            that.setData({
                isHideReceive: 1
            })
        }
    },
    nav: function (e) {
        this.setData({
            type: e.currentTarget.dataset.id
        });
    },
    onReceive(e) {
        var that = this;
        let id = e.currentTarget.dataset.id;
        if(that.data.isReceive){
            var that = this;
            that.setData({
                btn_receive: "领取中...",
                isReceive: 0
            })
            wx.request({
                url: app.data.api + 'coupon/receive', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    tid: id,
                    token: app.data.token ? app.data.token : wx.getStorageSync('token')
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        if (res.data.datas.canReceive) {
                            that.setData({
                                btn_receive: "继续领取",
                                isReceive: 1
                            })
                        }else{
                            that.setData({
                                btn_receive: "领取成功"
                            })
                        }
                        wx.showToast({
                            title: res.data.datas.msg,
                            icon: 'none',
                            duration: 2000
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
        }
    },
    onBuy(e) {
        var that = this;
        let id = e.currentTarget.dataset.id;
        if(that.data.isReceive){
            wx.navigateTo({
                url: '../buy/index?id=' + id,
            })
        }
    }
})

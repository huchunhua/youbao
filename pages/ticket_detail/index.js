const app = getApp();
const utils = require('../../utils/util.js');
app.authorize.interceptors.identity({
    data: {
        socket: {
            isUse: true,
            isOpen: false
        },
        coupon_info: {},
        seller_info: {},
        qrcode_info: {},
        verify_state: 0,
        pageLoaded: false
    },
    onLoad: function (option) {
        var that = this;
        wx.request({
            url: app.data.api + 'coupon/coupon_qrcode', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                id: option.id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                if (res.data.code == 200) {
                    that.setData({
                        coupon_info: res.data.datas.couponInfo,
                        seller_info: res.data.datas.sellerInfo,
                        qrcode_info: res.data.datas.qrcodeInfo,
                        pageLoaded: true
                    });
                    if(that.data.socket.isUse){
                        that.onSocket();
                    }
                }
            }
        })
    },
    onSocket() {
        let that = this;
        let socketState = that.data.socket;
        wx.connectSocket({
            url: app.data.socketApi, success: function () {
                console.info('Connection successful.')
            }, fail: function () {
                console.error('Connection fail.')
            }
        });
        wx.onSocketOpen(function () {
            socketState.isOpen = true;
            wx.sendSocketMessage({
                data: JSON.stringify({
                    method: 'CouponPreHandle',
                    data: {code: that.data.coupon_info.coupon_code, token: app.data.token ? app.data.token : wx.getStorageSync('token')}
                })
            });
        });
        wx.onSocketClose(function () {
            socketState.isOpen = false;
            console.log('Connection disconnected.');
        })
        //接收消息
        wx.onSocketMessage(function (e) {
            if (!utils.base64.isBase64(e.data)) {
                let data = JSON.parse(e.data);
                switch (data.type) {
                    case 'verify':
                        if (data.state == 'success') {
                            that.setData({
                                verify_state: 1
                            });
                            wx.showToast({
                                title: '核销成功',
                                icon: 'none',
                                duration: 2000,
                                complete: function () {
                                    wx.closeSocket();
                                }
                            })
                        }
                        break;
                }
            } else {
                console.info(e.data);
            }
        });
    },
    onHide() {
        let that = this;
        let socketState = that.data.socket;
        if (socketState.isOpen) {
            wx.closeSocket();
        }
    },
    onUnload() {
        let that = this;
        let socketState = that.data.socket;
        if (socketState.isOpen) {
            wx.closeSocket();
        }
    },
    onLocation: function () {
        var latitude = this.data.seller_info.seller_latitude;
        var longitude = this.data.seller_info.seller_longitude;
        var name = this.data.seller_info.seller_name;
        wx.openLocation({
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            name: name,
            scale: 15
        })
    },
    call(){
        wx.makePhoneCall({
          phoneNumber: this.data.seller_info.seller_phone // 仅为示例，并非真实的电话号码
        })
    }
})

const app = getApp()
Component({
    options: {
        multipleSlots: true, // 多slot支持
        addGlobalClass: true,
    },
    externalClasses: ['i-class'],
    properties: {
        couponInfo: {
            type: Object,
            value: {}
        },
        touch: {
            type: Number,
            value: 0
        },
        //是否显示领取按钮
        receive: {
            type: Boolean,
            value: true
        },
        //是否仅作为展示
        reveal: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        onCouponDetail: function (e) {
            let that = this;
            if(that.data.reveal) return false;
            let id = e.currentTarget.dataset.id;
            let isHideReceive = ((that.data.touch != 1) ? '&isHideReceive=1' : '');
            wx.navigateTo({
                url: '../coupon_detail/index?&id=' + id + '&isShowSeller=0' + isHideReceive,
            })
        },
        onReceive: function (e) {
            if (this.data.touch == 0 || !this.data.receive) {
                return false;
            }
            wx.showLoading();
            let id = e.currentTarget.dataset.id;
            let token = app.data.token ? app.data.token : wx.getStorageSync('token');
            let that = this;

            wx.request({
                url: app.data.api + 'coupon/receive', //仅为示例，并非真实的接口地址
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
                        // let _canRec = 0;
                        // if (res.data.datas.canReceive) {
                        //     _canRec = 1;
                        // }
                        that.setData({
                            touch: 0
                        });
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
            });
        }
    }
});

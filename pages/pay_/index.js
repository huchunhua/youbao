//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
app.authorize.interceptors.identity({
    data: {
        isHide: false,
        showLogin: false,
        id: "",
        id1: "",
        id2: "",
        imgUrls: "",
        show: false,
        show1: false,
        show2: false,
        show_: false,
        list: "",
        list1: "",
        total_money: "",
        de_money: 0,
        de_money1: 0,
        de_money2: 0,
        pay_money: "",
        order_sn: "",
        coupon_list: [],
        isFirstByDay: false, //是否是今日的第一个加油订单
        coupon_list1: [],
        coupon_list2: [],
        go: true,
        checked: -1,
        checked1: -1,
        checked2: -1,
        first_list: "",
        encryptData: "",
        isShowGoHome: false,
        coupon_oil_count: 0,
        coupon_non_count: 0,
        coupon_full_count: 0,
        pageLoaded: true,
        oil_count: 0,
        non_count: 0,
        full_count: 0,
        showFirstModal: false,
        isFromScan: false,
        _isBind: false,
        isDisabled: false,
        countDown: ''
    },
    onLoad: function (option) {
        var id = option.id;
        var q_ = option.q;
        var url_ = decodeURIComponent(q_);
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        if (id == "" || id == undefined || id == "undefined" || id == null || id == "null") {
            id = url_.split("?")[1].replace("id=", "");
            that.setData({
                isFromScan: true
            })
        }

        let _isFirstLogin = wx.getStorageSync('_isFirstLogin') || false;
        let _isInvited = wx.getStorageSync('_isInvited') || false;
        let _isBind = wx.getStorageSync('_isBind') || false;
        let showFirstModal = _isFirstLogin && !_isInvited;
        that.setData({
            _isBind: _isBind,
            showFirstModal: showFirstModal
        });
        that.data.encryptData = id;
        that.getOrderData(that, post_url, token, true);
    },
    onUnload() {
        // this.orderCancel(false);
    },
    matchCoupon(price, couponList) {
        if (couponList.length <= 0) return false;
        let maxNum = price;
        let maxItem;
        couponList.map(function (item, index, array) {
            let money = parseFloat(item.coupon_money);
            if (money > maxNum) {
                maxNum = money;
                maxItem = item;
                maxItem.index = index;
            }
        });
        return maxItem;
    },
    getGoodsTotal(goodsList) {
        let total = 0;
        goodsList.map(item => {
            total += parseFloat(item.goods_price);
        });
        return total;
    },
    getOrderData: function (that, post_url, token, checkFirstBuy) {
        that.setData({
            pageLoaded: false
        });
        wx.request({
            url: post_url + 'pay/cashier', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                data: that.data.encryptData
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    let coupon_oil_count = res.data.datas.coupon_list.oil ? res.data.datas.coupon_list.oil.length : 0;
                    let coupon_non_count = res.data.datas.coupon_list.non ? res.data.datas.coupon_list.non.length : 0;
                    let coupon_full_count = res.data.datas.coupon_list.full ? res.data.datas.coupon_list.full.length : 0;

                    let goodsTotalByOil = that.getGoodsTotal(res.data.datas.goods_list.oil);
                    let goodsTotalByNon = that.getGoodsTotal(res.data.datas.goods_list.non);

                    let deMoney = 0;
                    let selectedCouponByOil = null;
                    let selectedCouponByNon = null;
                    if (res.data.datas.isFirstByDay) {
                        selectedCouponByOil = coupon_oil_count > 0 ? that.matchCoupon(goodsTotalByOil, res.data.datas.coupon_list.oil) : false;
                        selectedCouponByNon = coupon_non_count > 0 ? that.matchCoupon(goodsTotalByOil, res.data.datas.coupon_list.non) : false;
                        if (selectedCouponByOil) deMoney += selectedCouponByOil.coupon_money;
                        if (selectedCouponByNon) deMoney += selectedCouponByNon.coupon_money;
                    }

                    let data = {
                        coupon_list: res.data.datas.coupon_list.oil ? res.data.datas.coupon_list.oil : [],
                        isFirstByDay: res.data.datas.isFirstByDay,
                        coupon_list1: res.data.datas.coupon_list.non ? res.data.datas.coupon_list.non : [],
                        coupon_list2: res.data.datas.coupon_list.full ? res.data.datas.coupon_list.full : [],
                        coupon_oil_count: coupon_oil_count,
                        coupon_non_count: coupon_non_count,
                        coupon_full_count: coupon_full_count,
                        goodsTotalByOil: goodsTotalByOil,
                        goodsTotalByNon: goodsTotalByNon,
                        list: res.data.datas.goods_list.oil,
                        list1: res.data.datas.goods_list.non,
                        total_money: res.data.datas.order_amount,
                        order_sn: res.data.datas.order_sn,
                        pay_money: parseFloat(res.data.datas.order_amount) - deMoney,
                        pageLoaded: true
                    };
                    if (res.data.datas.isFirstByDay && selectedCouponByOil) {
                        Object.assign(data, {
                            id: selectedCouponByOil.id,
                            checked: selectedCouponByOil.index,
                            de_money: selectedCouponByOil.coupon_money
                        })
                    }
                    if (res.data.datas.isFirstByDay && selectedCouponByNon) {
                        Object.assign(data, {
                            id1: selectedCouponByNon.id,
                            checked1: selectedCouponByNon.index,
                            de_money1: selectedCouponByNon.coupon_money
                        })
                    }
                    that.setData(data);
                    if (res.data.datas.first_buy.state && checkFirstBuy === true) {
                        that.setData({
                            first_list: res.data.datas.first_buy.list,
                            show_: true
                        });
                    }

                    let depTime = 280;
                    let pushTime = parseInt(res.data.datas.push_time);
                    let servTime = parseInt(res.data.datas.serv_time);
                    let _depTime = depTime - (servTime - pushTime + 2);
                    if (servTime >= pushTime && (servTime - pushTime) >= depTime) {
                        that.setData({
                            isDisabled: true,
                            countDown: ''
                        })
                    } else {
                        let countTimer = setInterval(function () {
                            if (_depTime > 0) {
                                that.setData({
                                    countDown: that.countTime(_depTime)
                                });
                                _depTime -= 1;
                            }
                            else {
                                that.orderCancel(false);
                                that.setData({
                                    isDisabled: true,
                                    countDown: ''
                                });
                                //跳回首页
                                clearInterval(countTimer);
                            }
                        }, 1000);
                    }

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
    close: function () {
        this.setData({
            show: false,
            show1: false,
            show2: false
        });
    },
    show: function () {
        this.setData({
            show: true
        });
    },
    show1: function () {
        this.setData({
            show1: true
        });
    },
    show2: function () {
        this.setData({
            show2: true
        });
    },
    countTime(countDown) {
        //定义变量 d,h,m,s保存倒计时的时间
        let m, s;
        if (countDown >= 0) {
            m = Math.floor(countDown / 60 % 60);
            s = Math.floor(countDown % 60);
            if(m < 10) m = '0'+m;
            if(s < 10) s = '0'+s;
        }
        return m + '分' + s + '秒';
    },
    onPay: function (that, order_sn, id, id1, id2) {
        that.setData({
            isPayIng: true
        });

        wx.showLoading();
        wx.request({
            url: app.data.api + 'pay/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                oil_coupon: id,
                non_coupon: id1,
                full_coupon: id2,
                order_sn: order_sn
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    if (res.data.datas.pay) {
                        wx.requestPayment({
                            'timeStamp': res.data.datas.params.timeStamp,
                            'nonceStr': res.data.datas.params.nonceStr,
                            'package': res.data.datas.params.package,
                            'signType': res.data.datas.params.signType,
                            'paySign': res.data.datas.params.paySign,
                            'success': function (res) {
                                that.setData({
                                    go: false
                                })
                                wx.redirectTo({
                                    url: '../pay_ok/index',
                                });
                            },
                            'fail': function (res) {
                                that.setData({
                                    isPayIng: false
                                });
                                console.log("b");
                            }
                        });
                    } else {
                        that.setData({
                            go: false
                        })
                        wx.redirectTo({
                            url: '../pay_ok/index',
                        });
                    }
                } else {
                    that.setData({
                        isPayIng: false
                    });
                    wx.showToast({
                        title: res.data.datas.error,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    w_pay: function () {
        var that = this;
        var id = this.data.id;
        var id1 = this.data.id1;
        var id2 = this.data.id2;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var order_sn = this.data.order_sn;
        if (that.data.isFirstByDay && (that.data.coupon_oil_count > 0 || that.data.coupon_non_count > 0 || that.data.coupon_full_count > 0)) {
            if (id == "" && id1 == "" && id2 == "") {
                wx.showModal({
                    title: '您有优惠券可以使用',
                    content: '确定不使用优惠吗?',
                    cancelText: '选择优惠',
                    confirmText: '确定',
                    success(res) {
                        if (res.confirm) {
                            that.onPay(that, order_sn, id, id1, id2);
                        } else if (res.cancel) {
                            return false;
                        }
                    }
                })
            } else {
                that.onPay(that, order_sn, id, id1, id2);
            }
        } else {
            that.onPay(that, order_sn, id, id1, id2);
        }
    },
    go_pay: function () {
        wx.showLoading();
        var that = this;
        var id = this.data.id;
        var id1 = this.data.id1;
        var id2 = this.data.id2;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var order_sn = this.data.order_sn;
        wx.request({
            url: post_url + 'pay/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                oil_coupon: id,
                non_coupon: id1,
                full_coupon: id2,
                order_sn: order_sn
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        go: false
                    })
                    wx.redirectTo({
                        url: '../pay_ok/index',
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
    click_: function (e) {
        var that = this;
        var checked_ = e.currentTarget.dataset.checked;
        var checked = this.data.checked;
        if (checked == checked_) {
            that.setData({
                show: false,
                id: "",
                de_money: 0,
                checked: -1,
                pay_money: (that.data.total_money - that.data.de_money1 - that.data.de_money2).toFixed(2)
            })
        } else {
            that.setData({
                show: false,
                id: e.currentTarget.dataset.id,
                checked: e.currentTarget.dataset.checked,
                de_money: e.currentTarget.dataset.money,
                pay_money: (that.data.total_money - parseFloat(e.currentTarget.dataset.money) - that.data.de_money1 - that.data.de_money2).toFixed(2)
            });
        }
        console.log(this.data.checked);
    },
    click_1: function (e) {
        var that = this;
        var checked_ = e.currentTarget.dataset.checked;
        var checked = this.data.checked1;
        if (checked == checked_) {
            that.setData({
                show1: false,
                id1: "",
                de_money1: 0,
                checked1: -1,
                pay_money: (that.data.total_money - that.data.de_money2 - that.data.de_money).toFixed(2)
            })
        } else {
            that.setData({
                show1: false,
                id1: e.currentTarget.dataset.id,
                checked1: e.currentTarget.dataset.checked,
                de_money1: e.currentTarget.dataset.money,
                pay_money: (that.data.total_money - parseFloat(e.currentTarget.dataset.money) - that.data.de_money2 - that.data.de_money).toFixed(2)
            });
        }
        // console.log(this.data.checked);
    },
    click_2: function (e) {
        var that = this;
        console.log(e.currentTarget.dataset.checked)
        var checked_ = e.currentTarget.dataset.checked;
        var checked = this.data.checked2;
        if (checked == checked_) {
            that.setData({
                show2: false,
                id2: "",
                de_money2: 0,
                checked2: -1,
                pay_money: (that.data.total_money - that.data.de_money1 - that.data.de_money).toFixed(2)
            })
        } else {
            that.setData({
                show2: false,
                id2: e.currentTarget.dataset.id,
                checked2: e.currentTarget.dataset.checked,
                de_money2: e.currentTarget.dataset.money,
                pay_money: (that.data.total_money - parseFloat(e.currentTarget.dataset.money) - that.data.de_money1 - that.data.de_money).toFixed(2)
            });
        }
    },
    close_: function () {
        var that = this;
        this.setData({
            show: false,
            show_: false
        })
    },
    get: function (e) {
        wx.showLoading()
        var id = e.currentTarget.dataset.id;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        wx.request({
            url: post_url + 'coupon/receive', //仅为示例，并非真实的接口地址
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
                    wx.showToast({
                        title: res.data.datas.msg,
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                            that.setData({
                                show_: false
                            })
                            that.getOrderData(that, post_url, token, false);
                        }
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
    },
    list_closed: function () {
        this.setData({
            show_: false
        })
    },
    onHide: function () {
        this.data.isHide = true;
    },
    getPhoneNumber(e) {
        let that = this;
        wx.login({
            success: result => {
                app.utils.http.post('member/bindmob', {
                    code: result.code,
                    iv: e.detail.iv,
                    encryptedData: e.detail.encryptedData
                }).then(function (res) {
                    wx.setStorageSync('_isBind', true);
                    that.onReceiveGiftPackage();
                }).catch(function (err) {
                    console.log(err)
                });
            }
        });
    },
    onShow: function () {
        let formIds = app.globalData.formIds;
        if(formIds && formIds.length > 0){
            app.utils.http.post('member/formid',{formIds:JSON.stringify(formIds)}).then(function () {
                app.globalData.formIds = [];
            });
        }
        if (this.data.isHide && this.data.go) {
            if (this.data.isFromScan) {
                wx.redirectTo({
                    url: "/pages/index/index"
                });
            } else {
                wx.navigateBack({
                    delta: 1
                });
            }
        }
    },
    y_pay: function () {
        wx.showLoading();
        var id = this.data.id;
        var id1 = this.data.id1;
        var id2 = this.data.id2;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var order_sn = this.data.order_sn;
        var that = this;
        wx.request({
            url: post_url + 'pay/bestpay', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                oil_coupon: id,
                non_coupon: id1,
                full_coupon: id2,
                order_sn: order_sn
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    wx.navigateTo({
                        url: '../y_pay/index?id=' + res.data.datas,
                    })
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
    orderCancel: function (redirect = true) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'pay/cancel', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                order_sn: that.data.order_sn
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
            }
        });
        if(redirect){
            if (this.data.isFromScan) {
                wx.redirectTo({
                    url: "/pages/index/index"
                });
            } else {
                wx.navigateBack({
                    delta: 1
                });
            }
        }

    },
    onLogin(e) {
        wx.showLoading({
            title: '授权中',
            mask: true
        });
        var that = this;
        //接下来写业务代码
        var post_url = app.data.api;
        // 登录
        wx.login({
            success: result => {
                wx.getUserInfo({
                    success: res => {
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                        let data = res.encryptedData;
                        let iv = res.iv;
                        let _pid = wx.getStorageSync('_pid')
                        let params = {
                            code: result.code,
                            data: data,
                            iv: iv
                        };
                        if (_pid) Object.assign(params, {pid: _pid});
                        app.data.img = res.userInfo.avatarUrl;
                        wx.request({
                            url: post_url + 'login/grant', //仅为示例，并非真实的接口地址
                            method: "POST",
                            data: params,
                            header: {
                                'content-type': 'application/json' // 默认值
                            },
                            success: function (res) {
                                wx.hideLoading();
                                if (res.data.code == 200) {
                                    app.data._id = res.data.datas.id;
                                    app.data.token = res.data.datas.token;
                                    wx.setStorageSync('_id', res.data.datas.id);
                                    wx.setStorageSync('token', res.data.datas.token);
                                    wx.setStorageSync('_isFirstLogin', res.data.datas.isFirstLogin);
                                    that.setData({
                                        showLogin: false
                                    })
                                    that.getOrderData(that, post_url, res.data.datas.token, true);
                                } else {
                                    wx.showToast({
                                        title: res.data.datas.error,
                                        icon: 'none',
                                        duration: 2000
                                    });
                                }
                            },
                        })
                    }, fail: function () {
                        //获取用户信息失败后。请跳转授权页面
                        wx.showToast({
                            icon: "none",
                            title: '必须要授权才能继续使用小程序！',
                        })
                    }
                })
            }
        })
    },
    onModalClose() {
        this.setData({
            showFirstModal: false
        });
        let token = app.data.token ? app.data.token : wx.getStorageSync('token');
        this.getOrderData(this, app.data.api, token, false);
    },
    onClickReceive() {
        let that = this;
        // let _isBind = wx.getStorageSync('_isBind') || false;
        // if (!_isBind) {
        //     let _layoutComponent = that.selectComponent("#layout");
        //     _layoutComponent.onShowMobileBindModal(null, false, that.onReceiveGiftPackage);
        //     return false;
        // }
        that.onReceiveGiftPackage();
    },
    onReceiveGiftPackage() {
        let that = this;
        app.utils.http.post('promotion/giftByNewUser').then(function () {
            that.onModalClose();
            wx.setStorageSync('_isFirstLogin', false);
            wx.showToast({
                title: '领取成功',
                icon: 'none',
                duration: 2000
            });
            let token = app.data.token ? app.data.token : wx.getStorageSync('token');
            that.getOrderData(that, app.data.api, token, false);
            return false;
        }).catch(function () {
            that.onModalClose();
        });
    },
    formSubmit_collect(e) {
        app.dealFormIds(e.detail.formId);
    },
});
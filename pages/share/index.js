//index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js');
app.authorize.interceptors.identity({
    data: {
        pid: 0,
        inviteList: [],
        member_info: {},
        isFirstLogin: false,
        isShowCoupon: false,
        isShowSnsModal: false,
        mobileBindForm: {
            mobile: '',
            seccode: ''
        },
        mobileBindCfg: {
            disabled: false,
            countText: '获取验证码'
        },
        isHide:false
    },
    onLoad: function (option) {
        let that = this;
        let _isFirstLogin = wx.getStorageSync('_isFirstLogin') || false;
        let _isInvited = wx.getStorageSync('_isInvited') || false;
        if (_isFirstLogin === true) {
            if (!_isInvited && option._id && option._id > 0) {
                that.setData({isFirstLogin: true, pid: option._id});
                return false;
            }
        }
        app.utils.http.post("share/invite").then(function (res) {
            that.setData({
                member_info: res.member_info,
                inviteList: res.list,
                isFirstLogin: false
            })
        })
    },
    onGetSeccode() {
        let that = this;
        wx.getUserInfo({
            success: res => {
                if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                }
                let userInfo = res.userInfo;
                let userMobile = that.data.mobileBindForm.mobile;
                if (!userMobile || !/^[1][1-9]{1}[0-9]{9}$/.test(userMobile)) {
                    wx.showToast({
                        title: '请输入正确的手机号码',
                        icon: 'none',
                        duration: 2000
                    });
                    return false;
                } else {
                    Object.assign(userInfo, {
                        mobile: userMobile,
                        pid: that.data.pid
                    })
                    app.utils.http.post('member/sync', userInfo).then(function (res) {
                        wx.showToast({
                            title: res,
                            icon: 'none',
                            duration: 2000
                        });
                        let countDown = 60;
                        let countTimer = null;
                        countTimer = setInterval(function () {
                            if (countDown > 0) {
                                countDown = countDown - 1;
                                that.setData({
                                    mobileBindCfg: {
                                        disabled: true,
                                        countText: countDown + "s"
                                    }
                                });
                            }
                            else {
                                that.setData({
                                    mobileBindCfg: {
                                        disabled: false,
                                        countText: "获取"
                                    }
                                });
                                clearInterval(countTimer);
                            }
                        }, 1000);
                    }).catch(function (err) {
                        console.error(err)
                    })
                }
            }
        });
    },
    onReceive() {
        let that = this;
        let userMobile = that.data.mobileBindForm.mobile;
        let userSeccode = that.data.mobileBindForm.seccode;
        if (!userMobile || userMobile.length != 11) {
            wx.showToast({
                title: '请正确填写手机号码',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        if (!userSeccode || userSeccode.length != 6) {
            wx.showToast({
                title: '请正确填写验证码',
                icon: 'none',
                duration: 2000
            });
            return false;
        }
        app.utils.http.post('share/receive', {mobile: userMobile, seccode: userSeccode}).then(function (res) {
            wx.setStorageSync('_isBind', true);
            wx.setStorageSync('_isInvited', true);
            that.setData({isFirstLogin: false, isShowCoupon: true});
            setTimeout(function () {
                that.onIndex();
            }, 5000);
        }).catch(function (err) {
            console.warn('绑定手机号时发生错误：', err);
        })
    },
    mobileBind_mobileInput(e) {
        this.data.mobileBindForm.mobile = e.detail.value;
    },
    mobileBind_seccodeInput(e) {
        this.data.mobileBindForm.seccode = e.detail.value;
    },
    onIndex() {
        wx.redirectTo({
            url: "/pages/index/index"
        });
    },
    onShareAppMessage: function () {
        return utils.share.getShareInfo(true);
    },
    onHideSnsModal() {
        this.setData({
            isShowSnsModal:false
        })
    },
    onShowSnsModal() {
        this.setData({
            isShowSnsModal:true
        })
    },
    onSaveImage() {
        let that = this;
        wx.downloadFile({
            url: that.data.member_info.image,
            success(res) {
                wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                        wx.saveImageToPhotosAlbum({
                            filePath: res.tempFilePath,
                            success() {
                                wx.showToast({
                                    title: "保存成功",
                                    icon: 'none',
                                    duration: 2000
                                });
                                this.setData({
                                    isShowSnsModal:false
                                })
                                return false;
                            },fail(err){
                                wx.showToast({
                                    title: err.errMsg,
                                    icon: 'none',
                                    duration: 2000
                                });
                                this.setData({
                                    isShowSnsModal:false
                                })
                                return false;
                            }
                        })
                    },fail() {
                        wx.showToast({
                            title: '已拒绝授权',
                            icon: 'none',
                            duration: 2000
                        });
                        return false;
                    }
                })

            },
        })
    }
})

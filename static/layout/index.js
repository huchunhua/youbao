const app = getApp()
Component({
    options: {
        multipleSlots: true, // 在组件定义时的选项中启用多slot支持
        addGlobalClass: false,
    },
    data: {
        callback: null,
        refererPage: null,
        mobileBindModal: false,
        mobileBindForm: {
            mobile: '',
            seccode: ''
        },
        mobileBindCfg: {
            disabled: false,
            countText: '获取'
        }
    },
    externalClasses: ['i-class'],
    properties: {
        statusBar: {
            type: String,
            value: 'default'
        }
    },
    methods: {
        /**
         * 显示绑定手机弹窗
         * @param pageObj 被阻塞的页面对象
         * @param allowClose 是否允许关闭
         */
        onShowMobileBindModal(pageObj = null, block = false, callback = null) {
            let data = {
                callback: callback,
                mobileBindModal: true,
                pageBlock: block
            };
            if (pageObj) {
                Object.assign(data, {
                    refererPage: pageObj
                })
            }
            this.setData(data)
        },
        onCloseMobileBindModal() {
            this.setData({
                mobileBindModal: false
            });

            this._refreshCurrentPage(this.data.pageBlock);
        },
        getPhoneNumber(e) {
            let that = this;
            wx.login({
                success: result => {
                    app.utils.http.post('member/bindmob',{code:result.code,iv:e.detail.iv,encryptedData:e.detail.encryptedData}).then(function (res) {
                        wx.setStorageSync('_isBind', true);
                        that.onReceiveGiftPackage();
                    }).catch(function (err) {
                        console.log(err)
                    });
                }
            });
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
                    }else{
                        Object.assign(userInfo, {
                            mobile: userMobile
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
                                            countText: countDown+"s"
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
        onMobileBind(e) {
            let that = this;
            let userMobile = that.data.mobileBindForm.mobile;
            let userSeccode = that.data.mobileBindForm.seccode;
            if (!userMobile || !userSeccode) {
                wx.showToast({
                    title: '请将手机号和验证码填写完整',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            app.utils.http.post('member/bind', {mobile:userMobile,seccode:userSeccode}).then(function (res) {
                let pages = getCurrentPages(); //获取加载的页面
                let currentPage = pages[pages.length - 1]; //获取当前页面的对象
                let url = currentPage.route ;//当前页面url
                wx.showToast({
                    title: res,
                    icon: 'none',
                    duration: 2000
                });
                wx.setStorageSync('_isBind', true);
                that.setData({
                    mobileBindModal: false
                });
                if(typeof that.data.callback === "function"){
                    that.data.callback();
                }
                that._refreshCurrentPage(that.data.pageBlock);
            }).catch(function (err) {
                console.warn('绑定手机号时发生错误：',err);
            })
        },
        mobileBind_mobileInput(e) {
            this.data.mobileBindForm.mobile = e.detail.value;
        },
        mobileBind_seccodeInput(e) {
            this.data.mobileBindForm.seccode = e.detail.value;
        },
        _refreshCurrentPage(pageBlock = false) {

            let _pages = getCurrentPages(),
                _currentPage = _pages[_pages.length - 1];
            if(_currentPage.route == 'pages/ticket_list/index') {
                _currentPage.loadData();
            }
            let _refererPage = this.data.refererPage ? this.data.refererPage.eventObj : {};
            let _args = this.data.refererPage ? this.data.refererPage.params : {};
            if (_refererPage && pageBlock) {
                _refererPage.call(_currentPage, _args);
                console.info('page unblocked')
            }
            delete this.data.refererPage;
        }
    }
});

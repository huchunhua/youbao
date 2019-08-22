const app = getApp()
app.authorize.interceptors.identity({
    data: {
        swiperList: [],
        stationList: [],
        dataList: [],
        tabActive: 0,
        autoFestival: {
            state: false
        },
        showHeaderShadow: false,
        showFirstModal: false,
        pageLoaded: false,
    },
    computed: {

    },
    closeTips() {
        let that = this;
        that.setData({
            showTips: false
        })
    },    
    jumpToNearby() {
        wx.navigateTo({
            url: '../clean/index?type=clean',
        })
    },
    jumpToReceive() {
        wx.navigateTo({
            url: '../receive/index',
        })
    },
    jumpToMember() {
        wx.navigateTo({
            url: '../personal/index',
        })
    },
    onTabSelect(e) {
        let that = this;
        let _tabType = e.currentTarget.dataset.type;
        let dataCached = wx.getStorageSync('INDEX_DATA_TYPE' + _tabType);
        if (dataCached) {
            let dataList = dataCached;
            that.setData({
                dataList: dataList,
                tabActive: _tabType
            })
            return false;
        }
        app.utils.http.post('index/data', {type: _tabType}).then(function (res) {
            let dataList = res;
            if (_tabType == 0) dataList = that.data.stationList;
            wx.setStorageSync('INDEX_DATA_TYPE' + _tabType, dataList);
            that.setData({
                dataList: dataList,
                tabActive: _tabType
            })
        });
    },
    onMapMode() {
        wx.navigateTo({
            url: '../home/index'
        })
    },
    onLoad(option) {
        var that = this;
        // var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        if (option._id) {
            wx.setStorageSync('_pid', option._id);
        }
        // if (token) {
        wx.getLocation({
            type: 'gcj02',
            success: function (res) {
                const latitude = res.latitude;
                const longitude = res.longitude;
                wx.setStorageSync('latitude',latitude);
                wx.setStorageSync('longitude',longitude);
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                });
                app.utils.http.post('index/index', {
                    latitude: res.latitude,
                    longitude: res.longitude
                }).then(function (res) {
                    let stationList = [];
                    let _isFirstLogin = wx.getStorageSync('_isFirstLogin') || false;
                    let _isInvited = wx.getStorageSync('_isInvited') || false;
                    let _isBind = wx.getStorageSync('_isBind') || false;
                    let showFirstModal = _isFirstLogin && !_isInvited;
                    res.stationList.map(item => {
                        let dHeight = 0;
                        if (item.seller_isPromotion) dHeight += 50;
                        if (item.seller_coupon) dHeight += item.seller_coupon.length * 50;
                        Object.assign(item, {
                            deploy_height: dHeight
                        });
                        stationList.push(item)
                    });

                    wx.setStorageSync('INDEX_DATA_TYPE0', stationList);
                    that.setData({
                        swiperList: res.swiperList,
                        stationList: stationList,
                        dataList: stationList,
                        autoFestival: res.autoFestival,
                        showFirstModal: showFirstModal,
                        isBind: _isBind,
                        pageLoaded: true
                    });
                    // that.preload.data();
                    // that.preload.receive();
                    // that.preload.nearby();
                })
            },
            fail: function () {
                wx.clearStorageSync();
                app.authorize.login();
                // wx.redirectTo({
                //     url: "/pages/login/index"
                // });
                return false;
            }
        })
        setTimeout(function () {
            that.setData({
                showTips: true
            })
        }, 2000);        
        setTimeout(function () {
            that.setData({
                showTips: false
            })
        }, 8000);
        // } else {
        //     wx.clearStorageSync()
        //     wx.redirectTo({
        //         url: "/pages/login/index"
        //     });
        // }
    },
    onShow() {
        let formIds = app.globalData.formIds;
        if(formIds && formIds.length > 0){
            app.utils.http.post('member/formid',{formIds:JSON.stringify(formIds)}).then(function () {
                app.globalData.formIds = [];
            });
        }
    },
    onScanCode() {
        wx.scanCode({
            onlyFromCamera: true,
            success: (res) => {
                let resultObj, encryptData;
                if(res.scanType == 'WX_CODE' && !res.result){
                   return false; 
                }else{
                    if (res.result.indexOf("id=") > 0) {
                        encryptData = res.result.split("id=")[1];
                        resultObj = JSON.parse(app.utils.base64.decode(encryptData));
                    } else {
                        if (app.utils.base64.isBase64(res.result)) {
                            let decryptData = app.utils.base64.decode(res.result);
                            if (app.utils.format.isJSON(decryptData)) {
                                resultObj = JSON.parse(decryptData);
                            } else {
                                wx.showToast({
                                    title: '无效的二维码!',
                                    icon: "none",
                                    duration: 2000
                                });
                                return false;
                            }
                        } else {
                            wx.showToast({
                                title: '无效的二维码.',
                                icon: "none",
                                duration: 2000
                            });
                            return false;
                        }
                    }                    
                }
                switch (resultObj.type) {
                    case "CASHPOS": //处理付款码
                        wx.navigateTo({
                            url: '../pay_/index?id=' + encryptData,
                        });
                        break;
                    case "STORE": //处理店铺码
                        wx.navigateTo({
                            url: '../shop_detail/index?id=' + resultObj.data.seller_id + "&from=" + resultObj.data.from,
                        })
                        break;
                    default:
                        wx.showToast({
                            title: '无效的二维码',
                            icon: "none",
                            duration: 2000
                        });
                        break;
                }
            }
        });
    },
    onPageScroll(e) {
        var that = this;
        if (!that.data.showHeaderShadow) that.setData({showHeaderShadow: true});
        if (e.scrollTop < 80) {
            if (that.data.showHeaderShadow) that.setData({showHeaderShadow: false});
        }
    },
    preload: {
        data() {
            [1, 2].forEach(function (value) {
                app.utils.http.post('index/data', {type: value}).then(function (res) {
                    let sellerList = [];
                    res.map(item => {
                        let dHeight = 0;
                        if (item.seller_isPromotion) dHeight += 50;
                        if (item.seller_coupon) dHeight += item.seller_coupon.length * 50;
                        Object.assign(item, {
                            deploy_height: dHeight
                        });
                        sellerList.push(item)
                    });
                    wx.setStorageSync('INDEX_DATA_TYPE' + value, sellerList);
                });
            })
        },
        //预加载领券中心数据
        receive() {
            wx.request({
                url: app.data.api + 'coupon/index', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                    longitude: wx.getStorageSync('longitude'),
                    latitude: wx.getStorageSync('latitude')
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        wx.setStorageSync('RECEIVEDATA', res.data.datas);
                    }
                }
            });
        },
        //附近首屏
        nearby() {
            wx.request({
                url: app.data.api + 'nearby/index', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token: app.data.token ? app.data.token : wx.getStorageSync('token'),
                    longitude: wx.getStorageSync('longitude'),
                    latitude: wx.getStorageSync('latitude'),
                    category: 1,
                    page: 1
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        wx.setStorageSync('NEARBYCLASS1PAGE1', {
                            sellerList: res.data.datas.list,
                            currentPage: 1
                        });
                    }
                }
            });
        }
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
    onModalClose() {
        // wx.setStorageSync('_isFirstLogin',false);
        this.setData({
            showFirstModal: false
        })
    },
    onClickReceive() {
        let that = this;
        let _isBind = wx.getStorageSync('_isBind') || false;
        if (!_isBind) {
            let _layoutComponent = that.selectComponent("#layout");
            _layoutComponent.onShowMobileBindModal(null, false, that.onReceiveGiftPackage);
            return false;
        }
        that.onReceiveGiftPackage();
    },
    //手机绑定完成的回调
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
            return false;
        }).catch(function () {
            that.onModalClose();
        });
    },
    onSwiperClick(e) {
        let that = this;
        let index = e.currentTarget.dataset.index;
        let swiperData = that.data.swiperList[index];
        switch (swiperData.banner_type) {
            case 1: //内链
                wx.navigateTo({
                    url: '../../' + swiperData.banner_url
                });
                break;
            case 2: //外链
                wx.navigateTo({
                    url: '../activity/index?src=' + encodeURIComponent(swiperData.banner_url)
                });
                break;
        }

    },
    onShare() {
        wx.navigateTo({
            url: '../share/index'
        })
    },
    onShareAppMessage: function () {
        return app.utils.share.getShareInfo();
    }
});

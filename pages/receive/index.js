//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        lists: "",
        id_: "",
        click: 0,
        list: "",
        total_: "",
        blind: "",
        hideHeader: true,
        scrollTop: "0",
        canvas_id: 1,
        length: "",
        scrollTop: "",
        height: "",
        imgs: "",
        pageLoaded: false
    },
    onLoad: function () {
        var width_ = "";
        wx.getSystemInfo({
            success: function (res) {
                width_ = res.windowWidth;
            }
        });
        var round = width_ / 750 * 48;
        // wx.showLoading({
        //     title: '加载中',
        // })
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        var keywords = this.data.keywords;

        let cached = wx.getStorageSync('RECEIVEDATA');
        if (cached) {
            that.handleData(that,cached);
        }else{
            wx.request({
                url: post_url + 'coupon/index', //仅为示例，并非真实的接口地址
                method: "POST",
                data: {
                    token: token,
                    longitude: wx.getStorageSync('longitude'),
                    latitude: wx.getStorageSync('latitude')
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    if (res.data.code == 200) {
                        that.handleData(that,res.data.datas);
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
    },
    handleData(that,data) {

        var arr = [];
        var arr_ = [];
        var total_ = [];
        var scrollTop = []
        var length = 0;
        var arr1 = []
        for (var x in data) {
            length += data[x].name.length + 2;
            arr[arr.length] = data[x].name;
            arr_[arr_.length] = data[x].id;
            total_[total_.length] = data[x].couponList;
            scrollTop[scrollTop.length] = 0;
            arr1[arr1.length] = data[x].image
        }

        that.setData({
            length: length * 32,
            lists: arr,
            id_: arr_,
            total_: total_,
            scrollTop: scrollTop,
            imgs: arr1,
            pageLoaded: true
        });
    },
    go_shop: function (e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../coupon_detail/index?&id=' + id + '&isShowSeller=1',
        })
    },
    click: function (e) {
        var eq = e.currentTarget.dataset.id;
        var scrollTop = this.data.scrollTop;
        wx.pageScrollTo({
            scrollTop: scrollTop[eq]
        })
        this.setData({
            click: eq
        });
    },
    search: function () {
        wx.navigateTo({
            url: '../search/index',
        })
    },
    onPullDownRefresh: function () {
        var width_ = "";
        wx.getSystemInfo({
            success: function (res) {
                width_ = res.windowWidth;
            }
        });
        var round = width_ / 750 * 48;
        wx.showLoading({
            title: '加载中',
        })
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        var keywords = this.data.keywords;
        wx.request({
            url: post_url + 'coupon/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
                longitude: wx.getStorageSync('longitude'),
                latitude: wx.getStorageSync('latitude')
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                wx.hideLoading();
                if (res.data.code == 200) {
                    var arr = [];
                    var arr_ = [];
                    var total_ = [];
                    var scrollTop = []
                    for (var x in res.data.datas) {
                        arr[arr.length] = res.data.datas[x].name;
                        arr_[arr_.length] = res.data.datas[x].id;
                        total_[total_.length] = res.data.datas[x].couponList;
                        scrollTop[scrollTop.length] = 0;
                    }
                    that.setData({
                        lists: arr,
                        id_: arr_,
                        total_: total_,
                        scrollTop: scrollTop
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
        wx.stopPullDownRefresh();
    },
    refresh: function (e) {
        // var self = this;
        // setTimeout(function () {
        //   console.log('下拉刷新');
        //   var date = new Date();
        //   self.setData({
        //     refreshTime: date.toLocaleTimeString(),
        //     hideHeader: false
        //   });

        //   var post_url = app.data.api;
        //   var token = app.data.token;
        //   var keywords = self.data.keywords;
        //   wx.request({
        //     url: post_url + 'nearby', //仅为示例，并非真实的接口地址
        //     method: "POST",
        //     data: {
        //       token: token,
                // longitude: wx.getStorageSync('longitude'),
                // latitude: wx.getStorageSync('latitude')
        //     },
        //     header: {
        //       'content-type': 'application/json' // 默认值
        //     },
        //     success: function (res) {
        //       wx.hideLoading();
        //       if (res.data.code == 200) {
        //         var arr = [];
        //         var arr_ = [];
        //         var total_ = [];
        //         for (var x in res.data.datas.category_all) {
        //           arr[arr.length] = res.data.datas.category_all[x].category_name;
        //           arr_[arr_.length] = res.data.datas.category_all[x].id;
        //           total_[total_.length] = res.data.datas.category_all[x].seller_all;
        //         }
        //         self.setData({
        //           lists: arr,
        //           id_: arr_,
        //           total_: total_,
        //           hideHeader:true
        //         })
        //       } else {
        //         wx.showToast({
        //           title: res.data.datas.error,
        //           icon: 'none',
        //           duration: 2000
        //         });
        //       }
        //     }
        //   });
        // }, 300);
    },
    scroll: function (event) {
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },
    onPageScroll: function (e) {
        var click = this.data.click;
        var scrollTop = this.data.scrollTop;
        scrollTop[click] = e.scrollTop;
    },
    get_rec: function (e) {
        wx.showLoading()
        var id = e.currentTarget.dataset.id;
        var post_url = app.data.api;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var that = this;
        var eq_ = this.data.click;
        var total_ = this.data.total_;
        var total = total_[eq_];

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
                    if (!res.data.datas.canReceive) {
                        for (var x in total) {
                            if (total[x].id == id) {
                                total[x].state = 0
                            }
                        }
                        that.setData({
                            total_: total_
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
})
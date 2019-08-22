//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        showIndex:-1,
        wash_type:'',
        datas:'',
        pageLoaded: false,
        selected:true,
        selected1:false
    },
    onShow: function () {
        var that = this;
    },
    onTabSelect(e) {
        if (e.currentTarget.dataset.index != this.data.showIndex) {
          this.setData({
            showIndex: e.currentTarget.dataset.index
          });
        } else {
          this.setData({
            showIndex: -1
          })
        }
    },
    setType(e){
        var that= this;
        var wash_type = e.currentTarget.dataset.type;
        wx.setStorageSync('wash_type', wash_type);
    },
    jumpToCleanshop(e) {
        var wash_car_type = e.currentTarget.dataset.cartype;
        wx.setStorageSync('wash_car_type', wash_car_type);
        wx.navigateTo({
            url: '../cleanshop/index',
        })
    },
    onLoad(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        var type = option.type;
        if(type == 'clean'){
            that.loadClean()
        }else if (type == 'beaty'){
            that.loadBeaty()
        }

    },
    home() {
        wx.redirectTo({
            url: '../index/index',
        });
    },
    carbeaty_detail(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../carbeaty_detail/index?id=' + id,
        })
    },
    loadBeaty() {
        this.setData({
            selected:false,
            selected1:true
        })
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'beauty/index', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token: token,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        beaty_banner:res.data.datas.banner,
                        beaty_content:res.data.datas.content
                    });
                } else {
                    wx.showToast({
                        title: res.data.datas.error.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    loadClean() {
        this.setData({
            selected:true,
            selected1:false
        })
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.request({
            url: app.data.api + 'wash/index', //仅为示例，并非真实的接口地址
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
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        datas:res.data.datas
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
    expect: function(){
        wx.showToast({
            title: '敬请期待',
            icon: "none", 
            duration: 2000,
        })
    },
})
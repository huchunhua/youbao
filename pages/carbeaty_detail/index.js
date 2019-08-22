//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
    data: {
        id:'',
        service_content:'',
        material:'' ,
        precautions:''    
    },
    jumpToCarbeauty(){
        wx.navigateTo({
            url: '../carbeaty/index',
        })
    },
    jumpToBeatyshop(e) {
        var that = this;
        var id = wx.getStorageSync('beaty_id');
        var car_type = e.currentTarget.dataset.cartype;
        wx.navigateTo({
            url: '../beatyshop/index?car_type=' + car_type + '&id=' +id,
        })
    },
    onLoad(option) {
        var that = this;
        var token = app.data.token ? app.data.token : wx.getStorageSync('token');
        wx.setStorageSync('beaty_id', option.id);
        let id = wx.getStorageSync('beaty_id');
        wx.request({
            url: app.data.api + 'beauty/detail', //仅为示例，并非真实的接口地址
            method: "POST",
            data: {
                token:token,
                id:id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                // wx.hideLoading();
                if (res.data.code == 200) {
                    that.setData({
                        pageLoaded: true,
                        datas:res.data.datas,
                        service_content:res.data.datas.service_content,
                        material:res.data.datas.material,
                        precautions:res.data.datas.precautions
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
    home() {
        wx.redirectTo({
            url: '../index/index',
        });
    }
})
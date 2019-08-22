//index.js
//获取应用实例
const app = getApp()
app.authorize.interceptors.identity({
    data: {
        datas: {
            banner: "https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/vouchers.jpg"
        },
    },
    onLoad() {
      console.log("扫码领券")
    },
    getVouchers(e) {
        app.utils.http.post('coupon/codeGetCoupon', {}).then(function (res) {
            console.log(res);
            wx.showModal({
              title: '提示',
              content: '恭喜您，领取成功！',
              showCancel: false,
              success (res) {
                if (res.confirm) {
                    wx.redirectTo({
                      url: '../index/index'
                    })
                } else if (res.cancel) {

                }
              }
            })
        }).catch(function (error) {
            setTimeout(function () {
              wx.redirectTo({
                url: '../index/index'
              })
            },2000)

        });
    },
})

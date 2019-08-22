//index.js
//获取应用实例
const app = getApp()
app.authorize.interceptors.identity({
    data: {
        datas: {
            banner: "https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/etc.jpg"
        },
    },
    goYoutu(e) {
      wx.navigateToMiniProgram({
        appId: 'wx697ddd7f9501ab84',
        path: 'pages/index/index?share=shop_1030',
        extraData: {
          foo: 'bar'
        },
        envVersion: 'release',
          success(res) {
          // 打开成功
          }
        })
    },
})

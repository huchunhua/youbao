//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    src:""
  },
  onLoad: function (option) {
    var id=option.id;
    this.setData({
      src:id
    })
  }
})
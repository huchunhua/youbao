//index.js
//获取应用实例
const app = getApp()

app.authorize.interceptors.identity({
  data: {
    pageLoaded: false,
    array:[
      "男",
      "女",
      "保密"
    ],
    sourceType:[
      "拍照",
      "我的相册"
    ],
    ischangeimgModal:false,
    index:"0",
    phone:"",
    img:"https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/oil/person/avater_bg.png",
    name:"",
    age:"",
    end_time:"",
    truename:'',
    carnum:''
  },
  onLoad: function () {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp * 1000 - 18*366*24*3600*1000;
    var date = new Date(n);
    //年
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + 1);
    var now = Y + "-" + M + "-" + D;
    console.log(now);
    this.setData({
      end_time:now
    });
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    that.setData({
      nickname: userInfo.nickName,
      avatar: userInfo.avatarUrl,
      index: userInfo.gender
    })
    wx.request({
      url: post_url + 'member/profile', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          var avatar = res.data.datas.member_avatar ? res.data.datas.member_avatar : userInfo.avatarUrl;
          that.setData({
            pageLoaded: true,
            age: res.data.datas.member_birthday,
            phone: res.data.datas.member_mobile,
            index:res.data.datas.member_sex+"",
            truename:res.data.datas.member_truename,
            carnum:res.data.datas.member_carnum,
            avatar: avatar
          })
        }
      },
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
  },
  name:function(e){
    this.setData({
      name:e.detail.value
    });
  },
  mobile:function(e){
    this.setData({
      phone:e.detail.value
    });
  },  
  truename(e) {
    this.setData({
      truename: e.detail.value
    })
  },
  age:function(e){
    this.setData({
      age: e.detail.value
    });
  },
  openchangeImg:function () {
    this.setData({
      ischangeimgModal: true
    })
  },  
  closechangeImg:function () {
    this.setData({
      ischangeimgModal: false
    })
  },
  carnum(e) {
    this.setData({
      carnum: e.detail.value
    })
  },

 changeimg:function(e){
    const that=this;
    const post_url = app.data.api;
    const token = app.data.token ? app.data.token : wx.getStorageSync("token");
    const sourceType=e.currentTarget.dataset.sourcetype;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: [sourceType],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          that.setData({
            // avatar:tempFilePaths[0],
            ischangeimgModal: false
          })
          wx.uploadFile({
            url: post_url + 'asset/upload', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[0],
            name: 'imgFiles[0]',
            formData: {
              token: token
            },
            success: function (res) {
              const data = JSON.parse(res.data);
              if (data.code == 200) {
                that.setData({
                  avatar: data.datas.paths[0],
                })
              }
            }
          });
        }
      })
  },
  submit:function(){
    var post_url = app.data.api;
    var token = app.data.token ? app.data.token : wx.getStorageSync('token');
    var that = this;
    var member_mobile=this.data.phone;
    var member_age=this.data.age;
    var member_truename=this.data.truename;
    var member_sex=this.data.index;
    var member_carnum= this.data.carnum;
    var member_avatar = this.data.avatar;
    var reg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    if (member_truename == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: "none",
        duration: 2000
      });
      return false;
    }else if(reg.test(member_truename) == false){
      wx.showToast({
        title: '请输入正确的姓名',
        icon: "none",
        duration: 2000
      });
      return false;      
    }
    if(member_age==""){
      wx.showToast({
        title: '年龄不能为空',
        icon:"none",
        duration:2000
      });
      return false;
    };
    if(member_carnum ==""){
      wx.showToast({
        title: '车牌号不能为空',
        icon:"none",
        duration:2000
      });
      return false;      
    }else{
        var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        if(express.test(member_carnum) == false){
          wx.showToast({
            title: '车牌号格式错误',
            icon:"none",
            duration:2000
          });
          return false;  
        };
    }
   console.log(member_truename);
    wx.request({
      url: post_url + 'member/profile', //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        token: token,
        change:1,
        member_mobile: member_mobile,
        member_birthday: member_age,
        member_truename: member_truename,
        member_sex: member_sex,
        member_carnum: member_carnum,
        member_avatar: member_avatar
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.datas,
            icon: "none",
            duration: 2000,
            success:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          });
        }else{
          wx.showToast({
            title: res.data.datas.error,
            icon: "none",
            duration: 2000
          });
        }
      },
    })
  }
})

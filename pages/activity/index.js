//index.js
//获取应用实例
const app = getApp();

app.authorize.interceptors.identity({
    data: {
        src: ""
    },
    onLoad: function (option) {
        let src = decodeURIComponent(option.src);
        let fix = src.indexOf('?') > -1 ? '&' : '?';
        this.setData({
            src: src+fix+new Date().getTime()
        });
    }
});
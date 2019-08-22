const app = getApp();
const utils = {
    config: {
        baseApiUrl: "https://oil.hkyx365.com/oli/"
    },
    //wx.request封装为Promise
    http: {
        post(url = '', params = {}) {
            const _token = wx.getStorageSync('token');
            // const _token = '52843427acc9ed3ec812f5f9a8fac252';
            if (_token && _token != "" && _token != undefined && _token !== null) {
                if (typeof(params) == "undefined") {
                    params = {token: _token};
                } else {
                    params.token = _token;
                }
            }
            return utils.http.request(url, params, 'POST')
        },
        get(url = '', params = {}) {
            return utils.http.request(url, params, 'GET')
        },
        request(url = '', params = {}, method = 'POST') {
            return new Promise((resolve, reject) => {
                wx.request({
                    url: utils.config.baseApiUrl + url,
                    method: method,
                    data: params,
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    success: function (res) {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            if (res.data.code == 200) {
                                resolve(res.data.datas);
                            } else {
                                wx.showToast({
                                    title: res.data.datas.error,
                                    icon: 'none',
                                    duration: 2000
                                })
                                reject(res.data);
                            }
                        } else {
                            wx.showToast({
                                title: 'ERROR: ' + res.statusCode + httpStatusCode[res.statusCode],
                                icon: 'none',
                                duration: 2000
                            })
                            reject(res.data);
                        }
                    },
                    fail: function (res) {
                        reject(res);
                    }
                })
            });
        }
    },
    base64: {
        encode(str) {
            var c1, c2, c3;
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var i = 0, len = str.length, strin = '';
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    strin += base64EncodeChars.charAt(c1 >> 2);
                    strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
                    strin += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    strin += base64EncodeChars.charAt(c1 >> 2);
                    strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
                    strin += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                strin += base64EncodeChars.charAt(c1 >> 2);
                strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                strin += base64EncodeChars.charAt(c3 & 0x3F)
            }
            return strin
        },
        decode(input) {
            var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = base64EncodeChars.indexOf(input.charAt(i++));
                enc2 = base64EncodeChars.indexOf(input.charAt(i++));
                enc3 = base64EncodeChars.indexOf(input.charAt(i++));
                enc4 = base64EncodeChars.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            return utils.utf8.decode(output);
        },
        isBase64(str) {
            return utils.base64.encode(utils.base64.decode(str)) == str;
        }
    },
    utf8: {
        decode(utftext) {
            var string = '';
            let i = 0;
            let c = 0;
            let c1 = 0;
            let c2 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c1 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                    i += 2;
                } else {
                    c1 = utftext.charCodeAt(i + 1);
                    c2 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                    i += 3;
                }
            }
            return string;
        }
    },
    format: {
        time(date) {
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            const day = date.getDate()
            const hour = date.getHours()
            const minute = date.getMinutes()
            const second = date.getSeconds()

            return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
        },
        number(n) {
            n = n.toString()
            return n[1] ? n : '0' + n
        },
        isJSON(str) {
            if (typeof str == 'string') {
                try {
                    var obj = JSON.parse(str);
                    if (typeof obj == 'object' && obj) {
                        return true;
                    } else {
                        return false;
                    }

                } catch (e) {
                    return false;
                }
            }
            return false;
        }
    },
    interceptors: {
        identity(pageObj) {
            if(pageObj.onShow){
                let _pages = getCurrentPages();
                let _onShow = pageObj.onShow;
                pageObj.onShow = function(){
                    let _token = wx.getStorageSync('token');
                    if(_token && _token != "" && _token != undefined && _token !== null){
                        // app.data.token = _token;
                        let currentInstance = _pages[_pages.length - 1];
                        _onShow.call(currentInstance);
                    }else{
                        wx.redirectTo({
                            url: "/pages/login/index"
                        });
                        return false;
                    }
                }
            }
            return pageObj;
        }
    },
    share:{
        getShareInfo(toUser = false) {
            let _data = {
                title: "优宝加油，方便快捷又省钱",
                path: "/pages/index/index",
                imageUrl: "https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/share/share_normal.jpg"
            };
            if(toUser){
                let _id = wx.getStorageSync('_id');
                if(_id){
                    Object.assign(_data,{
                        path: "/pages/share/index?_id="+_id,
                        imageUrl: "https://youbao-1251769479.cos.ap-chengdu.myqcloud.com/share/share_friends.jpg"
                    })
                }
            }
            return _data;
        }
    }
};
module.exports = utils;

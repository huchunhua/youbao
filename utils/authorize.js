const app = getApp();
const utils = require('util.js');
const authorize = {
    /**
     * 该列表下的页面强制要求绑定手机号
     * path: 页面路径
     * block：是否阻塞
     */
    forceAuthorize: [
        // {path:"/pages/index/index", block: true},
        // {path: "/pages/nearby/index", block: false},
        {path: "/pages/receive/index", block: false},
        {path: "/pages/ticket_list/index", block: false},
        {path: "/pages/personal/index", block: false},
        // {path: "/pages/buy/index", block: false}
        // {path:"/pages/pay_/index", block: false}
    ],
    login() {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    if (res.code) {
                        utils.http.post('login/index', {code: res.code}).then(function (res) {
                            wx.setStorageSync('_id', res.id);
                            wx.setStorageSync('_isBind', res.isBind);
                            wx.setStorageSync('_isInvited', res.isBind);
                            wx.setStorageSync('_isFirstLogin', res.isFirstLogin);
                            wx.setStorageSync('token', res.token);
                            // wx.setStorageSync('token','2154d46645c3843aa19f72026ea186ec');
                            getApp().globalData.onLogined = true;
                            resolve(res);
                        }).catch(function (err) {
                            reject(err);
                        });
                    } else {
                        reject(res.errMsg);
                    }
                }
            })
        })
    },
    interceptors: {
        identity(pageObj) {
            if (pageObj.onLoad) {
                let _onLoad = pageObj.onLoad;
                pageObj.onLoad = function (args) {
                    let _pages = getCurrentPages(),
                        _currentPage = _pages[_pages.length - 1],
                        _layoutComponent = _currentPage.selectComponent("#layout"),
                        _token = wx.getStorageSync("token"),
                        _inForceAuth = undefined;

                    if (_currentPage) {
                        Object.assign(pageObj, {
                            route: {
                                path: '/' + _currentPage.__displayReporter.route,
                                query: _currentPage.__displayReporter.query,
                                scene: _currentPage.__displayReporter.showOptions.scene
                            }
                        });
                        _inForceAuth = authorize.forceAuthorize.find(item => {
                            return item.path == pageObj.route.path
                        });
                    } else {
                        console.error('运行时错误：无法获取页面实例');
                    }
                    console.log(_token);
                    if (_token && _token != "" && _token != undefined && _token !== null) {
                        let _isBind = wx.getStorageSync('_isBind');
                        if (_isBind && _isBind != "" && _isBind != undefined && _isBind !== null && _isBind == 1) {
                            _onLoad.call(_currentPage, args);
                        } else {
                            // 检查是否绑定手机，如果未绑定且当前页面在强制要求列表中，则要求绑定
                            utils.http.post("member/isBind").then(function (res) {
                                wx.setStorageSync('_isBind', res);
                                if (res == 0 && _inForceAuth != undefined) {
                                    if (_layoutComponent) {
                                        _layoutComponent.onShowMobileBindModal({
                                            eventObj: _onLoad,
                                            params: args
                                        }, _inForceAuth.block);
                                        if (_inForceAuth.block) return false;
                                    } else {
                                        wx.redirectTo({
                                            url: "/pages/login/bind"
                                        });
                                    }
                                    _onLoad.call(_currentPage, args);
                                } else {
                                    _onLoad.call(_currentPage, args);
                                }
                            }).catch(function (err) {
                                console.warn(err);
                                _onLoad.call(_currentPage, args);
                            })
                        }
                    } else {
                        authorize.login().then(function (res) {
                            if (res.isFirstLogin && !res.isBind && _inForceAuth != undefined) {
                                if (_layoutComponent) {
                                    _layoutComponent.onShowMobileBindModal({
                                        eventObj: _onLoad,
                                        params: args
                                    }, _inForceAuth);
                                    if (_inForceAuth.block) return false;
                                } else {
                                    wx.redirectTo({
                                        url: "/pages/login/bind"
                                    });
                                }
                            }
                            _onLoad.call(_currentPage, args);
                        }).catch(function (err) {
                            console.warn(err);
                        });
                        return false;
                    }
                }
            }
            return Page(pageObj);
        }
    },
};
module.exports = authorize;

const app = getApp()
Component({
    options: {
        multipleSlots: true, // 多slot支持
        addGlobalClass: true,
    },
    externalClasses: ['i-class'],
    data: {
        deploy: false
    },
    properties: {
        sellerInfo: {
            type: Object,
            value: {}
        }
    },
    methods: {
        onStation: function (e) {
            var id = e.currentTarget.dataset.id;
            var type = e.currentTarget.dataset.type;
            if(type == 1){
                wx.navigateTo({
                    url: "../station_detail/index?id=" + id,
                });
            }else{
                wx.navigateTo({
                    url: "../shop_detail/index?id=" + id,
                });
            }
        },
        onLocation: function () {
            var latitude = this.data.sellerInfo.seller_latitude;
            var longitude = this.data.sellerInfo.seller_longitude;
            var name = this.data.sellerInfo.seller_name;
            wx.openLocation({
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                name: name,
                scale: 15
            })
        },
        showStationExtend() {
            this.setData({
                deploy:this.data.deploy == false
            })
        }
    }
});

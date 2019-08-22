const app = getApp()
Component({
    externalClasses: ['i-class'],
    properties: {},
    methods: {
        onFormIdShadowSubmit(e) {
            let formIds = [];
            if(e.detail.formId && e.detail.formId != "the formId is a mock one"){
                let data = {
                    formId: e.detail.formId,
                    expire: parseInt(new Date().getTime() / 1000)+604800 //计算7天后的过期时间时间戳
                };
                formIds.push(data);//将data添加到数组的末尾
            }
            if(formIds && formIds.length > 0){
                app.utils.http.post('member/formid',{formIds:JSON.stringify(formIds)}).then(function () {
                    app.globalData.formIds = [];
                });
            }
            console.info('id:',e.detail.formId)
        }
    }
});

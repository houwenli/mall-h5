<template>
    <div class="abnormal-remind">
        <div class="abnormal-remind-text">
            <img src="@/assets/img/authorizeManagement.png" style="width:10rem;height:10rem;display:block;margin: 0 auto;" alt="">
            <p class="abnormal-remind-text-p">账号登录异常提示</p>
            <p class="abnormal-remind-text-p abnormal" style="color: #666666;font-weight: 400;">检测到您账号登录异常，建议您按照如下方法处理：</p>
            <p class="abnormal-remind-text-p intoWay"><i style="margin-right: .2rem;font-weight: 600;">·</i>通过万顺叫车小程序进入商城</p>
            <p class="abnormal-remind-text-p intoWay"><i style="margin-right: .2rem;font-weight: 600;">·</i>通过万顺叫车APP进入商城</p>
            <p class="abnormal-remind-text-p intoWay" style="margin-bottom:18px"><i style="margin-right: .2rem;font-weight: 600;">·</i>联系客服处理，服务热线：<span style="color:#E60113">400 642 4888</span></p>
            <p class="abnormal-remind-text-p tips">温馨提示：</p>
            <p class="abnormal-remind-text-p tips">通过万顺叫车小程序或APP进入商城余额支付更便捷哦</p>
        </div>
        <div class="abnormal-remind-button">
            <a href="tel:400-642-4888">联系客服</a>
            <p @click="noProcessing">暂不处理</p>
        </div>
        
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods:{
        // 暂不处理，回到上一级登录页
        noProcessing() {
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="less" scoped>
    .abnormal-remind {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .abnormal-remind-text {
            flex: 9;
            overflow: auto;
            .abnormal-remind-text-p {
                font-size: 16px;
                font-weight: 600;
                color: #000000;
                margin-bottom: .2rem;
                padding: 0 .8rem;
                &.abnormal {
                    margin-bottom: 18px;
                }
                &.intoWay {
                    font-weight: 400;
                    font-size: 15px;
                }
                &.tips {
                    font-size: 13px;
                    color: #666666;
                    font-weight: 400;
                    margin: 0;
                }
            }
        }
        .abnormal-remind-button {
            flex:1;
            width: 92%;
            margin:0 auto; 
            > a {
                width: 100%;
                height: 50px;
                display: block;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                line-height: 50px;
                background: #E60113;
                color:#fff;
                text-align: center;
            }
            >p {
                margin: 24px 0 46px 0;
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: #666666;
            }
        }
    }
</style>
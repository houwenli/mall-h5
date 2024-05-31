<template>
    <van-popup get-container="body" class="call-card" v-model="showCallCard" round position="bottom">
        <div class="store-popup-title"><img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showCallCard=false"></div>
        <div class="call-card-container">
            <p class="phone-tip">您将使用以下手机号码进行呼叫</p>
            <p class="phone-number">{{$store.getters.userInfo.mobile | transPhone}}</p>
        </div>
        <div class="footer-btn" @click="getTranPhone">
            <span>确认呼叫</span>
            <div>(电话号码加密，保障您的隐私)</div>
        </div>
    </van-popup>
</template>

<script>
import {bindPhone} from "@/api/motorCar.js"
export default {
    props:{
    },
    filters:{
        transPhone(val) {
            if(!val) return ''
            return `${val.substring(0,3)} ${val.substring(3,7)} ${val.substring(7,11)}`
        }
    },
    data() {
        return {
            showCallCard: false,
            item:{}
        }
    },
    methods:{
        getTranPhone() {
            console.log(this.item)
            bindPhone({idNumber: this.item.idNumber}).then(res=>{
                window.location.href=`tel:${res.data.telX}`
            })
        }
    }
}
</script>
<style lang="less" scoped>
.call-card {
    background: #f6f6f6;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    .store-popup-title {
      text-align: center;
      color: #000d1d;
      font-size: 16px;
      line-height: 22px;
      position: relative;
      padding-top: 12px;
      padding-bottom: 12px;
      // background: #fff;
      margin-bottom: 16px;
      > img {
        position: absolute;
        right: 24px;
        top: 15px;
        height: 20px;
        width: 27px;
      }
    }
    .call-card-container {
        text-align: center;
        .phone-tip {
            font-size: 15px;
            color: #191919;
            margin-bottom: 16px;

        }
        .phone-number {
            color: #FF450C;
            font-size: 24px;
            line-height: 33px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .change-tip {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            >img {
                width: 12px;
                height: 12px;
                margin-left: 4px;
            }
        }
    }
    .footer-btn {
        margin: 0 12px 12px;
        height: 44px;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 22px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        >span {
            color: #FFF9E9;
            line-height: 20px;
            font-size: 16px;
        }
        >div {
            color: #fff;
            font-size: 11px;
            line-height: 15px;
        }
    }
}
</style>



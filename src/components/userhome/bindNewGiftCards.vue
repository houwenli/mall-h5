<template>
  <div class="bind_new_gift_cards">
    <nav-bartop :title="$route.meta.title" :isConfirm="false" @clickBack="back" class="navtop"></nav-bartop>
    <div class="gift">
      <span class="sp">请输入礼品卡卡密</span>
      <div class="field">
        <van-field :clearable="true" class="my_field" :maxlength="15" v-model="cardKey" placeholder="卡密不区分大小写" type="text" />
      </div>
      <div class="btn" @click="bindFun">绑定</div>
    </div>
  </div>
</template>

<script>
import navBartop from '@/components/commons/navBartop'
import { valueCardCodeBanding } from '@/api/giftcard'
import {encrypt} from '@/utils/sign'
export default {
  name: 'bindNewGiftCards',
  components: {
    navBartop
  },
  data() {
    return {
      cardKey: ''
    }
  },
  methods: {
    valueCardCodeBandingFun(){
      // 加密
      let cardKey = encodeURIComponent(encrypt(this.cardKey,'wsfvaluecardkey2').encryptStr)
      valueCardCodeBanding(cardKey).then(res => {
        console.log(res,"绑卡成功");
        if(res.code === 200){
          this.$toast("绑定成功")
          setTimeout(() => {
            this.$router.back()
          }, 500);
        }else {
          this.$toast(res.description)
        }
      })
    },
    back(){
      this.$router.go(-1)
    },
    bindFun(){
      if(!this.cardKey) {
        this.$toast('请输入卡密')
      }
      this.valueCardCodeBandingFun()
    }
  }
}
</script>
<style scoped lang="less">
.bind_new_gift_cards {
  background-color: #fff;
  height: 100vh;
  .gift {
    padding: 1.2rem .72rem 0 .72rem;
    /deep/ .van-cell {
        padding: 0!important;
      }
      .sp {
        font-size: .64rem;
        color: #333;
      }
      .field {
        padding: 0 .4rem;
        background-color: #f5f5f5;
        border-radius: .3rem;
        .my_field {
          margin-top: .48rem;
          /deep/ .van-field__body {
              background-color: #f5f5f5;
            }
            /deep/ .van-field__control {
              height: 1.68rem;
              font-size: .56rem;
              border-radius: .2rem;
            }
        }
      }
    .btn {
      width: 100%;
      height: 1.52rem;
      line-height: 1.52rem;
      background-color: #E60113;
      font-size: .64rem;
      color: #fff;
      margin-top: 2.4rem;
      border-radius: 1rem;
      text-align: center;
    }
  }
}
</style>

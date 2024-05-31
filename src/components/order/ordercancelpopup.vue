<template>
    <div class="poupboxwrapper">
        <van-popup :value="isShowPoup" :close-on-click-overlay="false" position="bottom" class="poupbox" @close='closePoup'>
            <img class="close-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="closePoup" />
            <p class="title">{{isRefund?'申请退款':'取消订单'}}</p>
            <div class="scroll-container">
                <div class="reasonbox">
                    <p class="reasonbox_p">请选择{{isRefund?'申请退款':'取消订单'}}的原因</p>
                    <div class="reason">
                        <p v-for="(item,i) in dataList" :key="i" class="ptext" @click="checkreason(item,i)">
                            <span>{{item.text}}</span>
                            <img :src="$oss + '/order/no_choose.png'" class="img" alt="" v-if="!item.check">
                            <img :src="$oss + '/order/can_choose.png'" class="img" alt="" v-else>
                        </p>
                    </div>
                </div>
                <p class="addcart" v-if="!isMotorCar">
                    <span>提交后，将本单商品放回购物车中</span>
                    <van-switch v-model="checkedcart" active-color="#FF0A35" inactive-color="#eeeeee" class="switch" @input="onInput" />
                </p>
            </div>

            <div class="Submitbox">
                <van-button round type="danger" class="Submit" :class="{'ischeckreason':ischeck}" @click="Submitform" :disabled='!ischeck'>提交</van-button>
            </div>
        </van-popup>
    </div>
</template>
  
  <script>
import { getReasonList } from '@/api/backorderlist'
import { Button, Toast, Field, Popup, Tab, Tabs, List, PullRefresh, Switch } from 'vant'
export default {
    components: {
        [Popup.name]: Popup,
        [Switch.name]: Switch,
        [Button.name]: Button,
    },
    props: {
        isShowPoup: {
            type: Boolean,
            default: false
        },
        isShowCatSwitch: {
            type: Boolean,
            default: false
        },
        isRefund: {
            type: Boolean,
            default: false
        },
        isMotorCar: {
            type: Boolean,
            default: false
        },
        isThird: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            checkedcart: false,
            dataList: [
                { text: '地址信息填写错误', check: false },
                { text: '不想要了', check: false },
                { text: '商品错选/多选', check: false },
                { text: '商品无货', check: false },
                { text: '商品降价', check: false },
                { text: '没用/少用/错用优惠', check: false },
            ],
            ischeck: false,  // 选中
            checkindex: '',
            reasonType: ''
        }
    },
    watch: {
        isMotorCar(val) {
            if (val) {
                this.dataList.shift()
            }
        },
        isThird(val) {
            if (val) {
                this.getReasonList()
            }
        }
    },

    methods: {
        getReasonList() {
            let param = {after_sale_type: 0, is_received: 0}
            getReasonList(param).then((res) => {
                if (res.code == 200) {
                    let reasonKeys = Object.keys(res.data || {})
                    this.dataList = reasonKeys.map(item => {
                        return { 
                            text: res.data[item], 
                            check: false,
                            reasonType: item,
                        }
                    })
                }
            })
        },
        onInput(data) {
            // 虚拟商品不可以选择加入购物车
            if (this.isShowCatSwitch) {
                this.checkedcart = false
                Toast('虚拟商品暂不支持加购')
            }
        },
        // 选中
        checkreason(data, i) {
            this.dataList.map((item, index) => {
                if (i != index) {
                    item.check = false
                }
            })
            this.checkindex = i;
            this.checktext = data.text;
            this.dataList[i].check = true
            this.$set(this.dataList, i, this.dataList[i])
            this.ischeck = true;
            // 第三方增加一个原因id
            this.reasonType = data.reasonType || ''
        },
        // 提交
        Submitform() {
            let data = {
                index: this.checkindex,
                reason: this.checktext,
                addCart: this.checkedcart
            }
            if(this.reasonType) {
                data.reasonType = this.reasonType
            }
            this.$emit('submitPoup', data)
        },
        // 关闭弹出层
        closePoup() {
            this.ischeck = false;
            this.checkedcart = false;
            this.dataList.map((item, index) => {
                item.check = false
            })
            this.$emit('closePoup', false)
        }
    }
}
</script>
  
  <style lang="less" scoped>
.poupboxwrapper {
  /deep/ .van-popup {
    border-radius: 12px 12px 0 0;
  }
  .poupbox {
    color: #000;
    padding: 12px 12px 48px;
    max-height: 80vh;
    height: auto;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    .close-icon {
      position: absolute;
      right: 12px;
      top: 13px;
      width: 27px;
      height: 20px;
    }
    .title {
      font-size: 16px;
      text-align: center;
      padding-bottom: 12px;
      color: #191919;
    }
    .scroll-container {
        flex: 1;
        overflow-y: auto;
        .addcart {
            margin-top: 10px;
            margin-bottom: 12px;
            padding: 10px 12px;
            border-radius: 12px;
            background: #fff;
            font-size: 13px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: space-between;
            
            .switch {
                width: 50px;
                height: 30px;
                border: none;
                box-shadow: none;
                /deep/ .van-switch__node {
                    top: 50%;
                    transform: translateY(-50%);
                    left: 2px;
                    width: 26px;
                    height: 26px;
                    box-shadow: none;
                }
                &.van-switch--on {
                    /deep/ .van-switch__node{
                        transform: translateY(-50%) translateX(20px);
                    }
                }
            }
        }
    }
    .reasonbox {
        background: #fff;
        padding: 16px 12px 20px;
        border-radius: 12px;
        .reasonbox_p {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 20px;
            &::before {
                content: '*';
                color: #FF0A35;
            }
        }
        .ptext {
            margin-bottom: 24px;
            &:last-child {
                margin-bottom: 0;
            }
            font-size: 13px;
            color: #191919;
            display: flex;
            align-items: center;
            justify-content: space-between;
            img {
                width: 16px;
                height: 16px;
            }
        }
    }
    .Submitbox {
      width: 100%;
      padding: 4px 12px;
      background: #fff;
      box-shadow: 0px -2px 10px 0px rgba(189,194,204,0.2);
      position: absolute;
      bottom: 0;
      left: 0;
      .Submit {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #eee;
        color: #999;
        border-radius: 20px;
        font-size: 16px;
        border-color: transparent;
      }
      .ischeckreason {
        
        color: #FFF9E9;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
      }
    }
  }
}
</style>
  
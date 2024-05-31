<template>
    <van-popup get-container="body" v-model="popupDialog" round position="bottom" class="popupBox">
      <img class="close-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="popupDialog=false" />
      <h2>申请原因</h2>
      <div class="popupContent" v-for="(res, i) in applyList" :key="i" @click="selectApply(res, i)">
        <label class="applyTitle">{{ res.title }}</label>
        <img :src="$oss + '/order/no_choose.png'" alt="" v-if="!res.isSelect" />
        <img :src="$oss + '/order/can_choose.png'" alt="" v-else />
      </div>
    </van-popup>
</template>

<script>
import { getReasonList } from '@/api/backorderlist'
export default {
    data() {
        return {
            popupDialog: false,
            applyList: [
                { title: '卖家发错货', isSelect: false },
                { title: '发票问题', isSelect: false },
                { title: '七天无理由', isSelect: false },
                { title: '商品与页面描述不符', isSelect: false },
                { title: '质量问题', isSelect: false },
                { title: '其他', isSelect: false },
            ],
            thirdReasonLoad: false
        }
    },
    props: {
        isThird: {
            type: Boolean,
            default: false
        },
    },
    methods:{
        async getReasonList() {
            let param = {after_sale_type: 1, is_received: 1}
            await getReasonList(param).then((res) => {
                this.thirdReasonLoad = true
                if (res.code == 200) {
                    let reasonKeys = Object.keys(res.data || {})
                    this.applyList = reasonKeys.map(item => {
                        return { 
                            title: res.data[item], 
                            isSelect: false,
                            reasonType: item,
                        }
                    })
                }
            })
        },
        async init(params) {
            if(this.isThird && !this.thirdReasonLoad) {
                await this.getReasonList()
            }
            if(params.reason) {
                this.applyList.map((tes, i) => {
                    if (tes.title === params.reason) {
                        tes.isSelect = true
                    }
                })
            }
            this.popupDialog = true
        },
        selectApply(data) {
            for (let item of this.applyList) {
                item.isSelect = item.title == data.title
            }
            this.$emit('selectApply', data)
            this.popupDialog = false
        }
    }
}
</script>

<style lang="less" scoped>
.popupBox {
    padding: 12px;
    border-radius: 12px 12px 0 0 !important;
    max-height: 80vh;
    .close-icon {
        position: absolute;
        top: 13px;
        right: 12px;
        width: 27px;
        height: 20px;
    }
    h2 {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 34px;
    }
    .popupContent {
        display: flex;
        justify-content: space-between;
        padding-bottom: 22px;
        label {
            color: #191919;
            font-size: 13px;
            padding-left: 12px;
        }
        img {
            width: 16px;
            height: 16px;
        }
    }
}
</style>



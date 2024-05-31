<template>
    <div class="copun-item">
        <div class="copun-item-wrapper">
            <span class="label">订单备注</span>
            <div class="value" @click="showPopup">
                <span class="value-wrapper" :class="{ 'have-val': storeInfos[0].remark }">{{storeInfos[0].remark || '无备注'}}</span>
                <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/store-right-icon.png" alt="">
            </div>
        </div>
        <van-popup get-container="body" class="note-popup" v-model="showAll" round position="bottom">
            <div class="store-popup-title">订单备注<img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="showAll=false"></div>
            <div class="note-field-wrapper">
                <van-field
                    v-model="inputText"
                    rows="2"
                    autofocus
                    label=""
                    type="textarea"
                    maxlength="200"
                    placeholder="选填，请先和商家协商一致，付款后商家可见"
                    show-word-limit
                    :autosize='autosize'
                />
            </div>
            <div class="footer-btn">
                <div @click="addNote">确定</div>
            </div>
        </van-popup>
    </div>
</template>
<script>
export default {
    data() {
        return {
            showAll: false,
            storeInfos:[ 
                {
                  remark: '',
                },
            ],
            inputText: '',
            autosize: {
                maxHeight: 168,
                minHeight: 168
            }
        }
    },
    methods:{
        showPopup() {
            this.showAll = true
            this.inputText = this.storeInfos[0].remark
        },
        addNote() {
            this.showAll = false
            this.storeInfos[0].remark = this.inputText
            this.$emit('setData',this.storeInfos,"storeInfos")
        }
    }
}
</script>

<style lang="less" scoped>
.copun-item {
    margin-bottom: 18px;
    .copun-item-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .label {
            font-size: 13px;
            color: #191919;
            line-height: 17px;
            font-weight: bold;
        }
        .value {
           color: #6E6E6E;
           font-size: 13px;
           display: flex;
           align-items: center;
           flex:1;
           justify-content: flex-end;
           overflow: hidden;
           margin-left: 10px;
           .value-wrapper {
            overflow: hidden; /*超出部分隐藏*/
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /*规定段落中的文本不进行换行 */
            &.have-val {
                color: #191919;
            }
           }
           >img {
            width: 16px;
            height: 16px;
           }
        }
    }
    
}
.note-popup {
        min-height: 60vh;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        background: #F6F6F6;
        .store-popup-title {
            text-align: center;
            color: #000d1d;
            font-size: 16px;
            line-height: 22px;
            position: relative;
            padding-top: 12px;
            padding-bottom: 12px;
            // background: #fff;
            > img {
                position: absolute;
                right: 24px;
                top: 15px;
                height: 20px;
                width: 27px;
            }
        }
        .note-field-wrapper {
            flex: 1;
            overflow: hidden;
            padding: 12px;
            .van-cell {
                border-radius: 12px;
            }
        }
        .footer-btn {
            height: 48px;
            background: #FFFFFF;
            box-shadow: 0px -2px 10px 0px rgba(189,194,204,0.2);
            padding: 4px 12px;
            >div {
                height: 40px;
                background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
                border-radius: 20px;
                line-height: 20px;
                color: #FFF9E9;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                padding: 10px 0;
            }
        }
    }
</style>


<template>
    <van-popup get-container="body" class="filter-dialog" v-model="show" round position="bottom" :safe-area-inset-bottom="true">
        <div class="filter-popup-title">
            下单时间
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/basic_close_icon.png" alt="" @click="show=false">
        </div>
        <div class="container">
            <span class="time-item" :class="{'active':item.id == chooseItem.id}" v-for="(item,index) in list" :key="index" @click="choose(item)">{{ item.text }}</span>
        </div>
        <div class="footer-btn">
            <span class="reset" @click="reset">重置</span>
            <span class="save" @click="save">确定</span>
        </div>
    </van-popup>
</template>

<script>
export default {
    data() {
        return {
            show: false,
            list: Object.freeze([
                {
                    text: '全部',
                    id: '0'
                },
                {
                    text: '一月内',
                    id: '1'
                },
                {
                    text: '一个月至三个月',
                    id: '2'
                },
                {
                    text: '三个月至六个月',
                    id: '3'
                },
                {
                    text: '六个月至一年',
                    id: '4'
                },
                {
                    text: '一年以上',
                    id: '5'
                },
            ]),
            chooseItem: {}
        }
    },
    methods:{
        init(params) {
            if(!params.timeType) {
                this.chooseItem = this.list[0]
            } else {
                this.chooseItem = this.list.find(item=>item.id == params.timeType)
            }
            this.show = true
        },
        choose(item) {
            this.chooseItem = item
        },
        reset() {
            this.chooseItem = this.list[0]
        },
        save() {
            this.$emit('changeFilter', this.chooseItem)
            this.show = false
        }
    }
}
</script>

<style lang="less" scoped>
.filter-dialog {
    background: #fff;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    .filter-popup-title {
        line-height: 22px;
        text-align: center;
        color: #191919;
        font-size: 16px;
        position: relative;
        padding-top: 12px;
        padding-bottom: 12px;
        > img {
            position: absolute;
            right: 24px;
            top: 13px;
            height: 20px;
            width: 27px;
        }
    }
    .container {
        display: flex;
        flex-wrap: wrap;
        padding: 12px 24px 48px;
        .time-item {
            position: relative;
            width: 155px;
            height: 28px;
            line-height: 26px;
            background: #F6F6F6;
            border-radius: 14px;
            text-align: center;
            margin-bottom: 10px;
            font-size: 13px;
            border: 1px solid transparent;
            color: #191919;
            box-sizing: border-box;
            &:nth-child(2n-1) {
                margin-right: 17px;
            }
            &.active{
                color: #FF0A35;
                background: rgba(255, 231, 235, 0.50);
                &::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    border: 1px solid #FF0A35;
                    border-radius: 999px;
                    width: 200%;
                    height: 200%;
                    transform: scale(0.5);
                }
            }
        }
        
    }
    .footer-btn {
        height: 48px;
        padding: 4px 12px;
        padding-bottom: calc(~'4px + constant(safe-area-inset-bottom)'); /* 兼容 iOS < 11.2 */
        padding-bottom: calc(~'4px + env(safe-area-inset-bottom)'); /* 兼容 iOS >= 11.2 */
        display: flex;
        box-shadow: 0px -2px 10px 0px rgba(189,194,204,0.2);
        >span {
            flex: 1;
            height: 40px;
            font-size: 16px;
            border-radius: 20px;
            text-align: center;
            line-height: 38px;
        }
        .reset {
            margin-right: 13px;
            color: #444;
            border: 1px solid #C3C3C3;
        }
        .save {
            border: 1px solid transparent;
            background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
            color: #FFF9E9;
        }
    }
}
</style>



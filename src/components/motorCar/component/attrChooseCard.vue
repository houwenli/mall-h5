<template>
    <div class="attr-choose-card">
        <div class="attr-item">
            <p class="attr-title">颜色</p>

            <div class="color-choose-box">
                <color-item v-for="(item, index) in newUiImgList" :newUiImgList='newUiImgList' @click.native="changeAttr(item,index)" :item="item" :index="index" :key='index'></color-item>
            </div>
        </div>

        <div class="attr-item">
            <p class="attr-title">车辆定位</p>
            <div class="choose-box">
                <span class="checked">含GPS</span>
                <span>不含GPS</span>
            </div>
        </div>

        <div class="attr-item">
            <p class="attr-title">电池类型</p>
            <div class="choose-box">
                <span>48V20A</span>
                <span class="checked">不含电池</span>
            </div>
        </div>
        
    </div>
</template>

<script>
import ColorItem from './colorItem.vue'
export default {
    props:{
        newUiImgList: {
            type: Array,
            default: () => []
        }
    },
    inject: [
        'querySpu',
    ],
    computed:{
    },
    components:{
        ColorItem
    },
    data() {
        return {
            otherAttrList: [
                {
                    title: '车辆定位',
                    valueList: [
                        {
                            name: '含GPS',
                        },
                        {
                            name: '不含GPS',
                        }
                    ]
                },
                {
                    title: '电池类型',
                    valueList: [
                        {
                            name: '48V20A',
                        },
                        {
                            name: '不含电池',
                        }
                    ]
                },
            ]
        }
    },
    methods:{
        changeAttr(item,index) {
            this.querySpu(item.id)
        }
    }
}
</script>
<style lang="less" scoped>
.attr-choose-card {
    margin: 10px 0 0;
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    .attr-item {
        margin-bottom: 12px;
        .attr-title {
            color: #191919;
            font-size: 13px;
            font-weight: bold;
            line-height: 17px;
            margin-bottom: 8px;
        }
        .color-choose-box {
            display: flex;
            flex-wrap: wrap;
        }
        .choose-box {
            display: flex;
            flex-wrap: wrap;
            >span {
                height: 28px;
                color: #191919;
                font-size: 13px;
                line-height: 17px;
                border-radius: 14px;
                border: 1px solid transparent;
                padding: 5px 16px;
                background: #F6F6F6;
                margin-right: 12px;
                &.checked{
                    background: #FFE7EB;
                    border: 1px solid #FF0A35;
                    color: #FF0A35;
                }
            }
            
        }
    }
    
}
</style>


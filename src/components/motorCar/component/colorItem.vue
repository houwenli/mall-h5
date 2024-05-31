<template>
    <div class="color-item" :class="itemClass">
        <img class="scale-icon" @click.stop="openImg(index)" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/scalse-icon.png" alt="">
        <img class="good-color" :src="item.imgUrl" alt="">
        <p class="color-text">幻彩色</p>
    </div>
</template>

<script>
import { ImagePreview } from 'vant'
export default {
    props:{
        item: {
            type: Object,
            default: ()=>{}
        },
        index: {
            type: Number,
            default: 0
        },
        newUiImgList: {
            type: Array,
            default: () => []
        }
    },
    components:{
        [ImagePreview.name]: ImagePreview,
    },
    inject: [
        'selectProId'
    ],
    computed:{
        itemClass(){
            return {
                'have-mr': (this.index+1)%3 == 0,
                'ischoose': this.selectProId() == this.item.s1
            }
        }
    },
    data() {
        return {}
    },
    methods: {
        openImg(index) {
            let imgList = this.newUiImgList.map(item => {
                return item.imgUrl
            })
            ImagePreview({
                images: imgList,
                closeable: true,
                startPosition: index
            });
        },
    }
}
</script>

<style lang="less" scoped>
.color-item {
    width: 102px;
    height: 102px;
    border-radius: 12px;
    background: #F6F6F6;
    border: 1px solid transparent;
    position: relative;
    margin-right: 9px;
    margin-bottom: 8px;
    overflow: hidden;
    &.have-mr {
        margin-right: 0;
    }
    
    .scale-icon {
        position: absolute;
        right: 6px;
        top: 6px;
        width: 14px;
        height: 14px;
    }
    .good-color {
        width: 100%;
        height: 100%;
    }
    .color-text {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 22px;
        background: #F6F6F6;
        font-size: 13px;
        color: #191919;
        text-align: center;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
    }
    &.ischoose {
        border: 1px solid #FF0A35;
        .color-text{
            background: #FFE7EB;
            color: #FF0A35;
        }
    }
}
</style>



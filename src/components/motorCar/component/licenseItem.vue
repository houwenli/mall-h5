<template>
    <div class="license-item">
        <div class="license-img">
            <img :src="item.guidanceImage" alt="">
        </div>
        <div class="license-content">
            <div class="license-title">
                {{ item.guidanceTitle }}
            </div>
            <!-- <div class="license-p">
                {{ item.contentConfig }}
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    props: {
        item:{
            type: Object,
            default:()=>{}
        }
    },
    data() {
        return {}
    }
}
</script>

<style lang="less" scoped>
.license-item {
    padding: 10px 12px;
    display: flex;
    background: #fff;
    margin-bottom: 10px;
    border-radius: 12px;
    overflow: hidden;
    .license-img {
        width: 110px;
        height: 80px;
        margin-right: 10px;
        border-radius: 12px;
        overflow: hidden;
        >img {
            width: 100%;
            height: 100%;
        }
    }
    .license-content {
        flex: 1;
        overflow: hidden;
        .license-title {
            margin-bottom: 5px;
            color: #111111;
            font-size: 16px;
            line-height: 20px;
            font-weight: bold;
            width: 100%;
            overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /* 超出部分显示省略号 */
    white-space: nowrap; /*规定段落中的文本不进行换行 */
        }
        .license-p {
            font-size: 13px;
            line-height: 17px;
            color: #999;
            /* 超出两行隐藏 */
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
    }
}
</style>



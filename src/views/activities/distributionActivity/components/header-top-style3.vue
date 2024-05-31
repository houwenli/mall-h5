<template>
    <div class="header-title">
        <div class="header-back" @click="goBack">
            <img v-if="bgType == 1" src="https://wsjc-web.wsecar.com/wsf-mall/skuDetail/icon-left.png" alt="" />
            <img v-else src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/arrow-back-white-2x.png">
        </div>
        <img v-if="bgType == 2" class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-white-2x.png" alt="" />
        <img v-else class="header-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/distribution/logo-icon-grey-2x.png" alt="" />
    </div>
</template>
<script>
    export default {
        props: {
            bgType: {
                type: [String, Number]
            }
        },
        methods: {
            goBack() {
                this.$router.replace('/')
            }
        }
    };
</script>
<style lang="less" scoped>
    .header-title {
        display: flex;
        align-items: center;
        box-sizing: content-box;
        padding-left: 12px;
        padding: 6px 0px 4px 12px;
        .header-back {
            transform: scale(0.7);
            width: 32px;
            height: 32px;
            margin-right: 8px;
            img {
                width: 100%;
                height: 100%;
            }
        }

        .header-icon {
            width: 116px;
            height: 22px;
        }
    }
</style>

<template>
    <div class="header-title">
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
        }
    };
</script>
<style lang="less" scoped>
    .header-title {
        display: flex;
        align-items: center;
        box-sizing: content-box;
        padding: 11px 0px 8px 12px;
        .header-icon {
            width: 116px;
            height: 22px;
        }
    }
</style>

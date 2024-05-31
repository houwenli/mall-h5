<template>
    <van-action-sheet get-container="body" class="navigation-card" v-model="show" :actions="actions" cancel-text="取消" @select='select' close-on-click-action @click.stop="" />
</template>

<script>
export default {
    data() {
        return {
            show: false,
            item:{},
            actions: [{ name: '腾讯地图' }, { name: '高德地图' }, { name: '百度地图' }],
        }
    },
    methods: {
        select(action, index) {
            if(index == 0){
                window.open(`http://apis.map.qq.com/uri/v1/marker?marker=coord:${this.item.latitude},${this.item.longitude};addr:${this.item.address}`)
            } else if(index == 1) {
                window.open(`http://uri.amap.com/marker?position=${this.item.longitude},${this.item.latitude}&name=${this.item.address}&coordinate=gaode&callnative=1`)
            } else if(index == 2) {
                window.open(`http://api.map.baidu.com/marker?location=${this.item.latitude},${this.item.longitude}&title=${this.item.address}&content=所在位置的简介&output=html`)
            }
        },
        // 百度地图
        openBmap() {
            const uri = `baidumap://map/direction?destination=name:${this.item.address}|latlng:${this.item.latitude},${this.item.longitude}&mode=driving&src=andr.cheyw`;
            //         this.$toast("请先安装百度地图");
            if (window.ws) {
            // android环境
                // window.ws.openLocationAuthority();
            } else if (window.webkit) {
            // ios环境
                // window.webkit.messageHandlers.finishActivity.openLocationAuthority('');
            }
        },
        // 腾讯地图
        openTmap() {
            let uri = `qqmap://map/routeplan?type=drive&fromcoord=CurrentLocation&to=${this.item.address}&tocoord=${this.item.latitude},${this.item.longitude}&referer=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77`;
            if (window.ws) {
            // android环境
                // window.ws.openLocationAuthority();
            } else if (window.webkit) {
            // ios环境
                // window.webkit.messageHandlers.finishActivity.openLocationAuthority('');
            }
        },
        // 高德地图
        openAmap() {
            const uri = `amapuri://route/plan/?dlat=${this.item.latitude}&dlon=${this.item.longitude}&dname=${this.item.address}&dev=0&t=0`;
            const iosUrl = `iosamap://path?sourceApplication=cheyw&dlat=${this.item.latitude}&dlon=${this.item.longitude}&dname=${this.item.address}&dev=0&t=0`;
            if (window.ws) {
            // android环境
                // window.ws.openLocationAuthority();
            } else if (window.webkit) {
            // ios环境
                // window.webkit.messageHandlers.finishActivity.openLocationAuthority('');
            }
        }
    }
}
</script>

<style lang="less" scoped>
.navigation-card {
    background: transparent;
    padding: 0 16px 36px;
    .van-action-sheet__content {
        border-radius: 8px;
        .van-action-sheet__item {
            border-bottom: 1px solid #EAEAEA;
            color: #2956E1;
            font-size: 14px;
            &:last-child {
                border-bottom: none;
            }
        }
    }
    .van-action-sheet__gap {
        display: none;
    }
    .van-action-sheet__cancel {
        margin-top: 8px;
        border-radius: 8px;
        color: #2956E1;
        font-size: 14px;
    }
}
</style>


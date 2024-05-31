import { Dialog } from 'vant';
export default {
  methods: {
    callUp() {
      // window.location.href = 'tel:18040575109';
      Dialog.alert({
        message: '请手动拨打电话联系客服，客服电话：18040575109',
        closeOnClickOverlay: true
      }).then(() => {
        // on close
      });
    },
    openMap(item) {
        if (this.$store.state.userSource == 3) {
            this.$refs.navigationCard.show = true
            this.$refs.navigationCard.item = item
        } else {
            
            if (window.ws) {
                // android环境
                window.ws.openMapNavi(item.address, item.latitude, item.longitude);
            } else if (window.webkit) {
                // ios环境
                const params = {
                    endAddr: item.address,
                    endLat: item.latitude+'',
                    endLon: item.longitude+''
                }
                console.log(params)
                window.webkit.messageHandlers.openMapNavi.postMessage(params);
            }
        }
    },    
  },
}

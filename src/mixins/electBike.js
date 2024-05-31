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
    }
  },
}

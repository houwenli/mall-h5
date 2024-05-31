<template>
    <div @click.stop="navigate()" class="hot-car-box">
        <div class="title"></div>
        <div class="image_list">
            <div class="img_item" v-for="(item, index) in sildeshowList" @click="navigate(item, index)" :key="index">
                <div  class="image" :style="getSingleItemStyle(item)"></div>
                <p class="new-name">{{ item.text }}</p>
                <div class="new-price"><span>￥</span>{{ item.price }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sildeshowList: [
                {
                    url: '',
                    text: '万顺电动车',
                    price: 2399
                },
                {
                    url: '',
                    text: '万顺电动车',
                    price: 2399
                },
                {
                    url: '',
                    text: '万顺电动车万顺电动车万顺电动车',
                    price: 2399
                },
                {
                    url: '',
                    text: '万顺电动车',
                    price: 2399
                },
            ]
        }
    },
    methods: {
        /**
         * 单个图片的样式
         */
        getSingleItemStyle(item) {
            // 默认的占位图
            let defaultUrl = 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/549ce60fc79c20c37ba6c9b5ae879339.png'

            return {
                'background-image': item.url ? `url(${item.url})` : `url(${defaultUrl})`,
                'background-size': '100% 100%'
            }
        },

        navigate(data, index) {
            this.$router.push({
                path:'/motorCar/detail'
            })
        },
    },
}
</script>

<style lang="less" scoped>
.hot-car-box {
  position: relative;
  border-radius: 12px;
  margin-bottom: 12px;
  padding: 42px 4px 4px;
  box-sizing: border-box;
  background: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/electric-wares/classification/motor-hot-bg.png) no-repeat;
  background-size: 100% 100%;
  background-repeat: 'no-repeat';
  background-size: 'cover';
  background-position: 'center';
  .title {
    // position: absolute;
    top: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #222222;
  }
  .image_list {
    display: flex;
    overflow: auto;
    -ms-overflow-style: none; /* IE 10+ */
    scrollbar-width: none; /* Firefox */
    border-radius: 12px;
    background: #fff;
    .img_item {
      box-sizing: border-box;
      margin-right: 8px;
      text-align: center;
      width: 88px;
      .image {
        width: 88px;
        height: 88px;
        border-radius: 0.4rem;
      }
      .new-name {
        color: #444;
        font-size: 13px;
        margin-bottom: 4px;
        line-height: 14px;
        overflow: hidden; /*超出部分隐藏*/
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /*规定段落中的文本不进行换行 */
      }
      .new-price {
        width: 100%;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        color: #FF0A35;
        >span {
            font-size: 11px;
        }
      }
    }
    .img_item:last-child {
      margin-right: 0rem;
    }
  }
  .image_list::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
}
</style>



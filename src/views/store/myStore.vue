<template>
  <div class="content">
    <navbartop :title="$route.query.type == 1 ? '我的店铺' : '订阅店铺'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    
    <p class="title" v-if="list.length > 0">
      共订阅
      <span>{{ list.length }}</span>
      个店铺
    </p>

    <van-loading v-if="loading" />

    <div v-else>

      <div class="store-list" v-if="list.length > 0">
        <div class="card" v-for="(item, index) in list" :key="index" @click="toStore(item)">
          <div class="card_top">
            <img
              class="card_top_img"
              :src="item.imageUrl || `${$oss}/myStore/store.png`"
            />
            <div class="card_top_name">
              <span class="name">{{ item.storeName }}</span>
              <span class="follow" v-if="item.focusCount && item.focusCount != 0">订阅数{{ item.focusCount | filterFraction }}</span>
            </div>
          </div>
          <div class="card_content" v-if="item.skuList && item.skuList.length != 0">
            <div v-for="(ite, idx) in item.skuList" :key="idx" class="card_conten_img">
              <img :src="ite.url || `${$oss}/myStore/prestrain.png`" />
            </div>
          </div>
        </div>
      </div>

      <!-- 缺省页 -->
      <div v-else class="no-empty">
        <img :src="`${$oss}/myStore/empty.png`" alt="" />
        <p>没有关注的实体店~</p>
      </div>

    </div>
    
  </div>
</template>
<script>
  import navbartop from '@/components/commons/navBartop'
  import { getMySotre, getMyAttentionSotre } from '@/api/storeindex'
  import { Loading } from 'vant'
  export default {
    name: 'myStore',
    components: { navbartop, [Loading.name]: Loading },
    data() {
      return {
        list: [],
        loading: true, //是否在加载中
      }
    },
    filters: {
      filterFraction(val) {
        if (val === null || isNaN(val)) {
          return ''
        }
        if (val * 1 < 10000) {
          return val
        } else {
          return (val / 10000).toFixed(1) + '万'
        }
      },
    },
    created() {
      this.loading = true
      // 我的小店列表
      if (this.$route.query.type == 1) {
        getMySotre().then((res) => {
          if (res.code == 200) {
            this.list = res.data
            this.loading = false
          }
        })
      } else {
        // 关注店铺列表
        getMyAttentionSotre().then((res) => {
          console.log(res)
          if (res.code == 200) {
            this.list = res.data
            this.loading = false
          }
        })
      }
    },
    methods: {
      toStore(item) {
        if (this.ispress) {
          return false
        }
        this.ispress = true
        this.$router.push({
          path: '/storeindex',
          query: {
            type: this.$route.query.type,
            storeId: item.idNumber,
            isBack: 1,
          },
        })
        this.ispress = false
      },
    },
  }
</script>
<style lang="less" scoped>
  //加载中...
  .van-loading {
    height: 100vh;
    width: 100%;
    text-align: center;
    padding-top: 50%;
  }
  .content {
    height: 100%;
    overflow-y: scroll;
    background: #f6f6f6;
    .title {
      font-size: 11px;
      color: #999999;
      line-height: 15px;
      padding: 14px 8px 0;
      span {
        color: #ff0a35;
      }
    }
    .no-empty {
      position: fixed;
      left: 50vw;
      top:50vh;
      transform: translate(-50%,-50%);
      text-align: center;
      img {
        width: 160px;
        height: 160px;
      }
      p {
        margin-top: 8px;
        text-align: center;
        font-size: 13px;
        color: #444;
      }
    }
    .store-list {
      padding: 3px 8px 13px;
      .card {
        background: #ffffff;
        border-radius: 8px;
        padding: 11px 0px 12px;
        margin-top: 10px;
        .card_top {
          display: flex;
          align-items: center;
          padding: 0 11px;
          .card_top_img {
            width: 34px;
            height: 34px;
            margin-right: 7px;
            border-radius: 17px;
          }
          .card_top_name {
            font-weight: 400;
            font-size: 13px;
            color: #191919;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              display: block;
            }
            .name {
              line-height: 17px;
            }
            .follow {
              display: inline-block;
              padding: 0 4px;
              height: 14px;
              line-height: 14px;
              background: #ffe7eb;
              border-radius: 4px;
              font-size: 10px;
              color: #ff0a35;
            }
          }
        }
        .card_content {
          display: flex;
          justify-content: flex-start;
          padding: 11px 11px 0;
          .card_conten_img {
            width: 25%;
            height: 74px;
          }
          img {
            width: 74px;
            height: 74px;
            border-radius: 8px;
          }
          // img:last-child {
          //   margin-right: 0px;
          // }
        }
      }
    }
  }
</style>

<template>
  <div>
    <navbartop :title="'常用手机号'" @clickBack="backLastPage" :isConfirm="true" class="navtop"></navbartop>
    <div class="content" data-desc="常用手机号">
      <div v-for="(item, index) in list" :key="index" class="cell">
        <van-swipe-cell class="swipeCell" :disabled="item.mobileFlag == 1">
          <van-cell center :label="item.mobile" class="item">
            <template #title>
              <span class="title-nickname">{{ item.nickName || '暂无昵称' }}</span>
              <span class="title-place">( {{ item.mobileLocation }} )</span>
            </template>
            <template #right-icon>
              <img class="next" :src="`${$oss}/skuDetail/icon-right.png`" @click="operate('edit', item.id)" />
            </template>
          </van-cell>
          <template #right>
            <van-button square type="danger" class="delete-button" text="删除" @click="close(item)" />
          </template>
          <span v-if="item.defaultStatus == 1" class="subscript">默认</span>
        </van-swipe-cell>
      </div>
      <!-- 二次确认 -->
      <SecondConfirm
        :title="'确定删除？'"
        :cancleText="'取消'"
        :sureText="'确定'"
        :textshow="true"
        :textp="'删除后该号码将不作为常用号码管理'"
        :dialogshow="showConfirm"
        @closeBack="showConfirm = false"
        @rightEvent="deleteCustomerCommonPhone"
      ></SecondConfirm>
      <div class="footerBtn">
        <van-button color="linear-gradient(90deg, #ff5f2e 0%, #ff0a35 100%)" @click="operate('add')">添加联系人</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { SwipeCell } from 'vant'
  import { deleteCustomerCommonPhone, selectCustomerCommonPhoneListAndAdd } from '@/api/phoneCharge'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import navbartop from '@/components/commons/navBartop' // 导航栏
  import { appBack } from '@/utils/utils'
  export default {
    components: {
      [SwipeCell.name]: SwipeCell,
      SecondConfirm,
      navbartop,
    },
    data() {
      return {
        list: [],
        showConfirm: false,
        id: this.$route.query.id,
        slectItem: {}, //选中需要删除的信息
      }
    },

    created() {
      this.selectCustomerCommonPhoneListAndAdd()
    },

    methods: {
      operate(name, id) {
        if (name == 'add' && this.list.length == 10) {
          return this.$toast('最多可增加10个联系人')
        } else {
          this.$router.push({ path: '/editPhone', query: { id: id || '' } })
        }
      },
      close(item) {
        if (item.defaultStatus == 1) {
          this.$toast('默认充值号码不可删除')
          return
        }
        this.slectItem = item
        this.showConfirm = true
      },
      //删除常用联系人详情
      async deleteCustomerCommonPhone() {
        try {
          let params = {
            id: this.slectItem.id,
          }
          let res = await deleteCustomerCommonPhone(params)
          this.showConfirm = false
          if (res && res.code == 200) {
            this.selectCustomerCommonPhoneListAndAdd()
          } else {
            this.$toast(res.msg)
          }
        } catch (error) {
          console.log(error)
        }
      },
      //查询常用联系人
      async selectCustomerCommonPhoneListAndAdd() {
        try {
          let res = await selectCustomerCommonPhoneListAndAdd({})
          if (res && res.data) {
            this.list = res.data || []
          }
        } catch (error) {
          console.log(error)
        }
      },
      backLastPage() {
        appBack(this)
      },
    },
  }
</script>

<style lang="less" scoped>
  .content {
    padding: 1px 0px 58px;
    background: #f6f6f7;
    min-height: calc(~'100vh - 46px');
    overflow: hidden;
    .swipeCell {
      margin: 12px 12px 0 0px;
    }
    .item {
      width: auto;
      height: 99px;
      margin-left: 12px;
      background: #ffffff;
      border-radius: 12px;
      .title-nickname {
        color: #191919;
      }
      .title-place {
        color: #b4b7ba;
      }
      .title-nickname,
      .title-place {
        font-size: 15px;
        line-height: 19px;
      }
      /deep/.van-cell__label {
        font-size: 24px;
        font-weight: 600;
        color: #010b2a;
        line-height: 28px;
      }
      .next {
        width: 16px;
        height: 16px;
      }
    }
    .delete-button {
      height: 100%;
      background: #ff0a35;
      border-radius: 12px;
      margin-left: 8px;
    }
    .subscript {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 0;
      width: 52px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #2956e1;
      background: rgba(41, 86, 225, 0.12);
      border-radius: 0px 12px 0px 12px;
    }
    .footerBtn {
      position: fixed;
      bottom: 0;
      width: 100%;
      text-align: center;
      background: #ffffff;
      box-shadow: 0px -2px 10px 0px rgba(189, 194, 204, 0.2);
      padding-bottom: calc(constant(safe-area-inset-bottom)); /* 兼容 iOS < 11.2 */
      padding-bottom: calc(env(safe-area-inset-bottom)); /* 兼容 iOS >= 11.2 */
      /deep/.van-button {
        margin: 4px 0;
        width: 351px;
        height: 40px;
        border-radius: 20px;
      }
    }
  }
</style>

<template>
  <div class="gray-bg boxWrapper">
    <!-- <van-nav-bar title="消息中心" left-arrow fixed right-text="清除未读" @click-left="backCustomerCenter" @click-right="cleanRead" /> -->
    <navbartop
      :title="'消息中心'"
      :isradius="true"
      :isRight="unreadtotal > 0 ? true:false"
      :rightText="'清除未读'"
      @clickBack="backLastPage"
      @clickRight="clickRight"
      class="navtop"
    ></navbartop>
    <div class="applet-message-wrap">
      <div class="newsBox">
        <template v-for="(item, index) in list">
          <div class="news" :key="index" @click="toRoute(index)">
            <img :src="item.img" mode="" class="nesImg" />
            <div class="newsContent">
              <div class="news_title" :style="{ height: !item.content ? '100%' : '' }">
                <span class="title">{{ item.name }}</span>
                <span v-if="item.content">{{ item.time }}</span>
              </div>
              <div class="contentBox" v-if="item.content">
                <div class="content overline">
                  {{ item.content }}
                </div>
                <span class="unreadBox" v-if="item.unread > 0">{{ item.unread > 99 ? '99+' : item.unread }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
import navbartop from '@/components/commons/navBartop'
import { queryNews, queryNewsReadNums, updataNews } from '@/api/mynews'
export default {
  components: {
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    navbartop,
  },
  data() {
    return {
      list: [
        {
          img: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/083fc2fbf5725ed6ed43917584a78f2b.png',
          name: '交易物流',
          time: '',
          content: '',
          unread: 0,
        },
        {
          img: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/93038f3bf2c99598424030714d82eff3.png',
          name: '服务通知',
          time: '',
          content: '',
          unread: 0,
        },
        {
          img: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/150e7091e0eeaaf79d76b5e60921cd6e.png',
          name: '优惠促销',
          time: '',
          content: '',
          unread: 0,
        },
        {
          img: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/48bfa3ef55b47748a49d37a8462e8ebb.png',
          name: '账户通知',
          time: '',
          content: '',
          unread: 0,
        },
      ],
      formData: {
        msgGroup: -1,
        pageNum:0,
        pageSize:10000,
      },
      unreadtotal:0
    }
  },
  created() {
    document.body.removeAttribute('class', 'gray-bg')
    this.getList()
    this.readList()
  },
  methods: {
    // 消息未读数
    readList() {
      queryNewsReadNums().then(res=> {
        if (res.code == 200) {
          let temp = res.data.filter(ele => {
            if (ele.receiverType == 2) {
              return ele
            }
          })
          let arrRead = temp.map(item=> {
            return item.count
          })
          console.log(arrRead,'arrRead++++');
          this.list[0].unread = arrRead[0];
          this.list[1].unread = arrRead[1];
          this.list[2].unread = arrRead[2];
          this.list[3].unread = arrRead[3]; 

          // this.unreadtotal = temp[0].count + temp[1].count + temp[2].count + temp[3].count;
          this.unreadtotal = arrRead.reduce((prev, cur, index)=>{
            // console.log(prev, cur, index,'***********');
            return prev + cur
          })
        }
      })
    },
    // 消息列表
    getList() {
      queryNews(this.formData).then(res=> {
        if (res.code == 200) {
          let data = res.data.records;
          let [newsLogisticsArr,serverArr,promotionArr,accountArr] = [[],[],[],[]]
          let nowDate = new Date().getTime()
          // console.log(nowDate,'nowDate');
          data.map(item=> {
            if (item.msgGroup == 5) {
              newsLogisticsArr.push(item)
            } else if (item.msgGroup == 6) {
              serverArr.push(item)
            } else if (item.msgGroup == 7) {
              promotionArr.push(item)
            } else if (item.msgGroup == 8) {
              accountArr.push(item)
            }
          })
          console.log(newsLogisticsArr,'newsLogisticsArr');
          console.log(serverArr,'serverArr');
          console.log(promotionArr,'promotionArr');
          console.log(accountArr,'accountArr');
          if (newsLogisticsArr.length > 0) {
            this.list[0].time = newsLogisticsArr[0].createTime
            this.list[0].content = newsLogisticsArr[0].content
          }
          if (serverArr.length > 0) {
            this.list[1].time = serverArr[0].createTime
            this.list[1].content = serverArr[0].content
          }
          if (promotionArr.length > 0) {
            this.list[2].time = promotionArr[0].createTime
            this.list[2].content = promotionArr[0].content
          }
          if (accountArr.length > 0) {
            this.list[3].time = accountArr[0].createTime
            this.list[3].content = accountArr[0].content
          }
        }
      })
    },
    // 已读
    clickRight() {
      let param = {
        msgGroup:-1
      }
      updataNews(param).then((res) => {
        if(res.code == 200) {
          this.readList()
        }
      })
    },
    toRoute(index) {
      let url
      if (index == 0) {
        url = 'newsLogistics'
      } else if (index == 1) {
        url = 'newsServer'
      } else if (index == 2) {
        url = 'newsPromotion'
      } else if (index == 3) {
        url = 'newsAccount'
      }
      this.$router.push(url)
    },
    // 返回
    backLastPage() {
      this.$router.back()
    },
  },
}
</script>

<style lang="less" scoped>
body {
  overflow: visible;
}
.boxWrapper {
  height: 100%;
}
.applet-message-wrap {
  padding: 0 0.48rem;
  margin-top: 0.48rem;
}
.cleanBox {
  text-align: right;
  margin: 15px 0;
  .cleanImg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-top: -2px;
  }
  .clean {
    color: #bababa;
    fotn-size: 14px;
    margin-left: 2px;
  }
}
.news {
  width: 100%;
  height: 80px;
  background: #ffffff;
  border-radius: 10px;
  padding: 18px 12px 17px 10px;
  display: flex;
  margin-bottom: 12px;
  .nesImg {
    width: 45px;
    height: 45px;
    margin-right: 12px;
  }
  .newsContent {
    width: 272px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .news_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #bababa;
      font-size: 12px;
      .title {
        color: #000000;
        font-size: 17px;
      }
    }
    .contentBox {
      position: relative;
    }
    .content {
      color: #999999;
      font-size: 14px;
      width: 227.5px;
    }
    .unreadBox {
      font-size: 11px;
      position: absolute;
      top: 1.5px;
      right: 0;
      display: inline-block;
      padding: 3px 4px;
      height: 16px;
      line-height: 11px;
      border-radius: 8px;
      background-color: #e60113;
      color: #ffffff;
    }
  }
}
</style>

<template>
  <div class="gift_card">
    <header class="my_header">
      <nav-bartop :title="$route.meta.title" :isConfirm="false" @clickBack="back" class="navtop"></nav-bartop>
      <div class="gift_card_balance">
        <div class="card">
          <div class="text">
            <span class="sp_1">礼品卡余额</span>
            <span class="sp_2" @click="instructions = true">使用说明</span>
          </div>
          <div class="num">
            <span style="font-size: 1rem; margin-right: 10px">¥</span>
            <span style="font-size: 1.44rem">{{ fmoney(giftInfo.price, 2, true)[0] }}</span>
            <span style="font-size: 0.6rem">.{{ fmoney(giftInfo.price, 2, true)[1] }}</span>
          </div>
        </div>
      </div>
      <van-tabs @click="tabChangeFun" class="tabs" v-model="listParams.type" color="#E60113" line-width="28px" line-height="3px">
        <van-tab :title="`可用卡(${giftInfo.canUseNum})`" :name="0"></van-tab>
        <van-tab :title="`不可用卡(${giftInfo.canNotUseNum})`" :name="1"></van-tab>
      </van-tabs>
    </header>
    <div class="content">
      <van-list :immediate-check="false" v-model="loading" :finished="finished" :finished-text="finishedText" @load="onLoad">
        <div v-show="listParams.type === 0">
          <template v-if="records_0.length">
            <div class="min_card" v-for="(item,index) in records_0" :key="index">
              <div class="up">
                <div class="txt_1">
                  <span>{{ item.cardName }}</span>
                  <span class="sp" @click="usageRecordFun(item.valueCardCodeId)">
                    使用记录
                    <van-icon size="15px" color="#fff" name="arrow" />
                  </span>
                </div>
                <div class="txt_2">
                  <span>面值: {{ fmoney(item.cardPrice, 2, false) }}元</span>
                  <span>{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter }}</span>
                </div>
              </div>
              <div class="down">
                <div class="left">
                  <p>
                    余额:
                    <span>¥ {{ fmoney(item.balance, 2, false) }}</span>
                  </p>
                  <p style="float: left">
                    <span v-if="item.permittedType == 0">全平台商品可用</span>
                    <template v-if="item.permittedType == 1">
                      <span>{{`仅${item.marketingName}活动商品可用` | thumbnailString}}</span>
                      <van-icon v-if="`仅${item.marketingName}活动商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                    <template v-if="item.permittedType == 2">
                      <span>{{`仅${item.storeNames}店铺的商品可用` | thumbnailString}}</span>
                       <van-icon v-if="`仅${item.storeNames}店铺的商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                  </p>
                </div>
                <div class="right">
                  <div class="btn" @click="employFun(item)">去使用</div>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="default">
              <img
                style="width: 3.6rem; height: 3.6rem"
                src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/77c8114b247648bd1d72c9e3b448b2a5.png"
              />
              <p>暂无可用礼品卡</p>
            </div>
          </template>
        </div>
        <div v-show="listParams.type === 1">
          <template v-if="records_1.length">
            <div class="min_card" v-for="(item,index) in records_1" :key="index">
              <div class="up" style="background-color: #999">
                <div class="txt_1">
                  <span>{{ item.cardName }}</span>
                  <span class="sp" @click="usageRecordFun(item.valueCardCodeId)">
                    使用记录
                    <van-icon size="15px" color="#fff" name="arrow" />
                  </span>
                </div>
                <div class="txt_2">
                  <span>面值: {{ fmoney(item.cardPrice, 2, false) }}元</span>
                  <span>{{ item.validityStartTime | dateFilter }} - {{ item.validityEndTime | dateFilter }}</span>
                </div>
              </div>
              <div class="down">
                <div class="left" style="color: #999">
                  <p>
                    余额:
                    <span>¥ {{ fmoney(item.balance, 2, false) }}</span>
                  </p>
                  <p style="float: left">
                    <span v-if="item.permittedType == 0">全平台商品可用</span>
                    <template v-if="item.permittedType == 1">
                      <span>{{`仅${item.marketingName}活动商品可用` | thumbnailString}}</span>
                      <van-icon v-if="`仅${item.marketingName}活动商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                    <template v-if="item.permittedType == 2">
                      <span>{{`仅${item.storeNames}店铺的商品可用` | thumbnailString}}</span>
                       <van-icon v-if="`仅${item.storeNames}店铺的商品可用`.length>15" size="15px" name="info-o" @click="explainFun(item)" />
                    </template>
                  </p>
                </div>
                <div class="right">
                  <img v-if="item.status === 1" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/d844ed10650d39f8a3e46a6262165568.png" />
                  <img v-if="item.status === 2" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/aec4900bad335671cead01ac7bad42a7.png" />
                  <img v-if="item.status === 3" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ee52c5bf9218cf01463b141567e2b08c.png" />

                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="default">
              <img
                style="width: 3.6rem; height: 3.6rem"
                src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/77c8114b247648bd1d72c9e3b448b2a5.png"
              />
              <p>暂无不可用礼品卡</p>
            </div>
          </template>
        </div>
      </van-list>
    </div>
    <footer class="my_footer">
      <div class="tab_bar">
        <div class="tab_bar_item" v-for="(item, index) in options" :key="index" @click="skipFun(item)">
          <p class="image"><img :src="item.icon" alt="" srcset="" /></p>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </footer>
    <van-popup
      v-model="explain"
      closeable
      :close-on-click-overlay="false"
      :round="true"
      close-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
    >
      <div class="popup_text">
        <h3>说明</h3>
        <div class="content">
          <p>{{explainText}}</p>
        </div>
        <div class="btn" @click="explain = false">我知道了</div>
      </div>
    </van-popup>
    <van-popup
      v-model="instructions"
      closeable
      :close-on-click-overlay="false"
      :round="true"
      close-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
    >
      <div class="popup_text">
        <h3>使用说明</h3>
        <div class="instructions">
          <p>
                1、万顺福礼品卡(以下称“礼品卡”)指由武汉万顺福农特产电子商务有限公司发行的，现只存在实体卡形态，可以在万顺福商城（https://m.wsfmall.com/）上购买商城商品。用户可在万顺福商城“我的-礼品卡-绑定新卡”中输入卡密或直接扫描卡密二维码，绑定礼品卡。
              </p>
              <p>
                2、礼品卡分为三类，包括适用于全商城商品、适用于指定商铺商品，适用于指定活动商品等三种，绑卡成功后可在“我的-我的礼品卡”中获取礼品卡可适用范围信息。
              </p>
              <p>
                3、礼品卡可在万顺福商城购买，支付成功后可通过订单详情查询配送和物流轨迹。购买礼品卡支持开具电子普通发票。使用礼品卡购买商品时，订单金额中礼品卡支付的部分，将不再开具发票。
              </p>
              <p>
                4、使用礼品卡支付商品发生退货时，对于非包邮商品产生的运费部分如果物流已经介入且商品在途，则运费部分经由礼卡抵扣将不会退回原礼卡中，作直接扣除处理，反之，物流尚未介入则运费部分原路退回礼卡。
              </p>
              <p>
                5、订单中存在不支持使用礼品卡的商品时，无法使用礼品卡进行支付。
              </p>
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="usageRecord"
      closeable
      :close-on-click-overlay="false"
      :round="true"
      close-icon="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/e130282932de4df76a8123b597879978.png"
    >
      <div class="popup_text">
        <h3 class="van-hairline--bottom" style="margin-bottom: 0;padding-bottom:.4rem">使用记录</h3>
        <div class="usage_record" v-if="giftUsageList.length">
          <div class="van-hairline--bottom item" v-for="item in giftUsageList" :key="item.id">
            <div class="date">{{item.createTime}}</div>
            <div class="order" v-for="order in item.orderCodeList" :key="order">
              <span>订单: {{order}}</span>
              <span @click="copyCamilo(order)">复制</span>
            </div>
            <div class="money">
              <span :style="{'color': (+item.price>0)?'#6BC169':'#E60113'}">{{(+item.price>0)? `+${item.price}` : item.price }}</span>
              <span style="margin-left:20px;color:#666">余: {{ fmoney(item.balance) }}</span>
            </div>
          </div>
        </div>
        <div class="image" v-else>
          <img style="width:3.6rem;height:3.6rem" src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ca95e84591efdb4d4471abcbc2e82e3b.png" />
          <p>暂无使用记录</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
  import { valueCardCodeSelectPage, valueCardCodeCount, giftUsageLog } from '@/api/giftcard'
  import navBartop from '@/components/commons/navBartop'
  import { Tab, Tabs, Toast, Popup, List } from 'vant'
  import { debounce } from '@/utils/utils'
  let pageNum_0 = 1, pageNum_1 = 1, total = 0
  export default {
    components: {
      navBartop,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Popup.name]: Popup,
      [List.name]: List,
    },
    props: {},
    data() {
      return {
        loading: false,
        finished: false,
        explain: false, //说明弹窗显示/隐藏
        instructions: false, //使用说明
        explainText: '',
        usageRecord: false, //使用记录
        options: [
          { icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/ee375aaaa4c4236463147f9e491f36d5.png', label: '购买新卡', path: '' },
          {
            icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/f5164d067e6dc0453ad0bbd8674ab576.png',
            label: '绑定新卡',
            path: '/bindNewGiftCards',
          },
        ],
        giftInfo: {
          canNotUseNum: 0,
          canUseNum: 0,
          price: 0,
          thirdCateId: '',
        },
        listParams: {
          type: 0, //0可用卡 1不可用卡
          pageNum: 1, //当前页数，1是第一页
          pageSize: 10, //每页条数
        },
        records_0: [], // 可用卡列表
        records_1: [], // 不可用卡列表
        giftUsageList: [], // 礼品卡使用记录
      }
    },
    computed: {
      finishedText(){
        let text = '没有更多了'
        if(this.listParams.type === 0 && this.records_0.length === 0) text = ''
        if(this.listParams.type === 1 && this.records_1.length === 0) text = ''
        return text
      }
    },
    watch: {},
    created() {
      this.valueCardCodeCountFun()
      this.valueCardCodeSelectPageFun()
    },
    mounted() {},
    methods: {
      onLoad() {
        this.valueCardCodeSelectPageFun()
      },
      tabChangeFun(name, title) {
        console.log(name, title)
        this.records_0 = []
        this.records_1 = []
        this.finished = false
        this.listParams.pageNum = 1
        pageNum_0 = 1
        pageNum_1 = 1
        this.valueCardCodeSelectPageFun()
      },
      valueCardCodeCountFun:debounce(function(){
        valueCardCodeCount().then((res) => {
          console.log(res, '查询礼卡统计信息')
          if (res.code === 200) {
            this.giftInfo = res.data
          } else {
            this.$toast('查询礼品卡信息失败!')
          }
        })
      },500),
      // 卡列表数据
      valueCardCodeSelectPageFun:debounce(function(params) {
        let that = this;
        console.log(that.listParams,"that.listParams");
        valueCardCodeSelectPage(that.listParams).then((res) => {
          console.log(that.listParams.type,'that.listParams.type');
          if (res.code === 200) {
            total = +res.data.total
            let maxPageNum = Math.ceil(total / 10)
            if (that.listParams.type === 0) {
              //可用卡数据
              if(this.listParams.pageNum >= maxPageNum){
                that.listParams.pageNum = maxPageNum
              }else{
                that.listParams.pageNum = pageNum_0+1
              }
            } else {
              if(this.listParams.pageNum >= maxPageNum){
                that.listParams.pageNum = maxPageNum
              }else{
                that.listParams.pageNum = pageNum_1+1
              }
            }

            res.data.records.forEach((item) => {
              if (that.listParams.type === 0) {
                //可用卡数据
                that.records_0.push(item)
              } else {
                that.records_1.push(item)
              }
            })
            that.loading = false
            // 数据全部加载完毕
            if (res.data.records.length < 10) {
              that.finished = true
              return
            }
          }
        })
      },500),
      // 礼品卡使用记录
      usageRecordFun(valueCardCodeId) {
        this.usageRecord = true
        giftUsageLog(valueCardCodeId).then(res => {
          if(res.code === 200){
            console.log(res,'礼品卡使用记录');
            this.giftUsageList = res.data
          }
        })
      },
      explainFun(item){
        let txt = ''
        if(item.permittedType == 1){
          txt = `仅${item.marketingName}活动商品可用`
        }
        if(item.permittedType == 2){
          txt = `仅${item.storeNames}店铺的商品可用`
        }
        this.explainText = txt
        this.explain = true
      },
      employFun(data){
        if(data.permittedType === 0){
          //全平台
          this.$router.push({path: '/'})
        }
        if(data.permittedType === 1){
          // 指定活动
          this.$router.push({path:'/firstOrder',query:{id:data.permittedMarketingId,cardPrice: data.cardPrice}})
        }
        if(data.permittedType === 2){
          // 指定店铺
          let storeids = data.permittedStoreIds.toString()
          this.$router.push({path:'/spulist',query:{storeids:data.permittedStoreIds,type:'gift',cardPrice: data.cardPrice}})
        }
      },
      back() {
        this.$router.back()
      },
      skipFun(item) {
        if (item.path === '/bindNewGiftCards') {
          this.$router.push({ path: item.path })
        } else {
          this.$router.push({
            path: '/spulist',
            query: {
              queryString: '',
              cateId: this.giftInfo.thirdCateId,
              storeId: '',
            },
          })
        }
      },
      // 复制订单
      copyCamilo(code) {
        console.log('复制卡密code：', code)
        let oInput = document.createElement('input')
        oInput.value = code
        document.body.appendChild(oInput)
        oInput.select() // 选择对象;
        document.execCommand('Copy') // 执行浏览器复制命令
        Toast('复制成功')
        oInput.remove()
      },
      //格式化金额显示,s为金额数字，n为精确小数位,isAry 是否返回数组形式如: 23.88 ==> [23,88] 默认 false
      fmoney(s, n, isAry = false) {
        n = n > 0 && n <= 20 ? n : 2
        s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
        let l = s
            .split('.')[0]
            .split('')
            .reverse(),
          r = s.split('.')[1],
          t = ''
        for (let i = 0; i < l.length; i++) {
          t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
        }
        return isAry
          ? [
              t
                .split('')
                .reverse()
                .join(''),
              r,
            ]
          : t
              .split('')
              .reverse()
              .join('') +
              '.' +
              r
      },
    },
    filters: {
      dateFilter(value) {
        let arr = value.split(" ")[0];
        let str = arr.split('-').join('.')
        return str;
      },
      thumbnailString(value){
        if(value && value.length > 15){
          return value.substring(0,15)+'. . .'
        }
        return value
      }
    },
  }
</script>

<style scoped lang="less">
  .gift_card {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .my_header {
      background-color: #fff;
      .tabs {
        margin-bottom: 0.4rem;
        font-size: 0.56rem !important;
      }
      .gift_card_balance {
        background-color: #fff;
        padding: 0.24rem 0.48rem 0 0.48rem;
        .card {
          color: #fff;
          box-sizing: border-box;
          padding: 1.04rem 0.32rem 0.56rem 0.64rem;
          width: 100%;
          // height: 4.16rem;
          background: linear-gradient(25deg, #ffa504 0%, #ffbc25 100%);
          border-radius: 10px;
          .text {
            display: flex;
            justify-content: space-between;
            .sp_1 {
              font-size: 0.52rem;
            }
            .sp_2 {
              font-size: 0.48rem;
            }
          }
          .num {
            margin-top: 0.4rem;
            line-height: 1rem;
            color: #fff;
          }
        }
      }
    }
    .content {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      flex: 1;
      box-sizing: border-box;
      padding: 0.48rem;
      padding-top: 0;
      .min_card {
        margin-top: 0.48rem;
        overflow: hidden;
        width: 100%;
        border-radius: 0.4rem;
        .up {
          color: #fff;
          background-color: #7689df;
          box-sizing: border-box;
          padding: 0.48rem;
          .txt_1 {
            display: flex;
            justify-content: space-between;
            font-size: 0.6rem;
            .sp {
              font-size: 0.48rem;
              display: flex;
              align-items: center;
            }
          }
          .txt_2 {
            margin-top: 0.4rem;
            display: flex;
            justify-content: space-between;
            span:nth-child(1) {
              font-size: 0.52rem;
            }
            span:nth-child(2) {
              font-size: 0.44rem;
            }
          }
        }
        .down {
          background-color: #fff;
          box-sizing: border-box;
          padding: 0.8rem 0.48rem;
          display: flex;
          .left {
            flex: 0.7;
            p:nth-child(1) {
              font-size: 0.48rem;
              span {
                font-size: 0.72rem;
              }
            }
            p:nth-child(2) {
              display: flex;
              justify-content: center;
              align-items: center;
              margin-top: 0.4rem;
              font-size: 0.48rem;
              color: #999;
            }
          }
          .right {
            flex: 0.3;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            img {
              width: 2.8rem;
              height: 2.8rem;
            }
            .btn {
              height: 1.2rem;
              padding: 0.28rem 0.8rem;
              background-color: #e60113;
              border-radius: 0.6rem;
              font-size: 0.48rem;
              color: #fff;
            }
          }
        }
      }
      .default {
        padding-top: 3.2rem;
        text-align: center;
        font-size: 0.56rem;
        color: #999;
      }
    }
    .my_footer {
      background-color: #fff;
      .tab_bar {
        display: flex;
        padding: 0.2rem 0 0.16rem 0;
        .tab_bar_item {
          font-size: 0.4rem;
          text-align: center;
          flex: 1;
          img {
            width: 0.96rem;
            height: 0.96rem;
          }
        }
      }
    }
    .popup_text {
      width: 12.64rem;
      h3 {
        margin-top: 1.2rem;
        margin-bottom: 0.8rem;
        font-size: 0.64rem;
        color: #333;
        text-align: center;
      }
      .content {
        max-height: 12rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        box-sizing: border-box;
        padding: 0 1.2rem 0 1.2rem;
      }
      .instructions {
        max-height: 12rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        margin-bottom: 1.48rem;
        box-sizing: border-box;
        padding: 0 1.2rem 0 1.2rem;
      }
      .usage_record {
        max-height: 15rem;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        font-size: 0.56rem;
        color: #333;
        margin-bottom: 1.48rem;
        box-sizing: border-box;
        .item {
          padding: 0 0.8rem 0 0.8rem;
          .date {
            font-size: 0.52rem;
            color: #000;
            margin-top: 0.6rem;
          }
          .order {
            margin: 0.48rem 0;
            span:nth-child(1) {
              font-size: 0.52rem;
              color: #666;
            }
            span:nth-child(2) {
              padding: 0.12rem 0.24rem;
              border-radius: 0.44rem;
              display: inline-block;
              font-size: 0.44rem;
              color: #000;
              background-color: #f5f5f5;
            }
          }
          .money {
            padding-bottom: 0.6rem;
          }
        }
      }
      .image {
        margin-top: 30px;
        text-align: center;
        p {
          margin-bottom: 7rem;
        }
      }
      .btn {
        margin: 0 auto;
        margin-top: 2.56rem;
        margin-bottom: 1.6rem;
        width: 6rem;
        text-align: center;
        height: 1.2rem;
        padding: 0.2rem 1.84rem;
        background-color: #e60113;
        border-radius: 0.6rem;
        font-size: 0.48rem;
        color: #fff;
      }
    }
  }
</style>

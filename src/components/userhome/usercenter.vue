<template>
  <div class="user_container" style="height: 100vh">
    <!-- 固定头部 -->
    <div class="user_fixed_header" v-show="fixedHeader">
      <div @click="customerClick">
				<img class="navBar-img" :src="logType[isLogin?1:0]" />
				<span class="navBar-text" >{{ isLogin ?  getUserInfo.userName : '请登录' }}</span>
			</div>
      <!-- 设置 -->
      <img v-if="!isSmatApp" class="navBar-bt"  @click="$router.push('/personalsetting')" :src="`${$oss}/usercenter/ic_set_up2.png`" />
    </div>
    <div class="user_content" :class="[returntop ? 'backtopactive' : '']" ref="backTop" :style="[getStyle]">
      <div class="user-header">
        <!-- 头像 -->
        <div class="user-info-img" @click="customerClick">
          <img :src="logType[isLogin?1:0]" />
        </div>
        <!-- 用户信息 -->
        <div class="user-info-means">
          <!-- 昵称 -->
          <div class="user-info-text" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}" >{{ isLogin ? getUserInfo.userName : '请登录' }}</div>
          <div class="user-info-act" v-if="isLogin">
            <!-- 收藏 足迹 订阅 -->
            <div class="user-info-record">
              <div class="user-info-record-item" v-for="(item,index) in recordList" :key="index" @click="item.path?$router.push(item.path):toStore(2)">
                <p class="name" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}">{{ item.name }}</p>
                <p class="count" :style="{'color':`${disposeList.colorStyle==1?'#fff':''}`}" >{{ setCount(userRecordCount[item.valName] , 999) || 0 }}</p>
                <p class="line"  v-if="item.funName!='UserFollowStore'" :style="{'background-color':`${disposeList.colorStyle==1?'#fff':''}`}"></p>
              </div>
            </div>
          </div>
          <!-- 点击登录 -->
          <div class="user-info-no-login" v-else>
            <van-button @click.stop="customerClick" :icon="`${$oss}/usercenter/ic_user.png`" :style="{'background':`${disposeList.colorStyle==1?'#fff':''}`}">
              点击登录
            </van-button>
          </div>
        </div>
        <!-- 设置 -->
        <img v-if="!isSmatApp" class="user-info-bt"  @click="$router.push('/personalsetting')" :src="`${$oss}/usercenter/ic_set_up${disposeList.colorStyle || 2}.png`" />
      </div>
      <div class="user_body">
        <!-- 分销订单 推广订单 -->
        <div v-if="showDistributionMsg && !isSmatApp" class="my-distribution-card" >
          <div>
            <p>已结算佣金(元)</p>
            <p class="moeny-box">{{allIncomeCommission | getPriceInt}}{{allIncomeCommission | getPricePrecision}}</p>
          </div>
          <!-- 分割线 -->
          <div class="dis-line"></div>
          <div>
            <p>待结算佣金(元)</p>
            <p class="moeny-box">{{toBeSettledCommission | getPriceInt}}{{toBeSettledCommission | getPricePrecision}}</p>
          </div>
          <!-- 右分割线 -->
          <div class="line" >
            <img :src="`${$oss}/usercenter/ic_distribution_right.png`" />
          </div>
          <div class="right-btn" @click="toMyDistributionOrder" >
            <img class="recommod-icon" :src="`${$oss}/usercenter/ic_popularize_order.png`" alt="" />
            <span>推广订单</span>
            <img class="recommon-go" :src="`${$oss}/usercenter/ic_go.png`" alt="" />
          </div>
        </div>

        <!-- 分销订单 推广小店 -->
        <div v-if="mySotreList.length > 0" class="my-store">
          <div class="left">
						<p class="name">推广小店</p>
						<div class="entry" @click.stop="toStore">
							<img :src="`${$oss}/usercenter/ic_me_shop.png`" />
							<span class="store">我的小店</span>
						</div>
					</div>
					<div class="right">
						<img :src="`${$oss}/usercenter/ic_shop.png`" />
					</div>
        </div>

        <!-- 我的订单模块 -->
        <div class="user_modules user_modules_order ">
          <!-- 订单相关模块 -->
          <div class="user-modules-order-grid">
						<div
							class="user-modules-order-grid-items"
							v-for="(item,idx) in modulesOrderGridList"
							:key="idx"
							@click="toPath(item)"
						>
						 		<!-- 区分线 -->
								<img
										v-if="item.sceneName=='AllOrderList'"
										class="user-modules-order-grid-items-rightImg"
										style="height: 100%;width: 100%;"
										:src="item.rightImg"
										alt=""
									/>
								<div>
									<div class="user-modules-order-grid-items-icon">
										<img
											class="user-modules-order-grid-items-icon-img"
											style="height: 100%;width: 100%;"
											:src="item.img"
											alt=""
										/>
										<!-- Todo : 修改边框样式 -->
										 <badge
                        v-if="orderMessageCount[item.MessageCountName] && orderMessageCount[item.MessageCountName] > 0"
                        :text="setCount(orderMessageCount[item.MessageCountName], 99)"
                        :class="[
                          orderMessageCount[item.MessageCountName] < 10 ? 'badge1' : orderMessageCount[item.MessageCountName] < 100 ? 'badge2' : 'badge3',
                          'badge',
                        ]"
                      ></badge>
									</div>
								  <div class="user-modules-order-grid-items-text">{{ item.text }}</div>
								</div>
						</div>
					</div>
          <!-- 付款 收货 轮播 -->
          <van-swipe v-if="payAndReceiveList && payAndReceiveList.length!=0" class="user_modules_order_swipe" :autoplay="3000" indicator-color="white" ref="swiper" >
            <van-swipe-item v-for="item in payAndReceiveList" :key="item.id">
              <template class="swiper-box">
                <!-- 待付款 -->
                <div class="flex transport-pay" @click="goTo(item,1)" v-if="item.status==1">
                  <div class="transport-pay-left">
                    <img :src="item.skuImage" />
                    <div class="transport-pay-left-middle">
                      <span class="transport-pay-left-middle-status">{{item.action || ''}}</span>
                      <div class="transport-pay-left-middle-time">
                        <span> 剩余时间</span>
                        <span>
                          <van-count-down :time="item.time"  @finish="finish" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <!-- <div class="transport-pay-right" @click.stop.prevent="goTo(item,2)"> -->
				  <div class="transport-pay-right" @click.stop.prevent="goPay(item)">
                    去支付
                  </div>
                </div>
                <!-- 已发货 已揽收 运输中 派件中 正常签收 -->
                <div class="flex transportStatus" @click="goTo(item,3)" v-show="item.status==3">
                  <img :src="item.skuImage" />
                  <div class="text">
                    <p class="name flex"><span>{{item.action || ''}}</span><span class="date">{{item.acceptDate ? getTransportTime(item.acceptDate ):''  }}</span></p>
                    <p class="time">{{item.acceptStation ||''}}</p>
                  </div>
                </div>
              </template>
            </van-swipe-item>
          </van-swipe>
        </div>

        <!-- 我的权益 -->
        <div class="user_modules user-modules-slot">
          <div class="user-modules-slot-header">我的权益</div>
					<div class="user-modules-slot-container">
            <div :class="['user-modules-slot-items',`items${index+1}`]" v-for="(item, index) in modulesSlotList" :key="index" @click="toPath(item)">
              <div>
                <p class="user-modules-slot-items-data">{{item.count}}</p>
                <p class="user-modules-slot-items-name">
                  {{item.name}}
                  <img class="user-modules-slot-items-name-img" :src="`${$oss}/usercenter/ic_next.png`" />
                </p>
              </div>
              <div style="display: flex;align-items: center;">
                <img :src="item.icon" class="user-modules-slot-items-img" />
                <span v-if="index==0 && modulesSlotList.length > 1" class="user-modules-slot-items-line"></span>
              </div>
            </div>
					</div>
        </div>

        <!-- 商品轮播 -->
        <swipe class="user-modules-swipe" v-if="disposeList.contentList" :config="disposeList.contentList[0]"></swipe>

        <!-- <div class="membership" @click="toMembership" v-if="isLogin">
					 <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/main-packages/usercenter/banner.png" class="img" alt="">
				</div> -->

        
      </div>
      <!-- 热销商品 -->
      <shopList class="user-modules-shopList" :title="'热销商品'"></shopList>
    </div>

    <foot title='我的' />
    <SecondConfirm title="用户注册协议" cancleText="先浏览看看" sureText="同意" :dialogshow="registrationProtocolIsShow"
      @closeBack="$store.commit('SET_REGISTRATIONPROTOCOL', false)" @rightEvent="hasPayPasswordDialogFun">
      <div slot="textp">
        <div class="registration-protocol">
          <div v-html="protocol"></div>
        </div>
      </div>
    </SecondConfirm>

	<orderSecondConfirm ref="orderSecondConfirm"></orderSecondConfirm>
    <!-- 回到顶部  -->
    <returnTop v-if="isshowtop" @click.native="backtop" />
  </div>
</template>

<script>

//公共组件
import swipe from '@/components/index/template/swipe'
import foot from '@/components/commons/foot'
import SecondConfirm from '@/components/commons/SecondConfirm'
import orderSecondConfirm from '@/components/order/components/orderSecondConfirm'
import { Badge } from 'vux'
import { CountDown, Toast } from 'vant'
// 内部组件
import shopList from '../commons/shopList'
import returnTop  from './commons/returnTop.vue'
// 公共方法
import { getTransportTime} from './userhome'
import { getBatchSkuPrice, getUsersource } from '@/utils/utils'
import { getToken } from '@/utils/token'
import userRegistrationProtocol from '@/mixins/userRegistrationProtocol.js'
// 接口
import { visit } from '@/api/visit'
import { queryUserCommission } from '@/api/activities/distributionActivity'
import { getMySotre } from '@/api/storeindex'
import { queryUserCouponList } from '@/api/mycoupon'
import { getCustomerStatistics, queryOrderMessageCount, queryUnReadMessagecount, recommend , isDistributionCheck,queryOrderRotographList,queryPersonConfigTemp} from '@/api/home'
export default {
  mixins: [userRegistrationProtocol],
  components: {
    returnTop,
    shopList,
    foot,
    Badge,
    SecondConfirm,
    swipe,
    [CountDown.name]: CountDown,
	orderSecondConfirm
  },
  computed: {
    //是否是智慧生活APP
    isSmatApp(){
      let usersource = getUsersource()
      return usersource == 11
    },
    registrationProtocolIsShow() {
      return this.$store.getters.getRegistrationProtocol
    },
    // 获取后台配置样式
    getStyle(){
      //浅色模式是深色背景
      let bgImage=this.disposeList.bgImage||''
      if(!bgImage){
        if(this.disposeList.colorStyle==1){
         bgImage="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/shense.png"
        }else{
         bgImage="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/qianse.png"
        }
      }

      return {
				paddingTop: `${this.safePaddingHeight}px`,
        backgroundImage:bgImage? `url(${bgImage})` : '',
      }
		},
    getUserInfo() {
      // this.modulesSlotList.forEach(item=>{
      //     if(item.key=='blessing') {
      //       item.count = this.$store.getters.userInfo.fqzPoint
      //     }
      //   })
      return this.$store.getters.userInfo
    },
  },
  data() {
    return {
      getTransportTime,
      isLogin: getToken() ? getToken() : false, // 判断是否登录
      // isLogin: window.isLogin,
      hadMsg: 0, //是否有新消息
      spuData: [], //猜你喜欢
      customerName: '', // 用户名称
      customerImage: '', // 用户头像
      orderMessageCount: {}, // 订单统计实体
      userRecordCount: {}, // 用户 收藏及浏览历史数量
     	modulesOrderGridList: [
				{
					text: '待付款',
          path: '/orderlist',
					sceneName: 'OrderList',
					status: '1',
					MessageCountName: 'toPayCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_evaluate.png'
				},
				{
					text: '待收货',
          path: '/orderlist',
					sceneName: 'OrderList',
					status: '2',
					MessageCountName: 'toReceiptAndDeliverCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_receipt.png'
				},
				{
					text: '待评价',
          path: '/orderlist',
					sceneName: 'EvaluationCenter',
					status: '5',
					MessageCountName: 'toEvaluateCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_evaluate.png'
				},
				{
					text: '退货/换货',
          path: '/backorderlist',
					sceneName: 'BackOrderList',
					status: '999',
					MessageCountName: 'backOrderCount',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_back_order.png'
				},
					{
					text: '更多订单',
          path: '/orderlist',
					sceneName: 'AllOrderList',
					status: '-1',
					img:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_all_order.png',
					rightImg:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_right.png'
				},
			], // 订单模块组件按钮集
      modulesSlotList: [
        // {
        //   icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_good_fortune.png',
        //   name: '积分',
        //   path: '/blessing',
        //   key: 'blessing',
        //   count: 0,
        //   sceneName: 'GoodFortuneValue',
        // },
        {
          icon: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_new_oupon.png',
          name: '优惠券',
          path: '/copunList',
          key: 'coupon',
          count: 0,
          sceneName: 'GoodFortuneValue',
        },
        // {
        //   icon: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/null/841e943778b047713d936caaf3751dd4.png',
        //   name: '礼品卡',
        //   path: '/giftcard',
        //   key: 'giftcard',
        //   count: 0
        // }
      ], // 插槽拓展功能按钮集
      fixedHeader: false, // 固定头部
      isshowtop: false, // 回到顶部
      returntop: false, // 返回顶部
      miniAppletUserName: process.env.POP_APPLET_ID, // 小程序原始Id
      allIncomeCommission: 0,
      toBeSettledCommission: 0,
      showDistributionMsg: false,
      mySotreList: [],
      payAndReceiveList:[],
      disposeList:{
				bgImage:'',
				bgColor:'',
				colorStyle:2,// colorStyle 1:浅色  2: 深色
				contentList:''
			},//轮播
      timeNum:0,
      recordList:[
				{
					name: '收藏',
					funName: 'UserCollection',
					valName: 'collectGoodsCount',
          path:'/mycollectsku'
				},
				{
					name: '足迹',
					funName: 'UserBrowser',
					valName: 'viewGoodsCount',
          path:'/mybrowserecord'
				},
				{
					name: '订阅',
					funName: 'UserFollowStore',
					valName: 'collectStoreCount'
				},
			],
      logType:{ //登录头像 0：未登录 1：已登录
				0:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_no_log.png',
				1:'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_avatar.png'
			}
    }
  },
  created: function () {
    let data = {
      route: this.$route.path,
      routeName: '个人中心',
      userId: this.$store.getters.userId,
    }
    visit(data)
    document.getElementsByTagName('body')[0].className = 'gray-bg'
    this.queryLoginStatus()
  },
  filters: {
    price(value) {
      return getBatchSkuPrice(value)
    },
    getPriceInt(val){
      return Math.floor(val)
    },
    getPricePrecision(val) {
      const num = Number(val).toFixed(2)
      return num.substring(num.length-3, num.length)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollTop, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scorllTop)
  },
  watch: {
    isshowtop(value) {
      if (!value) this.returntop = false
    },
    getUserInfo(val) {
      this.modulesSlotList.forEach(item=>{
          if(item.key=='blessing') {
            item.count = (val.fqzPoint / 100).toFixed(2)
          }
        })
    }
  },
  methods: {
    // 总量显示规则
	setCount(val,max){
		if(!val||isNaN(val*1)) return 0
		return val*1 > max ? max + '+': val
	},
	goPay(item){
		item.id = item.orderIds[0]
		this.$refs.orderSecondConfirm.orderOperation(item, '去支付')
	},
  commonPay(sendMoney, orderNo, appData, orderType){
    let payParams = {
      "configRequestParams": {
        uid: appData.userId, // 用户id
        businessType: 100, // 业务类型:100.电商业务 200.充值业务 300.换电业务 400.票务业务 500.酒店业务"
        amount: sendMoney* 100, // 待支付金额
        platform: 1 // 客户端 1.APP 2.微信小程序 3.H5
      },  // 拉取收银台参数
      "payRequestParams": {
        orderNo, // 智慧生活业务订单号
        userId: appData.userId, // 用户ID
        businessType: 100, // 业务类型
        paySceneType: orderType*1 === 14 ? 102 : 101 //102集采 101电商
      }, // 收银台支付接口参数
      "showInfo": {
        amount: sendMoney* 100, // 展示金额
        businessTypeName: "电商优选", // 业务线名称
        expirationTimeStr: "" // 如果需要显示支付倒计时就传
      }
    }
    if (window.ws) {
      window.ws.appCashierPay(
        JSON.stringify(payParams)
      )
      window.appCashierPayResult  = (res) => {
        res = JSON.parse(res)
        if(res.payStatus == 'PAID'){
          sessionStorage.removeItem('wxzf_payResult')
          this.$router.push({
            path: '/paysuccess',
            query: { payResult: res },
          })
        } else {
          Toast(res.msg)
        }
      }
    } else if (window.webkit) {
      window.webkit.messageHandlers.appCashierPay.postMessage(payParams)
      window.appCashierPayResult = (res) => {
        if(res.payStatus == 'PAID'){
          sessionStorage.removeItem('wxzf_payResult')
          this.$router.push({
            path: '/paysuccess',
            query: { payResult: res },
          })
        } else {
          Toast(res.msg)
        }
      }
    } else {
      Toast('当前版本app不支持收银台支付，请升级app后重试')
    }
  },
    //轮播跳转
    goTo(val, tag) {
      let path=''
      let query={}
      switch (tag) {
        //付款卡片
        case 1:
			query= { orderId: val.orderIds[0], backStatus: val.backStatus, orderType: val.orderType }
			if (val.orderType && val.orderType == 12) {
				path = '/motorCar/orderDetail'
			} else {
				path = '/orderdetail'
			}
		break
        //付款按钮
        case 2:
          path='/pay'
          query= {
            id: val.orderIds[0],
            money: val.price,
            orderCode: val.masterOrderCode,
            type: 1,
            orderType:val.orderType,
			fromSource: true
          }
          break
        //已发货 已揽收 运输中 派件中 正常签收
        case 3:
          path='/tracesOrder'
          query= {
            id: val.orderId,
            type: 0,
          }
          break
        default:
          break
      }
      if(path=='/pay'){
        let appData = JSON.parse(localStorage.getItem('appData'))
        if(appData && appData.appScheme == 'wsf') {
          this.commonPay(val.price, val.masterOrderCode, appData, val.orderType)
        } else {
          this.$router.push({
            path: '/zhPay',
            query: { ...query, serviceType: 100 },
          })
          // this.$router.push({ path , query })
        }
      } else {
        this.$router.push({ path , query })
      }
    },
    //倒计时结束
    finish(){
      this.getPayAndReceive()
    },
    // 获取待付款和待收货轮播信息
    getPayAndReceive(){
      queryOrderRotographList({ templateCode: 103 }).then((res) => {
        if(res.code==200){
          	this.payAndReceiveList = res.data
			// this.payAndReceiveList=[
			// 	{
			// 		time: 1681001540000,
			// 		status: 1, // 状态1 待付款
			// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
			// 		action: '待付款',
			// 		acceptDate: '2022-03-04',
			// 		acceptStation: '【深圳转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
			// 	},
			// 	{
			// 		time: 1681001300000,
			// 		status: 1, // 状态1 待付款
			// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
			// 		action: '待付款2',
			// 		acceptDate: '2022-03-04',
			// 		acceptStation: '【武汉转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
			// 	},
			// 	{
			// 		status: 3, // 状态3 等待收货
			// 		skuImage: 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/order/history_no.png',
			// 		action: '等待收货',
			// 		acceptDate: '2022-03-04',
			// 		acceptStation: '【深圳转运中心】已发出，下一站【深圳宝安机场的点点滴滴多多多多多多多多多多多多多多多多多啊】'
			// 	}
			// ]
			let newArray = []
			this.payAndReceiveList.forEach(item=>{
				if(item.createTime){
					item.createTime = item.createTime.replace(/(\-)/g,'/')
					item.time = new Date(new Date(item.createTime).getTime() + 30*60*1000).getTime() - new Date().getTime()
				}
				if(item.time>0 || item.status==3) {
					newArray.push(item)
				}
			})
			this.payAndReceiveList = newArray
        }
      })
    },
    // 查询个人中心配置
		queryPersonConfigTemp(){
			queryPersonConfigTemp(103).then(res=>{
				if(res.code==200){
          this.disposeList=JSON.parse(res.data.content)
        }
			})
		},
    //查询可用优惠券数量
    getUsableCount() {
      queryUserCouponList({ pageNo: 0, pageSize: 1}).then((res) => {
        if (res.code == 200) {
          this.modulesSlotList.forEach(item=>{
            if(item.key=='coupon') {
              item.count = res.data.rows
            }
          })
        }
      })
    },
    // 查询登陆状态
    queryLoginStatus() {
      if (this.isLogin) {
        this.customerDetail()
        this.queryOrderMessageCount()
        this.getCustomerStatistics()
        this.contMsg()
        // this.isDistribution() // 关闭个人中心推广订单  2023.8.25   智慧生活二期
        this.getUsableCount()
        this.getMystore()
        //个人中心待付款和待收货轮播信
        this.getPayAndReceive()
        // this.getUsableCount()
      }
      //查询个人中心配置
      this.queryPersonConfigTemp()
    },
    // 查询用户基本信息
    async customerDetail() {
      await this.$store.dispatch('user/getUserInfo')
    },
    // 查询订单统计
    queryOrderMessageCount() {
      let that = this
      queryOrderMessageCount().then((res) => {
        that.orderMessageCount = res || {}
      })
    },
    // 查询用户 店铺收藏 商品收藏 浏览记录
    getCustomerStatistics() {
      getCustomerStatistics().then((res) => {
        if (res.code == 200) {
          this.userRecordCount = res.data
        }
      })
    },
    queryLike(types) {
      recommend(types).then((res) => {
        if (res.datas && res.datas.length > 0) {
          this.spuData = res.datas
        }
      })
    },
    contMsg() {
      queryUnReadMessagecount().then((res) => {
        if (res.code == 200) {
          let num = 0
          res.data.filter((ele) => {
            if (ele.receiverType == 2) {
              num += ele.count
            }
          })
          this.hadMsg = num
          // this.hadMsg = temp
        }
      })
    },
    //跳转单品详情
    toSpuDetail(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId, storeId: item.storeId, sourceType: item.sourceType || 1 } })
    },
    // 跳转到消息页面
    toMyNews() {
      // fromFlag 跳转标记，1 从首页跳转 2 从个人中心跳转
      this.$router.push({ path: '/mynews', query: { fromFlag: '2' } })
    },
    customerClick() {
      // 判断是否登陆过 如果登陆过则进入账户信息 没有登陆则进入登陆页面
      if (!this.isLogin) {
        this.$router.push({ path: '/login?url=/home' })
      }
    },
    // 跳转到个人信息页面
    toPersonalInfo() {
      this.$router.push({ path: '/personalinfo' })
    },
    // 跳转到个人信息页面
    toPersonalSetting() {
      this.$router.push({ path: '/personalsetting' })
    },
    toMyDistributionOrder(){
      this.$router.push({ path: '/distributionOrder' })
    },
    // 跳转页面
    toPath(item) {
      if (item.status && item.status != '6') {
        this.$router.push({ path: item.path, query: { status: item.status } })
      } else if (item.status == '6') {
        this.$router.push({ path: item.path, query: { status: item.status } })
        // this.$router.push({ path: '/evaluate' })
      } else {
        if(item.key == 'blessing') {
          this.$router.push({ path: item.path,query: {fromH5: true} })
        } else {
          if (item.icon) this.$router.push({ path: item.path })
        }
      }
    },
    getQueryUserCommission() {
      queryUserCommission().then(res=>{
        this.allIncomeCommission = res.data.allIncomeCommission / 100 || 0
        this.toBeSettledCommission = res.data.toBeSettledCommission / 100 || 0
      }).catch(err=>{
        console.log(err)
      })
    },
    async isDistribution() {
        if (!this.$store.getters.userId) {
          await this.$store.dispatch('user/getUserInfo')
        }
        let params = {
          userId: this.$store.getters.userId,
          userPhone: this.$store.getters.userInfo.mobile,
        }
        try {
          let res = await isDistributionCheck(params)

          if (res.data.code == 1) {
            let isDistribution = res.data.isDistribution
            if (isDistribution == 1) {
              //是分销-推广员
              let data = {
                customerId: res.data.customerId || '', //关联商城用户ID
                mobile: res.data.mobile || '', //电话号码
                promoteId: res.data.promoteId || '', //关联推广员ID
                promoteType: res.data.promoteType || '', //推广员类型（1-推广员 2-车主）
                id: res.data.id || '', //分销员ID
              }
              this.showDistributionMsg = true
              this.getQueryUserCommission()
              this.$store.dispatch('setDistrInfo', data)
            }
            //页面跳转 1 是推销员  0 不是推销员
          } else {
            //-1 接口有误
          }
        } catch (error) {
          //-1 接口有误
        }
      },
    // 监听滚动事件获取高度
    scrollTop() {
      if (!this.$refs.backTop) return
      let scorllTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || this.$refs.backTop.getBoundingClientRect().top
      scorllTop = Math.abs(scorllTop) // 取绝对值

      if (scorllTop >= 2500) {
        this.isshowtop = true
      } else {
        this.isshowtop = false
      }

      if (scorllTop >= 30 && !this.fixedHeader) {
        this.fixedHeader = true
      } else if (scorllTop < 30 && this.fixedHeader) {
        this.fixedHeader = false
      } else {
        return
      }
    },
    // 回到顶部
    backtop() {
      if (this.isshowtop) this.returntop = true
      else this.returntop = false
    },
    toStore(type) {
      if(type === 2) {
        this.$router.push({name: 'myStore', query: {type: 2}})
      }else {
        if(this.mySotreList.length > 1) {
          this.$router.push({name: 'myStore', query: {type: 1}})
        } else {
          this.$router.push({
            path: '/storeindex',
            query: {
              type: 1,
              storeId: this.mySotreList[0].idNumber,
              isBack: 1
            }
          })
        }
      }

    },
    // 查询我的小店
    getMystore() {
      if(getToken()) {
        getMySotre().then(res => {
          if(res.code == 200) {
            let data = res.data
            this.mySotreList = data || []
          }
        })
      }
    },
    toMembership(){
      const result = window.location.origin.match(/https:\/\/m([-0-9a-zA-Z*]*).wsfmall.com/i);
      location.href = `https://passenger-h5${result?result[1]:''}.wsecar.com/wisdom-live/autonym?buyType=3`
    }
  },
}
</script>

<style scoped lang="less">

.user_container {
  overflow: auto;
	z-index: 1;
  background-color: #F6F6F6;
  .user_content{
    background-size: 100%  auto;
    background-repeat:no-repeat;
  }
}
/* 模块栏 */
.user_body {
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  box-sizing: border-box;
  padding: 2px 12px 0px;
  position: relative;
  // z-index: 5;
  z-index: 1;
  .user_modules {
    background-color: #fff;
    border-radius: 10px;
    padding: 12px 12px 10px 12px;
    margin-bottom: 10px;
  }
}
/* 固定头部 */
.user_fixed_header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  display: flex;
	align-items: center;
  justify-content:space-between;
  height: 44px;
  line-height: 44px;
  background-color: #fff;
  z-index: 100;
	padding:0 20px 0 12px;
  div{
    display: flex;
    align-items: center;
    .navBar-img{
      width: 32px;
      height: 32px;
    }
    .navBar-text{
      padding-left: 8px;
      font-size: 15px;
      font-weight: 500;
      color: #191919
    }
  }
	.navBar-bt{
		width: 20px;
		height: 20px;
	}
}
/* 头部 */
.user-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-right: 100px;
  padding: 20px 17px 0 12px;
  font-size: 12px;
  // 头像
  .user-info-img,
  .user-info-img img {
    height: 46px !important;
    width: 46px !important;
  }
  // 用户信息
  .user-info-means {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height:46px;
    margin-left: 7px;
    // 昵称
    .user-info-text {
      font-size:16px;
      font-weight: 500;
      color: #000;
    }
    .user-info-act {
      display: flex;
      justify-content: space-between;
      // 收藏 足迹 订阅
      .user-info-record {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        align-content: space-between;
        color: #6e6e6e;
        .user-info-record-item {
          display: flex;
          align-items: center;
          height: 15px;
          line-height: 15px;
          font-size: 11px;
          box-sizing: content-box;
          .count {
            padding-left: 4px;
            font-size: 13px;
            color: #191919;
            font-family: Arial-BoldMT, Arial;
          }
          .line {
            margin: 0 10px;
            width: 1px;
            height: 10px;
            background: #6e6e6e;
          }
        }
      }
    }
    // 未登录
    .user-info-no-login{
      .van-button{
        height: 19px;
        background: #ebe5e1;
        border:none;
        border-radius: 9px;
        padding: 3px 4px;
          img{
            width: 12px;
            height: 13px;
          }
          span{
            line-height: 19px;
            font-size: 11px;
            color: #191919;
          }
      }

    }
  }
  // 设置
  .user-info-bt {
    width: 20px;
    height: 20px;
  }
}

/* 推广订单 */
.my-distribution-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  border-radius: 10px;
  background: #fff;
  padding: 6px 12px;
  margin-top: 10px;
  font-size: 11px;
  color: #fff;
  background: linear-gradient(90deg, #FFA26C 0%, #FF2C51 66%, #FF1578 100%);
  .moeny-box {
    font-size: 13px;
    font-weight: bold;
    font-family: Arial-BoldMT, Arial;
    >span {
      font-size: 12px;
      font-weight: normal;
      &:last-child {
        font-weight: bold;
      }
    }
  }
  .line , .line img{
    width: 5px;
    height: 44px;
  }
  .dis-line{
    width:1px;
		height: 16px;
		margin: 0 12px;
		background: #FFFFFF;
  }
  .right-btn {
    display: flex;
    align-items: center;
    .recommod-icon {
      width: 18px;
      height: 18px;
    }
    span{
      padding-left: 4px;
    }
    .recommon-go {
      width: 7px;
      height: 7px;
    }
  }
}
// 角标
.badge{
    position: absolute;
    top: -25%;
    right: -25%;
		height: 14px;
    width: auto;
		padding: 0 5px;
		line-height: 13px;
		font-size:11px !important;
}
.badge1{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge1.png');
    background-size: 100% 100%;
}
.badge2{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge2.png');
    background-size: 100% 100%;
}
.badge3{
    background:url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/usercenter/ic_badge3.png');
    background-size: 100% 100%;
}
/* 推广小店 */
.my-store{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 5px 16px 4px 8px;
  width: 100%;
  height: 79px;
  background: #FFFFFF;
  border-radius:12px;
  .left{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 70px;
    font-size: 13px;
    color: #191919;
    .name{
      font-size: 15px;
      font-weight: bold;
      padding: 5px 0 0 4px;
    }
    .entry{
      display: flex;
      align-items: center;
      height: 32px;
      background: linear-gradient(98deg, rgba(255,15,52,0.07), #FFFFFF 100%);
      border-radius: 10px;
      margin-bottom: 4px;
      img{
        margin-left: 8px;
        width: 22px;
        height: 22px;
      }
      .store{
        padding-left:8px;
        font-size: 13rpx;
      }
    }
  }
  .right,.right img{
    width: 86px;
    height: 70px;
  }
}
/* 更多订单 */
.user_modules_order{
  margin: 10px 0 0 !important;
  padding:0 8px !important;
  overflow: hidden;
  /* 我的订单模块 */
  .user-modules-order-grid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-modules-order-grid-items {
      display: flex;
      width: 60px;
      height: 69px;
      text-align: center;
    }
    .user-modules-order-grid-items-icon {
    width: 26px;
    height: 26px;
    margin: 12px auto 8px;
    position: relative;
    .user-modules-order-grid-items-icon-img {
    height: 100%;
    width: 100%;
  }
  }
  .user-modules-order-grid-items-rightImg{
    height: 100%;
    width: 10px !important;
  }
  .user-modules-order-grid-items-text {
    font-size: 12px;
    line-height: 13px;
    color: #444;
  }
  }
  /* 付款 收货 轮播 */
  .user_modules_order_swipe{
    margin-bottom: 8px;
    width: 335px;
    background: #FAFAFA;
    border-radius: 8px;
    .flex{
      display:flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    /deep/ .van-swipe-item{
      .swiper-box{
        padding: 4px 4px 6px 4px;
      }
      img{
        width: 44px;
        height: 44px;
        border-radius: 12px;
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 44px;
        flex:1;
        overflow: hidden;
        margin-left: 4px;
        .name{
          font-size: 15px;
          font-weight: 500;
          color: #191919;
        }
        .time{
          font-size: 11px;
          color: #6E6E6E;
          white-space: nowrap; // 强制一行
          overflow: hidden; // 溢出隐藏
          text-overflow: ellipsis; // 文字溢出显示省略号
          span{
            display: inline-block;
            margin-left: 4px;
            .van-count-down{
              font-size: 13px !important;
              color: #FF0A35 !important;
              font-weight: bold;
            }
          }
        }
      }
      .btn{
        width: 80px;
        height: 30px;
        line-height: 30px;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 8px;
        font-size: 16px;
        color: #FFF9E9;
        text-align: center;
      }
    }
    /deep/ .van-swipe__indicators{
      display: none;
    }

    .transportStatus{
      height: 100%;
      .date{
          margin-right: 8px;
          font-size: 11px;
          font-weight: 400 !important;
          color: #999999;
      }
    }
    .transport-pay{
      height: 100%;
      &-left{
       display: flex;
       &-middle{
        display: flex;
        flex-direction: column;
        padding: 4px;
        &-status{
          font-size: 15px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #191919;
        }
        &-time{
          display: flex;
          >span:first-of-type{
            font-size: 11px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #6E6E6E;
            margin-right: 4px;
          }
          /deep/.van-count-down{
            font-size: 13px;
            font-family: Arial-BoldMT, Arial;
            font-weight: normal;
            color: #FF0A35;
          }
        }
       }
      }
      &-right{
        width: 80px;
        margin-right: 8px;
        text-align: center;
        height: 30px;
        background: linear-gradient(90deg, #FF5F2E 0%, #FF0A35 100%);
        border-radius: 15px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFF9E9;
        line-height: 30px;
      }
    }
  }
}
/* 我的权益 */
.user-modules-slot {
  padding: 10px 12px 14px !important;
  margin: 10px 0 0 !important;
  .user-modules-slot-header {
    line-height: 20px;
    font-size: 15px;
    font-weight: 500;
    color: #000000;
  }
  .user-modules-slot-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 8px 0px !important;
    .items2{
      padding-left: 18px;
    }
    .user-modules-slot-items {
      width: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      .user-modules-slot-items-data {
        font-size: 20px;
        font-weight: 500;
        color: #000;
        line-height: 18px;
        padding-bottom: 6px;
        font-family: Arial-BoldMT, Arial;
      }
      .user-modules-slot-items-name {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: #6e6e6e;
        .user-modules-slot-items-name-img {
          display: block;
          margin-left: 2px;
          width: 12px;
          height: 13px;
        }
      }
      .user-modules-slot-items-img {
        width: 44px;
        height: 44px;
      }
      .user-modules-slot-items-line{
        margin-left: 16px;
        width: 1px;
        height: 32px;
        background: #C3C3C3;
      }
    }
  }
}
/* 商品轮播 */
.user-modules-swipe{
  margin: 10px 0 0 !important;
  height: 60px !important;
  /deep/ .van-swipe__indicators{
    display: none;
  }
}
/* 热销商品 */
.user-modules-shopList{
  margin-top: 30px;
  padding: 0px 12px 60px;
}
.backtopactive {
  position: fixed;
  top: 0;
}
</style>

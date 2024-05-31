<template>
  <div class="page-container">
    <header class="fixed-header" v-if="isAppEnter">
      <div class="back" @click="$router.go(-1)"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">{{ $route.meta.title }}</div>
      <div class="more"></div>
    </header>
    <div class="main-container">
      <div class="top">
        <div class="head-portrait">
          <div class="head-picture">
            <!-- 头像上的冠军图标 -->
            <img class="crown-icon" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-crown.png" />
            <!-- 头像 -->
            <div class="picture-box">
              <img class="picture" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-doll-header.png" />
            </div>

            <!-- 头像下的优惠券 -->
            <p class="coupons-count">{{ numberOne.couponNum ? numberOne.couponNum : 0 }}张优惠券</p>
          </div>
          <div class="name">
            <span class="singleLine">{{ numberOne.userName }}</span>
            占领了封面
          </div>
        </div>
        <p class="explain">*只展示排名前20用户</p>
        <div class="my-info">
          <div class="my-head-box">
            <img class="my-head" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-doll-header.png" />
          </div>

          <div>
            <p class="my-name singleLine">{{ myRanking.userName }}</p>
            <p class="my-noun">我的排名：{{ myRanking.currentRanking ? myRanking.currentRanking : '无' }}</p>
          </div>
          <!-- 我的卡券 -->
          <div class="my-coupon" v-if="myRanking.currentRanking">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-icon.png" />
            <p class="count">{{ myRanking.couponNum }}张</p>
          </div>
          <!-- 我的点赞 -->
          <div class="my-thumb" v-if="myRanking.currentRanking">
            <img
              @click="thumbsUp()"
              :class="myRanking.isThumb ? 'thumb-move' : ''"
              :src="
                myRanking.beCurrentUserLiked === 0
                  ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-thumb-white-icon.png'
                  : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-thumb-yellow-icon.png'
              "
            />
            <p class="count" :style="{ color: myRanking.beCurrentUserLiked ? '#FFE178' : '#FFFFFF' }">{{ myRanking.likeNum }}</p>
          </div>
          <div v-if="!myRanking.currentRanking" class="goBack" @click="goBack()">
            返回首页玩游戏
          </div>
        </div>
      </div>
      <div class="ranking">
        <div class="raking-item" v-for="(item, index) in rankingList" :key="index">
          <div class="left">
            <div class="rank">
              <img v-if="index < 3" :src="geTrankIcon(index)" />
              <p v-else>{{ item.currentRanking }}</p>
            </div>
            <div class="head-box">
              <img class="head-pic" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-doll-header.png" />
            </div>

            <p class="name singleLine">{{ item.userName }}</p>
          </div>
          <div class="right">
            <div class="coupon">
              <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-icon.png" />
              <p class="count">{{ item.couponNum }}张</p>
            </div>
            <div class="thumb">
              <img
                :src="
                  item.beCurrentUserLiked === 0
                    ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-thumb-white-icon.png'
                    : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-thumb-yellow-icon.png'
                "
                @click="thumbsUp(item)"
                :class="item.isThumb ? 'thumb-move' : ''"
              />
              <p class="count" :style="{ color: item.beCurrentUserLiked ? '#FFE178' : '#FFFFFF' }">{{ item.likeNum }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { rankedList, giveALike, cancelLike } from '@/api/activities/games.js'
  import { deepClone } from '@/utils/utils'
  export default {
    name: 'ranking',
    data() {
      return {
        myRanking: {}, //当前用户
        numberOne: {}, //榜一用户
        rankingList: [],
        isWeChat: false, //是否从微信小程序
        isAppEnter: false, //是否从app进
      }
    },
    created() {
      this.isAppEnter = Number(this.$route.query.isAppEnter)
      this.isWeChat = window.__wxjs_environment === 'miniprogram'
      this.getRanking()
    },
    methods: {
      // 获取前三名图标
      geTrankIcon(index) {
        console.log(index)
        if (index === 0) return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-goldmedal-icon.png'
        if (index === 1) return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-silvermedal-icon.png'
        if (index === 2) return 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bronze-medal-icon.png'
        return ''
      },
      thumbsUp(item) {
        let params = {
          customerId: item ? item.customerId : this.myRanking.customerId,
        }
        let beCurrentUserLiked = item ? item.beCurrentUserLiked : this.myRanking.beCurrentUserLiked
        beCurrentUserLiked === 0
          ? giveALike(params).then((res) => {
              // 点赞
              if (res.code === 200) {
                if (item) {
                  // 排行榜区点赞
                  console.log('这里333')
                  if (item.customerId === this.myRanking.customerId) {
                    this.myRanking.likeNum++
                    this.myRanking.beCurrentUserLiked = 1
                  }
                  item.beCurrentUserLiked = 1
                  //isThumb为true执行一下动画
                  item.isThumb = true
                  item.likeNum++
                } else {
                  // 自己区域点赞
                  console.log('这里555')
                  this.myRanking.likeNum++
                  this.myRanking.isThumb = true
                  this.myRanking.beCurrentUserLiked = 1
                  // 在自己信息处给自己点赞排名区需要同步
                  this.rankingList.forEach((people) => {
                    if (people.customerId === this.myRanking.customerId) {
                      people.likeNum++
                      people.beCurrentUserLiked = 1
                    }
                  })
                }
              }
            })
          : cancelLike(params).then((res) => {
              // 取消点赞
              if (res.code === 200) {
                if (item) {
                  // 排行榜区取消点赞
                  console.log('这里22')
                  if (item.customerId === this.myRanking.customerId) {
                    this.myRanking.likeNum--
                    this.myRanking.beCurrentUserLiked = 0
                  }
                  item.isThumb = false
                  item.beCurrentUserLiked = 0
                  item.likeNum--
                } else {
                  // 自己区域取消点赞
                  console.log('这里11')
                  this.rankingList.forEach((people) => {
                    if (people.customerId === this.myRanking.customerId) {
                      people.likeNum--
                      people.beCurrentUserLiked = 0
                    }
                  })
                  this.myRanking.isThumb = false
                  this.myRanking.beCurrentUserLiked = 0
                  this.myRanking.likeNum--
                }
              }
            })
      },
      getRanking() {
        // let data = {}
        // this.rankingList = data.bargainUserDetailTopTwentyVOS
        // this.rankingList.forEach((item) => {
        //   // 给每一项设置无点赞动效样式
        //   item.isThumb = false
        // })
        // this.numberOne = data.bargainUserDetailTopTwentyVOS[0]
        // this.myRanking = deepClone(data)
        // return
        rankedList().then((res) => {
          console.log(res.data, '排行榜')
          if (res.code === 200) {
            this.rankingList = res.data.bargainUserDetailTopTwentyVOS
            this.rankingList.forEach((item) => {
              // 给每一项设置无点赞动效样式
              item.isThumb = false
            })
            this.numberOne = res.data.bargainUserDetailTopTwentyVOS[0]
            this.myRanking = deepClone(res.data)
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      },
    },
  }
</script>

<style lang="less" scoped>
  .count {
    position: relative;
    bottom: -3px;
  }
  .thumb-move {
    animation: fadenum 1s ease-in-out infinite;
    -webkit-animation: fadenum 1s ease-in-out 1;

    @keyframes fadenum {
      0% {
        transform: scale(1) rotate(0deg);
      }
      50% {
        transform: scale(1.3) rotate(-30deg);
      }
      100% {
        transform: scale(1) rotate(0deg);
      }
    }
  }
  .singleLine {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }
  .page-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .fixed-header {
    width: 100%;
    height: 44px;
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      margin-left: 12px;
      img {
        width: 24px;
      }
    }
    .title {
      text-align: center;
      color: #000;
      font-size: 18px;
      line-height: 44px;
    }

    .more {
      width: 28px;
      height: 20px;
      line-height: 20px;
      margin-right: 20px;
      color: #333;
      font-size: 14px;
    }
  }
  .main-container {
    background-image: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-ranking-bgc.jpg');
    background-size: 100% 100%;
    // height: 100vh;
    flex: 1;
    height: 0; //解决子元素中ranking内容过长 导致ranking没有滚动条
    display: flex;
    flex-direction: column;
    padding: 20px 14px;
    .top {
      .head-portrait {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 10px;
        .head-picture {
          position: relative;
          width: 65px;
          height: 65px;
          .picture-box {
            background: #ffffff;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid #ffc727;
            .picture {
              width: 44px;
              position: relative;
              position: absolute;
              top: 10px;
              left: 50%;
              transform: translate(-50%, 0%);
            }
          }

          .crown-icon {
            position: absolute;
            width: 30px;
            height: 27px;
            left: -9px;
            top: -7px;
            transform: rotate(352deg);
          }
          .coupons-count {
            position: absolute;
            text-align: center;
            background: linear-gradient(90deg, #fd713f 0%, #fe4548 100%);
            border-radius: 3px;
            font-size: 9px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #ffffff;
            bottom: -15px;
            padding: 4px 5.5px;
            white-space: nowrap;
            left: 50%;
            transform: translate(-50%, 0%);
          }
        }
        .name {
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          margin: 25px 0px 0px 0px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .singleLine {
            max-width: 118px;
          }
        }
      }

      .explain {
        text-align: center;
        font-size: 10px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ffffff;
      }
      .my-info {
        height: 73px;
        border-radius: 10px;
        border: 1px solid #ffffff;
        box-shadow: 0px 3px 8px 0px #ffffff;
        background: rgba(79, 42, 78, 0.55) !important;
        margin-top: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #ffffff;
        padding: 12px 16px;
        .my-head-box {
          background: #ffffff;
          width: 50px;
          height: 50px;
          overflow: hidden;
          margin-right: 9px;
          border-radius: 50%;
          position: relative;
          .my-head {
            width: 42px;
            position: relative;
            top: 10px;
            left: 50%;
            transform: translate(-50%, 0%);
          }
        }
        .my-name {
          font-size: 15px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          width: 110px;
        }
        .my-coupon {
          display: flex;
          padding: 9px 16px;
          align-items: center;
          img {
            width: 21px;
            height: 20px;
            margin-right: 5px;
          }
        }
        .my-thumb {
          display: flex;
          align-items: center;
          img {
            width: 17px;
            height: 18px;
            margin-right: 5px;
          }
          .count {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 500;
            color: #ffffff;
          }
        }
        .goBack {
          width: 130px;
          height: 32px;
          background: #c3aeff;
          box-shadow: -1px 7px 9px -3px #8972df;
          border-radius: 16px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #ffffff;
          text-align: center;
          line-height: 32px;
        }
      }
    }
    .ranking {
      flex: 1;
      border-radius: 10px;
      margin-top: 7px;
      background: linear-gradient(180deg, rgba(79, 42, 78, 0.55) 0%, #e2aa68 100%);
      background: rgba(79, 42, 78, 0.55) !important;
      overflow: scroll;
      padding: 11px 16px;

      //   opacity: 0.55;
      .raking-item {
        display: flex;
        flex-direction: row;
        color: #ffffff;
        border-bottom: 1px solid #997a7a;
        padding: 12px 0px;

        justify-content: space-between;
        .left {
          display: flex;
          flex-direction: row;
          align-items: center;
          .rank {
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 23px;
              height: 28px;
            }
          }
          .name {
            width: 97px;
          }
          .head-box {
            background: #ffffff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 9px;
            position: relative;

            .head-pic {
              width: 31px;
              position: absolute;
              top: 9px;
              left: 50%;
              margin-right: 10px;
              transform: translate(-50%, 0%);
            }
          }
        }
        .right {
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;

          .coupon {
            display: flex;
            align-items: flex-end;
            img {
              width: 22px;
              height: 20px;
              margin-right: 5px;
            }
            margin-right: 17px;
          }
          .thumb {
            display: flex;
            align-items: flex-end;
            img {
              width: 19px;
              height: 20px;
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>

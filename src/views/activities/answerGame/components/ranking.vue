<template>
  <van-popup  v-model="isRanking" :close-on-click-overlay="false" class="select-popup">
    <div class="page-container">
      <div class="box">
      </div>
      <div class="main-container">
        <div class="among-box">
          <img class="guanbi-box"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/paihangbang_guanbi.png"
            @click="close" />
          <img class="title-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/paihangbang_top.png" />
          <div class="top">
            <div class="my-info">
              <div class="my-rank">{{ getRank(myRanking.currentRanking) }}</div>
              <div class="my-head-box">
                <img class="my-head"
                  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/touxiang.png" />
              </div>
              <!-- 我的卡券 -->
              <div class="my-coupon">
                <img
                  src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-icon.png" />
                <p class="count">{{ myRanking.couponNum }}张</p>
              </div>
              <p class="my-name singleLine">{{ myRanking.userName }}</p>
              <!-- 我的点赞 -->
              <div class="my-thumb">
                <img class="zan-img" @click="thumbsUp()" :class="myRanking.isThumb ? 'thumb-move' : ''" :src="
                  myRanking.beCurrentUserLiked === 0
                    ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dianzan_hui.png'
                    : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dianzan.png'
                " />
                <p class="count" :style="{ color: myRanking.beCurrentUserLiked ? '#FF4F9F' : '#C5C5C5' }">{{
                  myRanking.likeNum*1>999?'999+':myRanking.likeNum}}</p>
              </div>
              <!-- <div v-if="!myRanking.currentRanking" class="goBack" @click="goBack()">
              返回首页玩游戏
            </div> -->
            </div>
          </div>
          <div class="ranking" id="ranking" :style="{height:`${boxHeight*0.645}px`}">

            <div class="raking-item" v-for="(item, index) in rankingList" :key="index">
              <img v-if="index==0" class="crown-img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-crown.png" />
              <div class="left">
                <div class="rank">
                  <img v-if="index < 3" :src="geTrankIcon(index)" />
                  <p v-else>{{ item.currentRanking }}</p>
                </div>
                <div class="head-box">
                  <img class="head-pic"
                    src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/touxiang.png" />
                </div>
                <div class="coupon">
                  <img
                    src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-coupons-icon.png" />
                  <p class="count">{{ item.couponNum }}张</p>
                </div>

              </div>
              <div class="right">
                <p class="name singleLine">{{ item.userName }}</p>
                <div class="thumb">
                  <img :src="
                    item.beCurrentUserLiked === 0
                      ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dianzan_hui.png'
                      : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dianzan.png'
                  " @click="thumbsUp(item)" :class="item.isThumb ? 'thumb-move' : ''" />
                  <p class="count" :style="{ color: item.beCurrentUserLiked ? '#FF4F9F' : '#C5C5C5' }">{{ item.likeNum*1>999?'999+':item.likeNum}}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-title">*只展示排名前20用户</div>
        </div>
      </div>

  </div>
</van-popup>
</template>

<script>

import { rankedList, giveALike, cancelLike } from '@/api/activities/games.js'
import { deepClone } from '@/utils/utils'
import { nextTick } from 'process';
export default {
  name: 'ranking',
  props: {
    isRanking: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      myRanking: {}, //当前用户
      numberOne: {}, //榜一用户
      rankingList: [],
      boxHeight:''
    }
  },
  watch: {
    isRanking(val) {
      if (val) {
        if (val === true) {;
          this.getRanking()
        }
      }
    }
  },
  created() {
    this.getRanking()
   this.boxHeight=document.body.clientHeight
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
    close() {
      this.$emit('close', false)
    },
    getRank(item) {
      if (!item) {
        return '无'
      } else if (item * 1 > 999) {
        return '999+'
      }
      else {
        return item
      }
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
.bottom-title{
    line-height: 19px; 
    height: 29px;
    padding-top: 5px;
    text-align: center;
    color: #fff;
  }
.count {
  position: relative;
  bottom: -1px;
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
  height: 677px;
  margin-top: 55.5px;
  width: 375px;
  margin-top: 102px
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
  background: #FBA5CC;
  width: 348px;
  margin: 0 auto;
  border-radius: 15px;
  padding-bottom: 10px;

  .among-box {
    width: 338px;
    background: #E23E87;
    margin-top: 10px;
    border-radius: 15px;
    margin-left: 5px;
    position: relative;
    .title-img {
      position: absolute;
      width: 347px;
      left: -5px;
      top: -52px;
    }
    .guanbi-box {
      width: 31px;
      height: 34.5px;
      position: relative;
      left: 321px;
      top: -29px;
      z-index: 100;
    }

    .top {
      margin-top: -40px;
      margin-left: -2px;

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
            // font-family: Source Han Sans CN;
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

          width: 10px;
          height: 5px;
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
        display: flex;
        align-items: center;
        color: #ffffff;
        padding: 24px 16px 12px 13px;

        .my-rank {
          font-size: 18px;
          font-family: Arial;
          font-weight: bold;
          font-style: italic;
          color: #FF3D98;
          z-index: 0;
          margin-left: -9px;
          width: 36px;
          text-align: center;
        }

        .my-head-box {
          width: 50px;
          height: 50px;
          overflow: hidden;
          margin-left: 3px;
          border-radius: 50%;
          position: relative;

          .my-head {
            width: 42px;
            position: relative;
            // top: 10px;
            left: 50%;
            transform: translate(-50%, 0%);
          }
        }

        .my-name {
          min-height: 27px;
          color: #FEFEFE;
          width: 94px;
          background-color: #AA8DFC;
          border-radius: 13px;
          padding: 4px 0px 3px 0px;
          margin-left: 3.5px;
          text-align: center;
          z-index: 0;

        }

        .my-coupon {
          display: flex;
          // padding: 9px 16px;
          align-items: center;
          align-items: center;
          background-color: #F67C58;
          border-radius: 13px;
          margin-left: 6px;
          width: 70px;
          padding: 3px 0px 4px 9px;
          margin-left: 4px;
          z-index: 0;

          // margin-left: -112px;
          img {
            width: 21px;
            height: 20px;
            margin-right: 5px;
          }
        }

        .my-thumb {
          display: flex;
          align-items: center;
          margin-left: 11px;

          .zan-img {
            z-index: 0;
            width: 19px;
            height: 20px;
          }

          img {
            width: 17px;
            height: 18px;
            margin-right: 5px;
          }

          .count {
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
      border-radius: 10px;
      overflow: scroll;
      padding: 12px 16px 0 0;
      // max-height: 520px;
      margin-top: 3px;
      background: #F7F3F7;
      // margin-left: 6px;

      .raking-item {
        position: relative;
        display: flex;
        flex-direction: row;
        color: #ffffff;
        border-bottom: 2px dashed #FFD0E5;
        padding: 6px 0px;
        width: 330px;

        .crown-img {
          position: absolute;
          z-index: 10;
          width: 23px;
          left: 40px;
          top: -3px;
        }

        // justify-content: space-evenly;

        .left {
          display: flex;
          flex-direction: row;
          align-items: center;

          .rank {
            width: 40px;
            display: flex;
            align-items: center;
            justify-content: center;

            p {
              font-size: 18px;
              font-family: Arial;
              font-weight: bold;
              font-style: italic;
              color: #FF3D98;
            }

            img {
              width: 23px;
              height: 28px;
            }
          }

          .name {
            width: 94px;
            background-color: #E6D7F6;
            border-radius: 13px;
            padding: 4px 0px 3px 15px;
          }

          .head-box {
            // background: #ffffff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            // overflow: hidden;
            margin-right: 9px;
            position: relative;

            .head-pic {
              width: 42px;
              position: absolute;
              // top: 9px;
              left: 64%;
              margin-right: 10px;
              transform: translate(-50%, 0%);
            }
          }

          .coupon {
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background-color: #E39293;
            border-radius: 3.4666666667vw;
            margin-left: 1.6vw;
            width: 18.6666666667vw;
            padding: 0.5333333333vw 0px 1.0666666667vw 2.4vw;

            img {
              width: 22px;
              height: 20px;
              // margin-right: 5px;
            }

            .count {
              margin-left: 4px;
            }

          }
        }

        .right {
          margin-left: -1.2vw;
          display: flex;
          flex-direction: row;
          align-items: center;
          position: relative;
          margin-left: 4px;

          .name {
            width: 94px;
            background-color: #B795DB;
            border-radius: 13px;
            padding: 4px 0px 3px 0px;
            text-align: center;
          }

          .coupon {
            width: 72px;
            display: flex;
            align-items: flex-end;
            background-color: #E39293;
            padding: 1px 7px 4px 12px;
            border-radius: 13px;

            img {
              width: 22px;
              height: 20px;
              // margin-right: 5px;
            }

            .count {
              margin-left: 4px;
            }
          
          }
          .thumb {
            display: flex;
            align-items: flex-end;
            margin-left: 10px;
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
}
</style>

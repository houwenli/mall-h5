<template>
  <div class="page-container" ref="mainContaier">
    <header v-if="!isH5" class="fixed-header">
      <div class="back" @click="goBack"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <!-- <div class="title">答题游戏</div> -->
      <div class="more"></div>
    </header>
    <div class="main-container">
      <div v-if="false" @click="goBack" class="back-box"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="content">
        <div class="index">{{ '第' + current + '/' + questionList.length + '题' }}</div>
        <div class="question">
          <img class="danxuanti-img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/danxuanti.png" />
          <div v-if="errorFlag" class="error-box">请选择一个答案</div>
        </div>
        <div class="question-content">{{ questionList[current - 1] && questionList[current - 1].itemContent }}</div>
        <div class="answer-box">
          <div class="answer-list">
            <div v-for="(item, index) in (questionList[current - 1] ? questionList[current - 1].answerList : [])"
              @click="selectAnswer(item.answerNo)" :key="index" :class="{ 'is-select': myAnswer === item.answerNo }">
              <span>{{ item.answerNo }}</span>{{ item.content }}
            </div>
          </div>
        </div>
      </div>

      <div class="submit-btn" v-if="questionList.length === current" @click="submit()">提交</div>
      <!-- <div class="submit-btn" @click="submit()">提交</div> -->
      <div class="submit-btn" v-else @click="next()">下一题</div>
    </div>
    <van-popup v-model="correctShow" :close-on-click-overlay="false">
      <!-- 回答正确图片 -->
      <img class="result-img" :src="
        answerResult
          ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_zhengque.png'
          : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_cuowu.png'
      " />
    </van-popup>
    <component :listData="couponList" :successCoupon="successCoupon" @updateComponentName="updateComponentName"
      @resetDate="resetDate" :activityId="$route.query.activityId" :id="$route.query.id" :is="componentName"
      v-if="isPopup" @closeCoupon="closeCoupon"></component>
</div>
</template>

<script>





import selectCoupon from './components/selectCoupon.vue'
import receivedSuccessfully from './components/receivedSuccessfully.vue'
import receivedFail from './components/receivedFail.vue'
import { getQuestionsList, getCouponList, addRecord } from '@/api/activities/games'
import { deepClone } from '@/utils/utils'
export default {
  name: 'answer',
  components: {
    selectCoupon,
    receivedSuccessfully,
    receivedFail,
  },

  data() {
    return {
      checked: '',
      correctShow: false, //回答正确
      componentName: 'receivedSuccessfully',
      time: null,
      isPopup: false,
      answerResult: null, //答题结果
      current: 1,
      answer: '', //正确答案
      myAnswer: '', //我的回答
      question: {}, //当前问题
      couponList: [], //闯关成功后查询到可领取的优惠券
      successCoupon: {}, //领取成功的卡券
      randomNumber: null, //当题目为猜成语则随机一个答案
      errorTips: false, //输入答案错误提示
      flag: true,
      activeBox: 0,
      isBack: false,
      isH5: this.$store.state.userSource == 3,
      questionList: [],
      errorFlag: false,
      optionList: [
        {
          value: 'A',
          text: ''
        },
        {
          value: 'B',
          text: ''
        },
        {
          value: 'C',
          text: ''
        },
        {
          value: 'D',
          text: ''
        }
      ],
    }
  },
  watch: {
  },
  mounted() {

    let that = this
    this.$nextTick(() => {
      // const top =  that.$refs.mainContaier.offsetTop
      that.$refs.mainContaier.scrollTo({
        top: 70,
        behavior: 'smooth',
      })
    })
    this.getQuestions()
  },
  activated() {
  },
  methods: {
    selectAnswer(value) {
      this.myAnswer = value;
      console.log(this.myAnswer);
    },
    goBack() {
      this.$router.push({ name: 'answerGame' })
    },
    closeCoupon() { },
    async getQuestions() {
      await getQuestionsList({ questionNum: 3, itemType: 1 }).then((res) => {
        if (res.code == 200) {
          this.questionList = deepClone(res.data) || []
          this.questionList.length = this.questionList.length
          this.answer = this.questionList[0].answer
        }
      })
    },

    // 提交最后一关
    async submit() {
      if (!this.myAnswer) {
        this.errorFlag = true
        this.time = setTimeout(() => {
          this.errorFlag = false
        }, 2000)
        return
      }
      this.answerResult = this.answer === this.myAnswer
      if (this.answerResult) {
        let params = {
          activityId: this.$route.query.activityId,
        }
        await getCouponList(params)
          .then((res) => {
            if (res.data.cardCouponList !== null && res.data.cardCouponList.length !== 0) {
              this.couponList = res.data.cardCouponList
              this.couponList.forEach((item) => {
                // 初始都为高亮，不显示遮罩
                item.isMask = false
              })
              // 有优惠券
              this.componentName = 'selectCoupon'
            } else {
              // 没有优惠券提示
              this.componentName = 'receivedFail'
            }
            this.isPopup = true
          })
          .catch((err) => {
            console.log('err:', err)
          })
      } else {
        this.correctShow = true
        this.time = setTimeout(() => {
          this.correctShow = false
        }, 2000)
      }
    },
    // 提交下一关
    next() {
      if (!this.myAnswer) {
        this.errorFlag = true
        this.time = setTimeout(() => {
          this.errorFlag = false
        }, 2000)
        return
      }
      this.answerResult = this.answer === this.myAnswer
      this.correctShow = true
      this.time = setTimeout(() => {
        if (this.answerResult) {
          this.current = this.current + 1
        }
        this.correctShow = false
        this.myAnswer = ''
        this.answer = this.questionList[this.current - 1].answer
      }, 1000)

    },
    onFocus(index) {
      this.activeBox = index
    },
    onKeyup(event, index) {
      // 只能输入中文
      let reg = /[^\u4e00-\u9fa5]/g

      let value = event.target
      // 将值过滤成只有中文

      if (value && value.length) {
        value = value.replace(reg, '')
        this.myAnswer[index] = value
        if (value) {
          // pc端的删除=8； delete = 46
          if (event.keyCode !== 8 || event.keyCode !== 46) {
            if (this.isBack === false) {
              this.setNextFocus()
            }
          }
        }
      }
    },
    setNextFocus() {
      // 当前索引不是最后一个
      if (this.activeBox !== this.$refs['answerBoxRef'].length - 1) {
        for (let i = this.activeBox; i < this.$refs['answerBoxRef'].length - 1; i++) {
          let text = this.$refs['answerBoxRef'][i + 1].value
          if (text.length === 0) {
            this.$nextTick(() => {
              this.$refs['answerBoxRef'][i + 1].focus()
            })
            break
          }
        }
      }
    },
    onDelete(event, index) {
      console.log('我是input', `当前是否输入完毕${this.flag}`, event.inputType, event.target.value)
      //删除
      if (event.inputType === 'deleteContentBackward') {
        console.log('删除啦')
        // 回到上一个输入框
        // 当前聚焦的输入框是第一个或者正确答案是第一个且当前输入框是第二个的时候不走聚焦操作
        if (index !== 0) {
          if (this.randomNumber === 0 && index === 1) return
          if (index - 1 === this.randomNumber) {
            index--
          }
          this.$nextTick(() => {
            this.$refs['answerBoxRef'][index - 1].tabindex = '-1'
            this.$refs['answerBoxRef'][index - 1].focus()
            this.isBack = true
            setTimeout(() => {
              this.isBack = false
            }, 1000)
          })
        }
      }
      // 输入完毕且 中文输入完成后的event.inputType为undefined 字母数字输入完成event.inputType为insertText
      if (this.flag && event.target.value !== '' && (event.inputType === 'insertText' || event.inputType === undefined)) {
        // 设置下一个
        this.setNextFocus()
      }
    },
    onCompositionend(event) {
      this.flag = true
      // 原来代码
      // let text = event.data
      // if (text.length) {
      //   // 设置下一个
      //   this.setNextFocus()
      // }
    },
    compositionstart() {
      this.flag = false
    },
    //   领取后弹窗内容成功或者失败
    updateComponentName(componentName, coupon) {
      this.componentName = componentName
      this.isPopup = true
      this.successCoupon = coupon
    },
    goTo(name) {
      this.$router.push({
        name,
      })
    },

    // 初始化data
    resetDate() {
      Object.assign(this, this.$options.data())
      let paramsRecord = {
        claimNum: 0,
        id: this.$route.query.id,
        nodeType: 2,
      }
      addRecord(paramsRecord)
        .then((res) => { })
        .catch((err) => {
          console.log('err:', err)
        })
      this.getQuestions()
    },
  },
}
</script>

<style lang="less" scoped>
.page-container {
  height: 100%;
  background: #f9b4b6;
  overflow-y: scroll;
  position: relative;

  .van-popup {
    background: none;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .result-img {
    width: 375px;
    height: 358px;
  }

  .fixed-header {
    position: fixed;
    z-index: 10;
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
    width: 100%;
    background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati-bg.png');
    background-size: 100% 799px;
    padding-top: 90px;
    padding-bottom: 77px;
    overflow-x: hidden;

    .back-box{
  width: 50px;
  height: 30px;
  position: absolute;
  background: #fff;
  opacity: 0.8;
  top:30px;
  left: 14px;
  border-radius: 15px;
  img{
    margin-left: 8px;
    width: 27px;
  }

}

    .game-bg {
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vh;
      // height: 100%;
      z-index: 0;
    }

    .top-red-line {
      position: relative;
      z-index: 4;
      display: block;
      width: 100%;
      // height: 68px;
      height: 100px;
    }

    .step-container {
      position: relative;
      z-index: 4;
      display: flex;
      justify-content: center;

      .circle-bg {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 68px;
        z-index: -1;
      }

      .step-number {
        width: 68px;
        height: 68px;
        font-size: 26px;
        font-family: Arial;
        font-weight: 400;
        color: #ff4040;
        text-align: center;
        line-height: 68px;
        padding-left: 4px;
        // background: rgba(0, 0, 0, 0.3);
        box-sizing: border-box;
      }
    }

    .content {
      // margin-top: 90px;
      position: relative;
      width: 100%;
      height: 539px;
      // overflow: hidden;
      box-sizing: border-box;
      z-index: 6;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_shuben.png');
      background-size: 100% 539px;

      .index {
        padding-top: 6px;
        margin-left: 239px;
        width: 100%;
        // height: 21px;
        font-size: 22px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #FFFFFF;
        line-height: 24px;
        text-shadow: 0px 1px 1px rgba(0, 0, 0, 0.34);
      }

      .question {
        margin-top: 34px;
        height: 56px;
        text-align: center;

        .danxuanti-img {
          width: 80px;
          height: 30px;
        }

        .error-box {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #AF5333;
         
          background: #e4d2bc;
          background: #e4d2bc;
          width: 110px;
          margin: 0 auto;
          border-radius: 11px;
        }
      }

      .question-content {
        width: 280px;
        height: 80px;
        font-size: 21px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #74543E;
        line-height: 26px;
        text-align: center;
        margin: 0 auto;
      }

      .question-option-pic {
        width: 100%;
        height: 80px;

      }

      .question-option-text {
        font-size: 20px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #942707;
        word-break: break-all //数字换行;
      }

      .options-area {
        width: 256px;
        height: 174px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 20px;
        padding-right: 20px;
        box-sizing: border-box;
      }

      .answer-box {
        padding-top: 72px;
        z-index: 20;

        .answer-list {
          margin: 0 auto;
          width: 256px;
          margin-left: 14%;

          .is-select {
            color: #ffffff !important;
            font-weight: bold !important;
            background: #fa6ead !important;

            span {
              color: #ffffff;
              -webkit-text-stroke: 3rpx #cf3b8b;
            }

          }

          // padding-left: 24px;
          // padding-right: 24px;
          div {
            padding-left: 11px;
            font-size: 13px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #B96345;
            width: 260px;
            height: 42px;
            background: #FEF2E2;
            border-radius: 10px;
            line-height: 42px;
            margin-bottom: 10px;

            span {
              font-size: 21px;
              font-family: Source Han Sans CN;
              font-weight: bold;
              color: #B55B3C;
              margin-right: 12px;
            }
          }
        }

        .box-item {
          display: block;
          width: 44px;
          height: 44px;
          border: 1px solid #942707;
          font-size: 24px;
          font-family: Source Han Sans CN;
          font-weight: 500;
          color: #942707;
          padding: 0;
          text-align: center;
          line-height: 44px;
        }
      }

      .game-content-bg {
        // position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 441px;
        z-index: -1;
      }
    }

    .submit-btn {
      position: relative;
      z-index: 4;
      width: 220px;
      height: 71px;
      line-height: 80px;
      background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/women-Day/dati_xiayiti.png') no-repeat;
      background-size: cover;
      text-align: center;
      margin: 0 auto;
      font-size: 25px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #FFFFFF;
      line-height: 80px;
      text-shadow: 0px 1px 1px #000000;
      margin-top: 22px;
    }
  }
}</style>

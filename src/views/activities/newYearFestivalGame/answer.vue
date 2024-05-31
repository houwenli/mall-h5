<template>
  <div class="page-container">
    <header v-if="isAppEnter" class="fixed-header">
      <div class="back" @click="$router.go(-1)"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">答题游戏</div>
      <div class="more"></div>
    </header>

    <div class="main-container">
      <!-- 底图 -->
      <img class="game-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-ranking-bgc.jpg" alt="" />

      <!-- 顶部红线 -->
      <img class="top-red-line" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bgc-rope.png" alt="" />

      <!-- 关卡 -->
      <div class="step-container">
        <img class="circle-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bgc-circular.png" alt="" />
        <div class="step-number">{{ `${current}/${questionList.length}` }}</div>
      </div>

      <div class="content">
        <img class="game-content-bg" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-bgc-panel.png" alt="" />
        <!-- 标题 -->
        <div class="question">{{ question.itemContentType === 0 ? '打一字' : '打一成语' }}</div>
        <div class="options-area">
          <!-- 纯文案的 -->
          <div class="question-option-text" v-if="question.itemContentType === 0">{{ question.itemContent }}</div>
          <!-- 图片 -->
          <img class="question-option-pic" v-else :src="question.itemContent" />
        </div>
        <div class="answer-box">
          <div class="answer-list">
            <input
              ref="answerBoxRef"
              :disabled="question.itemContentType === 1 && randomNumber === index"
              class="box-item"
              v-model="myAnswer[index]"
              @focus="onFocus(index)"
              @keyup="onKeyup($event, index)"
              @input="onDelete($event, index)"
              @compositionend="onCompositionend"
              @compositionstart="compositionstart"
              maxlength="1"
              v-for="(item, index) in answer"
              :key="index"
            />
          </div>
        </div>
      </div>

      <div class="submit-btn" v-if="questionList.length === current" @click="submit()">提交</div>
      <!-- <div class="submit-btn" @click="submit()">提交</div> -->
      <div class="submit-btn" v-else @click="next()">下一关</div>
    </div>
    <van-popup v-model="correctShow" :close-on-click-overlay="false">
      <!-- 回答正确图片 -->
      <img
        class="result-img"
        :src="
          answerResult
            ? 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-correct-answer.png'
            : 'https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-wrong-answer.png'
        "
      />
    </van-popup>
    <component
      :listData="couponList"
      :successCoupon="successCoupon"
      @updateComponentName="updateComponentName"
      @resetDate="resetDate"
      :activityId="$route.query.activityId"
      :id="$route.query.id"
      :is="componentName"
      v-if="isPopup"
      :isAppEnter="isAppEnter"
    ></component>
  </div>
</template>

<script>
  import selectCoupon from './components/selectCoupon.vue'
  import receivedSuccessfully from './components/receivedSuccessfully.vue'
  import receivedFail from './components/receivedFail.vue'
  import { getQuestionsList, getCouponList, addRecord } from '@/api/activities/games'

  export default {
    name: 'answer',
    components: {
      selectCoupon,
      receivedSuccessfully,
      receivedFail,
    },

    data() {
      return {
        correctShow: false, //回答正确
        componentName: 'receivedSuccessfully',
        time: null,
        isPopup: false,
        answerResult: null, //答题结果
        current: 1,
        answer: [], //正确答案
        myAnswer: [], //我的回答
        question: {}, //当前问题
        couponList: [], //闯关成功后查询到可领取的优惠券
        successCoupon: {}, //领取成功的卡券
        randomNumber: null, //当题目为猜成语则随机一个答案
        errorTips: false, //输入答案错误提示
        flag: true,
        activeBox: 0,
        isBack: false,
        questionList: [],
        isWeChat: false,
        isAppEnter: 0, //是否从app进 0不是 1是
      }
    },
    watch: {
      current: {
        handler(newVal) {
          if (newVal === 1) {
            return false
          }
          this.question = this.questionList[newVal - 1]
          this.answer = this.question.answer.split('')
          if (this.question.itemContentType === 0) {
            this.myAnswer = ['']
          } else {
            // 随机一个正确答案数字
            this.randomNumber = Math.floor(Math.random() * 4)
            this.myAnswer = []
            this.myAnswer[this.randomNumber] = this.answer[this.randomNumber]
          }
        },
      },
    },
    created() {
      this.isAppEnter = Number(this.$route.query.isAppEnter)
      this.isWeChat = window.__wxjs_environment === 'miniprogram'
      this.getQuestions()
    },
    methods: {
      async getQuestions() {
        await getQuestionsList({ questionNum: 3 }).then((res) => {
          if (res.code == 200) {
            this.questionList = res.data
            this.question = this.questionList[0]
            this.answer = this.question.answer.split('')
            if (this.question.itemContentType === 0) {
              this.myAnswer = ['']
            } else {
              this.randomNumber = Math.floor(Math.random() * 4)
              this.myAnswer[this.randomNumber] = this.answer[this.randomNumber]
            }
          }
        })
      },

      // 提交最后一关
      async submit() {
        this.answerResult = this.answer.join('') === this.myAnswer.join('')
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
        this.answerResult = this.answer.join('') === this.myAnswer.join('')
        this.correctShow = true
        this.time = setTimeout(() => {
          if (this.answerResult) {
            this.current = this.current + 1
          }
          this.correctShow = false
        }, 2000)
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
        this.isAppEnter = Number(this.$route.query.isAppEnter)
        this.isWeChat = window.__wxjs_environment === 'miniprogram'
        let paramsRecord = {
          claimNum: 0,
          id: this.$route.query.id,
          nodeType: 2,
        }
        addRecord(paramsRecord)
          .then((res) => {})
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
    height: 100vh;
    background: #f9e0c1;
    .van-popup {
      background: none;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .result-img {
      width: 306px;
      height: 334px;
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
      overflow: auto;
      width: 100%;
      flex: 1;
      background: #f9e0c1;

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
        position: relative;
        width: 100%;
        height: 441px;
        overflow: hidden;
        box-sizing: border-box;
        padding-top: 140px;
        text-align: center;
        z-index: 6;

        .question {
          font-size: 15px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #942707;
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
          word-break: break-all//数字换行;
        }

        .options-area {
          width: 256px;
          height: 174px;
          // background-color: rgba(1, 1, 1, 0.2);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-left: 20px;
          padding-right: 20px;
          box-sizing: border-box;
        }

        .answer-box {
          position: relative;
          z-index: 20;
          .answer-list {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 0 auto;
            width: 256px;
            padding-left: 24px;
            padding-right: 24px;
            box-sizing: border-box;
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
          position: absolute;
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
        width: 199px;
        height: 63px;
        line-height: 63px;
        background: url('https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/game-buttom-bgc.png') no-repeat;
        background-size: cover;
        text-align: center;
        margin: 0 auto;
        font-size: 27px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-style: italic;
        color: #ffffff;
        margin-top: 40px;
        margin-bottom: 85px;
      }
    }
  }
</style>

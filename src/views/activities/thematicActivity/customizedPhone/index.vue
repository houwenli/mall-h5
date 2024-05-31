<template>
  <div class="box_wrapper">
    <header class="fixed-header">
      <headerCom  pageTitle="购定制机 享万顺礼"></headerCom>
    </header>

    <div class="banner_box">
      <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/custom-page-top-bg-th.jpg" />
    </div>
    <div class="bottom_box">
      <div class="transverse_content" @click="click('y77')">
        <div class="right_top_img"><img
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png" /> </div>
        <div class="transverse_box">
          <div class="commodity_img"><img
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/vivo-y77-phone.png" />
          </div>
          <div class="commodity_introduce">
            <div class="first_title"> <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_VIVO%20Y77%402x.png" /></div>
            <div class="last_content"> <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_VIVO%20Y77_xinneng.png" /></div>
            <div class="price_content">
              <img class="memory_img_first"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/12g-256g.png" />
              <img class="goods_car"
                src=" https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/goods-car.png" />
              <p>{{ firstPrice }}<span>元 | </span>{{ firstPerformanceScore }}<span> 积分</span></p>
            </div>
          </div>
        </div>
        <div class="bottom_content">
          <img class="zu_img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_zu9%402x.png" />
          <img class="zeng_img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/gift-icon.png" />
          <img class="gift_img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/baowenbei_shujvxian.png" />
          <div class="bottom_content_right">
            <div class="purchase_copy">
              <span class="number_background">1</span>
              <p>买即得积分3798分</p>
            </div>
            <div class="purchase_copy">
              <span class="number_background">2</span>
              <p>万顺大礼包</p>
            </div>
            <p class="purchase_copy_title">随机赠送礼品一份</p>
            <!-- <p class="purchase_copy_title">66W超快充数据线</p>
            <p class="purchase_copy_title">真皮定制皮带</p> -->
            <div class="purchase_copy">
              <span class="number_background">3</span>
              <p>定制开机画面</p>
            </div>
            <!-- <p class="purchase_copy_title">独家万顺定制开机画面</p> -->
          </div>
        </div>
      </div>
      <div class="transverse_content" @click="click('A1')">
        <div class="transverse_box">
          <img class="right_top_img2"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png" />
          <div class="commodity_img"><img
              src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/OPPO-A1-Pro-phone.png" />
          </div>
          <div class="commodity_introduce">
            <div class="last_first_title"> <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_OPPO%20A1%20Pro%402x.png" /></div>
            <div class="last_content"> <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_OPPO%20A1%20Pro_xinneng.png" /></div>
            <div class="last-price_content">
              <img class="memory_img_last"
                src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/8g-256g.png" />
              <img class="goods_car"
                src=" https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/goods-car.png" />
 
              <p>{{ secondPrice }}<span>元  | </span>{{ secondPerformanceScore }}<span> 积分</span></p>
            </div>
          </div>
        </div>
        <div class="bottom_content">
          <img class="zu_img" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/dingzhi_zu9%402x.png" />

          <img class="zeng_img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/gift-icon.png" />
          <img class="gift_img"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/baowenbei_shujvxian.png" />
          <div class="bottom_content_right">
            <div class="purchase_copy">
              <span class="number_background">1</span>
              <p>买即得积分3798分</p>
            </div>
            <div class="purchase_copy">
              <span class="number_background">2</span>
              <p>万顺大礼包</p>
            </div>
            <p class="purchase_copy_title">随机赠送礼品一份</p>
            <!-- <p class="purchase_copy_title">66W超快充数据线</p>
            <p class="purchase_copy_title">真皮定制皮带</p> -->
            <div class="purchase_copy">
              <span class="number_background">3</span>
              <p>定制开机画面</p>
            </div>
            <!-- <p class="purchase_copy_title">独家万顺定制开机画面</p> -->
          </div>
        </div>
      </div>
      <div class="last_content_box">
        <div class="top_title">活动规则</div>
        <div class="buttom_content">
          <img class="right_top_img3"
            src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/activity/ball.png" />
          <div class="rule-item">
            <div class="sort">1.</div>
            <div class="rule-text">凡万顺福商城用户，均可参与本次专题活动；</div>
          </div>
          <div class="rule-item">
            <div class="sort">2.</div>
            <div class="rule-text">万顺叫车合伙人参与本次活动，可获相应积分奖励；</div>
          </div>
          <div class="rule-item">
            <div class="sort">3.</div>
            <div class="rule-text">活动订单若发生退款或退货，则不享有任何活动优惠；</div>
          </div>
          <div class="rule-item">
            <div class="sort">4.</div>
            <div class="rule-text">活动手机一年质保，自签收后因质量问题一个月内包换，原则上除未拆包外不支持退货；</div>
          </div>
          <div class="rule-item">
            <div class="sort">5.</div>
            <div class="rule-text">因库存有限，具体赠品以下单页面所展示为准，且物流受节日或疫情影响可能会出现延后发货，造成不便，敬请谅解。</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { selectActivityCustomized } from '@/api/activities/thematicActivity'
import headerCom from '@/views/specialTopic/comp/common/header.vue'
export default {
    components:{headerCom},
  data() {
    return {
      commodityData: [],
      firstPrice: '',
      secondPrice: '',
      firstPerformanceScore: '',
      secondPerformanceScore: '',
    }
  },
  created() { this.getInfo() },
  methods: {
    click(type) {
      this.$router.push({ path: '/spudetail', query: { id: type === 'y77' ? this.commodityData[0].skuId : this.commodityData[1].skuId, type: 'driversDay' } })
    },
    getInfo() {
      selectActivityCustomized().then((res) => {
        this.commodityData = res.data;
        this.firstPrice = res.data[0].price;
        this.secondPrice = res.data[1].price;
        this.firstPerformanceScore = res.data[0].performanceScore;
        this.secondPerformanceScore = res.data[1].performanceScore;
      })
    },

  },
}
</script>

<style lang="less" scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.purchase_copy_title {
  font-weight: 400;
  color: #4F4F4F;
  line-height: 13px;
  padding-left: 17px;
  // text-indent: 16px;
}

.bottom_box {
  margin-top: 6px;
  position: relative;
  width: 100%;
  min-height: 1000px;
  background-position: center;
  background-size: 100% 1500px;
  background-repeat: no-repeat;

  .last_content_box {
    .top_title {
      font-size: 17px;
      font-weight: bold;
      margin-left: 15px;
      margin-top: 27px;
    }

    .buttom_content {
      padding: 14px 15px 22px 15px;
      position: relative;

      .rule-item {
        display: flex;
        margin-bottom: 6px;
        .sort {
          font-weight: 300;
          color: #595959;
          line-height: 21px;
        }

        .rule-text {
          font-weight: 300;
          color: #595959;
          line-height: 21px;
        }
      }

      .right_top_img3 {
        width: 58px;
        height: 53px;
        position: absolute;
        right: -30px;
        top: -40px;
      }
    }

    p {
      font-size: 13px;
      color: #595959;
    }
  }
}

.transverse_content {
  z-index: 0;
  padding: 0px 0px 7px 14px;
  width: 92%;
  // height: 370px;
  border-radius: 8px;
  background: #fff;
  background-position: center;
  background-size: 100% 370px;
  background-repeat: no-repeat;
  margin-left: 15px;
  margin-bottom: 13px;
  position: relative;

  .right_top_img {
    width: 55px;
    height: 50px;
    position: absolute;
    right: -20px;
    top: -20px;

    img {
      width: 100%;
      height: 100%;
      // margin-top: 32px;
      // margin-left: 17px;
      // padding: auto;
      // padding:15px 0px;
    }
  }

  .right_top_img2 {
    width: 38px;
    height: 40px;
    position: absolute;
    left: -20px;
    top: -20px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .bottom_content {
    position: relative;
    display: flex;
    width: 100%;
    background: #F5F4FF;
    // margin-top: 32px;
    border-radius: 8px;
    margin-left: -7px;
    margin-top: 28px;
    padding: 18px 0 11px;

    .bottom_content_right {
      height: 100%;
      margin-left: 5px;
      // height: 148px;
      overflow: hidden; //超出隐藏
      text-overflow: ellipsis; //溢出显示省略号
      white-space: normal; //常规默认，会折行
      display: -webkit-box;
      -webkit-box-orient: vertical; //子元素排列 vertical（竖排）orhorizontal（横排）

      .purchase_copy {
        display: flex;
        margin-top: 7px;
        align-items: center;

        .number_background {
          width: 14px;
          height: 14px;
          text-align: center;
          background: #736DC9;
          color: #fff;
          border-radius: 10px;
          line-height: 13px;
          margin-right: 5px;
        }

        p {
          color: #736DC9;
          font-weight: bold;
          font-size: 14px;
        }
      }
    }

    .zu_img {
      width: 143px;
      height: 77px;
      position: absolute;
      left: 187px;
      top: -16px;
      z-index: -1;
    }

    .zeng_img {
      width: 42px;
      height: 42px;
      position: absolute;
      left: -17px;
      top: -14px;

      img {
        width: 100%;
        height: 100%;
        margin-top: 32px;
        margin-left: 17px;
      }
    }

    .gift_img {
      width: 123px;
      height: 89px;
      margin: 8px 9px 0px 5px;

      img {
        width: 100%;
        height: 100%;
        margin-top: 32px;
        margin-left: 17px;
      }
    }
  }

  .transverse_box {
    padding-top: 23px;
    display: flex;
    width: 100%;
    height: 205px;

    .commodity_img {
      // margin-top: 45px;
      width: 138px;
      height: 180px;


      img {
        width: 100%;
        height: 100%;
        padding: 15px 0px;
      }
    }

    .commodity_introduce {
      padding: 0px 5px 0px;
      width: 100%;
      height: 200px;

      .last_first_title {
        width: 129px;
        height: 16px;

        // font-size: 24px !important;
        img {
          width: 100%;
          height: 100%;
        }
      }

      /deep/ .first_title {
        width: 94px;
        height: 16px;

        // font-size: 24px !important;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .last_content {
        margin-top: 12px;
        width: 220px;
        height: 90px px;

        // font-size: 24px !important;
        img {
          width: 100%;
          height: 100%;
        }
      }

      .price_content {
        margin-top: 12px;
        width: 210px;
        height: 42px;
        border: 1px solid #A55ECA;
        margin-right: 22px;
        position: relative;

        .goods_car {
          width: 39px;
          height: 41px;
          position: absolute;
          left: 170px;
        }

        .memory_img_first {
          position: absolute;
          width: 84px;
          height: 16px;
          top: -8px;
          left: -2px;
        }

        p {
          color: #FF0000;
          font-size: 19px;
          font-weight: bold;
          padding-top: 11px;
          padding-left: 11px;

          span {
            font-size: 12px;
            font-weight: bold;
          }
        }
      }

      .last-price_content {
        margin-top: 15px;
        width: 210px;
        height: 42px;
        border: 1px solid #A55ECA;
        margin-right: 22px;
        // background-image: url('../../../../assets/img/activity/customizedPhone_jiage02.png');
        // background-position: center;
        // background-size: 100% 100%;
        // background-repeat: no-repeat;
        position: relative;

        .goods_car {
          width: 39px;
          height: 41px;
          position: absolute;
          left: 170px;
        }

        .memory_img_first {
          position: absolute;
          width: 84px;
          height: 16px;
          top: -8px;
          left: -2px;
        }

        .memory_img_last {
          position: absolute;
          width: 77px;
          height: 16px;
          top: -8px;
          left: -2px;
        }

        p {
          color: #FF0000;
          font-size: 19px;
          font-weight: bold;
          padding-top: 11px;
          padding-left: 11px;

          span {
            font-size: 12px;
            font-weight: bold;
          }
        }
      }

      .commodity_title {
        margin: 10px;
        overflow: hidden; //超出隐藏
        text-overflow: ellipsis; //溢出显示省略号
        white-space: normal; //常规默认，会折行
        display: -webkit-box;
        -webkit-box-orient: vertical; //子元素排列 vertical（竖排）orhorizontal（横排）
        -webkit-line-clamp: 2;
        /*内容限制的行数 需要几行写几就行*/
        color: #fff;
        font-size: 12px;
      }
    }
  }

}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

.box_wrapper {
  background-color: #F7D5C8;
  width: 100%;
  overflow-x: hidden;
}

.fixed-header {
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
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

.banner_box {
  width: 100%;
  height: 330px;
  margin-top: 44px;
  z-index: -1;

  img {
    width: 100%;
    height: 100%;
  }
}

.content_box {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding-left: 8%;
  width: 100%;
  height: 63px;
  background-image: url('../../../../assets/img/activity/driversDay_landing_02.jpg');
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;

  img {
    width: 45%;
    height: 55%;
  }
}
</style>

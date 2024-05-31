<template>
  <div class="box_wrapper">
    <header class="fixed-header">
      <div class="back" @click="$router.push({ path: '/' })"><img src="@/assets/img/back1@2x.png" alt="" /></div>
      <div class="title">万顺福·司机节</div>
      <div class="more"></div>
    </header>

    <div class="banner_box">
      <img src="@/assets/img/activity/driversDay_landing_01.jpg" />
    </div>

    <div class="bottom_box">
      <div v-for="items in list" :key="items.id">
        <div class="content_box">
          <img :src="items.titleImg" />
        </div>
        <div :class="[items.titleImg === '/static/img/jxcsh.1348398.jpg' ? 'transverse_content' : 'itemBox']">
          <div class="transverse_box" v-if="items.titleImg === '/static/img/jxcsh.1348398.jpg'" @click="click(commodityParam)">
            <div class="commodity_img"><img
                src="https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/1.png" /></div>
            <div class="commodity_introduce">
              <div class="commodity_title">{{ '12V不锈钢内胆汽车电热杯 车用热水杯 车载加热杯车载保温杯450m' }} </div>
              <div class="commodity_prince">
                <p>
                  <span>￥</span>
                  28.9
                </p>
                <img src="@/assets/img/activity/goumai.jpg" />
              </div>
            </div>

          </div>
          <!-- <img  src="@/assets/img/activity/driversDay_landing_04.jpg" /> -->
          <div class="item_section" v-for="item in items.commodity" :key="item.id"  @click="click(item)">
            <!-- 商品图片 -->
            <div class="commodity_img"><img :src=item.src /></div>
            <!-- 介绍 -->
            <div class="commodity_introduce">{{ item.title }}</div>
            <!-- 价格 -->
            <div class="commodity_prince">
              <p>
                <span>￥</span>
                {{ item.price }}
                <span v-if="item.type === '0'">&nbsp;起</span>
              </p>
              <img src="@/assets/img/activity/goumai.jpg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commodityParam: { skuId: '166339931071944800' },
      list: [
        {
          titleImg: require('@/assets/img/activity/jxcsh.jpg'),
          commodity: [
            { title: '汽车轮毂刷 车轮钢圈洗车清洗工具 车用清洁刷子轮子美容养护用品', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/2.png', skuId: '166096551838330690', price: '7.9' },
            { title: '车载香水摆件家居无火香薰卫生间持久除味散香空气 清新时光香薰', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/3.png', skuId: '166823548424255560', price: '8.9' },
            { title: '手机磁吸头数据线三合一', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/4.png', skuId: '166382870737346260', price: '13.9' },
            { title: '车载吸尘器汽车车用小型吸尘干湿两用大功率手持式强力迷你强劲A6', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/5.png', skuId: '166251796714640741', price: '34.9' },
          ],
        },
        {
          titleImg: require('@/assets/img/activity/hwsxt.jpg'),
          commodity: [
            { title: '广西武鸣沃柑—柑橘皇后', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/6.png', skuId: '167081940967367380', price: '19.9' },
            { title: '金龙鱼压榨本香菜籽油5L特惠(5L)', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/7.png', skuId: '166757260640152000', price: '104.5' },
            { title: '九华山深山散养土鸡蛋 60枚 (60枚)', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/8.png', skuId: '166653706768349460', price: '68' },
            { title: '燕之坊 七色糙米 1kg（黑米 红米 糙米 糯玉米 小麦仁 燕麦仁 青稞 五谷杂粮 粗粮主食 大米伴侣 ）(1kg)', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/24.jpg', skuId: '166029552463817320', price: '29' },
            { title: '良品铺子 轻奢黑金每日坚果 2023款 750g', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/10.png', skuId: '166859214105756440', price: '110' },
            { title: '金龙鱼酱油醋300ml礼袋', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/11.png', skuId: '166747969733251130', price: '15.9' },
          ],
        },
        {
          titleImg: require('@/assets/img/activity/xnhxj.jpg'),
          commodity: [
            { title: '万顺定制 单片独立包装 一次性口罩 浅蓝色', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/12.png', skuId: '166380968968546040', price: '14.9' },
            { title: '75度酒精湿巾大量80抽独立包装一次性卫生清洁消毒湿纸巾', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/13.png', skuId: '166417807072947100', price: '8.9' },
            { title: '压花纸巾抽纸 抽纸家用便携纸抽大量 餐巾纸6779 YRZ', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/14.png', skuId: '166038135417718510', price: '11.9' },
            { title: '蓝月亮 手洗专用：白兰手洗1kg瓶装+白兰手洗袋500g*2', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/15.png', skuId: '166654340836549590', price: '47.9', type: '0' },
            { title: '梦洁家纺 纯棉印花四件套 锦玉梦韵 1010189016', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/16.png', skuId: '166918527045659980', price: '340' },
            { title: '美的（Midea）电压力锅家用5L双胆大容量电压力煲智能电高压锅MY-YL50M13', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/17.png', skuId: '166892532457558010', price: '335' },
          ],
        },
        {
          titleImg: require('@/assets/img/activity/nltqg.jpg'),
          commodity: [
            { title: '良品铺子 心意礼 礼盒装 928克', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/18.png', skuId: '166858571836256230', price: '68' },
            { title: '四川烟熏麻辣香肠', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/19.png', skuId: '167048882280266740', price: '39.9' },
            { title: '芜湖傻子瓜子（年之味）精品葵瓜子', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/20.png', skuId: '167125074955369130', price: '18.9' },
            { title: '徐福记混合口味酥心糖桶600g', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/21.png', skuId: '166774977598753460', price: '69' },
            { title: '元朗 脆之趣 蛋卷+核桃酥', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/22.png', skuId: '166775209768253510', price: '46.9' },
            { title: '武夷精品岩茶大红袍', src: 'https://wanshunfu-1301582899.cos.ap-guangzhou.myqcloud.com/driverActivity/23.png', skuId: '167128404450567110', price: '78' },
          ],
        },
      ],
    }
  },
  mounted() { },
  methods: {
    click(item) {
      this.$router.push({ path: '/spudetail', query: { id: item.skuId ,type:'driversDay'} })
    }
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

.bottom_box {
  position: relative;
  top: -115px;
  width: 100%;
  min-height: 1500px;
  // background-image: url('../../../../assets/img/activity/beijing_bottom.jpg');
  background-position: center;
  background-size: 100% 1500px;
  background-repeat: no-repeat;
}

.transverse_content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-evenly;
  align-items: center;
  padding: 0px 16px;
  width: 100%;
  height: 552px;
  // background-size: 375px;
  background-image: url('../../../../assets/img/activity/driversDay_landing_03.jpg');
  background-position: center;
  background-size: 100% 552px;
  background-repeat: no-repeat;

  .transverse_box {
    display: flex;
    margin: 0px 5px 5px;
    width: 100%;
    height: 110px;
    background-image: url('../../../../assets/img/activity/driversDay_landing_04.jpg');
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .commodity_img {
      width: 100%;
      height: 100%;
      padding: 5px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .commodity_introduce {
      padding: 0px 10px 0px;
      width: 100%;
      // height: 25%;

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

    .commodity_prince {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 35.5%;
      margin-top: 10px;
      // margin: 10px 0;
      background-image: url('../../../../assets/img/activity/jiage01.png');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      p {
        display: flex;
        align-items: center;
        padding: 0px 0px 0px 5px;
        font-size: 20px;
        color: #ffe5b1;
        text-shadow: 1px 1px 3px #000;
        font-style: italic;

        span {
          display: inline-block;
          font-size: 12px;
          color: #ffe5b1;
          text-shadow: 1px 1px 3px #000;
          font-style: normal;
        }
      }

      img {
        width: 55%;
        height: 100%;
      }
    }
  }

  .item_section {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0px 6px 6px;
    margin-bottom: 10px;
    width: 48%;
    height: 36%;
    background-image: url('../../../../assets/img/activity/driversDay_landing_05.jpg');
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .commodity_prince {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 20%;
      // margin: 10px 0;
      background-image: url('../../../../assets/img/activity/jiage01.png');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      p {
        display: flex;
        align-items: center;
        padding: 0px 0px 0px 5px;
        font-size: 20px;
        color: #ffe5b1;
        text-shadow: 1px 1px 3px #000;
        font-style: italic;

        span {
          display: inline-block;
          font-size: 12px;
          color: #ffe5b1;
          text-shadow: 1px 1px 3px #000;
          font-style: normal;
        }
      }

      img {
        width: 55%;
        height: 100%;
      }
    }

    .commodity_img {
      width: 100%;
      height: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .commodity_introduce {
      padding: 0px 10px 0px;
      width: 100%;
      height: 20%;
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

.itemBox {
  position: relative;
  top: 0px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-evenly;
  align-items: center;
  padding: 0px 16px;
  width: 100%;
  height: 640px;
  // background-size: 375px;
  background-image: url('../../../../assets/img/activity/driversDay_landing_03.jpg');
  background-position: center;
  background-size: 100% 640px;
  background-repeat: no-repeat;

  // background: url(../../../../assets/img/activity/driversDay_landing_03.jpg);
  .transverse_box {
    // margin: 0px;
    width: 100%;
    height: 110px;
    background-image: url('../../../../assets/img/activity/driversDay_landing_04.jpg');
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .item_section {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0px 6px 6px;
    margin-bottom: 10px;
    width: 48%;
    height: 30.5%;
    background-image: url('../../../../assets/img/activity/driversDay_landing_05.jpg');
    background-position: center;
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .commodity_prince {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 20%;
      // margin: 10px 0;
      background-image: url('../../../../assets/img/activity/jiage01.png');
      background-position: center;
      background-size: 100% 100%;
      background-repeat: no-repeat;

      p {
        display: flex;
        align-items: center;
        padding: 0px 0px 0px 5px;
        font-size: 20px;
        color: #ffe5b1;
        text-shadow: 1px 1px 3px #000;
        font-style: italic;

        span {
          display: inline-block;
          font-size: 12px;
          color: #ffe5b1;
          text-shadow: 1px 1px 3px #000;
          font-style: normal;
        }
      }

      img {
        width: 55%;
        height: 100%;
      }
    }

    .commodity_img {
      width: 100%;
      height: 50%;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .commodity_introduce {
      padding: 0px 10px 0px;
      width: 100%;
      height: 20%;
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

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}

.box_wrapper {
  background-color: #df5935;
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
  height: 400px;
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

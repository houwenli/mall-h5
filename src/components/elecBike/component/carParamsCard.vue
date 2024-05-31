<template>
    <div class="tab-details" ref="detailBox">
        <div class="tab-details-contaier">
            <img src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/motorCar/good-param-icon.png" alt="">
            <span>车型参数</span>
        </div>
        <div class="clearfix" style="margin-bottom: 3px">
            <table class="table-border" width="100%">
                <tbody v-if="!showup">
                    <tr v-for="(attribute, index) in getAttrList" :key="index">
                        <td>
                            <span style="color: #999; font-size:11px; transform: scale(0.91);">
                                {{ attribute.attributeName }}
                            </span>
                        </td>
                        <td>
                            <span style="color: #999;font-size:11px; transform: scale(0.91);">{{ attribute.attributeValue }}</span>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="(attribute, index) in getAllAttrList" :key="index">
                        <td>
                            <span style="color: #999;font-size:11px; transform: scale(0.91);">
                                {{ attribute.attributeName }}
                            </span>
                        </td>
                        <td>
                            <span style="color: #999;font-size:11px; transform: scale(0.91);">{{ attribute.attributeValue }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <div v-if="showup || getAllAttrList.length<=7">
                <p class="tip-title">提示</p>
                <p class="tip-content">
                    *续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。*续航里程数值因测试环境不同会有较大差异。理论续航是该产品在骑行者体重70kg，环境温度25°C，时速25km/h等实验室环境下的测试数据。
                </p>
            </div> -->
            <div v-if="getAllAttrList.length > 7" class="activity-desc-tab-btn tab-details-rule" @click="showdown">
                <img :src="showup ? require('@/assets/img/goodsDetail/up_arrow.png'): require('@/assets/img/goodsDetail/down_arrow.png')" alt="">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        spu: {
            type: Object,
            default: () => { }
        }
    },
	mounted(){  
		
	},
    computed: {
		attrList(){
			return [
				{
					attributeName: '使用推荐',
					attributeValue: this.spu.recommendUse
				},
				{
					attributeName: '最高时速',
					attributeValue: this.spu.maxSpeed
				},
				{
					attributeName: '整车重量',
					attributeValue: this.spu.vehicleWeight
				},
				{
					attributeName: '整车尺寸',
					attributeValue: this.spu.vehicleSize
				},
				{
					attributeName: '电机',
					attributeValue: this.spu.electricalMachinery
				},
				{
					attributeName: '定位',
					attributeValue: this.spu.gps
				},
				{
					attributeName: '开锁方式',
					attributeValue: this.spu.unlockMethod
				},
				{
					attributeName: '电池名称',
					attributeValue: this.spu.batteryName
				},
        {
					attributeName: '电池容量',
					attributeValue: this.spu.batteryCapacity
				},
				{
					attributeName: '理论续航',
					attributeValue: this.spu.theoreticalRange
				}
			]
		},
        getAttrList() {
            return this.attrList.slice(0, 7) || []
        },
        getAllAttrList() {
          return this.attrList || []
        }
    },
    data() {
        return {
            showup: false,			
        }
    },
    methods: {
        showdown() {
            this.showup = !this.showup
        },
    }
}
</script>
<style lang="less" scoped>
.tab-details {
  padding: 14px 12px 4px;
  margin: 0;
  .tab-details-contaier {
    font-weight: 400;
    color: #191919;
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    height: 17px;
    box-sizing: border-box;
    img {
      margin-top: 0.5px;
      width: 16px;
      height: 16px;
      height: 100%;
      // vertical-align: middle;
    }
    span {
      height: 17px;
      font-size: 13px;
      line-height: 1;
      margin-top: 5px;
      margin-left: 4px;
    }
  }
  .tab-details-contaier-introduce {
    margin-bottom: 10px;
  }
  .xq_title {
    height: 0.96rem;
    line-height: 0.96rem;

    .xq {
      width: 0.12rem;
      height: 0.56rem;
      margin-top: 0.2rem;
      margin-right: 0.12rem;
      background-color: #e60113;
      border-radius: 0.08rem;
      display: inline-block;
    }

    font-size: 0.6rem;
    font-weight: bold;
    color: #000;
  }

  .xq_spjs {
    font-size: 0.56rem;
    color: #666;
    height: 1.4rem;
    line-height: 1.4rem;
  }
}
.activity-desc-tab-btn {
  margin: 8px auto 4px;
  width: 61px;
  height: 16px;
  border-radius: 8px;
  border: 0.5px solid #979797;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 16px;
    height: 16px;
  }
}
.activity-desc-btn.tab-details-rule {
  margin: 12px auto 0;
}
.tip-title {
  color: #999;
  font-size: 11px;
  line-height: 15px;
  font-weight: bold;
  margin-top: 12px;
}
.tip-content {
  color: #999;
  font-size: 11px;
  line-height: 15px;
  margin-top: 2px;
  text-align: justify;
}
</style>


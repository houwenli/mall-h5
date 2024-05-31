<template>
  <group class="chooseInfo" label-align="left">
    <van-cell
      title="已选"
      is-link
      :value="chosenSpecAndNum"
      value-align="left"
      v-if="spu.sellOut == 1 || spu.stock == 0 || spu.shelvesStatus == 0 || spu.shelvesStatus == 2 || spu.isGift == 1"
      class="address-icon-wrap-cell"
    >
      <!-- 使用 right-icon 插槽来自定义右侧图标 -->
      <template #right-icon>
        <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:6px;height:6px" />
      </template>
    </van-cell>

    <van-cell
      title="已选"
      is-link
      @click.native="openShowBase"
      :value="chosenSpecAndNum"
      value-align="left"
      class="chose-icon-wrap-cell two-line-ellipsis"
      v-else
    >
      <template #right-icon>
        <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:16px; height:16px;margin-top:1px" />
      </template>
    </van-cell>

    <van-cell
      title="送至"
      is-link
      :value="selectAddress || '请选择你的收货地址'"
      value-align="left"
      @click.native="toSelectAddress"
      class="address-icon-wrap-cell aress-icon"
    >
      <div slot="title">
        <div class="address-icon-wrap">送至</div>
      </div>
      <template #right-icon>
        <img src="@/assets/img/goodsDetail/choose_arrow.png" alt="" style="width:16px; height:16px;margin-top:1px" />
      </template>
    </van-cell>
    <van-cell
      value-align="left"
      class="chose-icon-wrap-cell"
      v-if="sku.goodsSource != 5"
      :value="freight.toFixed(2) != 0.0 ? freight.toFixed(2) + '元' : '免运费'"
    >
      <div slot="title">运费</div>
    </van-cell>

    <div class="activity-desc-box" v-if="services.length > 0">
      <div
        :class="[
          'activity-desc',
          newDescBoxHeight > 25 && isUnFold ? 'activity-desc-three-line' : newDescBoxHeight <= 27 ? 'activity-desc-one-line' : 'activity-desc-two-line',
        ]"
        v-if="services"
        ref="descBox"
      >
        <div v-for="(item, index) in services" :key="index" class="activity-desc-contaier">
          <span>
            <img src="@/assets/img/goodsDetail/check.png" alt="" />
          </span>
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
    <!-- 占位查询高度 -->
    <template v-if="true">
      {{ descBoxHeight }}
    </template>
    <div class="activity-desc-btn-contaier" v-if="services && newDescBoxHeight > 51">
      <div class="activity-desc-btn" @click="isUnFold = !isUnFold">
        <img :src="isUnFold ? require('@/assets/img/goodsDetail/up_arrow.png') : require('@/assets/img/goodsDetail/down_arrow.png')" alt="" />
      </div>
    </div>
    <popup-picker
      ref="areasPicker"
      v-show="false"
      @on-change="addressChange"
      :data="areas"
      :columns="3"
      :show.sync="areasShow"
      v-model="addressValue"
      show-name
    ></popup-picker>
    <van-popup v-model="showAddress" round position="bottom">
      <template>
        <div class="addresspop">
          <div class="addresspop-close" @click="addressClose"></div>
          <div class="addresspop-title">
            配送至
          </div>
          <div class="addresspop-content">
            <div class="addresspop-location">
              <div class="addresspop-location__icon"></div>
              <div class="addresspop-location__content">
                <div class="addresspop-location__content-top">
                  <div class="addresspop-location__desc">{{ rePosition ? '上次定位' : '当前定位' }}</div>
                  <div class="addresspop-location__address-detail">{{ positionName }}</div>
                </div>
                <div class="addresspop-location__address" v-if="positionStreet">{{ positionStreet }}</div>
              </div>
              <!--
                UI 3 期暂时注释，UI4期整体完善
                @click.stop="toPosition" -->
              <div class="addresspop-location__retry" style="opacity: 0">重新定位</div>
            </div>
            <div v-if="addressListData.length == 0" class="addresspop-empty">
              <div class="addresspop-empty__flag"></div>
              <div class="addresspop-empty__desc">暂无设置收货地址～</div>
            </div>
            <div v-else class="addresspop-list">
              <div
                v-for="(item, index) in addressListData"
                :key="index"
                class="addresspop-list__every"
                @click="onSelectAddress(item.address + item.detailAddress, item.id, item.address)"
                :class="index == 0 ? 'addresspop-list__every-first' : ''"
              >
                <div :class="activeAddress == item.id ? 'addresspop-list__checked' : 'addresspop-list__check'"></div>
                <div class="addresspop-list__content">
                  <div class="addresspop-list__address-detail">
                    {{ item.detailAddress }}
                  </div>
                  <div class="addresspop-list__address">
                    {{ item.address }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="addresspop-add">
            <div class="addresspop-add__btn" @click="selectOther">
              添加收货地址
            </div>
          </div>
        </div>
      </template>
    </van-popup>
  </group>
</template>

<script>
  import { getToken } from '@/utils/token'
  import popupAddress from './popupAddress.vue'
  import { Cell, Group, PopupPicker } from 'vux'
  import { calculatefreight, queryAllAreas } from '@/api/spudetail'
  import { getLocation } from '@/utils/location'
  import { queryCustomerAddress } from '@/api/customeraddresslist' //查询用户收货地址
  export default {
    components: {
      popupAddress,
      Group,
      PopupPicker,
      Cell,
    },
    data() {
      return {
        areas: [],
        areasShow: false,
        showAddress: false,
        addressValue: [], // 选择省市区的值
        freight: 0, //运费
        newDescBoxHeight: 17,
        isUnFold: false,
        addressInfo: {
          addressName: '',
          address: '',
          provinceId: '',
          cityId: 200,
          countryId: '',
        },
        positionName: '',
        positionStreet: '',
        cityName: '',
        selectAddress: '',
        rePosition: false,
        addressListData: [],
        plugin: [
          {
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 30000, // 超过30秒后停止定位，默认：无穷大
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            showButton: false, // 显示定位按钮，默认：true
            pName: 'Geolocation',
            events: {
              init: (o) => {
                self.GDinit(o, self) // 获取当前位置
              },
            },
          },
        ],
      }
    },
    props: {
      spu: {
        type: Object,
        default: () => {},
      },
      sku: {
        type: Object,
        default: () => {},
      },
      skuId: {
        type: String,
        default: '',
      },
      skuNum: {
        type: [String, Number],
        default: 1,
      },
    },

    computed: {
      // 商品支持的服务
      services() {
        let services = ''
        console.log(this.spu.spuServiceSupports, 'this.spu.spuServiceSupports')
        if (this.spu.spuServiceSupports && this.spu.spuServiceSupports.length > 0) {
          services = this.spu.spuServiceSupports.map((support) => {
            if (support) {
              return support.name
            }
          })
        }
        return services
      },
      //当前选择的规格值和数量
      chosenSpecAndNum() {
        if (!this.sku.skuSpecStr) return
        return this.sku.skuSpecStr.join('，') + `，${this.skuNum}个`
      },
      descBoxHeight() {
        this.$nextTick(() => {
          if (this.$refs.descBox) {
            const height = this.$refs.descBox.scrollHeight
            this.newDescBoxHeight = height
            return height
          }
        })
      },
    },
    created() {
      this.queryCustomerAddress()
      this.getLastAddr()
      this.queryAllAreas()
      let positionAddress = JSON.parse(sessionStorage.getItem('positionAddress'))

      if (positionAddress) {
        this.positionName = positionAddress.positionName
        this.positionStreet = positionAddress.positionStreet

        let reg = /.+?(省|市|自治区|自治州|县|区)/g
        this.cityName = this.positionCityName = positionAddress.cityname

        // this.selectAddress = `${positionAddress.positionStreet}${positionAddress.positionName}`
        this.selectAddress = `${positionAddress.positionStreet}`
        this.selectAddress = this.selectAddress.match(reg).join('')

        this.rePosition = true
        this.activeAddress = -1
        sessionStorage.removeItem('positionAddress')
        localStorage.setItem(
          'positionAddress',
          JSON.stringify({
            selectAddress: this.selectAddress,
            id: -1,
            cityName: this.cityName,
            positionStreet: this.positionStreet,
            positionName: this.positionName,
            positionCityName: this.positionCityName,
          })
        )
        this.calculateFreight()
      }
    },
    mounted() {
      // 获取定位
      this.getPositon()
    },

    methods: {
      getPositon() {
        let that = this
        getLocation(true).then((result) => {
          console.log(result, 'result===========================a')
          let { province, city, district, township, neighborhood, areaCode, longitude, latitude } = result
          if (!(JSON.parse(localStorage.getItem('positionAddress')) || {}).positionStreet) {
            that.longitude = longitude
            that.latitude = latitude
            that.positionStreet = `${province}${city}${district}${township}`
            that.positionName = `${neighborhood}`
            that.positionCityName = areaCode.slice(0, 4) + '00'
            that.selectAddress = `${province},${city},${district}`
            that.cityName = areaCode.slice(0, 4) + '00'
            that.calculateFreight()
          }
          // 定位经纬度
          if (!JSON.parse(localStorage.getItem('posiotionLonAndLat'))) {
            let posiotionLonAndLat = {
              lat: latitude,
              lng: longitude,
              areaCode: areaCode,
            }
            localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
          }
        })
      },
      // 查询当前经纬度
      GDinit(o) {
        let that = this
        console.log(o, 'o=====================1')
        o.getCurrentPosition((status, result) => {
          console.log(status, result, 'o=====================2')
          if (status === 'complete' && result.info === 'SUCCESS') {
            if (!(JSON.parse(localStorage.getItem('positionAddress')) || {}).positionStreet) {
              that.longitude = result.position.getLng()
              that.latitude = result.position.getLat()
              let { province, city, district, township, neighborhood, adcode } = result.addressComponent
              that.positionStreet = `${province}${city}${district}${township}`
              that.positionName = `${neighborhood}`
              that.positionCityName = adcode.slice(0, 4) + '00'
              let reg = /.+?(省|市|自治区|自治州|县|区)/g

              that.selectAddress = result.formattedAddress.match(reg)
              that.selectAddress = that.selectAddress.join('')

              that.cityName = adcode.slice(0, 4) + '00'
              that.calculateFreight()
            }
            // 定位经纬度
            if (!JSON.parse(localStorage.getItem('posiotionLonAndLat'))) {
              let { lat, lng } = result.position
              let posiotionLonAndLat = {
                lat,
                lng,
                areaCode: result.addressComponent.adcode,
              }
              localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
            }
            //获取定位地址填入默认送货地址
            // this.setLocationAdress(result.addressComponent)
          } else {
            console.log(status, result, 'eeeeeeeeeeeeeeeeeeeew')
            // Toast('定位失败,请刷新后重试')
          }
        })
      },
      // 查询所有的省市区
      queryAllAreas() {
        queryAllAreas().then((res) => {
          this.addressValue = []
          this.areas = res || []
          // if (this.addressValue && this.addressValue.length > 0) {
          // 计算运费
          this.calculateFreight()
          // }
        })
      },
      // 地区发生改变
      addressChange(val) {
        console.log(val)
        // 当选择地址为空的时候不执行下面的方法
        if (!val || (val && val.length == 0)) {
          return false
        }
        // 计算运费
        this.activeAddress = -2
        this.cityName = this.addressValue[1]
        let reg = /.+?(省|市|自治区|自治州|县|区)/g
        this.selectAddress = this.$refs.areasPicker.getNameValues()
        this.selectAddress = this.selectAddress.match(reg).join('')

        this.areasShow = false
        localStorage.setItem(
          'positionAddress',
          JSON.stringify({
            selectAddress: this.selectAddress,
            id: -2,
            cityName: this.cityName,
            positionStreet: this.positionStreet,
            positionName: this.positionName,
            positionCityName: this.positionCityName,
          })
        )
        this.calculateFreight()
      },
      // 查询用户地址
      queryCustomerAddress() {
        if (getToken()) {
          queryCustomerAddress().then((res) => {
            this.addressListData = res || []
          })
        }
      },
      //   选择地址
      onSelectAddress(val, id, cityName) {
        let reg = /.+?(省|市|自治区|自治州|县|区)/g
        let adress = val.match(reg)
        this.selectAddress = adress.join('')
        this.activeAddress = id
        if (id != -1) {
          this.cityName = cityName.split(',')[1]
        } else {
          this.cityName = cityName
        }
        localStorage.setItem(
          'positionAddress',
          JSON.stringify({
            selectAddress: val,
            id,
            cityName: this.cityName,
            positionStreet: this.positionStreet,
            positionName: this.positionName,
            positionCityName: this.positionCityName,
          })
        )
        this.calculateFreight()
        this.showAddress = false
      },
      getLastAddr() {
        let address = JSON.parse(localStorage.getItem('positionAddress'))
        if (address) {
          this.activeAddress = address.id
          let reg = /.+?(省|市|自治区|自治州|县|区)/g
          let adress = address.selectAddress.match(reg)
          this.selectAddress = adress.join('')
          // this.selectAddress = address.selectAddress,
          this.cityName = address.cityName
          this.positionStreet = address.positionStreet
          this.positionName = address.positionName
          this.positionCityName = address.positionCityName
        }
      },
      // 显示规格值弹窗
      openShowBase() {
        this.$emit('openShowBase')
      },
      selectedCity(data) {
        let { address, provinceId, cityId, countryId } = data.data
        this.addressInfo.addressName = address
        this.addressInfo.address = address
        this.addressInfo.provinceId = provinceId
        this.addressInfo.cityId = cityId
        this.addressInfo.countryId = countryId
        this.selectFreight()
      },
      // 计算运费
      calculateFreight() {
        let addressValue = ''
        for (const item of this.areas) {
          if (this.cityName == item.name || this.cityName == item.cityCode || this.cityName == item.value) {
            addressValue = item.value.split('-')[1]
            break
          }
        }
        console.log(this.spu.id, this.spu.storeId, addressValue, this.skuNum, '计算运费')
        addressValue &&
          calculatefreight(this.spu.spuId, this.spu.storeId, addressValue, this.skuNum).then((res) => {
            this.freight = res.data || 0
          })
      },
      //   显示地址弹窗
      toSelectAddress() {
        this.showAddress = true
      },
      //   添加收货地址
      showCitySelect() {
        this.showAddressModal = false
        this.showSelect = true
      },
      addressClose() {
        this.showAddress = false
      },
      selectOther() {
        this.showAddress = false
        this.areasShow = true
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/spudetail.less';
  @import '~@/components/spus/imgUi.less';
  .addresspop {
    background-color: #f6f6f6;
    height: 522px;
    overflow: hidden;
    position: relative;
    &-close {
      width: 27px;
      height: 20px;
      background-size: 100% 100%;
      background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-close-2x.png);
      position: absolute;
      right: 12px;
      top: 12px;
    }
    &-title {
      text-align: center;
      font-size: 16px;
      line-height: 46px;
    }
    &-content {
      position: absolute;
      top: 46px;
      bottom: 82px;
      left: 0;
      right: 0;
      overflow: scroll;
    }
    &-location {
      width: 351px;
      height: 65px;
      background-color: #ffffff;
      margin: 0 auto;
      display: flex;
      align-items: center;
      border-radius: 12px;
      padding: 12px 0;
      &__icon {
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-location-2x.png);
        margin: 10px;
      }
      &__content {
        width: 257px;
      }
      &__content-top {
        display: flex;
        align-items: center;
      }
      &__desc {
        width: 48px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 2px;
        background-color: rgba(255, 231, 235, 0.5);
        font-size: 10px;
        color: #ff0a35;
        display: flex;
        align-items: center;
      }
      &__address-detail {
        width: 205px;
        line-height: 20px;
        color: #191919;
        font-size: 16px;
        font-weight: bold;
        margin: 0 0 0 4px;
      }
      &__address {
        width: 257px;
        line-height: 17px;
        font-size: 13px;
        color: #999;
        margin: 4px 0 0 0;
      }
      &__retry {
        font-size: 10px;
        color: #ff0a35;
        margin: 0 0 0 10px;
      }
    }
    &-list {
      width: 351px;
      background-color: #ffffff;
      margin: 10px auto 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-radius: 12px;
      padding: 12px 0;
      &__every {
        width: 100%;
        display: flex;
        align-items: center;
        margin: 20px 0 0;
      }
      &__every-first {
        margin-top: 0;
      }
      &__check {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #c3c3c3;
        margin: 10px;
      }
      &__checked {
        width: 16px;
        height: 16px;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-selected-2x.png);
        margin: 10px;
      }
      &__content {
        width: 307px;
      }
      &__address-detail {
        width: 100%;
        line-height: 20px;
        font-size: 16px;
        font-weight: bold;
        color: #191919;
      }
      &__address {
        width: 100%;
        font-size: 13px;
        color: #999999;
        margin-top: 4px;
      }
    }
    &-add {
      width: 100%;
      padding: 4px 0 38px;
      background-color: #fff;
      position: absolute;
      left: 0;
      bottom: 0;
      &__btn {
        width: 351px;
        height: 40px;
        line-height: 40px;
        background-image: linear-gradient(90deg, rgba(255, 95, 46, 1) 0, rgba(255, 10, 53, 1) 100%);
        border-radius: 20px;
        margin: 0 auto;
        text-align: center;
        color: #fff9e9;
        font-size: 16px;
      }
    }
    &-empty {
      &__flag {
        width: 160px;
        height: 160px;
        margin: 72px auto 0;
        background-size: 100% 100%;
        background-image: url(https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/address/address-blank-2x.png);
      }
      &__desc {
        line-height: 17px;
        font-size: 13px;
        text-align: center;
        color: #444444;
        margin-top: 8px;
      }
    }
  }
</style>

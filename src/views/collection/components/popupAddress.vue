<template>
  <van-popup v-model="value" round position="bottom">
    <template>
      <div class="addresspop">
        <div class="addresspop-close" @click="addresspopClose"></div>
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
</template>

<script>
  export default {
    data() {
      return {
        property: 'value',
        rePosition: false,
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      addresspopClose() {
        this.$emit('addressClose')
      },
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
    },
  }
</script>

<style lang="less" scoped></style>

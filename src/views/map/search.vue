<template>
  <div class="contentBox">
    <navbartop :title="'定位地址'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    <van-search v-model="searchValue" class="search-box" autofocus show-action @input="onInput" placeholder="小区/写字楼/学校等">
      <template #label>
        <div class="now-city" @click="$router.push({ name: 'selectCity' })">
          {{ cityName }}
          <div class="now-city-icon"></div>
        </div>
      </template>
      <template #left-icon>
        <img class="icon-search" src="@/assets/img/search_grey@2x.png" alt="" />
      </template>
      <template #action>
        <div @click="cancel">取消</div>
      </template>
    </van-search>

    <div class="search-result" v-if="!searchValue">
      <dl class="searchKeywordsBox">
        <p class="textStyle">
          搜索历史
          <a class="delWords" @click="confirm"></a>
        </p>
        <dd v-if="historyData.length > 0" class="keywordsList" :class="isMore ? '' : 'pack-up'">
          <div v-for="(item, index) in historyData" :key="index" class="keywordItem">
            <div class="keywordItem_content" @click="selectAddr(item)">{{ item.name }}</div>
          </div>
          <div v-if="allhistoryData.length > 8" class="keywordItem item more" :class="{ iconupDown: iconupDown == 1 ? 'classDown' : 'classup' }">
            <img src="@/assets/img/up.png" alt class="iconImg" v-if="isMore" @click="packUpMore(2)" />
            <img src="@/assets/img/down.png" alt class="iconImg" v-else @click="packUpMore(1)" />
          </div>
        </dd>
        <p v-else class="no-history">暂无搜索记录</p>
      </dl>
    </div>
    <ul class="search-result" v-else>
      <li class="result-item" v-for="(item, index) in searchList" :key="index" @click="selectAddr(item)">
        <div class="adr-name">{{ item.name }}</div>
        <div class="adr-street">{{ item.address }}</div>
      </li>
    </ul>
    <SecondConfirm
      :title="'操作提示'"
      :cancleText="'取消'"
      :sureText="'确认'"
      :textp="'确定删除记录？'"
      :textshow="true"
      :dialogshow="dialogshow"
      @closeBack="dialogshow = false"
      @rightEvent="onConfirm"
    ></SecondConfirm>
  </div>
</template>

<script>
  import { Search } from 'vant'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import { debounce } from '@/utils/utils'
  import navbartop from '@/components/commons/navBartop'
  export default {
    name: 'mapSearch',
    components: {
      // [Dialog.name]: Dialog,
      [Search.name]: Search,
      SecondConfirm,
      navbartop
    },
    props: {
      cityName: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        tabSelected: 0, //tab选中  0 宝贝   1 店铺
        searchValue: this.$route.query.queryString || '', // 搜索的内容
        historyData: [], // 搜索历史数据
        allhistoryData: [], // 所有历史数据
        isMore: false,
        iconupDown: 1,
        searchList: [],
        dialogshow: false,
        autoComplete: null,
      }
    },
    watch: {
      cityName: {
        handler() {
          let autoOptions = {
            //city 限定城市，默认全国
            city: this.cityName,
            datatype: 'all',
          }
          this.autoComplete = new AMap.Autocomplete(autoOptions)
        },
        immediate: true,
      },
    },

    created() {
      this.queryHistorySpu()
    },
    methods: {
      onInput: debounce(
        function() {
          this.autoComplete.search(this.searchValue, (status, result) => {
            // 搜索成功时，result即是对应的匹配数据
            if (result.info == 'OK') {
              this.searchList = result.tips
            } else {
              this.searchList = []
            }
          })
        },
        500,
        false
      ),
      // 是否删除
      confirm() {
        this.dialogshow = true
      },
      // 超过10条数据展开收起
      packUpMore(num) {
        this.isMore = this.isMore ? !this.isMore : true
        if (num === 1) {
          this.iconupDown = 1
          this.historyData = this.allhistoryData
        } else {
          this.iconupDown = 2
          this.queryHistorySpu()
        }
      },
      // 查询商品搜索历史
      queryHistorySpu() {
          this.allhistoryData = JSON.parse(localStorage.getItem('map_histore_search')) || []
          if (this.allhistoryData.length > 8) {
            this.historyData = this.allhistoryData.slice(0, 8)
          } else {
            this.historyData = this.allhistoryData
          }
      },
      onConfirm() {
        this.historyData = []
        // 清除历史记录
        localStorage.removeItem('map_histore_search')
        this.dialogshow = false
      },
      // 将商品放入搜索历史
      putSpuToHistory(item) {
        // 加入搜索历史
        if (item) {
          let searchHistory = JSON.parse(localStorage.getItem('map_histore_search')) || []
          // 存在搜索纪录

          // 判断当前搜索的词是否已经在历史纪录中
          let index = searchHistory.findIndex((val) => {
            return val.id === item.id
          })
          if (index >= 0) {
            searchHistory.splice(index, 1)
            searchHistory.unshift(item)
          } else {
            searchHistory.unshift(item)
          }
          searchHistory = JSON.stringify(searchHistory)

          localStorage.setItem('map_histore_search', searchHistory)
        }
      },
      selectAddr(item) {
        console.log(item);
        let { adcode, district, name, address, location } = item       
        let positionName = {
          positionName: name,
          // positionStreet: `${district}${address}`,
          positionStreet: `${district}`,
          cityname: adcode.slice(0,4) + '00',
        }
        this.putSpuToHistory(item)
        sessionStorage.setItem('positionAddress', JSON.stringify(positionName))
        let posiotionLonAndLat = {
          lat: location.lat,
          lng: location.lng,
          areaCode: adcode
        }
        localStorage.setItem('posiotionLonAndLat', JSON.stringify(posiotionLonAndLat))
        this.$router.go(-2)
      },
      cancel() {
        if (this.searchValue) {
          this.searchValue = ''
        } else {
          this.$router.go(-1)
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .contentBox {
    padding: 12px;
    background: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .search-result {
    flex: 1;
    overflow-y: scroll;
  }
  .searchBox {
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    .backleft {
      margin: 0 10px;
      width: 24px;
      height: 24px;
      .searchLeft {
        width: 24px;
        height: 24px;
      }
    }
    .inputBox {
      height: 35px;
      border-radius: 18px;
      font-size: 14px;
      flex: 1;
      position: relative;
      margin-right: 10px;
      background: url('~@/assets/img/search_grey@2x.png') no-repeat 8px center #f2f2f2;
      background-size: 24px;
      .searchinput {
        position: absolute;
        top: 0;
        left: 35px;
        width: 235px;
        height: 100%;
        background-color: #f2f2f2;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        &::-webkit-input-placeholder {
          color: #999;
        }
      }
    }
    .searchIcon {
      width: 40px;
      height: 40px;
      line-height: 40px;
      margin-right: 10px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #000;
      font-weight: 400;
    }
  }
  .searchKeywordsBox {
    padding: 30px 0 30px 0;
    overflow: hidden;
    .pack-up {
      height: 82.5px;
    }
    .keywordsList {
      padding-right: 10px;
      width: 100%;
      .keywordItem {
        max-width: 221px;
        border-radius: 14px;
        padding: 0 13px;
        float: left;
        margin: 8px 6px 0 0;
        height: 28px;
        line-height: 28px;
        background: #f2f2f2;
        .keywordItem_content {
          max-width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          text-align: center;
          color: #666;
        }
      }
      .more {
        position: relative;
        margin: 10px 10px 0 0;
        height: 30px;
        width: 30px;
        background: #f2f2f2;
        font-size: 13px;
        line-height: 31.25px;
        padding: unset;
        text-align: center;
        color: #666;
        border-radius: 15px;
        .iconImg {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -6px;
          margin-left: -6px;
          width: 12px;
          height: 12px;
          fill: currentColor;
          overflow: hidden;
        }
      }
    }
  }
  .textStyle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 3px;
    color: #000;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .delWords {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('~@/assets/img/delete.png') no-repeat center;
    background-size: 100%;
    // position: absolute;
    // top: 1px;
    // right: 0;
  }
  .no-history {
    font-size: 12px;
    color: #999;
  }
  .search-result {
    .result-item {
      position: relative;
      &::after {
        position: absolute;
        bottom: 0;
        left: -50%;
        display: block;
        content: '';
        height: 1px;
        width: 200%;
        background-color: #ebebeb;
        transform: scale(0.5);
      }
      .adr-name {
        color: #000;
        font-size: 16px;
        line-height: 24px;
      }
      .adr-street {
        padding-top: 4px;
        font-size: 14px;
        color: #666;
        padding-bottom: 10px;
      }
      .adr-street,
      .adr-name {
        width: 311px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .search-box {
    padding: 6px 0;
    .icon-search {
      width: 24px;
      height: 24px;
    }
    /deep/ .van-field__control {
      color: #999;
    }
    /deep/.van-search__label {
      padding: 0 10px 0 0;
    }
    /deep/ .van-cell {
      line-height: 24px;
    }
    /deep/ .van-field__left-icon {
      width: 24px;
      height: 24px;
    }
    /deep/ .van-cell--borderless {
      padding: 0;
      align-items: center;
      height: 32px;
    }
    /deep/ .van-field__control {
      color: #999;
    }
    /deep/ .van-search__content {
      height: 32px;
      border-radius: 16px;
      background-color: #ededed;
    }
    /deep/ .van-search__action {
      padding: 0 4px 0 13px;
    }
  }
</style>

<template>
  <div class="content">
    <navbartop :title="'定位地址'" @clickBack="$router.go(-1)" :isConfirm="true" class="navtop"></navbartop>
    <van-search v-model.trim="searchValue" class="search-box" autofocus show-action @input="onInput" placeholder="请输入城市名进行搜索">
      <template #left-icon>
        <img class="icon-search" src="@/assets/img/search_grey@2x.png" alt="" />
      </template>
      <template #action>
        <div @click="cancel">取消</div>
      </template>
    </van-search>
    <div v-show="!searchValue">
      <div class="position-city">
        <p class="city-tips">当前定位城市</p>
        <div @click="selectCity(positionCity, 1)">
          <svg t="1671761266122" class="icon" viewBox="0 0 1069 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4816" width="200" height="200">
            <path
              d="M518.649351 861.755844s316.509091-271.293506 316.509091-553.225974C832.498701 138.306494 691.532468 0 518.649351 0S202.14026 138.306494 202.14026 308.52987c0 292.571429 316.509091 553.225974 316.509091 553.225974zM345.766234 316.509091c0-95.750649 77.132468-172.883117 172.883117-172.883117S691.532468 220.758442 691.532468 316.509091s-77.132468 172.883117-172.883117 172.883117-172.883117-79.792208-172.883117-172.883117z"
              fill="#e60113"
              p-id="4817"
            ></path>
            <path
              d="M768.664935 694.192208c-21.277922 26.597403-39.896104 53.194805-61.174026 74.472727 220.758442 13.298701 268.633766 58.514286 279.272727 82.451948-10.638961 26.597403-159.584416 90.431169-454.815584 90.431169-295.231169 2.65974-444.176623-63.833766-452.155844-87.771429 7.979221-21.277922 42.555844-63.833766 244.696104-79.792207-18.618182-21.277922-39.896104-47.875325-61.174026-74.472728C98.41039 718.12987 0 758.025974 0 851.116883c0 135.646753 335.127273 170.223377 534.607792 170.223377 199.480519 0 534.607792-37.236364 534.607792-170.223377 0-98.41039-122.348052-140.966234-300.550649-156.924675z"
              fill="#e60113"
              p-id="4818"
            ></path>
          </svg>
          <span class="position-city-name">{{ positionCity }}</span>
        </div>
      </div>
      <div class="history-city">
        <div>
          <dl class="searchKeywordsBox">
            <p class="textStyle city-tips">
              历史访问城市
              <a class="delWords" @click="confirm"></a>
            </p>
            <dd v-if="historyData.length > 0" class="keywordsList" :class="isMore ? '' : 'pack-up'">
              <div v-for="(item, index) in historyData" :key="index" class="keywordItem">
                <div class="keywordItem_content" @click="selectCity(item, 2)">{{ item }}</div>
              </div>
              <div v-if="allhistoryData.length > 8" class="keywordItem item more" :class="{ iconupDown: iconupDown == 1 ? 'classDown' : 'classup' }">
                <img v-if="isMore" src="@/assets/img/up.png" alt class="iconImg" @click="packUpMore(2)" />
                <img v-else src="@/assets/img/down.png" alt class="iconImg" @click="packUpMore(1)" />
              </div>
            </dd>
            <p v-else class="no-history">暂无搜索记录</p>
          </dl>
        </div>
      </div>
      <div class="divider"></div>
      <van-index-bar class="index-bar" :index-list="indexList">
        <template v-for="item in cityList">
          <van-index-anchor :key="item.index" :index="item.firstPin" />
          <van-cell v-for="val in item.cityList" :key="val.id" :title="val.name" @click="selectCity(val.name, 1)" />
        </template>
      </van-index-bar>
    </div>
    <ul class="search-result" v-if="searchValue">
      <li class="result-item" v-for="(item, index) in searchList" :key="index" @click="selectCity(item.name, 2)">
        <div class="adr-name">{{ item.name }}</div>
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
  import { queryAllAreas } from '@/api/spudetail'
  import { IndexBar, IndexAnchor, Search } from 'vant'
  import SecondConfirm from '@/components/commons/SecondConfirm'
  import { debounce } from '@/utils/utils'
  import { queryAllCity } from '@/api/spudetail'
  import navbartop from '@/components/commons/navBartop'
  export default {
    name: 'selectCity',
    components: {
      [IndexBar.name]: IndexBar,
      [IndexAnchor.name]: IndexAnchor,
      [Search.name]: Search,
      SecondConfirm,
      navbartop
    },
    props: {
      cityName: {
        type: String,
        default: '',
      },
      positionCity: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        // indexList: ['B'],
        historyData: [],
        searchList: [],
        cityList: [],
        searchValue: '',
        dialogshow: false,
        isMore: false,
        iconupDown: 1,
      }
    },
    computed: {
      indexList() {
        return this.cityList.map((item) => {
          return item.firstPin
        })
      },
    },
    created() {
      this.queryAllCity()
    },
    activated() {
      this.queryHistorySpu()
    },
    methods: {
      async queryAllCity() {
        try {
          let res = await queryAllCity()
          if (res.code === 200) {
            this.cityList = res.data
          }
        } catch (error) {
          console.log(error)
        }
      },
      // 是否删除
      confirm() {
        this.dialogshow = true
      },
      onInput: debounce(
        function() {
          if (!this.searchValue) {
            return false
          }
          this.searchList = []
          this.cityList.forEach((item) => {
            item.cityList.forEach((val) => {
              if (val.name.indexOf(this.searchValue) >= 0) {
                this.searchList.push(val)
              }
            })
          })
        },
        400,
        false
      ),
      onConfirm() {
        this.historyData = []
        localStorage.removeItem('selectCity_histore_search')
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
        let spus = localStorage.getItem('selectCity_histore_search')
        if (spus) {
          this.historyData = spus.split(',').filter((spu) => spu != '')
          this.allhistoryData = this.historyData.reverse().slice(0, 20)
          let data = this.historyData
          if (this.allhistoryData.length > 8) {
            this.historyData = data.slice(0, 8)
          } else {
            this.historyData = data
          }
          // this.historyData = this.historyData.reverse().slice(0, 20)
        }
      },
      // 搜索
      // 将商品放入搜索历史
      putSpuToHistory(name) {
        // 加入搜索历史
        let searchHistory = localStorage.getItem('selectCity_histore_search')
        // 存在搜索纪录
        if (searchHistory) {
          // 判断当前搜索的词是否已经在历史纪录中
          let arr = searchHistory.split(',')
          let index = arr.indexOf(name)
          if (index >= 0) {
            arr.splice(index, 1)
            arr.push(name)
          } else {
            arr.push(name)
          }
          searchHistory = arr.join(',')
        } else {
          searchHistory = name + ','
        }
        localStorage.setItem('selectCity_histore_search', searchHistory)
      },
      selectCity(name, type) {
        this.$emit('update:cityName', name)
        this.putSpuToHistory(name)
        this.$router.back({
          name: 'chooseMap',
        })
      },
      cancel() {
        if (this.searchValue) {
          this.searchValue = ''
        } else {
          this.$router.back({
            name: 'chooseMap',
          })
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  .content {
    background-color: #fff;
    min-height: 100%;
    .divider {
      margin-top: 12px;
      height: 12px;
      background: #ededed;
    }
    .city-tips {
      font-size: 12px;
      color: #999;
      line-height: 20px;
    }
    .position-city {
      padding: 0 12px;
    }
    .position-city-name {
      margin-left: 4px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
    }
    .history-city {
      padding: 0 12px;
      margin-top: 20px;
    }
    .searchKeywordsBox {
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
          float: left;
          margin: 8px 6px 0 0;
          height: 30px;
          background: #f2f2f2;
          .keywordItem_content {
            max-width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            padding: 8px 13px 7px;
            font-size: 12px;
            line-height: 12px;
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
    }
    .no-history {
      font-size: 12px;
      color: #999;
    }
    .index-bar {
      padding: 0 12px;
      /deep/ .van-index-anchor {
        padding: 0;
      }
      /deep/ .van-cell {
        padding: 12px 0;
        &::after {
          right: 0;
          left: 0;
        }
      }
      /deep/ .van-index-bar__sidebar {
        right: 12px;
        padding: 5px 0;
        background-color: #ededed;
        border-radius: 10px;
        .van-index-bar__index {
          padding: 3px;
          color: #999;
          font-size: 10px;
        }
        .van-index-bar__index--active {
          color: #fd302c;
        }
      }
    }
  }
  .search-box {
    padding: 6px 12px;
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
  .no-history {
    font-size: 12px;
    color: #999;
  }
  .search-result {
    padding: 12px;
    .result-item {
      margin-top: 8px;
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
        padding-bottom: 8px;
        color: #000;
        font-size: 12px;
        line-height: 24px;
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
</style>

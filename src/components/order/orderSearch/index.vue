<template>
  <div class="contentBox">
    
    <header-search @toBack="toBack"></header-search>

    <div class="searchBox">
      <div class="inputBox">
        <input ref="search" v-model.trim="searchValue" type="text" class="searchinput" :placeholder="placeholderText ? placeholderText : '输入商品名称/订单编号'" maxlength="30" />
        <div class="right-btn" v-if="searchValue"  @click="clearIcon">
          <img class="right" src="https://wsjc-web-1301582899.cos.ap-guangzhou.myqcloud.com/wsf-mall/home/search_delete.png" />     
        </div>
      </div>
      <div class="searchIcon" @click="toSearch()">搜索</div>
    </div>

    <div v-if="historyData.length > 0">
      <dl class="searchKeywordsBox">
        <p class="textStyle">
          最近搜索
          <a class="delWords" @click="confirm"></a>
        </p>
        <dd class="keywordsList">
          <div v-for="(item, index) in historyData" :key="index" class="keywordItem">
            <div class="keywordItem_content" @click="toHistorySearch(item)">{{ item }}</div>
          </div>         
        </dd>
        <!-- <p v-else class="no-history">暂无搜索记录</p> -->
        <div class="search-shade"></div>
      </dl>
    </div>
    <!-- 轮播 -->  
    <div class="swiper-box" v-else>
      <swipe v-if="swipeConfig && swipeConfig.list && swipeConfig.list.length > 0" :config="swipeConfig"></swipe>
    </div>
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
	import swipe from '@/components/index/template/swipe/index.vue'
	import navbartop from '@/components/commons/navBartop'
	import SecondConfirm from '@/components/commons/SecondConfirm'
	import headerSearch from './headerSearch.vue'
	import {  Toast } from 'vant'
    import { queryPersonConfigTemp } from '@/api/home'
	export default {
		name: 'searchPath',
		components: { SecondConfirm, navbartop, headerSearch,	[Toast.name]: Toast, swipe },
		data() {
		return {      
			searchValue: this.$route.query.queryString || '', // 搜索的内容
			historyData: [], // 搜索历史数据      
			dialogshow: false,
			placeholderText: '',
			swipeConfig: null,
		}
		},
		created() {
			this.queryPersonConfigTemp()
			this.queryHistorySpu()
		},
		mounted() {
			this.$nextTick(function() {
				this.placeholderText = this.$route.query.placeholderText
				this.$refs.search.focus()
			})
		},
		methods: {
			// 查询轮播配置
			queryPersonConfigTemp(){
				queryPersonConfigTemp(104).then(res=>{
				if(res.code==200){
					let swipeConfigswipeConfig  = JSON.parse(res.data.content) || {}
					this.swipeConfig = swipeConfigswipeConfig.contentList[0] || null
          // 过滤掉没有图片的轮播
          if (this.swipeConfig && this.swipeConfig.list && this.swipeConfig.list.length > 0) {
            this.swipeConfig.list = this.swipeConfig.list.filter((item) => {
              return item.url
            })
          }
				} else {
					this.swipeConfig = null
				}
				}).catch(()=>{
					this.swipeConfig = null
				})
			},
			clearIcon(){
				this.searchValue = ''
			},
			toBack() {                
				this.$router.go(-1)       
			},
			// 是否删除
			confirm() {
				this.dialogshow = true
			},     
			// 查询商品搜索历史
			queryHistorySpu() {
				let spus = localStorage.getItem(this.$route.query.from + 'order_histore_search_spu')
				if (spus) {
					this.historyData = spus.split(',').filter((spu) => spu != '')         
					let data = this.historyData         
					this.historyData = data.reverse().slice(0, 40)                  
				}
			},    
			onConfirm() {
				this.historyData = []
				// 当前选中的是商品 则清除商品数据      
				localStorage.removeItem(this.$route.query.from + 'order_histore_search_spu')        
				this.dialogshow = false
			},
			// 历史搜索
			toHistorySearch(value) {
				this.searchValue = value
				this.toSearch()
			},
			// 搜索     
			toSearch() {
				if(!this.searchValue && this.placeholderText){
					this.searchValue = this.placeholderText
				}
				if(this.searchValue){
					// 搜索商品		
					this.putSpuToHistory()
					let query = {
						queryString: this.searchValue       
					}			
					this.$router.replace({
						path: '/orderSearchList',
						query
					})	
				} else {          
					Toast('搜索内容不能为空');         
				}
			},
			// 将商品放入搜索历史
			putSpuToHistory() {
				// 加入搜索历史
				if (this.searchValue) {
					let searchHistory = localStorage.getItem(this.$route.query.from + 'order_histore_search_spu')
					// 存在搜索纪录
					if (searchHistory) {
						// 判断当前搜索的词是否已经在历史纪录中
						let arr = searchHistory.split(',')
						let index = arr.indexOf(this.searchValue)
						if (index >= 0) {
							arr.splice(index, 1)
							arr.push(this.searchValue)
						} else {
							arr.push(this.searchValue)
						}
						searchHistory = arr.join(',')					
					} else {
						searchHistory = this.searchValue + ','
					}
					localStorage.setItem(this.$route.query.from + 'order_histore_search_spu', searchHistory)
				}
			},          
		},
	}
</script>

<style scoped lang="less">
  .contentBox {
    background: #F6F6F6;
    height: 100vh;
  }
  .searchBox {
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    height: 50px;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
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
      height: 32px;
      border-radius: 18px;
      font-size: 14px;
      // width: 100%;
      flex: 1;
      position: relative;
      margin-right: 6px;
      background: url('~@/assets/img/search_grey@2x.png') no-repeat 8px center #f2f2f2;
      background-size: 24px;
      .searchinput {
        position: absolute;
        top: 0;
        left: 35px;
        width: 223px;
        height: 100%;
        background-color: #f2f2f2;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000;
        &::-webkit-input-placeholder {         
          color: #C6C6C6;          
        }
      }
      .right-btn{
        position: absolute;
        display: flex;
        align-items: center;      
        right: 10px;  
        height: 100%;  
        .right{
          width: 16px;
          height: 16px;
          display: block;          
        }
      }
    }
    input.searchinput {
      caret-color: rgba(255, 15, 54, 1);
    }
    .searchIcon {
      width: 54px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      margin: 6px 0;      
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #FFFFFF;
      font-weight: 400;
      background: linear-gradient(90deg, #FF6B4E 0%, #FF0A35 100%);
      border-radius: 19px;
    }
  }
  .searchKeywordsBox {
    padding: 20px 16px 20px 12px;
    overflow: hidden;
    max-height: 290px;
    position: relative;
    background: #FFFFFF;
    border-radius: 0px 0px 12px 12px;
    .keywordsList {
      padding-right: 10px;
      width: 100%;
      // margin-top: 12px;
      .keywordItem {
        // max-width: 221px;
        max-width: 100%;
        border-radius: 14px;
        float: left;
        margin: 12px 12px 0 0;
        height: 26px;
        background: #f2f2f2;
        .keywordItem_content {
          max-width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
          padding: 4px 12px;
          font-size: 12px;
          // line-height: 26px;
          text-align: center;
          color: #111111;
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
    .search-shade{
      width: 100%;
      position: absolute;
      bottom:0;
      left: 0;
      height: 20px;
      background: #fff;
      border-radius: 0px 0px 12px 12px;
    }
  }
  .textStyle {
    display: flex;
    justify-content: space-between;
    align-items: center;  
    color: #000;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    position: relative;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  .delWords {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url('https://wsjc-web.wsecar.com/wsf-mall/home/search-delete-icon.png') no-repeat center;
    background-size: 100%;
  }
  .swiper-box {
    margin-top: 10px;
  }
  /deep/ .swipe {  
    margin: 0 8px !important;
    img {
      border-radius: 12px;
    }
  }
 
  // .no-history {
  //   font-size: 12px;
  //   color: #999;
  // }
</style>

<template>
  <div>

    <group class="search-group">
      <div class="search-left-arrow" @click="goBack()"></div>
      <x-input placeholder="请输入搜索关键字" v-model="searchValue" class="search-input" style="margin-left: 0"
               @click.native="toSearch">
        <i class="weui-icon-search" slot="label" style="padding-right:10px;display:block;"></i>
      </x-input>
    </group>

    <ul class="sn-list-nav">
      <li v-for="(item, index) in cateData" :class="{ cur: item.isActive }" @click="cateDataTab(index)">{{
        item.name }}
      </li>
    </ul>

    <div class="sn-list-con">
      <divider v-if="secondCateData.length === 0" style="margin: 20px 0">暂无数据</divider>
      <div v-if="secondCateData.length > 0" v-for="element in secondCateData">
        <div class="module-title"><span>{{ element.name }}</span></div>
        <divider v-if="element.thirdCate.length === 0" style="margin-bottom: 20px">暂无数据</divider>
        <ul v-if="element.thirdCate.length > 0" class="household-recommend">
          <li v-for="item in element.thirdCate" @click="toSpuList(item.cateId)">
            <img :src="item.url">
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
    </div>

    <foot title='分类' />

  </div>
</template>

<script>
  import {Group, Tabbar, TabbarItem, XInput, Divider} from 'vux'
  import foot from '@/components/commons/foot'
  import {
    queryCategory,//查询所有手机分类
  } from '@/api/category'


  export default {
    //页面组件
    components: {
      Group,
      Tabbar,
      TabbarItem,
      XInput,
      Divider,
      foot
    },
    data() {
      return {
        searchValue: '', //搜索关键字
        allCategory: [],//全部分类
        cateData: [], //页面分类数据源
        secondCateData: [] //二级分类数组
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg');
      this.getCategoryList();//加载页面数据
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      //加载页面分类
      getCategoryList() {
        queryCategory().then(response => {
          if (response != null && response.length > 0) {
            this.allCategory = response;
            this.cateData = this.getFirstCate();
            this.secondCateData = this.cateData[0].secondCateData;
          }
        })
      },
      //获得一级分类
      getFirstCate() {
        let array = [];
        for (let i = 0; i < this.allCategory.length; i++) {
          if (this.allCategory[i].grade == 1) {
            this.allCategory[i].secondCateData = this.getSecondCategory(this.allCategory[i].id);
            this.allCategory[i].isActive = false;
            array.push(this.allCategory[i]);
          }
        }
        array[0].isActive = true;
        return array;
      },
      //获得二级分类
      getSecondCategory(firstCategoryId) {
        let array = [];
        for (let i = 0; i < this.allCategory.length; i++) {
          if (this.allCategory[i].grade == 2 && this.allCategory[i].parentId == firstCategoryId) {
            this.allCategory[i].thirdCate = this.getThirdCate(this.allCategory[i].id);
            array.push(this.allCategory[i]);
          }
        }
        return array;
      },
      //获得三级分类
      getThirdCate(secondCateId) {
        let array = [];
        for (let i = 0; i < this.allCategory.length; i++) {
          if (this.allCategory[i].grade == 3 && this.allCategory[i].parentId == secondCateId) {
            array.push(this.allCategory[i]);
          }
        }
        return array;
      },
      //搜索
      toSearch() {
        this.$router.push({path: '/search'})
      },
      //跳转Spu列表
      toSpuList(id) {
        this.$router.push({path: '/spulist', query: {queryString: '', cateId: id}});
      },
      //一级分类点击效果
      cateDataTab(index) {
        this.cateData.forEach(e => e.isActive = false)
        this.cateData[index].isActive = true
        this.secondCateData = this.cateData[index].secondCateData;
      }
    }
  }
</script>

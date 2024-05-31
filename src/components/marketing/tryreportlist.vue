<template>
  <div style="height:100%;">

    <scroller
      :on-infinite="infinite"
      ref="scroller"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <!-- <x-header :left-options="{backText: ''}">试用报告</x-header> -->

      <div class="assess-wrapper">
        <group v-for="(item,index) in pageList" :key="index" style="margin-top: 10px">
          <cell :value="item.submitTime">
            <div slot="title">
              <div style="color: #666; display: inline-block">{{ item.customerName }}</div>
              <div class="commstar commstarList">
                <a class="commstar_star star1" :class="item.satisfaction <= '1' ? 'active' : ''"></a>
                <a class="commstar_star star2"
                   :class="item.satisfaction > '1' && item.satisfaction <= '2' ? 'active' : ''"></a>
                <a class="commstar_star star3"
                   :class="item.satisfaction > '2' && item.satisfaction <= '3' ? 'active' : ''"></a>
                <a class="commstar_star star4"
                   :class="item.satisfaction > '3' && item.satisfaction <= '4' ? 'active' : ''"></a>
                <a class="commstar_star star5"
                   :class="item.satisfaction > '4' && item.satisfaction <= '5' ? 'active' : ''"></a>
              </div>
            </div>
          </cell>
          <cell :title="item.advice"></cell>
          <cell>
            <div slot="title">
              <img class="previewerImg" v-for="(element,imgIndex) in item.pics.split(',')" :key="imgIndex" :src="element"
                   @click="showImg(item.pics.split(','),index,imgIndex)">
            </div>
          </cell>
        </group>
      </div>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 100px">暂无数据</divider>

    <previewer v-if="pageList.length !== 0" :list="getImageSrc()"
               ref="previewer"></previewer>

  </div>
</template>

<script>
  import {XHeader, Divider, Group, Cell, Previewer} from 'vux'

  import {queryTryReportList} from '@/api/tryspudetail';

  export default {
    components: {
      XHeader, Divider, Group, Cell, Previewer
    },
    data() {
      return {
        assessIndex: 0, // 试用报告预览图片index
        listQuery: {
          tryId: this.$route.query.tryId, // 试用促销id
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
      }
    },
    created() {
      document.getElementsByTagName('body')[0].className = 'gray-bg'
    },
    methods: {
      //下拉触发
      infinite: function (done) {
        //没有更多数据
        if (this.noMore) {
          //关闭无限加载
          this.$refs.scroller.finishInfinite(true);
          return;
        }
        //正在查询中  不请求
        if (this.loading) {
          done();
          return;
        }
        //设置正在查询中
        this.loading = true;
        //查询
        this.getData();
        done();
      },
      //获取数据
      getData() {
        queryTryReportList(this.listQuery).then(response => {
          let list = response.data;
          this.listQuery.pageNum++;
          if (list.length > 0) {
            this.pageList = this.pageList.concat(list);
          }
          this.loading = false;
          if (list.length < 10) {
            this.noMore = true;
          }
        });
      },
      // 预览大图
      showImg(data, index, imgIndex) {
        this.assessIndex = index;
        this.$refs.previewer.show(imgIndex)
      },
      // 获取预览图列表
      getImageSrc() {
        return this.pageList[this.assessIndex].pics.split(',').map(image => {
          return {src: image};
        });
      },
    }
  }
</script>

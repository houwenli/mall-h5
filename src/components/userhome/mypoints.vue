<template>
  <div style="height:100%;">

    <scroller
      ref="scroller"
      :on-infinite="infinite"
      :class="{scrollerNoData : pageList.length === 0}"
    >

      <!-- <x-header @on-click-back="backCustomerCenter()" :left-options="{backText: '',preventGoBack:true}">我的积分</x-header> -->

      <div class="profit-box">
        <div class="title">积分总额：<span class="money">{{totalPoint}}</span>分</div>
      </div>

      <group>
        <cell v-for="(item,index) in pageList" :key="index" :title="item.detail" :inline-desc='item.createTime'>
          <div style="font-size: 1rem" :style="item.type === '1' ? 'color: #ffc927' : ''"><span
            v-if="item.type === '1'">+</span><span
            v-if="item.type === '2'"></span>{{ item.point }}
          </div>
        </cell>
      </group>

    </scroller>

    <divider v-if="pageList.length === 0" class="dividerCenter" style="margin-top: 200px">暂无数据</divider>

  </div>
</template>

<script>
  import {XHeader, Divider, Group, Cell} from 'vux'

  import {queryPoints, queryAllPoints} from '@/api/mypoints';

  export default {
    components: {
      XHeader, Divider, Group, Cell
    },
    data() {
      return {
        totalPoint: null, // 积分总额
        listQuery: {
          pageNum: 0, // 当前页码
          pageSize: 10, // 每页显示记录数
        },
        noMore: false, //没有更多
        pageList: [], //页面数据源
        loading: false, //正在加载
      }
    },
    created() {
      document.body.removeAttribute('class', 'gray-bg');
      this.queryAllPoints();
    },
    methods: {
      // 查询积分总额
      queryAllPoints() {
        queryAllPoints().then(res => {
          this.totalPoint = res;
        })
      },
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
        queryPoints(this.listQuery).then(response => {
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
      // 返回用户个人中心页面
      backCustomerCenter() {
        this.$router.push({path: '/home'})
      }
    }
  }
</script>

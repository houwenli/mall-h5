<template>
    <div style="height:100%;">
        <scroller
            :on-infinite="infinite"
            ref="scroller"
            class="scrollerPaddingBottom"
            :class="{scrollerNoData : pageList.length === 0}"
        >
            <x-header :left-options="{backText: ''}">佣金</x-header>

            <div class="profit-box" style="background: #d43f3a">
                <div class="title">佣金余额（元）</div>
                <div class="money">{{commission | price}}</div>
            </div>

            <tab v-model="tabValue">
                <tab-item style="background: none" @on-item-click="tabChange(0)">佣金记录</tab-item>
                <tab-item style="background: none" @on-item-click="tabChange(0)">提现记录</tab-item>
            </tab>

            <group>
                <cell v-for="(item,index) in pageList" :key="index">
                    <span slot="title">{{item | title}}</span>
                    <div
                        style="font-size: 1rem"
                        :style="item.type == undefined  ? '' : item.type == '0' ? 'color: #ffc927' : ''"
                    >
                        <span v-if="item.type == 0">+</span>
                        <span v-if="item.type != 0">-</span>
                        {{ item.money | price}}
                    </div>
                </cell>
            </group>
        </scroller>

        <divider
            v-if="pageList.length === 0"
            class="dividerCenter"
            style="margin-top: 100px"
        >您还没有佣金记录</divider>

        <div class="footer_btn">
            <x-button style="background: #d43f3a" type="primary" link="/myspreadcash">我要提现</x-button>
        </div>
    </div>
</template>

<script>
import { XHeader, Divider, Group, Cell, Tab, TabItem, XButton } from "vux";
import {
    queryRecords, //分页查询记录
    addWithdrawRecord, //增加用户提现记录
    queryCustomerPersonalInfo //查询用户信息
} from "@/api/myspreadrecord";

export default {
    components: {
        XHeader,
        Divider,
        Group,
        Cell,
        Tab,
        TabItem,
        XButton
    },
    data() {
        return {
            commission: 0, //佣金
            tabValue: 0, //table类型
            listQuery: {
                pageNum: 0, // 当前页码
                pageSize: 10 // 每页显示记录数
            },
            _done: null, //无限加载插件
            noMore: false, //没有更多
            pageList: [], //页面数据源
            loading: false, //正在加载
            urlArray: ["commission", "withdraw"] //请求地址  table0 佣金  table1 提现
        };
    },
    created() {
        document.body.removeAttribute("class", "gray-bg");
        this.queryCustomerInfo();
    },
    filters: {
        price(value) {
            if (value == 0) {
                return "0.00";
            }
            return parseFloat(value).toFixed(2);
        },
        title(item) {
            if (item.remark == undefined) {
                switch (item.status) {
                    case "0":
                        return "提现申请中";
                    case "1":
                        return "提现申请审核通过";
                    case "2":
                        return "提现申请被拒";
                    case "3":
                        return "提现成功";
                    default:
                        return "";
                }
            } else {
                return item.remark;
            }
        }
    },
    methods: {
        infinite(done) {
            this._done = done;
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
        //查询列表数据
        getData() {
            queryRecords(this.listQuery, this.urlArray[this.tabValue]).then(
                response => {
                    let list = response.data;
                    this.listQuery.pageNum++;
                    if (list.length > 0) {
                        this.pageList = this.pageList.concat(list);
                    }
                    this.loading = false;
                    if (list.length < 10) {
                        this.noMore = true;
                    }
                }
            );
        },
        queryCustomerInfo() {
            queryCustomerPersonalInfo().then(res => {
                this.commission = res.data.commission;
            });
        },
        tabChange() {
            //页面数据清空
            this.pageList = [];
            //页码归零
            this.listQuery.pageNum = 0;
            //重置标记
            this.noMore = false;
            //重新开启无限加载插件
            this._done();
        }
    }
};
</script>

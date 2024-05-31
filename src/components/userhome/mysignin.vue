<template>
    <div style="height:100%;">
        <scroller
            ref="scroller"
            :on-infinite="infinite"
            :class="{scrollerNoData : pageList.length === 0}"
        >
            <x-header
                @on-click-back="backCustomerCenter()"
                :left-options="{backText: '',preventGoBack:true}"
            >
                签到
                <a
                    slot="right"
                    style="color: #666"
                    @click="ruleVisible = true"
                >{{pointSignRuleTitle}}</a>
            </x-header>

            <div class="sign_top">
                <img width="100%" src="../../assets/img/sign-bg.png" />
                <div class="sign_btn" @click="signIn">
                    <h1>{{ signType ? '已签到' : '签到'}}</h1>
                </div>
            </div>

            <group>
                <cell
                    v-for="(item,index) in pageList" :key="index"
                    :title="item.point != 0 ? '签到获得了' + item.point + '积分' : '签到成功'"
                    :value="item.createTime.split(' ')[0]"
                ></cell>
            </group>

            <divider v-if="pageList.length === 0" class="dividerCenter" >暂无数据</divider>
        </scroller>


        <alert v-model="ruleVisible" :title="pointSignRuleTitle">
            <textarea cols="30" rows="8" readonly="readonly" class="signdetail" v-model="pointSignRule"></textarea>
        </alert>
    </div>
</template>

<script>
import { XHeader, Divider, Group, Cell, Alert } from "vux";

import {
    queryPointSignRule,
    customerSignList,
    isTodaySign,
    signIn
} from "@/api/mysignin";

export default {
    components: {
        XHeader,
        Divider,
        Group,
        Cell,
        Alert
    },
    data() {
        return {
            isProcess: false, // 接口是否处理中
            signType: false, // 是否已经签到，true 已签到 false 未签到
            ruleVisible: false, // 签到规则弹窗
            pointSignRuleTitle: "", // 签到规则标题
            pointSignRule: "", // 签到规则
            listQuery: {
                pageNum: 0, // 当前页码
                pageSize: 10 // 每页显示记录数
            },
            noMore: false, //没有更多
            pageList: [], //页面数据源
            loading: false, //正在加载
            _done: null //分页控件
        };
    },
    created() {
        document.body.removeAttribute("class", "gray-bg");
        this.queryPointSignRule();
        this.isTodaySign();
    },
    methods: {
        // 查询签到规则
        queryPointSignRule() {
            queryPointSignRule().then(res => {
                if (res.flag) {
                    this.pointSignRuleTitle = res.data.title;
                    let rule = "商城用户签到";
                    if (res.data.ruleInfos && res.data.ruleInfos.length > 0) {
                        res.data.ruleInfos.forEach(
                            row =>
                                (rule +=
                                    "\n连续" +
                                    row.day +
                                    "天签到给" +
                                    row.point +
                                    "积分")
                        );
                    }
                    this.pointSignRule = rule;
                }
            });
        },
        // 查询今天是否签到
        isTodaySign() {
            isTodaySign().then(res => {
                this.signType = res != 1;
            });
        },
        //下拉触发
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
        //获取数据
        getData() {
            customerSignList(this.listQuery).then(response => {
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
        // 签到
        signIn() {
            if (!this.signType) {
                if (this.isProcess) {
                    return;
                }
                this.isProcess = true;
                let that = this;
                signIn().then(res => {
                    this.isProcess = false;
                    if (res.flag == 1) {
                        this.$vux.alert.show({
                            title: "签到成功",
                            content: "恭喜您，获得了" + res.data + "积分",
                            onHide() {
                                that.signType = true;
                                that.refreshData();
                            }
                        });
                    } else if (res.flag == -1) {
                        this.$vux.toast.text("活动还没有开始", "middle");
                    } else if (res.flag == -2) {
                        this.$vux.toast.text("您今天已经签过到了", "middle");
                    } else {
                        this.$vux.toast.text("未知错误", "middle");
                    }
                });
            }
        },
        // 刷新列表
        refreshData() {
            this.listQuery.pageNum = 0;
            this.pageList = [];
            this.noMore = false;
            this._done();
        },
        // 返回用户个人中心页面
        backCustomerCenter() {
            this.$router.push({ path: "/home" });
        }
    }
};
</script>

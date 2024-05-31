<template>
    <div style="height: 100%">
        <!-- <x-header :left-options="{backText: ''}">申请提现</x-header> -->

        <group style="margin-top: 1.176em">
            <x-input
                title="提现金额"
                @on-blur="keyboardDown"
                v-model="withdrawRecord.money"
                placeholder="请输入提现金额"
                :max="18"
                keyboard="number"
                required
            ></x-input>
            <x-input
                title="支付宝账号"
                @on-blur="keyboardDown"
                v-model="withdrawRecord.account"
                placeholder="请输入支付宝账号"
                :max="64"
                required
            ></x-input>
            <x-input
                title="姓名"
                @on-blur="keyboardDown"
                placeholder="请输入姓名"
                v-model="withdrawRecord.name"
                :max="64"
                is-type="china-name"
                required
            ></x-input>
            <x-input
                title="支付密码"
                @on-blur="keyboardDown"
                v-model="withdrawRecord.password"
                placeholder="请输入支付密码"
                type="password"
                :max="20"
                required
            ></x-input>
        </group>

        <div class="weui-btn-area">
            <x-button type="primary" @click.native="save">确认申请</x-button>
        </div>

        <popup v-model="warnTipsVisible" position="top" :show-mask="false">
            <div class="warn-toptips">{{errorMsg}}</div>
        </popup>
    </div>
</template>

<script>
import { XHeader, Group, XInput, XButton, Popup, Divider } from "vux";
import {
    addWithdrawRecord //增加用户提现记录
} from "@/api/myspreadcash";

import {
    isMoney, //判断是否是金钱
    isEmpty //判断是否为空
} from "@/utils/validate";

export default {
    components: { XHeader, Group, XInput, XButton, Popup, Divider },
    data() {
        return {
            errorMsg: "请填写申请信息", //错误提示
            warnTipsVisible: false, //错误提示显示隐藏标记
            withdrawRecord: {
                money: "", //金额
                account: "", //支付宝账号
                name: "", //姓名
                password: "" //支付密码
            }, //提现记录
            isProcess: false // 接口是否处理中
        };
    },
    created: function() {
        document.getElementsByTagName("body")[0].className = "gray-bg";
    },
    watch: {
        warnTipsVisible(val) {
            if (val) {
                setTimeout(() => {
                    this.warnTipsVisible = false;
                }, 1000);
            }
        }
    },
    methods: {
        //发送申请
        save() {
            if (!this.checkForm()) {
                this.warnTipsVisible = true;
                return;
            }

            if (this.isProcess) {
                return;
            }
            this.isProcess = true;

            addWithdrawRecord(this.withdrawRecord).then(res => {
                this.isProcess = false;
                if (res == 1) {
                    this.$router.push({ path: "/myspreadrecord" });
                } else if (res == -1) {
                    this.errorMsg = "用户不存在";
                } else if (res == -2) {
                    this.errorMsg = "用户没有设置支付密码";
                } else if (res == -3) {
                    this.errorMsg = "支付密码不正确";
                } else if (res == -4) {
                    this.errorMsg = "参数不全";
                } else if (res == 5) {
                    this.errorMsg = "佣金不足";
                } else {
                    this.errorMsg = "提交失败，请稍后重试";
                }
                this.warnTipsVisible = true;
            });
        },
        //校验表单
        checkForm() {
            if (isEmpty(this.withdrawRecord.money)) {
                this.errorMsg = "请输入金额";
                return false;
            }
            if (!isMoney(this.withdrawRecord.money)) {
                this.errorMsg = "请输入合法金额";
                return false;
            }
            if (isEmpty(this.withdrawRecord.account)) {
                this.errorMsg = "请输入支付宝账号";
                return false;
            }
            if (isEmpty(this.withdrawRecord.name)) {
                this.errorMsg = "请输入姓名";
                return false;
            }
            if (isEmpty(this.withdrawRecord.password)) {
                this.errorMsg = "请输入支付密码";
                return false;
            }
            return true;
        },

        keyboardDown() {
            window.scrollTo(
                0,
                document.documentElement.scrollTop || document.body.scrollTop
            );
        }
    }
};
</script>

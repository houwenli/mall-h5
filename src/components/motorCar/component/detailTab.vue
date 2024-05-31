<template>
    <van-tabs @change="changeTab" v-model="active">
        <van-tab v-for="(item,index) in tabList" :key='index' :name='item.name' :title="item.title"></van-tab>

    </van-tabs>
</template>

<script>
export default {
    props:{
        tabList:{
            type: Array,
            default: ()=>[]
        },
        // activeTab:{
        //     type: String,
        //     default: '0'
        // }
    },
    data() {
        return {
            active: '0'
        }
    },
    methods:{
        changeTab(name, title){
            this.$emit('toPage', name)
        }
    }
}
</script>

<style lang="less" scoped>
.van-tabs--line /deep/ .van-tabs__wrap {
    height: 38px;
    .van-tab {
        font-size: 13px;
        color: #444;
        line-height: 17px;
        &.van-tab--active {
            font-weight: bold;
        }
    }
    .van-tabs__line {
        width: 26px;
        height: 4px;
        background: #FF0A35;
    }
}
/deep/.van-tabs__nav {
    background-color: transparent;
}
</style>



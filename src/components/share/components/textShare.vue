<template>
    <div class="text-share">
        <div class="share-title">编辑分享文案</div>
        <van-field
            v-model="shareContent"
            class="textarea"
            rows="2"
            autosize
            label=""
            type="textarea"
            maxlength="200"
            placeholder="请输入分享内容"
            show-word-limit
/>
<van-button type="danger" class="submit-btn" block round  v-clipboard:copy="shareContent"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError">复制文案</van-button>
<div class="tip">万顺福仅提供技术支持，请自行确保分享内容真实合法</div>
    </div>
</template>

<script>
    export default {
        name:'textShare',
        props:{
            data:{
            type:Object,
            default:()=>{}
        }
        },
        data(){
            return {
                shareContent:this.data.content||this.data.title
            }
        },
        methods: {
            onCopy(e) {
                console.log(e)
      this.$toast.success("复制成功！");
      this.showPopupCopy = true;
    },
    onError(e) {
        console.log(e)
      console.log("复制失败请刷新后重试！");
    }
        },
    }
</script>

<style lang="less" scoped>
.text-share{
    background: #fff;
    padding: 0.72rem;
    box-sizing: border-box;
    height: 100%;
}
.share-title{
    font-size: 0.56rem;
    color: #000;
    margin-bottom: 12px;
    font-weight: bold;
    padding-top: 12px;
}
.textarea{
    
background: #F5F5F5;
border-radius: 10px;
}
.submit-btn{
    font-size: 0.64rem;
    margin: 1.2rem auto 0.48rem;
    height: 1.52rem;
    line-height: 1.52rem;
}
.tip{
    font-size: 12px;
    color: #999;
    text-align: center;
}
</style>
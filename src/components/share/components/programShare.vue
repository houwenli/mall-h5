<template>
  <div class="program-share">
    <div class="select-wrap">
      <div class="select-title">生成拼图<span>(按照选择图片顺序生成拼图)</span></div>
      <div class="select-content">
        <ul>
          <li v-for="img of imgs" :key="img" @click='select(img)'>
            <img :src="img" alt="">
            <div class="num" v-if="selectedImg.includes(img)">{{sortNum(img)}}</div>
            <div class="tag" v-else></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="share-card-wrap">
        <!-- 小于三张图 -->
      <div class="goods-img" v-if="selectedImg.length<=2">
        <img :src="img" alt="" v-for="(img,index) of selectedImg" :key="index">
      </div>
      <!-- 大于等于三张图 -->
      <div class="multi-img" v-else>
          <img :src="selectedImg[0]" class="img-big" >
          <ul>
              <li v-for="(img,index) of selectedImg.slice(1)" :key="index"><img :src="img"  class="img-small" ></li>
          </ul>
      </div>
      <div class="goods-info">
        <div class="info">
          <div class="goods-price">￥<span>{{data.price}}</span></div>
          <div class="goods-name van-multi-ellipsis--l3">{{data.title}}</div>
        </div>
        <div class="qrcode">
          <img src="https://sf1-ttcdn-tos.pstatp.com/obj/temai/FkjbsCKFQAiitJwd2RzIhHDxQYtswww800-800" alt="">
          <p class="tip">长按或扫码购买</p>
        </div>
      </div>
      <div class="brand">
          <img src="@/assets/img/wsf_logo.png" class="logo">
      </div>
    </div>

   

  </div>
</template>

<script>
export default {
    name: 'programShare',
    props:{
        imgs:{
            type:Array,
            default:()=>[]
        },
        data:{
            type:Object,
            default:()=>{}
        }
    },
    data() {
        return {
            selectedImg:[],//选中的分享图片 
        };
    },
    mounted() {
        setTimeout(() => {
            this.selectedImg.push(this.imgs[0])
        }, 300);
    },
    computed: {
        sortNum(){
            return img=>{
                return this.selectedImg.findIndex(item=>item==img)+1
            }
        }
    },
    methods: {
        // 选择图片
        select(img){
            if(this.selectedImg.includes(img)){
                // 如果存在，则取消选中
                let index=this.selectedImg.findIndex(item=>item==img)
                if(this.selectedImg.length==1){
                    this.$toast('至少选择一张图片')
                    return
                }
                this.selectedImg.splice(index,1)
            }else{
                // 不存在就追加
                this.selectedImg.push(img)
            }
            console.log(this.selectedImg)
            
        }
    },
};
</script>

<style lang="less" scoped>
.program-share {
    background: #F5F5F5;
    padding-bottom: 2rem;
    .select-wrap {
        background: #fff;
        padding: 0.48rem;
        margin-bottom: 0.48rem;
        .select-title {
            font-size: 0.56rem;
            font-weight: bold;
            margin-bottom: 8px;
            span {
                font-size: 0.48rem;
                color: #999;
                font-weight: normal;
                margin-left: 4px;
            }
        }
        .select-content {
            background: #f5f5f5;
            border-radius: 8px;
            padding: 6px;
            ul {
                display: flex;
                overflow-x: auto;
            }
            li {
                position: relative;
                flex: none;
                margin-right: 6px;
                border-radius: 6px;
                width: 3.2rem;
                height: 3.2rem;
                overflow: hidden;
                &:last-child {
                    margin-right: 0;
                }
                img {
                    width: 3.2rem;
                    height: 3.2rem;
                    object-fit: cover;
                }
                .tag,.num{
                    position: absolute;
                    top: 0.16rem;
                    right: 0.16rem;width: 0.6rem;
                    height: 0.6rem;
                    border-radius: 50%;
                }
                .tag{
                    
                    border: 0.04rem solid #999;
                    background: #fff;
                }
                .num{
                    border: 0.04rem solid #E60113;
                    background: #E60113;
                    font-size: 0.48rem;
                    color: #fff;
                    text-align: center;
                    line-height: 0.6rem;
                }
            }
        }
    }
    .share-card-wrap {
        position: relative;
        width: 9.6rem;
        padding: 0.36rem 0.36rem 1.28rem;
        width: 9.6rem;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.08);
        border-radius: 0.4rem;
        box-sizing: border-box;
        .goods-img {
            img {
                width: 8.92rem;
                height: 8.92rem;
            }
            margin-bottom: 0.48rem;
        }
        .multi-img{
            margin-bottom: 0.48rem;
           .img-big{
            width: 8.92rem;
                height: 8.92rem;
            margin-bottom: 1px;
        } 
        ul{
            display: flex;
            li{
                flex: 1;
                margin-right: 1px;
                 .img-small{
            flex: 1;
                width: 100%;
                height: 100%;
        }
            }
        }
       
        }
        .goods-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            .info {
                flex:1;
                .goods-price {
                    font-size: 0.48rem;
                    font-weight: 500;
                    color: #e60113;
                    line-height: 0.6rem;
                    margin-bottom: 0.32rem;
                    span {
                        font-weight: bold;
                        font-size: 0.68rem;
                    }
                }
                .goods-name {
                    font-size: 14px;
                    color: #000;
                }
            }
            .qrcode {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                img {
                    width: 2.32rem;
                    height: 2.32rem;
                    // margin-bottom: 0.36rem;
                }
                .tip {
                    color: #666;
                    font-size: 0.36rem;
                    transform: scale(0.7);
                }
            }
        }
        .brand{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0.8rem;
            text-align: center;
            line-height: 0.8rem;
background: #FEF0F1;
border-radius: 0px 0px 10px 10px;
            .logo{
                width: 1.44rem;
                height: 0.48rem;
                object-fit: cover;
            }
        }
    }
}

</style>
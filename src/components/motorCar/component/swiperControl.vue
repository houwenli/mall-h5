<template>
    <div class="img-box" v-if="newUiImgList.length > 1">
        <div class="img-box-contaier-left">
            <span>
                {{ newUiImgList.length }}种
            </span>
            <span>
                可选
            </span>
        </div>
        
        <div class="img-box-contaier">
            <div v-for="(stepItem,index) in newUiImgList" :key="index" :class="['level_menu',s1 ==stepItem.id && stepItem.imgUrl? 'ui-active' : '']" @click="uiSkuSelected(stepItem, index)">
                <img :src="stepItem.imgUrl" alt="" v-if="stepItem.imgUrl">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        newUiImgList: {
            type: Array,
            default: () => []
        }
    },
    inject: [
        'querySpu',
        'selectProId'
    ],
	data() {
        return {
        }
    },
    computed:{
        s1() {
            return this.selectProId()
        }
    },
    watch:{
        s1(val) {
            const index = this.newUiImgList.findIndex(item=>item.id == val)
            this.rollEffect(index)
        },
    },
    methods: {
        uiSkuSelected(ele, index) {
            if (!ele.imgUrl) return
            this.querySpu({skuId: ele.id,init: true}).then(()=>{
                this.rollEffect(index)
            })
        },
        rollEffect(index) {
            this.$nextTick(() => {
                // 获取父盒子元素
                let levelMenusBox = document.getElementsByClassName('img-box-contaier')[0]
                if(!levelMenusBox) return
                // 获取一级菜单dom列表
                let levelMenus = document.getElementsByClassName('level_menu') || []
                // 动态获取元素的margin-right距离
                let marginRight = window.getComputedStyle(levelMenus[0]).marginRight.split('px')[0]

                let levelWidths = []
                // 遍历获取每个一级菜单的宽度
                for (let item of levelMenus) {
                    let elWidth = window.getComputedStyle(item).width.split('px')[0]
                    levelWidths.push((elWidth * 1 + marginRight * 1).toFixed(4) * 1)
                }

                // 获取第一个元素到当前点击元素的宽度list
                let elWidths = levelWidths.splice(0, index)
                // 计算所有元素的宽度
                let deviation = index > 0 && elWidths.reduce((preValue, curValue) => preValue + curValue)
                // 计算父盒子滚动距离
                let scrollLeft = index === 0 ? 0 : deviation - elWidths[elWidths.length - 1]

                levelMenusBox.scroll({
                    top: 0,
                    left: scrollLeft,
                    behavior: "smooth", //滚动条平滑滚动
                });

            })
        },
    }
}
</script>
<style lang="less" scoped>
.img-box{      
    background: #FFFFFF;   
    border-radius: 0px 0px 12px 12px;   
    padding: 16px 12px 8px;   
    display: flex;
    width: 100%;
  
    .img-box-contaier-left{
        width: 48px;
        height: 44px;
        margin-right: 8px;   
        box-sizing: border-box;                      
        background: rgba(229, 229, 229, 0.22);
        border-radius: 8px;                
        display: flex;           
        align-items: center;
        flex-direction: column;
        padding: 6px 0;                             
        span{
            font-size: 11px;
            font-family: Arial-BoldMT, Arial;           
            color: #C3C3C3;
            height: 14px;
            line-height: 14px;
            font-weight: normal;           
        }
        span:first-of-type{
           margin-bottom: 1.5px;
        }
        span:last-of-type{
            margin-top: 1.5px;
        }
        
    }
    >.img-box-contaier{
        display: -webkit-box;
        flex: 1;
        overflow-x: auto;
        overflow-y: hidden;
        box-sizing: border-box;
		&::-webkit-scrollbar {
			display: none; /* Chrome Safari */
		}
        >div{
            width: 44px;
            height: 44px;
            line-height: 44px;
            margin-right: 8px;
            box-sizing: border-box;    
            border-radius: 8px;          
            border: 1px solid #EEEEEE; 
            overflow: hidden;   
            img{
                width: 100%;
                height: 100%;
            }
        }       
        .ui-active{
            border: 1px solid #FF0A35;
        }
    }
}
</style>
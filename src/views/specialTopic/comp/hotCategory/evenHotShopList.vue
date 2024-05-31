<template>
<div class="even-hot-shopList">	
	<evenProductList :floorSpuIds="floorSpuIds"></evenProductList>         			 
</div>
</template>

<script>
import evenProductList from './evenProductList.vue'
export default {
    components: { 
		evenProductList		
	},
    data() {
		return {
			
			
		}
    },
	props: {
		floorSpuIds: {
			type: Array,
			default: () => [],
		}
	},	
	computed:{
	
	},
    created() {
		
    },
	
	watch: {
	
	},
    methods: {
		
	}		
}
</script>

<style scoped lang="less">
.even-hot-shopList{	
}
</style>

/**
 * 排行榜
 */
export default [
	{
		// 排行专题
		path: '/ranking',
		name: 'ranking',
		component: () => import('@/views/specialTopic/ranking.vue'),
		meta: {
			title: '排行专题',
		},
	},
	// {
	// 	// 品类热销
	// 	path: '/category',
	// 	name: 'category',
	// 	component: () => import('@/views/specialTopic/category.vue'),
	// 	meta: {
	// 		title: '品类热销',
	// 	},
	// },

]

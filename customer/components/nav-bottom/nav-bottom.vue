<template>
	<!-- 底部导航栏 -->
	<template v-if="dataList == 0">
		<view>
			<view>
				<cmd-bottom-nav font-color="#b7b9bc" active-font-color="#d81e06" :current="current" :list="tabBarList"
					text-auto @click="router">
				</cmd-bottom-nav>
			</view>
		</view>
	</template>
	<template v-else>
		<view>
			<view>
				<cmd-bottom-nav font-color="#b7b9bc" active-font-color="#d81e06" :current="current" :list="tabBarList1"
					text-auto @click="router">
				</cmd-bottom-nav>
			</view>
		</view>
	</template>
</template>

<script>
	import http from '@/common/vmeitime-http/interface.js'
	export default {
		data() {
			return {
				dataList: '',
				tabBarList: [{
						"pagePath": "pages/score/score",
						"text": "比分直播",
						"src": "../../static/tabbar/tab2.png",
						"srcSelect": "../../static/tabbar/tab2s.png"
					},
					{
						"pagePath": "pages/kaijiang/kaijiang",
						"text": "开奖公告",
						"src": "../../static/tabbar/tab6.jpg",
						"srcSelect": "../../static/tabbar/tab6s.jpg"
					},
					{
						"pagePath": "pages/home/home",
						"text": "我",
						"src": "../../static/tabbar/tab5.png",
						"srcSelect": "../../static/tabbar/tab5s.png"
					}
				],
				tabBarList1: [{
						"pagePath": "pages/main/main",
						"text": "首页",
						"src": "../../static/tabbar/tab1.png",
						"srcSelect": "../../static/tabbar/tab1s.png"
					},
					{
						"pagePath": "pages/kaijiang/kaijiang",
						"text": "开奖公告",
						"src": "../../static/tabbar/tab6.jpg",
						"srcSelect": "../../static/tabbar/tab6s.jpg"
					},
					{
						"pagePath": "pages/follow/follow",
						"text": "跟单大厅",
						"src": "../../static/tabbar/tab33.png",
						"srcSelect": "../../static/tabbar/tab33s.png"
					}, {
						"pagePath": "pages/score/score",
						"text": "比分直播",
						"src": "../../static/tabbar/tab2.png",
						"srcSelect": "../../static/tabbar/tab2s.png"
					}, {
						"pagePath": "pages/home/home",
						"text": "我",
						"src": "../../static/tabbar/tab5.png",
						"srcSelect": "../../static/tabbar/tab5s.png"
					}
				],
			}
		},
		created() {
			// 从 localStorage 中读取数据
			const storedRealName = localStorage.getItem('RealName');
			console.log(storedRealName, 'storedRealName测试');
			if (storedRealName) {
				this.dataList = storedRealName; // 如果数据存在，赋值给 data 中的 realName
			} else {
				console.log('RealName 不存在');
			}
		},
		props: {
			current: {
				type: Number,
				default: 0
			}
		},
		methods: {
			router(e) {
				// console.log(e, '返回路由路径'); // 查看 e 的内容
				let pagePath = e.item.pagePath; // 假设这是传入的路径
				// console.log(pagePath, '页面路径');

				// 确保路径格式正确
				if (!pagePath.startsWith('/')) {
					pagePath = '/' + pagePath; // 添加 /
				}

				// console.log(pagePath, '最终页面路径');

				uni.navigateTo({
					url: pagePath
				});
			},
			fetchData() {
				http.request({
					url: '/api/NewUser/index',
					method: 'GET'
				}).then(res => {
					this.dataList = res.data.data.userinfo.RealName;
					console.log('数据请求成功:', this.dataList);
				}).catch(err => {
					console.error('请求失败:', err);
				});
			}
		}

	}
</script>

<style>
</style>
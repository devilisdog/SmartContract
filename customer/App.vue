<script>
	import { useCounterStore } from '@/stores/counter'
	import common from "@/common/common.js"

	export default {
		setup() {
			// 如果是后台进入就执行获取用户信息公共方法
			// common.getUserInfo()
		},
		onLaunch() {
			// 应用启动时检查登录状态
			const token = uni.getStorageSync('access_token');
			if (!token) {
				// 未登录，跳转到登录页
				uni.reLaunch({
					url: '/pages/login/login'
				});
			}
		},
		onShow: async function() {
			const counter = useCounterStore(); //状态管理
			if (new Date().getTime() - uni.getStorageSync('recentTime') > 600000 && counter.onHide_boole) {
				//app用户点击进入减去app划入后台的时间大于10分钟就关闭所有页面进入首页
				await uni.showLoading({
					title: '更新数据中',
					mask: true
				})
				// await common.getUserInfo()
				uni.showTabBar()
				await uni.hideLoading()
				await uni.reLaunch({
					url: '/pages/main/main'
				})
			}
		},
		onHide: function() {
			uni.setStorageSync('recentTime', new Date().getTime())
			const counter = useCounterStore(); //状态管理
			counter.onHide_boole = true
		}
	}
</script>

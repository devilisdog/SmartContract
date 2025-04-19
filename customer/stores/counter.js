import {
	defineStore
} from 'pinia';
// import api from '@/common/vmeitime-http/'
const IS_PRO = false;
export const useCounterStore = defineStore('counter', {
	state: () => {
		return {
			baseUrl: uni.getStorageSync('api'),

			user_id: uni.getStorageSync('user_id'),
			shop_id: uni.getStorageSync('shop_id'),
			adult: uni.getStorageSync('isAdult'), //是否成年 0 T 1F
			user_money: 0, //用户余额
			access_token: uni.getStorageSync('access_token'), //令牌
			refresh_token: uni.getStorageSync('refresh_token'), //长期令牌用来刷新
			user_imgs: null,
			hasLogin: false, //是否登录
			sfz_id: 0,
			sfz_name: null,
			UserConfig: [], //用户更多参数
			Betrecord: [], //我的 投注记录

			onHide_boole: false, //是否后台进入（启动app不会触发全局onHide方法，用于用户长期挂在后台token过期后用户进入无法跳转值登录的问题）
			// 数字类彩票'不用了'
			submitData: [],
			// 数字类彩票投注单
			submitNewData: [],

			userinfo: [],

			// 竞彩足球
			matchInfoList: [],
			// 投注内容
			BettingContent: [],
			// 体彩样式变更
			styleData: {
				data: [],
			},
			allOrderData: [],

			userAllData: [], //用户所有的信息

			//首页玩法用户点击限制
			gameAstrict: [],

			//首页所有玩法限制
			allGameAstrict: [],

			//跟单/合买大厅跳转详情
			skipDetails: [],

			//用户上级店铺信息
			shop_info: [],

			//聊天室聊天记录
			user_chatList: [],

			//聊天页面数据执行（用于监听后同步数据）
			chatPageExecute_user: '',
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {
		setMoney(type, value) {
			if (type == 'Dele') {
				this.user_money = Number(this.user_money) - Number(value)
			}
		},
		// onedele(e){
		// 	this.submitNewData.splice(e,1)
		// }

	}
});
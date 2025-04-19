import {
	defineStore
} from 'pinia';
const IS_PRO = false;
export const useCounterStore = defineStore('counter', {
	state: () => {
		return {
			baseUrl: uni.getStorageSync('api'),

			access_token: uni.getStorageSync('access_token'), //令牌
			refresh_token: uni.getStorageSync('refresh_token'), //长期令牌用来刷新
			hasRegister: false, //是否邀请注册
			hasLogin: false, //是否登录
			allOrderData: [],
			clickOrderState: false, //是否开启自动接单操作
			EmployeeData: [], //员工彩种管理暂存数据
			cooperationShopData: [], //合作店铺数据暂存数据
			orderOperateState: true, //此用户是否必须上传照片才能出票（默认必须要）
			shopBasicsData: [], //店主登录时获取到的基础信息

			staffLoginInfo: [], //如果是店员账号，会存放店员信息以及上级信息
			chatData: [], //用户当前聊天页的聊天记录、
			isSocketOpen: false, //聊天系统是否连接服务器成功
			push_key: '', //消息推送key
			chatPageExecute: {},
			isneedimgnumber: 0,
		};
	},
	// 也可以这样定义
	// state: () => ({ count: 0 })
	actions: {


	}
});
import http from '../interface.js'
//import { } from "vue"
import {
	useCounterStore
} from '@/stores/counter'
/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
var AppVersion = "1.1.0"
// #ifdef APP
if (uni.getSystemInfoSync().platform === 'android' || uni.getSystemInfoSync().platform === 'ios') {
	plus.runtime.getProperty(plus.runtime.appid, (inf) => {
		// 这里的inf.version就是版本号
		AppVersion = inf.version
	});
} else {
	console.log('非HTML5+环境，无法获取版本号');
}
// #endif

//获取首页数据
//const counter = useCounterStore()
const token = uni.getStorageSync('access_shop_token'); //获取物理缓存的token
//const token = counter.access_shop_token//获取状态管理（虚拟）token

//玩法管理
export const GetplayingSetList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Gamelist/index',
		method: 'GET',
		data,
	})
}
//玩法管理开关提交数据
export const Postedit = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Gamelist/edit',
		method: 'POST',
		data,
	})
}
//获取订单列表（我的页面订单查询）
export const GetAllOrderList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Orderlist/Orderlist',
		method: 'GET',
		data,
	})
}
//获取员工列表
export const GetStaffList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/list',
		method: 'GET',
		data,
	})
}
//设置员工状态（停用或者启用）
export const GetAlterSetff = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/clerkClose',
		method: 'GET',
		data,
	})
}
//设置员工彩种编辑
export const GetColorEditing = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/ColorEditing',
		method: 'GET',
		data,
	})
}
//提交添加合作店铺
export const GetAddCooperation = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/addCooperation',
		method: 'GET',
		data,
	})
}
//我提交的申请合作店铺记录
export const GetMineRecord = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/MineRecord',
		method: 'GET',
		data,
	})
}
//与我合作店铺记录
export const GetRecord = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Record',
		method: 'GET',
		data,
	})
}
//与我合作店铺记录未处理点击（通过）
export const GetAdopt = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Adopt',
		method: 'GET',
		data,
	})
}
//与我合作店铺记录未处理点击（拒绝）
export const GetRefuse = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Refuse',
		method: 'GET',
		data,
	})
}
//与我合作店铺（甩单）店铺list
export const GetIssueShop = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/IssueShop',
		method: 'GET',
		data,
	})
}
//与我合作店铺（接单）店铺list
export const GetReceivingStore = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/ReceivingStore',
		method: 'GET',
		data,
	})
}
//合作店铺（玩法申请）
export const GetaddCooperationGame = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/addCooperationGame',
		method: 'GET',
		data,
	})
}
//待派奖列表
export const GetAwaitPrizegiving = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.WaitingAward/index',
		method: 'GET',
		data,
	})
}
//获取员工信息
export const GetClerkInfo = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/ClerkInfo',
		method: 'GET',
		data,
	})
}
//编辑员工信息
export const GetEditClerk = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/EditClerk',
		method: 'POST',
		data,
	})
}
//新增员工
export const GetAddClerk = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Clerk/AddClerk',
		method: 'POST',
		data,
	})
}
//设置用户昵称
export const GetEditNickname = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/EditNickname',
		method: 'POST',
		data,
	})
}
//修改用户头像
export const GetEditAvatar = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		uni.showLoading({
			title: '修改中~'
		});
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		uni.hideLoading();
		if (response.data.code == 1) {
			uni.showToast({
				title: '修改成功',
				icon: response.data.msg
			})
		} else {
			uni.showToast({
				title: '修改失败~',
				icon: 'error'
			})
		}
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/EditAvatar',
		method: 'POST',
		data,
	})
}
//修改合作店铺甩单开关
export const GetPushSwith = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		uni.showLoading({
			title: '修改中~'
		});
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		uni.hideLoading();
		if (response.data.code == 1) {
			uni.showToast({
				title: response.data.data,
				icon: response.data.msg
			})
		} else {
			uni.showToast({
				title: '修改失败~',
				icon: 'error'
			})
		}
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/PushSwith',
		method: 'POST',
		data,
	})
}
//修改合作店铺接单开关
export const GetPullSwith = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		uni.showLoading({
			title: '修改中~'
		});
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		uni.hideLoading();
		if (response.data.code == 1) {
			uni.showToast({
				title: response.data.data,
				icon: response.data.msg
			})
		} else {
			uni.showToast({
				title: '修改失败~',
				icon: 'error'
			})
		}

		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/PullSwith',
		method: 'POST',
		data,
	})
}


//店铺余额列表
export const GetBalanceList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Trusteeship/list',
		method: 'GET',
		data,
	})
}


//店铺认证获取图片
export const GetStoreID = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/GetStoreID',
		method: 'GET',
		data,
	})
}

//店铺认证上传图片(提交)
export const PostStoreID = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/PostStoreID',
		method: 'POST',
		data,
	})
}


//修改店铺地址/微信/电话
export const PostStoreInfo = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/PostStoreInfo',
		method: 'POST',
		data,
	})
}


//合作店铺的历史订单
export const GetHistory = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/History',
		method: 'GET',
		data,
	})
}


//实名认证api
export const PostRealAut = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/RealAut',
		method: 'POST',
		data,
	})
}


//合作店铺余额明细
export const GetCooperationBalance = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/CooperationBalance',
		method: 'GET',
		data,
	})
}


//合作加扣款
export const PostEditBalance = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/EditBalance',
		method: 'POST',
		data,
	})
}


//解除合作店铺
export const PostRemove = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Remove',
		method: 'POST',
		data,
	})
}

//合作店铺充值
export const PostRecharge = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Recharge',
		method: 'POST',
		data,
	})
}


//合作店铺提现
export const PostWithdrawal = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Cooperation/Withdrawal',
		method: 'POST',
		data,
	})
}


//店铺余额/账号明细
export const GetDetails = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Balance/Details',
		method: 'GET',
		data,
	})
}


//店铺余额/提现/提现记录
export const GetDrawMoneyHistory = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Balance/history',
		method: 'GET',
		data,
	})
}



//店铺余额/充值
export const PostShopRecharge = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Balance/Recharge',
		method: 'POST',
		data,
	})
}


//店铺余额/充值
export const PostShopWithdrawal = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Balance/Withdrawal',
		method: 'POST',
		data,
	})
}


//获取二维码图片
export const setImg = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.PublicityImg/setImg',
		method: 'GET',
		data,
	})
}


//发红包
export const pushRedPacket = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.RedPacket/pushRedPacket',
		method: 'POST',
		data,
	})
}



//发红包记录
export const getRedPacketRecord = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.RedPacket/getRedPacketRecord',
		method: 'GET',
		data,
	})
}


//撤销红包
export const revocationRedPacket = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.RedPacket/revocationRedPacket',
		method: 'POST',
		data,
	})
}

//收款管理(申请列表)
export const WithdrawalManagement = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Receipt/List',
		method: 'GET',
		data,
	})
}


//支付包3.0设置pid
export const setPid = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/set_newpay_pid',
		method: 'POST',
		data,
	})
}

//发布公告
export const set_notice_board = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/set_notice_board',
		method: 'POST',
		data,
	})
}


//获取历史公告
export const get_notice_board_list = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Setup/set_notice_board_list',
		method: 'POST',
		data,
	})
}

//收款管理(提交申请)
export const OpenReceipt = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Receipt/OpenReceipt',
		method: 'POST',
		data,
	})
}
//支付渠道开关
export const setReceipt = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Receipt/setReceipt',
		method: 'POST',
		data,
	})
}

export const execute = (data = {}) => { //重新执行api
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		} //添加通用参数
	}
	http.interceptor.response = (response) => { //设置请求结束后拦截器//设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		url: data.config.url.slice(21, data.config.url.length),
		method: data.config.method,
		data: {},
	})
}

export const getNewToken = (data) => { //长token获取正常token
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		url: '/api/common/refreshToken',
		method: 'POST',
		data,
	})
}

//添加绑定推送
export const getPushKey = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/user/getPushKey',
		method: 'POST',
		data,
	})
}



//预览线下收款图片
export const YulanShoukuangImg = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Receipt/YulanShoukuangImg',
		method: 'POST',
		data,
	})
}


//lehsua支付接口
export const LshuaShopPay = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/common.leshuashoppay/h5pay',
		method: 'POST',
		data,
	})
}
//机器人状态
export const robottype = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/robot',
		method: 'GET',
		data,
	})
}
//机器人申请
export const robotapply = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/applyRobot',
		method: 'POST',
		data,
	})
}
//机器人列表
export const robotlist = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/robotList',
		method: 'GET',
		data,
	})
}
//机器人添加
export const robotadd = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/addRobot',
		method: 'POST',
		data,
	})
}
//机器人修改
export const robotset = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/setRobot',
		method: 'POST',
		data,
	})
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	robotset,
	robotadd,
	robotlist,
	robotapply,
	robottype,
	GetplayingSetList,
	Postedit,
	GetAllOrderList,
	GetStaffList,
	GetAlterSetff,
	GetColorEditing,
	GetAddCooperation,
	GetMineRecord,
	GetRecord,
	GetRefuse,
	GetAdopt,
	GetIssueShop,
	GetReceivingStore,
	GetaddCooperationGame,
	GetAwaitPrizegiving,
	GetClerkInfo,
	GetEditClerk,
	GetAddClerk,
	GetEditNickname,
	GetEditAvatar,
	GetPushSwith,
	GetPullSwith,
	GetBalanceList,
	GetStoreID,
	PostStoreID,
	PostStoreInfo,
	GetHistory,
	PostRealAut,
	GetCooperationBalance,
	PostEditBalance,
	PostRemove,
	PostRecharge,
	PostWithdrawal,
	GetDetails,
	GetDrawMoneyHistory,
	PostShopRecharge,
	PostShopWithdrawal,
	setImg,
	pushRedPacket,
	getRedPacketRecord,
	revocationRedPacket,
	WithdrawalManagement,
	OpenReceipt,
	setReceipt,
	getPushKey,
	setPid,
	set_notice_board,
	get_notice_board_list,
	YulanShoukuangImg,
	LshuaShopPay
}

async function doRequest(response) { // 刷新 token 方法
	const counter = useCounterStore(); //状态管理
	if (response.data.code != 303 && response.data.code != 302 && response.data.code != 409) {
		return response
	} //token没有过期直接拦截
	if (uni.getStorageSync('refresh_shop_token') != '') {
		var getnewToken = await getNewToken({
			'refresh_token': uni.getStorageSync('refresh_shop_token')
		}).then(async function(res_two) {
			if (res_two.data.code == 1) {
				uni.setStorageSync('access_shop_token', res_two.data.data.token); //物理缓存用户token
				counter.access_token = res_two.data.data.token //登录生成的token
				var executeData = await execute(response, res_two.data.data.token).then(new_res => {
					return new_res
				})
				return executeData
			} else {
				//token过期跳转登录
				uni.showToast({
					title: res_two.data.msg,
					icon: 'none',
					position: 'center'
				})
				uni.reLaunch({
					url: '/pages/login/login'
				})
				return response
			}
		})
		return getnewToken
	} else {
		uni.showToast({
			title: response.data.msg,
			icon: 'none',
			position: 'center'
		})
		uni.reLaunch({
			url: '/pages/login/login'
		})
		return response
	}
}
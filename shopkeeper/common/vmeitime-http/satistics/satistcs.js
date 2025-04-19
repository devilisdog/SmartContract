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

//统计页面基础数据
export const GetSatistcsIndex = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Statistics.Index/index',
		method: 'POST',
		data,
	})
}


//统计/派奖详情和出票详情api
export const GetTicketingDetails = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Statistics.Index/TicketingDetails',
		method: 'GET',
		data,
	})
}


//统计/加扣款扣款api
export const GetCollocationMoney = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
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

//统计/充值总金额
export const GetRechargeDetails = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Statistics.Index/List',
		method: 'GET',
		data,
	})
}

//统计/提现总金额
export const GetHistory = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Withdrawal/history',
		method: 'GET',
		data,
	})
}


//统计/提现总金额
export const GetPayoutRequestList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Withdrawal/index',
		method: 'GET',
		data,
	})
}

//统计/提现总金额
export const PostHandle = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.mine.Withdrawal/handle',
		method: 'POST',
		data,
	})
}

//统计/充值详情
export const GetPayInfo = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Statistics.Index/RechargeDetails',
		method: 'GET',
		data,
	})
}

export const execute = (data = {}) => { //重新执行api
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		} //添加通用参数
	}
	http.interceptor.response = (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		url: data.config.url.slice(21, data.config.url.length),
		method: data.config.method,
		data,
	})
}

export const getNewToken = (data) => { //长token获取正常token
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
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

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	GetSatistcsIndex,
	GetTicketingDetails,
	GetCollocationMoney,
	GetRechargeDetails,
	GetHistory,
	GetPayoutRequestList,
	PostHandle,
	GetPayInfo
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
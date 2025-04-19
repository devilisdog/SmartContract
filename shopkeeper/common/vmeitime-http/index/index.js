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
// const counter = useCounterStore()
const token = uni.getStorageSync('access_shop_token'); //获取物理缓存的token

// 登录
export const Login = (data) => {
	http.interceptor.request = (config) => { //设置请求前拦截器
		config.header = {
			"server": 1,
			'app-version': AppVersion
		} //添加通用参数
	}
	return http.request({
		url: '/api/NewUser/login',
		method: 'POST',
		data,
	})
}

//获取店主基础信息
export const GetUserDataInfo = (data) => {
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		} //添加通用参数
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/NewUser/index',
		method: 'GET',
		data,
	})
}


//获取订单列表
export const GetOrderList = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/Orderlist',
		method: 'GET',
		data,
		//handle:true
	})
}

//接单
export const GetOrderReceiving = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/OrderReceiving',
		method: 'GET',
		data,
		//handle:true
	})
}

//点击出票
export const OrderDrawDraft = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/OrderDrawDraft',
		method: 'POST',
		data,
		//handle:true
	})
}
//驳回按钮
export const ShopkeeperCancellation = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/ShopkeeperCancellation',
		method: 'POST',
		data,
		//handle:true
	})
}
//获取合买订单数据
export const GetOrder_together = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/Order_together',
		method: 'GET',
		data,
	})
}
//甩单按钮
export const GetGaveCooperationOrder = (data) => {
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
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Order/GaveCooperationOrder',
		method: 'GET',
		data,
	})
}
//合作订单列表
export const GetCooperativeOrderlist = (data) => {
	http.interceptor.request = (config) => { //设置请求前拦截器
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
		url: '/api/shopkeeper.Order/CooperativeOrderlist',
		method: 'GET',
		data,
	})
}
//驳回按钮
export const GetRejectCooperationOrder = (data) => {
	http.interceptor.request = (config) => { //设置请求前拦截器
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
		url: '/api/shopkeeper.Order/RejectCooperationOrder',
		method: 'GET',
		data,
	})
}

//修改中奖金额
export const PostSetWinMoney = (data) => {
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
		url: '/api/shopkeeper.mine.WaitingAward/EditMoney',
		method: 'GET',
		data,
	})
}
//派奖按钮
export const PostAward = (data) => {
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
		url: '/api/shopkeeper.mine.WaitingAward/Award',
		method: 'POST',
		data,
	})
}



//最新版本跟新
export const GatVersion = (data) => {
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		} //添加通用参数
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/common.AppUpdate/index',
		method: 'GET',
		data,
	})
}

//店主注册
export const register = (data) => {
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
		url: '/api/NewUser/register',
		method: 'POST',
		data,
	})
}

//邮箱验证码
export const send = (data) => {
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
		url: '/api/Ems/send',
		method: 'POST',
		data,
	})
}

//手机验证码
export const PhoneSend = (data) => {
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
		url: '/api/Sms/PhoneSend',
		method: 'POST',
		data,
	})
}

//忘记密码/修改密码
export const forgetPassword = (data) => {
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
		url: '/api/NewUser/forgetPassword',
		method: 'POST',
		data,
	})
}

//发送消息同步
export const get_newSmg = (data) => {
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
		url: '/api/shopkeeper.Userlist/get_smg',
		method: 'GET',
		data,
	})
}


//获取历史聊天记录
export const get_history_list = (data) => {
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
		url: '/api/common.Common/get_history',
		method: 'GET',
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
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return await doRequest(response);
	}
	return http.request({
		url: '/api/common/refreshToken',
		method: 'POST',
		data,
	})
}
export const execute = async (data = {}) => { //重新执行api
	http.interceptor.request = (config) => { //设置请求前拦截器
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		config.header = {
			"server": 1,
			"ba-user-token": token,
			'app-version': AppVersion
		} //添加通用参数
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		return response;
	}
	return http.request({
		url: data.config.url.slice(21, data.config.url.length),
		method: data.config.method,
		data: {},
	})
}


//忘记密码/修改密码
export const changePhone = (data) => {
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
		url: '/api/bettingend.mine.Information/changePhone',
		method: 'POST',
		data,
	})
}
//获取开机动画
export const Getkaiji = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/common/getLayoutInfo',
	    method: 'GET', 
	    data
		// handle:true
	})
}
export default {
	Login,
	GetOrderList,
	GetOrderReceiving,
	GetUserDataInfo,
	OrderDrawDraft,
	ShopkeeperCancellation,
	GetOrder_together,
	GetCooperativeOrderlist,
	GetGaveCooperationOrder,
	GetRejectCooperationOrder,
	PostSetWinMoney,
	PostAward,
	GatVersion,
	send,
	register,
	forgetPassword,
	PhoneSend,
	getNewToken,
	changePhone,
	get_history_list,
	get_newSmg,
	Getkaiji
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
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

//用户页面api-----------------------------------------------------------------------------------

// 获取用户列表
export const GetUserList = (data, head) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/list',
		method: 'GET',
		data,
		header: head,
		// handle:true
	})
}
//重置密码
export const chongzhimima = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/resetPassword',
		method: 'POST',
		data,
	})
}
//获取代理列表
export const Getdaililist = (data, head) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/getAgentList',
		method: 'GET',
		data,
		header: head,
		// handle:true
	})
}
//获取用户详细
export const GetUserData = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/info',
		method: 'GET',
		data,
		//handle:true
	})
}
//用户邀请
export const GetInviterList = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/inviter',
		method: 'GET',
		data,
		//handle:true
	})
}
//用户信息加款
export const PostUserAddMoney = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/addMoney',
		method: 'POST',
		data,
	})
}
// 设为代理
export const Postdaili = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/setUserConfig',
		method: 'POST',
		data,
	})
}
// 设置佣金比例
export const Postyongjin = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/setAgentRate',
		method: 'POST',
		data,
	})
}
//用户信息扣款
export const PostUserDeductMoney = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/delMoney',
		method: 'POST',
		data,
	})
}
//用户投注记录
export const GetuserBetRecord = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/Orderlist',
		method: 'GET',
		data,
	})
}
//获取代理数据
export const Getuserdaili = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/getAgentById',
		method: 'GET',
		data,
	})
}
//用户投注记录
export const GetAccountDetails = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/AccountDetails',
		method: 'GET',
		data,
	})
}
//用户基本设置
export const GetSetUserConfig = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_shop_token'); //避免全局获取token失效
		uni.showLoading({
			title: '设置中~'
		})
		//添加通用参数
		config.header = {
			"server": 1,
			"ba-user-token": token,
			"app-version": AppVersion
		}
	}
	http.interceptor.response = async (response) => { //设置请求结束后拦截器
		//判断返回状态 执行相应操作
		if (response.data.code == 1) {
			uni.hideLoading();
			uni.showToast({
				title: '设置成功~'
			})
		} else {
			uni.hideLoading();
			uni.showToast({
				title: '设置失败~',
				icon: 'error'
			})
		}
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/setUserConfig',
		method: 'GET',
		data,
	})
}

//修改用户上级按钮
export const PostEditsuperior = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/Editsuperior',
		method: 'POST',
		data,
	})
}


//获取星标用户列表
export const GetWinkList = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/WinkList',
		method: 'GET',
		data,
	})
}


//获取用户未读消息
export const get_WorkerUserList = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/get_WorkerUserList',
		method: 'GET',
		data,
	})
}
//获取邀请店主
export const getyaoqingdianzhu = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/getInviterList',
		method: 'GET',
		data,
	})
}

//获取群聊未读消息
export const get_publicComm = (data) => {
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
		//判断返回状态 执行相应操作
		return await doRequest(response);
	}
	return http.request({
		url: '/api/shopkeeper.Userlist/get_publicComm',
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
		data,
	})
}




// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
	GetUserList,
	GetUserData,
	GetInviterList,
	PostUserDeductMoney,
	PostUserAddMoney,
	GetuserBetRecord,
	GetAccountDetails,
	GetSetUserConfig,
	PostEditsuperior,
	GetWinkList,
	get_WorkerUserList,
	get_publicComm,
	Postdaili,
	Postyongjin,
	Getuserdaili,
	Getdaililist,
	chongzhimima,
	getyaoqingdianzhu
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
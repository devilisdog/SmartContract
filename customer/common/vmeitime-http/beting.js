import http from './interface'
var AppVersion="1.1.0"
	// #ifdef APP
if (uni.getSystemInfoSync().platform === 'android' || uni.getSystemInfoSync().platform === 'ios') {
        plus.runtime.getProperty(plus.runtime.appid, (inf) => {
          // 这里的inf.version就是版本号
		  AppVersion=inf.version
        });
      } else {
        console.log('非HTML5+环境，无法获取版本号');
      }
	  	// #endif

export const Betjczq = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
		const token = uni.getStorageSync('access_token');
	    config.header = {"server": 1, "ba-user-token":token,'app-version':AppVersion}
	}
	//设置请求结束后拦截器
	http.interceptor.response = (response) => {
	    //判断返回状态 执行相应操作
	    return response;
	}
    return http.request({
        url: '/api/bettingend.bet.Betinfo/bet',
        method: 'POST', 
        data,
    })
}

export default {
	Betjczq
}

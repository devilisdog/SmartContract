import http from './interface'
/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */
const token = uni.getStorageSync('access_token');
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
export const Login = (data) => {// 登录
	http.interceptor.request = (config) => {
	     config.header = { "server": 1,'app-version':AppVersion}//添加通用参数
	 }
    return http.request({
        url: '/api/NewUser/login',
        method: 'POST', 
        data,
    })
}
// 获取首页数据
 export const GetMainInfo = async (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
		config.header = {
			"server": 1,
	        "ba-user-token":uni.getStorageSync('access_token'),
			'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url: '/api/bettingend.Index/index',
        method: 'GET', 
        data
    })
}
//获取用户个人信息
export const GetUserInfo = async (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    config.header = {
	        "server": 1,
	        "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
		var response=await doRequest(response);
	    return response;
	}
    return http.request({
        url: '/api/NewUser/index',
        method: 'GET', 
        data
    	// handle:true
    })
}
//获取订单列表
export const GetUserStateData = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
	    config.header = {
	        "server": 1,
	        "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url: '/api/bettingend.mine.Order/Orderlist',
        method: 'GET', 
        data
    })
}
//获取合买订单
export const GetUserOrdertogether = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
		
	}
	return http.request({
	    url: '/api/bettingend.mine.Order/Ordertogether',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//获取订单信息
export const GetOrderInfo = (data) => {
	
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
	    config.header = {
	        "authorization": "bearer "+ token,
			'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url: '/user/order/info',
        method: 'GET', 
        data
    	// handle:true
    })
}
//合买大厅
export const GetHemai = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.together.Index/index',
	    method: 'GET', 
	    data
		// handle:true
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

// 反馈中心提交
export const helpPost =(data)=>{
	
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token": uni.getStorageSync('access_token'),
			 'app-version':AppVersion
			 // 'Content-Type':'multipart/form-data',
	     }
	 }
	return http.request({
	    url: '/api/bettingend.mine.Feedback/feedback',
	    method: 'POST', 
	    data,
		// handle:true
	})
}


// 获取用户最新余额
export const GetUserNewMoney =(data)=>{
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {"server": 1,"ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion}
	 }
	return http.request({
	    url: '/api/bettingend.mine.Transaction/notWithdraw',
	    method: 'GET', 
	    data,
	})
}



//合买个人信息
export const GetHemaiPerson = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
		
	}
	return http.request({
	    url: '/api/bettingend.together.UserInfo/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//获取合买历史列表
export const GetHeMaiList = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
		
	}
	return http.request({
	    url: '/api/bettingend.together.UserInfo/orderlist',
	    method: 'GET', 
	    data
		// handle:true
	})
}
//参与合买
export const PostHeMai =(data)=>{
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token":uni.getStorageSync('access_token'),
			 'app-version':AppVersion
	     }
	 }
	return http.request({
	    url: '/api/bettingend.together.Index/Buy',
	    method: 'POST', 
	    data,
		// handle:true
	})
}

//获取跟单大厅各种排行榜
export const GetFollowList = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token":uni.getStorageSync('access_token'),
			'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
		
	}
	return http.request({
	    url: '/api/bettingend.follow.Index/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}
//获取跟单大厅订单类目
export const GetFollowDataList = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {"server": 1,"ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.follow.Index/totalList',
	    method: 'GET', 
	    data
	})
}
//获取用户管理数据
export const GetagentInfo = async (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
		config.header = {
			"server": 1,
	        "ba-user-token":uni.getStorageSync('access_token'),
			'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url: '/api/bettingend.mine.Agent/agentInfo',
        method: 'GET', 
        data
    })
}
//获取代理数据
export const Getuserdaili = async (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
	    //添加通用参数
		config.header = {
			"server": 1,
	        "ba-user-token":uni.getStorageSync('access_token'),'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url: '/api/bettingend.mine.Agent/getAgentById',
        method: 'GET', 
        data
    })
}

//获取跟单大厅Ta的主页
export const GetFollowPerson = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.follow.UserInfo/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}
//获取指定id 发单数据
export const GetFollowPersonDataList = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.follow.UserInfo/orderlist',
	    method: 'GET', 
	    data
		// handle:true
	})
}


//获取反馈记录
export const GetHelpRecord = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.Feedback/feedbackLog',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//点点关注
export const atten =(data)=>{
	
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
	     }
	 }
	return http.request({
	    url: '/api/bettingend.follow.UserInfo/addWink',
	    method: 'POST', 
	    data,
		// handle:true
	})
}
//取消关注
export const cancelAtten =(data)=>{
	
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
	     }
	 }
	return http.request({
	    url: '/api/bettingend.follow.UserInfo/cancelWink',
	    method: 'POST', 
	    data,
		// handle:true
	})
}

//参与跟单
export const followFollow =(data)=>{
		
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
	     }
	 }
	return http.request({
	    url: '/api/bettingend.follow.Index/addfollow',
	    method: 'POST', 
	    data,
		// handle:true
	})
}

//跟单搜索
export const GetFollowSearch = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.follow.Index/search',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//交易明细
export const GetHomeDetail = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.Transaction/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//个人资料 修改昵称
export const postName =(data)=>{
		
	http.interceptor.request = (config) => {
	     //添加通用参数
	     config.header = {
	         "server": 1,
	         "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
	     }
	 }
	return http.request({
	    url: '/api/bettingend.mine.Information/EditNickname',
	    method: 'POST', 
	    data,
	})
}

// 更换头像
export const EditAvatar = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	return http.request({
	    url: '/api/bettingend.mine.Information/EditAvatar',
	    method: 'POST', 
	    data
	})
}

// 更换昵称
export const EditNickname = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	return http.request({
	    url: '/api/bettingend.mine.Information/EditNickname',
	    method: 'POST', 
	    data
	})
}

// 充值——充值
export const Recharge = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	return http.request({
	    url: '/api/bettingend.mine.Transaction/Recharge',
	    method: 'POST', 
	    data
	})
}
//其他支付
export const qitapay = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	return http.request({
	    url: '/api/common.AliPay2/pay',
	    method: 'POST', 
	    data
	})
}
	//直付通支付
	export const zhifupay = (data) =>{
		//设置请求前拦截器
		http.interceptor.request = (config) =>{
			//添加通用参数
			config.header = {
			    "server": 1,
			    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
			}
		}
		return http.request({
		    url: '/api/common.AliPay3/pay',
		    method: 'POST', 
		    data
		})
	}
// 充值——提现
export const Withdrawal = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	return http.request({
	    url: '/api/bettingend.mine.Transaction/Withdrawal',
	    method: 'POST', 
	    data
	})
}

//提现记录
export const history = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.Transaction/history',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//提现记录
export const shopData = (data) =>{
	
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.StoreInfo/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}


//验证码邮箱
export const send = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/ems/send',
	    method: 'POST', 
	    data
		// handle:true
	})
}

//验证码手机
export const PhoneSend = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/Sms/PhoneSend',
	    method: 'POST', 
	    data
		// handle:true
	})
}
//账号注册
export const register = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/NewUser/register',
	    method: 'POST', 
	    data
		// handle:true
	})
}


//忘记密码/修改密码
export const forgetPassword = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/NewUser/forgetPassword',
	    method: 'POST', 
	    data
		// handle:true
	})
}


//领取红包
export const getRedPacket = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.RedPacket/getRedPacket',
	    method: 'POST', 
	    data
		// handle:true
	})
}

//获取红包记录
export const getRedPacketRecord = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.RedPacket/getRedPacketRecord',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//获取邀请记录
export const getIncvtie = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {
		    "server": 1,
		    "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion
		}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.Invite/index',
	    method: 'GET', 
	    data
		// handle:true
	})
}
//获取邀请榜单
export const getIncvtieList = (data) =>{
	//设置请求前拦截器
	http.interceptor.request = (config) =>{
		//添加通用参数
		config.header = {"server": 1, "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
	return http.request({
	    url: '/api/bettingend.mine.Invite/list',
	    method: 'GET', 
	    data
		// handle:true
	})
}

//最新版本跟新
export const GatVersion = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {"server": 1, "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return response;
	}
    return http.request({
        url:'/api/common.AppUpdate/index',
        method:'GET',
        data,
    })
}


//获取历史公告列表
export const get_notice_board_list = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		config.header = {"server": 1, "ba-user-token": uni.getStorageSync('access_token'),'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return response;
	}
    return http.request({
        url:'/api/shopkeeper.mine.Setup/set_notice_board_list',
        method:'GET',
        data,
    })
}

//跟单订单详情
export const followOrderInfo = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/bettingend.follow.UserInfo/orderInfo',
        method:'GET',
        data,
    })
}

//修改用户密码
export const changePassword = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {
			"server": 1,
	        "ba-user-token":token,'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/bettingend.mine.Information/changePassword',
        method:'POST',
        data,
    })
}


//实名认证
export const setUser_authentication = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {
			"server": 1,
	        "ba-user-token":token,'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/common.Common/tsst',
        method:'POST',
        data,
    })
}


//实名认证
export const get_history_list = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {
			"server": 1,
	        "ba-user-token":token,'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/common.Common/get_history',
        method:'GET',
        data,
    })
}




//获取体彩比赛数据
export const GetNewGameList = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/bettingend.bet.Betinfo/nmListdata',
        method:'GET',
        data,
    })
}
//获取合买订单详情信息
export const GetTogetherInfo= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.together.Index/togetherInfo',
        method:'GET',
        data,
    })
}



//新增银行卡
export const addBankCard= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Information/addBankCard',
        method:'POST',
        data,
    })
}

//绑定银行卡确认
export const CardConfirm= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Information/CardConfirm',
        method:'POST',
        data,
    })
}


//已绑定银行卡列表
export const CardQuery= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Information/CardQuery',
        method:'GET',
        data,
    })
}

//获取店主已有支付渠道
export const payList= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.AliPay/payList',
        method:'GET',
        data,
    })
}

//银联支付确认
export const PayConfirm= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Information/PayConfirm',
        method:'POST',
        data,
    })
}
//支付宝3.0/201支付接口
export const newAlipay= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.NewPay/pay',
        method:'POST',
        data,
    })
}

//河马支付接口
export const HmPay= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.Hmpay/pay',
        method:'POST',
        data,
    })
}
//lehsua支付接口
export const LshuaPay= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.leshuapay/h5pay',
        method:'POST',
        data,
    })
}

export const LshuayunshanPay= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.leshuapay/yunshanpay',
        method:'POST',
        data,
    })
}

//河马支付接口
export const suixingPay= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/common.suixingpay/h5pay',
        method:'POST',
        data,
    })
}

//绑定手机号码或更换手机号
export const changePhone= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Information/changePhone',
        method:'POST',
        data,
    })
}

//获取未读信息
export const get_WorkerUserList= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Msg/get_user_msg_obj',
        method:'GET',
        data,
    })
}

export const cancel_chat= (data) => {//消息撤回
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Msg/cancel_msg',
        method:'POST',
        data,
    })
}

//获取可跟单的列表数据
export const getUsableFollowList= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.follow.Index/totalList',
        method:'GET',
        data,
    })
}
//获取佣金用户详情
export const getUseryonglist= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Agent/info',
        method:'GET',
        data,
    })
}
//获取佣金用户账单详情
export const getUserdailiyong= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Agent/AccountDetails',
        method:'GET',
        data,
    })
}
//获取佣金用户账单详情
export const getUserdailiyongxia= (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	   return await doRequest(response); 
	}
    return http.request({
        url:'/api/bettingend.mine.Agent/Orderlist',
        method:'GET',
        data,
    })
}
export const execute= ( data={},token )=>{//重新执行api
	http.interceptor.request = (config) => {//设置请求前拦截器
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}	   //添加通用参数
	}
	http.interceptor.response =  (response) => {//设置请求结束后拦截器
	   return response;
	}
	return http.request({
	    url:data.config.url.slice(21,data.config.url.length),
	    method:data.config.method,
	    data:{},
	})
}

//更新token获取最新token
export const GetNewToken = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server": 1,"ba-user-token":token,'app-version':AppVersion}
	}
	http.interceptor.response =  (response) => {//设置请求结束后拦截器
	   return response;
	}
    return http.request({
        url:'/api/common/refreshToken',
        method:'POST',
        data,
    })
}

//预览线下收款图片
export const YulanShoukuangImg = (data) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {"server":1,"ba-user-token":token,'app-version':AppVersion}
	}
	//设置请求结束后拦截器
	http.interceptor.response = async (response) => {//设置请求结束后拦截器
	    //判断返回状态 执行相应操作
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/shopkeeper.mine.Receipt/YulanShoukuangImg',
        method:'POST',
        data,
    })
}
// 轮询查询订单
export const Getdingdan = (data,head) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {
			"server": 1,
	        "ba-user-token":token,'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    //判断返回状态 执行相应操作
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/common.AliPay2/query',
        method: 'GET', 
        data,
		header:head,
    })
}
// 轮询查询订单
export const Getdingdantype = (data,head) => {
	//设置请求前拦截器
	http.interceptor.request = (config) => {
		const token = uni.getStorageSync('access_token');//避免全局获取token失效
	    //添加通用参数
	    config.header = {
			"server": 1,
	        "ba-user-token":token,'app-version':AppVersion
	    }
	}
	http.interceptor.response =  async (response) => {//设置请求结束后拦截器
	    //判断返回状态 执行相应操作
	   return await doRequest(response);
	}
    return http.request({
        url:'/api/common.AliPay2/RechargeRefresh',
        method: 'GET', 
        data,
		header:head,
    })
}

// 默认全部导出  import api from '@/common/vmeitime-http/'
export default {
    Login,
	GetMainInfo,
	GetUserInfo,
	GetOrderInfo,
	GetUserStateData,
	GetUserOrdertogether,
	GetHemai,
	GetHemaiPerson,
	GetHeMaiList,
	PostHeMai,
	GetFollowList,
	GetFollowDataList,
	helpPost,
	GetHelpRecord,
	GetFollowPerson,
	GetFollowPersonDataList,
	atten,
	cancelAtten,
	followFollow,
	GetFollowSearch,
	GetHomeDetail,
	postName,
	EditAvatar,
	EditNickname,
	Recharge,
	Withdrawal,
	history,
	shopData,
	send,
	register,
	forgetPassword,
	getRedPacket,
	getRedPacketRecord,
	getIncvtie,
	GatVersion,
	followOrderInfo,
	changePassword,
	getIncvtieList,
	setUser_authentication,
	PhoneSend,
	GetNewToken,
	GetNewGameList,
	GetTogetherInfo,
	addBankCard,
	CardConfirm,
	CardQuery,
	payList,
	PayConfirm,
	newAlipay,
	changePhone,
	getUsableFollowList,
	GetUserNewMoney,
	HmPay,
	get_history_list,
	get_WorkerUserList,
	cancel_chat,
	get_notice_board_list,
	LshuaPay,
	suixingPay,
	LshuayunshanPay,
	YulanShoukuangImg,
	GetagentInfo,
	Getuserdaili,
	getUseryonglist,
	getUserdailiyong,
	getUserdailiyongxia,
	qitapay,
	Getdingdan,
	Getdingdantype,
	zhifupay,
	Getkaiji
}
import { useCounterStore } from '@/stores/counter'
async function doRequest(response) {// 刷新 token 方法
	const counter = useCounterStore();//状态管理
	if(response.data.code!=303 &&response.data.code!=302 && response.data.code!=409){return response}//token没有过期直接拦截
	if(uni.getStorageSync('refresh_token')!=''){
		var getnewToken=await GetNewToken({'refresh_token':uni.getStorageSync('refresh_token')}).then(async function(res_two){
			if(res_two.data.code==1){
				uni.setStorageSync('access_token',res_two.data.data.token); //物理缓存用户token
				counter.access_token = res_two.data.data.token //登录生成的token
				var executeData=await execute(response,res_two.data.data.token).then(new_res=>{return new_res})
				return executeData
			}else{
				//token过期跳转登录
				uni.showToast({title:res_two.data.msg,icon:'none',position:'center'})
				uni.reLaunch({url:'/pages/login/login'})
				return response
			}
		})
		return getnewToken
	}else{
		uni.showToast({title:response.data.msg,icon:'none',position:'center'})
		uni.reLaunch({url:'/pages/login/login'})
		return response
	}
}
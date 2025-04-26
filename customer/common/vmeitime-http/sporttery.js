import http from './interface'

var AppVersion = '1.1.0'
// #ifdef APP
if (uni.getSystemInfoSync().platform === 'android' || uni.getSystemInfoSync().platform === 'ios') {
    plus.runtime.getProperty(plus.runtime.appid, inf => {
        // 这里的inf.version就是版本号
        AppVersion = inf.version
    })
} else {
    console.log('非HTML5+环境，无法获取版本号')
}
// #endif
const token = uni.getStorageSync('access_token')
// 获取竞彩足球数据
export const Getjczq = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/Getjczq',
        method: 'GET',
        data,
        // handle:true
    })
}

// 获取竞彩蓝球数据
export const Getjclq = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/Getjclq',
        method: 'GET',
        data,
        // handle:true
    })
}

// 获取竞彩蓝球数据
export const Getbjdc = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/Getbjdc',
        method: 'GET',
        data,
        // handle:true
    })
}

// 获取传统足球数据
export const Getctzq = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/Getctzq',
        method: 'GET',
        data,
        // handle:true
    })
}

// 获取福彩历史开奖数据
export const GetWelfareKJ = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/GetWelfareKJ',
        method: 'GET',
        data,
        // handle:true
    })
}

// 获取体育数字彩开奖数据
export const GetHistory = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/bettingend.bet.Betinfo/getHistory',
        method: 'GET',
        data,
        // handle:true
    })
}
export const Gettoken = data => {
    //设置请求前拦截器
    http.interceptor.request = config => {
        //添加通用参数
        config.header = {
            server: 1,
            'ba-user-token': uni.getStorageSync('access_token'),
            'app-version': AppVersion,
        }
    }
    //设置请求结束后拦截器
    http.interceptor.response = response => {
        //判断返回状态 执行相应操作
        return response
    }
    return http.request({
        url: '/api/common/getHongHuohuoAuthToken',
        method: 'GET',
        data,
        // handle:true
    })
}

//获取足球-竞猜赛果
export const GetFootballResult = data => {
    http.interceptor.request = config => {
        const token = uni.getStorageSync('access_token') //避免全局获取token失效
        //添加通用参数
        config.header = { server: 1, 'ba-user-token': token, 'app-version': AppVersion }
    }
    http.interceptor.response = response => {
        //设置请求结束后拦截器
        return response
    }

    return http.request({
        url: '/api/match_bet/getFootballMatchesBet',
        method: 'GET',
        data,
    })
}

//获取足球-即时，北单，胜负彩
export const GetFootballMatch = data => {
    http.interceptor.request = config => {
        const token = uni.getStorageSync('access_token') //避免全局获取token失效
        //添加通用参数
        config.header = { server: 1, 'ba-user-token': token, 'app-version': AppVersion }
    }
    http.interceptor.response = response => {
        //设置请求结束后拦截器
        return response
    }

    return http.request({
        url: '/api/match_bet/getFootballMatchInfo',
        method: 'GET',
        data,
    })
}

//获取篮球-竞猜赛果
export const GetBasketballResult = data => {
    http.interceptor.request = config => {
        const token = uni.getStorageSync('access_token') //避免全局获取token失效
        //添加通用参数
        config.header = { server: 1, 'ba-user-token': token, 'app-version': AppVersion }
    }
    http.interceptor.response = response => {
        //设置请求结束后拦截器
        return response
    }

    return http.request({
        url: '/api/match_bet/getBasketballMatchesBet?',
        method: 'GET',
        data,
    })
}

//获取篮球-即时，北单，胜负彩
export const GetBasketballMatch = data => {
    http.interceptor.request = config => {
        const token = uni.getStorageSync('access_token') //避免全局获取token失效
        //添加通用参数
        config.header = { server: 1, 'ba-user-token': token, 'app-version': AppVersion }
    }
    http.interceptor.response = response => {
        //设置请求结束后拦截器
        return response
    }

    return http.request({
        url: '/api/match_bet/getBasketballMatchInfo',
        method: 'GET',
        data,
    })
}

export default {
    GetBasketballMatch,
    GetFootballMatch,
    GetFootballResult,
    GetBasketballResult,
    Getjczq,
    Getjclq,
    Getbjdc,
    Getctzq,
    GetWelfareKJ,
    GetHistory,
    Gettoken,
}

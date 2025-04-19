//生产环境
const prod = {
	BASE_API: '/api',
	WEBSOCKET_API: '/ws',
	ENVIRONMENT:'prod'
}

//开发环境
const dev = {
	BASE_API: 'http://192.168.0.154:48080',
	WEBSOCKET_API: 'ws://192.168.0.154:32597',
	ENVIRONMENT:'dev'
}


/*
=================注意根据需要改变环境================
 */
const environment = dev;


export default {
	CNF: environment.ENVIRONMENT,
	BASE_API: environment.BASE_API,
	WEBSOCKET_API: environment.WEBSOCKET_API,
}
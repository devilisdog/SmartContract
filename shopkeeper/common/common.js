
/**
 * 数组排序
 * @param {array} list 
 * @returns {array}
 */
const ArraySort = (list) => {
	var list2 = []
	list2 = list.sort(function(a, b) {
		var an = a.match(/\d+(.\d+)?/g)[0];
		var bn = b.match(/\d+(.\d+)?/g)[0];
		if (parseFloat(an) > parseFloat(bn)) {
			return 1
		} else if (parseFloat(an) < parseFloat(bn)) {
			return -1
		} else {
			return a.localeCompare(b)
		}
	})
	return list2
}
/**
 * 取指定范围数量的随机数
 * @param {number} min //最小值
 * @param {number} max //最大值
 * @param {number} count //指定数量
 * @returns {array}
 */
const GetRandomArray = (min, max, count) => {
	let num = [] //定义一个空数组
	while (num.length < count) { //不断产生随机数字
		let ran = Math.floor(Math.random() * max + min)
		//Math.floor向上取整，Math.random产生0到1不包含1的随机数
		// 比如随机产生一个0.9，0.9*16=14.4，向上取整后就是15，在加1就是16
		// 所以上面这个表达式就是求1到16范围内的随机数
		if (num.find(x => x === ran) === undefined) {
			// 去除重复元素
			// find方法，把数组的元素遍历，返回符合的元素，没有返回undefined，
			// 这里是如果数组里没有这个新产生的随机数，就把它加入数组
			num.push(ran)
		}
		// if(num.some(x=>x===ran)===false){
		// 用some方法也可以达到同样效果，
		// 如果有符合条件的元素返回true，没有返回false
		//  num.push(ran)
		// }

	}
	return num
}

/**
 * 取元素组合数
 * @param {number} m //数组的数量
 * @param {number} n //取指定的数量
 * @return {number}
 */
const TakeMN =(m,n)=>{
		
	var x = 1
	for(var i=1;i<=n;i++){
		x =x*(m-i+1)
	}
	var y = 1
	for(var o=1;o<=n;o++){
		y=y*(n-o+1)
	}
	
	return x/y

}

// 获取手机屏幕宽高
	const scrollH=()=>{
		let sys = uni.getSystemInfoSync();
		let winWidth = sys.windowWidth;
		let winrate = 750/winWidth;
		let winHeight =parseInt(sys.windowHeight*winrate)
		//console.log('winHeight',winHeight)
		return winHeight
	}

//解析时间戳
function getData(n) {
	n = new Date(n*1000)
	return n.toLocaleDateString().replace(/\//g, "-") + " " + n.toTimeString().substr(0, 8)
}

//查找title找到对应的图片
function findImg(e){
	var arr2={
		'竞彩足球':'/static/lottery/407.png',
		'竞彩篮球':'/static/lottery/406.png',
		'胜负过关':'/static/lottery/404.png',
		'北京单场':'/static/lottery/405.png',
		'双色球':'/static/lottery/101.png',
		'大乐透':'/static/lottery/201.png',
		'排列三':'/static/lottery/202.png',
		'排列五':'/static/lottery/203.png',
		'七星彩':'/static/lottery/204.png',
		'七乐彩':'/static/lottery/104.png',
		'快乐八':'/static/lottery/105.png',
		'福彩3D':'/static/lottery/102.png',
		'任选九':'/static/lottery/402.png',
		'胜负彩':'/static/lottery/401.png',
	}
	return arr2[e]
}


//根据订单状态数值，返回状态标题
function orderState(e){
	var viewdata = ['认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖','已流单']
	return viewdata[e]
}


function music(){
	const innerAudioContext =uni.createInnerAudioContext();
	innerAudioContext.autoplay=true
	innerAudioContext.src = '../../static/du.mp3'
	innerAudioContext.play()
}
import api from "@/common/vmeitime-http/index/index.js"
import {useCounterStore} from '@/stores/counter'

const getUserInfo= async ()=>{//更新用户数据
	const counter = useCounterStore() //状态管理
	await api.GetUserDataInfo().then((res) => {
		if (res.data.code === 1) {
			// if(res.data.data.appIsOpen.shop.value=='true'){//系统关闭拦截
			// 	uni.showModal({
			// 		title:'注意',
			// 		content:res.data.data.appIsOpen.shop.content,
			// 		confirmText:'退出',
			// 		success: function(res_two) {
			// 			uni.hideTabBar()
			// 			if(res_two.confirm){
			// 				switch (uni.getSystemInfoSync().platform) {
			// 				    case 'android':
			// 				        plus.runtime.quit();
			// 				    break;
			// 				    case 'ios':
			// 				        plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
			// 				    break;
			// 				}
			// 			}
			// 		}
			// 	});
			// }
			uni.setStorageSync('access_shop_token', res.data.data.userinfo.token); //物理缓存用户token
			counter.access_token = res.data.data.userinfo.token //登录生成的token
			counter.refresh_token = res.data.data.userinfo.refreshToken //长期令牌用来刷新
			
			counter.hasLogin = true //登录状态（true登录/false登出)
			counter.pageShow=true
			counter.appOpen=res.data.data.appIsOpen.shop
			
			counter.push_key=res.data.data.push_key
			if (res.data.data.userinfo.group_id == 3) {//判断是否是员工登录
				counter.staffLoginInfo = res.data.data.clerkInfo
				
				counter.shopBasicsData = {
                    ...res.data.data.userinfo,
					banner:res.data.data.userinfo.banner? JSON.parse(res.data.data.userinfo.banner) : []
                } //店员的基础信息
				counter.isneedimgnumber = res.data.data.clerkInfo.ShopConfig.isneedimgnumber
			}else{
				counter.shopBasicsData = {
                    ...res.data.data.userinfo,
					banner:res.data.data.userinfo.banner? JSON.parse(res.data.data.userinfo.banner) : []
                } //店主的基础信息
				counter.isneedimgnumber = res.data.data.userinfo.ShopConfig.isneedimgnumber
				// console.log('counter.isneedimgnumber',counter.isneedimgnumber);
			}
			if (counter.shopBasicsData.group_id == 2) {//判断店铺是否已认证
				if(counter.shopBasicsData.ShopConfig.StoreCertification == 0){
					uni.showModal({
						title: '注意',
						content: '检测到此店铺未进行认证，未认证会导致部分功能无法使用！',
						confirmText: '去认证',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/mimeSupPage/attestation/shopArresrarion',
									animationType: "slide-in-bottom"
								})
							}
						}
					});
				}
			}
		}
	})
}


//敏感词
const sensitiveWordsArray = ['加','加我','联系','wx','微信','你妹的','你大爷','傻','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
/**
 * 检测
 * @param {String} str 检测的字符
 * @return {Boolean} 是否存在敏感词
 * */ 
function flition(str,sensitiveWordslist=null) {
	if(sensitiveWordslist){
		var sensitiveWordsArray=sensitiveWordslist
	}
	// console.log(1,sensitiveWordsArray);
	for (let i = 0; i < sensitiveWordsArray.length; i++) {
		for (let j = 0; j <= str.length - sensitiveWordsArray[i].length; j++) {
			//根据敏感字符个数截取str的字符进行判断
			if (sensitiveWordsArray[i] == str.slice(j, j + sensitiveWordsArray[i].length)) {
				return true
			}
		}
	}
	return false
}


/**
 * 替换
 * @param {String} str 检测的字符
 * @param {String} char 替换的字符
 * @return {String} 替换后的文字
*/
function replace(str, char,sensitiveWordslist=null) {
	
	if(sensitiveWordslist){
		var sensitiveWordsArray=sensitiveWordslist
	}
	
	//str: 需要进行替换的字符串
	//char: 需要替换的字符
	//遍历敏感词库
	for (let i = 0; i < sensitiveWordsArray.length; i++) {
		for (let j = 0; j <= str.length - sensitiveWordsArray[i].length; j++) {
			//根据敏感字符个数截取str的字符进行判断
			if (sensitiveWordsArray[i] == str.slice(j, j + sensitiveWordsArray[i].length)) {
				let c = "";
				for (let k = 0; k < sensitiveWordsArray[i].length; k++) {
					c += char;
				}
				str = str.slice(0, j) + c + str.slice(j + sensitiveWordsArray[i].length);
			}
		}
	}
	return str;
}

export default {
	ArraySort,
	GetRandomArray,
	TakeMN,
	scrollH,
	getData,
	findImg,
	orderState,
	music,
	getUserInfo,
	flition,
	replace
}

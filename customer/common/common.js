/**
 * 竞彩选择项转换对应的玩法
 * @param {number} id 
 */
const convertplay = function(id,type) {
	if(type=='jczq'){
		if (id <= 2) {
			return 'HAD';
		}
		if (id >= 3 && id <= 5) {
			return 'HHAD';
		}
		if (id >= 6 && id <= 36) {
			return 'CRS';
		}
		if (id >= 37 && id <= 45) {
			return 'HAFU';
		}
		if (id >= 46 && id <= 53) {
			return 'TTG';
		}
	}
	if(type=='jclq'){
		if (id <= 1) {
			return 'MNL';
		}
		if (id >= 2 && id <= 3) {
			return 'HDC';
		}
		if (id >= 4 && id <= 5) {
			return 'HILO';
		}
		if (id >= 6 && id <= 17) {
			return 'WNM';
		}
		
	}
	if(type=='bjdc'){
		return '';
	}
	
};

/**
 * 注数计算 
 * @param {Array} arr 
 * @param {string} str 
 * @returns {number}
 */
const ComputeNote = function(arr, str) {
	//var arr = Array(1, 1, 1)
	//var str = '2串1,3串1'
	// console.log('str',str);
	var Note = 0 //总的注数
	if (str.indexOf('单关') !== -1) {
		Note = Note + NoteCompute(arr, 1)
	}
	if (str.indexOf('1单关1') !== -1) {
		Note = Note + NoteCompute(arr, 1)
	}

	if (str.indexOf('2串1') !== -1) {
		Note = Note + NoteCompute(arr, 2)
	}

	if (str.indexOf('3串1') !== -1) {
		Note = Note + NoteCompute(arr, 3)
	}

	if (str.indexOf('4串1') !== -1) {
		Note = Note + NoteCompute(arr, 4)
	}

	if (str.indexOf('5串1') !== -1) {
		Note = Note + NoteCompute(arr, 5)
	}

	if (str.indexOf('6串1') !== -1) {
		Note = Note + NoteCompute(arr, 6)
	}

	if (str.indexOf('7串1') !== -1) {
		Note = Note + NoteCompute(arr, 7)
	}
	
	if (str.indexOf('8串1') !== -1) {
		Note = Note + NoteCompute(arr, 8)
	}

	if (str.indexOf('9串1') !== -1) {
		Note = Note + NoteCompute(arr, 9)
	}
	
	if (str.indexOf('10串1') !== -1) {
		Note = Note + NoteCompute(arr, 10)
	}
	
	if (str.indexOf('11串1') !== -1) {
		Note = Note + NoteCompute(arr, 11)
	}
	
	if (str.indexOf('12串1') !== -1) {
		Note = Note + NoteCompute(arr, 12)
	}
	
	if (str.indexOf('13串1') !== -1) {
		Note = Note + NoteCompute(arr, 13)
	}
	
	if (str.indexOf('14串1') !== -1) {
		Note = Note + NoteCompute(arr, 14)
	}
	
	if (str.indexOf('15串1') !== -1) {
		Note = Note + NoteCompute(arr, 15)
	}
	
	return Note
};


/**
 * 奖金计算 
 * @param {Array} arr1 //最大赔率数组
 * @param {Array} arr2 //最小赔率数组
 * @param {Array} str //
 * @returns {array}
 */
const ComputeBonus = function(arr1, arr2, str) {
	//console.log(arr1,arr2)
	var maxlist = []
	var minlist = []
	//var arr = Array(1, 1, 1)
	//var str = '2串1,3串1'
	var Bonus = 0 //总的注数
	if (str.indexOf('单关') !== -1) {
		if (arr1[0] === arr2[0]) {
			maxlist.push(arr1[0])
			minlist.push(0)
		} else {
			maxlist.push(arr1[0])
			minlist.push(arr2[0])
		}
	}
	
	if (str.indexOf('1单关1') !== -1) {
		if (arr1[0] === arr2[0]) {
			maxlist.push(arr1[0])
			minlist.push(0)
		} else {
			maxlist.push(arr1[0])
			minlist.push(arr2[0])
		}
	}

	if (str.indexOf('2串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 2) * 2)
		minlist.push(BonusComputeMin(arr2, 2) * 2)
	}

	if (str.indexOf('3串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 3) * 2)
		minlist.push(BonusComputeMin(arr2, 3) * 2)
	}

	if (str.indexOf('4串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 4) * 2)
		minlist.push(BonusComputeMin(arr2, 4) * 2)
	}

	if (str.indexOf('5串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 5) * 2)
		minlist.push(BonusComputeMin(arr2, 5) * 2)
	}

	if (str.indexOf('6串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 6) * 2)
		minlist.push(BonusComputeMin(arr2, 6) * 2)
	}

	if (str.indexOf('7串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 7) * 2)
		minlist.push(BonusComputeMin(arr2, 7) * 2)
	}

	if (str.indexOf('8串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 8) * 2)
		minlist.push(BonusComputeMin(arr2, 8) * 2)
	}
	
	if (str.indexOf('9串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 9) * 2)
		minlist.push(BonusComputeMin(arr2, 9) * 2)
	}
	
	if (str.indexOf('10串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 10) * 2)
		minlist.push(BonusComputeMin(arr2, 10) * 2)
	}
	
	if (str.indexOf('11串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 11) * 2)
		minlist.push(BonusComputeMin(arr2, 11) * 2)
	}
	
	if (str.indexOf('12串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 12) * 2)
		minlist.push(BonusComputeMin(arr2, 12) * 2)
	}
	
	if (str.indexOf('13串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 13) * 2)
		minlist.push(BonusComputeMin(arr2, 13) * 2)
	}
	
	if (str.indexOf('14串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 14) * 2)
		minlist.push(BonusComputeMin(arr2, 14) * 2)
	}
	//
	if (str.indexOf('15串1') !== -1) {
		maxlist.push(BonusComputeMax(arr1, 15) * 2)
		minlist.push(BonusComputeMin(arr2, 15) * 2)
	}
	var data = []

	if (str == []) {
		data.push({
			'max': 0,
			'min': 0,
		})
	} else {
		data.push({
			'max': arrayMax(maxlist),
			'min': arrayMin(minlist),
		})

	}

	return data
}

/**
 * 过关注数计算
 * @param {*} arr  //[5，2]
 * @param {*} num 	7
 * @returns {number} Note过关的注数
 */
const NoteCompute = (arr, num) => {
	var Note = 0 //总的注数
	var list = integerRange(arr, num)

	var note1 = 0 //
	var note2 = 0

	for (var i = 0; i <= list.length - 1; i++) {
		var strtext = list[i].split("#")
		//删除第一个空白数组
		strtext.shift()

		for (var o = 0; o <= strtext.length - 1; o++) {
			if (o == 0) {
				note2 = parseInt(strtext[o])
			} else {
				note2 = note2 * parseInt(strtext[o])
			}
		}
		note1 = note1 + note2


	}

	Note = Note + note1

	return Note
}



/**
 * 最大过关赔率计算
 * @param {*} arr 
 * @param {*} num 
 * @returns {number} Note过关的注数
 */
const BonusComputeMax = (arr, num) => {

	var Bonus = 0 //总的注数
	var list = integerRange(arr, num)

	var Bonus1 = 0 //
	var Bonus2 = 0

	for (var i = 0; i <= list.length - 1; i++) {
		var strtext = list[i].split("#")
		//删除第一个空白数组
		strtext.shift()

		for (var o = 0; o <= strtext.length - 1; o++) {
			if (o == 0) {
				Bonus2 = strtext[o]
			} else {
				Bonus2 = Bonus2 * strtext[o]
			}
		}
		Bonus1 = Bonus1 + Bonus2


	}

	Bonus = Bonus + Bonus1
	return Bonus
}

/**
 * 最小过关赔率计算
 * @param {*} arr 
 * @param {*} num 
 * @returns {number} Note过关的注数
 */
const BonusComputeMin = (arr, num) => {

	var Bonus = 0 //总的注数
	var array = []
	var list = integerRange(arr, num)

	var Bonus1 = 0 //
	var Bonus2 = 0

	for (var i = 0; i <= list.length - 1; i++) {
		var strtext = list[i].split("#")
		//删除第一个空白数组
		strtext.shift()

		for (var o = 0; o <= strtext.length - 1; o++) {
			if (o == 0) {
				Bonus2 = strtext[o]
			} else {
				Bonus2 = Bonus2 * strtext[o]
			}
		}
		array.push(Bonus2)
	}

	return arrayMin(array)
}

/**
 * 整数排列组合
 * @param {Array} arr 
 * @param {number} num 
 * @returns {array}
 */
const integerRange = (arr, num) => {
	var list = []
	for (var i = 1; i <= Math.pow(2, arr.length) - 1; i++) {

		var k = 0
		var str = ''
		var j = 1
		var p = i

		while (p != 0) {
			if (p % 2 === 1) {
				k = k + 1
				str = str + '#' + arr[j - 1]
			}
			p = Math.trunc(p / 2)
			j = j + 1
		}

		if (k == num) {
			list.push(str)

		}
	}

	return list
}



/**
 * 足球竞彩金额计算 公式 注数*倍数*2
 * @param {*} Note 
 * @param {*} Multiple 
 */
const ComputeAmount = (Note, Multiple) => {
	return Note * Multiple * 2
}


/**
 * 取数组中最小的值
 * @param {array} arrs 
 * @returns {number}
 */
function arrayMin(arrs) {
	var min = arrs[0];
	for (var i = 1, ilen = arrs.length; i < ilen; i += 1) {
		if (arrs[i] < min) {
			min = arrs[i];
		}
	}
	return min;
}

/**
 * 取数组中最大的值
 * @param {array} arrs 
 * @returns {number}
 */
function arrayMax(arrs) {
	var max = arrs[0];
	for (var i = 1, ilen = arrs.length; i < ilen; i++) {
		if (arrs[i] > max) {
			max = arrs[i];
		}
	}
	return max;
}

/**
 * 超出指定的长度显示...
 * @param {string} str 
 * @param {number} limitLen 
 */
function formatEllipsis(str = '', limitLen = 24) {
	let len = 0,
		reg = /[\x00-\xff]/, //半角字符的正则匹配
		strs = str.split(''),
		inx = strs.findIndex(s => {
			len += reg.test(s) ? 1 : 2
			if (len > limitLen) return true
		})
	return inx === -1 ? str : str.substr(0, inx) + '...'
}


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

/**
 * 将数字转换为万,万元,亿元,万亿
 * @param {number} num //需要转换的数字
 * @return {number}
 */
function unitConvert(num) {
	    var moneyUnits = ["元", "万元", "亿元", "万亿"] 
	    var dividend = 10000;
	    var curentNum = num;
	    //转换数字 
	    var curentUnit = moneyUnits[0];
	    //转换单位 
	    for (var i = 0; i <4; i++) { 
	        curentUnit = moneyUnits[i] 
	        if(strNumSize(curentNum)<5){ 
	            break;
	        }
	        curentNum = curentNum / dividend 
	    } 
	    var m = {num: 0, unit: ""} 
	    m.num = curentNum.toFixed(2)
	    m.unit = curentUnit;
	    return m;
		
		function strNumSize(tempNum){
		    var stringNum = tempNum.toString() 
		    var index = stringNum.indexOf(".") 
		    var newNum = stringNum;
		    if(index!=-1){
		        newNum = stringNum.substring(0,index) 
		    } 
		    return newNum.length
		}
	}

/**
 * 数字数组排序 --递归算法
 * @param {array} arr //需要转换的数字
 * @return {arr}
 */
var quickSort = function(arr) {
	if (arr.length <= 1) {
		return arr;
	}
	var index = Math.floor(arr.length / 2);
	var middle = arr.splice(index, 1)[0];
	var left = [];
	var right = [];
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] < middle) {
			left.push(arr[i]);
		} else {
 			right.push(arr[i]);
		}
	}
	return quickSort(left).concat([middle], quickSort(right)); // 递归
};


/**
 * 获取手机屏幕高度
 * @return {number} 
 */
const scrollH=()=>{
	let sys = uni.getSystemInfoSync();
	let winWidth = sys.windowWidth;
	let winrate = 750/winWidth;
	let winHeight =parseInt(sys.windowHeight*winrate)
	//console.log('winHeight',winHeight)
	return winHeight
	
}

/**
 * 玩法类型转化
 **/
 const playType =(value)=>{
	 var list = ['竞彩足球','竞彩篮球','胜负过关','北京单场','大乐透','排列三','排列五','七星彩','任选九','胜负彩','双色球','七乐彩','快乐八','福彩3D']
	 var index = list.findIndex(item =>item == value)
	return index
 }
 
 const ganmeId =(title)=>{//玩法id转换
 	 var list = ['竞彩足球','竞彩篮球','胜负过关','北京单场','大乐透','排列三','排列五','七星彩','任选九','胜负彩','双色球','七乐彩','快乐八','福彩3D']
 	return list.indexOf(title)
 }
 //取最小投注截止时间
 const minTiem = (e) =>{
	const counter = useCounterStore();//状态管理
 	const TiemData = [];
 	for(var i = 0 ; i < e.length ; i++){
		var newTime=e[i].orderDeadline.split('-')
		var initTime=newTime.join('/')
		TiemData.push(new Date(initTime) / 1000)
 	}
	var newMin=new Date(Math.min(...TiemData)*1000)
	newMin.setMinutes(newMin.getMinutes()+Number(counter.gameAstrict.advance))
 	return newMin.getTime()/1000
 }
 //取最大比赛时间
 const maxTiem=(e)=>{
	 const counter = useCounterStore();//状态管理
	 const TiemData = [];
	 for(var i = 0 ; i < e.length ; i++){
		var newTime=e[i].gameDeadline.split('-')
		var initTime=newTime.join('/')
	 	TiemData.push(new Date(initTime) / 1000)
	 }
	 var newMax=new Date(Math.max(...TiemData)*1000)
	 newMax.setMinutes(newMax.getMinutes()+Number(counter.gameAstrict.advance))
	 return newMax.getTime()/1000
 }
 const addTime=(time)=>{
	 const counter = useCounterStore();//状态管理
	 var newTime=new Date(time*1000)
	 newTime.setMinutes(newTime.getMinutes()+Number(counter.gameAstrict.advance))
	 return newTime.getTime()/1000
 }
 
 //每三位数加0
const toThousands =(num)=> {
     var num = (num || 0).toString(), result = '';
     while (num.length > 3) {
         result = ',' + num.slice(-3) + result;
         num = num.slice(0, num.length - 3);
     }
     if (num) { result = num + result; }
     return result;
 }
 
 // 中间部分*
 /**
  * str : 字符串
  * frontLen : 头要几位
  * endLen : 尾要几位
  **/
 const hidden=(str, frontLen, endLen)=> {
   //str：要进行隐藏的变量  frontLen: 前面需要保留几位    endLen: 后面需要保留几位
   var len = str.length - frontLen - endLen;
   var xing = "";
   for (var i = 0; i < len; i++) {
     xing += "*";
   }
   return (
     str.substring(0, frontLen) + xing + str.substring(str.length - endLen)
   );
 }
 
 //格式化时间
 /*
	dtStr : 啥都可以
	e : 格式化类型
 */
	const dateFormat =(dtStr,e)=>{
		const dt = new Date(dtStr);
		
		function padZero(n){
		   return n > 9 ? n : '0' + n
		}
		//年月日 时分秒
		const y = dt.getFullYear()
		const m = padZero(dt.getMonth() + 1)
		const d = padZero(dt.getDate())
	
		const hh = padZero(dt.getHours())
		const mm = padZero(dt.getMinutes())
		const ss = padZero(dt.getSeconds())
		
		if(e == 1){
			return y+'/'+m+'/'+d
		}else if(e == 2){
			return hh+':'+mm
		}else{
			return y+'/'+m+'/'+d+' '+hh+':'+mm+':'+ss
		}
	}
	const objectOrder=(obj)=>{//排序的函数（解决for in的key值混乱的问题）
		var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
		var newObj = {};//创建一个新的对象，用于存放排好序的键值对
		for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
		    newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
		}
		return newObj;//返回排好序的新对象
	}
	
	
	//根据订单状态数值，返回状态标题
	function orderState(e){
		var viewdata = ['认购中','待接单','待出票','玩家撤销','店主撤销','系统撤销','待开奖','待中奖','未中奖','待派奖','已派奖','已流单']
		return viewdata[e]
	}
	
	/**
	 * 判断是否json
	 * @param $string
	 * @returns {boolean}
	 */
	function isJson(string){//json转字符串
		try {
			if(typeof JSON.parse(string) == 'string'){
				return JSON.parse(string);
			}
			return string;
		} catch (e) {
			return string;
		}
	}
	
	//获取用户信息
	import { useCounterStore } from '@/stores/counter'
	import api from "@/common/vmeitime-http/"
	const getUserInfo= async (number)=>{
		const counter = useCounterStore();//状态管理
		await api.GetUserInfo().then((res) => {
			if (res.data.code === 1) { //=1是成功
				// if(res.data.data.appIsOpen.user.value=='true'){
				// 	uni.showModal({
				// 		title:'注意',
				// 		content:res.data.data.appIsOpen.shop.content,
				// 		confirmText:'退出',
				// 		showCancel:false,
				// 		success: function(res) {
				// 			uni.hideTabBar()
				// 			switch (uni.getSystemInfoSync().platform) {
				// 				case 'android':
				// 					plus.runtime.quit();
				// 				break;
				// 				case 'ios':
				// 					plus.ios.import('UIApplication').sharedApplication().performSelector('exit');
				// 				break;
				// 			}
				// 		}
				// 	});
				// }
				counter.onHide_boole=false
				counter.hasLogin=true;//更改状态管理登录状态
				uni.setStorageSync('shop_id', res.data.data.userinfo.shop_id);
				uni.setStorageSync('user_id', res.data.data.userinfo.id);
				//数据注释参考登录哪里
				counter.user_id=res.data.data.userinfo.id//账户ID
				counter.user_imgs = res.data.data.userinfo.avatar;
				counter.Betrecord = res.data.data.orderinfo;
				counter.nickname = res.data.data.userinfo.nickname
				counter.shop_id = res.data.data.userinfo.shop_id;
				counter.user_id = res.data.data.userinfo.id;
				counter.sfz_id = res.data.data.userinfo.sfz_id;
				counter.sfz_name = res.data.data.userinfo.sfz_name;
				counter.user_money = res.data.data.userinfo.money;
				counter.Win_money=res.data.data.userinfo.Win_money
				counter.redPacketBoole=res.data.data.redPacket//用户是否有可领红包
				counter.mobile=res.data.data.userinfo.mobile
				counter.shop_id=res.data.data.userinfo.shop_id//用户默认选择的店铺id
				counter.UserConfig=res.data.data.userinfo.Config
				counter.userAllData=res.data.data
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
	function flition(str) {
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
	function replace(str, char) {
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
	convertplay,
	ComputeNote,
	integerRange,
	ComputeAmount,
	ComputeBonus,
	arrayMin,
	arrayMax,
	formatEllipsis,
	ArraySort,
	GetRandomArray,
	TakeMN,
	NoteCompute,
	unitConvert,
	quickSort,
	scrollH,
	playType,
	minTiem,
	toThousands,
	hidden,
	dateFormat,
	ganmeId,
	maxTiem,
	getUserInfo,
	objectOrder,
	orderState,
	addTime,
	isJson,
	flition,
	replace
}

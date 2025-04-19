//获取当前日期函数
const getNowFormatDate = (type, time) => {
	if (time == null) {
		var date = new Date()
	} else {
		var date = new Date(time*1000)
	}

	var year = date.getFullYear() //获取完整的年份(4位)
	var month = date.getMonth() + 1 //获取当前月份(0-11,0代表1月)
	var strDate = date.getDate() // 获取当前日(1-31)
	var week = '星期' + '日一二三四五六'.charAt(date.getDay()) //获取当前星期几(0 ~ 6,0代表星期天)
	var hour = date.getHours() //获取当前小时(0 ~ 23)
	var minute = date.getMinutes() //获取当前分钟(0 ~ 59)
	var second = date.getSeconds() //获取当前秒数(0 ~ 59)

	if (month >= 1 && month <= 9) month = '0' + month // 如果月份是个位数，在前面补0
	if (strDate >= 0 && strDate <= 9) strDate = '0' + strDate // 如果日是个位数，在前面补0
	if (minute >= 0 && minute <= 9) minute = '0' + minute // 如果分是个位数，在前面补0
	if (second >= 0 && second <= 9) second = '0' + second // 如果秒是个位数，在前面补0


	// 根据type值返回指定格式
	if (type == 0) { //yyyy-mm-dd hh:mm:ss
		let currentdate = `${year}-${month}-${strDate} ${hour}:${minute}:${second}`
		return currentdate
	}
	if (type == 1) { //yyyy-mm-dd
		let currentdate = `${year}-${month}-${strDate}`
		return currentdate
	}
	if (type == 2) { //hh:mm:ss
		let currentdate = `${hour}:${minute}:${second}`
		return currentdate
	}
	if (type == 3) { //hh
		let currentdate = `${hour}`
		return currentdate
	}
	if (type == 4) { //-mm-dd
		let currentdate = `${month}-${strDate}`
		return currentdate
	}
}






export default {
	getNowFormatDate,
}

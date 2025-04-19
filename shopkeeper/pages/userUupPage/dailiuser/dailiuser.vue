<template>
	<view class="statusBar"></view>
	<uni-nav-bar title="用户详情" leftIcon="back" @clickLeft="back" leftText="返回"/>
	<view class="user-data-card">
		<!-- 头部用户卡片部分 -->
		<view style="flex: 1;display: flex;align-items: center;justify-content: center;" @click="clickLogo(userData.avatar)">
			<image style="width:100rpx;height:100rpx;border-radius:10rpx;" :src="userData.avatar" mode="aspectFill" />
		</view>
		<view style="flex:4.5;display:flex;justify-content: space-between;">
			<view style="align-self: center;">
				<view>
					<!-- <text>{{userData.nickname}}</text> -->
					<text>{{nicknameDispose(userData.nickname,userData.remark)}}</text>
				</view>
				<view style="font-size: 24rpx;color: #7e7e7e;">
					<text>联系电话：{{userData.mobile}}</text>
				</view>
				<view style="font-size: 24rpx;color: #7e7e7e;">
					<text>绑定时间：{{getdatetime.getNowFormatDate(1,userData.create_time)}}</text>
				</view>
			</view>
			
			<!-- <view class="user-card-bottn" @click="clickStar()"
				:style="userData.star==0?'border:1rpx solid #dddddd;':'border:1rpx solid #FDC830;color:#FDC830;'">
				<view style="display: flex;align-items: center;justify-content:center;height:65rpx;font-size: 26rpx;">
					<uni-icons type="star-filled" size="26" :color="userData.star==1?'#FDC830':'#a8a8a8'" />
					<text>设为星标</text>
				</view>
			</view> -->
			
		</view>
	</view>
	<!-- <view class="remark-card" @click="open()">
		<view style="margin-left:20rpx;">
			<text>备注:</text>
			<text style="color:#bdbdbd;padding-left:20rpx;">
				{{userData.remark=='' || userData.remark==null?'点击设置备注':userData.remark}}
			</text>
		</view>
		<view style="margin-right:20rpx;">
			<uni-icons type="forward"></uni-icons>
		</view>
	</view> -->
	<view><!-- 账号明细和投注记录按钮 -->
		<view class="bottonData" @click="detailSup">
			<text style="margin-left:20rpx;">账号明细</text>
			<view style="margin-right:20rpx;">
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
		<view class="bottonData" @click="betRecordSup">
			<text style="margin-left:20rpx;">投注记录</text>
			<view style="margin-right:20rpx;">
				<uni-icons type="forward"></uni-icons>
			</view>
		</view>
	</view>
	<view class="jiaoyi">
		<!-- 交易统计部分 -->
		<view style="display: flex;align-items: center;justify-content: space-between;padding-top:20rpx;">
			<text style="margin-left:20rpx;">交易统计</text>
			<view style="font-size:26rpx;color:#848484;margin-right:20rpx;">
				<text>近期交易时间：</text>
				<text>{{getdatetime.getNowFormatDate(0,userData.Recenttradingtime)}}</text>
			</view>
		</view>
		<view style="display: flex;justify-content: space-between;font-size:26rpx;color:#848484;margin-top:30rpx;">
			<text style="margin-left:20rpx;">累计消费金额</text>
			<text style="margin-right:20rpx;">近期5单中奖情况</text>
		</view>
		<view style="display: flex;justify-content: space-between;">
			<text style="margin-left:20rpx;color: red;">{{Number(userData.consumption).toFixed(2)}}</text>
			<view style="margin-right:20rpx;">
				<text
					v-for="itme,index in userData.FiveDayHistory"
					:style="itme==true?'color:red;':''"
					style="margin:0rpx 5rpx;"
					v-if="userData.FiveDayHistory.length!=0">
					{{itme==false?'输':'赢'}}
				</text>
				<text v-if="userData.FiveDayHistory.length==0" style="color:#7e7e7e;">无</text>
			</view>
		</view>
		<view style="margin-left:20rpx;margin-top:30rpx;">
			<view style="font-size:26rpx;color:#848484;">累计下单</view>
			<view style="color: red;">{{userData.PayNumber}}</view>
		</view>
		<!-- <view class="buttonBox">
			<view>
				<view style="font-size:26rpx;color:#848484;">余额</view>
				<view style="color: red;">{{userData.money}}</view>
			</view>
			<view style="display: flex;margin-right: 20rpx;">
				<view class="moneyButtom" @click="open2(1)" style="background-color:#999999;">
					<text style="color:#eaeaea;font-size:32rpx;font-weight:bold;">扣款</text>
				</view>
				<view class="moneyButtom" @click="open2(0)" style="background-color:#FDC830;">
					<text style="color:#fff;font-size:32rpx;font-weight:bold;">加款</text>
				</view>
			</view>
		</view> -->
	</view>

	
	<!-- 2023.11.3 去除内置im聊天功能 -->
	<!-- <view class="big_buttom_style" @click="skip_chat(props.id,'private',userData.nickname)">私聊用户</view> -->
	
	<uni-popup ref="popup" type="center" :isMaskClick="false">
		<!-- 弹窗 -->
		<uni-popup-dialog 
			mode="input" 
			@close="proxy.$refs.popup.close()" 
			@confirm="chur" 
			title="输入备注内容"
			:placeholder="userData.remark=='' || userData.remark==null?'请输入设置备注':userData.remark"
			:duration="2000" :before-close="true"
			:value="userData.remark">
		</uni-popup-dialog>
	</uni-popup>
	
	<uni-popup type="center" ref="popup2" :maskClick="false">
		<!-- 弹出层 -->
		<view class="popupCard">
			<view style="display: flex;justify-content:flex-end;margin-top:10rpx;width:730rpx;">
				<uni-icons type="closeempty" size="48rpx" @click="close2()"></uni-icons>
			</view>
			<view style="text-align: center;font-weight:600;">
				<text v-show="popupValue==0" style="color: red;">加款需谨慎，慎防彩民p图，及时核实是否到账</text>
				<text v-show="popupValue==1">扣款</text>
			</view>
			<view class="popupStyle">
				<text style="color:#888888;">金额：</text>
				<input placeholder="请输入金额,最高5万" type="number" style="width:500rpx;margin-left:100rpx;"
					v-model="addMoneyValue" />
			</view>
			<view class="popupStyle">
				<text style="color:#888888;">备注：</text>
				<input 
					placeholder="请输入备注" 
					type="text" 
					style="width:500rpx;margin-left:100rpx;" 
					v-model="addRemark" 
				/>
			</view>
			<view style="width:600rpx;margin:auto;padding-top:20rpx;">
				<view class="buttomStyle" @click="addMoneySubmit(popupValue)" v-show="popupValue==0">提交</view>
				<button 
					type="warn" 
					v-show="popupValue==1" 
					@click="deductMoneySubmit(popupValue)"
					:disabled="addMoneyValue==''">提交
				</button>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="goyongpopup" background-color="#fff" borderRadius="20px 20px 20px 20px" >
		<view class="goyonglist">
			<view class="goyonglisttitle">
				设置代理佣金比例
			</view>
			<view class="goyonglistinput">
				<input class="uni-input" type="number" :max="maxValue" maxlength="1" @input="yonginput" focus placeholder="设置代理佣金比例"/>
			</view>
			<view class="goyonglistli">
				<uni-data-checkbox mode="tag" :localdata="goyong" @change="checkyongjin" selectedColor="#eb2121"></uni-data-checkbox>
			</view>
			<view class="goyongbutton">
				<view class="goyongyes" @click="yongclose">
					取消
				</view>
				<view class="goyongclose" @click="yongyes">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="gojiepopup" background-color="#fff"  >
		<view class="goyonglist">
			<view class="goyonglisttitle">
				设置代理佣金结算天数
			</view>
			<view class="goyonglistinput">
				<input class="uni-input" type="number" maxlength="3" @input="tianinput" focus placeholder="设置代理佣金结算天数"/>
			</view>
			<view class="goyonglistli">
				<uni-data-checkbox mode="tag"  :localdata="gojie" @change="checktian" selectedColor="#eb2121"></uni-data-checkbox>
			</view>
			<view class="goyongbutton">
				<view class="goyongyes" @click="tianclose">
					取消
				</view>
				<view class="goyongclose" @click="tianyes">
					确定
				</view>
			</view>
		</view>
	</uni-popup>
	<uni-popup ref="superior" type="bottom">
		<view style="width:100%;background-color:white;">
			<view class="superiorButton" @click="clickSuperior">
				查看上级
			</view>
			<view class="superiorButton" @click="setSuperior">
				更改上级
			</view>
		</view>
	</uni-popup>
	
	<uni-popup ref="superiorItme" type="bottom">
		<yc-superior-itme :user_id='userData.id' @succeed='call_back'></yc-superior-itme>
	</uni-popup>
</template>

<script setup>
	import common from "@/common/common.js"
	import api from '@/common/vmeitime-http/user/user.js'
	import getdatetime from "@/common/getdatetime.js"
	import user from "@/common/vmeitime-http/user/user.js"
	import {ref,reactive,onBeforeMount,getCurrentInstance,defineProps} from 'vue';
	import { useCounterStore } from '@/stores/counter'
	import {onShow,onHide} from "@dcloudio/uni-app"
	const counter = useCounterStore();
	const {proxy,ctx} = getCurrentInstance();
	const goyong=reactive([
		{"text":"1%","value":"1"},
		{"text":"1.5%","value":"1.5"},
		{"text":"2%","value":"2"},
		{"text":"2.5%","value":"2.5"},
		{"text":"3%","value":"3"},
		{"text":"3.5%","value":"3.5"}
	])
	const gojie=reactive([
		{"text":"1","value":"1"},
		{"text":"3","value":"3"},
		{"text":"15","value":"15"},
		{"text":"30","value":"30"}
	])
	const radio=ref([])
	const userData = reactive({
		id: '', //用户ID
		shop_id: '', //店铺ID
		username: '', //用户姓名
		nickname: '', //用户昵称
		avatar: '', //用户头像
		mobile: '', //用户手机号
		email: '', //用户邮箱
		sale: '', //是否为销售
		expert: '', //是否为专家
		Inviter: '', //邀请人ID
		Recenttradingtime: '', //最近下单时间
		consumption: '0.00', //累计消费金额
		money: '0.00', //余额
		gender: '0', //性别0=未知1=男2=女
		jointime: '', //加入时间
		status: '', // 用户状态
		create_time: '', //用户注册时间
		invitationNumber: '0' ,//邀请人数
		star:0,//是否标星
		superior:[],//上级
		remark:null,
		FiveDayHistory:[],//近期比赛数据
		PayNumber:0,//累计下单记录
		agent:0,//是否为代理的状态
		settle_days:0,//结算天数
		rate:0//佣金比例
		
	})
	const props = defineProps(['id'])
	const addMoneyValue = ref('')//加款输入框的值
	const addRemark = ref('')//备注输入框的默认值
	const beizhu = ref('点击设置备注') //备注默认的占位符
	const popupValue = ref()//加扣款按钮判断值
	const skip_chat=(userid,type,name)=>{//新增聊天室
		uni.getStorage({
			key:String(counter.shopBasicsData.id),
			success(res){//获取本地聊天记录成功
				var allData =JSON.parse(res.data)
				var groupIndex=allData.findIndex(obj=>obj.chatroomId==userid)//获取此聊天在数组中的位置
				if(groupIndex == -1){//新建聊天
					var obj={
						chatroomId:userid,//聊天室id（用户:id || 群聊:group_chat）
						chat_logo:userData.avatar,//聊天头像
						chat_type:'private',//聊天室类型（private=私聊 || public=群聊）
						chat_name:name,//聊天列表名字
						messages:[],//聊天记录数组
						lastReadTime:'',//最近读取时间
						unreadMessages:0,//未读消息数量
						newMsgTime:Number(new Date().getTime()/1000).toFixed(0),//最新一条消息的时间
					}
					counter.chatData=obj
				}else{
					counter.chatData=deepClone(allData[groupIndex])
				}
				uni.navigateTo({
					url:`/pages/chat_itemPage/user_chat?user_id=${userid}&type=${type}&user_name=${name}`
				})
			},
			fail(){
				uni.showToast({
					title:'聊天功能未初始化，请到聊天室页面后再试',
					icon:'none'
				})
			}
		})
	}
	function deepClone(obj) { //数据克隆
	    if (obj === null || typeof obj !== 'object') return obj;  
	    let copy = obj.constructor();  
	    for (let attr in obj) {  
	        if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);  
	    }  
	    return copy;  
	}
	onBeforeMount(() => {
		getUserInfo(props.id)
	})
	const getUserInfo=(id)=>{
		uni.showLoading({title: '加载中~',mask:true})
		api.GetUserData({"id":id}).then((res) => {
			userData.id = res.data.data.id
			userData.shop_id = res.data.data.shop_id
			userData.money = res.data.data.money
			userData.nickname = res.data.data.nickname
			userData.username = res.data.data.username
			userData.avatar = res.data.data.avatar
			userData.mobile = res.data.data.mobile
			userData.email = res.data.data.email
			userData.sale = res.data.data.Config.sale
			userData.expert = res.data.data.Config.expert
			userData.Inviter = res.data.data.Inviter
			userData.Recenttradingtime = res.data.data.Recenttradingtime
			userData.gender = res.data.data.gender
			userData.jointime = res.data.data.jointime
			userData.status = res.data.data.status
			userData.create_time = res.data.data.create_time
			userData.consumption = res.data.data.consumption
			userData.invitationNumber = res.data.data.invitationNumber
			userData.remark = res.data.data.Config.remarks
			userData.star=res.data.data.Config.Star
			userData.superior=res.data.data.superior
			userData.FiveDayHistory=res.data.data.FiveDayHistory
			userData.PayNumber=res.data.data.PayNumber
			userData.agent=res.data.data.Config.agent
			userData.settle_days=res.data.data.Config.settle_days
			userData.rate=res.data.data.rate
			uni.hideLoading()
		})
	}
	const goyongprop=()=>{
		console.log('1111')
		proxy.$refs.goyongpopup.open('center')
	}
	const gopage=()=>{
		uni.navigateTo({
			url:"/pages/userUupPage/userinformation/userinformation?user_id=" + userData.id 
		})
	}
	const gojieprop=()=>{
			proxy.$refs.gojiepopup.open('center')
	}
	const dialogClose=()=>{
		
	}
	const nicknameDispose=(nickname,remark)=>{//用户如果有备注就使用备注没有责正常显示昵称
		if(remark!=''&&remark!=null){
			return remark+'(昵称：'+nickname+')'
		}else{
			return nickname
		}
	}
	const clickLogo=(img)=>{//点击用户头像预览
		uni.previewImage({
			urls:Array(img),
			indicator:'default'
		})
	}
	const lookSuperior=()=>{//打开上级弹窗
		proxy.$refs.superior.open()
	}
	const clickSuperior=()=>{//查看上级
		getUserInfo(userData.superior.id)
		proxy.$refs.superior.close()
	}
	const setSuperior=()=>{//打开上级列表
		proxy.$refs.superiorItme.open()
	}
	const call_back=()=>{
		proxy.$refs.superiorItme.close()
		proxy.$refs.superior.close()
		getUserInfo(userData.id)
	}
	const back = () => { //返回上级页面
		uni.navigateBack()
	}
	const betRecordSup=()=>{//跳转至投注记录页面
		uni.navigateTo({
			url:'/pages/userUupPage/userSupPageSup/userTouzu?user_id=' + userData.id + '&orderState=99'
		})
	}
	const detailSup=()=>{
		uni.navigateTo({//跳转至账户详细页面
			url:'/pages/userUupPage/userSupPageSup/userSupPageSup?user_id=' + userData.id
		})
	}
	const clickStar = () => { //判断点击的星标状态
		if (userData.star == 0) {
			userData.star = 1
			api.GetSetUserConfig({"id":userData.id,"type":"Star","value":String(userData.star)}).then((res)=>{
				if(res.data.code!=1){
					userData.star = 0
					uni.showToast({
						title:'设置失败',
						icon:'none',
						position:'center'
					})
				}
			})
		} else {
			userData.star = 0
			api.GetSetUserConfig({"id":userData.id,"type":"Star","value":String(userData.star)}).then((res)=>{
				if(res.data.code!=1){
					userData.star = 1
					uni.showToast({
						title:'取消失败',
						icon:'none',
						position:'center'
					})
				}
			})
		}
	}
	const open = () => { //打开设置备注弹窗
		proxy.$refs.popup.open()
	}

	const chur= async(text) => { //判断用户是否写入备注
		if(text!=userData.remark){
			await api.GetSetUserConfig({
				"id":userData.id,
				"type":"remarks",
				"value":text,
			}).then((res)=>{
				
			})
		}
		await proxy.$refs.popup.close()
		await setTimeout(()=>{
			getUserInfo(userData.id)
		},500)
	}
	
	
	const clickSetSwitch= async (state,value)=>{//底部开关
		await api.GetSetUserConfig({
			"id":userData.id,
			"type":value==0?'sale':'expert',
			"value":state.detail.value==true?'1':'0'
		}).then((res)=>{
			if(res.data.code!=1){
				var title=value==0?'sale':'expert'
				userData[title]=!state.detail.value
			}
		})
	}
	// 设置是否代理
	const clickSetSwitchdaili= async (state)=>{//底部开关
		await api.Postdaili({
			"id":userData.id,
			"type":"agent",
			"value":state.detail.value==true?'1':'0'
		}).then((res)=>{
			if(res.data.code==1){
			 var num=state.detail.value?1:0
			 userData.agent=num
			}
		})
	}
	const open2 = (e) => { //打开加款弹窗
		proxy.$refs.popup2.open()
		popupValue.value = e
	}
	const close2 = () => { //关闭加款弹窗
		proxy.$refs.popup2.close()
		addMoneyValue.value = null
		addRemark.value=null
	}
	const supPage = () => {
		if (userData.invitationNumber == 0) {
			uni.showToast({
				title: '没有邀请人喔~',
				icon: 'error'
			})
		}else{
			uni.navigateTo({
				url:'/pages/userUupPage/userInvitePage?userID='+ userData.id + '&invitationNumber='+userData.invitationNumber
			})
		}
	}
	const addMoneySubmit = (e) => {
		uni.showLoading({
			title: '修改中~'
		})
		api.PostUserAddMoney({"id":userData.id,"money": addMoneyValue.value,"memo": addRemark.value}).then((res) => {
			uni.hideLoading()
			if (res.data.code == 1) {
				uni.showToast({
					title: '加款成功~',
					icon: 'success',
					duration:500,
				})
			} else {
				uni.showToast({
					title: '加款失败~',
					icon: 'error',
					duration:500,
				})
			}
			setTimeout(()=>{
				getUserInfo(userData.id)
				close2()
			},500)
		})
	}
	const deductMoneySubmit = () => {
		if(Number(addMoneyValue.value)>Number(userData.money)){
			uni.showToast({
				title:'用户余额不足',
				icon:"error",
				position:'center'
			})
			return
		}
		uni.showLoading({title: '修改中~'})
		api.PostUserDeductMoney({"id":userData.id,"money": addMoneyValue.value,"memo": addRemark.value}).then((res) => {
			uni.hideLoading()
			if (res.data.code == 1) {
				uni.showToast({
					title: '扣款成功~',
					icon: 'success',
					duration:500,
				})
			} else {
				uni.showToast({
					title: '扣款失败~',
					icon: 'error',
					duration:500,
				})
			}
			setTimeout(()=>{
				getUserInfo(userData.id)
				close2()
			},500)
		
		})
	}
	const yongli=ref(0)
	const checkyongjin=(e)=>{
		console.log(e)
		yongli.value=e.detail.value
	}
	const yongclose=()=>{
		proxy.$refs.goyongpopup.close()
	}
	const yongyes=()=>{
		api.Postyongjin({
		"id":userData.id,
		"rate":yongli.value/100
		}).then(res=>{
			if(res.data.code==1){
				uni.showToast({
					title: res.data.data,
					icon: 'success',
					duration:500,
				})
				getUserInfo(props.id)
				proxy.$refs.goyongpopup.close()
			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'error',
					duration:500,
				})
			}
			
		})
	}
	const yonginput=(e)=>{
		if(e.detail.value>7){
			uni.showToast({
				title: "佣金比例不能大于7",
				icon: 'error',
				duration:500,
			})
		}else if(e.detail.value==0){
			uni.showToast({
				title: "佣金比例不能等于0",
				icon: 'error',
				duration:500,
			})
		}else{
			yongli.value=e.detail.value
		}
	}
	const tianmum=ref(0)
	const checktian=(e)=>{
		tianmum.value=e.detail.value
	}
	const tianyes=()=>{
		api.Postdaili({
		"id":userData.id,
		"type":'settle_days',
		"value":tianmum.value,
		}).then(res=>{
			if(res.data.code==1){
				uni.showToast({
					title: res.data.data,
					icon: 'success',
					duration:500,
				})
				getUserInfo(props.id)
			proxy.$refs.gojiepopup.close()
			}else{
				uni.showToast({
					title: res.data.msg,
					icon: 'error',
					duration:500,
				})
			}
			
		})
	}
	const tianclose=()=>{
		proxy.$refs.gojiepopup.close()
	}
	const tianinput=(e)=>{
		console.log(e)
		if(e.detail.value>365){
			uni.showToast({
				title: '结算天数不能超过365天',
				icon: 'error',
				duration:500,
			})
		} if(e.detail.value==0){
			uni.showToast({
				title:"结算天数不能为0",
				icon: 'error',
				duration:500,
			})
		}else{
			tianmum.value=e.detail.value
		}
	}
</script>

<style>
	.big_buttom_style{
		width:680rpx;
		padding:20rpx;
		border-radius: 20rpx;
		margin:40rpx auto;
		background-color:#FDC830;
		color: white;
		text-align: center;
		font-weight: bold;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#FDC830;
		border-radius:15rpx;
		text-align: center;
		line-height:80rpx;
		color: white;
	}
	.buttonBox{
		display: flex;
		margin-left:20rpx;
		margin-top:30rpx;
		align-items: center;
		justify-content: space-between;
	}
	.superiorButton{
		text-align: center;
		padding:30rpx 0rpx;
		border-bottom:1rpx #d3d3d3 solid;
	}
	.popupStyle{
		display: flex;
		margin:20rpx 20rpx;
		height:80rpx;
		align-items: center;
		border-bottom: 1rpx solid #d8d8d8;
	}
	.moneyButtom {
		width: 220rpx;
		height: 75rpx;
		border-radius: 8rpx;
		text-align: center;
		margin: 0rpx 5rpx;
		transition: width .2s;
		line-height:75rpx;
	}
	.moneyButtom:active{
		transition:.2s;
		transform: scale(0.95);
	}

	.popupCard {
		width: 100%;
		height: 470rpx;
		background-color: white;
		border-radius:20rpx;
		padding-top: 10rpx;
	}

	.switch {
		height: 80rpx;
		display: flex;
		align-items: center;
		width: 710rpx;
		margin: auto;
		justify-content: space-between;
		border-bottom: 1rpx solid #dddddd;
	}

	.jiaoyi {
		width: 100%;
		height: 400rpx;
		background-color: white;
	}

	.bottonData {
		width: 100%;
		height: 90rpx;
		background-color: white;
		margin: 10rpx 0rpx;
		display: flex;
		align-items: center;
		justify-content: space-between
	}

	.remark-card {
		display: flex;
		width: 100%;
		height: 75rpx;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1rpx solid #e5e5e5;
		background-color: white;
	}

	.user-card-bottn {
		width: 200rpx;
		height: 60rpx;
		border-radius: 20rpx;
		align-self: center;
		margin-right: 20rpx;
		transition: 0.3s;

	}

	.user-data-card {
		width: 100%;
		height: 130rpx;
		display: flex;
		border-bottom: 1rpx solid #e5e5e5;
		background-color: white;
	}

	.statusBar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

	body {
		background-color: #f7f7f7;
	}
	.goyonglist{
		width: 500rpx;
	}
	.goyonglisttitle{
		width: 100%;
		text-align: center;
		margin-top: 15rpx;
	}
	.goyonglistinput{
		width: 80%;
		height: 50rpx;
		margin: 0 auto;
		border: 1rpx solid gray;
		margin-top: 15rpx;
		
	}
	.goyonglistli{
		width: 80%;
		height: 150rpx;
		margin: 0 auto;
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.goyongli{
		width: 110rpx;
		height:40rpx;
		text-align: center;
		line-height: 40rpx;
		border-radius: 10rpx;
		background-color: #dcdcdc;
	}
	.goyongbutton{
		height: 60rpx;
		display: flex;
		justify-content: space-between;
		padding: 5rpx 5rpx;
	}
	.goyongyes{
		width: 50%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
			border: 1rpx solid grey;
	
	}
	.goyongclose{
		width: 50%;
		height: 60rpx;
		text-align: center;
		line-height: 60rpx;
		border: 1rpx solid grey;
		color: #FDC830;
	}
	.uni-data-checklist .checklist-group .checklist-box{
		margin: 8px 10px !important;
	}
</style>

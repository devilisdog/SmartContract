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
					<text>绑定时间：{{getdatetime.getNowFormatDate(1,userData.create_time*1000)}}</text>
				</view>
			</view>
		</view>
	</view>
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
				<text>{{getdatetime.getNowFormatDate(0,userData.Recenttradingtime*1000)}}</text>
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
		<view class="buttonBox">
			<view>
				<view style="font-size:26rpx;color:#848484;">余额</view>
				<view style="color: red;">{{userData.money}}</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	// import common from "@/common/common.js"
	import api from '@/common/vmeitime-http/index.js'
	import getdatetime from "@/common/getdatetime.js"
	// import user from "@/common/vmeitime-http/user/user.js"
	import {ref,reactive,onBeforeMount,getCurrentInstance,defineProps} from 'vue';
	// import { useCounterStore } from '@/stores/counter'
	// import {onShow,onHide} from "@dcloudio/uni-app"
	// const counter = useCounterStore();
	// const {proxy,ctx} = getCurrentInstance()
	const userData = reactive({
		id: '12', //用户ID
		shop_id: '123', //店铺ID
		username: 'xxx', //用户姓名
		nickname: '1231xx', //用户昵称
		avatar: '', //用户头像
		mobile: '13668447989', //用户手机号
		email: '1002149635@qq.com', //用户邮箱
		Inviter: '', //邀请人ID
		Recenttradingtime: '', //最近下单时间
		consumption: '0.00', //累计消费金额
		money: '0.00', //余额
		gender: '0', //性别0=未知1=男2=女
		jointime: '', //加入时间
		status: '', // 用户状态
		remark:null,
		FiveDayHistory:[],//近期比赛数据
		PayNumber:4//累计下单记录
		
	})
	const props = defineProps(['id'])
	onBeforeMount(() => {
		getUserInfo(props.id)
	})
	const getUserInfo=(id)=>{
		uni.showLoading({title: '加载中~',mask:true})
		api.getUseryonglist({"id":id}).then((res) => {
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
			uni.hideLoading()
		})
	}
	const nicknameDispose=(nickname,remark)=>{//用户如果有备注就使用备注没有责正常显示昵称
		if(remark!=''&&remark!=null){
			return remark+'(昵称：'+nickname+')'
		}else{
			return nickname
		}
	}
	// const clickLogo=(img)=>{//点击用户头像预览
	// 	uni.previewImage({
	// 		urls:Array(img),
	// 		indicator:'default'
	// 	})
	// }

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
			url:'/pages/home/userUupPage/userSupPageSup/userTouzu?user_id=' + userData.id + '&orderState=99'
		})
		// uni.navigateTo({
		// 	url:'/pages/home/userUupPage/userSupPageSup/userTouzu'
		// })
	}
	const detailSup=()=>{
		uni.navigateTo({//跳转至账户详细页面
			url:'/pages/home/userUupPage/userSupPageSup/userSupPageSup?user_id=' + userData.id
		})
		// uni.navigateTo({//跳转至账户详细页面
		// 	url:'/pages/home/userUupPage/userSupPageSup/userSupPageSup'
		// })
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

</script>

<style>
	.big_buttom_style{
		width:680rpx;
		padding:20rpx;
		border-radius: 20rpx;
		margin:40rpx auto;
		background-color:#519a67;
		color: white;
		text-align: center;
		font-weight: bold;
	}
	.buttomStyle{
		width:100%;
		height:80rpx;
		background-color:#519a67;
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
</style>

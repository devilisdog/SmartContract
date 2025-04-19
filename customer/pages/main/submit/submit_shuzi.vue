<template>
	<view class="statusBar"></view>
	<view class="main" >
		<!-- 导航栏 -->
		<uni-nav-bar color="#fff" background-color="#202736" :title='tzd()' left-icon="left" left-text="返回" height="100rpx" @clickLeft="back()"></uni-nav-bar>

		<!-- 添加赛事 发起合买 动态添加按钮-->
		<view class="head">
			<!-- v-if="item.show" -->
			<view class="button" @click="action(item.id)" v-for="item,index in headButton" :key="item.id" :style="index==2&&showSpellVal==false ? 'display:none;' : false">
				{{item.text}}
			</view>
		</view>
		<!-- 卡片 -->
		<uni-section type="card">
			<!-- 卡片内容，有两个数组进行渲染 -->
		<uni-swipe-action v-if="show_DataList">
			<uni-swipe-action-item v-for="item,index in counter.submitNewData" :right-options='options' @click='options_Click(index)'>
				<view style="width: 700rpx;display: flex;justify-content: center;margin: auto;padding: 20rpx 0; " :style="index == 0 ? 'margin-top:-30rpx;':false">
					<card :nmb='index' @numberChange="HowMuchMoney();HowMuchBeilv();addSwitch=false"></card>
				</view>
				<view style="margin: auto;width: 680rpx; height: 2rpx;background-color: #f5f5f5;margin-top: 5rpx;"></view>
			</uni-swipe-action-item>
		</uni-swipe-action>
			<view style="width: 100%;height: 40rpx;"></view>
		</uni-section>
	</view>
	<!-- 底部导航 -->
	<view class="footer" style="">
		<!-- <view> -->
			<view v-if="counter.submitNewData.length>0 && counter.submitNewData[0].name == '大乐透'"
				style="width: 100%;height: 100rpx;background-color: #ffffff;margin-bottom: 115rpx;display: flex;align-items: center;justify-content: space-between;">
				<view style="margin-left: 30rpx;">是否追加</view>
				<view style="margin-right: 30rpx;">
					<switch :checked='addSwitch' color="#FFCC33" style="transform:scale(0.9);" @change='switchVal' />
				</view>
			</view>
		<!-- </view> -->
		<view class="submit">
			<view class="submit-bottom">
				<view style="margin-left: 25rpx;">
					<uni-icons class="input-uni-icon" type="trash" size="35" color="#c5c5c5" @click="qk()" />
				</view>
				<view style="font-size: 26rpx;color: #888888;letter-spacing:3rpx;">
					<text>共<text style="color: red;">{{bottonInfo.allNote}}</text>注
					<text style="color: red;">{{bottonInfo.allBeilv}}</text><text>倍</text>
					<text style="color: red;padding-left: 15rpx;" >{{bottonInfo.allMonaye}}</text>元 </text>
				</view>
				<view class="bottom-button" style=" height: 75rpx; width: 280rpx;margin-right: 10rpx;">
					<view class="bottom-button02" 
						:style="counter.submitNewData.length > 0 ? false : 'background: linear-gradient(to right, #fff2c2, #ffb2b2);pointer-events:none;'">
						<text style="font-size: 30rpx;" @click="open()">确认提交</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="popup" type="bottom">
		<!-- <view style="background-color:#f3f3f3;height:95vh;border-radius:30rpx 30rpx 0 0;"> -->
			<orderCard @close='close()'></orderCard>
		<!-- </view> -->
	</uni-popup>
	<!-- 确认支付弹出层 -->
	<uni-popup ref="tcpopup" >
		<view class="popup-subject">
			<view class="cc" @click="proxy.$refs.tcpopup.close('bottom')">×</view>
			<view class="content">
				<view class="content-title">支付给店主</view>
				<view class="content-money">
					<view>{{counter.submitNewData[0].name}}：</view>
					<view style="letter-spacing: 4rpx;">{{bottonInfo.allMonaye}}元</view>
				</view>
				<view class="content-balances" style="border-bottom: none;">
					<view>剩余余额：</view>
					<view style="letter-spacing:4rpx;">{{(counter.user_money-bottonInfo.allMonaye).toFixed(2)}}元</view>
				</view>
				<view style="background-color: #f8f8f8;width: 100%;height: 1px;margin-bottom: 15rpx;"></view>
				<view @click="getNewMoney()" class="content-button" :style="openCheckbox == true ? false : 'pointer-events:none;'" >确认支付
					<view style="background-color: #e2e2e2;width:600rpx;position: absolute;height: 68rpx;border-radius: 55rpx;transition: all 0.6s;"
						:style="openCheckbox == true ? 'opacity:0;' : 'opacity:0.4;'"></view>
					</view>
					
				<view class="clause">
					<view class="clause-choose" @click="checkboxClick()">
						<view style="width: 18rpx;height: 18rpx;border-radius: 55rpx;" :style="openCheckbox == false ? 'display:none;' : 'background-color:#ffd38b ;'"></view>
					</view>
					<text style="color: red;">我已年满18周岁</text>
					<text style="margin: 0 10rpx;">已阅读并同意</text>
					<text style="color: red;" @click="userAgreement">《用户协议及法律声明》</text>
				</view>
			</view>
		</view>
	</uni-popup>
	
	
	<!-- 余额不足对话弹出 -->
	<uni-popup ref="dialogPopup" type="dialog">
		<uni-popup-dialog mode="input" message="成功消息" :duration="2000" :before-close="true" @close="closedialog" @confirm="confirm"></uni-popup-dialog>
	</uni-popup>
</template>

<script setup>
	import Goodnav from "@/components/main/nav/yc-submit-nav.vue"
	import SubmitPay from "@/components/main/nav/yc-submit-pay.vue"
	import card from "@/components/main/card/card.vue"
	import common from '@/common/common'
	import orderCard from "@/components/common/yc-common-BettingInfo/yc-common-BettingInfo.vue"
	import { useCounterStore } from '@/stores/counter'
	import { onBackPress } from '@dcloudio/uni-app'
	import api from '@/common/vmeitime-http/beting.js'
	import {onBeforeMount,onMounted,ref,reactive,defineProps,getCurrentInstance,nextTick,} from 'vue';
	
	const {proxy,ctx} = getCurrentInstance()
	const props = defineProps(['nowDeadline','lssue'])
	const DataList = ref([])
	onBeforeMount(() => {
		DataList.value.push(counter.submitNewData)
	})
	onMounted(() => {
		bottonInfoInit()
		showSpell()
		HowMuchMoney()//计算总金额
		HowMuchNote()
		HowMuchBeilv()
		for(var i = 0; i < counter.submitNewData.length; i++){
			counter.submitNewData[i]['switch']=0//复制是否追加
		}
		openCheckbox.value=uni.getStorageSync('isAdult')
	})
	const bottonInfoInit=()=>{//底部ber数据初始化
		bottonInfo.allBeilv=0
		bottonInfo.allMonaye=0
		bottonInfo.allNote=0
	}
	const counter = useCounterStore() //状态管理
	const addSwitch=ref(false)
	const bottonInfo=reactive({//底部ber数据
		allMonaye:0,
		allNote:0,
		allBeilv:0
	})
	
	//是否显示跟单
	const showSpellVal =ref(false)
	const showSpell = () =>{
		var arr=['福彩3D','排列3','大乐透']
		if(counter.gameAstrict.Issuing_switch == "1" && arr.indexOf(counter.gameAstrict.systemsgamelist.title) != -1){
			showSpellVal.value = true
		}else{
			showSpellVal.value = false
		}
	}
	// 头部按钮的控制信息
	const headButton = reactive([{
			id: 0,
			text: "+继续选号",
			show: true
		},
		{
			id: 1,
			text: "+发起合买",
			show: true
		},
		{
			id: 2,
			text:"+发起跟单",
			show: true
		}
	])
	
	// 按钮组点击事件
	const action = (id) => {
		if (id == 0) { //手动添加
			back()
		}
		if (id == 1) {
			if(bottonInfo.allMonaye < 10){
				uni.showToast({
					icon:"none",
					title: '订单金额不能小于10元',
					duration: 2000
				});
			}else{
				uni.navigateTo({
					url: '../submit/buyTogether?Amount='+bottonInfo.allMonaye+'&Note='+bottonInfo.allNote+'&bonusmin='+ 0 +'&bonusmax='+ 0 +'&nowDeadline='+ new Date(props.nowDeadline.replace(/-/g,'/')).getTime()/1000+'&lssue='+props.lssue,
				});
			}
		}
		if (id == 2) {
			if(bottonInfo.allMonaye<100){
				uni.showToast({
					icon:"none",
					title: '发单投注金额最小100元！',
					duration: 2000
				});
			}else{
				uni.navigateTo({
					url: '../submit/spell?Amount='+bottonInfo.allMonaye+'&Note='+bottonInfo.allNote+'&bonusmin='+0 +'&bonusmax='+ 0 +'&nowDeadline='+ new Date(props.nowDeadline.replace(/-/g,'/')).getTime()/1000+'&lssue='+props.lssue,
				});
			}
		}
	}
	// 18岁
	const openCheckbox = ref(false)
	const checkboxClick =()=>{
		openCheckbox.value=!openCheckbox.value
		uni.setStorageSync('isAdult',openCheckbox.value);
	}
	//确认支付
	const getNewMoney=()=>{
		proxy.$refs.tcpopup.close("bottom")
		
		if(bottonInfo.allMonaye<counter.gameAstrict.MinBetAmount){
			uni.showToast({
				title:'店主限制最小投注金额'+counter.gameAstrict.MinBetAmount+'元',
				position:"center",
				icon:'none',
				duration:3000
			})
			return
		}
		uni.showLoading({title:'提交中~',mask:true})
		uni.request({
			url:counter.baseUrl+'/api/bettingend.mine.Transaction/notWithdraw',
			header:{'server':1,'ba-user-token':counter.access_token,},
			success(res){
				counter.user_money=Number(res.data.data.withdraw)+Number(res.data.data.not_withdraw)
				openTwo()
			},
			fail(err){
				uni.showToast({
					title:'获取金额失败',
					icon:'error',
					position:'center'
				})
				openTwo()
			}
		})
	}
	const openTwo =()=>{
		if(counter.user_money<bottonInfo.allMonaye){
			uni.hideLoading()
			proxy.$refs.dialogPopup.close()
			uni.showModal({
				title: '注意',
				content: '余额不足！',
				confirmText:'立即充值',
				confirmColor:'#f04b49',
				success: function (res) {
					if (res.confirm) {
						uni.navigateTo({
							url:'/pages/home/HomeTopUp/HomeTopUp',
							animationType:'slide-in-bottom'
						})
					}
				}
			});
			return
		}
		counter.submitNewData[0]['lssue']=props.lssue
		uni.hideLoading()
		var date=new Date(props.nowDeadline.replace(/-/g,'/'))
		date.setMinutes(date.getMinutes()+Number(counter.gameAstrict.advance))
		api.Betjczq({
			"default": 0,
			"Type":common.playType(counter.submitNewData[0].name),
			"BetContent": counter.submitNewData,
			"bonusmin": 0,
			"bonusmax": 0,
			'Deadline':date.getTime()/1000,
			'lssue' : props.lssue,
			'Note' :bottonInfo.allNote,
			"BetMoney": bottonInfo.allMonaye,
		}).then((res)=>{
			uni.hideLoading()
			if(res.data.code==1){
				counter.setMoney('Dele',bottonInfo.allMonaye)
				counter.allOrderData=res.data.data.orderInfo
				proxy.$refs.popup.open()
			}else{
				uni.showToast({
					title:'提交失败~请稍后再试',
					position:'center',
					icon:"error"
				})
			}
		})
	}
	const open=()=>{
		proxy.$refs.tcpopup.open('bottom')
		counter.BettingContent=[]
		counter.submitNewData.allNote=bottonInfo.allNote
		counter.submitNewData.allMoney=bottonInfo.allMonaye
	}
	
	//弹窗点×触发
	const close=()=>{
		proxy.$refs.tcpopup.close('bottom')	
		setTimeout(()=>{
			uni.navigateBack({
				delta:1,
				success:(res)=>{
					setTimeout(()=>{
						counter.submitNewData = []
						counter.allOrderData = []
					},100)
				}
			});
		},300)
	}
	const closedialog =()=>{
		proxy.$refs.dialogPopup.close('center')
	}
	const tzd = () =>{
		if(counter.submitNewData.length > 0){
			var a =counter.submitNewData[0].name + '投注单'
		}else{
			return '投注单'
		}
		return a
	}
	
	const HowMuchNote = () =>{//这个是算总注数的
		var HMnote = 0 ;
		for(var i = 0; i < counter.submitNewData.length; i++){
			HMnote += counter.submitNewData[i].note
		}
		bottonInfo.allNote=HMnote
	}
	const HowMuchBeilv = () =>{//这个是算总倍数
		var HMbeilv = 0 ;
		for(var i = 0; i < counter.submitNewData.length; i++){
			HMbeilv += counter.submitNewData[i].beilv
		}
		bottonInfo.allBeilv=HMbeilv
	}
	
	const switchVal = (e) =>{// 追加点击触发
		HowMuchMoney()//计算总金额
		var newMoney=0
		for(var i = 0; i < counter.submitNewData.length; i++){
			newMoney += counter.submitNewData[i].beilv*counter.submitNewData[i].note
			counter.submitNewData[i]['switch']=e.detail.value?1:0//复制是否追加
		}
		if(e.detail.value){
			addSwitch.value=true
			bottonInfo.allMonaye=bottonInfo.allMonaye+newMoney
		}else{
			bottonInfo.allMonaye=bottonInfo.allMonaye
		}
	}
	
	const HowMuchMoney = () =>{//这个是算总钱数的
		var HMmoney = 0 ;
		for(var i = 0; i < counter.submitNewData.length; i++){
			HMmoney += counter.submitNewData[i].money
		}
		bottonInfo.allMonaye=HMmoney
	}
	
	const show_DataList =ref(true)
	const options_Click = (e) =>{
		counter.submitNewData.splice(e,1)
		show_DataList.value = false
		nextTick(() => {
			show_DataList.value = true
		})
		HowMuchMoney()//计算总金额
		HowMuchNote()
		HowMuchBeilv()
	}
	
	const options=reactive([
	  {
	   text:'删除',
	   style:{
	     backgroundColor: '#ff4141'
	   }
	  }
	 ])
	
	const back =()=>{
		uni.navigateBack({
			delta:1,
			animationType: 'pop-out',
			animationDuration: 200
		})
	}
	//跳转法律声明
	const userAgreement = () =>{
		uni.navigateTo({
			url: '/pages/else/userAgreement/userAgreement',
			animationType: 'pop-in',
			animationDuration: 200
		})
	}
	const qk =()=>{
		counter.submitNewData = []
		bottonInfoInit()
	}
</script>

<style lang="less">
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	.tabNav {
		flex: 1;
		.option {
			width: 55%;
			border: 2rpx solid #ccc;
			padding: 10rpx 20rpx;
			margin: 0 auto 20rpx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;

			// select框的点击弹出框内容部分
			.selectContent {
				position: absolute;
				bottom: 200rpx;
				left: 0;
				width: 100%;
				background-color: #fff;
				box-shadow: 0 2rpx 16rpx #ccc;

				.title {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin: 20rpx 50rpx 20rpx 20rpx;
					color: #666;
				}

				.leftContent {
					display: flex;
					justify-content: flex-start;
					align-items: center;
					flex-direction: row;
					flex-wrap: wrap;
					margin-bottom: 10rpx;

					view {
						width: 23.8%;
						margin: 20rpx;
						padding: 10rpx 15rpx;
						border: 2rpx solid #ccc;
					}
				}
			}

			.selectTitle {
				flex: 5;
				font-size: 30rpx;
			}

			.selectIcon {
				flex: 1;
				height: 34rpx;
				border-radius: 50%;
				border: 2rpx solid #ccc;
				font-size: 30rpx;
			}
		}

		.leftText {
			font-size: 28rpx;
			height: 90rpx;
			line-height: 40rpx;
			margin-top: 10rpx;

			.money {
				color: red;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.main {
		background-color: #f8f8f8;
		min-height: 1200rpx;
		padding-bottom: 300rpx;
	}

	.head {
		display: flex;
		margin-top: 30rpx;
		flex-direction: row;
		justify-content: space-around;
	}

	.head .button {
		text-align: center;
		line-height: 75rpx;
		font-size: 34rpx;
		margin: 0 10rpx;
		height: 70rpx;
		width: 80%;
		color: 	#ff6f6f;
		border-radius: 20rpx;
		border: 2rpx solid #ffcfcf;
		background-color: #fff;
	}
	

	.card {

		// 清空卡片自带的头部内边距
		.uni-section-header {
			padding: 0;
		}

		>.uni-section {
			background-color: #fdfdfd;
		}

		.lastCard {
	
			text-align: center;
			color: #666;
			padding-bottom: 10rpx;
			border-bottom: 3rpx dashed #777;
		}

		.title {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			text {
				padding: 10rpx 20rpx 10rpx 0;
			}

			.delete {
				margin-right: 20rpx;
				padding: 8rpx;
				width: 15rpx;
				height: 15rpx;
				line-height: 8rpx;
				display: inline-block;
				border: 2rpx solid #000;
				border-radius: 50%;
			}
		}

		.content {
			background-color: #f3f3f3;
			text-align: center;
			padding: 15rpx;

			text {
				margin: 20rpx;
				color: #2581f9;
			}
		}
	}


	// 底部导航
	.submit {
		width: 100%;
		height: 115rpx;
		bottom: 0;
		position: fixed;
		}
		.submit-bottom {
			width: 100%;
			height: 115rpx;
			display: flex;
			background-color: #fff;
			align-items: center;
			justify-content: space-between;
		}
		.submit-bottom view text {
			font-size: 30rpx;
		}
		.bottom-button {
			border-radius: 20rpx;
			display: flex;
		}
		.bottom-button02 {
			width: 100%;
			display: flex;
			background: #202736;
			border-radius: 20rpx;
			justify-content: center;
			align-items: center;
			color: #fff;
		}
		
	
	// 确认支付弹出层
	.popup-subject{
		width: 100%;
		height: 620rpx;
		background-color: #ffffff;
		border-radius: 20px 20px 0 0;
		}
		.popup-subject .content{
			display: flex;
			flex-direction: column;
		}
			.cc{
				width: 35rpx;
				height: 35rpx;
				border-radius: 55px;
				position: absolute;
				margin: 25rpx;
				right: 1%;
				border: 1px solid #e7e7e7;
				color: #e7e7e7;
				font-size: 30rpx;
				text-align: center;
				line-height: 35rpx;
			}
		.content-title{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 35rpx 0;
			font-size: 34rpx;
			font-weight: 500;
			color: #393939;
			border-bottom:1rpx solid #f8f8f8;
			border-radius: 25rpx 25rpx 0 0;
		}
		.content-money , .content-balances{
			width: 700rpx;
			margin: auto;
			font-size: 25rpx;
			padding: 30rpx 0;
			border-bottom:1rpx solid #f8f8f8;
			display: flex;
			justify-content: space-between;
		}
		.content-button{
			display: flex;
			justify-content: center;
			align-items: center;
			width: 600rpx;
			height: 65rpx;
			margin: auto;
			border-radius: 55rpx;
			color: #ffffff;
			background: linear-gradient( 65deg, #ffd875, #ff7979);
		}
		.clause{
			display: flex;
			align-items: center;
			margin: auto;
			margin-top: 20rpx;
			}
			.clause-choose{
				width: 30rpx;
				height: 30rpx;
				margin: 0 10px;
				border-radius: 55px;
				border: 1px solid #5a5a5a;
				color: #393939;
				font-size: 24rpx;
				display: flex;
				transition: all 1s;
				align-items: center;
				justify-content: center;
			}
			.clause text{
				color: #3d3d3d;
				font-size: 24rpx;
			}
</style>
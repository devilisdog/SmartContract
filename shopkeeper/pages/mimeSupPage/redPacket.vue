<template>
	<view class="status_bar"></view>
	<uni-nav-bar title="红包营销" leftIcon="back" @clickLeft="back" rightText="红包记录" @clickRight="record"></uni-nav-bar>
	<view class="importCard">
		<text class="importCard_title">
			{{redPacketState==0?'红包金额':'单个金额'}}（{{stateText[redPacketState]}}）:
		</text>
		<view>
			<uni-easyinput 
				:inputBorder="false" 
				placeholder="满减金额" 
				type="number" 
				:clearable="false"
				@input="randomRedPacket"
				v-model="fromsData.Money"
				>
			</uni-easyinput>
			<text class="importCard_title">元</text>
		</view>
	</view>
	<view class="importCard">
		<text class="importCard_title">红包个数:</text>
		<view>
			<uni-easyinput 
				:inputBorder="false" 
				placeholder="输入红包个数" 
				type="number" 
				:clearable="false"
				@input="fixationRedPacket"
				v-model='fromsData.several'
				>
			</uni-easyinput>
			<text class="importCard_title">个</text>
		</view>
	</view>
	<view class="importCard">
		<text class="importCard_title">红包有效期:</text>
		<view>
			<uni-easyinput 
				:inputBorder="false" 
				placeholder="输入红包有效期" 
				type="number" 
				:clearable="false"
				v-model="fromsData.time"
				>
			</uni-easyinput>
			<text class="importCard_title">天</text>
		</view>
	</view>
	<view class="importCard">
		<text class="importCard_title">红包标题:</text>
		<view>
			<uni-easyinput 
				:inputBorder="false" 
				:clearable="false"
				v-model="fromsData.content"
				:placeholder="fromsData.content"
				>
			</uni-easyinput>
		</view>
		<text class="importCard_title">字</text>
	</view>
	<view class="moneyBox">
		<text>￥{{redPacketMoney}}</text>
	</view>
	<view class="ButtomBox">
		<view class="ButtomBox_one" @click="trigger">
			<uni-icons type="loop" color="#daf2f7"></uni-icons>
			<text>切换{{stateText[redPacketState==0?1:0]}}红包</text>
		</view>
		<view class="ButtomBox_two" @click="submit">
			发红包
		</view>
	</view>
	<view class="explainBox">
		<text class="title">提示：</text>
		<text class="conetent">1、随机红包是按店主设置的红包个数，来随机分配每个红包的金额（与微信拼手气红包原理相同）</text>
		<text class="conetent">2、固定红包店主设置每个红包金额来进行分配的（与微信普通红包原理相同）</text>
		<text class="conetent">3、如用户抢到此红包，红包金额会直接到用户账号中，可用于下单等</text>
		<text class="conetent">4、如发出红包后撤销红包，可以点击红包记录，点击您需撤销的红包向坐化，后点击撤销，即可撤销红包</text>
		<text class="conetent">5、撤销红包或者红包到期红包未领完，那么剩下的红包金额将被返还店主</text>
		<text class="conetent" style="color:#ff6c6c;">
			6、如发出红包已有用户领取，那么撤销红包的金额将会扣除已领取的金额，按红包还未领取的金额返还店主
		</text>
	</view>
	
	<hqs-popup title="红包记录" :value='redPacketPupop' @back='closePopup' :maskClick="true">
		<view class="announcement">
			<text>点击红包向左滑动后点击按钮，即可撤销红包</text>
		</view>
		<uni-swipe-action>
			<uni-swipe-action-item v-for="itme,index in listData" v-if="listData.length!=0" :right-options="options" 
			@click="bindClick(itme,index)" >
				<view class="redPacketCard" @click="clickRedPacket(itme)">
					<image src="@/static/icon/mide/redPacket.png"></image>
					<view class="redPacketCard_right">
						<view class="redPacketCard_right_top">
							<text class="right_top_title">
								{{stateText[itme.type-1]+'红包'}} ({{redPacketSteta[itme.state-1]}})
							</text>
							<text class="right_top_money">￥{{itme.money}}</text>
						</view>
						<view class="redPacketCard_right_botton">
							<text>截止时间：{{common.getNowFormatDate(0,itme.endtime)}}</text>
							<text>{{itme.redPacket_receiver.length}}/{{itme.count}}</text>
						</view>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<view class="nullImage" v-if="listData.length==0">
			<image src="@/static/img/mimeImg/meiyou.png"></image><br>
			<text>暂无记录</text>
		</view>
	</hqs-popup>
	
	<uni-popup ref="particulars" type="center" style='z-index:999;'>
		<view class="particularsCard">
			<view class="redTop"></view>
			<view class="cardTitle">
				<view class="cardTitle_name">
					<image :src="counter.shopBasicsData.avatar" mode="aspectFill"></image>
					<text>你的红包</text>
				</view>
				<view class="cardTitle_describe">
					<text>{{redPacketParticularsData.title}}</text>
				</view>
			</view>
			<view class="cardContent">
				<text class="cardContent_title">
					{{redPacketParticularsData.count}}个红包共{{redPacketParticularsData.money}}元
				</text>
				<scroll-view :scroll-y="true" class="cardConten_scroll">
					<view class="user_card" v-for="itme,index in redPacketParticularsData.redPacket_receiver">
						<image :src="counter.baseUrl+itme.avatar" mode="aspectFill"></image>
						<view class="user_card_right">
							<view class="card_right_top">
								<text>{{itme.nickname}}</text>
								<text style="font-weight: bold;">{{itme.get_money}}元</text>
							</view>
							<view class="card_right_botton">
								<text>领取时间：{{common.getNowFormatDate(0,itme.create_time)}}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</uni-popup>
</template>

<script setup>
	import common from '@/common/getdatetime.js'
	import {useCounterStore} from '@/stores/counter'
	import {onTabItemTap} from '@dcloudio/uni-app';
	import api from "@/common/vmeitime-http/mine/mine.js"
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		//defineEmits,//发送数据
		//defineProps,//接收数据
	} from 'vue';
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	const counter = useCounterStore()//状态管理
	const redPacketState=ref(0)
	const stateText=reactive(['随机','固定'])
	const redPacketSteta=reactive(['领取中','店主撤销','系统撤销','已领完'])
	const redPacketMoney=ref('0.00')//最终红包金额
	
	const options=reactive([//左右滑动按钮数据
		{
			text: '撤销此红包',
			style: {
				backgroundColor: '#ff6565'
			}
		}
	])
	const bindClick=(e,index)=>{//点击滑动按钮
		var time=Date.now()
		if(e.endtime*1000<time){
			uni.showToast({
				title:'红包已过期，如未领取完会自动退还到账号',
				icon:'error',
				position:'center'
			})
			return
		}
		api.revocationRedPacket({
			"id":e.id
		}).then(res=>{
			if(res.data.code==1){
				uni.showToast({
					title:'撤销成功！退回金额'+res.data.data.money,
					icon:'error',
					position:'center'
				})
				listData.value[index].state='2'
			}else{
				uni.showToast({
					title:res.data.data,
					icon:'error',
				})
			}
		})
	}
	const redPacketPupop=ref(false)//红包记录弹窗控制开关
	const fromsData=reactive({//输入框v-model
		Money:'',
		several:'',
		time:'',
		content:'恭喜发财，大吉大利'
	})
	const redPacketParticularsData=ref([])//用户点击哪条数据
	
	const clickRedPacket=(data)=>{//红包记录里的卡片点击触发
		redPacketParticularsData.value=data
		// console.log(redPacketParticularsData.value);
		proxy.$refs.particulars.open()
	}
	
	const listData=ref([])//红包记录api数据
	
	const closePopup=()=>{//关闭弹窗
		redPacketPupop.value=false
	}
	const record=()=>{//打开弹窗
		api.getRedPacketRecord({}).then(res=>{//获取红包记录
			listData.value=res.data.data
		})
		redPacketPupop.value=true
	}
	
	const trigger=()=>{//切换红包类型
		redPacketState.value=redPacketState.value==0?1:0
		//切换红包类型清空输入值并提示
		redPacketMoney.value='0.00'
		fromsData.Money=''
		fromsData.several=''
		fromsData.time=''
		uni.showToast({
			title:'注意您现在选择的是'+stateText[redPacketState.value]+'红包~',
			position:'center',
			icon:'error'
		})
	}
	const submit=()=>{//发红包提交
		if(fromsData.Money && fromsData.several && fromsData.time !=''){
			uni.showLoading({
				title:'发送中'
			})
			api.pushRedPacket({
				"type":redPacketState.value+1,
				"Count":fromsData.several,
				"endDay":fromsData.time,
				"Money":redPacketMoney.value,
				"title":fromsData.content
			}).then(res=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({
						title:'发送成功~',
					})
					counter.shopBasicsData.money=counter.shopBasicsData.money-redPacketMoney.value
				}else{
					uni.showToast({
						title:res.data.data,
						position:'center',
						icon:'error'
					})
				}
				redPacketMoney.value='0.00'
				fromsData.Money=''
				fromsData.several=''
				fromsData.time=''
			})
		}else{
			if(fromsData.Money==''){
				uni.showToast({
					title:'红包金额不能为空',
					icon:'error',
					position:'center'
				})
			}else if(fromsData.several==''){
				uni.showToast({
					title:'红包个数不能为空',
					icon:'error',
					position:'center'
				})
			}else{
				uni.showToast({
					title:'红包有效期不能为空',
					icon:'error',
					position:'center'
				})
			}
		}
	}
	const fixationRedPacket=(e)=>{//红包个数输入框变化触发
		if(fromsData.Money!='' && redPacketState.value==1){
			redPacketMoney.value=fromsData.Money*e
		}
	}
	const randomRedPacket=(e)=>{//金额输入框变化触发
		if(redPacketState.value==0){
			if(e==''){
				redPacketMoney.value='0.00'
			}else{
				redPacketMoney.value=e
			}
		}else{
			if(fromsData.Money!='' && redPacketState.value==1){
				redPacketMoney.value=fromsData.Money*fromsData.several
			}
		}
	}
	const back=()=>{
		uni.navigateBack()
	}
</script>

<style lang="scss">
	.announcement{
		width:100%;
		padding:10rpx;
		background-color: #fddf30;
		font-size:26rpx;
		color: #fd7779;
		
	}
	.nullImage{
		text-align: center;
		color: #868686;
		image{
			width:400rpx;
			height:400rpx;
		}
	}
	.user_card{
		width:100%;
		background-color: white;
		height:120rpx;
		border-radius:15rpx;
		margin:10rpx auto;
		box-shadow: 0px 5px 15px #f1f1f1;
		display: flex;
		align-items: center;
		.user_card_right{
			display: flex;
			flex-flow: column;
			height:100rpx;
			width:500rpx;
			justify-content:space-around;
			.card_right_top{
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.card_right_botton{
				color: #868686;
				font-size:24rpx;
			}
		}
		image{
			width:100rpx;
			height:100rpx;
			margin:0rpx 10rpx;
			border-radius:5rpx;
		}
	}
	.cardContent{
		padding:10rpx;
		box-sizing: border-box;
		.cardConten_scroll{
			border-top:1rpx solid #cacaca;
			height:600rpx;
		}
		.cardContent_title{
			font-size:26rpx;
			color: #868686;
		}
		::-webkit-scrollbar{
		    display: none;
		}
		/* 解决H5 的问题 */
		uni-scroll-view .uni-scroll-view::-webkit-scrollbar {
			/* 隐藏滚动条，仍然可以滚动 */
			display: none
		}
	}
	.cardTitle{
		display: flex;
		flex-flow: column;
		align-items: center;
		margin:20rpx 0rpx;
		.cardTitle_describe{
			font-size:26rpx;
			color: #868686;
		}
		.cardTitle_name{
			font-weight: bold;
			display: flex;
			align-items: center;
			image{
				width:60rpx;
				height:60rpx;
				border-radius:5rpx;
				margin:10rpx 10rpx;
			}
		}
	}
	.redTop{
		width:100%;
		height:180rpx;
		background-color:#ff5757;
		border-radius:15rpx 15rpx 50% 50%;
		
	}
	.particularsCard{
		width:650rpx;
		height:1000rpx;
		background-color: white;
		border-radius:15rpx;
		background-color:#fff7f7;
		
	}
	.redPacketCard{
		width:720rpx;
		background-color:white;
		border-radius:15rpx;
		margin:20rpx auto;
		display: flex;
		align-items: center;
		box-shadow: 0px 5px 15px #ececec;
		.redPacketCard_right{
			height:120rpx;
			width:540rpx;
			display: flex;
			flex-flow: column;
			justify-content: space-between;
			.redPacketCard_right_top{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.right_top_title{
					font-weight:32rpx;
					font-weight:bold;
				}
				.right_top_money{
					color: red;
					font-weight:32rpx;
					font-weight:bold;
				}
			}
			.redPacketCard_right_botton{
				display: flex;
				align-items: center;
				justify-content: space-between;
				color: #c8c8c8;
				font-size:26rpx;
			}
		}
		image{
			width:160rpx;
			height:160rpx;
			display: flex;
		}
		
	}
	.moneyBox{
		color: red;
		font-size:68rpx;
		font-weight: bold;
		text-align: center;
	}
	.explainBox{
		width:720rpx;
		margin:40rpx auto;
		color: #b9b9b9;
		font-size:26rpx;
		display: flex;
		flex-flow:column;
		.conetent{
			margin:10rpx 0rpx;
			padding-left:20rpx;
		}
		.title{
			font-size:32rpx;
			font-weight: bold;
		}
	}
	.ButtomBox{
		display: flex;
		justify-content: center;
		margin-top:40rpx;
		view{
			width:260rpx;
			height:80rpx;
			text-align: center;
			line-height: 80rpx;
			color: white;
			border-radius:10rpx;
			margin:0rpx 20rpx;
			transition:.2s;
		}
		.ButtomBox_one{
			background-color: deepskyblue;
			font-size:26rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color:#daf2f7;
		}
		.ButtomBox_two{
			font-weight: bold;
			background-color:#FDC830;
			flex:1;
		}
		.ButtomBox_one:active{
			background-color:#8fdcff;
			transition:.2s;
			transform: scale(0.95);
		}
		.ButtomBox_two:active{
			transition:.2s;
			transform: scale(0.95);
			background-color:#fddab1;
		}
		.ButtomBox_one_close{
			pointer-events: none;
			background-color:#8fdcff;
		}
		.ButtomBox_two_close{
			pointer-events: none;
			background-color:#fddab1;
		}
	}
	
	.importCard{
		background-color:white;
		padding:10rpx 20rpx;
		margin:20rpx auto;
		// box-sizing: border-box;
		width:680rpx;
		border-radius:10rpx;
		display: flex;
		align-items: center;
		font-size:26rpx;
		justify-content:space-between;
		view{
			display: flex;
			align-items: center;
		}
		.importCard_title{
			font-size:32rpx;
			margin-left:5rpx;
		}
		
	}
	body{
		background-color:#f3f3f3;
	}
	.status_bar {
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}

</style>

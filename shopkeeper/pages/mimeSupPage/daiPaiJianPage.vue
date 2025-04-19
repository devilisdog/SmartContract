<template>
	<z-paging ref="prizegiving" v-model="prizegivingData" @query='prizegivingList' :loading-more-enabled="false">
		<template v-slot:top>
			<view class="status_bar"></view>
			<uni-nav-bar 
				title="待派奖" 
				leftIcon="back" 
				@clickLeft="back" 
				rightText="派奖记录" 
				@clickRight="pai()" 
				leftText="返回"
			/>
		</template>
		<yc-paijiang-card 
			@message='radioOrder' 
			ref="addAll" 
			v-for="itme,index in prizegivingData" 
			:orderData='itme'
			:allCheckValue='prizegIndex[index]'
			:orderIndex='index'
			@finalStatementClick='finalStatement'/>
		<template v-slot:bottom>
			<view class="bottmTab">
				<view style="display: flex;flex: 1;justify-content: space-between;">
					<checkbox style="margin-left:20rpx;" @click="allChecked" :checked="judge==1">全选</checkbox>
					<view>
						<text>合计：{{pitchOrderMoney}}</text>
					</view>
				</view>
				<view class="button-yellow" @click="clearing">
					<text>派奖</text>
				</view>
			</view>
		</template>
	</z-paging>
	<!-- 对话框 -->
	<fui-dialog :show="show" @click="clickDialogButton" :content="dialogData.closeData"></fui-dialog>
</template>

<script setup>
	import api from '@/common/vmeitime-http/mine/mine.js';
	import indexApi from "@/common/vmeitime-http/index/index.js"
	import {onShow} from "@dcloudio/uni-app"
	import {ref,reactive,getCurrentInstance,} from 'vue';
	import {useCounterStore} from '@/stores/counter'
	
	const counter = useCounterStore(); //状态管理
	const {proxy,ctx} = getCurrentInstance()
	const prizegivingData=ref([])//全部订单数据
	const pitchOrderMoney=ref(0)//已选中订单的合计中奖金额
	const pitchOrder=reactive([])//已选中的订单id数组
	const judge=ref(0)//全选按钮动态判断状态
	const prizegIndex=reactive([])//对应订单的index生成的勾选状态，0=关闭/1=开启[0，0，0，0]
	const show=ref(false)
	const dialogData=reactive({
		'closeData':null,
		'order_id':null
	})
	onShow(()=>{
		if(proxy.$refs.prizegiving){
			uni.showLoading({title:'加载中~'})
			proxy.$refs.prizegiving.refresh ()
		}
	})
	const allChecked=(e)=>{//店主全选派奖订单
		if(judge.value==0){
			judge.value=1
			for(var q=0;q<prizegivingData.value.length;q++){
				//便利prizegivingData给pitchOrder，并计算全部待派奖订单的合计金额
				var newArr=pitchOrder.includes(prizegivingData.value[q].order_id)
				if(newArr==false){
					prizegIndex[q]=1
					pitchOrder.push(prizegivingData.value[q].order_id)
					pitchOrderMoney.value+=Number(prizegivingData.value[q].AwardMoney)
				}
			}
		}else{
			pitchOrder.splice(0,pitchOrder.length)
			pitchOrderMoney.value=0
			judge.value=0
			for(var f=0;f<prizegIndex.length;f++){//如果全选在勾选状态再次点击就循环把订单状态改为关闭状态0
				prizegIndex[f]=0
			}
		}
	}
	
	const radioOrder=(state,index)=>{//店主单个选中派奖订单
		if(state==true){
			pitchOrder.push(prizegivingData.value[index].order_id)
			prizegIndex[index]=1
			pitchOrderMoney.value+=Number(prizegivingData.value[index].AwardMoney)
			if(pitchOrder.length==prizegivingData.value.length){
				judge.value=1
			}
		}else{
			var arr=pitchOrder.indexOf(prizegivingData.value[index].order_id)
			pitchOrder.splice(arr,1)
			pitchOrderMoney.value-=Number(prizegivingData.value[index].AwardMoney)
			judge.value=0
			prizegIndex[index]=0
		}
	}
	
	const prizegivingList=()=>{//带派奖的刷新
		prizegIndex.length=0
		api.GetAwaitPrizegiving({}).then(res=>{
			uni.hideLoading()
			proxy.$refs.prizegiving.complete(res.data.data)
			counter.shopBasicsData.count.waitAward=res.data.data.length
			for(var i=0;i<res.data.data.length;i++){
				//获取到数据循环生成对应index订单的勾选状态（默认是0这样方便后续点击全选后单独操作所需的订单）
				prizegIndex.push(0)
			}
		})
	}
	const clearing=()=>{//多选派奖
		if(pitchOrder.length>0){
			uni.showLoading({title:'派奖中~'})
			indexApi.PostAward({"order_ids":pitchOrder.length==1?pitchOrder[0]:pitchOrder}).then((res)=>{
				uni.hideLoading()
				if(res.data.code==1){
					uni.showToast({title:'派奖成功~'})
					pitchOrderMoney.value=0
					pitchOrder.splice(0,pitchOrder.length)
					judge.value=0
				}else{
					uni.showToast({title:res.data.data,
						icon:'error',
					})
				}
				proxy.$refs.prizegiving.refresh()
			})
		}else{
			uni.showToast({
				title:'请选择派奖订单~',
				icon:'error'
			})
		}
	}
	
	const clickDialogButton=(e)=>{
		if(e.index==1){
			indexApi.PostAward({"order_ids":dialogData.order_id}).then((res)=>{
				if(res.data.code==1){
					uni.showToast({title:'派奖成功~'})
					pitchOrderMoney.value=0
					pitchOrder.splice(0,pitchOrder.length)
					judge.value=0
				}else{
					uni.showToast({title:res.data.data,
						icon:'error',
					})
				}
				proxy.$refs.prizegiving.refresh()
			})
		}
		show.value=false
	}
	const finalStatement=(order_id)=>{
		dialogData.order_id=order_id
		dialogData.closeData='确定派奖'+order_id+'订单吗？'
		show.value=true
	}

	const back=()=>{//返回
		uni.navigateBack()
	}
	const pai=()=>{//跳转至派奖记录页面
		uni.navigateTo({
			url:'/pages/mimeSupPage/orderInquiry?orderState=7'
		})
	}

</script>

<style>
	.button-yellow{
		display: flex;
		background-color: #FDC830;
		width:270rpx;
		height:80rpx;
		align-items: center;
		justify-content:center;
		margin-left:20rpx;
		color: white;
		font-weight:600;
		border-radius:20rpx 0 0  20rpx;
	}
	.bottmTab{
		width:100%;
		height:120rpx;
		background-color: white;
		box-shadow:#c1c1c1 10rpx 10rpx 30rpx 1rpx;
		display:flex;
		justify-content: space-between;
		align-items: center;
	}
	.status_bar{
		width: 100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	
	body {
		background-color: #f3f3f3;
	}

</style>

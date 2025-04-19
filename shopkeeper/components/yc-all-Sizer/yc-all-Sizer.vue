<template>
	<view class="popup" :style="{height:common.scrollH()+'rpx'}">
		<text>彩种</text>
		<view class="caibuttomBox">
			<view :class="index==Props.lastTimeData['彩种'].index?'clickButtom':'Buttom'"  
				  v-for="item,index in caiData" :key="item" 
				  @click="clickButtom(item,index,'cai')"
			>
				<text>{{item}}</text>
			</view>
		</view>
		
		<view style="margin:30rpx 0rpx; ">
			<text>时间选择</text>
			<uni-datetime-picker
				type="daterange"  
				style='margin-top:20rpx;' 
				@change='timeClick'
				v-model="Props.lastTimeData['时间']"
			></uni-datetime-picker>
		
		</view>
		
		<text>订单状态</text>
		<view class="caibuttomBox">
			<view :class="index==Props.lastTimeData['状态'].index?'clickButtom':'Buttom'" 
				   v-for="item,index in zhuantai" :key="item" 
				   @click="clickButtom(item,index,'state')"
			>
				<text>{{item}}</text>
			</view>
		</view>
	</view>
	<view class="bottmStyle">
		<view class="buttonStyle" style="background-color:#c8c8c8;flex:1;" @click="reset">
			<text>重置</text>
		</view>
		<view class="buttonStyle" style="background-color:#FDC830;flex:1;" @click="confirm">
			<text>确定</text>
		</view>
	</view>
</template>

<script setup>
	import common from '@/common/common'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		getCurrentInstance,
		defineEmits,//发送数据
		defineProps,//接收数据
	} from 'vue';
	const Emits=defineEmits(['confirm'])
	const Props=defineProps(['lastTimeData'])
	const {
		proxy,
		ctx
	} = getCurrentInstance()
	
	const clickButtom=(item,index,type)=>{//点击彩种选项（回调）
		if(type=='cai'){
			Props.lastTimeData['彩种'].index=index	
			Props.lastTimeData['彩种'].title=item
		}else{
			Props.lastTimeData['状态'].index=index
			Props.lastTimeData['状态'].title=item	
			
		}
		
	}
	const timeClick=(e)=>{
		if(e[0]==e[1]){
			//转换未yyyy/dd/mm避免ios无法转换时间戳
			var starinit=e[0].split('-')
			var endinit=e[1].split('-')
			var newStarinit=starinit.join('/')
			var newEndinit=endinit.join('/')
			var date_star=new Date(newStarinit)
			var date_end=new Date(newEndinit)
			date_star.setHours(0)
			date_end.setDate(date_end.getDate()+1)
			date_end.setHours(0)
			
			e[0]=date_star.getFullYear()+'-'+(date_star.getMonth()+1)+'-'+date_star.getDate()
			e[1]=date_end.getFullYear()+'-'+(date_end.getMonth()+1)+'-'+date_end.getDate()
			Props.lastTimeData['时间']=e
			return
		}
		Props.lastTimeData['时间']=e
	}

	const confirm=()=>{//确定按钮
		Emits('confirm',Props.lastTimeData)
	}
	const reset=()=>{//重置按钮
		init()
	}
	const init=()=>{//初始化
		Props.lastTimeData['彩种'].index=0
		Props.lastTimeData['彩种'].title='全部订单'
		Props.lastTimeData['状态'].index=0
		Props.lastTimeData['状态'].title='全部订单'
	}
	const caiData = reactive([ //彩种的循环数据
		'全部订单', '竞彩足球', '竞彩篮球',
		'胜负过关', '北京单场', '双色球',
		'大乐透', '排列三', '排列五',
		'七星彩', '七乐彩', '快乐八',
		'福彩3D', '任选九', '胜负彩'
	])
	const zhuantai = reactive([ //订单状态的循环数据
		'全部订单', '待接单', '待出票',
		'已出票', '已撤销', '未中奖',
		'已中奖', '已派奖'
	])
</script>

<style>
	.buttonStyle{
		text-align: center;
		line-height:100rpx;
		color: #ffffff;;
	}
	.caibuttomBox{
		display: grid;
		grid-template-columns:repeat(3,auto);
		grid-template-rows:repeat(5,auto);
		grid-row-gap:30rpx;
		margin-top:20rpx;
		justify-content: space-around;
	}
	.popup {
		width: 570rpx;
		background-color: #fff;
		border-radius: 40rpx 0 0 40rpx;
		padding:30rpx;
		margin-top:var(--status-bar-height);
			
	}
	.Buttom {
		width:160rpx;
		height:50rpx;
		border:2rpx solid #595959;
		text-align: center;
		line-height:50rpx;
		color: #595959;
		border-radius:7rpx;
	}
	.clickButtom {
		width:160rpx;
		height:50rpx;
		border:2rpx solid #FDC830;
		text-align: center;
		line-height:50rpx;
		color:#FDC830;
		border-radius:7rpx;
		transition: 0.2s;
	}
	
	.bottmStyle {
		display: flex;
		bottom:0rpx;
		position: fixed;
		width:100%;
	}

</style>
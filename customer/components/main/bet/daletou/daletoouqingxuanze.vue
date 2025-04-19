<template>
	<!-- <uni-nav-bar title="胆码选择" left-icon="closeempty" @clickLeft="back()" style="border-radius:20rpx"></uni-nav-bar> -->
	<view style="height:20rpx;width:100%;"></view>
	<scroll-view :scroll-y="true" style="height:90vh;">
		<view style="display: flex;flex-direction: column;margin-left: auto;margin-left: 40rpx;">
			<text style="font-size:34rpx;font-weight: bold;display: flex;margin-top: 20rpx;color: #2a2a2a ;">
				红球号码
			</text>
			<text style="font-size:10px;display: flex;margin-top: 10rpx;color: #b8b8b8 ;">可选0-5个</text>
		</view>
		<view class="shuzhi">
			<view v-for="item,index in props.ballquantity.red" :key="item" @click="click(item,'red')" :style="data.red.length==5||(data.red.length+data.blue.length)==6?boxstlye_red[index]==0?'background-color: #9f9f9f;color: black;':'background-color: red;color: #ffffff;':boxstlye_red[index]==0?'background-color: #ffdede;color: red;':'background-color: red;color: #ffffff;'" style="margin:20rpx 20rpx;border-radius:100%;width:75rpx;height:75rpx;">
				{{item<10?'0'+item:item}}
			</view>
		</view>
		<view style="display: flex;margin-top: 20rpx;display: flex;flex-direction: column;margin-left: 40rpx;">
			<text style="font-size:34rpx;font-weight: bold; margin-left: 10rpx;color: #2a2a2a ;">
				蓝球号码
			</text>
			<text style="font-size:10px; margin-left: 10rpx;margin-top: 10rpx;color: #b8b8b8 ;">
				{{props.ssqIndex == 1 ? '可选0-1个' : '可选0-2个'}}
			</text>
		</view>
		<view class="shuzhi" >
			<view v-for="item,index in props.ballquantity.blue" :key="item" @click="click(item,'blue')" :style="(props.ssqIndex==1?data.blue.length==1 : data.blue.length==2)||(data.red.length+data.blue.length)==6?boxstlye_blue[index]==0?'background-color: #9f9f9f;color:#29adff;':'background-color:#1e8bff;color: #ffffff;':boxstlye_blue[index]==0?'background-color: #cff3ff;color:#1e8bff;':'background-color:#1e8bff;color: #ffffff;'" style="margin:20rpx 20rpx;border-radius:100rpx;width:75rpx;height:75rpx;">
				{{item<10?'0'+item:item}}
			</view>
		</view>
		<view style="width:100%;height:100rpx;"></view>
	</scroll-view>
	<view class="bottom">
		<view style="display: flex;flex-direction: row;height: 80rpx;">
			<view @click="back" class="initButton">
				<text style="font-size: 32rpx;font-weight: bold;" >清空关闭</text>
			</view>
			<view @click="submit" class="submitBuuton">
				<text style="font-size: 32rpx;font-weight: bold;">确认选择</text>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		onBeforeMount,
		ref,
		reactive,
		getCurrentInstance,
		defineProps, //接收数据
		defineEmits //发送数据
	} from 'vue';
	const {proxy,ctx} = getCurrentInstance()
	const props = defineProps(['ssqIndex','ballquantity'])
	const emits = defineEmits(['close'])
	onBeforeMount(() => {
		init()
	})
	const boxstlye_red = reactive([])
	const boxstlye_blue = reactive([])
	const init = () => {
		boxstlye_red.splice(0, boxstlye_red.length)
		boxstlye_blue.splice(0, boxstlye_blue.length)
		data.red.splice(0, data.red.length)
		data.blue.splice(0, data.blue.length)
		for (var i = 1; i <= props.ballquantity.red; i++) {
			boxstlye_red.push(0)
		}
		for (var i = 1; i <= props.ballquantity.blue; i++) {
			boxstlye_blue.push(0)
		}
	}
	const data = reactive({
		red:[],
		blue:[]
	})
	const click=(item,type)=>{
		if(type=='red'){
			if(boxstlye_red[item-1] == 0){
				if(data.red.length<5 && data.red.length+data.blue.length < 6){
					boxstlye_red[item-1]=1
					data.red.push(item)
				}
				return
			}
			if(boxstlye_red[item-1] == 1){
				boxstlye_red[item-1]=0
				
				var index = data.red.findIndex(i =>
					i == item 
				)
				data.red.splice(index, 1)
				return
			}
		}
		if(type=='blue'){
			if(boxstlye_blue[item-1] == 0){
				if(props.ssqIndex==1? data.blue.length<1 :data.blue.length<2 && data.red.length+data.blue.length < 6){
					boxstlye_blue[item-1]=1
					data.blue.push(item)
				}
				return
			}
			if(boxstlye_blue[item-1] == 1){
				boxstlye_blue[item-1]=0
				
				var index = data.blue.findIndex(i =>
					i == item 
				)
				data.blue.splice(index, 1)
				return
			}
		}
	}
	
	const back =()=>{
		init()
		emits('close')
	}
	
	const submit =()=>{
		emits('close',data)
	}
	
</script>
<style>
	.shuzhi{
		display: grid;
		grid-template-columns: repeat(6,auto);
		grid-template-rows: repeat(auto,auto);
		text-align: center;
		line-height:75rpx;
		font-weight: bold;
	}
	.initButton{
		display: flex;
		flex:1;
		background-color: white;
		justify-content: center;
		align-items: center;
		background-color:#ffdede;
		color:red;
		border-radius:20rpx 0 0 0;
	}
	.submitBuuton{
		display: flex;
		flex:1;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to right, #f04b49, #ff7979);
		color:white;
		border-radius:0 20rpx 0 0;
	}
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
	
	/* 导航 */
	.navigation{
		width:680rpx;
		padding:20rpx;
		align-items: center;
		border-radius:20rpx 20rpx 0 0;
		box-shadow: 0 5rpx 15rpx -8rpx #ebebeb;
		display: flex;
	}
	.tt {
		font-size: 15px;
		font-weight: 700;
		justify-content: center;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.tt2 {
		font-size: 15px;
		font-weight: 700;
		justify-content: center;
		display: flex;
		align-items: center;
		justify-content: center;

	}

	.bottom {
		bottom: 0;
		left: 0;
		position: fixed;
		width: 100%;
	}


	.biaoti1 {
		font-size: 120%;
		margin-top: 45rpx;
	}
</style>

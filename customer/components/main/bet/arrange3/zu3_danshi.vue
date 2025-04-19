<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
			<view style="color: #9c9c9c;">
				<text>至少选择
					<text style="color: red;">1</text>
					<text>个重号</text>
					<text style="color: red;">1</text>
					<text>个单号，奖金</text>
					<text style="color:red;">346</text>
					<text>元</text>
				</text>
			</view>
			<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu">
				<view style="font-size:18rpx;margin-top:5rpx;" @click="jixuan_click">机选</view>
			</view>
	</view>
	<!-- 直选-直选定位 -->
	<view>
		<text style="font-size: 30rpx;position: relative;top: 35rpx;left: 30rpx;color: #4a4a4a;">重号 :</text>
		<view style="margin-left: 20rpx;">
			<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;align-items: center;">
				<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
					
					<view v-for="itme,index in 10" @click="dianClick(index,'chong')" class="baiwei"
					:style="queStlye.chong[index] == 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
						<!-- 球 -->
						<text class="baiwei-text">{{index}}{{index}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 下划线 -->
		<view style="width: 720rpx;height: 2rpx;background-color: #f7f7f7;margin: auto;margin-top: -5rpx;"></view>
	</view>
	
	<view>
		<text style="font-size: 30rpx;position: relative;top: 35rpx;left: 30rpx;color: #4a4a4a;">单号 :</text>
		<view style="margin-left: 20rpx;">
			<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;align-items: center;">
				<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
					
					<view v-for="itme,index in 10" @click="dianClick(index,'dan')" class="baiwei"
					:style="queStlye.dan[index] == 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
						<!-- 球 -->
						<text class="baiwei-text">{{index}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 下划线 -->
		<view style="width: 720rpx;height: 2rpx;background-color: #f7f7f7;margin: auto;margin-top: -5rpx;"></view>
	</view>
		
	
</template>

<script setup>
	import arrange3boo from "@/components/main/bet/arrange3/arrange3boo.vue"
	
	import common from "@/common/common.js"
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		getCurrentInstance,
		defineProps, // 接收
		defineEmits, // 发送
		watch,
		// nextTick
	} from 'vue';
	const Props = defineProps(['dele'])
	
	const Emits = defineEmits(['datachange'])
	
	watch(() => Props.dele, (oldval, newval) => {
		init()
	})
	
	onBeforeMount(() => {
		init()
	})

	
	const data = reactive({})
	const queStlye = reactive({dan:[],chong:[]})
	const init=()=>{
		var arr = {
			note:0,
			money:0,
			data:{
				dan:[],
				chong:[]
			}
		}
		data.value = arr
		queStlye.chong.splice(0, queStlye.chong.length)
		queStlye.dan.splice(0, queStlye.dan.length)
		for (var i = 0; i <= 10; i++) {
			queStlye.chong.push(0)
			queStlye.dan.push(0)
		}
	}
	
	const dianClick = (e,index) => {//球的状态判断
		//console.log(e,index);
		if(index == 'dan'){
			if(data.value.data.chong!=e+""+e+""){
				if(queStlye.dan[e]==0){
				
					if(data.value.data.dan==''){
						data.value.data.dan=e+''
						isEmint()
						queStlye.dan[e] = 1
					}else{
						queStlye.dan[data.value.data.dan-0] = 0
						data.value.data.dan=e+''
						isEmint()
						queStlye.dan[e] = 1
					}
				}else {
					data.value.data.dan=''
					isEmint()
					queStlye.dan[e] = 0
				}
			}else{
				queStlye.dan[data.value.data.dan-0] = 0
				queStlye.chong[(data.value.data.chong-0)%10] = 0
				
				data.value.data.chong =''
				data.value.data.dan=e+''
				queStlye.dan[e] = 1
			}
			
		}
		if(index == 'chong'){
			if(data.value.data.dan!=e){
				if(queStlye.chong[e]==0){
					if(data.value.data.chong==''){
						data.value.data.chong=e+''+e+''
						isEmint()
						queStlye.chong[e] = 1
					}else{
						queStlye.chong[(data.value.data.chong-0)%10] = 0
						
						data.value.data.chong=e+''+e+''
						isEmint()
						queStlye.chong[e] = 1
					}
					
				}else {
					data.value.data.chong=''
					isEmint()
					queStlye.chong[e] = 0
				}
				
			}else{
				queStlye.dan[data.value.data.dan-0] = 0
				queStlye.chong[(data.value.data.chong-0)%10] = 0
				
				data.value.data.dan =''
				data.value.data.chong=e+''+e+''
				queStlye.chong[e] = 1
			}
			
		}
		
	}
	
	const isEmint = ()=>{
		if(data.value.data.dan!='' && data.value.data.chong!=''){
			data.value.note = 1
			data.value.money = 2
			Emits('datachange',data.value,'zu3_danshi')
		}else{
			data.value.note = 0
			data.value.money = 0
			Emits('datachange',data.value,'zu3_danshi')
		}
		
	}
	
	
	const jixuan_click =()=>{
		init()
		
		var arr = common.GetRandomArray(0, 9, 2)
		
		queStlye.dan[arr[0]] = 1
		data.value.data.dan=arr[0]+''
		
		queStlye.chong[arr[1]] = 1
		data.value.data.chong=(arr[1]+''+arr[1]+'')
		isEmint()
	}
</script>

<style>
	.baiwei {
		display: flex;
		width: 65rpx;
		height: 65rpx;
		border-radius: 50rpx;
		margin-left: 30rpx;
	}
	
	.baiwei-text {
		font-size: 34rpx;
		line-height: 60rpx;
		margin: auto;
	}
	.borderuu {
		border-radius: 10rpx;
		border: 1rpx solid #e1e1e1;
	}
</style>
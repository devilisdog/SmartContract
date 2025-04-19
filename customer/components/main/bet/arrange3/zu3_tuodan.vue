<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
			<view style="color: #9c9c9c;">
				<text>胆码(选择1个)</text>
			</view>
			<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu">
				<view style="font-size:18rpx;margin-top:5rpx;" @click="jianting_click">机选</view>
			</view>
	</view>
	<!-- 直选复式-球 -->
	<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;margin-top:30rpx;align-items: center;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
			
			<view v-for="itme,index in 10" @click="dianClick(index,'red')" class="baiwei"
			:style="queStlye.red[index] == 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
				<!-- 球 -->
				<text class="baiwei-text">{{index}}</text>
			</view>
		</view>
	</view>

	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top:20rpx;">
			<view style="color: #9c9c9c;">
				<text>拖码(选择2个及以上与胆码不同的号码)</text>
			</view>
	</view>
	<!-- 直选复式-球 -->
	<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;margin-top:30rpx;align-items: center;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
			<view v-for="itme,index in 10" @click="dianClick(index,'blue')" class="baiwei"
			:style="queStlye.blue[index] == 0 ? 'color:#0000ff;background-color: #ddfbff;' : 'color:#ffffff;background-color: #0000ff;'">
				<!-- 球 -->
				<text class="baiwei-text">{{index}}</text>
			</view>
		</view>
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
	const queStlye = reactive({red:[],blue:[]})
	const init=()=>{
		var arr = {
			note:0,
			money:0,
			data:{
				datadan:{
					0:[],
				},
				value:{
					0:[],
					},	
			}
		}
		data.value = arr
		queStlye.red.splice(0, queStlye.red.length)
		queStlye.blue.splice(0, queStlye.blue.length)
		for (var i = 0; i <= 10; i++) {
			queStlye.red.push(0)
			queStlye.blue.push(0)
		}
	}

	const dianClick = (e,type) => {//球的状态判断
		//console.log(e,type);
		if(type == 'red'){
			var index = data.value.data.value[0].findIndex(item =>item == e) // 11  11			
			if(index==-1){
				if(data.value.data.datadan[0]==null){
					data.value.data.datadan[0]=e
					isEmint()
					queStlye.red[e] = 1
				}else{
					queStlye.red[data.value.data.datadan[0]] = 0
					
					data.value.data.datadan[0]=e
					isEmint()
					queStlye.red[e] = 1
				}
			}else{
				uni.showToast({
					icon:"error",
					title: '已选择为拖码',
					duration: 2000
				})
			}
			
		}
		if(type == 'blue'){
			// console.log(data.value.data.dan[0],e);
			if(data.value.data.datadan[0]!=e){
				if(queStlye.blue[e]==0){
					data.value.data.value[0].push(e)
					isEmint()
					queStlye.blue[e] = 1
				}else {
					var index = data.value.data.value[0].findIndex(item =>
						//console.log(item),
						item == e // 11  11
					)
					// 删除掉里面的投注内容
					data.value.data.value[0].splice(index, 1)
				
					isEmint()
					
					queStlye.blue[e] = 0
					
				}
			}else{
				uni.showToast({
					icon:"error",
					title: '已选择为胆码',
					duration: 2000
				})
			}
			
		}
		
	}
	
	const isEmint = ()=>{
			data.value.data.value[0] = common.quickSort(data.value.data.value[0])
		if(data.value.data.value[0].length>=2&&data.value.data.datadan[0]!=null){
			data.value.note = common.TakeMN(data.value.data.value[0].length,1) * 2
			data.value.money = data.value.note*2
			Emits('datachange',data.value,'zu3_tuodan')
		}else{
			data.value.note = 0
			data.value.money = 0
			Emits('datachange',data.value,'zu3_tuodan')
		}
	}
	
	
	const jianting_click =()=>{
		init()
		var arr = common.GetRandomArray(0, 9,3)
		queStlye.red[arr[0]] = 1
		data.value.data.datadan[0]=arr[0]
		
		for (var i = 1; i <= 2; i++) {
			// console.log(Math.floor(Math.random() * 30))
			//var kk=Math.floor(Math.random() * 30+1);//取1-30的随机整数
			queStlye.blue[arr[i]] = 1
			data.value.data.value[0].push(arr[i])
		}
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
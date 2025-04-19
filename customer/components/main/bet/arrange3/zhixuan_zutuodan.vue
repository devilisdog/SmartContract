<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
			<view style="color: #9c9c9c;">
				<text>胆码(选择1-2个)</text>
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
				<text>拖码(胆码与拖码数量之和大于等于4)</text>
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
				value:{
					0:[]
				},
				dan:{
					0:[]
				}
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
			if(queStlye.red[e]==0){
				
				if(data.value.data.dan[0].length==2){
					uni.showToast({
						icon:"error",
						title: '选择1-2个',
						duration: 2000
					});
				}else{
					data.value.data.dan[0].push(e)
					isEmint()
					queStlye.red[e] = 1
				}
				return
			}else {
				var index = data.value.data.dan[0].findIndex(item =>item == e)
				data.value.data.dan[0].splice(index, 1)
				isEmint()
				queStlye.red[e] = 0
			}
		}
		if(type == 'blue'){
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
		}
		
	}
	
	const isEmint = ()=>{
		data.value.data.value[0] = common.quickSort(data.value.data.value[0])
		data.value.data.dan[0] = common.quickSort(data.value.data.dan[0])
		if(data.value.data.value[0].length+data.value.data.dan[0].length >=4){
			data.value.note = common.TakeMN(data.value.data.value[0].length,3-data.value.data.dan[0].length) * 6
			data.value.money = data.value.note*2
			Emits('datachange',data.value,'zhixuan_tuodan')
		}else{
			data.value.note = 0
			data.value.money = 0
			Emits('datachange',data.value,'zhixuan_tuodan')
		}
	}
	
	
	const jianting_click =()=>{
		init()
		var red = common.GetRandomArray(0, 9, 2)
		for (var i = 0; i <= 1; i++) {
			// console.log(Math.floor(Math.random() * 30))
			//var kk=Math.floor(Math.random() * 30+1);//取1-30的随机整数
			queStlye.red[red[i]] = 1
			data.value.data.dan[0].push(red[i])
		}
		var blue = common.GetRandomArray(0, 9, 2)
		for (var i = 0; i <= 1; i++) {
			// console.log(Math.floor(Math.random() * 30))
			//var kk=Math.floor(Math.random() * 30+1);//取1-30的随机整数
			queStlye.blue[blue[i]] = 1
			data.value.data.value[0].push(blue[i])
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
<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
		<view style="color: #9c9c9c;">
			<text>至少选择<text style="color: red;">1</text>个跨度值</text>
		</view>
	</view>
	<!-- 直选复式-球 -->
	<view style="display: flex;width: 700rpx;justify-content: flex-end;position: relative;top: -42rpx;left: 26rpx;">
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu"
			@click="mathbum(2,8,1)">
			<view style="font-size:18rpx;">机选</view>
		</view>
	</view>
	<view
		style="display: flex; width: 550rpx;height: 230rpx;margin: auto;align-items: center;position: relative;left: 20rpx;margin-top: -50rpx;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
	
			<view v-for="itme,index in ballData" @click="dianClick(itme,index)" class="baiwei"
				:style="queStlye[index]==0?'background-color:#ffeded;color: #ff6262':'color:#fff;background-color: #ff6262;'">
				<!-- 球 -->
				<view v-show="queStlye[index] == 0 || queStlye[index] == 1" style="margin: auto;">
					<text style="font-size: 32rpx;line-height: 65rpx;">{{itme}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>	
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
	} from 'vue';
	const Props = defineProps(['dele'])
	
	const Emits = defineEmits(['datachange'])
	var ballData=[2,3,4,5,6,7,8,9]
	watch(() => Props.dele, (oldval, newval) => {
		init()
	})
	
	onBeforeMount(() => {
		init()
	})
	const data = reactive({})
	const queStlye = reactive([]) //这个是球的
	const init=()=>{
		var arr = {
			note:0,
			money:0,
			data:{
				0:[]
			}
		}
		data.value = arr
		queStlye.splice(0, queStlye.length)
		for (var i = 0; i <= ballData.length; i++) {
			queStlye.push(0)
		}
	}
	
	const dianClick = (e,index) => { //球的状态判断
		if (queStlye[index] == 0) {
			data.value.data[0].push(e)
			isnote()
			queStlye[index] = 1
			return
		}
		if (queStlye[index] == 1) {
			var xindex = data.value.data[0].findIndex(item =>
				item == e // 11  11
			)
			// 删除掉里面的投注内容
			data.value.data[0].splice(xindex, 1)
			isnote()
			queStlye[index] = 0
			return
		}
		
	}
	const anniu = reactive([
		//两种值-一个用来判断一个用来显示
		{
			wan: "10选8",
			value: 8
		},
		{
			wan: "10选7",
			value: 7
		},
		{
			wan: "10选6",
			value: 6
		},
		{
			wan: "10选5",
			value: 5
		},
	])
	//随机数
	const mathbum = (min, max, count) => {
		init()
		var arrone = common.GetRandomArray(min, max, count)
		var numlist = arrone;
		for (var i = 0; i <= numlist.length - 1; i++) {
			var newIndex=ballData.indexOf(numlist[i])
			queStlye[newIndex] = 1
			data.value.data[0].push(numlist[i])
		}
		isnote()
	}
	// 跨度注数字典
	const zidian =reactive([0,0,8,14,18,20,20,18,14,8])
	const isnote =()=>{
		
		var note=0
		
		for(var i=0;i<=data.value.data[0].length-1;i++){
			// 123
			note=note+zidian[data.value.data[0][i]]
			
		}
		data.value.note = note
		data.value.money = data.value.note*2
		data.value.data[0] = common.quickSort(data.value.data[0])
		Emits('datachange',data.value,'zu6_kuadufushi')
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
	
	.borderuu {
		display: flex;
		justify-content: center;
		align-items: center;
		border: #c2c2c2 1rpx solid;
		border-radius: 10rpx;
	}
	
	.anniu {
		width: 280rpx;
		height: 70rpx;
		border-radius: 10rpx;
		text-align: center;
		color: #4b4b4b;
		border: #c5c5c5 1rpx solid;
		margin: 20rpx 30rpx 20rpx 30rpx;
	}
</style>
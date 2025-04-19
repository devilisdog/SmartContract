<template>
	<!-- 内部分段器3 -->
	<view
		style="width: 710rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
		<view style="color: #9c9c9c;">
			<text>至少选<text style="color: red;">1</text>个和值</text>
		</view>
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu" @click="mathbum">
			<view style="font-size:18rpx;margin-top:5rpx;" >机选</view> 
		</view>
	</view>
	<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap;">
			<view v-for="itme,index in 26" @click="dianClick(index)" class="hezhi" style=""
				:style="queStlye[index] == 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
				<!-- 球 -->
				<text class="baiwei-text">{{itme}}</text>
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
		// nextTick
	} from 'vue';
	
	const Props = defineProps(['dele'])
	
	const Emits = defineEmits(['datachange'])
	
	onBeforeMount(() => {
		init()
	})
	
	watch(() => Props.dele, (oldval, newval) => {
		init()
	})
	
	const data =reactive({
	})
	const queStlye = reactive([])
	const init =()=>{
		var arr = {
			note:0,
			money:0,
			list:{
				0:[]
			}
		}
		data.value = arr 
		queStlye.splice(0, queStlye.length)
		for(var i=0;i<=25;i++){
			queStlye.push(0)
		}
	}
	const dianClick =(e)=>{
		if(queStlye[e]==0){
			queStlye[e]=1
			data.value.list[0].push(e+1)
			getnote()
			return
		}
		if(queStlye[e]==1){
			queStlye[e]=0
			var index = data.value.list[0].findIndex(item =>
				//console.log(item),
				item == e-1 // 11  11
			)
			// 删除掉里面的投注内容
			data.value.list[0].splice(index, 1)
			getnote()
			return
		}
	}
	
	const mathbum=()=>{
		init()
		var arrone = common.GetRandomArray(0, 27, 1)
		queStlye[arrone] = 1
		data.value.list[0].push(arrone[0]+1)
		
		
		getnote()
	}
	
	const zidian =reactive([1,2,2,4,5,6,8,10,11,13,14,14,15,15,14,14,13,11,10,8,6,5,4,2,2,1])
	
	const getnote =()=>{
		var note=0
		for(var i=0;i<=data.value.list[0].length-1;i++){
			// 123
			note=note+zidian[data.value.list[0][i]-1]
			
		}
		// console.log(note);
		data.note = note
		data.money = data.note*2
		data.value.list[0] = common.quickSort(data.value.list[0])
		Emits('datachange',data,'zuxuan_hezhi')
	}
	
	
	
</script>

<style>
	.hezhi{
		width: 65rpx;
		height: 65rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 65rpx;
		margin:10rpx 10rpx;
	}
</style>
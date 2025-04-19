<template>
	<!-- 内部分段器3 -->
	<view
		style="width: 710rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
		<view style="color: #9c9c9c;">
			<text>每位至少选<text style="color: red;">1</text>个号码，按位猜中即中</text>
			<text style="color:red;">1040</text>
			<text>元</text>
		</view>
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu" @click="mathbum">
			<view style="font-size:18rpx;margin-top:5rpx;" >机选</view> 
		</view>
	</view>
	<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap;">
			<view v-for="itme,index in 28" @click="dianClick(index)" class="hezhi" style=""
				:style="queStlye[index] == 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
				<!-- 球 -->
				<text class="baiwei-text">{{index}}</text>
			</view>
		</view>
	</view>
	<!-- 下划线 -->
	<view
		style="width: 720rpx;height: 2rpx;background-color: #f7f7f7;margin: auto;position: relative;top: 52%;">
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
	
	const data =reactive({})
	const queStlye = reactive([])
	const init =()=>{
		var arr = {
			note:0,
			money:0,
			list:{
				data:[]
			}
		}
		data.value = arr
		queStlye.splice(0, queStlye.length)
		for(var i=0;i<=27;i++){
			queStlye.push(0)
		}
	}
	const dianClick =(e)=>{
		if(queStlye[e]==0){
			queStlye[e]=1
			data.value.list.data.push(e)
			getnote()
			return
		}
		if(queStlye[e]==1){
			queStlye[e]=0
			var index = data.value.list.data.findIndex(item =>
				//console.log(item),
				item == e // 11  11
			)
			// 删除掉里面的投注内容
			data.value.list.data.splice(index, 1)
			getnote()
			return
		}
	}
	
	const mathbum=()=>{
		init()
		var arrone = common.GetRandomArray(0, 27, 1)
		queStlye[arrone] = 1
		data.value.list.data.push(arrone[0])
		getnote()
	}
	
	const getnote =()=>{
		var note=0
		for(var i=0;i<=data.value.list.data.length-1;i++){
			for(var o=0;o<=999;o++){
				var g = parseInt(o % 10); // 个位数
				var s = parseInt((o % 100) / 10); // 十位数
				var b = parseInt((o % 1000) / 100); // 百位数
				//console.log(b+s+g);
				if(b+s+g==data.value.list.data[i]){
					note=note+1
				}
			}
			
		}
		data.note = note
		data.money=data.note*2
		data.value.list.data = common.quickSort(data.value.list.data)
		Emits('datachange',data,"zhixuan_hezhi")
	}
	
	
	
</script>

<style>
	.hezhi {
		width: 65rpx;
		height: 65rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 65rpx;
		margin:10rpx 10rpx;
	}
</style>
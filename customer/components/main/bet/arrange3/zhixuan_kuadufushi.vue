<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
			<view style="color: #9c9c9c;">
				<text>至少选择<text style="color: red;">1</text>个跨度值</text>
			</view>
	</view>
	<!-- 直选复式-球 -->
	<view style="display: flex;width: 700rpx;justify-content: flex-end;position: relative;top: -42rpx;left: 26rpx;">
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu"
			@click="mathbum(0,10,1)">
			<view style="font-size:18rpx;">机选</view>
		</view>
	</view>
	<view
		style="display: flex; width: 550rpx;height: 230rpx;margin: auto;align-items: center;position: relative;left: 20rpx;margin-top: -50rpx;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
	
			<view v-for="itme,index in 10" @click="dianClick(index)" class="baiwei"
				:style="queStlye[index]==0?'background-color:#ffeded;color: #ff6262':'color:#fff;background-color: #ff6262;'">
				<!-- 球 -->
				<view v-show="queStlye[index] == 0 || queStlye[index] == 1" style="margin: auto;">
					<text style="font-size: 32rpx;line-height: 65rpx;">{{index}}</text>
				</view>
				<view v-show="queStlye[index] == 2" style="margin: auto;">
					<view
						style="display: flex;justify-content: center;align-items: center; flex-direction:column;line-height: 30rpx;">
						<text style="font-size: 32rpx;">{{index}}</text>
						<text>胆</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- <view style="width:150rpx;margin-left: 20rpx;">
		<text style="font-size:32rpx;color: #424242 ; ">快速选号</text>
	</view>
	<view style="display: flex;flex-wrap: wrap;margin-left:35rpx;margin-top:20rpx;">
		<view class="anniu" v-for="item,index in anniu" :key="item"
			@click="mathbum(0,10,item.value)"
			:style="data.value.data.length == item.value ? 'color:#fff;background-color: #ff6262;border:1rpx solid #ff6262;transition:0.2s;': ''"
			style="">
			<view style="padding-top: 10rpx;">
				<view style="" v-show=" data.value.data.length != item.value">
					<text style="margin-right: 15rpx;font-size:26rpx;">{{item.wan}}</text>
				</view>
	
				<view v-show="data.value.data.length == item.value">
					<view
						style="display: flex;justify-content: flex-end;position: relative;top: -10rpx;margin-bottom: -28rpx;">
						<view
							style="width: 50rpx;height: 28rpx;background:rgba(58, 58, 58, 0.6) ;border-radius: 0 10rpx 0 10rpx;">
							<text style="font-size: 15rpx;position: relative;top: -10rpx;">随机</text>
						</view>
					</view>
					<view>
						<text style="margin-right: 15rpx;font-size:26rpx;">{{item.wan}}</text>
					</view>
				</view>
			</view>
		</view>
	</view> -->
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
		for (var i = 0; i <= 10; i++) {
			queStlye.push(0)
		}
	}
	
	const dianClick = (e) => { //球的状态判断
		if (queStlye[e] == 0) {
			data.value.data[0].push(e)
			isnote()
			queStlye[e] = 1
			return
		}
		if (queStlye[e] == 1) {
			var index = data.value.data[0].findIndex(item =>
				//console.log(item),
				item == e // 11  11
			)
			// 删除掉里面的投注内容
			data.value.data[0].splice(index, 1)
			isnote()
			queStlye[e] = 0
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
			// console.log(Math.floor(Math.random() * 30))
			//var kk=Math.floor(Math.random() * 30+1);//取1-30的随机整数
			queStlye[numlist[i]] = 1
			data.value.data[0].push(numlist[i])
		}
		isnote()
	}
	
	
	const isnote =()=>{
		var note=0
		for(var i=0;i<=data.value.data[0].length-1;i++){
			for(var o=0;o<=999;o++){
				var g = parseInt(o % 10); // 个位数
				var s = parseInt((o % 100) / 10); // 十位数
				var b = parseInt((o % 1000) / 100); // 百位数
				var min = g //0
				var max = g
				if(s>=max){max=s}
				if(s<=min){min=s}
				if(b>=max){max=b}
				if(b<=min){min=b}
				//console.log(min,max);
				
				//console.log(b+s+g);
				if(max-min==data.value.data[0][i]){
					note=note+1
				}
			}
		}
		data.value.note = note
		data.value.money = data.value.note*2
		data.value.data[0] = common.quickSort(data.value.data[0])
		Emits('datachange',data.value,'zhixuan_kuadufushi')
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
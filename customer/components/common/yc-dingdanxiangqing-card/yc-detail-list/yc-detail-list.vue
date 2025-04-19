<template>
	<view class="list-head">
		<view>场次</view>
		<view>主队/客队</view>
		<view style="">投注内容</view>
		<view style="">赛果(全/半)</view>
	</view>
	
	<view v-for="itme in biaodan">
		<view class="body" style="display: flex;align-items: center;justify-content: center;">
			<view><text style="line-height: 140rpx;" >{{itme.name}}</text></view>
			<view class="body-one">
				<text>{{itme.shang}}</text><text style="color: #26ff00;">(-1)</text><br>
				<text>vs</text><br>
				<text>{{itme.xiao}}</text>
			</view>
			<view class="body-two">
				<text style="margin-top: 40rpx;">{{itme.neir}}</text>
				<text>{{itme.beilv}}</text>
				</view>
			<view class="body-3">
				<text style="line-height: 140rpx;">{{itme.saiguo}}</text>
				</view>
		</view>
		
		<view class="body02">
			<view><text style="line-height: 140rpx;" >{{itme.name}}</text></view>
			<view class="body-one">
				<text>{{itme.shang}}</text><text style="color: #26ff00;">(-1)</text><br>
				<text>vs</text><br>
				<text>{{itme.xiao}}</text>
			</view>
			<view class="body-two">
				<text style="margin-top: 40rpx;">{{itme.neir}}</text>
				<text>{{itme.beilv}}</text>
				</view>
			<view class="body-3">
				<text style="line-height: 140rpx;">{{itme.saiguo}}</text>
				</view>
		</view>
		
		
	</view>
</template>
<script setup>
	import {
		// onBeforeMount, 
		// onMounted,
		ref,
		reactive,
		// getCurrentInstance,
		// nextTick
	} from 'vue';
	
	
	const biaodan =reactive([
		{
		   name: "周二002",
		   shang: "伊拉克23",
		   xiao: "科威特23",
		   neir: "让胜",
		   beilv: "2.00",
		   bifen: "0:0",
		   saiguo: "-/-"
		  },{
		   name: "周二007",
		   shang: "伊拉克88",
		   xiao: "科威特90",
		   neir: "让负",
		   beilv: "2.00",
		   bifen: "0:0",
		   saiguo: "-/-"
		  },
	])
</script>


<style>
	.list-head {
		width: 660rpx;
		height: 30rpx;
		background-color: #f1f1f1;
		margin: auto;
		color: #acacac;
		font-size: 20rpx;
	}

	.list-head view {
		float: left;
		text-align: center;
		width: 165rpx;
		height: 30rpx;
	}
	.body {
		width: 660rpx;
		height: 150rpx;
		background-color: #fff ;
		display: flex;
		margin: auto;
		text-align: center;
		}
		.body view {
			width:165rpx;
			height: 140rpx;
			background-color: #ffffff;
		}
		.body-two text{
			margin-top: 10rpx;
			display: block;
			color: red ;
		}
	.body02{
		width: 660rpx;
		height: 150rpx;
		background-color: #fff ;
		display: flex;
		margin: auto;
		text-align: center;
	}
		.body02 view {
			width:165rpx;
			height: 140rpx;
			background-color: #ebebeb;
		}
</style>

<template>
	<view class="card">
		<view style="font-weight:600;margin:10rpx 0rpx;">
			<text style="font-size:32rpx;">彩票照片</text>
		</view>
		<view>
			<uni-file-picker
				ref="img"
				limit="3" 
				file-mediatype='image' 
				v-model="cacheImag"
				:readonly='true'/>
		</view>
	</view>
</template>

<script setup>
	import {useCounterStore} from '@/stores/counter'
	import {
		ref,
		onBeforeMount,
		onMounted,
		reactive,
		defineProps,
	} from 'vue';
	const Props=defineProps(['imgData'])
	const cacheImag=reactive([])
	const counter = useCounterStore(); //状态管理
	onBeforeMount(()=>{
		for(var i=0;i<Props.imgData.length;i++){
			var arr={//格式化数据
				"name":i+".jpg",
				"extname":"jpg",
				"url":counter.baseUrl+Props.imgData[i]
			}
			cacheImag.push(arr)
		}
	})
	const click=()=>{
		uni.previewImage({
			urls:['../../../../static/img/follow/R-C.jpg'],
			success(){
			},
			fail(){
			}
		})
	
	}
</script>

<style>
	.card{
		width:680rpx;
		padding:20rpx 20rpx;
		background-color: white;
		border-radius: 10rpx;
		margin: auto;
	}
</style>

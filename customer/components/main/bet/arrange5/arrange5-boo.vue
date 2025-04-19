<template>
	<view style="display: flex; width: 550rpx;height: 230rpx;margin: auto;margin-top: -50rpx;align-items: center;">
		<view style="display: flex; justify-content: flex-start;align-items: center;flex-wrap:wrap; height: 190rpx;">
			<view v-for="itme,index in 10" @click="dianClick(index)" class="baiwei"
			 :style="queStlye[index]== 0 ? 'color:#ff6262;background-color: #ffeded;' : 'color:#ffffff;background-color: #ff6262;' ">
				<!-- 球 -->
				<text class="baiwei-text">{{index}}</text>
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
		defineProps, // 接收
		defineEmits, // 发送
		watch,
		// nextTick
	} from 'vue';
	
	onBeforeMount(() => {
		init() //创建初始化
	})
	
	

	const emitss = defineEmits(['change'])
	const props = defineProps(['dele','isjixuan','Index'])
	
	const queStlye = reactive([])
	const init = () => { //初始化的需干什么
		queStlye.splice(0, queStlye.length)
		for (var i = 0; i <= 10; i++) {
			queStlye.push(0)
		}
	}
	
	watch(() => props.dele, (oldval, newval) => {
		init()
	})
	
	watch(() => props.isjixuan, (oldval, newval) => {
		init()
		var a = common.GetRandomArray(0, 9, 1)
		queStlye[a[0]]=1
		emitss('change',props.Index,a[0],true)
	})


	const dianClick = (e) => {//球的状态判断
	if(queStlye[e]==0){
		queStlye[e] = 1
		emitss('change',props.Index,e,true)
	}else{
		queStlye[e] = 0
		emitss('change',props.Index,e,false)
	}
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
</style>

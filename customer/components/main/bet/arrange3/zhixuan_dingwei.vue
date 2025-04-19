<template>
	<view style="width: 700rpx;margin:auto;display:flex;justify-content: space-between;margin-top: -30rpx;">
		<view style="color: #9c9c9c;margin-top: -5rpx;">
			<text>每位至少选<text style="color: red;">1</text>个号码，按位猜中即中</text>
			<text style="color:red;">1040</text>
			<text>元</text>
		</view>
		<view style="width:90rpx; height: 40rpx;text-align: center;" class="borderuu">
			<view style="font-size:18rpx;margin-top:5rpx;" @click="jianting_click()">机选</view>
		</view>
	</view>
	<!-- 直选-直选定位 -->
	<view v-for="itme,index in wei">
		<text style="font-size: 30rpx;position: relative;top: 35rpx;left: 30rpx;color: #4a4a4a;">{{itme}} :</text>
		<view style="margin-left: 20rpx;">
		<arrange3boo :dele="Props.dele" @fason='jiesou' :ZhiXuanIndex = 'index' :watchdata='jianting' :isjixuan='isjixuan'></arrange3boo>
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
	
	const wei = reactive(['百位','十位','个位'])
	// 通过监听变化来传值
	
	onBeforeMount(() => {
		init()
	})
	const data = reactive({})
	const init=()=>{
		var arr = {
			note:0,
			money:0,
			data:{
				0:[],
				1:[],
				2:[]
			}
		}
		data.value = arr
	}
	// 机选按钮
	const isjixuan = ref(false)
	const jianting = ref(false)
	const jianting_click = ()=>{
		init()
		// function getRandomInteger(min, max) {
		//   return Math.floor(Math.random() * (max - min + 1) + min);
		// }
		// data.value.data[0].push(getRandomInteger(0,9))
		// data.value.data[1].push(getRandomInteger(0,9))
		// data.value.data[2].push(getRandomInteger(0,9))
		// console.log('定位',data.value.data);
		// var a = common.NoteCompute([data.value.data[0].length,data.value.data[1].length,data.value.data[2].length],3)
		// data.value.note=a
		// data.value.money=a*2
		// for(var i = 0 ; i < 3 ; i++){
		// 	data.value.data[i] = common.quickSort(data.value.data[i])
		// }
		
		jianting.value = !jianting.value
	}
	
	watch(()=>Props.dele,(oldval,newval)=>{
		init()
	})
	const jiesou =(e,ZhiXuanIndex,bool,is_jixuan)=>{
		//console.log(e,ZhiXuanIndex,bool,is_jixuan);
		if(is_jixuan==true){
			if(ZhiXuanIndex == 0){data.value.data[0]=e}
			if(ZhiXuanIndex == 1){data.value.data[1]=e}
			if(ZhiXuanIndex == 2){data.value.data[2]=e}
		}else{
			if(bool==true){
				if(ZhiXuanIndex == 0){data.value.data[0].push(e)}
				if(ZhiXuanIndex == 1){data.value.data[1].push(e)}
				if(ZhiXuanIndex == 2){data.value.data[2].push(e)}
			}else{
				if(ZhiXuanIndex == 0){
					var index = data.value.data[0].findIndex(item =>item == e)
					data.value.data[0].splice(index, 1)
				}
				if(ZhiXuanIndex == 1){
					var index = data.value.data[1].findIndex(item =>item == e)
					data.value.data[1].splice(index, 1)
				}
				if(ZhiXuanIndex == 2){
					var index = data.value.data[2].findIndex(item =>item == e)
					data.value.data[2].splice(index, 1)
				}
				
			}
		}

		var a = common.NoteCompute([data.value.data[0].length,data.value.data[1].length,data.value.data[2].length],3)
		data.value.note=a
		data.value.money=a*2
		for(var i = 0 ; i < 3 ; i++){
			data.value.data[i] = common.quickSort(data.value.data[i])
		}
		Emits('datachange',data.value,'zhixuan_dingwei')
		//console.log(data,1);
	}
</script>

<style>
</style>
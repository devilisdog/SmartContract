<template>
	<view class="big_box">
		<view class="reduce_box" @click="change('reduce')">-</view>
		<view class="input_box">
			<uni-easyinput 
				:inputBorder="false" 
				:clearable="false" 
				type="number" 
				:styles="{color:'#fff',textAlign:'center'}" 
				@input="change"
				:value="inputValue"
				:disabled="disabledValue"
				class="uni-input"
				:cursorSpacing="0"
				>
			</uni-easyinput>
		</view>
		<view class="add_box" @click="change('add')">+</view>
	</view>
	
</template>

<script setup>
	import {ref,reactive,defineProps,defineEmits,onBeforeMount} from 'vue';
	const disabledValue=ref(false)
	const Emits=defineEmits(['numberChange'])
	const Props=defineProps({
		maxValue:{
			default:100,
			type:Number
		},
		minValue:{
			default:0,
			type:Number
		},
		defaultValue:{
			default:0,
			type:Number
		},
	})
	const inputValue=ref(50)
	onBeforeMount(()=>{
		if(Props.defaultValue){
			inputValue.value=Props.defaultValue
		}
	})
	const change=(type)=>{
		if(type=='add'){
			if(inputValue.value>Props.maxValue){
				Emits('numberChange',inputValue.value)
				return
			}
			inputValue.value++
			Emits('numberChange',inputValue.value)
		}else if(type=='reduce'){
			if(inputValue.value<=Props.minValue){
				Emits('numberChange',inputValue.value)
				return
			}
			inputValue.value--
			Emits('numberChange',inputValue.value)
		}else{
			inputValue.value=type
			if(!isInteger(inputValue.value)){
				setTimeout(()=>{
					inputValue.value=Number(inputValue.value).toFixed(0)
					Emits('numberChange',inputValue.value)
				},200)
			}
			Emits('numberChange',inputValue.value)
		}
	}
	function isInteger(obj) {//判断是否为整数
		return obj%1 === 0
	}
</script>

<style>
	.input_box{
		width:95rpx;
		color:white;
		background-color:#bcbcbc;
		margin:0rpx 5rpx;
		height:60rpx;
		border-radius:5rpx;
		display: flex;
		align-items: center;
		font-weight:bold;
	}
	.big_box{
		display: flex;
		align-items: center;
	}
	.reduce_box{
		width:60rpx;
		height:60rpx;
		background-color: #bcbcbc;
		text-align: center;
		border-radius:5rpx;
		color:white;
		font-weight: bold;
		line-height:60rpx;
	}
	.add_box{
		width:60rpx;
		height:60rpx;
		background-color: #bcbcbc;
		text-align: center;
		border-radius:5rpx;
		color:white;
		font-weight: bold;
		line-height:60rpx;
	}
</style>

<template>
	<view class="statusBar"></view>
	<hemaiCard @close='close' :Hemaidata='counter.skipDetails' :index="1"></hemaiCard>
</template>

<script setup>
	import hemaiCard from "@/components/common/yc-hemai-card/yc-hemai-card.vue"
	import { useCounterStore } from '@/stores/counter'
	const counter = useCounterStore(); //状态管理
	import {
		onBeforeMount,
		onMounted,
		ref,
		reactive,
		defineProps, // 接收
		defineEmits, // 发送
		getCurrentInstance, //获取当前组件的实例
		// nextTick
	} from 'vue';
	const props = defineProps(['openData'])
	const emits = defineEmits(['close2'])
	
	const close = () =>{
		setTimeout(()=>{
			counter.skipDetails=[]
		},300)
		emits('close2')
		uni.navigateBack()
	}
</script>

<style>
	.statusBar{
		width:100%;
		height: var(--status-bar-height);
		background-color: white;
	}
</style>
